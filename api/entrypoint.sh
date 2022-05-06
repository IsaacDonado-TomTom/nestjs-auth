#!/bin/bash

npx prisma migrate deploy
sleep 6
exec "$@"