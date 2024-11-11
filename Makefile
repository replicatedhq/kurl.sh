SHELL := /bin/bash
PROJECT_NAME ?= kurl-sh

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf .cache

.PHONY: deps
deps:
	PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
	npm ci

.PHONY: test
test:
	npm run test

.PHONY: serve
serve: deps
	GOOGLE_ANALYTICS_TRACKING_ID=dummy \
	npm run start

.PHONY: build-staging
build-staging: 
	npm run build-staging

.PHONY: build-production
build-production: 
	npm run build