import { copy, writeJson } from "fs-extra";
import path from "path";
import child_process from "child_process";

import { LocalRuntime, Client as MeroxaJS } from "../runtime";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";
import { InfoRuntime } from "../runtime/info";

export default class Base {
  pathToDataApp: string;
  meroxaJS: MeroxaJS;
  infoRuntime: InfoRuntime;
  localRuntime: LocalRuntime;

  constructor(pathToDataApp: string, meroxaJS: MeroxaJS) {
    this.pathToDataApp = pathToDataApp;
    this.meroxaJS = meroxaJS;
    this.infoRuntime = new InfoRuntime(this.pathToDataApp, this.appJSON);
    this.localRuntime = new LocalRuntime(this.pathToDataApp, this.appJSON);
  }

  get dataApp() {
    const { App } = require(path.resolve(this.pathToDataApp));
    const app = new App();
    return app;
  }

  get appJSON() {
    return require(path.resolve(`${this.pathToDataApp}/app.json`));
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

  async rollback(): Promise<Result<true, BaseError>> {
    try {
      const pipeline = await this.meroxaJS.pipelines.get(
        this.infoRuntime.pipelineName
      );
      const connectors = await this.meroxaJS.connectors.listByPipeline(
        pipeline.name
      );

      const sourceConnectors = connectors.filter((conn) => {
        return conn.type === "source";
      });
      const destinationConnectors = connectors.filter((conn) => {
        return conn.type === "destination";
      });

      const functions = await this.meroxaJS.functions.list();
      const pipelinesFunctions = functions.filter((func) => {
        return func.pipeline.name === pipeline.name;
      });

      await destinationConnectors.reduce(async (acc: Promise<any>, conn) => {
        await acc;
        return this.meroxaJS.connectors.delete(conn.name);
      }, Promise.resolve());

      await sourceConnectors.reduce(async (acc: Promise<any>, conn) => {
        await acc;
        return this.meroxaJS.connectors.delete(conn.name);
      }, Promise.resolve());

      const deletingFunctions = pipelinesFunctions.map((func) => {
        return this.meroxaJS.functions.delete(func.name);
      });

      await Promise.all(deletingFunctions);
      await this.meroxaJS.pipelines.delete(pipeline.name);

      return Ok(true);
    } catch (e) {
      return Err(new BaseError("rollback failed"));
    }
  }

  async generate(name: string): Promise<Result<true, BaseError>> {
    let appName = name || "my-app";
    let templatesDir = path.resolve(__dirname, "../../templates");
    let appPath = path.resolve(this.pathToDataApp, appName);

    try {
      await copy(`${templatesDir}/javascript`, appPath, {
        errorOnExist: true,
        overwrite: false,
      });
    } catch (err) {
      assertIsError(err);
      return Err(new BaseError("error generating app", err));
    }

    const appJson = await this.generateAppJson(appName, appPath);

    if (appJson.err) {
      return Err(new BaseError("error generating app", appJson.val));
    }

    try {
      child_process.execSync(`npm --prefix ${appPath} install ${appPath}`);
    } catch (err) {
      console.error(err);
    }

    return Ok(true);
  }

  async generateAppJson(
    appName: string,
    appPath: string
  ): Promise<Result<true, BaseError>> {
    let appJson = {
      name: appName,
      language: "javascript",
      environment: "common",
      resources: {
        source_name: "fixtures/demo-cdc.json",
      },
    };

    try {
      await writeJson(`${appPath}/app.json`, appJson);
      return Ok(true);
    } catch (err) {
      assertIsError(err);
      return Err(new BaseError("error generating app.json", err));
    }
  }
}
