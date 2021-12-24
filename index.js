// A daft-func CLI app could run this

const { App } = require("./test-apps/simple/index");
const { MeroxaAPI } = require("./meroxa-api");

let app = new App();
let environment;

// I am ready to run my app as platform services
if (process.env.NODE_ENV === "production") {
  const { Platform } = require("./platform");
  environment = new Platform(MeroxaAPI);
} else {
  // I am just locally testing that this works
  const { Local } = require("./local");
  environment = new Local("./test-apps/simple/fixtures");
}

app.run(environment);
