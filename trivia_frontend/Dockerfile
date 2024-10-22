# Use Node.js image to build the frontend
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /trivia_frontend

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Env vars
ENV BACKEND_URL=$BACKEND_URL

# Build the React app
RUN npm run build

# Use nginx to serve the built app
FROM nginx:alpine
COPY --from=build-stage /trivia_frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 4173

# Run the React app
# RUN npm run preview
