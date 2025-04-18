install:
		npm ci
lint:
		npx eslint .
link:
		sudo npm link
fix:
		npx eslint --fix .
test:
    npm test
test-coverage:
    npm test -- --coverage
. PHONY: test