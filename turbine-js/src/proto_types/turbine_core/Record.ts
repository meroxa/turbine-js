// Original file: proto/turbine.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';

export interface Record {
  'key'?: (string);
  'value'?: (Buffer | Uint8Array | string);
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface Record__Output {
  'key': (string);
  'value': (Buffer);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
