const fs = require("fs-extra");
const path = require("path");

const src = path.join(__dirname, "../src/function-deploy");
const dest = path.join(__dirname, "../lib/function-deploy");

function finishBuild() {
  const include = [
    "data-app",
    "Dockerfile",
    "function-app/proto",
    "function-app/package.json",
    "function-app/yarn.lock",
  ];

  include.forEach((included) => {
    fs.copy(path.join(src, included), path.join(dest, included));
  });
}

finishBuild();
