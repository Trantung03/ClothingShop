# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# 1. Tận dụng Docker Cache cho dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Build dự án
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# 3. Copy file jar (Dùng tên cố định để tránh lỗi nếu có nhiều file jar trong target)
COPY --from=build /app/target/*.jar app.jar

# 4. Các biến môi trường mặc định (Có thể ghi đè khi chạy docker run)
ENV PORT=8080
ENV DB_HOST=localhost

EXPOSE 8080

# 5. Tối ưu tham số chạy Java 21
ENTRYPOINT ["java", "-XX:+UseParallelGC", "-jar", "app.jar"]