import path from "path";

import { LocalRuntime, Client as MeroxaJS } from "../runtime";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";
import { InfoRuntime } from "../runtime/info";
import { PreflightLocalRuntime } from "../runtime/preflight-local";

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
    const preflightLocalRuntime = new PreflightLocalRuntime(
      this.pathToDataApp,
      this.appJSON
    );
    await this.dataApp.run(preflightLocalRuntime);
    if (preflightLocalRuntime.localRunErrors.length > 0) {
      const preflightErrors = preflightLocalRuntime.localRunErrors.join("\n");
      return Err(new BaseError(preflightErrors));
    }
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
    } catch (e: any) {
      const errorIs404 = e.response && e.response.status === 404;
      const errorIsFromPipelineRequest =
        e.request &&
        e.request.method === "GET" &&
        e.request.path.includes("/pipelines/");

      if (errorIs404 && errorIsFromPipelineRequest) {
        return Ok(true);
      }
      assertIsError(e);
      return Err(new BaseError("rollback failed", e));
    }
  }
}
