// Call relevant dependencies to the data app
const stringHash = require("string-hash");

// Create a function to return a certain format hash string
function iAmHelping(str) {
  return `~~~${str}~~~`;
}

// Create an `Anonymize` function to hash string the `customer_email`
exports.Anonymize = function Anonymize(records) {
  records.forEach((record) => {
    // If CDC formatted records / `demo-cdc.json` fixture in use `record.value.payload.after.customer_email`
    // If non-CDC formatted records / `demo-no-cdc.json` fixture in use `record.value.payload.customer_email`
    // Remember to reflect changes in the `app.json` configuration
    record.value.payload.after.customer_email = iAmHelping(
      stringHash(record.value.payload.after.customer_email).toString(),
    );
  });

  return records;
};

exports.App = class App {
  async run(turbine) {
    // To configure resources for your production datastores
    // on Meroxa, use the Dashboard, CLI, or Terraform Provider
    // For more details refer to: http://docs.meroxa.com/

    // Identify the upstream datastore with the `resources` function
    // Replace `source_name` with the resource name configured on Meroxa
    let source = await turbine.resources("source_name");

    // Specify which `source` records to pull with the `records` function
    // Replace `collection_name` with whatever data organisation method
    // is relevant to the datastore (e.g., table, bucket, collection, etc.)
    let records = await source.records("collection_name");

    // Specify the code to execute against `records` with the `process` function
    // Replace `Anonymize` with the function
    let anonymized = await turbine.process(records, exports.Anonymize);

    // Identify the upstream datastore with the `resources` function
    // Replace `source_name` with the resource name configured on Meroxa
    let destination = await turbine.resources("destination_name");

    // Specify where to write records to your `destination` using the `write` function
    // Replace `collection_archive` with whatever data organisation method
    // is relevant to the datastore (e.g., table, bucket, collection, etc.)
    await destination.write(anonymized, "collection_archive");
  }
};