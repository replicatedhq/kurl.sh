SHELL := /bin/bash
PROJECT_NAME ?= kurl-sh

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist

.PHONY: deps
deps:
	yarn --silent --frozen-lockfile

.PHONY: serve
serve: deps
		node --max_old_space_size=6144 \
		./node_modules/webpack-dev-server/bin/webpack-dev-server.js \
		--config webpack.config.js \
		--progress -w --debug --color --env skaffold --mode development --hot \
		--host 0.0.0.0