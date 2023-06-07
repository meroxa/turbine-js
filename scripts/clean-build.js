const fs = require("fs-extra");
const path = require("path");

const libDir = path.resolve(__dirname, "..", "lib");
fs.remove(libDir);
