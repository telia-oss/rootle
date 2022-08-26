## Rootle gRPC client interceptor 

Error log gRPC client uses [Rootle](https://github.com/telia-oss/rootle#grpc-structure) log API to log gRPC errors.

## Support 

| Language      | Status |
| ------------- | ------------- |
| Go            |Yes |
| TypeScript    |Yes  |
| Kotlin        | WIP|

## Referer and User-Agent

gRPC interceptors has the incoming request as an input to tell the Rootle interceptor which filed in the incoming request should be used as `referer` and, `useragent` an interface of type `InterceptorRequestSources` must be passed to the `Rootle` constructor. 

```
requestHeaders := rootle.InterceptorRequestSources{
    useragent: "agent",
    referer:   "client",
}

The code above will tell the interceptor to look for field in the request named `Agent` to use it as a `useragent` and a field named `Clinet` to use it as a `referer`
```

## Usage

```
import Rootle from 'rootle';
import Interceptor from 'rootle-grpc-interceptor';

const logger = new Rootle("ac12Cd-Aevd-12Grx-235f4", "billing-Lambda", {
referer: "client",
useragent: "agent"
});


new grpcService.GreeterClient(
    "localhost:6000",
    grpc.credentials.createInsecure(),
    {
        interceptors: [Interceptor],
    })

```
