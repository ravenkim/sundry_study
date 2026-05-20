# Stage 1: Vite 빌드 (VITE_API_HOST = 백엔드 URL)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN sed -i '/^yarnPath:/d' .yarnrc.yml

RUN corepack enable && corepack prepare --activate && yarn install --immutable

COPY . .
RUN sed -i '/^yarnPath:/d' .yarnrc.yml

RUN yarn build

# Stage 2: nginx 정적 서빙
FROM nginx:1.27-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
