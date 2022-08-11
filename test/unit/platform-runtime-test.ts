import { PlatformRuntime } from "../../src/index";
import { AppConfig } from "../../src/runtime/types";

const mockClientFn = {
  create: () => {},
  delete: () => {},
  get: () => {},
};

const mockClient = {
  pipelines: mockClientFn,
  resources: mockClientFn,
  function: mockClientFn,
  connectors: mockClientFn,
};

QUnit.module("Unit | PlatformRuntime", () => {
  QUnit.test("#constructor: creates a runtime", (assert) => {
    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "default",
      resources: {},
    };
    const imageName = "function:awake";
    const appName = "test-app"

    const subject = new PlatformRuntime(mockClient, imageName, appName, appConfig);

    assert.deepEqual(subject.client, mockClient);
    assert.strictEqual(subject.imageName, imageName);
    assert.deepEqual(subject.appConfig, appConfig);
  });

  QUnit.test(
    "#constructor: validates app config if name is missing",
    (assert) => {
      const appConfig: AppConfig = {
        name: "",
        language: "js",
        environment: "common",
        pipeline: "default",
        resources: {},
      };
      const imageName = "function:awake";
      const appName = ""

      assert.throws(
        function () {
          const subject = new PlatformRuntime(mockClient, imageName, appName, appConfig);
        },
        /application `name` is required/,
        "it throws a validation error"
      );
    }
  );

  QUnit.test("#constructor: sets a pipeline name if not set yet", (assert) => {
    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "",
      resources: {},
    };
    const imageName = "function:awake";
    const appName = "sleep-token"


    const runtimeInstance = new PlatformRuntime(
      mockClient,
      imageName,
      appName,
      appConfig
    );
    assert.strictEqual(
      runtimeInstance.appConfig.pipeline,
      "turbine-pipeline-sleep-token"
    );
  });

  QUnit.test(
    "#constructor: retains original pipeline name if present",
    (assert) => {
      const appConfig: AppConfig = {
        name: "sleep-token",
        language: "js",
        environment: "common",
        pipeline: "awake",
        resources: {},
      };
      const imageName = "function:awake";
      const appName = "test-app"


      const runtimeInstance = new PlatformRuntime(
        mockClient,
        imageName,
        appName,
        appConfig
      );
      assert.strictEqual(runtimeInstance.appConfig.pipeline, "awake");
    }
  );

  QUnit.test("resources: it gets a pipeline and a resource", async (assert) => {
    assert.expect(4);

    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "awake",
      resources: {},
    };
    const imageName = "function:awake";
    const appName = "test-app"


    const assertedMockClient = {
      pipelines: {
        get: (name) => {
          assert.strictEqual(name, "awake");
          return { name, uuid: 42 };
        },
      },
      resources: {
        get: (name) => {
          assert.strictEqual(name, "my-db");
          return { name, id: 24 };
        },
      },
    };

    const runtimeInstance = new PlatformRuntime(
      assertedMockClient,
      imageName,
      appName,
      appConfig
    );

    let platformResource = await runtimeInstance.resources("my-db");

    assert.strictEqual(platformResource.resource.name, "my-db");
    assert.strictEqual(platformResource.appConfig.pipeline, "awake");
  });

  QUnit.test(
    "resources: it creates a pipeline if missing, an application, and a resource",
    async (assert) => {
      assert.expect(3);

      const appConfig: AppConfig = {
        name: "sleep-token",
        language: "js",
        environment: "common",
        pipeline: "awake",
        resources: {},
      };
      const imageName = "function:awake";
      const appName = "sleep-token"


      const assertedMockClient = {
        pipelines: {
          get: (name) => {
            assert.strictEqual(name, "awake");
            return Promise.reject({ response: { status: 404 } });
          },
          create: (pipelineInput) => {
            assert.strictEqual(pipelineInput.name, "awake");
            assert.strictEqual(pipelineInput.metadata.app, "sleep-token");
            return { name: pipelineInput.name, uuid: 43 };
          },
        },
        resources: {
          get: (name) => {
            return { name, id: 24 };
          },
        },
      };

       const runtimeInstance = new PlatformRuntime(
        assertedMockClient,
        imageName,
        appName,
        appConfig
      );
      try {
        await runtimeInstance.resources("my-db");
      } catch (e) {
        // noop
      }
    }
  );

  QUnit.test("process: it creates a function", async (assert) => {
    assert.expect(4);

    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "awake",
      resources: {},
    };
    const imageName = "function:awake";
    const appName = "test-app"


    const assertedMockClient = {
      functions: {
        create: (functionInput) => {
          assert.strictEqual(functionInput.input_stream, "couscous");
          assert.strictEqual(functionInput.image, "function:awake");
          assert.strictEqual(functionInput.pipeline.name, "awake");
          return { output_stream: "bulgur" };
        },
      },
    };

    const runtimeInstance = new PlatformRuntime(
      assertedMockClient,
      imageName,
      appName,
      appConfig
    );

    let records = await runtimeInstance.process(
      { id: 1, stream: "couscous" },
      { name: "myFn" }
    );
    assert.strictEqual(records.stream, "bulgur");
  });

  QUnit.test("records: it creates a source connector", async (assert) => {
    assert.expect(7);

    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "awake",
      resources: {},
    };
    const imageName = "function:awake";
    const appName = "test-app"

    const assertedMockClient = {
      connectors: {
        create: (connInput) => {
          assert.strictEqual(connInput.config.input, "quinoa");
          assert.strictEqual(connInput.config.hello, "world");
          assert.strictEqual(connInput.resource_id, 24);
          assert.strictEqual(connInput.metadata["mx:connectorType"], "source");
          assert.strictEqual(connInput.pipeline_name, "awake");
          return { streams: { output: ["lentils"] } };
        },
      },
      resources: {
        get: (name) => {
          return { name, id: 24 };
        },
      },
      pipelines: {
        get: (name) => {
          return { name, uuid: 42 };
        },
      },
    };

    const runtimeInstance = new PlatformRuntime(
      assertedMockClient,
      imageName,
      appName,
      appConfig
    );

    let platformResource = await runtimeInstance.resources("my-db");
    let connector = await platformResource.records("quinoa", {
      hello: "world",
    });

    assert.strictEqual(connector.stream, "lentils");
    assert.deepEqual(connector.records, []);
  });

  QUnit.test("write: it creates a destination connector", async (assert) => {
    assert.expect(5);

    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "awake",
      resources: {},
    };
    const imageName = "function:awake";
    const appName = "test-app"


    const assertedMockClient = {
      connectors: {
        create: (connInput) => {
          assert.strictEqual(connInput.config.input, "quinoa");
          assert.strictEqual(connInput.config.hello, "world");
          assert.strictEqual(connInput.resource_id, 24);
          assert.strictEqual(
            connInput.metadata["mx:connectorType"],
            "destination"
          );
          assert.strictEqual(connInput.pipeline_name, "awake");

          return connInput;
        },
      },
      resources: {
        get: (name) => {
          return { name, id: 24 };
        },
      },
      pipelines: {
        get: (name) => {
          return { name, uuid: 42 };
        },
      },
    };

    const runtimeInstance = new PlatformRuntime(
      assertedMockClient,
      imageName,
      appName,
      appConfig
    );

    let platformResource = await runtimeInstance.resources("my-db");
    await platformResource.write({ stream: "quinoa" }, "rice", {
      hello: "world",
    });
  });
});
