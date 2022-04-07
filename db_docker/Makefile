NAME = db

all: up

clean:
	@ docker-compose down

fclean: clean
	@ docker volume rm db_volume
	@ sudo rm -rf /home/$(USER)/pong_volume/db

up:
	@ mkdir -pv /home/$(USER)/pong_volume/db
	@ docker-compose up

start:
	@ docker-compose start

stop:
	@ docker-compose stop

.PHONY: clean fclean reload all db