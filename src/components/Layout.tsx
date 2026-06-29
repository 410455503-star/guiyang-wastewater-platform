import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  Settings,
  AlertTriangle,
  BarChart3,
  ClipboardList,
  Zap,
  Menu,
  X,
  Bell,
  User,
  Droplet,
} from 'lucide-react'
import { useStore } from '@/stores/appStore'
import { useRealtimeClock } from '@/hooks/useAnimatedCounter'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '首页大屏', badge: 0 },
  { path: '/monitoring', icon: Activity, label: '监测管理', badge: 0 },
  { path: '/control', icon: Settings, label: '中央控制', badge: 0 },
  { path: '/alarm', icon: AlertTriangle, label: '报警管理', badge: 5 },
  { path: '/analysis', icon: BarChart3, label: '数据分析', badge: 0 },
  { path: '/inspection', icon: ClipboardList, label: '巡检管理', badge: 0 },
  { path: '/energy', icon: Zap, label: '能耗分析', badge: 0 },
  { path: '/system', icon: Settings, label: '系统设置', badge: 0 },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { alarms } = useStore()
  const pendingAlarms = alarms.filter((a) => a.status === 'pending').length
  const time = useRealtimeClock()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] grid-bg">
      {/* 侧边栏 */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--border-color)] flex flex-col transition-all duration-300 z-10`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Droplet size={22} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">桂阳污水处理</h1>
                <p className="text-xs text-[var(--text-muted)]">智慧水务管理平台</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-all"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item, index) => (
              <li key={item.path} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white'
                    }`}>
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-500/20' : ''}`}>
                        <item.icon size={20} />
                      </div>
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                      {(pendingAlarms > 0 || item.badge > 0) && item.path === '/alarm' && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs flex items-center justify-center text-white font-bold animate-bounce-gentle">
                          {pendingAlarms > 9 ? '9+' : pendingAlarms}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 底部用户信息 */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <User size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--bg-secondary)]" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">管理员</p>
                <p className="text-xs text-[var(--text-muted)] truncate">系统管理员</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-20 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border-b border-[var(--border-color)] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              智慧水务管理平台
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-400">系统运行正常</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">{formatDate(time)}</p>
              <p className="text-lg font-mono text-cyan-400">{formatTime(time)}</p>
            </div>
            <button className="relative p-3 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-all group">
              <Bell size={22} className="group-hover:scale-110 transition-transform" />
              {pendingAlarms > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/50">
                  {pendingAlarms > 9 ? '9+' : pendingAlarms}
                </span>
              )}
            </button>
            <button className="p-3 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-all">
              <User size={22} />
            </button>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto p-6 bg-decoration">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
