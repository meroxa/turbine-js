const {
  PlatformRuntime,
  LocalRuntime,
  Client: MeroxaJS,
} = require("../runtime");

exports.run = async (nodeEnv, buildEnv, pathToDataApp) => {
  const { App } = require(pathToDataApp);
  const app = new App();
  if (nodeEnv != "production") {
    const environment = new LocalRuntime(`${pathToDataApp}/fixtures`);
    return app.run(environment);
  }
  const meroxaJS = new MeroxaJS({
    auth: process.env.AUTH_TOKEN,
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
      `${process.env.DOCKERHUB_PREFIX}/${sha}`
    );
  } else if (buildEnv === "docker-local") {
    const build = require("./deploy-docker");
    await build(pathToDataApp);
    environment = new PlatformRuntime(
      meroxaJS,
      `${process.env.DOCKERHUB_PREFIX}/${process.env.DOCKERHUB_IMAGE_NAME}`
    );
  } else {
    throw new Error("Unknown build environment");
  }

  console.log("Running data app...");

  return app.run(environment);
};
