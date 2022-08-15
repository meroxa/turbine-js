const fs = require("fs-extra");
const path = require("path");

const src = path.join(__dirname, "../src/function");
const dest = path.join(__dirname, "../lib/function");

function finishBuild() {
  const include = ["proto"];

  include.forEach((included) => {
    fs.copy(path.join(src, included), path.join(dest, included));
  });
}

finishBuild();
