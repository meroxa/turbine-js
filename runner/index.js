// A daft-func CLI app could run this

require("dotenv").config();

const { App } = require("../test-apps/simple/index");
const {
  MeroxaJS,
  PlatformRuntime,
  LocalRuntime,
} = require("daft-func-framework");

let app = new App();
let environment;

// I am ready to run my app as platform services
if (process.env.NODE_ENV === "production") {
  environment = new PlatformRuntime(new MeroxaJS());
} else {
  // I am just locally testing that this works
  environment = new LocalRuntime("../test-apps/simple/fixtures");
}

app.run(environment);
