#!/bin/bash

# 저장소에서 최신 코드를 가져옵니다.
git pull

# 이전에 실행 중이던 도커 컨테이너를 정지하고 삭제합니다.
docker stop rms_front
docker rm rms_front

# 도커 이미지를 빌드합니다.
docker build --tag rms:0.1 .

# 도커 컨테이너를 실행합니다.
docker run -itd -p 8089:80 --name rms_front rms:0.1
