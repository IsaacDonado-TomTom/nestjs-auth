NAME = nestjs

all: reload

clean:
	@ docker-compose -f srcs/docker-compose.yml down

fclean: clean
	@ docker system prune -a
	@ sudo rm -rf /home/$(USER)/data

reload:
	@ mkdir -pv /home/$(USER)/data
	@ docker-compose -f srcs/docker-compose.yml up

.PHONY: clean fclean reload all nestjs