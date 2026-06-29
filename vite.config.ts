import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 关键修改：固定为仓库全名，首尾斜杠不能省略
  base: '/guiyang-wastewater-platform/',
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          })
        }
      }
    }
  }
})
