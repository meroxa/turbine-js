import { BaseError } from "../errors";
import { Records, RecordsArray } from "./types";

export class PlatformV2Runtime {
  registeredResources: PlatformV2Resource[] = [];
  registeredFunctions: PlatformV2Function[] = [];
  registeredSecrets: { [index: string]: string } = {};

  appName: string;
  imageName: string;
  headCommit: string;
  version: string;
  spec: string;

  constructor(
    imageName: string,
    appName: string,
    headCommit: string,
    version: string,
    spec: string
  ) {
    this.imageName = imageName;
    this.appName = appName;
    this.headCommit = headCommit;
    this.version = version;
    this.spec = spec;
  }

  get metadata() {
    return {
      turbine: {
        language: "js",
        version: this.version,
      },
    };
  }

  get hasSource() {
    return this.registeredResources.find((resource) => {
      return resource.type === "source";
    });
  }

  resources(resourceName: string): PlatformV2Resource {
    const resource = new PlatformV2Resource(resourceName, this);
    this.registeredResources.push(resource);
    return resource;
  }

  process(
    records: Records,
    fn: (rr: RecordsArray) => RecordsArray,
    envVars: { [index: string]: string } = {}
  ): void {
    const funktion = new PlatformV2Function(
      fn.name,
      this.headCommit,
      this.imageName,
      envVars
    );
    this.registeredFunctions.push(funktion);

    const envVarsKeys = Object.keys(envVars);
    if (envVarsKeys.length > 0) {
      this.registeredSecrets = Object.assign({}, envVars);
    }
  }

  serializeToDeployment() {
    return {
      git_sha: this.headCommit,
      spec_version: this.spec,
      spec: {
        connectors: this.registeredResources.map((resource) =>
          resource.serializeToDeployment()
        ),
        functions: this.registeredFunctions.map((funktion) =>
          funktion.serializeToDeployment()
        ),
        metadata: this.metadata,
      },
    };
  }
}

export class PlatformV2Function {
  name: string;
  image: string;
  env_vars: { [index: string]: string } = {};

  constructor(
    name: string,
    headCommit: string,
    image: string,
    envVars: { [index: string]: string }
  ) {
    this.name = `${name}-${headCommit.substring(0, 8)}`;
    this.image = image;
    this.env_vars = envVars;
  }

  serializeToDeployment(): {
    name: string;
    image: string;
    env_vars: { [index: string]: string };
  } {
    return { ...this };
  }
}

export class PlatformV2Resource {
  resource: string;
  runtime: PlatformV2Runtime;
  type: "source" | "destination" | undefined;
  collection: string | undefined;
  config: { [index: string]: unknown } | undefined;

  constructor(resource: string, runtime: PlatformV2Runtime) {
    this.resource = resource;
    this.runtime = runtime;
  }

  records(
    collection: string,
    connectorConfig: { [index: string]: unknown } = {}
  ): void {
    if (!collection) {
      throw new BaseError(
        "A collection name is required when calling .records()"
      );
    }

    if (this.runtime.hasSource) {
      throw new BaseError(
        "Only one call to .records() is allowed per Meroxa Data Application"
      );
    }
    this.type = "source";
    this.collection = collection;
    if (Object.keys(connectorConfig).length > 0) {
      this.config = connectorConfig;
    }
  }

  write(
    records: Records,
    collection: string,
    connectorConfig: { [index: string]: unknown } = {}
  ): void {
    if (!collection) {
      throw new BaseError(
        "A collection name is required when calling .write()"
      );
    }

    this.type = "destination";
    this.collection = collection;
    if (Object.keys(connectorConfig).length > 0) {
      this.config = connectorConfig;
    }
  }

  serializeToDeployment(): {
    resource: string;
    type: "source" | "destination" | undefined;
    collection: string | undefined;
    config: { [index: string]: unknown } | undefined;
  } {
    const { resource, type, collection, config } = this;
    return { resource, type, collection, config };
  }
}
