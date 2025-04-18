install:
		npm ci
lint:
		npx eslint .
fix:
		npx eslint --fix .
packlocal:
		npx webpack serve
build:
		NODE_ENV=production npx webpack
.PHONY: test