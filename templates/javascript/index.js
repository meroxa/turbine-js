const stringHash = require("string-hash");

function iAmHelping(str) {
  return `~~~${str}~~~`;
}

exports.Anonymize = function Anonymize(records) {
  records.forEach((record) => {
    record.value.payload.after.email = iAmHelping(
      stringHash(record.value.payload.after.email).toString()
    );
  });

  return records;
};

exports.App = class App {
  async run(turbine) {
    // To configure your data stores as resources on the Meroxa Platform
    // use the Meroxa Dashboard, CLI, or Meroxa Terraform Provider
    // For more details refer to: http://docs.meroxa.com/

    // Identify an upstream data store for your data app
    // with the `resources` function
    // Replace `source_name` with the resource name the
    // data store was configured with on Meroxa
    let source = await turbine.resources("source_name");

    // Specify which upstream records to pull
    // with the `reocrds` function
    // Replace `collection_name` with a table, collection,
    // or bucket name in your data store
    let records = await source.records("collection_name");

    // Specify what code to execute against upstream records
    // with the `process` function
    // Replace `anonymized` with the name of your function code
    let func = await turbine.process(records, exports.Anonymize);

    // Identify the downstream data store for your data app
    // with the `resources` function
    // Replace ` destination_name` with the resource name the
    // data store was configured with on Meroxa
    let destination = await turbine.resources("destination_name");

    // Create destination connector with function output as input
    await destination.write(records, "collection_name");
  }
};