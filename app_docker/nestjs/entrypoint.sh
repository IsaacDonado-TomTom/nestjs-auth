#!/bin/bash

pwd && ls
cd nestjs
sed -i 's/localhost:5434/pongdb:5432/g' .env
sleep 6
npx prisma migrate deploy
exec "$@"