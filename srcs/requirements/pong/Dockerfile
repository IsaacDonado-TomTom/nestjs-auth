FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y nodejs npm

COPY ./pong_src /pong_src

RUN npm install -g @nestjs/cli

RUN nest new pong --package-manager npm

RUN rm -rf /pong/src && mv ./pong_src ./src && mv ./src ./pong

WORKDIR /pong

CMD ["npm", "run", "start:dev"]