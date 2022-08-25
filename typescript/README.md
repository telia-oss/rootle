# Rootle

Cross language structured log library.

## Methods

| Name          | Parameters |
| ------------- | ------------- |
| Info          |(message)  |
| Warn         | (message)  |
| Error         | (message, downstream, stacktrace, code)  |

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


## Install and usage

- install
```
npm i rootle
```

- usage
```
const logger = new Rootle("ac12Cd-Aevd-12Grx-235f4", "billing-Lambda");

logger.info("Info, hello world!");
logger.warn("Warn, hello world!");

var json = {
    "foo": "bar"
};

logger.error("Error, hello world!", JSON.stringify(json), {
    http: {
        method: "GET",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        url: "http://localhost:8080/invoice/123",
        useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        referer: "http://localhost:8080/",
        payload: JSON.stringify(json)
    },
    grpc: {
        procedure: "GetInvoice",
        code:      GrpcCodes.INTERNAL,
        service:   "invoice",
        useragent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        referer:   "http://localhost:8080/",
        payload: JSON.stringify(json)
    }
}, "billing/user", 0);
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
