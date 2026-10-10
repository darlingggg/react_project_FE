import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 设置基础路径为相对路径
  plugins: [
    react(),
    visualizer({
      open: true, // 打包完成后自动打开报告
      filename: 'dist/stats.html', // 分析文件生成位置
      gzipSize: true, // 收集 gzip 大小
      brotliSize: true, // 收集 brotli 大小
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库拆分为单独 chunk
          'react-vendor': ['react', 'react-dom'],
          // 将工具库拆分为单独 chunk
          'utils-vendor': ['lodash', 'axios'],
          // 将 UI 库拆分为单独 chunk
          'ui-vendor': ['antd', '@ant-design/icons'],
          // 将状态管理库拆分为单独 chunk
          'state-vendor': ['redux', 'react-redux', '@reduxjs/toolkit'],
        },
      },
    },
  },
})
