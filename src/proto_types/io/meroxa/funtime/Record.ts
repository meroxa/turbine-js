// Original file: proto/service.proto

import type { Long } from '@grpc/proto-loader';

export interface Record {
  'key'?: (string);
  'value'?: (string);
  'timestamp'?: (number | string | Long);
}

export interface Record__Output {
  'key': (string);
  'value': (string);
  'timestamp': (Long);
}
