// Original file: proto/service.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  ProcessRecordRequest as _io_meroxa_funtime_ProcessRecordRequest,
  ProcessRecordRequest__Output as _io_meroxa_funtime_ProcessRecordRequest__Output,
} from "./ProcessRecordRequest";
import type {
  ProcessRecordResponse as _io_meroxa_funtime_ProcessRecordResponse,
  ProcessRecordResponse__Output as _io_meroxa_funtime_ProcessRecordResponse__Output,
} from "./ProcessRecordResponse";

export interface FunctionClient extends grpc.Client {
  Process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  Process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  Process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  Process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
  process(
    argument: _io_meroxa_funtime_ProcessRecordRequest,
    callback: grpc.requestCallback<_io_meroxa_funtime_ProcessRecordResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface FunctionHandlers extends grpc.UntypedServiceImplementation {
  Process: grpc.handleUnaryCall<
    _io_meroxa_funtime_ProcessRecordRequest__Output,
    _io_meroxa_funtime_ProcessRecordResponse
  >;
}

export interface FunctionDefinition extends grpc.ServiceDefinition {
  Process: MethodDefinition<
    _io_meroxa_funtime_ProcessRecordRequest,
    _io_meroxa_funtime_ProcessRecordResponse,
    _io_meroxa_funtime_ProcessRecordRequest__Output,
    _io_meroxa_funtime_ProcessRecordResponse__Output
  >;
}
