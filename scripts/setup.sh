#!/usr/bin/env bash
# =============================================================================
#  PromptForge — Local Development Setup Script
#  Run once after cloning the repository to prepare your environment.
# =============================================================================

set -euo pipefail

# ─── Colours ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No colour

# ─── Helpers ─────────────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
die()     { error "$*"; exit 1; }

# ─── Resolve repo root ───────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo ""
echo -e "${BOLD}============================================${NC}"
echo -e "${BOLD}   PromptForge — Setup${NC}"
echo -e "${BOLD}============================================${NC}"
echo ""

# =============================================================================
#  1. Prerequisite checks
# =============================================================================
info "Checking prerequisites..."

# Node.js
if ! command -v node &>/dev/null; then
  die "Node.js is not installed. Please install Node.js 20+ from https://nodejs.org"
fi
NODE_VERSION=$(node -e "process.stdout.write(process.versions.node)")
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  die "Node.js 20+ is required (found $NODE_VERSION). Please upgrade."
fi
success "Node.js $NODE_VERSION"

# npm
if ! command -v npm &>/dev/null; then
  die "npm is not installed. It should come bundled with Node.js."
fi
NPM_VERSION=$(npm --version)
success "npm $NPM_VERSION"

# Docker (optional but strongly recommended)
if command -v docker &>/dev/null; then
  DOCKER_VERSION=$(docker --version | awk '{print $3}' | tr -d ',')
  success "Docker $DOCKER_VERSION"
else
  warn "Docker not found. You can still run locally without Docker, but docker-start.sh will not work."
fi

# Docker Compose (optional)
if command -v docker &>/dev/null && docker compose version &>/dev/null 2>&1; then
  success "Docker Compose (plugin) available"
elif command -v docker-compose &>/dev/null; then
  success "docker-compose (standalone) available"
else
  warn "Docker Compose not found. Install Docker Desktop or 'docker compose' plugin."
fi

echo ""

# =============================================================================
#  2. Copy .env files
# =============================================================================
info "Setting up environment files..."

copy_env() {
  local src="$1"
  local dst="$2"
  if [ -f "$dst" ]; then
    warn "$dst already exists — skipping (delete it to regenerate)."
  else
    cp "$src" "$dst"
    success "Created $dst"
  fi
}

copy_env "${ROOT_DIR}/.env.example"         "${ROOT_DIR}/.env"
copy_env "${ROOT_DIR}/docker/.env.example"  "${ROOT_DIR}/docker/.env"

echo ""
echo -e "${YELLOW}  IMPORTANT: Open ${ROOT_DIR}/.env and fill in your real values:${NC}"
echo -e "${YELLOW}    - POSTGRES_PASSWORD${NC}"
echo -e "${YELLOW}    - JWT_SECRET  (generate with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\")"
echo -e "${YELLOW}    - ANTHROPIC_API_KEY${NC}"
echo ""

# =============================================================================
#  3. Install backend dependencies
# =============================================================================
info "Installing backend dependencies..."
cd "${ROOT_DIR}/backend"
npm ci
success "Backend dependencies installed"

# =============================================================================
#  4. Install frontend dependencies
# =============================================================================
info "Installing frontend dependencies..."
cd "${ROOT_DIR}/frontend"
npm ci
success "Frontend dependencies installed"

# =============================================================================
#  5. Prisma generate
# =============================================================================
info "Running prisma generate..."
cd "${ROOT_DIR}/backend"
npx prisma generate
success "Prisma client generated"

echo ""
echo -e "${BOLD}============================================${NC}"
echo -e "${GREEN}${BOLD}  Setup complete!${NC}"
echo -e "${BOLD}============================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit ${ROOT_DIR}/.env  with real secrets"
echo "  2. Start a local Postgres instance (or use Docker)"
echo "  3. Run: bash scripts/dev.sh"
echo "     — OR —"
echo "     Run: bash scripts/docker-start.sh"
echo ""
