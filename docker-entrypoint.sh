#!/bin/sh

echo "=== Docker Entrypoint Debug ==="
echo "VITE_API_BASE: ${VITE_API_BASE}"
echo "Template file exists: $(test -f /usr/share/nginx/html/config.js.template && echo 'YES' || echo 'NO')"

echo "Injecting environment variables..."

# Replace environment variables in config.js
envsubst '${VITE_API_BASE}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

echo "Generated config.js:"
cat /usr/share/nginx/html/config.js

echo "Starting nginx..."

# Start nginx
exec nginx -g 'daemon off;'
