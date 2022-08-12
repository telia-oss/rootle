declare interface Downstream {
    code: number;
    host: string;
}

declare interface Log {
    id: string;
    application: string;
    timestamp: number;
    message: string;
    level: string;
    Downstream?: Downstream;
    StackTrace?: string;
    Code?: number;
}

declare interface Logger {
    (logJson: string): void;
  }
  

export default class Rootle {
    id: string;
    application: string;

    constructor(id: string, application: string) {
        this.id = id;
        this.application = application;
    }

    logMessage(message: string, level: string, callback: Logger) {
        const log: Log = {
            id: this.id,
            application: this.application,
            timestamp: Date.now(),
            message: message,
            level: level
        };
        callback(JSON.stringify(log));

    }
    public info(message: string) {
        this.logMessage(message, "INFO", (logJson) => {
            console.log(logJson);
        });
    }

}