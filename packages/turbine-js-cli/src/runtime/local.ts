import { BaseError } from "../errors";
import {
  Resource,
  Record,
  Records,
  RecordsArray,
  Runtime,
  AppConfig,
} from "./types";
import { readFile } from "fs/promises";

export class LocalRuntime implements Runtime {
  appConfig: AppConfig;
  pathToApp: string;
  hasSource: boolean;

  constructor(pathToApp: string, appConfig: AppConfig) {
    this.pathToApp = pathToApp;
    this.appConfig = appConfig;
    this.hasSource = false;
  }

  resources(resourceName: string): LocalResource {
    const resources = this.appConfig.resources;
    const fixturesPath = resources[resourceName];

    if ((!fixturesPath || fixturesPath === "undefined") && !this.hasSource) {
      throw new BaseError(
        `You are trying to run your Turbine Data app with the resource "${resourceName}" which currently does not have a local fixture association in your app config.\nPlease associate a suitable fixture file for "${resourceName}" in ${this.pathToApp}/app.json before running the meroxa apps run command again.\n`
      );
    }

    const resourceFixturesPath = `${this.pathToApp}/${fixturesPath}`;
    this.hasSource = true;

    return new LocalResource(resourceName, resourceFixturesPath);
  }

  process(records: Records, fn: (rr: RecordsArray) => RecordsArray): Records {
    let processedRecords = fn(records.records);
    return {
      records: processedRecords,
      stream: "",
    };
  }
}

class LocalResource implements Resource {
  name: string;
  fixturesPath: string;

  constructor(name: string, fixturesPath: string) {
    this.name = name;
    this.fixturesPath = fixturesPath;
  }

  async records(collection: string): Promise<Records> {
    return readFixtures(this.fixturesPath, collection, this.name);
  }

  write(records: Records, collection: string): void {
    console.log(
      `=====================to ${this.name} resource=====================`
    );
    records.records.forEach((record: Record) => {
      console.log(record.value.payload);
    });
  }
}

async function readFixtures(
  path: string,
  collection: string,
  resourceName: string
): Promise<Records> {
  const rawFixtures = await readFile(path);
  let fixtures = JSON.parse(rawFixtures.toString());
  let collectionFixtures = fixtures[collection];
  if (!collectionFixtures || collectionFixtures === "undefined") {
    let currentTableName = Object.keys(fixtures)[0];
    throw new BaseError(
      `You are trying to read from a resource "${resourceName}" with the collection "${collection}" but the local fixture that you have defined for this resource in app.json does not contain a table named "${collection}".\nPlease define another fixture file for "${resourceName}" in your app.json or update the table name in your currently used fixture from "${currentTableName}" to "${collection}".\n`
    );
  }
  let records = new RecordsArray();

  collectionFixtures.forEach((fixture: any) => {
    records.pushRecord({
      key: fixture.key,
      value: fixture.value,
      timestamp: Date.now(),
    });
  });

  return {
    records,
    stream: "",
  };
}
