NAME = nestjs_auth

all: copy up

clean:
	@ docker-compose -f app_docker/docker-compose.yml down
	@ docker-compose -f db_docker/docker-compose.yml down

fclean: clean
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v reactjs
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v nestjs
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v testdb
	@ rm -rf ./app_docker/nestjs/nestjs
	@ rm -rf ./app_docker/reactjs/reactjs
#	@ rm -rf /home/${USER}/app_reactjs_volume
#	@ docker volume rm app_reactjs_volume

updb:
#	@ mkdir -pv /home/${USER}/app_reactjs_volume
	@ docker-compose -f db_docker/docker-compose.yml up -d
#	@ chmod +x -R /home/${USER}/app_reactjs_volume


downdb:
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v testdb


copy:
	@ cp -r ./nestjs ./app_docker/nestjs
	@ cp -r ./reactjs ./app_docker/reactjs


up:
	@ docker-compose -f db_docker/docker-compose.yml up --d
	@ docker-compose -f app_docker/docker-compose.yml up --d

local-db:
	@ cd nestjs && npm run db:dev:restart && npm run db:test:restart

local-backend: local-db
	@ cd nestjs && npm run start:dev

local-frontend:
	@ cd reactjs && npm start

re: fclean all

.PHONY: clean fclean reload all nestjs_auth