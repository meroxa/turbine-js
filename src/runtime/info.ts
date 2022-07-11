import { AppConfig, Records, RecordsArray, RegisteredFunctions } from "./types";

export class InfoRuntime {
  registeredFunctions: RegisteredFunctions = {};
  registeredResources: string[] = [];
  pathToDataApp: string;
  appConfig: AppConfig;

  constructor(pathToDataApp: string, appConfig: AppConfig) {
    this.pathToDataApp = pathToDataApp;
    this.appConfig = appConfig;
  }

  get functionsList(): string[] {
    return Object.keys(this.registeredFunctions);
  }

  get pipelineName(): string {
    return `turbine-pipeline-${this.appConfig.name}`;
  }

  get resourcesList(): string[] {
    return this.registeredResources;
  }

  resources(resourceName: string): InfoResource {
    this.registeredResources.push(resourceName);
    return new InfoResource();
  }

  process(records: Records, fn: (rr: RecordsArray) => RecordsArray): void {
    this.registeredFunctions[fn.name] = fn;
  }
}

class InfoResource {
  records(collection: string): void {}
  write(records: Records, collection: string): void {}
}
