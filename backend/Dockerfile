# This Dockerfile is not used for Render deployment.
# It's kept for local development and potential future deployment options.
# For Render deployment, only the package.json and source code are needed.

FROM node:18-alpine as base

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies
FROM base as production-deps
RUN npm ci --only=production

# Install all dependencies for development
FROM base as development-deps
RUN npm ci

# Copy application code
FROM base as development
COPY --from=development-deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# Production build
FROM base as production
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
# Create logs directory
RUN mkdir -p logs && chmod -R 777 logs

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
# Change ownership of app files
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE 5000

CMD ["node", "server.js"]
