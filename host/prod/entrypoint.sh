#!/bin/sh
# Use envsubst to replace variables in nginx.conf
envsubst '${DOMAIN_NAME}' < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# Start nginx
exec nginx -g 'daemon off;'
