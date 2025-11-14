SHELL := /bin/sh

DC := docker compose

.PHONY: up down build logs migrate seed test

up:
	$(DC) -f infra/docker-compose.yml up -d --build

down:
	$(DC) -f infra/docker-compose.yml down

build:
	$(DC) -f infra/docker-compose.yml build

logs:
	$(DC) -f infra/docker-compose.yml logs -f

migrate:
	$(DC) -f infra/docker-compose.yml exec django python manage.py migrate

seed:
	$(DC) -f infra/docker-compose.yml exec django python manage.py seed

test:
	$(DC) -f infra/docker-compose.yml exec django pytest -q --disable-warnings --maxfail=1 --cov=.