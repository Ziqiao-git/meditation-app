# Use Node.js LTS version with specific platform
FROM --platform=linux/amd64 node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --arch=arm64

# Copy app source
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

RUN ls -la /usr/src/app
RUN ls -la /usr/src/app/views
RUN ls -la /usr/src/app/public

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "devStart"]