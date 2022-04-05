import { AppConfig, Record, Records, RegisteredFunctions } from "./types";

export class InfoRuntime {
  registeredFunctions: RegisteredFunctions = {};
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

  resources(resourceName: string): InfoResource {
    return new InfoResource();
  }

  process(records: Records, fn: (rr: Record[]) => Record[]): void {
    this.registeredFunctions[fn.name] = fn;
  }
}

class InfoResource {
  records(collection: string): void {}
  write(records: Records, collection: string): void {}
}
