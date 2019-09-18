
.PHONY: deps
deps:
	yarn global add node-gyp
	yarn --silent --frozen-lockfile

.PHONY: prebuild
prebuild:
	rm -rf build
	mkdir -p build

.PHONY: lint
lint:
	npx tslint --project ./tsconfig.json --fix

.PHONY: build
build: prebuild
	KURL_ENV=staging `yarn bin`/webpack
	KURL_ENV=prod `yarn bin`/webpack

.PHONY: preview
preview: build
	`yarn bin`/workers-preview < dist/bundle.js

.PHONY: test
test:
	yarn run test

.PHONY: serve
serve: build
	`yarn bin`/cloudworker dist/bundle.js
