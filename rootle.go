package rootle

import "github.com/gopherjs/gopherjs/js"

type Rootle struct {
	config Config
}

func New(conf Config) *Rootle {
	return &Rootle{
		config: conf,
	}
}

func Newjs(id string, service string) *js.Object {
	platform := "js"
	return js.MakeWrapper(&Rootle{
		config: Config{
			ID:       &id,
			Service:  &service,
			Platform: &platform,
		},
	})
}
