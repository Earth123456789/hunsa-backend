# Dockerfile
FROM node:16

WORKDIR /usr/src/app

# Copy package files and install all dependencies, including dev dependencies
COPY package*.json ./
RUN npm install

# Install nodemon and ts-node globally to make them available in the container
RUN npm install -g nodemon ts-node

# Copy all files
COPY . .

# Start the server in development mode
CMD ["npm", "run", "dev"]
