import { Resource, Record, Records, Runtime, AppConfig } from "./types";
import { readFile } from "fs/promises";

export class LocalRuntime implements Runtime {
  appConfig: AppConfig;
  pathToApp: string;

  constructor(pathToApp: string, appConfig: AppConfig) {
    this.pathToApp = pathToApp;
    this.appConfig = appConfig;
  }

  resources(resourceName: string): LocalResource {
    const resources = this.appConfig.resources;
    const fixturesPath = resources[resourceName];
    const resourceFixturesPath = `${this.pathToApp}/${fixturesPath}`;

    return new LocalResource(resourceName, resourceFixturesPath);
  }

  process(records: Records, fn: (rr: Record[]) => Record[]): Records {
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
  let records: Record[] = collectionFixtures.map((fixture: any) => {
    return {
      key: fixture.key,
      value: fixture.value,
      timestamp: Date.now(),
    };
  });

  return {
    records,
    stream: "",
  };
}
