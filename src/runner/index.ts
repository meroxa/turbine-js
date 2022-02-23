import { copy } from "fs-extra";
import path from "path";
import { PlatformRuntime, LocalRuntime, Client as MeroxaJS } from "../runtime";
import localDockerBuild from "./deploy-docker";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";

export async function run(
  nodeEnv: string,
  buildEnv: string,
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  const { App } = require(path.resolve(pathToDataApp));
  const app = new App();
  const appJSON = require(path.resolve(`${pathToDataApp}/app.json`));

  let environment;
  if (nodeEnv != "production") {
    environment = new LocalRuntime(appJSON, pathToDataApp);
    await app.run(environment);
    return Ok(true);
  }

  const meroxaJS = new MeroxaJS({
    auth: process.env.MEROXA_ACCESS_TOKEN || "",
    url: process.env.MEROXA_API_URL,
  });

  if (buildEnv === "docker-local") {
    const build = await localDockerBuild(pathToDataApp);

    if (build.err) {
      return Err(new BaseError("Error running local docker build", build.val));
    }

    environment = new PlatformRuntime(
      meroxaJS,
      `${process.env.DOCKER_HUB_USERNAME}/${appJSON.name}`,
      appJSON
    );
  } else {
    return Err(new BaseError("Unknown build environment"));
  }

  console.log("Running data app...");
  try {
    await app.run(environment);
    return Ok(true);
  } catch (e) {
    assertIsError(e);
    return Err(new BaseError("Error running app", e));
  }
}

export async function generate(name: string): Promise<Result<true, BaseError>> {
  let appName = name || "my-app";
  console.log(`Generating data app ${appName}...`);

  try {
    await copy("templates/javascript", appName, {
      overwrite: false,
      errorOnExist: true,
    });
    console.log("App generated successfully");
    return Ok(true);
  } catch (e) {
    assertIsError(e);
    return Err(new BaseError("Error generating app", e));
  }
}
