import { useState } from 'react'
import {
  ClipboardList,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Search,
  Plus,
  Calendar,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Target,
  FileText,
} from 'lucide-react'
import { useAnimatedCounter, useRealtimeClock } from '@/hooks/useAnimatedCounter'

const mockTasks = [
  { id: 1, planName: '城东泵站日常巡检', assignee: '张师傅', location: '城东泵站', status: 'pending', content: '检查泵组运行状态、轴承温度、振动情况', createdAt: '2024-01-15 08:00', priority: 'high' },
  { id: 2, planName: '管网压力监测点巡检', assignee: '李师傅', location: '工业园管网', status: 'in_progress', content: '检查压力传感器、数据采集设备', createdAt: '2024-01-15 07:30', priority: 'medium' },
  { id: 3, planName: '县城出水口水质巡检', assignee: '王师傅', location: '县城出水口', status: 'completed', content: '水质采样、在线监测设备校准', createdAt: '2024-01-14 14:00', completedAt: '2024-01-14 16:30', priority: 'high' },
  { id: 4, planName: '乡镇管网巡检', assignee: '赵师傅', location: '乡镇主管道', status: 'pending', content: '管网压力检测、阀门状态检查', createdAt: '2024-01-15 06:00', priority: 'low' },
  { id: 5, planName: '格栅除污设备巡检', assignee: '张师傅', location: '县城污水处理厂', status: 'completed', content: '格栅运行检查、栅渣清理', createdAt: '2024-01-14 09:00', completedAt: '2024-01-14 11:00', priority: 'medium' },
]

const mockPlans = [
  { id: 1, name: '每日例行巡检', frequency: '每日', lastExecute: '2024-01-15', nextExecute: '2024-01-16', tasks: 8, completionRate: 75 },
  { id: 2, name: '周度设备检查', frequency: '每周', lastExecute: '2024-01-14', nextExecute: '2024-01-21', tasks: 15, completionRate: 100 },
  { id: 3, name: '月度维护计划', frequency: '每月', lastExecute: '2024-01-01', nextExecute: '2024-02-01', tasks: 25, completionRate: 40 },
]

const mockStats = {
  total: 156,
  pending: 12,
  inProgress: 5,
  completed: 139,
  completionRate: 89.1,
  todayTasks: 12,
  todayCompleted: 8,
  overdue: 2,
}

export default function Inspection() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const time = useRealtimeClock()

  const totalTasks = useAnimatedCounter(mockStats.total, 1500)
  const pendingTasks = useAnimatedCounter(mockStats.pending, 1500)
  const inProgressTasks = useAnimatedCounter(mockStats.inProgress, 1500)
  const completedTasks = useAnimatedCounter(mockStats.completed, 1500)
  const completionRate = useAnimatedCounter(mockStats.completionRate, 1500)

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       t.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleUpdateStatus = (id: number, newStatus: 'pending' | 'in_progress' | 'completed') => {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toLocaleString() : undefined } : t
    ))
  }

  const statusConfig = {
    pending: { label: '待执行', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
    in_progress: { label: '执行中', icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    completed: { label: '已完成', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  }

  const priorityConfig = {
    high: { label: '高', color: 'text-red-400', bg: 'bg-red-500/10' },
    medium: { label: '中', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    low: { label: '低', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  }

  const getTimelineStatus = (task: typeof mockTasks[0]) => {
    if (task.status === 'completed') return 'completed'
    if (task.status === 'in_progress') return 'in_progress'
    return 'pending'
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            巡检管理
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            实时监控巡检任务执行状态
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleRefresh} className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            刷新数据
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-xl font-medium hover:bg-teal-500/30 border border-teal-500/30 transition-all">
            <Plus size={16} />
            新建任务
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{Math.round(totalTasks)}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">巡检总数</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/50">
              <ClipboardList size={24} className="text-slate-300" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-400">{Math.round(pendingTasks)}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">待执行</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Clock size={24} className="text-amber-400" />
            </div>
          </div>
        </div>
        <div className="stat-card info p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-400">{Math.round(inProgressTasks)}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">执行中</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <AlertCircle size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-400">{Math.round(completedTasks)}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">已完成</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-teal-400">{completionRate.toFixed(1)}%</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">完成率</p>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/20">
              <TrendingUp size={24} className="text-teal-400" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-400">{mockStats.overdue}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">逾期任务</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <AlertCircle size={24} className="text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 今日进度环 */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-teal-500/20">
            <Target size={22} className="text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">今日巡检进度</h3>
        </div>
        <div className="flex items-center justify-center gap-12">
          <div className="relative">
            <svg className="w-32 h-32 progress-ring" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="progress-ring-bg"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="progress-ring-progress"
                strokeWidth="8"
                fill="transparent"
                stroke="#0d9488"
                strokeDasharray={`${(mockStats.todayCompleted / mockStats.todayTasks) * 283} 283`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{mockStats.todayCompleted}</span>
              <span className="text-sm text-[var(--text-muted)]">/ {mockStats.todayTasks} 项</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '计划任务', value: mockStats.todayTasks, icon: Calendar },
              { label: '已完成', value: mockStats.todayCompleted, icon: CheckCircle },
              { label: '进行中', value: mockStats.todayTasks - mockStats.todayCompleted - mockStats.overdue, icon: AlertCircle },
              { label: '逾期', value: mockStats.overdue, icon: AlertCircle },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon size={16} className="text-teal-400" />
                  <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 巡检计划 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <ClipboardList size={22} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">巡检计划</h3>
          </div>
          <button className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 group">
            查看全部 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPlans.map((plan) => (
            <div key={plan.id} className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl hover:bg-[var(--bg-secondary)]/70 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">{plan.name}</h4>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                  {plan.frequency}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">上次执行</span>
                  <span className="text-white">{plan.lastExecute}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">下次执行</span>
                  <span className="text-cyan-400">{plan.nextExecute}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--text-muted)]">完成率</span>
                  <span className="text-teal-400 font-medium">{plan.completionRate}%</span>
                </div>
                <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${plan.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">{plan.tasks}项任务</span>
                <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 巡检任务列表 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <FileText size={22} className="text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">巡检任务</h3>
            <span className="px-2 py-0.5 bg-slate-600/50 text-slate-400 rounded-full text-xs font-medium">
              {filteredTasks.length}项
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--bg-secondary)]/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                列表视图
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                时间线
              </button>
            </div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="搜索任务名称或地点..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">全部状态</option>
            <option value="pending">待执行</option>
            <option value="in_progress">执行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const config = statusConfig[task.status]
              const priority = priorityConfig[task.priority]
              const StatusIcon = config.icon
              return (
                <div key={task.id} className={`bg-[var(--bg-secondary)]/50 border rounded-xl p-4 hover:bg-[var(--bg-secondary)]/70 transition-all ${
                  task.status === 'in_progress' ? `border-l-4 ${config.border}` : 'border-[var(--border-color)]'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <StatusIcon size={20} className={config.color} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white">{task.planName}</h4>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${priority.bg} ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-2">{task.content}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <User size={12} />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <MapPin size={12} />
                            <span>{task.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <Clock size={12} />
                            <span>{task.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                        >
                          <AlertCircle size={12} />
                          开始执行
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'completed')}
                          className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle size={12} />
                          完成
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <span className="text-xs text-[var(--text-muted)]">已完成于 {task.completedAt}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 时间线视图 */}
        {viewMode === 'timeline' && (
          <div className="timeline-container">
            {filteredTasks.map((task) => {
              const config = statusConfig[task.status]
              const StatusIcon = config.icon
              return (
                <div key={task.id} className="timeline-item">
                  <div className={`timeline-dot ${getTimelineStatus(task)}`} />
                  <div className="bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-xl p-4 hover:bg-[var(--bg-secondary)]/70 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon size={16} className={config.color} />
                          <h4 className="text-sm font-medium text-white">{task.planName}</h4>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-2">{task.content}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-[var(--text-muted)]">{task.location}</span>
                          <span className="text-[var(--text-muted)]">|</span>
                          <span className="text-[var(--text-muted)]">{task.assignee}</span>
                          <span className="text-[var(--text-muted)]">|</span>
                          <span className={config.color}>{config.label}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--text-muted)]">{task.createdAt}</p>
                        {task.completedAt && (
                          <p className="text-xs text-emerald-400 mt-1">完成: {task.completedAt}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ClipboardList size={48} className="opacity-50" />
            </div>
            <p className="empty-state-title">暂无巡检任务</p>
            <p className="empty-state-desc">点击右上角按钮新建任务</p>
          </div>
        )}
      </div>
    </div>
  )
}
