package rootle

type InterceptorRequestSources struct {
	Useragent string
	Referer   string
}

type Config struct {
	ID          *string
	Application *string
	Interceptor InterceptorRequestSources
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

func (c *Config) WithInterceptor(interceptor InterceptorRequestSources) *Config {
	c.Interceptor = interceptor
	return c
}
