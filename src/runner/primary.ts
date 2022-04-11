import fs from "fs-extra";
import path from "path";
import os from "os";

import { PlatformRuntime } from "../runtime";

import { assertIsError, BaseError } from "../errors";
import { Result, Ok, Err } from "ts-results";

import Base from "./base";
import { PreflightPlatformRuntime } from "../runtime/preflight-platform";

export default class Primary extends Base {
  async buildFunction(): Promise<Result<string, BaseError>> {
    const preflightEnvironment = new PreflightPlatformRuntime(this.meroxaJS);
    this.dataApp.run(preflightEnvironment);

    if (preflightEnvironment.platformRunErrors.length > 0) {
      const preflightErrors = preflightEnvironment.platformRunErrors.join("\n");
      return Err(new BaseError(preflightErrors));
    }

    const tmpDir = path.join(os.tmpdir(), "turbine");
    const deployDir = path.join(__dirname, "../function-deploy");

    const filterFunc = (src: string, dest: string) => {
      return !(
        src.includes(`/node_modules`) ||
        src.includes(`/.git`) ||
        src.includes(`/fixtures`)
      );
    };

    try {
      await fs.copy(deployDir, tmpDir);
      await fs.copy(this.pathToDataApp, path.join(tmpDir, "data-app"), {
        filter: filterFunc,
      });
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
