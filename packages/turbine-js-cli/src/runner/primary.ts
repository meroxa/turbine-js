import fs from "fs-extra";
import path from "path";

import { PlatformRuntime, LocalRuntime } from "../runtime";
import { AppConfig } from "../runtime/types";
import { ApplicationResponse } from "@meroxa/meroxa-js";

import { assertIsError, BaseError, APIError } from "../errors";
import { Result, Ok, Err } from "ts-results";

import { PlatformV2Runtime } from "../runtime/platform-v2";
import { Client as MeroxaJS } from "@meroxa/meroxa-js";
import { InfoRuntime } from "../runtime/info";

export default class Primary {
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

  async createDockerfile(): Promise<Result<true, BaseError>> {
    try {
      const pathToDockerfile = path.resolve(
        __dirname,
        "../../templates/Dockerfile"
      );

      await fs.copy(
        pathToDockerfile,
        path.join(this.pathToDataApp, "Dockerfile")
      );
      return Ok(true);
    } catch (e) {
      return Err(new BaseError("Error copying Dockerfile"));
    }
  }

  async runAppPlatform(
    functionImageName: string,
    appName: string,
    headCommit: string,
    version: string,
    spec: string
  ) {
    if (spec) {
      return this.runAppPlatformV2(
        functionImageName,
        appName,
        headCommit,
        version,
        spec
      );
    }

    const environment = new PlatformRuntime(
      this.meroxaJS,
      functionImageName,
      appName,
      this.appJSON,
      headCommit
    );

    try {
      await this.dataApp.run(environment);
      await this.#createApplication(environment.appConfig, headCommit);

      return Ok(true);
    } catch (e) {
      assertIsError(e);
      return Err(new BaseError("Error running app", e));
    }
  }

  async runAppPlatformV2(
    functionImageName: string,
    appName: string,
    headCommit: string,
    version: string,
    spec: string
  ) {
    const environment = new PlatformV2Runtime(
      functionImageName,
      appName,
      headCommit,
      version,
      spec
    );

    try {
      await this.dataApp.run(environment);
      const IR = environment.serializeToIR();
      console.log(IR);
      // POST IR
      return Ok(true);
    } catch (e) {
      assertIsError(e);
      return Err(new BaseError("Error creating internal representation", e));
    }
  }

  async #createApplication(
    appConfig: AppConfig,
    headCommit: string
  ): Promise<ApplicationResponse> {
    try {
      const applicationInput = {
        name: appConfig.name,
        language: "js",
        git_sha: headCommit,
        pipeline: {
          name: appConfig.pipeline,
        },
      };

      console.log(`Creating application '${appConfig.name}'`);

      let applicationResponse = await this.meroxaJS.applications.create(
        applicationInput
      );
      console.log(`Sucessfully created '${appConfig.name}' application`);

      return applicationResponse;
    } catch (e: any) {
      if (e.response) {
        throw new APIError(`Error creating '${appConfig.name}' application`, e);
      }

      if (e.request) {
        throw new BaseError("no server response");
      }

      throw e;
    }
  }
}
