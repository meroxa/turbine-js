import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { FunctionClient as _io_meroxa_funtime_FunctionClient, FunctionDefinition as _io_meroxa_funtime_FunctionDefinition } from './io/meroxa/funtime/Function';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  io: {
    meroxa: {
      funtime: {
        Function: SubtypeConstructor<typeof grpc.Client, _io_meroxa_funtime_FunctionClient> & { service: _io_meroxa_funtime_FunctionDefinition }
        ProcessRecordRequest: MessageTypeDefinition
        ProcessRecordResponse: MessageTypeDefinition
        Record: MessageTypeDefinition
      }
    }
  }
}

