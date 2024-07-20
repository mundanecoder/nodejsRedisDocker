# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --production

# Copy the application code to the container image.
COPY . .

# Inform Docker that the container listens on port 3000.
EXPOSE 5000

# Run the specified command within the container.
CMD [ "node", "index.js" ]
