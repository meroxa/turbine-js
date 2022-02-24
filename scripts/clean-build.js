const fs = require("fs-extra");
const path = require("path");

const libDir = path.join(__dirname, "../lib");
fs.remove(libDir);
