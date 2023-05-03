import { RecordsArray, Records } from "../function/records";
import {
  Collection,
  Collection__Output,
} from "../proto_types/turbine_core/Collection";
import { Record } from "../proto_types/turbine_core/Record";

export function collectionToRecords(collection: Collection__Output): Records {
  const records = new RecordsArray();
  collection.records?.forEach((r) => {
    records.pushRecord({
      key: r.key,
      value: r.value.toString(),
      timestamp: r.timestamp,
    });
  });

  return {
    name: collection.name,
    stream: collection.stream,
    records,
  };
}

export function recordsToCollection(records: Records): Collection {
  let rec: Record[] = [];
  records.records.forEach((r: Record) => {
    rec.push({
      key: r.key,
      value: Buffer.from(JSON.stringify(r.value)),
      timestamp: r.timestamp,
    });
  });

  return {
    name: records.name,
    stream: records.stream,
    records: rec,
  };
}
