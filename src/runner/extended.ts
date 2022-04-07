import { PlatformRuntime, Client as MeroxaJS } from "../runtime";
import localDockerBuild from "./extended/local-docker-build";
import platformBuild from "./extended/platform-build";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";

import Base from "./base";

export default class Extended extends Base {
  async buildFunction(isDocker: boolean): Promise<Result<string, BaseError>> {
    if (!isDocker) {
      const build = await platformBuild(this.pathToDataApp, this.meroxaJS);
      if (build.err) {
        return Err(new BaseError("Error running platform build", build.val));
      }
      return Ok(build.val.image);
    } else {
      const build = await localDockerBuild(this.pathToDataApp);

      if (build.err) {
        return Err(
          new BaseError("Error running local docker build", build.val)
        );
      }

      return Ok(build.val);
    }
  }
  // Run the data app with the platform runtime, but first check for functions
  // in the data app and deploy them
  async runAppPlatform(): Promise<Result<true, BaseError>> {
    // TODO refactor this logic into Meroxa CLI for JS based apps ===============
    const isDocker =
      !!process.env.DOCKER_HUB_USERNAME && !!process.env.DOCKER_HUB_PASSWORD;

    // CLI should call out to this using the turbine-js interface
    const functions = await this.listFunctions();

    if (functions.err) {
      return Err(new BaseError("error listing functions", functions.val));
    }

    let functionImageName = "";
    if (functions.val.length > 0) {
      const functionImage = await this.buildFunction(isDocker);

      if (functionImage.err) {
        return Err(new BaseError("error building function", functionImage.val));
      }

      functionImageName = functionImage.val;
    }

    // ==========================================================================

    const environment = new PlatformRuntime(
      this.meroxaJS,
      functionImageName,
      this.appJSON
    );

    console.log("Running data app...");

    try {
      await this.dataApp.run(environment);
      return Ok(true);
    } catch (e) {
      assertIsError(e);
      return Err(new BaseError("Error running app", e));
    }
  }
}
