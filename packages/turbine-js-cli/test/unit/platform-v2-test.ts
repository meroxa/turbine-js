import {
  PlatformV2Runtime,
  PlatformV2Resource,
  PlatformV2Function,
} from "../../src/runtime/platform-v2";
import { Records, RecordsArray } from "../../src/runtime/types";

QUnit.module("Unit | PlatformV2Function", () => {
  QUnit.test("#constructor", (assert) => {
    const funktion = new PlatformV2Function(
      "sleep-token-fn",
      "123456789",
      "sleep-token-image"
    );
    assert.strictEqual(funktion.name, "sleep-token-fn-12345678");
    assert.strictEqual(funktion.image, "sleep-token-image");
  });
  QUnit.test("#serializeToIR", (assert) => {
    const funktion = new PlatformV2Function(
      "sleep-token-fn",
      "123456789",
      "sleep-token-image"
    );
    assert.deepEqual(funktion.serializeToIR(), {
      name: "sleep-token-fn-12345678",
      image: "sleep-token-image",
    });
  });
});

QUnit.module("Unit | PlatformV2Resource", () => {
  QUnit.test("#constructor", (assert) => {
    const resource = new PlatformV2Resource("sleep-token-resource");

    assert.strictEqual(resource.resource, "sleep-token-resource");
  });

  QUnit.test("#records", (assert) => {
    const resource = new PlatformV2Resource("sleep-token-resource");
    resource.records("st-collection", { a_config: true });
    assert.strictEqual(resource.type, "source");
    assert.strictEqual(resource.collection, "st-collection");
    assert.deepEqual(resource.config, { a_config: true });
  });

  QUnit.test("#write", (assert) => {
    const resource = new PlatformV2Resource("sleep-token-resource");
    resource.write({} as Records, "st-collection", { a_config: true });
    assert.strictEqual(resource.type, "destination");
    assert.strictEqual(resource.collection, "st-collection");
    assert.deepEqual(resource.config, { a_config: true });
  });
});

QUnit.module("Unit | PlatformV2Runtime", () => {
  QUnit.test("#constructor", (assert) => {
    const runtime = new PlatformV2Runtime(
      "imageName",
      "appName",
      "123456789",
      "1.0.0",
      "0.1.0"
    );
    assert.strictEqual(runtime.imageName, "imageName");
    assert.strictEqual(runtime.appName, "appName");
    assert.strictEqual(runtime.headCommit, "123456789");
    assert.strictEqual(runtime.version, "1.0.0");
    assert.strictEqual(runtime.spec, "0.1.0");
  });

  QUnit.test("#definition", (assert) => {
    const runtime = new PlatformV2Runtime(
      "imageName",
      "appName",
      "123456789",
      "1.0.0",
      "0.1.0"
    );

    assert.deepEqual(runtime.definition, {
      app_name: "appName",
      git_sha: "123456789",
      metadata: {
        turbine: {
          language: "js",
          version: "1.0.0",
        },
        spec_version: "0.1.0",
      },
    });
  });

  QUnit.test("#resources", (assert) => {
    const runtime = new PlatformV2Runtime(
      "imageName",
      "appName",
      "123456789",
      "1.0.0",
      "0.1.0"
    );

    const resource = runtime.resources("a-resource");

    assert.ok(resource instanceof PlatformV2Resource);
    assert.strictEqual(resource.resource, "a-resource");
  });

  QUnit.test("#process", (assert) => {
    const runtime = new PlatformV2Runtime(
      "imageName",
      "appName",
      "123456789",
      "1.0.0",
      "0.1.0"
    );

    function aFn(rr: RecordsArray) {
      return new RecordsArray();
    }

    runtime.process({} as Records, aFn, {
      A_ENV_VAR: "sleeptokenrocks",
    });

    assert.strictEqual(runtime.registeredFunctions.length, 1);
    assert.ok(runtime.registeredFunctions[0] instanceof PlatformV2Function);
    assert.strictEqual(runtime.registeredFunctions[0].name, "aFn-12345678");
    assert.strictEqual(runtime.registeredFunctions[0].image, "imageName");
    assert.strictEqual(Object.keys(runtime.registeredSecrets).length, 1);
    assert.strictEqual(runtime.registeredSecrets.A_ENV_VAR, "sleeptokenrocks");
  });

  QUnit.test("#serializeToIR", (assert) => {
    const runtime = new PlatformV2Runtime(
      "imageName",
      "appName",
      "123456789",
      "1.0.0",
      "0.1.0"
    );

    const source = runtime.resources("a-source");
    source.records("source_collection", { SOURCE_CONFIG: "hey" });

    function aFn(rr: RecordsArray) {
      return new RecordsArray();
    }
    runtime.process({} as Records, aFn, {
      A_ENV_VAR: "sleeptokenrocks",
    });

    const destination = runtime.resources("a-dest");
    destination.write({} as Records, "dest_collection", { DEST_CONFIG: "bye" });

    const IR = runtime.serializeToIR();

    assert.deepEqual(IR, {
      connectors: [
        {
          resource: "a-source",
          type: "source",
          collection: "source_collection",
          config: { SOURCE_CONFIG: "hey" },
        },
        {
          resource: "a-dest",
          type: "destination",
          collection: "dest_collection",
          config: { DEST_CONFIG: "bye" },
        },
      ],
      functions: [{ name: "aFn-12345678", image: "imageName" }],
      secrets: { A_ENV_VAR: "sleeptokenrocks" },
      definition: {
        app_name: "appName",
        git_sha: "123456789",
        metadata: {
          turbine: {
            language: "js",
            version: "1.0.0",
          },
          spec_version: "0.1.0",
        },
      },
    });
  });
});
