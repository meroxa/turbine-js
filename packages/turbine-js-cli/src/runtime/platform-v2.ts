import { Records, RecordsArray } from "./types";

export class PlatformV2Runtime {
  registeredResources: PlatformV2Resource[] = [];
  registeredFunctions: PlatformV2Function[] = [];
  registeredSecrets: { [index: string]: string }[] = [];

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

  get definition() {
    return {
      app_name: this.appName,
      git_sha: this.headCommit,
      metadata: {
        turbine: {
          language: "js",
          version: this.version,
        },
        spec_version: this.spec,
      },
    };
  }

  resources(resourceName: string): PlatformV2Resource {
    const resource = new PlatformV2Resource(resourceName);
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
      this.imageName
    );
    this.registeredFunctions.push(funktion);

    const envVarsKeys = Object.keys(envVars);
    if (envVarsKeys.length > 0) {
      this.registeredSecrets = envVarsKeys.map((key) => {
        return {
          [key]: envVars[key],
        };
      });
    }
  }

  serializeToIR() {
    return {
      connectors: this.registeredResources.map((resource) =>
        resource.serializeToIR()
      ),
      functions: this.registeredFunctions.map((funktion) =>
        funktion.serializeToIR()
      ),
      secrets: this.registeredSecrets,
      definition: this.definition,
    };
  }
}

export class PlatformV2Function {
  name: string;
  image: string;

  constructor(name: string, headCommit: string, image: string) {
    this.name = `${name}-${headCommit.substring(0, 8)}`;
    this.image = image;
  }

  serializeToIR(): { name: string; image: string } {
    return { ...this };
  }
}

export class PlatformV2Resource {
  resource: string;
  type: "source" | "destination" | undefined;
  collection: string | undefined;
  config: { [index: string]: unknown } | undefined;

  constructor(resource: string) {
    this.resource = resource;
  }

  records(
    collection: string,
    connectorConfig: { [index: string]: unknown } = {}
  ): void {
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
    this.type = "destination";
    this.collection = collection;
    if (Object.keys(connectorConfig).length > 0) {
      this.config = connectorConfig;
    }
  }

  serializeToIR(): {
    resource: string;
    type: "source" | "destination" | undefined;
    collection: string | undefined;
    config: { [index: string]: unknown } | undefined;
  } {
    return { ...this };
  }
}
