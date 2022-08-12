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
    private id: string;
    private application: string;

    constructor(id: string, application: string) {
        this.id = id;
        this.application = application;
    }

    // @ts-ignore
    private logMessage(message: string, level: string, downstream?: Downstream, stackTrace?: string, code?: number, callback: Logger) {
        const log: Log = {
            id: this.id,
            application: this.application,
            timestamp: Date.now(),
            message: message,
            level: level
        };
        if (level === "ERROR") {
            log.Downstream = downstream
            log.StackTrace = stackTrace
            log.Code = code
        }

        callback(JSON.stringify(log));

    }
    public info(message: string) {
        this.logMessage(message, "INFO", undefined, undefined, undefined, (logJson) => {
            console.log(logJson);
        });
    }

    public warn(message: string) {
        this.logMessage(message, "WARN", undefined, undefined, undefined, (logJson) => {
            console.log(logJson);
        });
    }

    public error(message: string, downstream: Downstream, stackTrace: string, code: number) {
        this.logMessage(message, "ERROR", downstream, stackTrace, code, (logJson) => {
            console.log(logJson);
        });
    }


}