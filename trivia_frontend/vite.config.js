import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Use jsdom for tests
    globals:true,
    testTimeout: 50000,
    setupFiles: './src/tests/setupTests.js', // Optional, for setting up jest-dom
  },
})