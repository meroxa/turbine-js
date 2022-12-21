import { copy, rename, writeJson } from "fs-extra";
import path from "path";
import child_process from "child_process";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";

export default async function generateApp(
  name: string,
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  let appName = name || "my-app";
  let templatesDir = path.resolve(__dirname, "../../templates");
  let appPath = path.resolve(pathToDataApp, appName);

  try {
    await copy(`${templatesDir}/javascript`, appPath, {
      errorOnExist: true,
      overwrite: false,
    });
    await rename(`${appPath}/ignoregit`, `${appPath}/.gitignore`);
  } catch (err) {
    assertIsError(err);
    return Err(new BaseError("error generating app", err));
  }

  const appJson = await generateAppJson(appName, appPath);

  if (appJson.err) {
    return Err(new BaseError("error generating app", appJson.val));
  }

  try {
    child_process.execSync(`npm --prefix ${appPath} install ${appPath}`);
  } catch (err) {
    console.error(err);
  }

  return Ok(true);
}

async function generateAppJson(
  appName: string,
  appPath: string
): Promise<Result<true, BaseError>> {
  let appJson = {
    name: appName,
    language: "javascript",
    environment: "common",
    resources: {
      source_name: "fixtures/demo-cdc.json",
    },
  };

  try {
    await writeJson(`${appPath}/app.json`, appJson, { spaces: "\t" });
    return Ok(true);
  } catch (err) {
    assertIsError(err);
    return Err(new BaseError("error generating app.json", err));
  }
}
