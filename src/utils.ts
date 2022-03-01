const { copy, writeJson } = require("fs-extra");
var path = require("path");

export async function generate(pathname: string, name: string) {
  let appName = name || "my-app";
  let templatesDir = path.resolve(__dirname, "../templates");
  let appPath = path.resolve(pathname, appName);

  try {
    await copy(`${templatesDir}/javascript`, appPath, {
      errorOnExist: true,
      overwrite: false,
    });
    await generateAppJson(appPath);
  } catch (err) {
    console.error(err);
  }
}

async function generateAppJson(appName: string) {
  let appJson = {
    name: appName,
    language: "javascript",
  };

  console.log("Generating app.json...");

  try {
    await writeJson(`${appName}/app.json`, appJson);
  } catch (err) {
    console.error(err);
  }
}
