FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose the port the app runs on
EXPOSE 8800

# Command to run the application
CMD ["npm", "start"]