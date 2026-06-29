import { useState, useEffect, useRef } from 'react'
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Gauge,
  Droplets,
  Waves,
  Activity,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Edit2,
  History,
  Settings,
  Clock,
  TrendingUp,
} from 'lucide-react'
import * as echarts from 'echarts'

const pointTypes = [
  { type: 'pressure', label: '压力监测', icon: Gauge, color: '#3b82f6', bgColor: 'bg-blue-500/20' },
  { type: 'flow', label: '流量监测', icon: Droplets, color: '#0d9488', bgColor: 'bg-teal-500/20' },
  { type: 'level', label: '液位监测', icon: Waves, color: '#8b5cf6', bgColor: 'bg-violet-500/20' },
  { type: 'quality', label: '水质监测', icon: Activity, color: '#10b981', bgColor: 'bg-emerald-500/20' },
]

const mockPoints = [
  { id: 1, name: '城东泵站1#', type: 'pressure', status: 'normal', value: 0.85, threshold: 0.9, lat: 25.75, lng: 112.85, group: '城东泵站', unit: 'MPa', lastUpdate: '10:35' },
  { id: 2, name: '工业园监测点', type: 'quality', status: 'upper_alarm', value: 85, threshold: 80, lat: 25.73, lng: 112.88, group: '工业园泵站', unit: 'mg/L', lastUpdate: '10:34' },
  { id: 3, name: '城西泵站2#', type: 'level', status: 'lower_alarm', value: 3.2, threshold: 3.5, lat: 25.76, lng: 112.80, group: '城西泵站', unit: 'm', lastUpdate: '10:33' },
  { id: 4, name: '县城进水口', type: 'flow', status: 'normal', value: 1250, threshold: 1500, lat: 25.74, lng: 112.83, group: '县城污水处理厂', unit: 'm³/h', lastUpdate: '10:35' },
  { id: 5, name: '县城出水口', type: 'quality', status: 'normal', value: 15, threshold: 30, lat: 25.74, lng: 112.84, group: '县城污水处理厂', unit: 'mg/L', lastUpdate: '10:35' },
  { id: 6, name: '乡镇主管道', type: 'pressure', status: 'normal', value: 0.72, threshold: 0.9, lat: 25.78, lng: 112.86, group: '乡镇污水站点', unit: 'MPa', lastUpdate: '10:32' },
  { id: 7, name: '城北监测点', type: 'flow', status: 'normal', value: 850, threshold: 1200, lat: 25.77, lng: 112.82, group: '城北泵站', unit: 'm³/h', lastUpdate: '10:30' },
  { id: 8, name: '城南监测点', type: 'pressure', status: 'upper_alarm', value: 0.95, threshold: 0.9, lat: 25.72, lng: 112.85, group: '城南泵站', unit: 'MPa', lastUpdate: '10:28' },
]

export default function Monitoring() {
  const [points] = useState(mockPoints)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedGroup, setSelectedGroup] = useState<string>('all')
  const [selectedPoint, setSelectedPoint] = useState<typeof mockPoints[0] | null>(null)
  const [mapZoom, setMapZoom] = useState(10)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  const groups = ['all', ...new Set(points.map((p) => p.group))]

  const filteredPoints = points.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = selectedType === 'all' || p.type === selectedType
    const matchGroup = selectedGroup === 'all' || p.group === selectedGroup
    return matchSearch && matchType && matchGroup
  })

  const statusCounts = {
    normal: points.filter((p) => p.status === 'normal').length,
    upper_alarm: points.filter((p) => p.status === 'upper_alarm').length,
    lower_alarm: points.filter((p) => p.status === 'lower_alarm').length,
  }

  useEffect(() => {
    if (!chartRef.current || !selectedPoint) return
    const chart = echarts.init(chartRef.current)

    const times = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
    const baseValue = selectedPoint.value

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: `${selectedPoint.name} - 实时数据趋势`,
        textStyle: { color: '#94a3b8', fontSize: 13, fontWeight: 'normal' },
        left: 'center',
        top: 5,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        textStyle: { color: '#e2e8f0' },
        padding: [10, 14],
      },
      grid: { left: '12%', right: '5%', top: 50, bottom: '18%' },
      xAxis: {
        type: 'category',
        data: times,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10, rotate: 30 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
      },
      series: [
        {
          name: '监测值',
          type: 'line',
          smooth: true,
          data: times.map(() => baseValue + (Math.random() - 0.5) * baseValue * 0.2),
          lineStyle: { color: '#0d9488', width: 3 },
          itemStyle: { color: '#0d9488' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(13, 148, 136, 0.35)' },
            { offset: 1, color: 'rgba(13, 148, 136, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 5,
          emphasis: {
            itemStyle: { color: '#0d9488', borderColor: '#fff', borderWidth: 2 },
          },
        },
        {
          name: '上限阈值',
          type: 'line',
          data: times.map(() => selectedPoint.threshold),
          lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
          itemStyle: { color: '#ef4444' },
          symbol: 'none',
        },
        {
          name: '下限阈值',
          type: 'line',
          data: times.map(() => selectedPoint.threshold * 0.6),
          lineStyle: { color: '#eab308', type: 'dashed', width: 2 },
          itemStyle: { color: '#eab308' },
          symbol: 'none',
        },
      ],
    }

    chart.setOption(option)
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [selectedPoint])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-500'
      case 'upper_alarm': return 'bg-red-500 animate-pulse'
      case 'lower_alarm': return 'bg-amber-500 animate-pulse'
      default: return 'bg-slate-500'
    }
  }

  const getPointIcon = (type: string) => {
    const typeInfo = pointTypes.find((t) => t.type === type)
    return typeInfo?.icon || MapPin
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
            监测点管理
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            实时监控各监测点数据状态
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          刷新数据
        </button>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{points.length}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">监测点总数</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/50">
              <MapPin size={24} className="text-slate-300" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-400">{statusCounts.normal}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">正常运行</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Activity size={24} className="text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-400">{statusCounts.upper_alarm}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">上限报警</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <Gauge size={24} className="text-red-400" />
            </div>
          </div>
        </div>
        <div className="stat-card warning p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-400">{statusCounts.lower_alarm}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">下限报警</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Waves size={24} className="text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 监测点列表 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20">
                <Activity size={22} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">监测点列表</h3>
              <span className="px-2 py-0.5 bg-slate-600/50 text-slate-400 rounded-full text-xs font-medium">
                {filteredPoints.length}个
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all">
              <Plus size={16} />
              新增监测点
            </button>
          </div>

          {/* 筛选和搜索 */}
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="搜索监测点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 input-field"
              >
                <option value="all">全部类型</option>
                {pointTypes.map((t) => (
                  <option key={t.type} value={t.type}>{t.label}</option>
                ))}
              </select>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="flex-1 input-field"
              >
                <option value="all">全部分组</option>
                {groups.filter((g) => g !== 'all').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 列表 */}
          <div className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto pr-1">
            {filteredPoints.map((point) => {
              const typeInfo = pointTypes.find((t) => t.type === point.type)
              const PointIcon = getPointIcon(point.type)
              return (
                <div
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPoint?.id === point.id
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500/50 shadow-lg shadow-teal-500/10'
                      : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${typeInfo?.bgColor}`}>
                        <PointIcon size={18} style={{ color: typeInfo?.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{point.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[var(--text-muted)]">{point.group}</span>
                          <span className="text-xs text-[var(--text-muted)]">·</span>
                          <div className="flex items-center gap-1">
                            <Clock size={10} className="text-[var(--text-muted)]" />
                            <span className="text-xs text-[var(--text-muted)]">{point.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{point.value} <span className="text-xs font-normal text-[var(--text-muted)]">{point.unit}</span></p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(point.status)}`} />
                        <span className={`text-xs ${
                          point.status === 'normal' ? 'text-emerald-400' :
                          point.status === 'upper_alarm' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {point.status === 'normal' ? '正常' : point.status === 'upper_alarm' ? '上限报警' : '下限报警'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 地图视图 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <MapPin size={22} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">监测点分布图</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMapZoom(Math.max(8, mapZoom - 1))} className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-all">
                <ZoomOut size={18} />
              </button>
              <span className="text-sm text-[var(--text-muted)]">{mapZoom}</span>
              <button onClick={() => setMapZoom(Math.min(13, mapZoom + 1))} className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-all">
                <ZoomIn size={18} />
              </button>
            </div>
          </div>

          {/* 模拟地图 */}
          <div className="relative h-96 bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
            <div className="absolute inset-0 grid-bg" />
            
            {/* 地图标记 */}
            {filteredPoints.map((point, index) => {
              const x = ((point.lng - 112.75) / 0.15) * 100
              const y = ((25.85 - point.lat) / 0.13) * 100
              return (
                <div
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    selectedPoint?.id === point.id ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className={`w-5 h-5 rounded-full ${getStatusColor(point.status)} shadow-lg flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-[var(--border-color)]`}>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-[var(--text-muted)]">{point.value} {point.unit}</p>
                  </div>
                </div>
              )
            })}

            {/* 图例 */}
            <div className="absolute bottom-4 left-4 p-3 bg-[var(--bg-secondary)]/90 backdrop-blur rounded-lg border border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-muted)] mb-2">图例</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-white">正常</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-white">上限报警</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs text-white">下限报警</span>
                </div>
              </div>
            </div>

            {/* 网格坐标 */}
            <div className="absolute top-2 right-2 text-xs text-[var(--text-muted)]/50 font-mono">
              桂阳县区域
            </div>
          </div>
        </div>

        {/* 详情和图表 */}
        <div className="glass-card p-6">
          {selectedPoint ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedPoint.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-[var(--text-muted)]">{selectedPoint.group}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedPoint.status)}`} />
                    <span className={`text-xs ${
                      selectedPoint.status === 'normal' ? 'text-emerald-400' :
                      selectedPoint.status === 'upper_alarm' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {selectedPoint.status === 'normal' ? '正常' : selectedPoint.status === 'upper_alarm' ? '上限报警' : '下限报警'}
                    </span>
                  </div>
                </div>
                <button onClick={handleRefresh} className="flex items-center gap-1 p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white transition-all">
                  <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                  刷新
                </button>
              </div>

              {/* 关键参数 */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-[var(--bg-secondary)]/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-cyan-400" />
                    <span className="text-xs text-[var(--text-muted)]">当前值</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{selectedPoint.value} <span className="text-sm font-normal text-[var(--text-muted)]">{selectedPoint.unit}</span></p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)]/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings size={14} className="text-amber-400" />
                    <span className="text-xs text-[var(--text-muted)]">阈值范围</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {selectedPoint.threshold * 0.6} - {selectedPoint.threshold} {selectedPoint.unit}
                  </p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)]/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-blue-400" />
                    <span className="text-xs text-[var(--text-muted)]">经度</span>
                  </div>
                  <p className="text-sm font-mono text-white">{selectedPoint.lng}</p>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)]/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-blue-400" />
                    <span className="text-xs text-[var(--text-muted)]">纬度</span>
                  </div>
                  <p className="text-sm font-mono text-white">{selectedPoint.lat}</p>
                </div>
              </div>

              {/* 实时趋势 */}
              <div className="mb-4">
                <p className="text-xs text-[var(--text-muted)] mb-2">实时趋势</p>
                <div ref={chartRef} className="h-52" />
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 btn-primary text-sm">
                  <Edit2 size={14} />
                  编辑监测点
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 btn-secondary text-sm">
                  <History size={14} />
                  查看历史数据
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div className="p-6 rounded-full bg-[var(--bg-secondary)]/50 mb-4">
                <MapPin size={48} className="opacity-50" />
              </div>
              <p className="text-sm">点击左侧监测点查看详情</p>
              <p className="text-xs mt-1">或点击地图标记</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}