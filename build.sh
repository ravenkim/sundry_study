#!/bin/bash

# 저장소에서 최신 코드를 가져옵니다.
git pull

# 이전에 실행 중이던 도커 컨테이너를 정지하고 삭제합니다.
docker stop ting_frontend
docker rm ting_frontend

# 도커 이미지를 빌드합니다.
docker build --tag ting_frontend_image:latest .

# 도커 컨테이너를 실행합니다.
docker run -itd -p 8619:80 --name ting_frontend ting_frontend_image:latest
