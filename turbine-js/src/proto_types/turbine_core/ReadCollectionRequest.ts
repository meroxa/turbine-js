// Original file: proto/turbine.proto

import type {
  Resource as _turbine_core_Resource,
  Resource__Output as _turbine_core_Resource__Output,
} from "./Resource";
import type {
  Configs as _turbine_core_Configs,
  Configs__Output as _turbine_core_Configs__Output,
} from "./Configs";

export interface ReadCollectionRequest {
  resource?: _turbine_core_Resource | null;
  collection?: string;
  configs?: _turbine_core_Configs | null;
}

export interface ReadCollectionRequest__Output {
  resource: _turbine_core_Resource__Output | null;
  collection: string;
  configs: _turbine_core_Configs__Output | null;
}
