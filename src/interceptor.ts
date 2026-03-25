import {
  InterceptingCall,
  Listener,
  Metadata,
  Requester,
  StatusObject,
  status as grpcStatus,
} from "@grpc/grpc-js";
import { GetRootle, type InterceptorRequestSources, GrpcCodes } from "./rootle";

interface InterceptorOptions {
  method_definition: {
    path: string;
  };
}

const getRequestField = (
  message: unknown,
  requestSources: InterceptorRequestSources | undefined,
  field: keyof InterceptorRequestSources,
): string => {
  if (!message || typeof message !== "object") {
    return "";
  }

  const requestFieldName = requestSources?.[field];
  if (!requestFieldName) {
    return "";
  }

  const value = (message as Record<string, unknown>)[requestFieldName];
  return typeof value === "string" ? value : "";
};

const Interceptor = (
  options: InterceptorOptions,
  nextCall: (options: InterceptorOptions) => InterceptingCall,
): InterceptingCall => {
  let savedReceiveMessage: unknown;
  let savedSendMessage: unknown;
  let savedMessageNext: ((message: unknown) => void) | undefined;
  const servicePath = options.method_definition.path.split("/");
  const service = servicePath[1] || "";
  const procedure = servicePath[2] || "";

  const requester: Requester = {
    start(
      metadata: Metadata,
      listener: Listener,
      next: (metadata: Metadata, listener: Listener) => void,
    ) {
      const newListener: Listener = {
        onReceiveMessage(
          message: unknown,
          receiveNext: (message: unknown) => void,
        ) {
          savedReceiveMessage = message;
          savedMessageNext = receiveNext;
        },
        onReceiveStatus(
          status: StatusObject,
          receiveStatusNext: (status: StatusObject) => void,
        ) {
          if (status.code !== grpcStatus.OK) {
            const logger = GetRootle();
            const requestSources = logger.getInterceptorRequestSources();
            const referer = getRequestField(
              savedSendMessage,
              requestSources,
              "referer",
            );
            const useragent = getRequestField(
              savedSendMessage,
              requestSources,
              "useragent",
            );
            const payload =
              savedSendMessage === undefined
                ? undefined
                : JSON.stringify(savedSendMessage);
            const grpcCode = Number.parseInt(
              status.code.toString(),
              10,
            ) as GrpcCodes;

            logger.error(
              status.details,
              payload,
              {
                grpc: {
                  procedure,
                  code: grpcCode,
                  service,
                  useragent,
                  referer,
                  payload,
                },
              },
              status.details,
              1,
            );
          }

          savedMessageNext?.(savedReceiveMessage);
          receiveStatusNext(status);
        },
      };

      next(metadata, newListener);
    },
    sendMessage(message: unknown, next: (message: unknown) => void) {
      savedSendMessage = message;
      next(message);
    },
  };

  return new InterceptingCall(nextCall(options), requester);
};

export default Interceptor;
