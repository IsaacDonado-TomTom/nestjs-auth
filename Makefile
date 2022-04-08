NAME = nestjs_auth

all: copy up

clean:
	@ docker-compose -f app_docker/docker-compose.yml down
	@ docker-compose -f db_docker/docker-compose.yml down

fclean: clean
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v nextjs
	@ docker-compose -f app_docker/docker-compose.yml rm -s -f -v nestjs
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v testdb
	@ rm -rf ./app_docker/nestjs/nestjs
	@ rm -rf ./app_docker/nextjs/nextjs

updb:
	@ docker-compose -f db_docker/docker-compose.yml up --d


downdb:
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v pongdb
	@ docker-compose -f db_docker/docker-compose.yml rm -s -f -v testdb


copy:
	@ cp -r ./nestjs ./app_docker/nestjs
	@ cp -r ./nextjs ./app_docker/nextjs


up:
	@ docker-compose -f db_docker/docker-compose.yml up --d
	@ docker-compose -f app_docker/docker-compose.yml up --d

.PHONY: clean fclean reload all nestjs_auth hosts undo-hosts