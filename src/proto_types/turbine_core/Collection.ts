// Original file: proto/turbine.proto

import type {
  Record as _turbine_core_Record,
  Record__Output as _turbine_core_Record__Output,
} from "./Record";

export interface Collection {
  name?: string;
  stream?: string;
  records?: _turbine_core_Record[];
}

export interface Collection__Output {
  name: string;
  stream: string;
  records: _turbine_core_Record__Output[];
}
