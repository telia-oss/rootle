package main

import (
	"github.com/gopherjs/gopherjs/js"
	"github.com/telia-oss/rootle"
)

func main() {
	js.Module.Get("exports").Set("rootle", map[string]interface{}{
		"New": rootle.Newjs,
	})
}
