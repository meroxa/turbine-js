const Docker = require("dockerode");
const path = require("path");
const tarfs = require("tar-fs");
const fs = require("fs-extra");
const os = require("os");

module.exports = async (pathToDataApp) => {
  const tmpDir = path.join(os.tmpdir(), "turbine");
  const deployDir = path.join(__dirname, "../function-deploy");
  await fs.copy(deployDir, tmpDir);
  await fs.copy(pathToDataApp, path.join(tmpDir, "data-app"));

  const docker = new Docker();
  const tarpack = tarfs.pack(tmpDir);
  const tagName = `${process.env.DOCKERHUB_PREFIX}/${process.env.DOCKERHUB_IMAGE_NAME}`;

  const stream = await docker.buildImage(tarpack, {
    t: tagName,
  });
  stream.pipe(process.stdout);
  await new Promise((resolve, reject) => {
    docker.modem.followProgress(stream, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
  const image = docker.getImage(tagName);
  const push = await image.push({
    tag: "latest",
    authconfig: {
      username: process.env.DOCKERHUB_PREFIX,
      password: process.env.DOCKERHUB_ACCESS_TOKEN,
      serveraddress: "https://index.docker.io/v1/",
    },
  });
  push.pipe(process.stdout);
  await new Promise((resolve, reject) => {
    docker.modem.followProgress(push, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });

  await fs.remove(tmpDir);
};
