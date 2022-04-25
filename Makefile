NAME = pong

all: dependencies
	@ cp -r ./nestjs ./app_docker/nestjs
	@ cp -r ./reactjs ./app_docker/reactjs
	@ docker-compose -f app_docker/docker-compose.yml up --d
	@ rm -rf ./app_docker/nestjs/nestjs
	@ rm -rf ./app_docker/reactjs/reactjs

docker-with-volumes: dependencies
	@ cp -r ./nestjs ./app_docker/nestjs
	@ cp -r ./reactjs ./app_docker/reactjs
	@ mkdir -pv /home/${USER}/pong_nestjs
	@ mkdir -pv /home/${USER}/pong_reactjs
	@ docker-compose -f app_docker/docker-compose-volumes.yml up --d
	@ rm -rf ./app_docker/nestjs/nestjs
	@ rm -rf ./app_docker/reactjs/reactjs

delete-volumes:
	@ docker volume rm pong_nestjs_volume
	@ docker volume rm pong_reactjs_volume

docker-up:
	@ docker-compose -f app_docker/docker-compose.yml up --d

clean:
	@ docker-compose -f app_docker/docker-compose.yml down

docker-down: clean

fclean: clean
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v reactjs
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v nestjs
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v testdb
	@ docker volume prune
	@ docker rmi reactjs:henkies nestjs:henkies
#	@ sudo rm -rf ~/pong_nestjs ~/pong_reactjs




# MIGRATE ALL CHANGES FROM VOLUMES IN HOME FOLDER AND REPLACES THE EXISTING FOLDERS HERE.

changes-from-volumes:
	@ rm -rf ./nestjs ./reactjs
	@ cp -r ~/pong_reactjs ./reactjs
	@ cp -r ~/pong_nestjs ./nestjs
	@ sed -i 's/pongdb:5432/localhost:5434/g' ./nestjs/.env





# LOCAL PROJECT MACROS

dependencies:
	@ cd nestjs && npm install --force && cd ../reactjs && npm install --force

local-db-down:
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v testdb

local-db-up:
	@ docker-compose -f app_docker/docker-compose.yml up --d

local-db-clean:
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v testdb

local-db:
	@ cd nestjs && npm run db:dev:restart && npm run db:test:restart

local-backend: local-db
	@ cd nestjs && npm run start:dev

local-frontend:
	@ cd reactjs && npm start
