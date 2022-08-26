import * as grpc from "@grpc/grpc-js";

import Rootle from '../typescript/dist/rootle';
import * as grpcService from "./server";
import Interceptor from "rootle-grpc-interceptor";

const client = new grpcService.GreeterClient(
    "localhost:6000",
    grpc.credentials.createInsecure(),
    {
        interceptors: [Interceptor],
    })

const main = () => {

  const logger = new Rootle("ac12Cd-Aevd-12Grx-235f4", "billing-Lambda", {
    referer: "client",
    useragent: "agent"
  });
  logger.info("START");

  return new Promise<string>((resolve, reject) => {
    client.sayHello({
      agent: "Mozila",
      client: "server-a"
    }, (err, response) => {
      if (err) {
          reject(err)
      }
      return resolve(response.name);
    });
  });
};

main().then((resp) => {
  console.log(resp);
}).catch(err => {
  console.log(err);
});
