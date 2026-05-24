#!/usr/bin/env bash
# Deprecated: Flyway가 BE 기동 시 스키마를 적용합니다.
exec bash "$(dirname "$0")/ensure-docker-schema.sh"
