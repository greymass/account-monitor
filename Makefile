SHELL := /bin/bash
SRC_FILES := $(shell find src -name '*.ts')
TEST_FILES := $(wildcard test/tests/*.ts)
BIN := ./node_modules/.bin
MOCHA_OPTS := -u tdd -r ts-node/register -r tsconfig-paths/register --extension ts

lib: ${SRC_FILES} package.json tsconfig.json node_modules rollup.config.js
	@${BIN}/rollup -c && touch lib

.PHONY: check
check: node_modules
	@${BIN}/eslint src --ext .ts --max-warnings 0 --format unix && echo "Ok"

.PHONY: format
format: node_modules
	@${BIN}/eslint src test --ext .ts --fix

node_modules:
	yarn install --non-interactive --frozen-lockfile --ignore-scripts

.PHONY: clean
clean:
	rm -rf lib/

.PHONY: distclean
distclean: clean
	rm -rf node_modules/

.PHONY: deploy
deploy: lib
	wrangler deploy

