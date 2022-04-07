import fs from "fs-extra";
import path from "path";
import os from "os";

import { PlatformRuntime } from "../runtime";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";

import Base from "./base";

export default class Primary extends Base {
  async buildFunction(): Promise<Result<string, BaseError>> {
    const tmpDir = path.join(os.tmpdir(), "turbine");
    const deployDir = path.join(__dirname, "../function-deploy");

    try {
      await fs.copy(deployDir, tmpDir);
      await fs.copy(this.pathToDataApp, path.join(tmpDir, "data-app"));
      return Ok(tmpDir);
    } catch (e) {
      await this.#cleanupTmpDir(tmpDir);
      return Err(new BaseError("Build directory error"));
    }
  }

  async runAppPlatform(functionImageName: string) {
    const environment = new PlatformRuntime(
      this.meroxaJS,
      functionImageName,
      this.appJSON
    );

    console.log("Running data app...");

    try {
      await this.dataApp.run(environment);
      return Ok(true);
    } catch (e) {
      assertIsError(e);
      return Err(new BaseError("Error running app", e));
    }
  }

  async #cleanupTmpDir(tmpDir: string) {
    await fs.remove(tmpDir);
  }
}
