import { InfoRuntime } from "../../src/runtime/info";
import { AppConfig } from "../../src/runtime/types";

QUnit.module("Unit | InfoRuntime", () => {
  QUnit.test("#constructor", (assert) => {
    const appConfig: AppConfig = {
      name: "sleep-token",
      language: "js",
      environment: "common",
      pipeline: "default",
      resources: {},
    };

    const pathToDataApp = "/path/to/data/app";
    const subject = new InfoRuntime(pathToDataApp, appConfig);

    assert.deepEqual(subject.appConfig, appConfig);
    assert.strictEqual(subject.pathToDataApp, pathToDataApp);
  });

  QUnit.test("#pipelineName", (assert) => {
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
    const subject = new InfoRuntime(pathToDataApp, appConfig);

    assert.strictEqual(subject.pipelineName, 'turbine-pipeline-sleep-token');
  });

  QUnit.test("#process: it registers functions", (assert) => {
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
    const mockFunction1 = { name: 'anonymize', fn1: () => {}};
    const mockFunction2 = { name: 'capitalize', fn2: () => {}};
    const subject = new InfoRuntime(pathToDataApp, appConfig);

    // precondition: functions are initially empty
    assert.deepEqual(subject.registeredFunctions, {});

    // after processing functions...
    subject.process([], mockFunction1);
    subject.process([], mockFunction2);

    // ...functions are successfully registered
    assert.strictEqual(subject.registeredFunctions.anonymize.name, 'anonymize');
    assert.strictEqual(subject.registeredFunctions.capitalize.name, 'capitalize');
  });

  QUnit.test("#resources: it registers resources", (assert) => {
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
    const mockResource1 = 'engine';
    const mockResource2 = 'hydraulik';
    const subject = new InfoRuntime(pathToDataApp, appConfig);

    // precondition: resources are initially empty
    assert.deepEqual(subject.registeredResources, []);

    // after registering resources....
    subject.resources(mockResource1);
    subject.resources(mockResource2);

    // ...resources are successfully registered
    assert.deepEqual(subject.registeredResources, ['engine', 'hydraulik']);
  });
});
