import { access } from "fs/promises";
import { AppConfig, Record, Records } from "./types";

export class PreflightLocalRuntime {
  pathToDataApp: string;
  appConfig: AppConfig;
  localRunErrors: string[];

  constructor(pathToDataApp: string, appConfig: AppConfig) {
    this.pathToDataApp = pathToDataApp;
    this.appConfig = appConfig;
    this.localRunErrors = [];
  }

  async resources(resourceName: string): Promise<PreflightLocalResource> {
    const resources = this.appConfig.resources;
    const fixturesPath = resources[resourceName];
    if (!fixturesPath) {
      return new PreflightLocalResource(resourceName, "", this.localRunErrors);
    }

    const resourceFixturesPath = `${this.pathToDataApp}/${fixturesPath}`;

    return new PreflightLocalResource(
      resourceName,
      resourceFixturesPath,
      this.localRunErrors
    );
  }

  process(records: Records, fn: (rr: Record[]) => Record[]): void {}
}

class PreflightLocalResource {
  name: string;
  fixturesPath: string;
  localRunErrors: string[];

  constructor(name: string, fixturesPath: string, localRunErrors: string[]) {
    this.name = name;
    this.fixturesPath = fixturesPath;
    this.localRunErrors = localRunErrors;
  }
  async records(collection: string): Promise<void> {
    if (!this.fixturesPath) {
      this.localRunErrors.push(
        `There is no fixture path defined in your app.json for resource '${this.name}'`
      );

      return;
    }

    try {
      await access(this.fixturesPath);
    } catch (e) {
      this.localRunErrors.push(
        `There is no fixture data at path '${this.fixturesPath}' for resource '${this.name}'`
      );
    }
  }
  write(records: Records, collection: string): void {}
}
