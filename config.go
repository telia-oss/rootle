package rootle

type Config struct {
	ID       *string
	Service  *string
	Platform *string
}

func NewConfig() *Config {
	return &Config{}
}

func (c *Config) WithID(id string) *Config {
	c.ID = &id
	return c
}

func (c *Config) WithService(service string) *Config {
	c.Service = &service
	return c
}
