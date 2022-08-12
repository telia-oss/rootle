package rootle

import (
	"encoding/json"
	"log"
	"time"
)

type Downstream struct {
	Code int    `json:"code"`
	Host string `json:"host"`
}

type Log struct {
	ID          string     `json:"id"`
	Application string     `json:"application"`
	Timestamp   int64      `json:"timestamp"`
	Message     string     `json:"message"`
	Level       string     `json:"level"`
	Downstream  Downstream `json:",omitempty"`
	StackTrace  string     `json:",omitempty"`
	Code        int        `json:",omitempty"` // exit code
}

func New(conf Config) *Config {
	return &conf
}

func logMessage(c Config, message string, level string, downstream *Downstream, stackTrace *string, code *int, callback func(logJSON string)) {
	rootleLog := Log{
		ID:          *c.ID,
		Application: *c.Application,
		Timestamp:   time.Now().Unix(),
		Message:     message,
		Level:       level,
	}
	if level == "ERROR" {
		rootleLog.Downstream = *downstream
		rootleLog.StackTrace = *stackTrace
		rootleLog.Code = *code
	}
	jsonLog, _ := json.Marshal(rootleLog)
	callback(string(jsonLog))
}

func (c *Config) Info(message string) {
	logMessage(*c, message, "INFO", nil, nil, nil, func(logJSON string) {
		log.Println(logJSON)
	})
}

func (c *Config) Warn(message string) {
	logMessage(*c, message, "WARN", nil, nil, nil, func(logJSON string) {
		log.Println(logJSON)
	})
}

func (c *Config) Error(message string, downstream Downstream, stackTrace string, code int) {
	logMessage(*c, message, "ERROR", &downstream, &stackTrace, &code, func(logJSON string) {
		log.Println(logJSON)
	})
}
