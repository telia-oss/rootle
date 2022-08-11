package rootle

import (
	"encoding/json"
	"log"
	"time"
)

type Log struct {
	ID          string `json:"id"`
	Timestamp   int64  `json:"timestamp"`
	Message     string `json:"message"`
	Level       string `json:"level"`
	Application string `json:"application"`
	Status      int    `json:",omitempty"`
	StackTrace  string `json:",omitempty"`
}

func (c *Config) Info(message string) {
	platform := ""
	if c.Platform != nil {
		platform = *c.Platform
	}
	rootleLog := Log{
		ID:          *c.ID,
		Timestamp:   time.Now().Unix(),
		Message:     message,
		Level:       "INFO",
		Application: *c.Application,
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
