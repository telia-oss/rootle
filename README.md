# Rootle

Cross language structured log library.

## Methods

| Name          | Parameters |
| ------------- | ------------- |
| Info          |(message)  |
| Warn         | (message)  |
| Error         | (message, downstream, stacktrace, code)  |

## Log message structure

| Field | type |
| ------------- | ------------- |
| id  | string  |
| application  | string  |
| timestamp  | Timestamp  |
| message  | string  |
| level  | string  |
| downstream  | Downstream  |
| stacktrace  | string  |
| code "exit code"  | int  |


## Languages

- Go
```

import (
	rootle "github.com/telia-oss/rootle"
)

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
    Referer:   "http://localhost:8080/",
  },
}, "billing/user", 0)
```
- TypeScript
```
import Rootle, {HttpStatusCode, GrpcCodes}  from 'rootle';

const logger = new Rootle("123", "billing-Lambda");

logger.info("Info, hello world!");
logger.warn("Warn, hello world!")
logger.error("Error, hello world!", {
    http: {
        method: "GET",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        url: "http://localhost:8080/invoice/123",
        useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        referer: "http://localhost:8080/"
    },
    grpc: {
        procedure: "GetInvoice",
        code:      GrpcCodes.INTERNAL,
        service:   "invoice",
        useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        referer:   "http://localhost:8080/",
    }
}, "billing/user", 0);
```
- Kotlin
```
val logger = Rootle("123", "Billing-lambda")

logger.info("Hello World")
logger.warn("Hello World")
logger.error("Hello World", rootle.Downstream(rootle.Http("GET", StatusCode.InternalServerError.code, "http://localhost:8080/invoice/123", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36", "http://localhost:8080/"),
        rootle.Grpc("GetInvoice", GrpcCodes.internalError.code, "invoice", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",  "http://localhost:8080/")), "billing/user", 0)
```
## Output example
```
- Info: {"id":"123","application":"invoice-lambda","timestamp":1660741987,"message":"Hello World","level":"INFO"}

- Warn: {"id":"123","application":"invoice-lambda","timestamp":1660741987,"message":"Hello World","level":"WARN"}

- Error: {"id":"123","application":"invoice-lambda","timestamp":1660741987,"message":"Hello World","level":"ERROR","Downstream":{"grpc":{"procedure":"GetInvoice","code":13,"service":"invoice","useragent":"\t/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36","referer":"http://localhost:8080/"},"http":{"method":"GET","status_code":500,"url":"http://localhost:8080/invoice/123","useragent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36","referer":"http://localhost:8080/"}},"StackTrace":"billing/user"}

```
