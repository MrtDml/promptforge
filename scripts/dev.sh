#!/usr/bin/env bash
# =============================================================================
#  PromptForge — Local Development Server
#  Starts the NestJS backend and Next.js frontend in parallel.
#  Press Ctrl+C to stop both processes.
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

echo ""
echo -e "${BOLD}============================================${NC}"
echo -e "${BOLD}   PromptForge — Dev Mode${NC}"
echo -e "${BOLD}============================================${NC}"
echo ""

# ─── Guard: .env must exist ──────────────────────────────────────────────────
if [ ! -f "${ROOT_DIR}/.env" ]; then
  die ".env file not found. Run scripts/setup.sh first."
fi

# ─── Guard: node_modules must exist ─────────────────────────────────────────
if [ ! -d "${ROOT_DIR}/backend/node_modules" ]; then
  die "backend/node_modules not found. Run scripts/setup.sh first."
fi
if [ ! -d "${ROOT_DIR}/frontend/node_modules" ]; then
  die "frontend/node_modules not found. Run scripts/setup.sh first."
fi

# ─── Load .env into the current shell ────────────────────────────────────────
# Only export keys that are safe; skip comments and blank lines
set -o allexport
# shellcheck disable=SC1091
source "${ROOT_DIR}/.env"
set +o allexport

# ─── PIDs tracking ───────────────────────────────────────────────────────────
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  info "Shutting down dev servers..."
  [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  wait 2>/dev/null
  success "All processes stopped. Goodbye!"
}
trap cleanup INT TERM EXIT

# ─── Start backend ───────────────────────────────────────────────────────────
info "Starting NestJS backend on port ${PORT:-3001}..."
(
  cd "${ROOT_DIR}/backend"
  npm run start:dev 2>&1 | sed "s/^/${CYAN}[backend]${NC} /"
) &
BACKEND_PID=$!
success "Backend started (PID $BACKEND_PID)"

# Small delay so backend output doesn't interleave badly with the next line
sleep 1

# ─── Start frontend ──────────────────────────────────────────────────────────
info "Starting Next.js frontend on port 3000..."
(
  cd "${ROOT_DIR}/frontend"
  npm run dev 2>&1 | sed "s/^/${GREEN}[frontend]${NC} /"
) &
FRONTEND_PID=$!
success "Frontend started (PID $FRONTEND_PID)"

echo ""
echo -e "${BOLD}  Backend  → http://localhost:${PORT:-3001}${NC}"
echo -e "${BOLD}  Frontend → http://localhost:3000${NC}"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# ─── Wait for either process to exit ─────────────────────────────────────────
wait -n 2>/dev/null || wait
