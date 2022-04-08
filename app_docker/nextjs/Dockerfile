FROM debian:latest

RUN apt update

RUN apt install -y nodejs npm

COPY ./nextjs ./

WORKDIR /nextjs

RUN npm install

CMD npm run dev
