import Rootle  from '../typescript/dist/rootle';

const log = new Rootle("123", "billing-Lambda");

log.info("Info, hello world!");
log.warn("Warn, hello world!")
log.error("Error, hello world!", {
    code: 500,
    host: "localhost"
}, "billing/user", 0);
