## Rootle gRPC client interceptor 

Error log gRPC client uses [Rootle](https://github.com/telia-oss/rootle#grpc-structure) log API to log gRPC errors.

## Referer and User-Agent

gRPC interceptors has the incoming request as an input to tell the Rootle interceptor which filed in the incoming request should be used as `Refere` and, `Useragent` a struct of type `InterceptorRequestSources` must be passed to the `New` function `WithInterceptor(requestHeaders)`

Not implemented for Kotlin interceptor

```
requestHeaders := rootle.InterceptorRequestSources{
    Useragent: "Agent",
    Referer:   "Client",
}

The code above will tell the interceptor to look for field in the request named `Agent` to use it as a `Useragent` and a field named `Clinet` to use it as a `Referer`
```

## Usage

- Go
```

import (
	rootle "github.com/telia-oss/rootle"
)

ctx := context.Background()

requestHeaders := rootle.InterceptorRequestSources{
    Useragent: "Agent",
    Referer:   "Client",
}

logger := rootle.New(ctx, *rootle.NewConfig().WithID("ac12Cd-Aevd-12Grx-235f4").WithApplication("invoice-lambda").WithInterceptor(requestHeaders))


conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock(), grpc.WithUnaryInterceptor(interceptor.ClientInterceptor))

```

- Kotlin
```
import rootle.Interceptor

val logger = Rootle("ac12Cd-Aevd-12Grx-235f4", "invoice-lambda")

private val stub: ServiceCoroutineStub = ServiceCoroutineStub(ClientInterceptors.intercept(channel, Interceptor()))
```

- [TypeScript](../typescript/interceptor/README.md)