SHELL := /bin/bash
PROJECT_NAME ?= kurl-sh

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist

.PHONY: deps
deps:
	yarn --silent --frozen-lockfile

.PHONY: test
test:
	yarn run test

.PHONY: serve
serve: deps
	yarn start

.PHONY: build-staging
build-staging: 
	yarn build-staging

.PHONY: build-production
build-production: 
	yarn build