import path from "path";

import { LocalRuntime, Client as MeroxaJS } from "../runtime";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";
import { InfoRuntime } from "../runtime/info";

export default class Base {
  pathToDataApp: string;
  meroxaJS: MeroxaJS;
  appName: string;
  infoRuntime: InfoRuntime;
  localRuntime: LocalRuntime;

  constructor(pathToDataApp: string, meroxaJS: MeroxaJS, name: string = "") {
    this.pathToDataApp = pathToDataApp;
    this.meroxaJS = meroxaJS;
    this.appName = name;
    this.infoRuntime = new InfoRuntime(this.pathToDataApp, this.appJSON);
    this.localRuntime = new LocalRuntime(this.pathToDataApp, this.appJSON);
  }

  get dataApp() {
    const { App } = require(path.resolve(this.pathToDataApp));
    const app = new App();
    return app;
  }

  get appJSON() {
    var config = require(path.resolve(`${this.pathToDataApp}/app.json`));
    config.name = this.appName;
    return config;
  }

  async runAppLocal() {
    await this.dataApp.run(this.localRuntime);
    return Ok(true);
  }

  async listFunctions(): Promise<Result<string[], BaseError>> {
    try {
      await this.dataApp.run(this.infoRuntime);
      return Ok(this.infoRuntime.functionsList);
    } catch (e) {
      assertIsError(e);
      return Err(new BaseError("Error listing functions", e));
    }
  }

  async hasFunctions(): Promise<Result<boolean, BaseError>> {
    const functions = await this.listFunctions();

    if (functions.err) {
      return Err(new BaseError("Error listing functions"));
    }

    return Ok(functions.val.length > 0);
  }

  async listResources(): Promise<Result<string, BaseError>> {
    try {
      await this.dataApp.run(this.infoRuntime);
      return Ok(this.infoRuntime.resourcesList);
    } catch (e) {
      assertIsError(e);
      return Err(new BaseError("Error listing resources", e));
    }
  }
}
