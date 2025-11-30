FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/gateway-0.0.1-SNAPSHOT.jar .
EXPOSE 3001
CMD ["java", "-jar", "gateway-0.0.1-SNAPSHOT.jar"]