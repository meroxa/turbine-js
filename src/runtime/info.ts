import { throws } from "assert";
import {
  AppConfig,
  Records,
  Resource,
  RecordsArray,
  RegisteredFunctions,
} from "./types";

export class InfoRuntime {
  registeredFunctions: RegisteredFunctions = {};
  registeredResources: InfoResource[] = [];
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

  get resourcesList(): string {
    return JSON.stringify(this.registeredResources);
  }

  resources(resourceName: string): InfoResource {
    var resource = new InfoResource(resourceName);
    this.registeredResources.push(resource);
    return resource;
  }

  process(records: Records, fn: (rr: RecordsArray) => RecordsArray): void {
    this.registeredFunctions[fn.name] = fn;
  }
}

class InfoResource {
  name: string;
  source: boolean;
  destination: boolean;
  collection: string;

  constructor(name: string) {
    this.name = name;
    this.source = false;
    this.destination = false;
    this.collection = "";
  }

  records(collection: string): void {
    this.source = true;
    this.collection = collection;
  }
  write(records: Records, collection: string): void {
    this.destination = true;
    this.collection = collection;
  }
}
