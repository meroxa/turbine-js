import { Resource, Record, Records, Runtime } from "./types";
import { readFile } from "fs/promises";

export class LocalRuntime implements Runtime {
  fixturesPath: string;

  constructor(fixturesPath: string) {
    this.fixturesPath = fixturesPath;
  }

  resources(resourceName: string): Resource {
    const resourceFixturesPath = `${this.fixturesPath}/${resourceName}.json`;
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
      console.log({ record });
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
  let collectionKeys: string[] = Object.keys(collectionFixtures);
  let records: Record[] = collectionKeys.map((key) => {
    return {
      key,
      payload: collectionFixtures[key],
      timestamp: Date.now(),
    };
  });

  console.log(
    `=====================from ${resourceName} resource=====================`
  );

  records.forEach((record) => {
    console.log({ record });
  });

  return {
    records,
    stream: "",
  };
}
