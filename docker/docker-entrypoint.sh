#!/bin/sh
set -e

# Set permissions
chown -R appuser:appuser /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache
php artisan config:cache
php artisan scribe:generate
php artisan storage:link
# Wait for database to be ready (only for non-SQLite databases)
# Default to sqlite if not set
DB_CONNECTION=${DB_CONNECTION:-sqlite}

if [ "$DB_CONNECTION" != "sqlite" ]; then
    echo "Waiting for database ($DB_CONNECTION)..."
    # Try to connect to database with a timeout
    max_attempts=30
    attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if php artisan db:show > /dev/null 2>&1 || \
           php -r "try { new PDO('$DB_CONNECTION:host=$DB_HOST;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD'); exit(0); } catch (Exception \$e) { exit(1); }" 2>/dev/null; then
            echo "Database is up!"
            break
        fi
        attempt=$((attempt + 1))
        echo "Database is unavailable - sleeping (attempt $attempt/$max_attempts)"
        sleep 2
    done
    if [ $attempt -eq $max_attempts ]; then
        echo "Warning: Could not connect to database after $max_attempts attempts"
    fi
else
    echo "Using SQLite database - skipping database connection check"
fi

# Run migrations as appuser (only if .env exists)
if [ -f /var/www/html/.env ]; then
    echo "Running migrations..."
    php artisan migrate --seed --force || true

    echo "Caching configuration..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true

    echo "Signalling queue workers to restart..."
    php artisan queue:restart || true
fi

exec "$@"

