const { copy } = require("fs-extra");
var path = require("path");

exports.generate = (name) => {
  let appName = name || "my-app";
  let templatesDir = path.resolve(__dirname, "../templates");

  console.log(`Generating Data app ${appName}...`);
  return copy(
    `${templatesDir}/javascript`,
    appName,
    { overwrite: false, errorOnExist: true },
    (err) => {
      if (err) return console.error(err);
      console.log("success!");
    }
  );
};
