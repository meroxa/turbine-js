import { Resource, Record, Records, Runtime, AppConfig } from "./types";

import {
  Client,
  ResourceResponse,
  ConnectorConfig,
  CreateConnectorParams,
  ConnectorResponse,
  CreateFunctionParams,
  FunctionResponse,
  PipelineResponse,
} from "meroxa-js";

import { BaseError, APIError } from "../errors";

export class PlatformRuntime implements Runtime {
  client: Client;
  imageName: string;
  appConfig: AppConfig;

  constructor(meroxaJS: Client, imageName: string, appConfig: AppConfig) {
    this.client = meroxaJS;
    this.imageName = imageName;
    this.appConfig = appConfig;
    this.#validateAppConfig();
    this.#setAppConfigPipeline();
  }

  #validateAppConfig(): void {
    if (!this.appConfig.name) {
      throw new BaseError(
        "application `name` is required to be specified in your app.json"
      );
    }
  }

  #setAppConfigPipeline(): void {
    if (!this.appConfig.pipeline) {
      this.appConfig.pipeline = `turbine-pipeline-${this.appConfig.name}`;
    }
  }

  async #findOrCreatePipeline(): Promise<PipelineResponse> {
    let pipeline;
    try {
      pipeline = await this.client.pipelines.get(this.appConfig.pipeline);
      console.log(`pipeline: "${pipeline.name}" ("${pipeline.uuid}")`);
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        pipeline = await this.client.pipelines.create({
          name: this.appConfig.pipeline,
          metadata: {
            turbine: true,
            app: this.appConfig.name,
          },
        });
        console.log(`pipeline: "${pipeline.name}" ("${pipeline.uuid}")`);
      }

      if (e.response) {
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }

    return pipeline;
  }

  async resources(resourceName: string): Promise<Resource> {
    await this.#findOrCreatePipeline();

    let resource;
    try {
      resource = await this.client.resources.get(resourceName);
    } catch (e: any) {
      if (e.response) {
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }

    return new PlatformResource(resource, this.client, this.appConfig);
  }

  async process(
    records: Records,
    fn: (rr: Record[]) => Record[],
    envVars: { [index: string]: string }
  ): Promise<Records> {
    const functionInput: CreateFunctionParams = {
      input_stream: records.stream,
      command: ["node"],
      args: ["index.js", fn.name],
      image: this.imageName,
      pipeline: {
        name: this.appConfig.name,
      },
      env_vars: envVars,
    };
    console.log(`deploying function: ${fn.name}`);

    try {
      const createdFunction: FunctionResponse =
        await this.client.functions.create(functionInput);
      records.stream = createdFunction.output_stream;

      return records;
    } catch (e: any) {
      if (e.response) {
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }
  }
}

class PlatformResource implements Resource {
  resource: ResourceResponse;
  client: Client;
  appConfig: AppConfig;

  constructor(
    resource: ResourceResponse,
    client: Client,
    appConfig: AppConfig
  ) {
    this.resource = resource;
    this.client = client;
    this.appConfig = appConfig;
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
      pipeline_name: this.appConfig.name,
      pipeline_id: null,
    };

    let connectorResponse: ConnectorResponse;
    try {
      connectorResponse = await this.client.connectors.create(connectorInput);
    } catch (e: any) {
      if (e.response) {
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }

    if (typeof connectorResponse.streams.output === "object") {
      return {
        stream: connectorResponse.streams.output[0],
        records: [],
      };
    } else {
      throw new BaseError("no output stream in response");
    }
  }

  async write(records: Records, collection: string): Promise<void> {
    console.log(
      `creating destination connector from stream ${records.stream}...`
    );

    const connectorConfig: ConnectorConfig = {
      input: records.stream,
    };

    switch (this.resource.type) {
      case "redshift":
      case "postgres":
      case "mysql":
        break;
      case "s3":
        connectorConfig["aws_s3_prefix"] = `${collection.toLowerCase()}/`;
        connectorConfig["value.converter"] =
          "org.apache.kafka.connect.json.JsonConverter";
        connectorConfig["value.converter.schemas.enable"] = "true";
        connectorConfig["format.output.type"] = "jsonl";
        connectorConfig["format.output.envelope"] = "true";
        break;
    }

    const connectorInput: CreateConnectorParams = {
      name: "a-destination",
      config: connectorConfig,
      metadata: {
        "mx:connectorType": "destination",
      },
      resource_id: this.resource.id,
      pipeline_name: this.appConfig.name,
      pipeline_id: null,
    };

    try {
      await this.client.connectors.create(connectorInput);
    } catch (e: any) {
      if (e.response) {
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }
  }
}
