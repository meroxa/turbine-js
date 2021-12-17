const fs = require("fs/promises");

exports.Local = class Local {
  constructor(fixturesPath) {
    this.fixturesPath = fixturesPath;
  }

  resources(resourceName) {
    const resourceFixturesPath = `${this.fixturesPath}/${resourceName}.json`;
    return new Resource(resourceName, resourceFixturesPath);
  }

  process(records, fn) {
    let processedRecords = fn(records.records);
    return {
      records: processedRecords,
    };
  }
};

class Resource {
  constructor(name, fixturesPath) {
    this.name = name;
    this.fixturesPath = fixturesPath;
  }

  async records(collection) {
    return readFixtures(this.fixturesPath, collection, this.name);
  }

  write(records, collection) {
    console.log(
      `=====================to ${this.name} resource=====================`
    );
    records.records.forEach((record) => {
      console.log({ record });
    });
    return null;
  }
}

async function readFixtures(path, collection, resourceName) {
  let rawFixtures = await fs.readFile(path);
  let fixtures = JSON.parse(rawFixtures.toString());
  let collectionFixtures = fixtures[collection];
  let collectionKeys = Object.keys(collectionFixtures);
  let records = collectionKeys.map((key) => {
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
  };
}
