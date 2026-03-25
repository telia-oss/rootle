# Rootle

Cross language structured log library.

## Methods

| Name  | Parameters                              |
| ----- | --------------------------------------- |
| Info  | (message)                               |
| Warn  | (message)                               |
| Error | (message, downstream, stacktrace, code) |

## Transports

File transport, allows writting logs to file

```
const logger = new Rootle("ac12Cd-Aevd-12Grx-235f4", "billing-Lambda", undefined, new FileTransport({
    enable: true,
    filename: "logs",
    path: __dirname
}));
```

## Log structure

| Field            | Type       | Required |
| ---------------- | ---------- | -------- |
| id               | string     | Yes      |
| application      | string     | Yes      |
| time             | string     | Yes      |
| message          | string     | Yes      |
| level            | string     | Yes      |
| event            | string     | No       |
| downstream       | Downstream | No       |
| stacktrace       | string     | No       |
| code "exit code" | int        | No       |

### Downstream structure

| Field | Type | Required |
| ----- | ---- | -------- |
| http  | Http | No       |
| grpc  | Grpc | No       |

#### Http structure

| Field      | Type                 | Required |
| ---------- | -------------------- | -------- |
| method     | string               | No       |
| statusCode | HttpStatusCode(enum) | No       |
| url        | string               | No       |
| useragent  | string               | No       |
| referer    | string               | No       |
| payload    | string               | No       |

#### Grpc structure

| Field     | Type            | Required |
| --------- | --------------- | -------- |
| procedure | string          | No       |
| code      | GrpcCodes(enum) | No       |
| service   | string          | No       |
| useragent | string          | No       |
| referer   | string          | No       |
| payload   | string          | No       |

## Install and usage

- install

```
npm i @telia/rootle
```

- import

```
import Rootle, { Interceptor, GetRootle, HttpStatusCode, GrpcCodes, FileTransport } from '@telia/rootle';
```

- gRPC client with interceptor

```
import * as grpc from '@grpc/grpc-js';
import Rootle, { Interceptor } from '@telia/rootle';

const logger = new Rootle('ac12Cd-Aevd-12Grx-235f4', 'billing-Lambda', {
    referer: 'client',
    useragent: 'agent',
});

new grpcService.GreeterClient('localhost:6000', grpc.credentials.createInsecure(), {
    interceptors: [Interceptor],
});
```

## Publish to JFrog

Set your JFrog npm registry URL and auth token before publishing.

```
export NPM_REGISTRY_URL="https://<your-company>.jfrog.io/artifactory/api/npm/<npm-repo>/"
export JFROG_TOKEN="<token>"
```

Add scoped registry auth in your user npm config (`~/.npmrc`):

```
@telia:registry=${NPM_REGISTRY_URL}
//<your-company>.jfrog.io/artifactory/api/npm/<npm-repo>/:_authToken=${JFROG_TOKEN}
always-auth=true
```

You can also copy [`.npmrc.example`](./.npmrc.example) into your project-level `.npmrc` and replace placeholders.

Build and publish:

```
npm ci
npm run build
npm run publish:jfrog
```

Then consume as a normal dependency:

```
npm i @telia/rootle
```

## GitHub CI Publish on Tag

A GitHub Actions workflow is included in [../.github/workflows/publish-typescript-on-tag.yml](../.github/workflows/publish-typescript-on-tag.yml).

It publishes `@telia/rootle` automatically when a tag matching `v*` is pushed.
The workflow validates that the git tag matches the package version in `typescript/package.json`:

- package version `0.8.0` requires git tag `v0.8.0`

You can also run the workflow manually from the GitHub web UI with `Run workflow`.
When running it manually, provide the `tag` input and use the same version format, for example `v0.8.0`.

Required GitHub repository variables:

- `JF_URL` (example: `https://jfrog.teliacompany.io`)
- `JFROG_NPM_REPO` (Artifactory npm repo key, for example `npm-local`)

Required GitHub setup:

- Configure OIDC provider `github-cloud` in JFrog
- Allow audience `github-cloud`

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
- Info: {"id":"ac12Cd-Aevd-12Grx-235f4","application":"invoice-lambda","time": "2006-01-02T15:04:05.999999999Z","message":"Hello World","level":"INFO"}

- Warn: {"id":"ac12Cd-Aevd-12Grx-235f4","application":"invoice-lambda","time": "2006-01-02T15:04:05.999999999Z","message":"Hello World","level":"WARN"}

- Error:
{
   "id":"ac12Cd-Aevd-12Grx-235f4",
   "application":"invoice-lambda",
   "time": "2006-01-02T15:04:05.999999999Z",
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
