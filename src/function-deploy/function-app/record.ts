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

  get data() {
    if (this.isJSONSchema) {
      return this.value.payload;
    } else {
      return this.value;
    }
  }
}
