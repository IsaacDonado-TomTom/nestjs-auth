NAME = nestjs

all: up

clean:
	@ docker-compose -f srcs/docker-compose.yml down

fclean: clean
	@ docker system prune -a
	@ docker volume rm nestsite_volume
	@ sudo rm -rf /home/$(USER)/nestsite

up:
	@ mkdir -pv /home/$(USER)/nestsite
	@ docker-compose -f srcs/docker-compose.yml --env-file ./srcs/.env up

start:
	@ docker-compose -f srcs/docker-compose.yml start

stop:
	@ docker-compose -f srcs/docker-compose.yml stop

.PHONY: clean fclean reload all nestjs