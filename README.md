# To run project locally with db on docker

1. Run `make dependencies && make local-backend`
2. In another terminal run `make local-frontend`

### To delete
1. Run `make local-db-clean`

# To run project on docker container

1. Run `make docker-with-volumes` or `make` (no volumes)

### To delete
1. Run `make fclean`
2. Run `docker volume rm pong_nestjs_volume pong_reactjs_volume`
3. Delete folders in /home/${USER}/pong_xxxxx


# Ports
```text
localhost:3001 = frontend
localhost:3000 = backend
```

# To replace nestjs and reactjs folders with an updated version from volume folder in home.

On a terminal, run `make changes-from-volumes`