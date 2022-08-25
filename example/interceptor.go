package main

import (
	"context"
	"log"
	"time"

	"mock/server"

	"github.com/telia-oss/rootle"
	"github.com/telia-oss/rootle/interceptor"
	"google.golang.org/grpc"
)

// NewClient creates gRPC client and connection
func NewClient(address string) (server.GreeterClient, *grpc.ClientConn, error) {
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock(), grpc.WithUnaryInterceptor(interceptor.ClientInterceptor))
	if err != nil {
		return nil, nil, err
	}
	client := server.NewGreeterClient(conn)
	return client, conn, nil
}

func sayHello() (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	client, conn, err := NewClient("localhost:6000")
	if err != nil {
		log.Fatalf("fail: %v", err)
	}
	defer conn.Close()
	defer cancel()
	resp, cerr := client.SayHello(ctx, &server.MockRequest{
		Client: "server-a",
		Agent:  "Mozila",
	})
	if cerr != nil {
		return "", cerr
	}
	return resp.Name, nil
}

func main() {

	ctx := context.Background()

	requestHeaders := rootle.InterceptorRequestSources{
		Useragent: "Agent",
		Referer:   "Client",
	}

	logger := rootle.New(ctx, *rootle.NewConfig().WithID("ac12Cd-Aevd-12Grx-235f4").WithApplication("invoice-lambda").WithInterceptor(requestHeaders))

	logger.Info("Hello World")

	rep, err := sayHello()
	if err != nil {
		log.Print("error")
	} else {
		log.Printf("reply: %s", rep)
	}

}
