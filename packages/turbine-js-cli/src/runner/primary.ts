import fs from "fs-extra";
import path from "path";

import { PlatformRuntime } from "../runtime";
import { AppConfig } from "../runtime/types";
import { ApplicationResponse } from "@meroxa/meroxa-js";

import { assertIsError, BaseError, APIError } from "../errors";
import { Result, Ok, Err } from "ts-results";

import Base from "./base";

export default class Primary extends Base {
  async buildFunction(): Promise<Result<true, BaseError>> {
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
      console.log(e);
      return Err(new BaseError("Error copying Dockerfile"));
    }
  }

  async runAppPlatform(
    functionImageName: string,
    appName: string,
    headCommit: string
  ) {
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

  async #cleanupTmpDir(tmpDir: string) {
    await fs.remove(tmpDir);
  }
}
