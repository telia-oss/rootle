package rootle

import (
	"encoding/json"
	"log"
	"time"
)

type logger interface {
	Info(string)
}

type Log struct {
	ID         string `json:"id"`
	Timestamp  int64  `json:"timestamp"`
	Message    string `json:"message"`
	Level      string `json:"level"`
	Service    string `json:"service"`
	Status     int    `json:",omitempty"`
	StackTrace string `json:",omitempty"`
}

func (c *Rootle) Info(message string) {
	platform := ""
	if c.config.Platform != nil {
		platform = *c.config.Platform
	}
	rootleLog := Log{
		ID:        *c.config.ID,
		Timestamp: time.Now().Unix(),
		Message:   message,
		Level:     "INFO",
		Service:   *c.config.Service,
	}
	jsonLog, _ := json.Marshal(rootleLog)
	if platform == "js" {
		go func() {
			log.Println(string(jsonLog))
		}()
		return
	}
	log.Println(string(jsonLog))
}
