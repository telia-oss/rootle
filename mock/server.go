package main

import (
	"context"
	"log"
	"net"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	serverPb "mock/server"
)

type Server struct {
	serverPb.UnimplementedGreeterServer
}

func (s *Server) SayHello(ctx context.Context, in *serverPb.MockRequest) (*serverPb.MockReply, error) {
	client := in.Client
	agent := in.Agent
	log.Printf("Request client: %s, agent: %s", client, agent)
	return nil, status.Error(codes.Internal, "Self made error")
	// return &serverPb.MockReply{
	// 	Name: "something",
	// }, nil
}

func main() {
	lis, err := net.Listen("tcp", ":6000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	serverPb.RegisterGreeterServer(s, &Server{})

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve mock gRPC server: %v", err)
	}
}
