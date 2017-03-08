FROM node:boron-wheezy

COPY ./src /app/src/
COPY ./package.json /app/package.json

RUN cd /app && npm install

RUN node ./src

EXPOSE 9000
