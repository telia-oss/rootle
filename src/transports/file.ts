import fs from "node:fs";
import path from "node:path";
import type { Log } from "../rootle";

export interface FileTransportConfig {
  filename: string;
  path: string;
  enable: boolean;
}

export class FileTransport {
  public constructor(private readonly config: FileTransportConfig) {}

  public writeLogToFile(log: Log): void {
    if (!this.config.enable) {
      return;
    }

    const filePath = path.join(
      this.config.path,
      `${this.config.filename}.json`,
    );
    const logs = this.readLogs(filePath);
    logs.push(log);
    fs.writeFileSync(filePath, JSON.stringify(logs) + "\n");
  }

  private readLogs(filePath: string): Log[] {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, "utf8").trim();
    if (!content) {
      return [];
    }

    return JSON.parse(content) as Log[];
  }
}
