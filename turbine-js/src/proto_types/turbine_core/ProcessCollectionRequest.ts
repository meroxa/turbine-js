// Original file: proto/turbine.proto

import type {
  Collection as _turbine_core_Collection,
  Collection__Output as _turbine_core_Collection__Output,
} from "./Collection";

export interface _turbine_core_ProcessCollectionRequest_Process {
  name?: string;
}

export interface _turbine_core_ProcessCollectionRequest_Process__Output {
  name: string;
}

export interface ProcessCollectionRequest {
  process?: _turbine_core_ProcessCollectionRequest_Process | null;
  collection?: _turbine_core_Collection | null;
}

export interface ProcessCollectionRequest__Output {
  process: _turbine_core_ProcessCollectionRequest_Process__Output | null;
  collection: _turbine_core_Collection__Output | null;
}
