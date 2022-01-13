const fsPromises = require("fs").promises;
const { renderFile } = require("template-file");

const readPackageName = require("./data-app/package.json").name;

async function build(packageName) {
  const data = {
    PACKAGE_NAME: packageName,
  };

  const string = await renderFile("./function-app/index.template.js", data);
  await fsPromises.writeFile("./index.js", string);
}

build(readPackageName);
