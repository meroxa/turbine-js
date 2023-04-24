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
    try {
      this.value = JSON.parse(record.value);
    } catch (e: any) {
      this.value = record.value;
    }

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
    return !!(this.value.payload && this.value.schema);
  }

  get isCDCFormat() {
    return !!(this.isJSONSchema && !!this.value.payload.source);
  }

  get(key: string) {
    if (this.isCDCFormat) {
      return get(this.value.payload.after, key);
    } else {
      return get(this.value.payload, key);
    }
  }

  set(key: string, value: any) {
    const payload = this.isCDCFormat
      ? this.value.payload.after
      : this.value.payload;

    let fieldExists = get(payload, key, {
      default: new Error("notFound"),
    });

    if (fieldExists instanceof Error && fieldExists.message === "notFound") {
      const schema = get(this.value, "schema.fields");

      const newSchemaField = {
        field: key,
        optional: true,
        type: this.#typeOfValue(value),
      };

      if (this.isCDCFormat) {
        const schemaFields = schema.find((f: any) => f.field === "after");
        schemaFields.fields.unshift(newSchemaField);
      } else {
        schema.unshift(newSchemaField);
      }
    }

    return set(payload, key, value);
  }

  unwrap() {
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

  #typeOfValue(value: string) {
    const typeOfValue = typeof value;
    const typeMap: { [index: string]: string } = {
      boolean: "boolean",
      string: "string",
      // lol javascript
      // we cannot safely infer OR define int types
      // we could consider custom user config that we validate
      number: "int32",
    };

    return typeMap[typeOfValue] || "unsupported";
  }
}

export class RecordsArray extends Array {
  pushRecord(rawRecord: any) {
    this.push(new Record(rawRecord));
  }

  unwrap() {
    this.forEach((record: Record) => {
      record.unwrap();
    });
  }
}

export interface Records {
  records: RecordsArray;
  stream: string;
}
