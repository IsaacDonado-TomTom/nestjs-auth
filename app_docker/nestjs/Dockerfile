FROM debian:latest

RUN apt update

RUN apt install -y nodejs npm

COPY ./nestjs ./

RUN ls && pwd

WORKDIR /nestjs

#RUN npm install

CMD npm run start:dev
