install:
	npm ci
link:
	sudo npm link
publish:
	npm publish --dry-run
lint:
	npx eslint .