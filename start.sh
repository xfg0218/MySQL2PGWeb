#!/bin/bash
set -e

cd "$(dirname "$0")"

PORT="${PORT:-80}"
PID_FILE="./mysql2pg-web.pid"
LOG_FILE="./mysql2pg-web.log"
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()  { echo -e "${CYAN}[WARN]${NC}  $1"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $1"; exit 1; }

# ── 停止旧进程（复用） ──
stop_old() {
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            info "停止旧进程 (PID: $OLD_PID)..."
            kill "$OLD_PID" 2>/dev/null || true
            sleep 0.5
        fi
        rm -f "$PID_FILE"
    fi
}

# ── stop 子命令 ──
do_stop() {
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            info "停止服务 (PID: $OLD_PID)..."
            kill "$OLD_PID" 2>/dev/null || true
            sleep 0.5
            rm -f "$PID_FILE"
            ok "服务已停止"
        else
            warn "进程 $OLD_PID 已不存在，清理 PID 文件"
            rm -f "$PID_FILE"
        fi
    else
        echo -e "${RED}[FAIL]${NC}  未找到 PID 文件，服务可能未运行"
        exit 1
    fi
    exit 0
}

# ── status 子命令 ──
do_status() {
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            ok "服务运行中 (PID: $OLD_PID, PORT: $PORT)"
        else
            echo -e "${RED}[FAIL]${NC}  PID 文件存在但进程 $OLD_PID 已不存在"
            rm -f "$PID_FILE"
        fi
    else
        echo "服务未运行"
    fi
    exit 0
}

# ── 子命令路由 ──
case "${1:-}" in
    stop)   do_stop ;;
    status) do_status ;;
    start|restart) DAEMON=true ;;
    "")     DAEMON=false ;;
    *)      echo "用法: $0 [start|stop|restart|status]"; echo "  start   - 后台运行"; echo "  restart - 重启服务（后台）"; echo "  stop    - 停止服务"; echo "  status  - 查看状态"; echo "  (无参)  - 前台运行"; exit 1 ;;
esac

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

# ── 构建 ──
info "构建前端 & 编译 Go 服务..."
make build
ok "构建完成 → mysql2pg-web"

# ── 停掉旧进程 ──
stop_old

# ── 启动服务 ──
if [ "$DAEMON" = true ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${GREEN}✓ 全部就绪（后台模式）${NC}"
    echo -e "  服务地址: ${CYAN}http://localhost:${PORT}${NC}"
    echo -e "  日志文件: ${CYAN}${LOG_FILE}${NC}"
    echo -e "  停止服务: ${CYAN}./start.sh stop${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    nohup env PORT=$PORT ./mysql2pg-web > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    ok "服务已后台启动 (PID: $(cat "$PID_FILE"))"
else
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${GREEN}✓ 全部就绪${NC}"
    echo -e "  服务地址: ${CYAN}http://localhost:${PORT}${NC}"
    echo -e "  按 ${CYAN}Ctrl+C${NC} 停止服务"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    trap 'echo ""; kill $(cat "$PID_FILE") 2>/dev/null; rm -f "$PID_FILE"; ok "服务已停止"; exit 0' INT TERM
    PORT=$PORT ./mysql2pg-web &
    echo $! > "$PID_FILE"
    wait
fi
