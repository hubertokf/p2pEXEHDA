FROM node:latest

USER root

WORKDIR /home/node/app
ENV NODE_ENV=production
VOLUME /home/node/app
COPY . /home/node/app

# EXPOSE 3000

RUN npm install

CMD npm run start