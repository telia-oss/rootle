import fs from "fs";
import { Log } from '../rootle';

type config = {
  filename: string,
  path: string,
  enable: boolean
}
export class FileTransport {
  private config: config;
  constructor(config: config) {
    this.config = config;
  }

  public writeLogTofile(log: Log) {
    if (!this.config.enable) return;
    const path = this.config.path + `/${this.config.filename}.json`;
    if (fs.existsSync(path)) {
      const logs: Log[] = read(path);
      if (!logs) {
        fs.appendFileSync(path, JSON.stringify([log]) + '\n');
      } else {
        logs.push(log);
        fs.writeFileSync(path, JSON.stringify(logs) + '\n');
      }

    } else {
      const logs: Log[] = [];
      logs.push(log);
      fs.writeFileSync(path, JSON.stringify(logs) + '\n');
    }
  }
}

function read(path: string) {
  const content = fs.readFileSync(path, 'utf8');
  if (!content) {
    return null;
  }
  return JSON.parse(content);
}