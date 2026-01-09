import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,  // 포트가 사용중이면 다른 포트 사용
    host: '0.0.0.0',    // 모든 네트워크 인터페이스에서 접근 허용
    open: true          // 자동으로 브라우저 열기
  }
})