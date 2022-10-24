import fs from "fs";
import { Log } from '../rootle';

export class FileTransport {
  private fileName: string;
  private filePath: string;
  constructor(fileName: string, filePath: string) {
    this.fileName = fileName;
    this.filePath = filePath;
  }

  public writeLogTofile(log: Log) {
    const path = this.filePath + `/${this.fileName}.json`;
    if (fs.existsSync(path)) {
      const loggs: Log[] = read(path);
      if (!loggs) {
        fs.appendFile(path, JSON.stringify([log]) + '\n', () => { });
      } else {
        loggs.push(log);
        fs.writeFile(path, JSON.stringify(loggs) + '\n', () => { });
      }

    } else {
      const logFile = fs.createWriteStream(path, { flags: 'w' });
      const loggs: Log[] = [];
      loggs.push(log);
      logFile.write(JSON.stringify(loggs) + '\n');
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