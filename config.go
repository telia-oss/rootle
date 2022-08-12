package rootle

type Config struct {
	ID          *string
	Application *string
}

func NewConfig() *Config {
	return &Config{}
}

func (c *Config) WithID(id string) *Config {
	c.ID = &id
	return c
}

func (c *Config) WithApplication(application string) *Config {
	c.Application = &application
	return c
}
