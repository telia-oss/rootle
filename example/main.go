package main

import (
	rootle "github.com/telia-oss/rootle"
)

func main() {

	logger := rootle.New(*rootle.NewConfig().WithID("123").WithApplication("invoice-lambda"))

	logger.Info("Hello World")
	logger.Warn("Hello World")

	logger.Error("Hello World", rootle.Downstream{
		Http: &rootle.Http{
			Method:     "GET",
			StatusCode: rootle.INTERNAL_SERVER_ERROR,
			Url:        "http://localhost:8080/invoice/123",
			Useragent:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
			Referer:    "http://localhost:8080/",
		},
		Grpc: &rootle.Grpc{
			Procedure: "GetInvoice",
			Code:      rootle.INTERNAL,
			Service:   "invoice",
			Useragent: "	/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
			Referer: "http://localhost:8080/",
		},
	}, "billing/user", 0)
}
