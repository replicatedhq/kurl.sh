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
test: deps
	yarn run test

.PHONY: serve
serve: deps
	GOOGLE_ANALYTICS_TRACKING_ID=fake_token yarn start

.PHONY: build-staging
build-staging: 
	yarn build-staging

.PHONY: build-production
build-production: 
	yarn build
