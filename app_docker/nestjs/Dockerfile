FROM debian:latest

RUN apt update && apt -y upgrade

RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -

RUN apt install -y nodejs

COPY ./nestjs ./nestjs

#RUN cd nestjs && npm install --force

COPY ./entrypoint.sh ./

RUN ls && pwd

RUN chmod +x entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]

CMD [ "npm", "run", "start:dev" ]
