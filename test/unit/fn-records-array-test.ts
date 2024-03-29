import sinon from "sinon";
import { RecordsArray } from "../../src/function/records";
import CDCFixture from "../fixtures/demo-cdc.json";

QUnit.module("Unit | fn-records-array", () => {
  QUnit.test("#pushRecord", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };
    const records = new RecordsArray();
    records.pushRecord(rawRecord);

    assert.strictEqual(records.length, 1);
    assert.strictEqual(records[0].constructor.name, "Record");
  });

  QUnit.test("#unwrap", (assert) => {
    const rawRecord = {
      key: CDCFixture.collection_name[0].key,
      value: JSON.stringify(CDCFixture.collection_name[0].value),
    };
    const records = new RecordsArray();
    records.pushRecord(rawRecord);

    const recordUnwrapStub = sinon.stub(records[0], "unwrap");
    records.unwrap();

    assert.ok(recordUnwrapStub.calledOnce);
  });
});
