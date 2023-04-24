import path from "path";
import { initServer } from "./app";
import { FunctionServer } from "./function";

const args = process.argv.slice(2);

export async function record() {
  const gitSHA = args[2];
  const turbine = await initServer(gitSHA);

  const { App } = await import(path.resolve(process.cwd()));
  const app = new App();

  return app.run(turbine);
}

export function bootFunction() {
  const FUNCTION_ADDRESS = process.env.MEROXA_FUNCTION_ADDR;
  const functionName = args[1];
  const pathToDataApp = args[2] || process.cwd();

  const functionServer = new FunctionServer(
    functionName,
    FUNCTION_ADDRESS as string,
    pathToDataApp
  );

  functionServer.start();
}
