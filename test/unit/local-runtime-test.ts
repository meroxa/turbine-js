import { LocalRuntime } from "../../lib/runtime/local";
import { AppConfig } from "../../lib/runtime/types";

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
    const subject = new LocalRuntime(appConfig, pathToDataApp);

    assert.deepEqual(subject.appConfig, appConfig);
    assert.strictEqual(subject.pathToApp, pathToDataApp);
  });
});
