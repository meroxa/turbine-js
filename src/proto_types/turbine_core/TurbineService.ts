// Original file: proto/turbine.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  BoolValue as _google_protobuf_BoolValue,
  BoolValue__Output as _google_protobuf_BoolValue__Output,
} from "../google/protobuf/BoolValue";
import type {
  Collection as _turbine_core_Collection,
  Collection__Output as _turbine_core_Collection__Output,
} from "./Collection";
import type {
  Empty as _google_protobuf_Empty,
  Empty__Output as _google_protobuf_Empty__Output,
} from "../google/protobuf/Empty";
import type {
  GetResourceRequest as _turbine_core_GetResourceRequest,
  GetResourceRequest__Output as _turbine_core_GetResourceRequest__Output,
} from "./GetResourceRequest";
import type {
  GetSpecRequest as _turbine_core_GetSpecRequest,
  GetSpecRequest__Output as _turbine_core_GetSpecRequest__Output,
} from "./GetSpecRequest";
import type {
  GetSpecResponse as _turbine_core_GetSpecResponse,
  GetSpecResponse__Output as _turbine_core_GetSpecResponse__Output,
} from "./GetSpecResponse";
import type {
  InitRequest as _turbine_core_InitRequest,
  InitRequest__Output as _turbine_core_InitRequest__Output,
} from "./InitRequest";
import type {
  ListResourcesResponse as _turbine_core_ListResourcesResponse,
  ListResourcesResponse__Output as _turbine_core_ListResourcesResponse__Output,
} from "./ListResourcesResponse";
import type {
  ProcessCollectionRequest as _turbine_core_ProcessCollectionRequest,
  ProcessCollectionRequest__Output as _turbine_core_ProcessCollectionRequest__Output,
} from "./ProcessCollectionRequest";
import type {
  ReadCollectionRequest as _turbine_core_ReadCollectionRequest,
  ReadCollectionRequest__Output as _turbine_core_ReadCollectionRequest__Output,
} from "./ReadCollectionRequest";
import type {
  Resource as _turbine_core_Resource,
  Resource__Output as _turbine_core_Resource__Output,
} from "./Resource";
import type {
  Secret as _turbine_core_Secret,
  Secret__Output as _turbine_core_Secret__Output,
} from "./Secret";
import type {
  WriteCollectionRequest as _turbine_core_WriteCollectionRequest,
  WriteCollectionRequest__Output as _turbine_core_WriteCollectionRequest__Output,
} from "./WriteCollectionRequest";

export interface TurbineServiceClient extends grpc.Client {
  AddProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  AddProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  AddProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  AddProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  addProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  addProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  addProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  addProcessToCollection(
    argument: _turbine_core_ProcessCollectionRequest,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;

  GetResource(
    argument: _turbine_core_GetResourceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  GetResource(
    argument: _turbine_core_GetResourceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  GetResource(
    argument: _turbine_core_GetResourceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  GetResource(
    argument: _turbine_core_GetResourceRequest,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  getResource(
    argument: _turbine_core_GetResourceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  getResource(
    argument: _turbine_core_GetResourceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  getResource(
    argument: _turbine_core_GetResourceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;
  getResource(
    argument: _turbine_core_GetResourceRequest,
    callback: grpc.requestCallback<_turbine_core_Resource__Output>
  ): grpc.ClientUnaryCall;

  GetSpec(
    argument: _turbine_core_GetSpecRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  GetSpec(
    argument: _turbine_core_GetSpecRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  GetSpec(
    argument: _turbine_core_GetSpecRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  GetSpec(
    argument: _turbine_core_GetSpecRequest,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  getSpec(
    argument: _turbine_core_GetSpecRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  getSpec(
    argument: _turbine_core_GetSpecRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  getSpec(
    argument: _turbine_core_GetSpecRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;
  getSpec(
    argument: _turbine_core_GetSpecRequest,
    callback: grpc.requestCallback<_turbine_core_GetSpecResponse__Output>
  ): grpc.ClientUnaryCall;

  HasFunctions(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  HasFunctions(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  HasFunctions(
    argument: _google_protobuf_Empty,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  HasFunctions(
    argument: _google_protobuf_Empty,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  hasFunctions(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  hasFunctions(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  hasFunctions(
    argument: _google_protobuf_Empty,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;
  hasFunctions(
    argument: _google_protobuf_Empty,
    callback: grpc.requestCallback<_google_protobuf_BoolValue__Output>
  ): grpc.ClientUnaryCall;

  Init(
    argument: _turbine_core_InitRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  Init(
    argument: _turbine_core_InitRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  Init(
    argument: _turbine_core_InitRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  Init(
    argument: _turbine_core_InitRequest,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  init(
    argument: _turbine_core_InitRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  init(
    argument: _turbine_core_InitRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  init(
    argument: _turbine_core_InitRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  init(
    argument: _turbine_core_InitRequest,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;

  ListResources(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  ListResources(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  ListResources(
    argument: _google_protobuf_Empty,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  ListResources(
    argument: _google_protobuf_Empty,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  listResources(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  listResources(
    argument: _google_protobuf_Empty,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  listResources(
    argument: _google_protobuf_Empty,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;
  listResources(
    argument: _google_protobuf_Empty,
    callback: grpc.requestCallback<_turbine_core_ListResourcesResponse__Output>
  ): grpc.ClientUnaryCall;

  ReadCollection(
    argument: _turbine_core_ReadCollectionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  ReadCollection(
    argument: _turbine_core_ReadCollectionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  ReadCollection(
    argument: _turbine_core_ReadCollectionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  ReadCollection(
    argument: _turbine_core_ReadCollectionRequest,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  readCollection(
    argument: _turbine_core_ReadCollectionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  readCollection(
    argument: _turbine_core_ReadCollectionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  readCollection(
    argument: _turbine_core_ReadCollectionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;
  readCollection(
    argument: _turbine_core_ReadCollectionRequest,
    callback: grpc.requestCallback<_turbine_core_Collection__Output>
  ): grpc.ClientUnaryCall;

  RegisterSecret(
    argument: _turbine_core_Secret,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  RegisterSecret(
    argument: _turbine_core_Secret,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  RegisterSecret(
    argument: _turbine_core_Secret,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  RegisterSecret(
    argument: _turbine_core_Secret,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  registerSecret(
    argument: _turbine_core_Secret,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  registerSecret(
    argument: _turbine_core_Secret,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  registerSecret(
    argument: _turbine_core_Secret,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  registerSecret(
    argument: _turbine_core_Secret,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;

  WriteCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  WriteCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  WriteCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  WriteCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  writeCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  writeCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  writeCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
  writeCollectionToResource(
    argument: _turbine_core_WriteCollectionRequest,
    callback: grpc.requestCallback<_google_protobuf_Empty__Output>
  ): grpc.ClientUnaryCall;
}

export interface TurbineServiceHandlers
  extends grpc.UntypedServiceImplementation {
  AddProcessToCollection: grpc.handleUnaryCall<
    _turbine_core_ProcessCollectionRequest__Output,
    _turbine_core_Collection
  >;

  GetResource: grpc.handleUnaryCall<
    _turbine_core_GetResourceRequest__Output,
    _turbine_core_Resource
  >;

  GetSpec: grpc.handleUnaryCall<
    _turbine_core_GetSpecRequest__Output,
    _turbine_core_GetSpecResponse
  >;

  HasFunctions: grpc.handleUnaryCall<
    _google_protobuf_Empty__Output,
    _google_protobuf_BoolValue
  >;

  Init: grpc.handleUnaryCall<
    _turbine_core_InitRequest__Output,
    _google_protobuf_Empty
  >;

  ListResources: grpc.handleUnaryCall<
    _google_protobuf_Empty__Output,
    _turbine_core_ListResourcesResponse
  >;

  ReadCollection: grpc.handleUnaryCall<
    _turbine_core_ReadCollectionRequest__Output,
    _turbine_core_Collection
  >;

  RegisterSecret: grpc.handleUnaryCall<
    _turbine_core_Secret__Output,
    _google_protobuf_Empty
  >;

  WriteCollectionToResource: grpc.handleUnaryCall<
    _turbine_core_WriteCollectionRequest__Output,
    _google_protobuf_Empty
  >;
}

export interface TurbineServiceDefinition extends grpc.ServiceDefinition {
  AddProcessToCollection: MethodDefinition<
    _turbine_core_ProcessCollectionRequest,
    _turbine_core_Collection,
    _turbine_core_ProcessCollectionRequest__Output,
    _turbine_core_Collection__Output
  >;
  GetResource: MethodDefinition<
    _turbine_core_GetResourceRequest,
    _turbine_core_Resource,
    _turbine_core_GetResourceRequest__Output,
    _turbine_core_Resource__Output
  >;
  GetSpec: MethodDefinition<
    _turbine_core_GetSpecRequest,
    _turbine_core_GetSpecResponse,
    _turbine_core_GetSpecRequest__Output,
    _turbine_core_GetSpecResponse__Output
  >;
  HasFunctions: MethodDefinition<
    _google_protobuf_Empty,
    _google_protobuf_BoolValue,
    _google_protobuf_Empty__Output,
    _google_protobuf_BoolValue__Output
  >;
  Init: MethodDefinition<
    _turbine_core_InitRequest,
    _google_protobuf_Empty,
    _turbine_core_InitRequest__Output,
    _google_protobuf_Empty__Output
  >;
  ListResources: MethodDefinition<
    _google_protobuf_Empty,
    _turbine_core_ListResourcesResponse,
    _google_protobuf_Empty__Output,
    _turbine_core_ListResourcesResponse__Output
  >;
  ReadCollection: MethodDefinition<
    _turbine_core_ReadCollectionRequest,
    _turbine_core_Collection,
    _turbine_core_ReadCollectionRequest__Output,
    _turbine_core_Collection__Output
  >;
  RegisterSecret: MethodDefinition<
    _turbine_core_Secret,
    _google_protobuf_Empty,
    _turbine_core_Secret__Output,
    _google_protobuf_Empty__Output
  >;
  WriteCollectionToResource: MethodDefinition<
    _turbine_core_WriteCollectionRequest,
    _google_protobuf_Empty,
    _turbine_core_WriteCollectionRequest__Output,
    _google_protobuf_Empty__Output
  >;
}
