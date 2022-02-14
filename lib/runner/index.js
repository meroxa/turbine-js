const { copy } = require("fs-extra");
const {
  PlatformRuntime,
  LocalRuntime,
  Client: MeroxaJS,
} = require("../runtime");

exports.run = async (nodeEnv, buildEnv, pathToDataApp) => {
  const { App } = require(pathToDataApp);
  const app = new App();
  const appJSON = require(`${pathToDataApp}/app.json`);

  if (nodeEnv != "production") {
    const environment = new LocalRuntime(appJSON, pathToDataApp);
    return app.run(environment);
  }

  const meroxaJS = new MeroxaJS({
    auth: process.env.AUTH_TOKEN,
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
    console.log("Github action in progress, building image...");
    const sha = await waitForWorkflowRun(runID);
    console.log(
      `Docker image ${process.env.DOCKERHUB_PREFIX}/${sha} built and pushed successfully.`
    );

    environment = new PlatformRuntime(
      meroxaJS,
      `${process.env.DOCKERHUB_PREFIX}/${sha}`,
      appJSON
    );
  } else if (buildEnv === "docker-local") {
    const build = require("./deploy-docker");
    await build(pathToDataApp);
    environment = new PlatformRuntime(
      meroxaJS,
      `${process.env.DOCKERHUB_PREFIX}/${process.env.DOCKERHUB_IMAGE_NAME}`,
      appJSON
    );
  } else {
    throw new Error("Unknown build environment");
  }

  console.log("Running data app...");

  return app.run(environment);
};

exports.generate = (name) => {
  let appName = name || "my-app";
  console.log(`Generating data app ${appName}...`);

  return copy(
    "templates/javascript",
    appName,
    { overwrite: false, errorOnExist: true },
    (err) => {
      if (err) return console.error(err);
      console.log("success!");
    }
  );
};
