import {
    InterceptingCall,
    Metadata,
    Listener,
    Requester,
    StatusObject,
    status as grpcStatus
} from "@grpc/grpc-js";

import { GrpcCodes, GetRootle } from 'rootle';

const Interceptor = function (options: any, nextCall: Function) {
    let savedReceiveMessage: any;
    let savedSendMessage: any
    let savedMessageNext: Function;
    const servicePath = options.method_definition.path.split('/');
    const service = servicePath[1].split('.')[1] || "";
    const procedure = servicePath[2] || "";

    const requester: Requester = {
        start: function (metadata: Metadata, listener: Listener, next: Function) {
            const newListener = {
                onReceiveMessage: function (message: any, next: Function) {
                    savedReceiveMessage = message;
                    savedMessageNext = next;
                },
                onReceiveStatus: function (status: StatusObject, next: any) {
                    if (status.code !== grpcStatus.OK) {
                        // Rootle log
                        const logger = GetRootle()
                        const interceptorRequestSources = logger.getInterceptorRequestSources()
                        const refererKey = interceptorRequestSources?.referer;
                        const useragentKey = interceptorRequestSources?.useragent;
                        const referer = refererKey? savedSendMessage[refererKey] : "";
                        const useragent = useragentKey? savedSendMessage[useragentKey] : "";
                        const grpcCode: GrpcCodes = parseInt(status.code.toString()); 
                        logger.error(status.details, JSON.stringify(savedSendMessage), 
                        {
                            grpc: {
                                procedure,
                                code: grpcCode,
                                service,
                                useragent,
                                referer,
                                payload: JSON.stringify(savedSendMessage)
                            }
                        }, status.details, 1);
                    } else {
                        savedMessageNext(savedReceiveMessage);
                        next(status);
                    }

                }
            };
            next(metadata, newListener);
        },
        sendMessage: function (message, next) {
            savedSendMessage = message;
            next(message);
        }
    };

    return new InterceptingCall(nextCall(options), requester);
};

export default Interceptor;