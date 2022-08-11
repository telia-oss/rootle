package rootle

import "github.com/gopherjs/gopherjs/js"

func New(conf Config) *Config {
	return &conf
}

func Newjs(id string, application string) *js.Object {
	platform := "js"
	return js.MakeWrapper(&Config{
		ID:          &id,
		Application: &application,
		Platform:    &platform,
	})
}
