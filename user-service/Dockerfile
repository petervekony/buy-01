FROM maven:3.9.4-eclipse-temurin-17 as build

WORKDIR /app

COPY pom.xml ./
COPY src ./src/

RUN mvn clean package -DskipTests -X

FROM bellsoft/liberica-openjdk-alpine:latest 

WORKDIR /app

COPY --from=build /app/target/user-service-*.jar user-service.jar

CMD ["java", "-jar", "user-service.jar"]
