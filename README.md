<p align="center">
  <img src="https://github.com/telia-oss/rootle/blob/main/media/logo.png?raw=true" alt="Rootle"/>
</p>


Cross language structured log APIs and, [error log gRPC client interceptor](./interceptor/README.md).

## Methods

| Name          | Parameters |
| ------------- | ------------- |
| Info          |(message)  |
| Warn          | (message)  |
| Error         | (message, event, downstream, stacktrace, code)  |

## Log structure

| Field         | Type          | Required
| ------------- | ------------- | ------------- |
| id            | string        |Yes            |
| application   | string        |Yes            |
| timestamp     | Timestamp     |Yes            |
| message       | string        |Yes            |
| level         | string        |Yes            |
| event         | string        |No             |
| downstream    | Downstream    |No             |
| stacktrace    | string        |No             |
| code "exit code"  | int       |No             |

###  Downstream structure

| Field         | Type          | Required
| ------------- | ------------- | ------------- |
| http          | Http          |No             |
| grpc          | Grpc          |No             |

####  Http structure

| Field         | Type          | Required
| ------------- | ------------- | ------------- |
| method        | string        |No             |
| statusCode    | HttpStatusCode(enum) |No      |
| url           | string        |No             |
| useragent     | string        |No             |
| referer       | string        |No             |
| payload       | string        |No             |

####  Grpc structure

| Field         | Type          | Required
| ------------- | ------------- | ------------- |
| procedure     | string        |No             |
| code          | GrpcCodes(enum) |No           |
| service       | string        |No             |
| useragent     | string        |No             |
| referer       | string        |No             |
| payload       | string        |No             |

## Usage

[Examples](https://github.com/telia-oss/rootle/tree/master/example)

- Go
```

import (
	rootle "github.com/telia-oss/rootle"
)

	ctx := context.Background()

logger := rootle.New(ctx, *rootle.NewConfig().WithID("ac12Cd-Aevd-12Grx-235f4").WithApplication("invoice-lambda"))

logger.Info("Hello World")
logger.Warn("Hello World")

data := map[string]interface{}{
  "foo": "bar",
}

json, _ := json.Marshal(data)

logger.Error("Hello World", rootle.String(string(json)), &rootle.Downstream{
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
```
- [TypeScript](./typescript/README.md)

- Kotlin
```
val logger = Rootle("ac12Cd-Aevd-12Grx-235f4", "Billing-lambda")

logger.info("Hello World")
logger.warn("Hello World")

  val jsonObject = JsonObject()
  jsonObject.addProperty("foo", "bar")

  // Can be set in Rootle initlization `Rootle(id, application, event)`
  logger.setEvent(jsonObject.toString())

  logger.error("Error message", rootle.Downstream(rootle.Http("GET", StatusCode.InternalServerError.code, "http://localhost:8080/invoice/123",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
          "http://localhost:8080/",  jsonObject.toString()),
          rootle.Grpc("GetInvoice", GrpcCodes.internalError.code, "invoice",
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
                  "http://localhost:8080/", jsonObject.toString())), "billing/user", 0);

```
## Output example
```
- Info: {"id":"ac12Cd-Aevd-12Grx-235f4","application":"invoice-lambda","timestamp":1660741987,"message":"Hello World","level":"INFO"}

- Warn: {"id":"ac12Cd-Aevd-12Grx-235f4","application":"invoice-lambda","timestamp":1660741987,"message":"Hello World","level":"WARN"}

- Error: 
{
   "id":"ac12Cd-Aevd-12Grx-235f4",
   "application":"invoice-lambda",
   "timestamp":1660910613,
   "message":"Hello World",
   "level":"ERROR",
   "event":"{\"foo\":\"bar\"}",
   "downstream":{
      "grpc":{
         "procedure":"GetInvoice",
         "code":13,
         "service":"invoice",
         "useragent":"\t/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
         "referer":"http://localhost:8080/",
         "payload":"{\"foo\":\"bar\"}"
      },
      "http":{
         "method":"GET",
         "status_code":500,
         "url":"http://localhost:8080/invoice/123",
         "useragent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
         "referer":"http://localhost:8080/",
         "payload":"{\"foo\":\"bar\"}"
      }
   },
   "stackTrace":"billing/user",
   "code":0
}
```
