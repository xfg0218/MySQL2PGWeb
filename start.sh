#!/bin/bash
set -e

cd "$(dirname "$0")"

PORT="${PORT:-80}"
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $1"; exit 1; }

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   MySQL2PG Web · 一键启动脚本        ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# ── 检查环境 ──
info "检查运行环境..."

command -v node >/dev/null 2>&1 || fail "未找到 Node.js，请先安装: https://nodejs.org"
command -v npm  >/dev/null 2>&1 || fail "未找到 npm"
command -v go   >/dev/null 2>&1 || fail "未找到 Go，请先安装: https://go.dev/dl/"

NODE_VER=$(node -v | sed 's/v//')
GO_VER=$(go version | awk '{print $3}' | sed 's/go//')
ok "Node.js $(echo $NODE_VER | cut -d. -f1).x / Go $GO_VER"

# ── 前端依赖 ──
if [ ! -d "frontend/node_modules" ]; then
    info "安装前端依赖..."
    cd frontend && npm install --silent && cd ..
    ok "依赖安装完成"
else
    ok "前端依赖已就绪"
fi

# ── 构建前端 ──
info "构建前端..."
cd frontend && npm run build --silent && cd ..
ok "前端构建完成 → frontend/dist/"

# ── 构建 Go 服务 ──
info "编译 Go 服务..."
cd server && go build -o ../mysql2pg-web . && cd ..
ok "Go 编译完成 → mysql2pg-web"

# ── 停掉旧进程 ──
if lsof -ti :$PORT >/dev/null 2>&1; then
    info "端口 $PORT 被占用，停止旧进程..."
    lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
    sleep 0.5
fi

# ── 启动服务 ──
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${GREEN}✓ 全部就绪${NC}"
echo -e "  服务地址: ${CYAN}http://localhost:${PORT}${NC}"
echo -e "  按 ${CYAN}Ctrl+C${NC} 停止服务"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

trap 'echo ""; ok "服务已停止"; exit 0' INT TERM
PORT=$PORT ./mysql2pg-web
