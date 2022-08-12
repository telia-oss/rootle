package main

import (
	rt "github.com/telia-oss/rootle"
)

func main() {

	rootle := rt.New(*rt.NewConfig().WithID("123").WithApplication("invoice-lambda"))

	rootle.Info("Hello World")
	rootle.Warn("Hello World")

	rootle.Error("Hello World", "billing/user", rt.Downstream{
		Code: 500,
		Host: "localhost",
	}, 0)
}
