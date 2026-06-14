module github.com/libra/go-server

go 1.25.0

require (
	github.com/a-h/templ v0.3.1020
	github.com/libra/go-templ v0.0.0
	github.com/libra/go-tokens v0.0.0
)

replace (
	github.com/libra/go-templ => ../go-templ
	github.com/libra/go-tokens => ../go-tokens
)
