const { copy } = require("fs-extra");
const path = require("path");
import { PlatformRuntime, LocalRuntime, Client as MeroxaJS } from "../runtime";

exports.run = async (
  nodeEnv: string,
  buildEnv: string,
  pathToDataApp: string
) => {
  const { App } = require(path.resolve(pathToDataApp));
  const app = new App();
  const appJSON = require(path.resolve(`${pathToDataApp}/app.json`));
  let environment;

  if (nodeEnv != "production") {
    environment = new LocalRuntime(appJSON, pathToDataApp);
    return app.run(environment);
  }

  const meroxaJS = new MeroxaJS({
    auth: process.env.MEROXA_ACCESS_TOKEN || "",
    url: process.env.MEROXA_API_URL,
  });

  if (buildEnv === "docker-github") {
    const {
      triggerWorkflowRun,
      waitForWorkflowRun,
    } = require("./deploy-docker-github");
    console.log(
      "Triggering meroxa deploy github action from latest commit on default branch..."
    );
    const runID = await triggerWorkflowRun();
    console.log("GitHub action in progress, building image...");
    const sha = await waitForWorkflowRun(runID);
    console.log(
      `Docker image ${process.env.DOCKER_HUB_USERNAME}/${sha} built and pushed successfully.`
    );

    environment = new PlatformRuntime(
      meroxaJS,
      `${process.env.DOCKER_HUB_USERNAME}/${sha}`,
      appJSON
    );
  } else if (buildEnv === "docker-local") {
    const build = require("./deploy-docker");
    await build(pathToDataApp);
    environment = new PlatformRuntime(
      meroxaJS,
      `${process.env.DOCKER_HUB_USERNAME}/${appJSON.name}`,
      appJSON
    );
  } else {
    throw new Error("Unknown build environment");
  }

  console.log("Running data app...");

  return app.run(environment);
};

exports.generate = (name: any) => {
  let appName = name || "my-app";
  console.log(`Generating data app ${appName}...`);

  return copy(
    "templates/javascript",
    appName,
    { overwrite: false, errorOnExist: true },
    (err: any) => {
      if (err) return console.error(err);
      console.log("success!");
    }
  );
};
