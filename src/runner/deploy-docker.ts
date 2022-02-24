import Docker from "dockerode";
import path from "path";
import tarfs from "tar-fs";
import os from "os";
import fs from "fs-extra";
import { Result, Ok, Err } from "ts-results";
import { BaseError, assertIsError } from "../errors";

export default async function (
  pathToDataApp: string
): Promise<Result<true, BaseError>> {
  if (
    !process.env.DOCKER_HUB_USERNAME ||
    !process.env.DOCKER_HUB_ACCESS_TOKEN
  ) {
    return Err(
      new BaseError("Missing DOCKER_HUB_USERNAME or DOCKER_HUB_ACCESS_TOKEN")
    );
  }

  const tmpDir = path.join(os.tmpdir(), "turbine");
  const deployDir = path.join(__dirname, "../function-deploy");
  const appName = require(path.resolve(`${pathToDataApp}/app.json`)).name;

  try {
    await fs.copy(deployDir, tmpDir);
    await fs.copy(pathToDataApp, path.join(tmpDir, "data-app"));
  } catch (e) {
    await cleanupTmpDir(tmpDir);
    return Err(new BaseError("Build directory error"));
  }

  const docker = new Docker();
  const tarpack = tarfs.pack(tmpDir);
  const tagName = `${process.env.DOCKER_HUB_USERNAME}/${appName}`;

  let stream: NodeJS.ReadableStream;
  try {
    stream = await docker.buildImage(tarpack, {
      t: tagName,
    });
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(
        stream,
        (err: any, res: any) => (err ? reject(err) : resolve(res)),
        (obj: any) => {
          obj.stream && process.stdout.write(obj.stream);
        }
      );
    });
  } catch (e) {
    await cleanupTmpDir(tmpDir);
    assertIsError(e);
    return Err(new BaseError("docker build error", e));
  }

  const image = docker.getImage(tagName);
  const push = await image.push({
    tag: "latest",
    authconfig: {
      username: process.env.DOCKER_HUB_USERNAME,
      password: process.env.DOCKER_HUB_ACCESS_TOKEN,
      serveraddress: "https://index.docker.io/v1/",
    },
  });

  await new Promise((resolve, reject) => {
    docker.modem.followProgress(push, (err: any, res: any) =>
      err ? reject(err) : resolve(res)
    ),
      (obj: any) => {
        obj.stream && process.stdout.write(obj.stream);
      };
  });

  await cleanupTmpDir(tmpDir);
  return Ok(true);
}

async function cleanupTmpDir(tmpDir: string) {
  await fs.remove(tmpDir);
}
