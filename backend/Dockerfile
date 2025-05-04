# Building layer
FROM node:18-alpine as development

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json
RUN npm install

# Copy application sources
COPY src/ src/

# Copy the .env file into the image
COPY .env ./

# Build application
RUN npm run build

# Runtime (production) layer
FROM node:18-alpine as production

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependencies
RUN npm install --omit=dev

# Copy production build
COPY --from=development /app/dist/ ./dist/
# Copy the .env file from the development stage
COPY --from=development /app/.env ./

# Expose application port
EXPOSE 8080

# Start application
CMD [ "node", "dist/main.js" ]
