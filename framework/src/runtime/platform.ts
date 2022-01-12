import {
  Resource,
  Record,
  Records,
  Runtime,
  RegisteredFunctions,
} from "../types";

import type {
  ConnectorConfig,
  CreateConnectorRequest,
  ConnectorResponse,
  MeroxaJS,
  ResourceResponse,
} from "meroxa-js";

export class PlatformRuntime implements Runtime {
  registeredFunctions: RegisteredFunctions = {};
  client: MeroxaJS;

  constructor(meroxaJS: MeroxaJS) {
    this.client = meroxaJS;
  }

  async resources(resourceName: string): Promise<Resource> {
    const resource: ResourceResponse = await this.client.getResource(
      resourceName
    );
    return new PlatformResource(resource, this.client);
  }

  async process(
    records: Records,
    fn: (rr: Record[]) => Record[]
  ): Promise<Records> {
    this.registeredFunctions[fn.name] = fn;
    // TODO deploy function, etc. etc.
    console.log(`deploying function: ${fn.name}`);

    return records;
  }
}

class PlatformResource implements Resource {
  resource: ResourceResponse;
  client: MeroxaJS;

  constructor(resource: ResourceResponse, client: MeroxaJS) {
    this.resource = resource;
    this.client = client;
  }

  async records(collection: string): Promise<Records> {
    console.log(
      `creating source connector from resource ${this.resource.name}...`
    );

    const connectorConfig: ConnectorConfig = {
      // Hardcode hack this will only work for pg resources with default schema
      input: `public.${collection}`,
    };

    const connectorInput: CreateConnectorRequest = {
      // Yep you guessed it, another hardcode hack
      name: "a-source",
      config: connectorConfig,
      metadata: {
        "mx:connectorType": "source",
      },
      resource_id: this.resource.id,
      pipeline_name: "default",
      pipeline_id: null,
    };

    let connectorResponse: ConnectorResponse;
    try {
      connectorResponse = await this.client.createConnector(connectorInput);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response);
      }
      throw error;
    }

    if (typeof connectorResponse.streams.output === "object") {
      return {
        stream: connectorResponse.streams.output[0],
        records: [],
      };
    } else {
      throw new Error("no output stream in response");
    }
  }

  async write(records: Records, collection: string): Promise<void> {
    console.log(
      `creating destination connector from stream ${records.stream}...`
    );

    const connectorConfig: ConnectorConfig = {
      input: records.stream,
    };

    const connectorInput: CreateConnectorRequest = {
      name: "a-destination",
      config: connectorConfig,
      metadata: {
        "mx:connectorType": "destination",
      },
      resource_id: this.resource.id,
      pipeline_name: "default",
      pipeline_id: null,
    };

    await this.client.createConnector(connectorInput);
  }
}
