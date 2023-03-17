import { LocalRuntime } from "../../src/index";
import { AppConfig } from "../../src/runtime/types";

QUnit.module("Unit | LocalRuntime", () => {
  QUnit.test("#constructor", (assert) => {
    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "default",
      resources: {},
    };

    const pathToDataApp = "/path/to/data/app";
    const subject = new LocalRuntime(pathToDataApp, appConfig);

    assert.deepEqual(subject.appConfig, appConfig);
    assert.strictEqual(subject.pathToApp, pathToDataApp);
  });

  QUnit.test(
    "#resources: it uses the correct fixture for the resource",
    (assert) => {
      const pathToFixtures = "path/to/fixtures";
      const appConfig: AppConfig = {
        name: "sleep-token",
        language: "js",
        environment: "common",
        pipeline: "default",
        resources: {
          pg: pathToFixtures,
        },
      };

      const pathToDataApp = "/path/to/data/app";
      const localRuntime = new LocalRuntime(pathToDataApp, appConfig);
      const subject = localRuntime.resources("pg");

      assert.strictEqual(subject.constructor.name, "LocalResource");
      assert.strictEqual(subject.name, "pg");
      assert.strictEqual(
        subject.fixturesPath,
        `${pathToDataApp}/${pathToFixtures}`
      );
    }
  );

  QUnit.test(
    "#resources: it throws an error if there is no fixture defined for the resource",
    (assert) => {
      const pathToFixtures = "path/to/fixtures";
      const appConfig: AppConfig = {
        name: "sleep-token",
        language: "js",
        environment: "common",
        pipeline: "default",
        resources: {
          pg: pathToFixtures,
        },
      };

      const pathToDataApp = "/path/to/data/app";
      const localRuntime = new LocalRuntime(pathToDataApp, appConfig);

      assert.throws(
        function () {
          localRuntime.resources("wild_MISSINGNO");
        },
        /You are trying to run your Turbine Data app with the resource "wild_MISSINGNO"/,
        "it throws the error"
      );
    }
  );

  QUnit.test(
    "#records: it returns records read from the source fixture",
    async (assert) => {
      const pathToFixtures = "./mock_fixtures/demo-cdc.json";
      const appConfig: AppConfig = {
        name: "sleep-token",
        language: "js",
        environment: "common",
        pipeline: "default",
        resources: {
          pg: pathToFixtures,
        },
      };

      const pathToDataApp = "test/mock_app";
      const localRuntime = new LocalRuntime(pathToDataApp, appConfig);
      const resource = localRuntime.resources("pg");

      const subject = await resource.records("collection_name");
      assert.strictEqual(subject.records.length, 3);
      assert.strictEqual(subject.records[0].key, "1");
      assert.strictEqual(subject.records[0].value.schema.fields.length, 6);
      assert.strictEqual(subject.records[0].value.payload.before, null);
      assert.deepEqual(subject.records[0].value.payload.after, {
        id: 9582724,
        category: "camping",
        product_type: "sleeping-bag",
        product_name: "Forte 35 Sleeping Bag - Womens",
        stock: true,
        product_id: 361632,
        shipping_address: "9718 East Virginia Avenue Silver Spring, MD 20901",
        customer_email: "usera@example.com",
      });
    }
  );

  QUnit.test(
    "#records: it throws an error if there is no matching collection defined in the fixture",
    async (assert) => {
      assert.expect(2);

      const pathToFixtures = "./mock_fixtures/demo-cdc.json";
      const appConfig: AppConfig = {
        name: "sleep-token",
        language: "js",
        environment: "common",
        pipeline: "default",
        resources: {
          pg: pathToFixtures,
        },
      };

      const pathToDataApp = "test/mock_app";
      const localRuntime = new LocalRuntime(pathToDataApp, appConfig);
      const subject = localRuntime.resources("pg");

      try {
        await subject.records("snorlax");
      } catch (e) {
        assert.ok(true, "it throws an error");
        assert.ok(
          e.message.includes(
            `You are trying to read from a resource "pg" with the collection "snorlax" but the local fixture`
          )
        );
      }
    }
  );

  QUnit.test("#process", (assert) => {
    const pathToFixtures = "path/to/fixtures";
    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "default",
      resources: {
        pg: pathToFixtures,
      },
    };

    const pathToDataApp = "/path/to/data/app";
    const mockData = {
      records: ["donut", "pineapple", "cashew"],
    };
    const processFn = function (data) {
      return data.map((item) => `${item}s`);
    };

    const localRuntime = new LocalRuntime(appConfig, pathToDataApp);
    const processedRecords = localRuntime.process(mockData, processFn);

    assert.deepEqual(processedRecords.records, [
      "donuts",
      "pineapples",
      "cashews",
    ]);
    assert.strictEqual(processedRecords.stream, "");
  });
});
