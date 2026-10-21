import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // GitHub Pages（https://timmy-0123bot.github.io/task-board2/）向けに、ビルドとプレビューでは公開パスを設定する
  // 開発サーバー（npm run dev）は従来どおり http://localhost:5173/ で開ける
  base: command === 'build' || isPreview ? '/task-board2/' : '/',
}))
