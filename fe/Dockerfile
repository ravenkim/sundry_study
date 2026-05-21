# syntax=docker/dockerfile:1
# Stage 1: Vite 빌드 (의존성은 DEPS_IMAGE에서 재사용, fe/deploy.sh)
ARG DEPS_IMAGE
FROM ${DEPS_IMAGE} AS builder

WORKDIR /app

COPY . .
RUN sed -i '/^yarnPath:/d' .yarnrc.yml

RUN yarn build

# Stage 2: nginx 정적 서빙
FROM nginx:1.27-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
