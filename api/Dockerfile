FROM debian:latest

RUN apt update && apt -y upgrade

RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -

RUN apt install -y nodejs

COPY ./nestjs ./nestjs

COPY ./entrypoint.sh ./nestjs

WORKDIR /nestjs

RUN chmod +x entrypoint.sh

#RUN npm install --force

ENTRYPOINT [ "./entrypoint.sh" ]

CMD [ "npm", "run", "start:dev" ]
