import Rootle, {HttpStatusCode, GrpcCodes}  from '../typescript/dist/rootle';

const logger = new Rootle("ac12Cd-Aevd-12Grx-235f4", "billing-Lambda");

logger.info("Info, hello world!");
logger.warn("Warn, hello world!");

const json = {
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
