import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 引入HashRouter哈希路由
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 外层包裹哈希路由 */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
