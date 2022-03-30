import { assertIsError, BaseError } from "./errors";
import { Err, Ok, Result } from "ts-results";

import { copy, writeJson } from "fs-extra";
var path = require("path");
var child_process = require('child_process');

export async function generate(
  name: string,
  pathname: string
): Promise<Result<true, BaseError>> {
  let appName = name || "my-app";
  let templatesDir = path.resolve(__dirname, "../templates");
  let appPath = path.resolve(pathname, appName);

  try {
    await copy(`${templatesDir}/javascript`, appPath, {
      errorOnExist: true,
      overwrite: false,
    });
  } catch (err) {
    assertIsError(err);
    return Err(new BaseError("error generating app", err));
  }

  const appJson = await generateAppJson(appPath);

  if (appJson.err) {
    return Err(new BaseError("error generating app", appJson.val));
  }

  try {
    child_process.execSync(`npm --prefix ${appPath} install ${appPath}`);
  } catch(err) {
    console.error(err);
  }

  return Ok(true);
}

async function generateAppJson(
  appName: string
): Promise<Result<true, BaseError>> {
  let appJson = {
    "name": appName,
    "language": "javascript",
    "environment": "common",
    "resources": {
      "source_name":"fixtures/demo.json"
    }
  };

  try {
    await writeJson(`${appName}/app.json`, appJson);
    return Ok(true);
  } catch (err) {
    assertIsError(err);
    return Err(new BaseError("error generating app.json", err));
  }
}
