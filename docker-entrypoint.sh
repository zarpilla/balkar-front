#!/bin/sh

echo "Injecting environment variables..."

# Replace environment variables in config.js
envsubst '${VITE_API_BASE}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

echo "Starting nginx..."

# Start nginx
exec nginx -g 'daemon off;'
