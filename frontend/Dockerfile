# docker build  -t m1_front .
FROM node:16 AS development

WORKDIR /app

### install packages
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn

COPY . .