import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Volume2,
  VolumeX,
  RefreshCw,
  Filter,
  Bell,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react'

interface AlarmItem {
  id: number
  pointName: string
  type: string
  level: 'error' | 'warning' | 'info'
  value: string
  threshold: string
  status: 'pending' | 'confirmed' | 'resolved'
  createdAt: string
  desc: string
  confirmedAt?: string
  resolvedAt?: string
}

const mockAlarms: AlarmItem[] = [
  { id: 1, pointName: '城东泵站1#', type: '压力报警', level: 'error', value: '0.92MPa', threshold: '0.90MPa', status: 'pending', createdAt: '2024-01-15 10:32:15', desc: '压力超过设定阈值，建议检查泵组运行状态' },
  { id: 2, pointName: '工业园监测点', type: '水质异常', level: 'warning', value: 'COD 85', threshold: 'COD 80', status: 'pending', createdAt: '2024-01-15 09:15:30', desc: 'COD值偏高，建议加强曝气处理' },
  { id: 3, pointName: '城西泵站2#', type: '液位报警', level: 'warning', value: '3.2m', threshold: '3.5m', status: 'confirmed', createdAt: '2024-01-15 08:45:00', confirmedAt: '2024-01-15 09:00:00', desc: '液位低于预警线' },
  { id: 4, pointName: '县城进水口', type: '流量异常', level: 'info', value: '1850m³/h', threshold: '2000m³/h', status: 'resolved', createdAt: '2024-01-15 06:20:00', resolvedAt: '2024-01-15 07:30:00', desc: '进水流量波动' },
  { id: 5, pointName: '乡镇主管道', type: '压力报警', level: 'error', value: '0.95MPa', threshold: '0.90MPa', status: 'pending', createdAt: '2024-01-15 11:05:00', desc: '压力持续偏高，需紧急处理' },
]

export default function Alarm() {
  const [alarms, setAlarms] = useState(mockAlarms)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredAlarms = alarms.filter((a) => {
    const matchSearch = a.pointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       a.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchLevel = levelFilter === 'all' || a.level === levelFilter
    return matchSearch && matchStatus && matchLevel
  })

  const handleConfirm = (id: number) => {
    const alarm = alarms.find((a) => a.id === id)
    setAlarms(alarms.map((a) =>
      a.id === id ? { ...a, status: 'confirmed' as const, confirmedAt: new Date().toLocaleString() } : a
    ))
    if (alarm) {
      showNotification(`已确认报警: ${alarm.pointName}`)
    }
  }

  const handleResolve = (id: number) => {
    const alarm = alarms.find((a) => a.id === id)
    setAlarms(alarms.map((a) =>
      a.id === id ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toLocaleString() } : a
    ))
    if (alarm) {
      showNotification(`已恢复报警: ${alarm.pointName}`)
    }
  }

  const handleConfirmAll = () => {
    const pendingAlarms = alarms.filter((a) => a.status === 'pending')
    setAlarms(alarms.map((a) =>
      a.status === 'pending' ? { ...a, status: 'confirmed' as const, confirmedAt: new Date().toLocaleString() } : a
    ))
    showNotification(`已确认全部 ${pendingAlarms.length} 条报警`)
  }

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const levelColors = {
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    error: 'text-red-400 bg-red-500/10 border-red-500/30',
  }

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    resolved: CheckCircle,
  }

  const statusColors = {
    pending: 'text-amber-400',
    confirmed: 'text-blue-400',
    resolved: 'text-emerald-400',
  }

  const stats = {
    total: alarms.length,
    pending: alarms.filter((a) => a.status === 'pending').length,
    confirmed: alarms.filter((a) => a.status === 'confirmed').length,
    resolved: alarms.filter((a) => a.status === 'resolved').length,
    error: alarms.filter((a) => a.level === 'error' && a.status === 'pending').length,
    warning: alarms.filter((a) => a.level === 'warning' && a.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Toast通知 */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg shadow-teal-500/10">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <Bell size={18} className="text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">操作成功</p>
              <p className="text-xs text-[var(--text-muted)]">{toastMessage}</p>
            </div>
            <button onClick={() => setShowToast(false)} className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            报警管理
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            实时监控系统报警信息
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleRefresh} className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            刷新数据
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              soundEnabled 
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30' 
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700/70'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {soundEnabled ? '声音开启' : '声音关闭'}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">报警总数</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/50">
              <AlertTriangle size={24} className="text-slate-300" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-400">{stats.pending}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">待处理</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Clock size={24} className="text-amber-400" />
            </div>
          </div>
        </div>
        <div className="stat-card info p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-400">{stats.confirmed}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">已确认</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <CheckCircle size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-400">{stats.resolved}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">已恢复</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-400">{stats.error}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">严重报警</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <AlertCircle size={24} className="text-red-400" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-400">{stats.warning}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">警告</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <AlertTriangle size={24} className="text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 报警列表 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle size={22} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">报警记录</h3>
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
              {stats.pending}条待处理
            </span>
          </div>
          <button 
            onClick={handleConfirmAll}
            disabled={stats.pending === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              stats.pending > 0 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle size={16} />
            全部确认
          </button>
        </div>

        {/* 筛选 */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="搜索监测点或报警类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="confirmed">已确认</option>
              <option value="resolved">已恢复</option>
            </select>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">全部级别</option>
              <option value="error">严重</option>
              <option value="warning">警告</option>
              <option value="info">提示</option>
            </select>
          </div>
        </div>

        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">监测点</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">报警类型</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">级别</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">报警值/阈值</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">描述</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">发生时间</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.map((alarm) => {
                const StatusIcon = statusIcons[alarm.status]
                return (
                  <tr key={alarm.id} className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/30 transition-colors ${
                    alarm.status === 'pending' && alarm.level === 'error' ? 'bg-red-500/5' : ''
                  }`}>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-white">{alarm.pointName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-[var(--text-secondary)]">{alarm.type}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${levelColors[alarm.level]}`}>
                        {alarm.level === 'error' && <AlertCircle size={12} />}
                        {alarm.level === 'warning' && <AlertTriangle size={12} />}
                        {alarm.level === 'info' && <Bell size={12} />}
                        {alarm.level === 'error' ? '严重' : alarm.level === 'warning' ? '警告' : '提示'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-white font-medium">{alarm.value}</p>
                      <p className="text-xs text-[var(--text-muted)]">阈值: {alarm.threshold}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 max-w-[200px]">{alarm.desc}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={14} className={statusColors[alarm.status]} />
                        <span className={`text-sm ${statusColors[alarm.status]}`}>
                          {alarm.status === 'pending' ? '待处理' : alarm.status === 'confirmed' ? '已确认' : '已恢复'}
                        </span>
                      </div>
                      {(alarm.confirmedAt || alarm.resolvedAt) && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {alarm.status === 'confirmed' ? '确认: ' : '恢复: '}{alarm.confirmedAt || alarm.resolvedAt}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-[var(--text-secondary)] font-mono">{alarm.createdAt}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {alarm.status === 'pending' && (
                          <button
                            onClick={() => handleConfirm(alarm.id)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={12} />
                            确认
                          </button>
                        )}
                        {alarm.status === 'confirmed' && (
                          <button
                            onClick={() => handleResolve(alarm.id)}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={12} />
                            恢复
                          </button>
                        )}
                        {alarm.status === 'resolved' && (
                          <span className="text-xs text-[var(--text-muted)]">已关闭</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredAlarms.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-[var(--text-muted)]">
            <CheckCircle size={48} className="mb-4 opacity-50" />
            <p className="text-sm">暂无报警记录</p>
          </div>
        )}
      </div>
    </div>
  )
}