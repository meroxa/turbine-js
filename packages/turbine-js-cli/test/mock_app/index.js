exports.App = class App {
  async run(turbine) {
    let source = await turbine.resources("pg");
    let records = await source.records("collection_name");
    let destination = await turbine.resources("snowflake");
    await destination.write(records, "output_collection");
  }
};
