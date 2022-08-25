package interceptor

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	"github.com/telia-oss/rootle"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func ClientInterceptor(
	ctx context.Context,
	method string,
	req interface{},
	reply interface{},
	cc *grpc.ClientConn,
	invoker grpc.UnaryInvoker,
	opts ...grpc.CallOption,
) error {
	// Calls the invoker to execute RPC
	err := invoker(ctx, method, req, reply, cc, opts...)

	// Logic after invoking the invoker
	if err != nil {
		// Rootle logic
		request := fmt.Sprintf("%v", req)
		serviceName := strings.Split(strings.Split(method, "/")[1], ".")[1]
		procedure := strings.Split(method, "/")[2]
		// Create Rootle gRPC error log
		grpcErrorLog := &rootle.Grpc{
			Procedure: procedure,
			Service:   serviceName,
			Payload:   request,
		}

		logger := rootle.GetRootle()

		// Get Rootle grpc referer and useragent
		var referer string = ""
		var useragent string = ""
		refererKey := logger.Interceptor.Referer
		agentKey := logger.Interceptor.Useragent

		requestPayload := reflect.ValueOf(req).Elem()
		referer = requestPayload.FieldByName(refererKey).String()
		useragent = requestPayload.FieldByName(agentKey).String()

		grpcErrorLog.Referer = referer
		grpcErrorLog.Useragent = useragent

		// Get error message and code from Error
		var message string
		var code codes.Code
		if grpcError, ok := status.FromError(err); ok {
			message = grpcError.Message()
			code = grpcError.Code()
		} else {
			message = err.Error()
			code = codes.Unknown
		}
		grpcErrorLog.Code = rootle.GrpcCodes(code)

		// Log error
		logger.Error(message, rootle.String(request), &rootle.Downstream{
			Grpc: grpcErrorLog,
		}, rootle.String(err.Error()), rootle.Int(1))
	}
	return err
}
