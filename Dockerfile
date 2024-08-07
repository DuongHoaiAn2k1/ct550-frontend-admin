# Use official Node.js image with specified version
FROM node:18.5.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set permissions for node_modules and .vite directories
RUN chmod -R 777 /app/node_modules \
    && mkdir -p /app/.vite \
    && chmod -R 777 /app/.vite

# Expose port 3000 (or the port your application is running on)
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "dev"]
