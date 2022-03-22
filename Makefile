NAME = pong

all: up

clean:
	@ docker-compose -f srcs/docker-compose.yml down

fclean: clean
	@ docker system prune -a
	@ docker volume rm pong_volume
	@ sudo rm -rf /home/$(USER)/pong_volume

cleanup: clean
	@ docker volume rm pong_volume
	@ sudo rm -rf /home/$(USER)/pong_volume

up:
	@ mkdir -pv /home/$(USER)/pong_volume/src
	@ docker-compose -f srcs/docker-compose.yml --env-file ./srcs/.env up

start:
	@ docker-compose -f srcs/docker-compose.yml start

stop:
	@ docker-compose -f srcs/docker-compose.yml stop

.PHONY: clean fclean reload all pong