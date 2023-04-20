import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import process from "process";
import util from "util";

import { ProtoGrpcType } from "../proto_types/turbine";
import { TurbineServiceClient } from "../proto_types/turbine_core/TurbineService";
import { Resource } from "../proto_types/turbine_core/Resource";
import { Collection } from "../proto_types/turbine_core/Collection";
import { Record } from "../proto_types/turbine_core/Record";
import { BaseError, assertIsError } from "../errors";

export async function initServer(gitSHA: string) {
  const protoPath = path.join(__dirname, "../..", "proto/turbine.proto");
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

  const turbinePkgJSON = await import(
    path.join(__dirname, "../..", "package.json")
  );
  const appPkgJSON = await import(path.join(process.cwd(), "app.json"));

  const init = util.promisify(coreServer.Init);

  await init({
    appName: appPkgJSON.name,
    configFilePath: process.cwd(),
    language: "JAVASCRIPT",
    gitSHA,
    turbineVersion: turbinePkgJSON.version,
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
    records: Collection,
    fn: (rr: Record[]) => Record[]
  ): Promise<Collection> {
    const addProcessToCollection = util.promisify(
      this.coreServer.AddProcessToCollection
    );

    let collectionOutput;

    try {
      collectionOutput = addProcessToCollection({
        process: { name: fn.name },
        collection: records,
      });
    } catch (e) {
      assertIsError(e);
      throw new BaseError("grpc error:", e);
    }

    return collectionOutput as Collection;
  }

  async registerSecrets(secrets: string | string[]): Promise<void> {
    const registerSecret = util.promisify(this.coreServer.RegisterSecret);

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
  ): Promise<Collection> {
    let cfgs: { field: string; value: string }[] = [];
    if (connectorConfig) {
      cfgs = Object.keys(connectorConfig).map((key) => {
        return {
          field: key,
          value: connectorConfig[key],
        };
      });
    }

    const readCollection = util.promisify(this.app.coreServer.ReadCollection);

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

    return collectionOutput as Collection;
  }

  async write(
    records: Collection,
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

    const writeCollection = util.promisify(
      this.app.coreServer.WriteCollectionToResource
    );

    try {
      await writeCollection({
        resource: this.resource,
        sourceCollection: records,
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
