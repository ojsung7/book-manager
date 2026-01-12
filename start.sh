#!/bin/bash

# 색상 코드 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Book Manager 시작${NC}"
echo -e "${GREEN}========================================${NC}"

# 에러 발생 시 종료
set -e

# 백그라운드 프로세스 ID 저장
BACKEND_PID=""
FRONTEND_PID=""

# 종료 시그널 핸들러
cleanup() {
    echo -e "\n${RED}프로세스를 종료합니다...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

# SIGINT (Ctrl+C) 시그널 핸들러 등록
trap cleanup SIGINT SIGTERM

# Backend 시작
echo -e "\n${BLUE}[Backend] Flask 서버 시작 중... (Port 5001)${NC}"
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Backend가 준비될 때까지 대기
sleep 2

# Frontend 시작
echo -e "\n${BLUE}[Frontend] Vite 개발 서버 시작 중... (Port 3000)${NC}"
cd frontend/book-manager
npm run dev &
FRONTEND_PID=$!
cd ../..

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   서버가 실행 중입니다${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Backend:  http://127.0.0.1:5001${NC}"
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${RED}종료하려면 Ctrl+C를 누르세요${NC}"
echo -e "${GREEN}========================================${NC}\n"

# 백그라운드 프로세스가 종료될 때까지 대기
wait
