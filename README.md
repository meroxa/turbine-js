# Turbine

<p align="center" style="text-align:center;">
  <img alt="turbine logo" src="docs/turbine-outline.svg" width="500" />
</p>

Turbine is a data application framework for building server-side applications that are event-driven, respond to data in real-time, and scale using cloud-native best practices.

The benefits of using Turbine include:

* **Native Developer Tooling:** Turbine doesn't come with any bespoke DSL or patterns. Write software like you normally would!

* **Fits into Existing DevOps Workflows:** Build, test, and deploy. Turbine encourages best practices from the start. Don't test your data app in production ever again.

* **Local Development mirrors Production:** When running locally, you'll immediately see how your app reacts to data. What you get there will be exactly what happens in production but with _scale_ and _speed_.

* **Available in many different programming langauages:** Turbine started out in Go but is available in other languages too:
    * [Go](https://github.com/meroxa/turbine-go)
    * [Javascript](https://github.com/meroxa/turbine-js)
    * [Python](https://github.com/meroxa/turbine-py)


## Getting Started

To get started, you'll need to [download the Meroxa CLI](https://github.com/meroxa/cli#installation-guide). Once downloaded and installed, you'll need to back to your terminal and initialize a new project:

```bash
$ meroxa apps init testapp --lang js
```

The CLI will create a new folder called `testapp` located in the directory where the command was issued. If you want to initialize the app somewhere else, you can append the `--path` flag to the command (`meroxa apps init testapp --lang js --path ~/anotherdir`). Once you enter the `testapp` directory, the contents will look like this:

```bash
$ tree testapp/
testapp
├── README.md
├── index.js
├── index.test.js
├── app.json
├── package.json
├── package-lock.json
└── fixtures
    └── demo-cdc.json
    └── demo-no-cdc.json
```

This will be a full-fledged Turbine app that can run. You can even run the tests using the command `meroxa apps run` in the root of the app directory. It provides just enough to show you what you need to get started.

### `index.js`

This configuration file is where you begin your Turbine journey. Any time a Turbine app runs, this is the entry point for the entire application. When the project is created, the file will look like this:

```js
const stringHash = require("string-hash");

function iAmHelping(str) {
  return `~~~${str}~~~`;
}

exports.App = class App {
  anonymize(records) {
    records.forEach((record) => {
      record.set(
        "customer_email",
        iAmHelping(stringHash(record.get("customer_email")))
      );
    });

    records.unwrapCDC();

    return records;
  }

  async run(turbine) {
    let source = await turbine.resources("source_name");

    let records = await source.records("collection_name");

    let anonymized = await turbine.process(records, this.anonymize);

    let destination = await turbine.resources("destination_name");

    await destination.write(anonymized, "collection_archive");
  }
};
```

Let's talk about the important parts of this code. Turbine apps have five functions that comprise the entire DSL. Outside of these functions, you can write whatever code you want to accomplish your tasks:

```js
async run(turbine)
```

`run` is the main entry point for the application. This is where you can initialize the Turbine framework. This is also the place where, when you deploy your Turbine app to Meroxa, Meroxa will use this as the place to boot up the application.

```js
let source = await turbine.resources("source_name");
```

The `resources` function identifies the upstream or downstream system that you want your code to work with. The `source_name` is the string identifier of the particular system. The string should map to an associated identifier in your `app.json` to configure what's being connected to. For more details, see the `app.json` section.

```js
let records = await source.records("collection_name");
```

Once you've got `resources` set up, you can now stream records from it, but you need to identify what records you want. The `records` function identifies the records or events that you want to stream into your data app.

```js
let anonymized = await turbine.process(records, exports.Anonymize);
```

The `process` function is Turbine's way of saying, for the records that are coming in, I want you to process these records against a function. Once your app is deployed on Meroxa, Meroxa will do the work to take each record or event that does get streamed to your app and then run your code against it. This allows Meroxa to scale out your processing relative to the velocity of the records streaming in.

```js
await destination.write(anonymized, "collection_archive");
```

The `write` function is optional. It takes any records given to it and streams them to the downstream system. In many cases, you might not need to stream data to another system, but this gives you an easy way to do so.


#### Function API
The function passed to `process` is defined by the user with the following signature
```js
anonymize(records) {
  records.forEach((record) => {
    record.set(
      "customer_email",
      iAmHelping(stringHash(record.get("customer_email")))
    );
  });

  records.unwrapCDC();

  return records;
}
```

The `records` parameter is an array of records that can be iterated on. Each `record` in the `records` array comes with some handy functions for reading from/writing to the record's data as it passes through the function.

These functions are the preferred way for accessing data. They will work regardless if the data is CDC formatted or not (as long as the actual payload data is a valid JSON object)


```js
record.get('key') // Will retrieve the value at `key`
// or
record.get('nested.key.down.some.levels') // Will differentiate between keys with dots and levels of nesting
```



```js
record.set('key', 'some_value') // Will set `some_value` at `key`
// or
record.set('nested.key\\.with\\.dot', 'some_value') // Use \\ to set nested keys with dots
```


The `records` parameter itself comes with an optional but important function

```js
records.unwrapCDC();
```

A user can optionally use this transform in their data app function to unwrap CDC formatted records into the right format that destinations expect. Currently, most destinations will not accept CDC formatted data. **_(s3 being an exception)_**

A user **_will_** want to call this when records are going to any destination (usually at the end of the data app function).

A user **_will not_** want to call this when the records are going to an s3 destination AND they need the CDC format preserved

Note that this function only operates on CDC formatted data, and no ops otherwise.

### `app.json`

This file contains all of the options for configuring a Turbine app. Upon initialization of an app, the CLI will scaffold the file for you with available options:

```
{
  "name": "testapp",
  "language": "js",
  "environment": "common",
  "resources": {
    "source_name": "fixtures/path"
  }
}
```

* `name` - The name of your application. This should not change after app initialization.
* `language` - Tells Meroxa what language the app is upon deployment.
* `environment` - "common" is the only available environment. Meroxa does have the ability to create isolated environments but this feature is currently in beta.
* `resources` - These are the named integrations that you'll use in your application. The `source_name` needs to match the name of the resource that you'll set up in Meroxa using the `meroxa resources create` command or via the Dashboard. You can point to the path in the fixtures that'll be used to mock the resource when you run `meroxa apps run`.

### Fixtures

Fixtures are JSON-formatted samples of data records you can use while locally developing your Turbine app. Whether CDC or non-CDC-formatted data records, fixtures adhere to the following structure:

```json
{
  "collection_name": [
    {
      "key": "1",
      "value": {
		  "schema": {
			  //...
		  },
		  "payload": {
			  //...
		  }
		}
	}
  ]
```
* `collection_name` — Identifies the name of the records or events you are streaming to your data app.
* `key` — Denotes one or more sample records within a fixture file. `key` is always a string.
* `value` — Holds the `schema` and `payload` of the sample data record.
* `schema` — Comes as part of your sample data record. `schema` describes the record or event structure.
* `payload` — Comes as part of your sample data record. `payload` describes what about the record or event changed.

Your newly created data app should have a `demo-cdc.json` and `demo-non-cdc.json` in the `/fixtures` directory as examples to follow.

### Testing

Testing should follow standard NodeJS development practices. Included in the repo is a sample jest configuration, but you can use any testing framework you would use to test Node apps.

## Documentation && Reference

The most comprehensive documentation for Turbine and how to work with Turbine apps is on the Meroxa site: [https://docs.meroxa.com/](https://docs.meroxa.com)
