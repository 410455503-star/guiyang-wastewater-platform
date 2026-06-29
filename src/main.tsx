import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 引入哈希路由
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 全局包裹哈希路由，完美适配GitHub Pages二级仓库 */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
