# Multi-stage Dockerfile for Laravel application
FROM ghcr.io/magicstack-llp/laravel-base:8.4 AS base


# Stage 1: Build assets (uses an isolated SQLite database only at build-time)
FROM base AS node-builder

ARG APP_URL=https://admin.akkalkotnp.com

WORKDIR /app

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy package files
COPY package*.json ./

# Install Node dependencies (including devDependencies for Vite / Tailwind build)
RUN npm ci

# Copy composer files for Wayfinder
COPY composer*.json ./

# Install minimal PHP dependencies needed for Wayfinder
# Note: We use --no-scripts to avoid running post-install scripts that might fail without full setup
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader

# Copy Laravel app files needed for Wayfinder and asset build
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY routes ./routes
COPY lang ./lang
COPY artisan ./

# Create necessary directories with proper permissions
RUN rm -rf bootstrap/cache/*.php && \
    mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views \
    storage/logs storage/app/public bootstrap/cache database && \
    chmod -R 775 storage bootstrap/cache

# Create tiny SQLite database used only for build-time commands (Wayfinder, etc.)
RUN touch database/database.sqlite && chmod 664 database/database.sqlite

# Create minimal .env for build-time only (runtime will use Postgres via real env vars)
RUN echo "APP_NAME=Laravel" > .env && \
    echo "APP_ENV=production" >> .env && \
    echo "APP_DEBUG=false" >> .env && \
    echo "APP_URL=${APP_URL}" >> .env && \
    echo "DB_CONNECTION=sqlite" >> .env && \
    echo "DB_DATABASE=/app/database/database.sqlite" >> .env

# Generate application key
RUN php artisan key:generate --force || true

# Generate autoloader
RUN composer dump-autoload --no-dev --optimize

# Copy source files needed for build
COPY vite.config.ts tsconfig.json ./
COPY resources ./resources
COPY public ./public

# Test that artisan works before building
RUN php artisan --version || echo "Artisan check failed"

# Build assets (Wayfinder may run php artisan wayfinder:generate)
ENV APP_ENV=local
ENV DB_CONNECTION=sqlite
RUN npm run build

# Stage 2: PHP dependencies
FROM base AS php-dependencies

WORKDIR /app

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files
COPY composer*.json ./

# Install PHP dependencies (no dev dependencies for production)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Stage 3: Final production image
FROM base AS final

WORKDIR /var/www/html

# Install supervisor and nginx
RUN apk add --no-cache supervisor nginx

# Default number of queue worker processes (override via compose env)
ENV QUEUE_WORKERS=2

# Pre-create log files supervisor writes to
RUN mkdir -p /var/log && \
    touch /var/log/queue-worker.log /var/log/scheduler.log /var/log/supervisord.log

# PHP extensions (including opcache) are already installed and configured in the base image

# Copy PHP-FPM configuration
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create application user
RUN addgroup -g 1000 -S appuser && \
    adduser -S -D -H -u 1000 -h /var/www/html -s /sbin/nologin -G appuser -g appuser appuser

# Copy only the necessary application files (avoid overwriting vendor from host)
COPY --chown=appuser:appuser . .

# Copy application code and built assets
COPY --from=php-dependencies --chown=appuser:appuser /app/vendor ./vendor
COPY --from=node-builder --chown=appuser:appuser /app/public/build ./public/build



# Set proper permissions
RUN chown -R appuser:appuser /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 80

# Note: We keep root user for supervisor, but PHP-FPM runs as appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/up || exit 1

# Entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
