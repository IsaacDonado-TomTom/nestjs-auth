NAME = db

all: up

clean:
	@ docker-compose -f ../app_docker/docker-compose-volumes.yml down pongdb
	@ docker-compose -f ../app_docker/docker-compose-volumes.yml down testdb

fclean: clean
	@ docker-compose -f ../app_docker/docker-compose-volumes.yml rm -s -f -v pongdb
	@ docker-compose -f ../app_docker/docker-compose-volumes.yml rm -s -f -v testdb

up:
	@ mkdir -pv /home/$(USER)/pong_volume/db
	@ docker-compose -f ../app_docker/docker-compose-volumes.yml up pongdb
	@ docker-compose -f ../app_docker/docker-compose-volumes.yml up testdb

.PHONY: clean fclean reload all db