// Pull in fixture data from the fixtures file
const demo = require("./fixtures/demo-cdc.json");
// Pull in the Anonymize function from the base app
const { Anonymize } = require("./index.js");

// This example unit test was built using QUnit, a JavaScript testing framework
// However, you may use any testing framework of your choice
// To learn more about how to use this testing framework
// Refer to the QUnit documentation https://qunitjs.com/intro
// To run this example unit test, use `npm test`

QUnit.module("My data app", () => {
  QUnit.test("anonymize function works on `customer_email`", (assert) => {
    // Take records from the fixture
    let records = demo["collection_name"];
    // Apply function against the fixture data
    let results = Anonymize(records);

    // Test the function worked first fixture data record, matching a result
    assert.strictEqual(
      results[0].value.payload.after.customer_email,
      "~~~1072928786~~~"
    );
    // If using demo-no-cdc.json use `value.payload.customer_email`
    // If using demo-cdc.json use `value.payload.after.customer_email`
  });
});
