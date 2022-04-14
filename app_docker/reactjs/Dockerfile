FROM nginx

WORKDIR /usr/share/react

RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs

COPY ./reactjs/package*.json ./

RUN npm install

COPY ./reactjs ./

RUN npm run build

RUN rm -r /usr/share/nginx/html/*

RUN cp -a build/. /usr/share/nginx/html

#FROM node:latest
#
##RUN npm update
#
#RUN npm install -g npm@latest
#
#WORKDIR /usr/src/
#
#COPY ./reactjs ./app
#
#WORKDIR /usr/src/app
#
#RUN npm install
#
#CMD npm start