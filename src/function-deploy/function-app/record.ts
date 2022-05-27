import get from "get-value";
import set from "set-value";

export class Record {
  key = null;
  value: { [key: string]: any } = {};
  timestamp = null;
  _rawValue = null;

  constructor(record: any) {
    this._rawValue = record.value;
    this.key = record.key;
    this.value = JSON.parse(record.value);
    this.timestamp = record.timestamp;
  }

  deserialize() {
    return this;
  }

  serialize() {
    return {
      key: this.key,
      value: JSON.stringify(this.value),
      timestamp: this.timestamp,
    };
  }

  get isJSONSchema() {
    return this.value.payload && this.value.schema;
  }

  get isCDCFormat() {
    return this.isJSONSchema && this.value.payload.source;
  }

  get(key: string) {
    if (this.isCDCFormat) {
      return get(this.value.payload.after, key);
    } else {
      return get(this.value.payload, key);
    }
  }

  set(key: string, value: any) {
    if (this.isCDCFormat) {
      return set(this.value.payload.after, key, value);
    } else {
      return set(this.value.payload, key, value);
    }
  }

  unwrapCDC() {
    if (this.isCDCFormat) {
      const payload = this.value.payload;
      const schemaFields = this.value.schema.fields;
      const afterField = schemaFields.find(
        (field: any) => field.field === "after"
      );
      if (afterField) {
        delete afterField.field;
        afterField.name = this.value.schema.name;
        this.value.schema = afterField;
      }

      this.value.payload = payload.after;
    }
  }
}

export class RecordsArray extends Array {
  pushRecord(rawRecord: any) {
    this.push(new Record(rawRecord));
  }

  unwrapCDC() {
    this.forEach((record: Record) => {
      record.unwrapCDC();
    });
  }
}
