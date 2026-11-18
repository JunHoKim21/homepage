# Stage 1: Build Stage (Java 21)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x ./gradlew
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: Production Runtime Stage (Java 21 with Virtual Threads & 768MB Memory Formula)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
RUN mkdir -p /app/uploads/public /app/uploads/private && chown -R spring:spring /app
USER spring:spring
COPY --from=builder /workspace/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
