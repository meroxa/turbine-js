import { copy } from "fs-extra";
import path from "path";
import { PlatformRuntime, LocalRuntime, Client as MeroxaJS } from "../runtime";
import localDockerBuild from "./local-docker-build";
import platformBuild from "./platform-build";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";
import { InfoRuntime } from "../runtime/info";

export async function runAppLocal(pathToDataApp: string) {
  const { App } = require(path.resolve(pathToDataApp));
  const app = new App();
  const appJSON = require(path.resolve(`${pathToDataApp}/app.json`));

  const environment = new LocalRuntime(appJSON, pathToDataApp);
  await app.run(environment);
  return Ok(true);
}

export async function runAppPlatform(
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  const { App } = require(path.resolve(pathToDataApp));
  const app = new App();
  const appJSON = require(path.resolve(`${pathToDataApp}/app.json`));
  const meroxaJS = new MeroxaJS({
    auth: process.env.MEROXA_ACCESS_TOKEN || "",
    url: process.env.MEROXA_API_URL,
  });

  // TODO refactor this logic into Meroxa CLI for JS based apps ===============
  const isDocker =
    !!process.env.DOCKER_HUB_USERNAME && !!process.env.DOCKER_HUB_PASSWORD;

  // CLI should call out to this using the turbine-js interface
  const functions = await listFunctions(pathToDataApp);

  if (functions.err) {
    return Err(new BaseError("error listing functions", functions.val));
  }

  let functionImageName = "";
  if (functions.val.length > 0) {
    const functionImage = await buildFunction(
      pathToDataApp,
      meroxaJS,
      isDocker
    );

    if (functionImage.err) {
      return Err(new BaseError("error building function", functionImage.val));
    }

    functionImageName = functionImage.val;
  }

  // ==========================================================================

  const environment = new PlatformRuntime(meroxaJS, functionImageName, appJSON);

  console.log("Running data app...");

  try {
    await app.run(environment);
    return Ok(true);
  } catch (e) {
    assertIsError(e);
    return Err(new BaseError("Error running app", e));
  }
}

export async function buildFunction(
  pathToDataApp: string,
  meroxaJS: MeroxaJS,
  isDocker: boolean
): Promise<Result<string, BaseError>> {
  if (!isDocker) {
    const build = await platformBuild(pathToDataApp, meroxaJS);
    if (build.err) {
      return Err(new BaseError("Error running platform build", build.val));
    }
    return Ok(build.val.image);
  } else {
    const build = await localDockerBuild(pathToDataApp);

    if (build.err) {
      return Err(new BaseError("Error running local docker build", build.val));
    }

    return Ok(build.val);
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
    return Ok(true);
  } catch (e) {
    assertIsError(e);
    return Err(new BaseError("Error generating app", e));
  }
}

export async function listFunctions(
  pathToDataApp: string
): Promise<Result<string[], BaseError>> {
  const infoRuntime = new InfoRuntime();
  const { App } = require(path.resolve(pathToDataApp));
  const app = new App();
  try {
    await app.run(infoRuntime);
    return Ok(infoRuntime.functionsList);
  } catch (e) {
    assertIsError(e);
    return Err(new BaseError("Error listing functions", e));
  }
}
