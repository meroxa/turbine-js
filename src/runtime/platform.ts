import {
  Resource,
  Record,
  Records,
  Runtime,
  RegisteredFunctions,
} from "./types";

import {
  Client,
  ResourceResponse,
  ConnectorConfig,
  CreateConnectorParams,
  ConnectorResponse,
  CreateFunctionParams,
  FunctionResponse,
} from "meroxa-js";

export class PlatformRuntime implements Runtime {
  registeredFunctions: RegisteredFunctions = {};
  client: Client;
  imageName: string;

  constructor(meroxaJS: Client, imageName: string) {
    this.client = meroxaJS;
    this.imageName = imageName;
  }

  async resources(resourceName: string): Promise<Resource> {
    const resource = await this.client.resources.get(resourceName);

    return new PlatformResource(resource, this.client);
  }

  async process(
    records: Records,
    fn: (rr: Record[]) => Record[]
  ): Promise<Records> {
    this.registeredFunctions[fn.name] = fn;
    const functionInput: CreateFunctionParams = {
      input_stream: records.stream,
      command: ["node"],
      args: ["index.js", fn.name],
      image: this.imageName,
      pipeline: {
        name: "default",
      },
      env_vars: {},
    };
    console.log(`deploying function: ${fn.name}`);
    console.log(functionInput);

    try {
      const createdFunction: FunctionResponse =
        await this.client.functions.create(functionInput);
      records.stream = createdFunction.output_stream;

      return records;
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
      }
      throw error;
    }
  }
}

class PlatformResource implements Resource {
  resource: ResourceResponse;
  client: Client;

  constructor(resource: ResourceResponse, client: Client) {
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

    const connectorInput: CreateConnectorParams = {
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
      connectorResponse = await this.client.connectors.create(connectorInput);
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

    const connectorInput: CreateConnectorParams = {
      name: "a-destination",
      config: connectorConfig,
      metadata: {
        "mx:connectorType": "destination",
      },
      resource_id: this.resource.id,
      pipeline_name: "default",
      pipeline_id: null,
    };

    await this.client.connectors.create(connectorInput);
  }
}
