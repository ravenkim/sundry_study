# syntax=docker/dockerfile:1
# Stage 1: JAR 빌드 (의존성은 DEPS_IMAGE에서 재사용, be/deploy.sh)
ARG DEPS_IMAGE
FROM ${DEPS_IMAGE} AS builder

WORKDIR /app

COPY src ./src

RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: 실행
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]
