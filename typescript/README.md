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


## Install and usage

- install
```
npm i rootle
```

- usage
```
const log = new Rootle("123", "billing-Lambda");

log.info("Info, hello world!");
log.warn("Warn, hello world!")
log.error("Error, hello world!", {
    code: 500,
    host: "localhost"
}, "billing/user", 0);
```

## Output example
```
- Info: {"id":"123","application":"invoice-lambda","timestamp":1660307642,"message":"Hello World","level":"INFO","Downstream":{"code":0,"host":""}}

- Warn: {"id":"123","application":"invoice-lambda","timestamp":1660307642,"message":"Hello World","level":"WARN","Downstream":{"code":0,"host":""}}

- Error: {"id":"123","application":"invoice-lambda","timestamp":1660307642,"message":"Hello World","level":"ERROR","Downstream":{"code":500,"host":"localhost"},"StackTrace":"billing/user"}
```