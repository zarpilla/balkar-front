# Multi-stage build for Vue.js application

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Create a basic nginx configuration for Vue Router
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Create startup script for environment variable injection
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "Injecting environment variables..."' >> /docker-entrypoint.sh && \
    echo 'envsubst '\''$VITE_API_BASE'\'' < /usr/share/nginx/html/config.js > /tmp/config.js' >> /docker-entrypoint.sh && \
    echo 'mv /tmp/config.js /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
    echo 'echo "Starting nginx..."' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
