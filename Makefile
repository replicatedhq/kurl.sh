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
	gatsby develop --env local

.PHONY: build-staging
build-staging: 
	`yarn bin`/webpack --config webpack.config.js --env staging

.PHONY: build-production
build-production: 
	`yarn bin`/webpack --config webpack.config.js --env prod