import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { TurbineServiceClient as _turbine_core_TurbineServiceClient, TurbineServiceDefinition as _turbine_core_TurbineServiceDefinition } from './turbine_core/TurbineService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
      Empty: MessageTypeDefinition
      FloatValue: MessageTypeDefinition
      Int32Value: MessageTypeDefinition
      Int64Value: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
      UInt32Value: MessageTypeDefinition
      UInt64Value: MessageTypeDefinition
    }
  }
  turbine_core: {
    Collection: MessageTypeDefinition
    Config: MessageTypeDefinition
    Configs: MessageTypeDefinition
    GetResourceRequest: MessageTypeDefinition
    GetSpecRequest: MessageTypeDefinition
    GetSpecResponse: MessageTypeDefinition
    InitRequest: MessageTypeDefinition
    Language: EnumTypeDefinition
    ListResourcesResponse: MessageTypeDefinition
    ProcessCollectionRequest: MessageTypeDefinition
    ReadCollectionRequest: MessageTypeDefinition
    Record: MessageTypeDefinition
    Resource: MessageTypeDefinition
    Secret: MessageTypeDefinition
    TurbineService: SubtypeConstructor<typeof grpc.Client, _turbine_core_TurbineServiceClient> & { service: _turbine_core_TurbineServiceDefinition }
    WriteCollectionRequest: MessageTypeDefinition
  }
}

