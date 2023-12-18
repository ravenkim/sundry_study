FROM node:20.10.0

WORKDIR rms_front

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 5173

CMD ["yarn", "dev"]
