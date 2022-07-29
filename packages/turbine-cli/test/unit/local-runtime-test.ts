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

  QUnit.test("#resources", (assert) => {
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
  });

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
