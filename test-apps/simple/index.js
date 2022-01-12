const stringHash = require("string-hash");

function iAmHelping(str) {
  return `~~~${str}~~~`;
}

exports.Anonymize = function Anonymize(records) {
  records.forEach((record) => {
    record.payload.email = iAmHelping(
      stringHash(record.payload.email).toString()
    );
  });

  return records;
};

exports.App = class App {
  async run(DAFTFunc) {
    // Get source resource
    let db = await DAFTFunc.resources("pg");

    // Create source connector
    let records = await db.records("user_activity");

    // Deploy function with source as input
    let anonymized = await DAFTFunc.process(records, exports.Anonymize);

    // Get destination resource
    let otherDB = await DAFTFunc.resources("pg2");

    // Create destination connector with function output as input
    await otherDB.write(anonymized, "user_activity");
  }
};
