# Use NGINX Alpine image as the base
FROM nginx:alpine

# Set environment variables for the build
ARG DOMAIN_NAME
ARG MMLK
ENV DOMAIN_NAME=${DOMAIN_NAME}

# Install required packages for GeoIP
RUN apk add --no-cache nginx-mod-http-geoip geoip wget

# Download and install the GeoLite2 Country database
RUN mkdir -p /usr/share/GeoIP/ && \
    wget -q -O /usr/share/GeoIP/GeoLite2-Country.mmdb.gz "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${MMLK}&suffix=tar.gz" && \
    gunzip /usr/share/GeoIP/GeoLite2-Country.mmdb.gz

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
