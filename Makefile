.PHONY: help dev up down rebuild logs clean test build deploy

help:
	@echo "SyncSpace Development Commands"
	@echo "=============================="
	@echo "make dev          - Start development environment"
	@echo "make up           - Start all services"
	@echo "make down         - Stop all services"
	@echo "make rebuild      - Rebuild Docker images"
	@echo "make logs         - View all logs"
	@echo "make logs-server  - View server logs"
	@echo "make logs-client  - View client logs"
	@echo "make clean        - Remove containers and volumes"
	@echo "make test         - Run all tests"
	@echo "make test-server  - Run server tests"
	@echo "make test-client  - Run client tests"
	@echo "make build        - Build production images"
	@echo "make shell-server - Connect to server shell"
	@echo "make shell-db     - Connect to database"

# Development
dev: up
	@echo "✅ Development environment started"
	@echo "Frontend: http://localhost:5173"
	@echo "API: http://localhost:8000"
	@echo "Docs: http://localhost:8000/docs"

up:
	docker-compose up -d

down:
	docker-compose down

rebuild:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

logs-server:
	docker-compose logs -f server

logs-client:
	docker-compose logs -f client

clean:
	docker-compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true

# Testing
test: test-server test-client
	@echo "✅ All tests passed"

test-server:
	@echo "Running server tests..."
	docker-compose run --rm server pytest tests/ -v --cov=src/server

test-client:
	@echo "Running client tests..."
	cd client && npm run test

# Building
build:
	docker-compose build

# Database
db-migrate:
	docker-compose run --rm server alembic upgrade head

db-shell:
	docker-compose exec postgres psql -U syncspace_user -d syncspace_db

# Debugging
shell-server:
	docker-compose exec server /bin/bash

shell-client:
	docker-compose exec client /bin/sh

shell-db:
	docker-compose exec postgres psql -U syncspace_user -d syncspace_db

# Production
build-prod:
	@echo "Building production images..."
	docker build -t syncspace-client:latest ./client
	docker build -t syncspace-server:latest ./server
	@echo "✅ Production images built"

push-images:
	@echo "Pushing images to registry..."
	docker push syncspace-client:latest
	docker push syncspace-server:latest
	@echo "✅ Images pushed"

# Utilities
install:
	cd client && npm install
	cd server && pip install -e .

format-server:
	docker-compose run --rm server black src/
	docker-compose run --rm server isort src/

lint-server:
	docker-compose run --rm server pylint src/

lint-client:
	cd client && npm run lint

env-setup:
	cp .env.example .env
	@echo "✅ .env file created. Please update with your values."
