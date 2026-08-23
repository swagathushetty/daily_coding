# Multi-stage build. Used only in FULL mode (docker compose --profile full).
# In dev you run `./mvnw -pl services/catalog-service spring-boot:run` instead.
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw -q -pl services/catalog-service -am -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/services/catalog-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
