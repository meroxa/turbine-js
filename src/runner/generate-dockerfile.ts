import { copy, rename, remove } from "fs-extra";
import path from "path";
import { Result, Ok, Err } from "ts-results";
import { BaseError } from "../errors";

export async function generateDockerfile(
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  try {
    await copy(path.join(__dirname, "../../templates/docker"), pathToDataApp);
    await rename(
      path.join(pathToDataApp, "ignoredocker"),
      path.join(pathToDataApp, ".dockerignore")
    );
    return Ok(true);
  } catch (e) {
    return Err(new BaseError("Error generating Dockerfile"));
  }
}

export async function cleanupDockerfile(
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  try {
    await remove(path.join(pathToDataApp, "Dockerfile"));
    return Ok(true);
  } catch (e) {
    return Err(new BaseError("Error removing Dockerfile"));
  }
}
