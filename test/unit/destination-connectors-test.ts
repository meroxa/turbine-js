import { PlatformRuntime } from "../../src/index";
import { AppConfig } from "../../src/runtime/types";
import { BaseError } from "../../src/errors";

const appConfig: AppConfig = {
  name: "sleep-token",
  language: "js",
  environment: "common",
  pipeline: "awake",
  resources: {},
};

const imageName = "function:awake";
const appName = "test-app";

const testPipeline = { name: "awake", uuid: "12345" };

QUnit.module("Unit | Creating destinations", () => {
  QUnit.test(
    "records: it creates a destination connector (postgres)",
    async (assert) => {
      assert.expect(8);

      const testResource = {
        id: 1,
        name: "my-db",
        type: "postgres",
      };

      const assertedMockClient = {
        connectors: {
          create: (connInput) => {
            assert.strictEqual(connInput.config.input, "buttercup");
            assert.strictEqual(connInput.resource_id, 1);
            assert.strictEqual(
              connInput.metadata["mx:connectorType"],
              "destination"
            );
            assert.strictEqual(connInput.pipeline_name, "awake");
            assert.strictEqual(
              connInput.config["table.name.format"],
              "rice-is-nice"
            );
            assert.notOk(connInput.config["collection"]);
            assert.notOk(connInput.config["aws_s3_prefix"]);
            assert.notOk(connInput.config["snowflake.topic2table.map"]);

            return connInput;
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);
      await platformResource.write({ stream: "buttercup" }, "RICE-IS-NICE");
    }
  );

  QUnit.test(
    "records: it creates a destination connector (mysql)",
    async (assert) => {
      assert.expect(8);

      const testResource = {
        id: 2,
        name: "my-db2",
        type: "mysql",
      };

      const assertedMockClient = {
        connectors: {
          create: (connInput) => {
            assert.strictEqual(connInput.config.input, "buttercup");
            assert.strictEqual(connInput.resource_id, 2);
            assert.strictEqual(
              connInput.metadata["mx:connectorType"],
              "destination"
            );
            assert.strictEqual(connInput.pipeline_name, "awake");
            assert.strictEqual(
              connInput.config["table.name.format"],
              "potatoes-too"
            );
            assert.notOk(connInput.config["collection"]);
            assert.notOk(connInput.config["aws_s3_prefix"]);
            assert.notOk(connInput.config["snowflake.topic2table.map"]);

            return connInput;
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);
      await platformResource.write({ stream: "buttercup" }, "POTATOES-TOO");
    }
  );

  QUnit.test(
    "records: it creates a destination connector (mysql)",
    async (assert) => {
      assert.expect(8);

      const testResource = {
        id: 3,
        name: "my-db3",
        type: "redshift",
      };

      const assertedMockClient = {
        connectors: {
          create: (connInput) => {
            assert.strictEqual(connInput.config.input, "buttercup");
            assert.strictEqual(connInput.resource_id, 3);
            assert.strictEqual(
              connInput.metadata["mx:connectorType"],
              "destination"
            );
            assert.strictEqual(connInput.pipeline_name, "awake");
            assert.strictEqual(
              connInput.config["table.name.format"],
              "berriesallday"
            );
            assert.notOk(connInput.config["collection"]);
            assert.notOk(connInput.config["aws_s3_prefix"]);
            assert.notOk(connInput.config["snowflake.topic2table.map"]);

            return connInput;
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);
      await platformResource.write({ stream: "buttercup" }, "berriesallday");
    }
  );

  QUnit.test(
    "records: it creates a destination connector (mongodb)",
    async (assert) => {
      assert.expect(8);

      const testResource = {
        id: 4,
        name: "my-db4",
        type: "mongodb",
      };

      const assertedMockClient = {
        connectors: {
          create: (connInput) => {
            assert.strictEqual(connInput.config.input, "buttercup");
            assert.strictEqual(connInput.resource_id, 4);
            assert.strictEqual(
              connInput.metadata["mx:connectorType"],
              "destination"
            );
            assert.strictEqual(connInput.pipeline_name, "awake");
            assert.notOk(connInput.config["table.name.format"]);
            assert.strictEqual(connInput.config["collection"], "tomato-soup");
            assert.notOk(connInput.config["aws_s3_prefix"]);
            assert.notOk(connInput.config["snowflake.topic2table.map"]);

            return connInput;
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);
      await platformResource.write({ stream: "buttercup" }, "tOmaTO-sOUp");
    }
  );

  QUnit.test(
    "records: it creates a destination connector (s3)",
    async (assert) => {
      assert.expect(8);

      const testResource = {
        id: 5,
        name: "my-db5",
        type: "s3",
      };

      const assertedMockClient = {
        connectors: {
          create: (connInput) => {
            assert.strictEqual(connInput.config.input, "buttercup");
            assert.strictEqual(connInput.resource_id, 5);
            assert.strictEqual(
              connInput.metadata["mx:connectorType"],
              "destination"
            );
            assert.strictEqual(connInput.pipeline_name, "awake");
            assert.notOk(connInput.config["table.name.format"]);
            assert.notOk(connInput.config["collection"]);
            assert.strictEqual(connInput.config["aws_s3_prefix"], "green-tea/");
            assert.notOk(connInput.config["snowflake.topic2table.map"]);

            return connInput;
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);
      await platformResource.write({ stream: "buttercup" }, "GREEN-tea");
    }
  );

  QUnit.test(
    "records: it creates a destination connector (snowflakedb)",
    async (assert) => {
      assert.expect(8);

      const testResource = {
        id: 6,
        name: "my-db6",
        type: "snowflakedb",
      };

      const assertedMockClient = {
        connectors: {
          create: (connInput) => {
            assert.strictEqual(connInput.config.input, "buttercup");
            assert.strictEqual(connInput.resource_id, 6);
            assert.strictEqual(
              connInput.metadata["mx:connectorType"],
              "destination"
            );
            assert.strictEqual(connInput.pipeline_name, "awake");
            assert.notOk(connInput.config["table.name.format"]);
            assert.notOk(connInput.config["collection"]);
            assert.notOk(connInput.config["aws_s3_prefix"]);
            assert.strictEqual(
              connInput.config["snowflake.topic2table.map"],
              "buttercup:CORN_FLaKES"
            );

            return connInput;
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);
      await platformResource.write({ stream: "buttercup" }, "CORN_FLaKES");
    }
  );

  QUnit.test(
    "records: it throws an error if a destination is misconfigured (snowflakedb)",
    async (assert) => {
      assert.expect(1);

      const testResource = {
        id: 7,
        name: "my-db7",
        type: "snowflakedb",
      };

      const assertedMockClient = {
        connectors: {
          create: () => {
            // noop
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
        appConfig
      );

      let platformResource = await runtimeInstance.resources(testResource.name);

      try {
        await platformResource.write({ stream: "buttercup" }, "CORN-FLaKES?!$");
      } catch (e) {
        assert.deepEqual(
          e,
          new BaseError(
            "snowflake destination connector cannot be configured with collection name CORN-FLaKES?!$. Only alphanumeric characters and underscores are valid."
          )
        );
      }
    }
  );
});
