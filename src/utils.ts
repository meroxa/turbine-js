import { assertIsError, BaseError } from "./errors";
import { Err, Ok, Result } from "ts-results";

import { copy, writeJson } from "fs-extra";
var path = require("path");

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

  return Ok(true);
}

async function generateAppJson(
  appName: string
): Promise<Result<true, BaseError>> {
  let appJson = {
    name: appName,
    language: "javascript",
  };

  try {
    await writeJson(`${appName}/app.json`, appJson);
    return Ok(true);
  } catch (err) {
    assertIsError(err);
    return Err(new BaseError("error generating app.json", err));
  }
}
