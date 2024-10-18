# Use an official OpenJDK image to build the app
FROM openjdk:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR into the container
COPY target/your-java-app.jar /app/your-java-app.jar

# Expose port 8080
EXPOSE 8080

# Run the app
CMD ["java", "-jar", "your-java-app.jar"]