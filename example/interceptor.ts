import * as grpc from "@grpc/grpc-js";

import Rootle, { FileTransport } from '../typescript/dist/rootle';
import * as grpcService from "./server";
import Interceptor from "../typescript/interceptor/dist/interceptor";

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
  }, new FileTransport({
    enable: true,
    filename: "logs",
    path: __dirname
}));

  logger.info("START");
  logger.info("START");
  logger.info("START");

  return new Promise<any>((resolve, reject) => {
    client.sayHello({
      agent: "Mozila",
      client: "server-a"
    }, (err, response) => {
      if (err) {
        if (err.code === grpc.status.NOT_FOUND) {
          return resolve(response);
        }
        return reject(err)
      }
      return resolve(response.name);
    });
  });
};

main().then((resp) => {
  console.log(resp);
}).catch(err => {
  // console.log("main func error");
});
