const stringHash = require("string-hash");

function iAmHelping(str) {
  return `~~~${str}~~~`;
}

exports.Anonymize = (records) => {
  records.forEach((record) => {
    record.payload.email = iAmHelping(
      stringHash(record.payload.email).toString()
    );
  });

  return records;
};

exports.App = class App {
  async run(DAFTFunc) {
    let db = DAFTFunc.resources("pg");

    let records = await db.records("user_activity");

    let anonymized = await DAFTFunc.process(records, exports.Anonymize);

    let dataWarehouse = DAFTFunc.resources("sfdwh");

    dataWarehouse.write(anonymized, "user_activity");
  }
};
