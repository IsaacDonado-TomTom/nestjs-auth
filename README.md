# Ports

```text
localhost:3001 = frontend
localhost:3000 = backend
```

# Build:

_First time requires to run `make dependencies`_

`docker-compose up --build` or `make up`

# Delete:

`make down && make clean`

# To replace nestjs and reactjs folders with an updated version from volumes folder

On a terminal, run `make changes-from-volumes`
