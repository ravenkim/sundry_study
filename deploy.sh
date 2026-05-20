#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "[1/2] 백엔드 배포..."
bash be/deploy.sh

echo "[2/2] 프론트 배포..."
bash fe/deploy.sh
