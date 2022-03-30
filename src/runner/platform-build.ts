import path from "path";
import targz from "targz";
import os from "os";
import fs from "fs-extra";
import { Result, Ok, Err } from "ts-results";
import { BaseError, APIError } from "../errors";
import axios from "axios";
import { Client } from "meroxa-js";
import { poller } from "./poller";
import { BuildResponse } from "meroxa-js/lib/types/build";

export default async function (
  pathToDataApp: string,
  client: Client
): Promise<Result<BuildResponse, BaseError>> {
  const tmpDir = path.join(os.tmpdir(), "turbine");
  const deployDir = path.join(__dirname, "../function-deploy");

  try {
    await fs.copy(deployDir, tmpDir);
    await fs.copy(pathToDataApp, path.join(tmpDir, "data-app"));
  } catch (e) {
    await cleanupTmpDir(tmpDir);
    return Err(new BaseError("Build directory error"));
  }

  await new Promise((resolve, reject) => {
    targz.compress(
      {
        src: tmpDir,
        dest: "./app.tar.gz",
      },
      function (err) {
        if (err) {
          reject("Error compressing file");
        } else {
          resolve(true);
        }
      }
    );
  });

  const uploadFile = fs.readFileSync("./app.tar.gz");
  let finishedBuild: BuildResponse;

  try {
    console.log("Creating source...");
    const newSource = await client.sources.create();

    console.log("Uploading to s3...");

    await axios({
      headers: {
        "content-type": "application/gzip",
      },
      method: "put",
      url: newSource.put_url,
      data: uploadFile,
    });

    console.log("Creating build...");

    const newBuild = await client.builds.create({
      source_blob: { url: newSource.get_url },
    });

    finishedBuild = await poller({
      fn: async () => {
        return await client.builds.get(newBuild.uuid);
      },
      validate: (build: BuildResponse) => {
        return build.status.state != "pending";
      },
      maxAttempts: 20,
      interval: 10000,
    });
  } catch (e: any) {
    if (e.response) {
      return Err(new APIError(e));
    }

    if (e.request) {
      return Err(new BaseError("no api response"));
    }

    return Err(new BaseError("internal error"));
  }

  await cleanupTmpDir(tmpDir);
  return Ok(finishedBuild);
}

async function cleanupTmpDir(tmpDir: string) {
  await fs.remove(tmpDir);
}
