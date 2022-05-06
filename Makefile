NAME = pong

DIRECTORY = ~/Desktop/pong/

clean:
	@ sudo rm -rf volumes/api/*
	@ sudo rm -rf volumes/ui/*
	@ sudo rm -rf volumes/api/.*
	@ sudo rm -rf volumes/ui/.*

up:
	@ docker-compose up --build

down:
	@ docker-compose down --rmi all --volumes --remove-orphans

# MIGRATE ALL CHANGES FROM VOLUMES FOLDER AND REPLACES THE EXISTING API AND UI FOLDERS.
changes-from-volumes:
	@ rm -rf ./api/nestjs
	@ rm -rf ./ui/reactjs
	@ cp -r ./volumes/api ./api/nestjs
	@ cp -r ./volumes/ui ./ui/reactjs

# RESTART PONG DATABASE
restart-db:
	@ docker-compose rm -s -f -v pong-db
	@ docker compose up --build -d pong-db
	@ docker-compose exec -T pong-api npm run prisma:dev:deploy

# RESTART PONG (TEST) DATABASE
restart-test-db:
	@ docker-compose rm -s -f -v test-db
	@ docker-compose up --detach --build test-db
	@ docker-compose exec -T pong-api npm run prisma:test:deploy

# RUN E2E TESTS
run-e2e-tests: restart-test-db
	@docker-compose exec pong-api npm run test:e2e

# RESTART API
restart-api:
	@ docker-compose rm -s -f -v pong-api
	@ docker-compose up --detach --build pong-api

# RESTART UI
restart-ui:
	@ docker-compose rm -s -f -v pong-ui
	@ docker-compose up --detach --build pong-ui

# Install NPM dependencies
dependencies:
	@ cd api/nestjs && npm install --force && cd ../../ui/reactjs && npm install --force
