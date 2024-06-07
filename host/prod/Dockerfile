# Use NGINX Alpine image as the base
FROM nginx:alpine

# Set environment variables for the build
ARG DOMAIN_NAME
ENV DOMAIN_NAME=${DOMAIN_NAME}

# Create directory for Certbot webroot authentication
RUN mkdir -p /var/www/certbot/.well-known/acme-challenge

# Remove default nginx configurations
RUN rm /etc/nginx/conf.d/default.conf

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Add a custom entrypoint script to substitute environment variables
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
