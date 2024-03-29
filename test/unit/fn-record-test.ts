import { Record } from "../../src/function/records";
import CDCFixture from "../fixtures/demo-cdc.json";
import nonCDCFixture from "../fixtures/demo-no-cdc.json";

QUnit.module("Unit | fn-record", () => {
  QUnit.test("#constructor", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const subject = new Record(rawRecord);

    assert.strictEqual(subject.key, CDCFixture.collection_name[0].key);
    assert.deepEqual(subject.value, CDCFixture.collection_name[0].value);
  });

  QUnit.test("#serialize", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    const subject = record.serialize();

    assert.strictEqual(subject.key, record.key);
    assert.strictEqual(subject.value, JSON.stringify(record.value));
  });

  QUnit.test("#isJSONSchema with CDC data", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);

    assert.ok(record.isJSONSchema);
  });

  QUnit.test("#isJSONSchema with non CDC but json schema data", (assert) => {
    const rawRecord = {
      key: nonCDCFixture.collection_name[0].key,
      value: JSON.stringify(nonCDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);

    assert.ok(record.isJSONSchema);
  });

  QUnit.test("#isCDCFormat with CDC data", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);

    assert.ok(record.isCDCFormat);
  });

  QUnit.test("#isCDCFormat with non CDC data", (assert) => {
    const rawRecord = {
      key: nonCDCFixture.collection_name[0].key,
      value: JSON.stringify(nonCDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);

    assert.notOk(record.isCDCFormat);
  });

  QUnit.test("#get with CDC data", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    const subject = record.get("customer_email");

    assert.strictEqual(
      subject,
      CDCFixture.collection_name[0].value.payload.after.customer_email,
    );
  });

  QUnit.test("#get with non CDC data", (assert) => {
    const rawRecord = {
      key: nonCDCFixture.collection_name[0].key,
      value: JSON.stringify(nonCDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    const subject = record.get("customer_email");

    assert.strictEqual(
      subject,
      nonCDCFixture.collection_name[0].value.payload.customer_email,
    );
  });

  QUnit.test("#set with CDC data", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    record.set("customer_email", "vessel@sleeptoken.com");

    assert.strictEqual(
      record.value.payload.after.customer_email,
      "vessel@sleeptoken.com",
    );
  });

  QUnit.test("#set with CDC data and a new field", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    record.set("customer_email_too", "vessel@sleeptoken.com");

    assert.strictEqual(
      record.value.payload.after.customer_email_too,
      "vessel@sleeptoken.com",
    );

    assert.deepEqual(
      record.value.schema.fields
        .find((f) => f.field === "after")
        .fields.find((f) => f.field === "customer_email_too"),
      {
        field: "customer_email_too",
        optional: true,
        type: "string",
      },
    );
  });

  QUnit.test("#set with non CDC data", (assert) => {
    const rawRecord = {
      key: nonCDCFixture.collection_name[0].key,
      value: JSON.stringify(nonCDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    record.set("customer_email", "vessel@sleeptoken.com");

    assert.strictEqual(
      record.value.payload.customer_email,
      "vessel@sleeptoken.com",
    );
  });

  QUnit.test("#set with non CDC data and a new field", (assert) => {
    const rawRecord = {
      key: nonCDCFixture.collection_name[0].key,
      value: JSON.stringify(nonCDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    record.set("customer_email_too", "vessel@sleeptoken.com");

    assert.strictEqual(
      record.value.payload.customer_email_too,
      "vessel@sleeptoken.com",
    );

    assert.deepEqual(
      record.value.schema.fields.find((f) => f.field === "customer_email_too"),
      {
        field: "customer_email_too",
        optional: true,
        type: "string",
      },
    );
  });

  QUnit.test("#unwrap with CDC data", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    record.unwrap();

    assert.notOk(record.value.schema.after);
    assert.strictEqual(
      record.value.schema.name,
      "resource.public.collection_name.Envelope",
    );
    assert.strictEqual(
      record.value.payload.customer_email,
      "usera@example.com",
    );
  });

  QUnit.test("#unwrap with non CDC data", (assert) => {
    const rawRecord = {
      key: nonCDCFixture.collection_name[0].key,
      value: JSON.stringify(nonCDCFixture.collection_name[0].value),
    };

    const record = new Record(rawRecord);
    record.unwrap();

    assert.notOk(record.value.schema.after);
    assert.strictEqual(record.value.schema.name, "collection_name");
    assert.strictEqual(
      record.value.payload.customer_email,
      "usera@example.com",
    );
  });
});
