# Use an official OpenJDK image to build the app
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR into the container
COPY build/libs/trivia-0.0.1-SNAPSHOT-plain.jar /app/your-java-app.jar

# Expose port 8080
EXPOSE 8080

# Env vars
ENV JDBC_CONNECTION=$JDBC_CONNECTION
ENV JDBC_USER_NAME=$JDBC_USER_NAME
ENV JDBC_PASSWORD=$JDBC_PASSWORD

# Run the app
CMD ["java", "-jar", "your-java-app.jar"]
