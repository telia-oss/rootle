package logger

import (
	"context"
	"encoding/json"
	"log"
	"time"
)

type Log struct {
	ID          string      `json:"id"`
	Application string      `json:"application"`
	Timestamp   int64       `json:"timestamp"`
	Message     string      `json:"message"`
	Level       string      `json:"level"`
	Event       *string     `json:"event,omitempty"`
	Downstream  *Downstream `json:"downstream,omitempty"`
	StackTrace  *string     `json:"stackTrace,omitempty"`
	Code        *int        `json:"code,omitempty"`
}

type Downstream struct {
	Grpc *Grpc `json:"grpc,omitempty"`
	Http *Http `json:"http,omitempty"`
}

type Http struct {
	Method     string         `json:"method"`
	StatusCode HttpStatusCode `json:"status_code"`
	Url        string         `json:"url"`
	Useragent  string         `json:"useragent"`
	Referer    string         `json:"referer"`
	Payload    string         `json:"payload,omitempty"`
}

type Grpc struct {
	Procedure string    `json:"procedure"`
	Code      GrpcCodes `json:"code"`
	Service   string    `json:"service"`
	Useragent string    `json:"useragent"`
	Referer   string    `json:"referer"`
	Payload   string    `json:"payload,omitempty"`
}

type GrpcCodes int64
type HttpStatusCode int64

const (
	Ok                  GrpcCodes = 0
	CANCELLED           GrpcCodes = 1
	UNKNOWN             GrpcCodes = 2
	INVALID_ARGUMENT    GrpcCodes = 3
	DEADLINE_EXCEEDED   GrpcCodes = 4
	NOT_FOUNd           GrpcCodes = 5
	ALREADY_EXISTS      GrpcCodes = 6
	PERMISSION_DENIED   GrpcCodes = 7
	RESOURCE_EXHAUSTED  GrpcCodes = 8
	FAILED_PRECONDITION GrpcCodes = 9
	ABORTED             GrpcCodes = 10
	OUT_OF_RANGE        GrpcCodes = 11
	UNIMPLEMENTED       GrpcCodes = 12
	INTERNAL            GrpcCodes = 13
	UNAVAILABLE         GrpcCodes = 14
	DATA_LOSS           GrpcCodes = 15
	UNAUTHENTICATED     GrpcCodes = 16
)

const (
	CONTINUE                        HttpStatusCode = 100
	SWITCHING_PROTOCOLS             HttpStatusCode = 101
	PROCESSING                      HttpStatusCode = 102
	OK                              HttpStatusCode = 200
	CREATED                         HttpStatusCode = 201
	ACCEPTED                        HttpStatusCode = 202
	NON_AUTHORITATIVE_INFORMATION   HttpStatusCode = 203
	NO_CONTENT                      HttpStatusCode = 204
	RESET_CONTENT                   HttpStatusCode = 205
	PARTIAL_CONTENT                 HttpStatusCode = 206
	MULTI_STATUS                    HttpStatusCode = 207
	ALREADY_REPORTED                HttpStatusCode = 208
	IM_USED                         HttpStatusCode = 226
	MULTIPLE_CHOICES                HttpStatusCode = 300
	MOVED_PERMANENTLY               HttpStatusCode = 301
	FOUND                           HttpStatusCode = 302
	SEE_OTHER                       HttpStatusCode = 303
	NOT_MODIFIED                    HttpStatusCode = 304
	USE_PROXY                       HttpStatusCode = 305
	SWITCH_PROXY                    HttpStatusCode = 306
	TEMPORARY_REDIRECT              HttpStatusCode = 307
	PERMANENT_REDIRECT              HttpStatusCode = 308
	BAD_REQUEST                     HttpStatusCode = 400
	UNAUTHORIZED                    HttpStatusCode = 401
	PAYMENT_REQUIRED                HttpStatusCode = 402
	FORBIDDEN                       HttpStatusCode = 403
	NOT_FOUND_                      HttpStatusCode = 404
	METHOD_NOT_ALLOWED              HttpStatusCode = 405
	NOT_ACCEPTABLE                  HttpStatusCode = 406
	PROXY_AUTHENTICATION_REQUIRED   HttpStatusCode = 407
	REQUEST_TIMEOUT                 HttpStatusCode = 408
	CONFLICT                        HttpStatusCode = 409
	GONE                            HttpStatusCode = 410
	LENGTH_REQUIRED                 HttpStatusCode = 411
	PRECONDITION_FAILED             HttpStatusCode = 412
	PAYLOAD_TOO_LARGE               HttpStatusCode = 413
	URI_TOO_LONG                    HttpStatusCode = 414
	UNSUPPORTED_MEDIA_TYPE          HttpStatusCode = 415
	RANGE_NOT_SATISFIABLE           HttpStatusCode = 416
	EXPECTATION_FAILED              HttpStatusCode = 417
	I_AM_A_TEAPOT                   HttpStatusCode = 418
	MISDIRECTED_REQUEST             HttpStatusCode = 421
	UNPROCESSABLE_ENTITY            HttpStatusCode = 422
	LOCKED                          HttpStatusCode = 423
	FAILED_DEPENDENCY               HttpStatusCode = 424
	UPGRADE_REQUIRED                HttpStatusCode = 426
	PRECONDITION_REQUIRED           HttpStatusCode = 428
	TOO_MANY_REQUESTS               HttpStatusCode = 429
	REQUEST_HEADER_FIELDS_TOO_LARGE HttpStatusCode = 431
	UNAVAILABLE_FOR_LEGAL_REASONS   HttpStatusCode = 451
	INTERNAL_SERVER_ERROR           HttpStatusCode = 500
	NOT_IMPLEMENTED                 HttpStatusCode = 501
	BAD_GATEWAY                     HttpStatusCode = 502
	SERVICE_UNAVAILABLE             HttpStatusCode = 503
	GATEWAY_TIMEOUT                 HttpStatusCode = 504
	HTTP_VERSION_NOT_SUPPORTED      HttpStatusCode = 505
	VARIANT_ALSO_NEGOTIATES         HttpStatusCode = 506
	INSUFFICIENT_STORAGE            HttpStatusCode = 507
	LOOP_DETECTED                   HttpStatusCode = 508
	NOT_EXTENDED                    HttpStatusCode = 510
	NETWORK_AUTHENTICATION_REQUIRED HttpStatusCode = 511
)

var localRootle *Config

func New(ctx context.Context, conf Config) *Config {
	localRootle = &conf
	return &conf
}

func GetRootle() *Config {
	return localRootle
}

func logMessage(c Config, message string, level string, event *string, downstream *Downstream, stackTrace *string, code *int, callback func(logJSON string)) {
	rootleLog := Log{
		ID:          *c.ID,
		Application: *c.Application,
		Timestamp:   time.Now().Unix(),
		Message:     message,
		Level:       level,
	}
	if level == "ERROR" {
		rootleLog.Event = event
		rootleLog.Downstream = downstream
		rootleLog.StackTrace = stackTrace
		rootleLog.Code = code
	}
	jsonLog, _ := json.Marshal(rootleLog)
	callback(string(jsonLog))
}

func (c *Config) Info(message string) {
	logMessage(*c, message, "INFO", nil, nil, nil, nil, func(logJSON string) {
		log.Println(logJSON)
	})
}

func (c *Config) Warn(message string) {
	logMessage(*c, message, "WARN", nil, nil, nil, nil, func(logJSON string) {
		log.Println(logJSON)
	})
}

func (c *Config) Error(message string, event *string, downstream *Downstream, stackTrace *string, code *int) {
	logMessage(*c, message, "ERROR", event, downstream, stackTrace, code, func(logJSON string) {
		log.Println(logJSON)
	})
}

func String(s string) *string {
	return &s
}

func Int(i int) *int {
	return &i
}
