import fs from "fs-extra";
import path from "path";
import { Result, Ok, Err } from "ts-results";
import { BaseError } from "../errors";

export async function generateDockerfile(
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  try {
    await fs.copy(
      path.join(__dirname, "../../templates/Dockerfile"),
      pathToDataApp
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
    await fs.remove(path.join(pathToDataApp, "Dockerfile"));
    return Ok(true);
  } catch (e) {
    return Err(new BaseError("Error removing Dockerfile"));
  }
}
