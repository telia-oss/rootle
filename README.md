# Rootle
This project is still WIP and, not ready for production use.

Cross language structured log library.

## Languages

- Go
```
rootle := rt.New(*rt.NewConfig().WithID("123").WithApplication("invoice-lambda"))

rootle.Info("Hello World")
rootle.Warn("Hello World")

rootle.Error("Hello World", rt.Downstream{
  Code: 500,
  Host: "localhost",
}, "billing/user", 0)
```
- TypeScript
```
const log = new Rootle("123", "billing-Lambda");

log.info("Info, hello world!");
log.warn("Warn, hello world!")
log.error("Error, hello world!", {
    code: 500,
    host: "localhost"
}, "billing/user", 0);
```
- Kotlin
```
val rootle = Rootle("123", "Billing-lambda")

rootle.info("Hello World")
rootle.warn("Hello World")
rootle.error("Hello World", rootle.Downstream(500, "localhost"), "billing/user", 0)
```

## Motivation

- Automate logs of cross-language projects ie. FaaS.
- Automate logs from multiple projects written in different languages.

