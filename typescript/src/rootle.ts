declare interface Downstream {
    grpc?: Grpc;
    http?: Http;
}

declare interface Http {
    method: string;
    statusCode: HttpStatusCode;
    url: string;
    useragent: string;
    referer: string;
}

declare interface Grpc {
    procedure: string;
    code: GrpcCodes;
    service: string;
    useragent: string;
    referer: string;
}

declare interface Log {
    id: string;
    application: string;
    timestamp: number;
    message: string;
    level: string;
    downstream?: Downstream;
    stackTrace?: string;
    code?: number;
}

export enum GrpcCodes {
    OK = 0,
    CANCELLED = 1,
    UNKNOWN = 2,
    INVALID_ARGUMENT = 3,
    DEADLINE_EXCEEDED = 4,
    NOT_FOUND = 5,
    ALREADY_EXISTS = 6,
    PERMISSION_DENIED = 7,
    RESOURCE_EXHAUSTED = 8,
    FAILED_PRECONDITION = 9,
    ABORTED = 10,
    OUT_OF_RANGE = 11,
    UNIMPLEMENTED = 12,
    INTERNAL = 13,
    UNAVAILABLE = 14,
    DATA_LOSS = 15,
    UNAUTHENTICATED = 16,
}
export enum HttpStatusCode {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    IM_USED = 226,
    MULTIPLE_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    USE_PROXY = 305,
    SWITCH_PROXY = 306,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED_REQUEST = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    UPGRADE_REQUIRED = 426,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
    UNAVAILABLE_FOR_LEGAL_REASONS = 451,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    VARIANT_ALSO_NEGOTIATES = 506,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508,
    NOT_EXTENDED = 510,
    NETWORK_AUTHENTICATION_REQUIRED = 511
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
            log.downstream = downstream
            log.stackTrace = stackTrace
            log.code = code
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