NAME = nestjs

all: up

clean:
	@ docker-compose down

fclean: clean
	@ docker system prune -a
	@ docker volume rm db_volume
	@ sudo rm -rf /home/$(USER)/temp_db

up:
	@ mkdir -pv /home/$(USER)/temp_db
	@ docker-compose up

start:
	@ docker-compose start

stop:
	@ docker-compose stop

.PHONY: clean fclean reload all nestjs