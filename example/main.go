package main

import (
	"encoding/json"

	rootle "github.com/telia-oss/rootle"
)

func main() {

	logger := rootle.New(*rootle.NewConfig().WithID("ac12Cd-Aevd-12Grx-235f4").WithApplication("invoice-lambda"))

	logger.Info("Hello World")
	logger.Warn("Hello World")

	data := map[string]interface{}{
		"foo": "bar",
	}

	json, _ := json.Marshal(data)

	logger.WithEvent(string(json))

	logger.Error("Hello World", &rootle.Downstream{
		Http: &rootle.Http{
			Method:     "GET",
			StatusCode: rootle.INTERNAL_SERVER_ERROR,
			Url:        "http://localhost:8080/invoice/123",
			Useragent:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
			Referer:    "http://localhost:8080/",
			Payload:    string(json),
		},
		Grpc: &rootle.Grpc{
			Procedure: "GetInvoice",
			Code:      rootle.INTERNAL,
			Service:   "invoice",
			Useragent: "	/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
			Referer: "http://localhost:8080/",
			Payload: string(json),
		},
	}, rootle.String("billing/user"), rootle.Int(0))
}
