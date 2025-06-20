# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Use nginx to serve the application
FROM nginx:alpine

# Copy the built application to nginx
COPY --from=base /app/dist/event-platform-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 