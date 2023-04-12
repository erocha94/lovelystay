.PHONY: install
install:
	@docker-compose run --rm node npm i

.PHONY: env
env:
	@docker-compose up -d --remove-orphans postgres

.PHONY: stop
stop:
	@docker-compose down

.PHONY: enter
enter:
	@docker-compose run --rm node bash
