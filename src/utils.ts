import { copy, writeJson } from "fs-extra";
import simpleGit, { SimpleGit } from "simple-git";

var path = require("path");

export async function generate(name: string) {
  let appName = name || "my-app";
  let templatesDir = path.resolve(__dirname, "../templates");

  console.log(`Generating Data app ${appName}...`);
  try {
    await copy(`${templatesDir}/javascript`, appName, {
      errorOnExist: true,
      overwrite: false,
    });
    let git: SimpleGit = simpleGit(appName);
    await generateAppJson(appName);
    await git.init();
    console.log("Success!");
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
