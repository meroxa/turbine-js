import path from "path";
import { initServer } from "./app";
import { FunctionServer } from "./function";
import fs from "fs-extra";

export { getTurbinePkgVersion } from "./app";

export async function record(gitSHA: string, pathToApp = process.cwd()) {
  const turbine = await initServer(gitSHA);

  const { App } = await import(path.resolve(pathToApp));
  const app = new App();

  return app.run(turbine);
}

export function bootFunction(functionName: string, pathToApp = process.cwd()) {
  const FUNCTION_ADDRESS = process.env.MEROXA_FUNCTION_ADDR;

  const functionServer = new FunctionServer(
    functionName,
    FUNCTION_ADDRESS as string,
    pathToApp
  );

  functionServer.start();
}

export async function createDockerfile(pathToApp = process.cwd()) {
  const pathToDockerfile = path.resolve(__dirname, "../templates/Dockerfile");

  await fs.copy(pathToDockerfile, path.join(pathToApp, "Dockerfile"));
}
