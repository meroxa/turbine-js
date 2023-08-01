import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import process from "process";
import util from "util";

import { ProtoGrpcType } from "../proto_types/turbine";
import { TurbineServiceClient } from "../proto_types/turbine_core/TurbineService";
import { Resource } from "../proto_types/turbine_core/Resource";
import { Collection__Output } from "../proto_types/turbine_core/Collection";
import { Records, RecordsArray } from "../function/records";
import { BaseError, assertIsError } from "../errors";
import { collectionToRecords, recordsToCollection } from "./utils";

export async function getTurbinePkgVersion() {
  const turbinePkgJSON = await import(
    path.resolve(__dirname, "..", "..", "package.json")
  );

  return turbinePkgJSON.version;
}

export async function initServer(gitSHA: string) {
  const protoPath = path.resolve(
    __dirname,
    "..",
    "..",
    "proto",
    "turbine.proto"
  );
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    defaults: true,
  });

  const proto = grpc.loadPackageDefinition(
    packageDefinition
  ) as unknown as ProtoGrpcType;

  const coreServer = new proto.turbine_core.TurbineService(
    process.env["TURBINE_CORE_SERVER"] as string,
    grpc.credentials.createInsecure()
  );

  const turbinePkgVersion = await getTurbinePkgVersion();
  const appPkgJSON = await import(path.join(process.cwd(), "app.json"));

  const init = util.promisify(coreServer.Init).bind(coreServer);

  await init({
    appName: appPkgJSON.name,
    configFilePath: process.cwd(),
    language: "JAVASCRIPT",
    gitSHA,
    turbineVersion: turbinePkgVersion,
  });

  return new TurbineApp(coreServer);
}

class TurbineApp {
  coreServer: TurbineServiceClient;

  constructor(coreServer: TurbineServiceClient) {
    this.coreServer = coreServer;
  }

  async resources(resourceName: string): Promise<TurbineResource> {
    let resource;

    try {
      resource = await new Promise((resolve, reject) => {
        this.coreServer.GetResource({ name: resourceName }, (err, resource) => {
          if (err) {
            reject(err);
          } else {
            resolve(new TurbineResource(resource as Resource, this));
          }
        });
      });
    } catch (e) {
      assertIsError(e);
      throw new BaseError("grpc error:", e);
    }

    return resource as TurbineResource;
  }

  async process(
    records: Records,
    fn: (rr: RecordsArray) => Promise<RecordsArray>
  ): Promise<Records> {
    const addProcessToCollection = util
      .promisify(this.coreServer.AddProcessToCollection)
      .bind(this.coreServer);

    let collectionOutput;

    try {
      collectionOutput = await addProcessToCollection({
        process: { name: fn.name },
        collection: recordsToCollection(records),
      });
    } catch (e) {
      assertIsError(e);
      throw new BaseError("grpc error:", e);
    }

    const recordsOutput = collectionToRecords(
      collectionOutput as Collection__Output
    );

    if (!process.env.IS_RECORDING) {
      recordsOutput.records = await fn(recordsOutput.records);
    }

    return recordsOutput;
  }

  async registerSecrets(secrets: string | string[]): Promise<void> {
    const registerSecret = util
      .promisify(this.coreServer.RegisterSecret)
      .bind(this.coreServer);

    for (const secret of [secrets].flat()) {
      if (!process.env[secret]) {
        throw new Error(`secret ${secret} is not an environment variable`);
      }
      try {
        await registerSecret({
          name: secret,
          value: process.env[secret],
        });
      } catch (e) {
        assertIsError(e);
        throw new BaseError("grpc error:", e);
      }
    }
  }
}

class TurbineResource {
  resource: Resource;
  app: TurbineApp;

  constructor(resource: Resource, app: TurbineApp) {
    this.resource = resource;
    this.app = app;
  }

  async records(
    collection: string,
    connectorConfig: { [index: string]: string }
  ): Promise<Records> {
    let cfgs: { field: string; value: string }[] = [];
    if (connectorConfig) {
      cfgs = Object.keys(connectorConfig).map((key) => {
        return {
          field: key,
          value: connectorConfig[key],
        };
      });
    }

    const readCollection = util
      .promisify(this.app.coreServer.ReadCollection)
      .bind(this.app.coreServer);

    let collectionOutput;
    try {
      collectionOutput = await readCollection({
        resource: this.resource,
        collection,
        configs: {
          config: cfgs,
        },
      });
    } catch (e) {
      assertIsError(e);
      throw new BaseError("grpc error:", e);
    }

    return collectionToRecords(collectionOutput as Collection__Output);
  }

  async write(
    records: Records,
    collection: string,
    connectorConfig: { [index: string]: string } = {}
  ): Promise<void> {
    let cfgs: { field: string; value: string }[] = [];
    if (connectorConfig) {
      cfgs = Object.keys(connectorConfig).map((key) => {
        return {
          field: key,
          value: connectorConfig[key],
        };
      });
    }

    const writeCollection = util
      .promisify(this.app.coreServer.WriteCollectionToResource)
      .bind(this.app.coreServer);

    try {
      await writeCollection({
        resource: this.resource,
        sourceCollection: recordsToCollection(records),
        targetCollection: collection,
        configs: {
          config: cfgs,
        },
      });
    } catch (e) {
      assertIsError(e);
      throw new BaseError("grpc error:", e);
    }
  }
}
