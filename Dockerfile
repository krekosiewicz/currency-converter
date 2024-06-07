# Use an official Node runtime as a parent image
FROM node:22-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Bundle app source
COPY . .

# Build your app
RUN npm run build

# Start a new stage from scratch
FROM node:22-alpine as runner

WORKDIR /usr/src/app

# Copy the built assets from the builder stage
COPY --from=builder /usr/src/app/.next .next
COPY --from=builder /usr/src/app/node_modules node_modules
COPY --from=builder /usr/src/app/public public
COPY --from=builder /usr/src/app/package.json package.json

# Set a non-root user and switch to it
RUN adduser -D myuser
USER myuser

# The command to run your app
CMD ["npm", "start"]