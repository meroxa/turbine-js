// Original file: proto/turbine.proto

import type {
  Language as _turbine_core_Language,
  Language__Output as _turbine_core_Language__Output,
} from "./Language";

export interface InitRequest {
  appName?: string;
  configFilePath?: string;
  language?: _turbine_core_Language;
  gitSHA?: string;
  turbineVersion?: string;
}

export interface InitRequest__Output {
  appName: string;
  configFilePath: string;
  language: _turbine_core_Language__Output;
  gitSHA: string;
  turbineVersion: string;
}
