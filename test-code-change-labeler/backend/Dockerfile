FROM node:18 AS development

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN corepack enable
RUN yarn install

COPY . .

CMD ["yarn", "run", "start:dev"]