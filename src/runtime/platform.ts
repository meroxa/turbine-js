import {
  Resource,
  Record,
  Records,
  RecordsArray,
  Runtime,
  AppConfig,
} from "./types";

import {
  Client,
  ResourceResponse,
  ConnectorConfig,
  CreateConnectorParams,
  ConnectorResponse,
  CreateFunctionParams,
  FunctionResponse,
  PipelineResponse,
} from "@meroxa/meroxa-js";

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

  async #createPipeline(): Promise<PipelineResponse> {
    const pipelineName = this.appConfig.pipeline;

    console.log(`No pipeline found, creating a new pipeline: ${pipelineName}`);

    try {
      return await this.client.pipelines.create({
        name: pipelineName,
        metadata: { turbine: true, app: this.appConfig.name },
      });
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

  async #findOrCreatePipeline(): Promise<PipelineResponse> {
    try {
      return await this.client.pipelines.get(this.appConfig.pipeline);
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        return await this.#createPipeline();
      }

      if (e.response) {
        throw new APIError(e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }
  }

  async resources(resourceName: string): Promise<PlatformResource> {
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
      name: fn.name,
      input_stream: records.stream,
      command: ["node"],
      args: ["index.js", fn.name],
      image: this.imageName,
      pipeline: {
        name: this.appConfig.pipeline,
      },
      env_vars: envVars,
    };

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

  async records(
    collection: string,
    connectorConfig: { [index: string]: string } = {}
  ): Promise<Records> {
    const baseCfg: ConnectorConfig = {
      input: collection,
    };

    connectorConfig = Object.assign(baseCfg, connectorConfig);

    const connectorInput: CreateConnectorParams = {
      config: connectorConfig as ConnectorConfig,
      metadata: {
        "mx:connectorType": "source",
      },
      resource_id: this.resource.id,
      pipeline_name: this.appConfig.pipeline,
      pipeline_id: null,
    };

    let connectorResponse: ConnectorResponse;
    try {
      console.log(
        `Creating source connector from source '${this.resource.name}'`
      );
      connectorResponse = await this.client.connectors.create(connectorInput);
      console.log(`Successfully created ${connectorResponse.name} connector`);
    } catch (e: any) {
      if (e.response) {
        throw new APIError(
          `error creating source for source: ${this.resource.name}`,
          e
        );
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }

    if (typeof connectorResponse.streams.output === "object") {
      return {
        stream: connectorResponse.streams.output[0],
        records: new RecordsArray(),
      };
    } else {
      throw new BaseError("no output stream in response");
    }
  }

  async write(
    records: Records,
    collection: string,
    connectorConfig: { [index: string]: string } = {}
  ): Promise<void> {
    const baseCfg: ConnectorConfig = {
      input: records.stream,
    };

    // Do not allow overwriting of `input` for destination connectors
    connectorConfig = Object.assign(connectorConfig, baseCfg);

    switch (this.resource.type) {
      case "redshift":
      case "postgres":
      case "mysql":
      case "sqlserver":
        connectorConfig["table.name.format"] = collection.toLowerCase();
        break;
      case "mongodb":
        connectorConfig["collection"] = collection.toLowerCase();
        break;
      case "s3":
        connectorConfig["aws_s3_prefix"] = `${collection.toLowerCase()}/`;
        break;
      case "snowflakedb":
        let regexp = /^[a-zA-Z]{1}[a-zA-Z0-9_]*$/;
        let isCollectionNameValid = regexp.test(collection);
        if (!isCollectionNameValid) {
          throw new BaseError(
            `snowflake destination connector cannot be configured with collection name ${collection}. Only alphanumeric characters and underscores are valid.`
          );
        }

        connectorConfig[
          "snowflake.topic2table.map"
        ] = `${records.stream}:${collection}`;
        break;
    }

    const connectorInput: CreateConnectorParams = {
      config: connectorConfig as ConnectorConfig,
      metadata: {
        "mx:connectorType": "destination",
      },
      resource_id: this.resource.id,
      pipeline_name: this.appConfig.pipeline,
      pipeline_id: null,
    };

    try {
      console.log(
        `Creating destination connector from stream '${records.stream}'`
      );
      let connectorResponse = await this.client.connectors.create(
        connectorInput
      );
      console.log(`Successfully created ${connectorResponse.name} connector`);
    } catch (e: any) {
      if (e.response) {
        throw new APIError(
          `Error creating destination from stream '${records.stream}'`,
          e
        );
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }
  }
}
