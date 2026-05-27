# syntax=docker/dockerfile:1
# 의존성은 DEPS_IMAGE에서 재사용, main.py 변경 시 이 레이어만 재빌드 (ai/deploy.sh)
ARG DEPS_IMAGE
FROM ${DEPS_IMAGE}

COPY main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
