#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# B-HackMe — Let's Encrypt / Certbot Initial Setup
# Run this ONCE on a fresh VPS before starting production docker compose.
#
# Usage:
#   chmod +x scripts/init-letsencrypt.sh
#   sudo ./scripts/init-letsencrypt.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration — edit these ───────────────────────────────────────────────
DOMAINS=("bhackme.com" "www.bhackme.com")
EMAIL="admin@bhackme.com"           # Expiry notification email
STAGING=0                           # Set to 1 for testing (avoids rate limits)

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
CERTBOT_CONF="$ROOT_DIR/nginx/certbot/conf"
CERTBOT_WWW="$ROOT_DIR/nginx/certbot/www"
NGINX_CONF="$ROOT_DIR/nginx/nginx.conf"

# ── Helpers ──────────────────────────────────────────────────────────────────
info()    { echo -e "\033[1;36m[INFO]\033[0m  $*"; }
success() { echo -e "\033[1;32m[OK]\033[0m    $*"; }
error()   { echo -e "\033[1;31m[ERROR]\033[0m $*" >&2; exit 1; }

# ── Preflight ────────────────────────────────────────────────────────────────
command -v docker >/dev/null 2>&1 || error "Docker is not installed."
command -v docker compose >/dev/null 2>&1 || error "Docker Compose is not installed."

info "Creating Certbot directories..."
mkdir -p "$CERTBOT_CONF" "$CERTBOT_WWW"

# ── Download recommended TLS parameters ──────────────────────────────────────
info "Downloading recommended TLS parameters..."
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    -o "$CERTBOT_CONF/options-ssl-nginx.conf"

# Generate DH params (2048-bit is enough, 4096 is slow to generate)
if [ ! -f "$CERTBOT_CONF/ssl-dhparams.pem" ]; then
    info "Generating DH parameters (this may take a minute)..."
    openssl dhparam -out "$CERTBOT_CONF/ssl-dhparams.pem" 2048
fi

# ── Create a temporary self-signed cert so Nginx can start ───────────────────
info "Creating temporary self-signed certificate for Nginx startup..."
DUMMY_DIR="$CERTBOT_CONF/live/${DOMAINS[0]}"
mkdir -p "$DUMMY_DIR"
docker run --rm \
    -v "$CERTBOT_CONF:/etc/letsencrypt" \
    certbot/certbot:latest \
    certificates 2>/dev/null || true

openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$DUMMY_DIR/privkey.pem" \
    -out    "$DUMMY_DIR/fullchain.pem" \
    -subj "/CN=${DOMAINS[0]}" 2>/dev/null

# ── Start Nginx with the self-signed cert ────────────────────────────────────
info "Starting Nginx with temporary certificate..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d nginx

sleep 3  # Wait for Nginx to be ready

# ── Remove the self-signed cert ──────────────────────────────────────────────
info "Removing temporary self-signed certificate..."
rm -rf "$DUMMY_DIR"

# ── Build the certbot domain args ────────────────────────────────────────────
DOMAIN_ARGS=""
for domain in "${DOMAINS[@]}"; do
    DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
done

# ── Request the real certificate ─────────────────────────────────────────────
STAGING_FLAG=""
if [ "$STAGING" -eq 1 ]; then
    info "Using Let's Encrypt STAGING server (for testing)."
    STAGING_FLAG="--staging"
fi

info "Requesting Let's Encrypt certificate for: ${DOMAINS[*]}"
docker compose -f "$ROOT_DIR/docker-compose.yml" run --rm certbot \
    certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    $STAGING_FLAG \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    $DOMAIN_ARGS

# ── Reload Nginx with the real certificate ───────────────────────────────────
info "Reloading Nginx with real certificate..."
docker compose -f "$ROOT_DIR/docker-compose.yml" exec nginx nginx -s reload

success "SSL certificate issued successfully for: ${DOMAINS[*]}"
success "Auto-renewal is handled by the certbot container (every 12h)."
info "To verify renewal: docker compose exec certbot certbot renew --dry-run"
