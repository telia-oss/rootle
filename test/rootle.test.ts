import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import Rootle, {
  FileTransport,
  GetRootle,
  GrpcCodes,
  HttpStatusCode,
  Interceptor,
} from "../src";

test("GetRootle throws before initialization", () => {
  assert.throws(() => GetRootle(), /Rootle has not been initialized/);
});

test("GetRootle returns the initialized instance", () => {
  const logger = new Rootle("logger-id", "billing-service");

  assert.equal(GetRootle(), logger);
});

test("info emits a JSON log with INFO level", () => {
  const logger = new Rootle("logger-id", "billing-service");
  const output: string[] = [];
  const originalConsoleLog = console.log;

  console.log = (message?: unknown) => {
    output.push(String(message));
  };

  try {
    logger.info("hello world");
  } finally {
    console.log = originalConsoleLog;
  }

  assert.equal(output.length, 1);
  const log = JSON.parse(output[0]) as Record<string, unknown>;
  assert.equal(log.id, "logger-id");
  assert.equal(log.application, "billing-service");
  assert.equal(log.message, "hello world");
  assert.equal(log.level, "INFO");
  assert.equal(typeof log.time, "string");
});

test("error emits downstream data and optional fields", () => {
  const logger = new Rootle("logger-id", "billing-service");
  const output: string[] = [];
  const originalConsoleLog = console.log;

  console.log = (message?: unknown) => {
    output.push(String(message));
  };

  try {
    logger.error(
      "request failed",
      JSON.stringify({ foo: "bar" }),
      {
        grpc: {
          procedure: "GetInvoice",
          code: GrpcCodes.INTERNAL,
          service: "invoice",
        },
        http: {
          method: "GET",
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
          url: "https://example.test/invoice/1",
        },
      },
      "stack-trace",
      1,
    );
  } finally {
    console.log = originalConsoleLog;
  }

  const log = JSON.parse(output[0]) as {
    event?: string;
    level: string;
    stackTrace?: string;
    code?: number;
    downstream?: {
      grpc?: { service?: string; procedure?: string; code?: number };
      http?: { statusCode?: number; method?: string };
    };
  };

  assert.equal(log.level, "ERROR");
  assert.equal(log.event, JSON.stringify({ foo: "bar" }));
  assert.equal(log.stackTrace, "stack-trace");
  assert.equal(log.code, 1);
  assert.equal(log.downstream?.grpc?.service, "invoice");
  assert.equal(log.downstream?.grpc?.procedure, "GetInvoice");
  assert.equal(log.downstream?.grpc?.code, GrpcCodes.INTERNAL);
  assert.equal(
    log.downstream?.http?.statusCode,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
  );
});

test("FileTransport persists logs to disk", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "rootle-test-"));

  try {
    const logger = new Rootle(
      "logger-id",
      "billing-service",
      undefined,
      new FileTransport({
        enable: true,
        filename: "logs",
        path: tempDir,
      }),
    );

    const originalConsoleLog = console.log;
    console.log = () => {};

    try {
      logger.info("first message");
      logger.warn("second message");
    } finally {
      console.log = originalConsoleLog;
    }

    const filePath = path.join(tempDir, "logs.json");
    const contents = fs.readFileSync(filePath, "utf8").trim();
    const logs = JSON.parse(contents) as Array<Record<string, unknown>>;

    assert.equal(logs.length, 2);
    assert.equal(logs[0].message, "first message");
    assert.equal(logs[0].level, "INFO");
    assert.equal(logs[1].message, "second message");
    assert.equal(logs[1].level, "WARN");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("package exports expose public API members", () => {
  assert.equal(typeof Rootle, "function");
  assert.equal(typeof FileTransport, "function");
  assert.equal(typeof GetRootle, "function");
  assert.equal(typeof Interceptor, "function");
  assert.equal(GrpcCodes.INTERNAL, 13);
  assert.equal(HttpStatusCode.INTERNAL_SERVER_ERROR, 500);
});
