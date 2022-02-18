"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
class Record {
    constructor(record) {
        this.key = null;
        this.value = {};
        this.timestamp = null;
        this._rawValue = null;
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
        }
        else {
            return this.value;
        }
    }
}
exports.Record = Record;
//# sourceMappingURL=record.js.map