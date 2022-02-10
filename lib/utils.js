const { copy } = require("fs-extra");

exports.generate = (name) => {
  let appName = name || "my-app";
  console.log(`Generating Data app ${appName}...`);

  return copy(
    "templates/javascript",
    appName,
    { overwrite: false, errorOnExist: true },
    (err) => {
      if (err) return console.error(err);
      console.log("success!");
    }
  );
};
