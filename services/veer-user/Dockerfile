FROM    maven:3.8.4-openjdk-17 AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY veer-user-api/pom.xml     ./veer-user-api/pom.xml
COPY veer-user-model/pom.xml   ./veer-user-model/pom.xml
COPY veer-user-service/pom.xml ./veer-user-service/pom.xml

RUN mvn dependency:go-offline
RUN mvn dependency:go-offline -pl veer-user-model   -am
RUN mvn dependency:go-offline -pl veer-user-service -am
RUN mvn dependency:go-offline -pl veer-user-api     -am

COPY veer-user-model/src ./veer-user-model/src
COPY veer-user-api/src ./veer-user-api/src
COPY veer-user-service/src ./veer-user-service/src

RUN mvn clean package -DskipTests

FROM    eclipse-temurin:17-jdk-alpine
WORKDIR /app

COPY   --from=build /app/veer-user-api/target/veer-user-api-0.0.1-SNAPSHOT.jar .
EXPOSE 3002
CMD    ["java", "-jar", "veer-user-api-0.0.1-SNAPSHOT.jar"]

