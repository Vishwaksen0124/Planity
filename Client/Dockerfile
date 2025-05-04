FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Fix case sensitivity issues in imports
RUN find src -type f -name "*.jsx" -exec sed -i 's/from "\.\.\/components\/task\//from "\.\.\/components\/Task\//g' {} \;
RUN find src -type f -name "*.jsx" -exec sed -i 's/from "\.\/task\//from "\.\/Task\//g' {} \;

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]