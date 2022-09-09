import { PlatformRuntime } from "../../src/index";
import { AppConfig } from "../../src/runtime/types";
import { BaseError } from "../../src/errors";

const appConfig: AppConfig = {
  name: "awake-coin",
  language: "js",
  environment: "common",
  pipeline: "asleep",
  resources: {},
};

const imageName = "function:asleep";
const appName = "test-app";

const testPipeline = { name: "asleep", uuid: "987654" };

QUnit.module("Unit | Creating sources", () => {
  QUnit.test("records: it creates a source connector (kafka)", async (assert) => {
    assert.expect(11);

    const appConfig: AppConfig = {
      name: "awake-coin",
      language: "js",
      environment: "common",
      pipeline: "asleep",
      resources: {},
    };
    const imageName = "function:asleep";
    const appName = "test-app";
    const headCommit = "sha123456789";

    const testResource = {
      id: 7,
      name: "my-db7",
      type: "kafka",
    };

    const assertedMockClient = {
      connectors: {
        create: (connInput) => {
          assert.strictEqual(connInput.config.input, "daft");
          assert.strictEqual(connInput.config.hello, "punk");
          assert.strictEqual(connInput.resource_id, 7);
          assert.strictEqual(connInput.metadata["mx:connectorType"], "source");
          assert.strictEqual(connInput.pipeline_name, "asleep");
          assert.ok(connInput.config["conduit"]);
          assert.notOk(connInput.config["table.name.format"]);
          assert.notOk(connInput.config["collection"]);
          assert.notOk(connInput.config["aws_s3_prefix"]);
          return { streams: { output: ["aroundtheworld"] } };
        },
      },
      resources: {
        get: (name) => {
          return testResource;
        },
      },
      pipelines: {
        get: (name) => {
          return testPipeline;
        },
      },
    };

    const runtimeInstance = new PlatformRuntime(
      assertedMockClient,
      imageName,
      appName,
      appConfig,
      headCommit
    );

    let platformResource = await runtimeInstance.resources("my-db");
    let connector = await platformResource.records("daft", {
      hello: "punk",
    });

    assert.strictEqual(connector.stream, "aroundtheworld");
    assert.deepEqual(connector.records, []);
  });
});
