FROM debian:latest

RUN apt update && apt -y upgrade

RUN apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_17.x | bash -

RUN apt install -y nodejs

COPY ./reactjs ./reactjs

WORKDIR /reactjs

#RUN npm install --force

CMD npm run start