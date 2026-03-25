<p align="center">
  <img src="https://github.com/telia-oss/rootle/blob/main/media/logo.png?raw=true" alt="Rootle"/>
</p>

Rootle is now a TypeScript-first structured logging library with an optional gRPC client interceptor exported from the same package.

## Install

```bash
npm install rootle
```

## Usage

```ts
import Rootle, {
  FileTransport,
  GetRootle,
  GrpcCodes,
  HttpStatusCode,
  Interceptor,
} from "rootle";

const logger = new Rootle(
  "ac12Cd-Aevd-12Grx-235f4",
  "billing-lambda",
  {
    referer: "client",
    useragent: "agent",
  },
  new FileTransport({
    enable: true,
    filename: "logs",
    path: process.cwd(),
  }),
);

logger.info("Hello world");
logger.warn("Warn, hello world!");
logger.error("Error, hello world!", JSON.stringify({ foo: "bar" }), {
  http: {
    method: "GET",
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    url: "http://localhost:8080/invoice/123",
  },
  grpc: {
    procedure: "GetInvoice",
    code: GrpcCodes.INTERNAL,
    service: "invoice",
  },
});

const sameLogger = GetRootle();
sameLogger.info("Using the shared logger instance");

void Interceptor;
```

The valid single-module import form is:

```ts
import Rootle, { Interceptor, GetRootle, FileTransport } from "rootle";
```

## API

### Logger methods

| Name    | Parameters                                       |
| ------- | ------------------------------------------------ |
| `info`  | `(message)`                                      |
| `warn`  | `(message)`                                      |
| `error` | `(message, event, downstream, stackTrace, code)` |

### Log shape

| Field         | Type         | Required |
| ------------- | ------------ | -------- |
| `id`          | `string`     | Yes      |
| `application` | `string`     | Yes      |
| `time`        | `string`     | Yes      |
| `message`     | `string`     | Yes      |
| `level`       | `string`     | Yes      |
| `event`       | `string`     | No       |
| `downstream`  | `Downstream` | No       |
| `stackTrace`  | `string`     | No       |
| `code`        | `number`     | No       |

## gRPC Interceptor

`Interceptor` is exported from the main package. Configure `referer` and `useragent` field names through the `Rootle` constructor if you want the interceptor to map incoming request fields into the logged gRPC payload.

## Examples

TypeScript examples live in [example](./example).
