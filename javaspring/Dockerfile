
FROM node:12  AS builder
WORKDIR /tipa_frontend

COPY ./ /tipa_frontend/

ENV PATH /tipa_frontend/node_modules/.bin:$PATH

RUN apt-get update && apt-get install -y vim

RUN yarn cache clean

RUN yarn&&yarn install --frozen-lockfile

RUN yarn build

FROM nginx:1.17

COPY  --from=builder tipa_frontend/build /usr/share/nginx/html

RUN rm -rf /etc/nginx/conf.d/*.conf

RUN apt-get update && apt-get install -y vim && apt-get install -y net-tools && apt-get install -y curl

RUN rm -rf /etc/nginx/nginx.conf

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
