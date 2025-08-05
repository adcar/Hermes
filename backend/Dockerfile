FROM clojure:temurin-21-tools-deps-alpine AS builder

WORKDIR /app

# Copy deps first for caching
COPY deps.edn .
RUN clojure -P

# Copy source
COPY src src
COPY resources resources

# Build uberjar
RUN clojure -T:uberjar

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/hermes.jar .

EXPOSE 3001

CMD ["java", "-jar", "hermes.jar"]

