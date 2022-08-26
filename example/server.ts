/* eslint-disable */
import {
  makeGenericClientConstructor,
  ChannelCredentials,
  ChannelOptions,
  UntypedServiceImplementation,
  handleUnaryCall,
  Client,
  ClientUnaryCall,
  Metadata,
  CallOptions,
  ServiceError,
} from "@grpc/grpc-js";
import * as _m0 from "protobufjs/minimal";

export interface MockRequest {
  client: string;
  agent: string;
}

export interface MockReply {
  name: string;
}

function createBaseMockRequest(): MockRequest {
  return { client: "", agent: "" };
}

export const MockRequest = {
  encode(
    message: MockRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.client !== "") {
      writer.uint32(10).string(message.client);
    }
    if (message.agent !== "") {
      writer.uint32(18).string(message.agent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MockRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMockRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.client = reader.string();
          break;
        case 2:
          message.agent = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial<I extends Exact<DeepPartial<MockRequest>, I>>(
    object: I
  ): MockRequest {
    const message = createBaseMockRequest();
    message.client = object.client ?? "";
    message.agent = object.agent ?? "";
    return message;
  },
};

function createBaseMockReply(): MockReply {
  return { name: "" };
}

export const MockReply = {
  encode(
    message: MockReply,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MockReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMockReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromPartial<I extends Exact<DeepPartial<MockReply>, I>>(
    object: I
  ): MockReply {
    const message = createBaseMockReply();
    message.name = object.name ?? "";
    return message;
  },
};

export type GreeterService = typeof GreeterService;
export const GreeterService = {
  sayHello: {
    path: "/server.Greeter/SayHello",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: MockRequest) =>
      Buffer.from(MockRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => MockRequest.decode(value),
    responseSerialize: (value: MockReply) =>
      Buffer.from(MockReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => MockReply.decode(value),
  },
} as const;

export interface GreeterServer extends UntypedServiceImplementation {
  sayHello: handleUnaryCall<MockRequest, MockReply>;
}

export interface GreeterClient extends Client {
  sayHello(
    request: MockRequest,
    callback: (error: ServiceError | null, response: MockReply) => void
  ): ClientUnaryCall;
  sayHello(
    request: MockRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: MockReply) => void
  ): ClientUnaryCall;
  sayHello(
    request: MockRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: MockReply) => void
  ): ClientUnaryCall;
}

export const GreeterClient = makeGenericClientConstructor(
  GreeterService,
  "server.Greeter"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): GreeterClient;
  service: typeof GreeterService;
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };
