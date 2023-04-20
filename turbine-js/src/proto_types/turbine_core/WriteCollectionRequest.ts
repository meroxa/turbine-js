// Original file: proto/turbine.proto

import type {
  Resource as _turbine_core_Resource,
  Resource__Output as _turbine_core_Resource__Output,
} from "./Resource";
import type {
  Collection as _turbine_core_Collection,
  Collection__Output as _turbine_core_Collection__Output,
} from "./Collection";
import type {
  Configs as _turbine_core_Configs,
  Configs__Output as _turbine_core_Configs__Output,
} from "./Configs";

export interface WriteCollectionRequest {
  resource?: _turbine_core_Resource | null;
  sourceCollection?: _turbine_core_Collection | null;
  targetCollection?: string;
  configs?: _turbine_core_Configs | null;
}

export interface WriteCollectionRequest__Output {
  resource: _turbine_core_Resource__Output | null;
  sourceCollection: _turbine_core_Collection__Output | null;
  targetCollection: string;
  configs: _turbine_core_Configs__Output | null;
}
