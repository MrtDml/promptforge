#!/usr/bin/env bash
# =============================================================================
#  PromptForge — Docker Compose Start Script
#  Builds images (if needed) and starts all services defined in
#  docker/docker-compose.yml using the environment from docker/.env
# =============================================================================

set -euo pipefail

# ─── Colours ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
die()     { error "$*"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DOCKER_DIR="${ROOT_DIR}/docker"

echo ""
echo -e "${BOLD}============================================${NC}"
echo -e "${BOLD}   PromptForge — Docker Start${NC}"
echo -e "${BOLD}============================================${NC}"
echo ""

# ─── Resolve docker compose command ─────────────────────────────────────────
if docker compose version &>/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose &>/dev/null; then
  COMPOSE_CMD="docker-compose"
else
  die "Neither 'docker compose' nor 'docker-compose' found. Please install Docker."
fi
info "Using: $COMPOSE_CMD"

# ─── Guard: docker/.env must exist ───────────────────────────────────────────
ENV_FILE="${DOCKER_DIR}/.env"
if [ ! -f "$ENV_FILE" ]; then
  if [ -f "${DOCKER_DIR}/.env.example" ]; then
    warn "docker/.env not found. Copying from docker/.env.example..."
    cp "${DOCKER_DIR}/.env.example" "$ENV_FILE"
    echo ""
    echo -e "${YELLOW}  ACTION REQUIRED: Edit ${ENV_FILE} and set real secrets before continuing.${NC}"
    echo ""
    read -rp "  Have you edited the .env file? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
      die "Aborted. Please edit ${ENV_FILE} and re-run this script."
    fi
  else
    die "docker/.env not found and no .env.example to copy from. Aborting."
  fi
fi

# ─── Parse optional flags ────────────────────────────────────────────────────
BUILD_FLAG=""
DETACH_FLAG="-d"
PROFILES_FLAG=""
PGADMIN=false

usage() {
  echo "Usage: $0 [--build] [--foreground] [--with-pgadmin]"
  echo ""
  echo "  --build        Force rebuild of Docker images"
  echo "  --foreground   Run in foreground (no -d flag)"
  echo "  --with-pgadmin Also start the pgadmin service (profile: tools)"
  exit 0
}

for arg in "$@"; do
  case "$arg" in
    --build)        BUILD_FLAG="--build" ;;
    --foreground)   DETACH_FLAG="" ;;
    --with-pgadmin) PGADMIN=true ;;
    --help|-h)      usage ;;
    *) warn "Unknown argument: $arg" ;;
  esac
done

if $PGADMIN; then
  PROFILES_FLAG="--profile tools"
  info "PgAdmin enabled — will be available at http://localhost:5050"
fi

# ─── Pull latest base images (non-fatal) ─────────────────────────────────────
info "Pulling latest base images..."
$COMPOSE_CMD \
  --project-directory "${DOCKER_DIR}" \
  --env-file "$ENV_FILE" \
  pull --ignore-pull-failures postgres 2>/dev/null || true

# ─── Build + start ───────────────────────────────────────────────────────────
info "Starting services..."
# shellcheck disable=SC2086
$COMPOSE_CMD \
  --project-directory "${DOCKER_DIR}" \
  --env-file "$ENV_FILE" \
  $PROFILES_FLAG \
  up $BUILD_FLAG $DETACH_FLAG

if [ -n "$DETACH_FLAG" ]; then
  echo ""
  success "All services started in background."
  echo ""
  echo -e "${BOLD}  Frontend  → http://localhost:3000${NC}"
  echo -e "${BOLD}  Backend   → http://localhost:3001${NC}"
  $PGADMIN && echo -e "${BOLD}  PgAdmin   → http://localhost:5050${NC}"
  echo ""
  echo "  View logs : $COMPOSE_CMD --project-directory ${DOCKER_DIR} logs -f"
  echo "  Stop all  : $COMPOSE_CMD --project-directory ${DOCKER_DIR} down"
  echo ""
fi
