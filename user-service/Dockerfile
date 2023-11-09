ARG BUILD_PROFILE

FROM maven:3.9.4-eclipse-temurin-17 as build
ARG BUILD_PROFILE

WORKDIR /app

COPY ./user-service/pom.xml ./user-service/
COPY ./user-service/src ./user-service/src/
COPY ./pom.xml .

WORKDIR /app/user-service

RUN echo "Build profile: ${BUILD_PROFILE}"
RUN mvn clean package -P${BUILD_PROFILE} -DskipTests -X

FROM bellsoft/liberica-openjdk-alpine:latest 

RUN apk add --no-cache bash

WORKDIR /app

COPY --from=build /app/user-service/target/user-service-*.jar user-service.jar

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "kafka:9092", "--", "java", "-jar", "user-service.jar"]
