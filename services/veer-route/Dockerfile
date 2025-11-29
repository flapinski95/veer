FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY veer-route-api/pom.xml     ./veer-route-api/pom.xml
COPY veer-route-model/pom.xml   ./veer-route-model/pom.xml
COPY veer-route-service/pom.xml ./veer-route-service/pom.xml

RUN mvn dependency:go-offline

COPY veer-route-model/src   ./veer-route-model/src
COPY veer-route-api/src     ./veer-route-api/src
COPY veer-route-service/src ./veer-route-service/src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk
WORKDIR /app

COPY --from=build /app/veer-route-api/target/veer-route-api-0.0.1-SNAPSHOT.jar .
EXPOSE 3003
CMD ["java", "-jar", "veer-route-api-0.0.1-SNAPSHOT.jar"]

# FROM    maven:3.8.4-openjdk-17 AS build
# WORKDIR /app

# COPY pom.xml ./pom.xml
# COPY veer-route-api/pom.xml     ./veer-route-api/pom.xml
# COPY veer-route-model/pom.xml   ./veer-route-model/pom.xml
# COPY veer-route-service/pom.xml ./veer-route-service/pom.xml

# RUN mvn dependency:go-offline

# COPY veer-route-model/src   ./veer-route-model/src
# COPY veer-route-api/src     ./veer-route-api/src
# COPY veer-route-service/src ./veer-route-service/src

# RUN mvn clean package -DskipTests

# FROM    eclipse-temurin:17-jdk-alpine
# WORKDIR /app

# COPY   --from=build /app/veer-route-api/target/veer-route-api-0.0.1-SNAPSHOT.jar .
# EXPOSE 3003
# CMD    ["java", "-jar", "veer-route-api-0.0.1-SNAPSHOT.jar"]