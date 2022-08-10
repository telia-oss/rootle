package main

import (
	"github.com/telia-oss/rootle"
)

func main() {
	rootle := rootle.New(*rootle.NewConfig().WithID("123").WithService("billing"))
	rootle.Info("Hello World")
}
