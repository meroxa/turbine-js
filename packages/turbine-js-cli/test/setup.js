const tsNode = require("ts-node");

tsNode.register({
  files: true,
  transpileOnly: true,
  project: "test/tsconfig.test.json", // relative to root of project
});
