import Docker from "dockerode";
import path from "path";
import tarfs from "tar-fs";
import os from "os";
import fs from "fs-extra";

module.exports = async (pathToDataApp: any) => {
  const tmpDir = path.join(os.tmpdir(), "turbine");
  const deployDir = path.join(__dirname, "../function-deploy");
  const appName = require(path.resolve(`${pathToDataApp}/app.json`)).name;

  if (
    !process.env.DOCKER_HUB_USERNAME ||
    !process.env.DOCKER_HUB_ACCESS_TOKEN
  ) {
    throw new Error("Missing DOCKER_HUB_USERNAME or DOCKER_HUB_ACCESS_TOKEN");
  }

  await fs.copy(deployDir, tmpDir);
  await fs.copy(pathToDataApp, path.join(tmpDir, "data-app"));

  const docker = new Docker();
  const tarpack = tarfs.pack(tmpDir);
  const tagName = `${process.env.DOCKER_HUB_USERNAME}/${appName}`;

  const stream = await docker.buildImage(tarpack, {
    t: tagName,
  });
  stream.pipe(process.stdout);
  await new Promise((resolve, reject) => {
    docker.modem.followProgress(stream, (err: any, res: any) =>
      err ? reject(err) : resolve(res)
    );
  });
  const image = docker.getImage(tagName);
  const push = await image.push({
    tag: "latest",
    authconfig: {
      username: process.env.DOCKER_HUB_USERNAME,
      password: process.env.DOCKER_HUB_ACCESS_TOKEN,
      serveraddress: "https://index.docker.io/v1/",
    },
  });
  push.pipe(process.stdout);
  await new Promise((resolve, reject) => {
    docker.modem.followProgress(push, (err: any, res: any) =>
      err ? reject(err) : resolve(res)
    );
  });

  await fs.remove(tmpDir);
};
