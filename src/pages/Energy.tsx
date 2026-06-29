import { useEffect, useRef, useState } from 'react'
import {
  Zap,
  Droplets,
  Thermometer,
  Wind,
  TrendingUp,
  BarChart3,
  Calendar,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  Clock,
  Download,
  Settings,
} from 'lucide-react'
import * as echarts from 'echarts'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

const energyTypes = [
  { type: 'electric', label: '电能', icon: Zap, color: '#fbbf24', unit: 'kWh', bgColor: 'bg-amber-500/20' },
  { type: 'water', label: '水耗', icon: Droplets, color: '#3b82f6', unit: 'm³', bgColor: 'bg-blue-500/20' },
  { type: 'oil', label: '油耗', icon: Thermometer, color: '#ef4444', unit: 'L', bgColor: 'bg-red-500/20' },
  { type: 'gas', label: '气耗', icon: Wind, color: '#8b5cf6', unit: 'm³', bgColor: 'bg-purple-500/20' },
]

const mockDevices = [
  { id: 1, name: '1#进水泵', category: '进水泵', efficiency: 88.5, status: 'normal', todayEnergy: 125, weekEnergy: 875, monthEnergy: 3500 },
  { id: 2, name: '2#进水泵', category: '进水泵', efficiency: 85.2, status: 'warning', todayEnergy: 118, weekEnergy: 826, monthEnergy: 3280 },
  { id: 3, name: '1#鼓风机', category: '鼓风机', efficiency: 91.2, status: 'normal', todayEnergy: 245, weekEnergy: 1715, monthEnergy: 6860 },
  { id: 4, name: '2#鼓风机', category: '鼓风机', efficiency: 89.8, status: 'normal', todayEnergy: 238, weekEnergy: 1666, monthEnergy: 6664 },
  { id: 5, name: '1#污泥泵', category: '污泥泵', efficiency: 85.8, status: 'normal', todayEnergy: 68, weekEnergy: 476, monthEnergy: 1904 },
  { id: 6, name: '2#污泥泵', category: '污泥泵', efficiency: 83.5, status: 'warning', todayEnergy: 65, weekEnergy: 455, monthEnergy: 1820 },
  { id: 7, name: '脱水机1', category: '脱水机', efficiency: 87.3, status: 'warning', todayEnergy: 105, weekEnergy: 735, monthEnergy: 2940 },
  { id: 8, name: '脱水机2', category: '脱水机', efficiency: 89.5, status: 'normal', todayEnergy: 108, weekEnergy: 756, monthEnergy: 3024 },
  { id: 9, name: '曝气设备', category: '曝气设备', efficiency: 92.1, status: 'normal', todayEnergy: 185, weekEnergy: 1295, monthEnergy: 5180 },
  { id: 10, name: '回流泵', category: '回流泵', efficiency: 86.8, status: 'normal', todayEnergy: 55, weekEnergy: 385, monthEnergy: 1540 },
]

const mockStats = {
  totalCost: 2850000,
  electricCost: 1650000,
  waterCost: 580000,
  oilCost: 320000,
  gasCost: 300000,
  efficiency: 92.5,
  todayEnergy: 1302,
  weekEnergy: 9114,
  monthEnergy: 36456,
  peakPower: 580,
  avgPower: 325,
}

export default function Energy() {
  const trendChartRef = useRef<HTMLDivElement>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const radarChartRef = useRef<HTMLDivElement>(null)
  const [dateRange, setDateRange] = useState('week')
  const [selectedDevice, setSelectedDevice] = useState<typeof mockDevices[0] | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const totalCost = useAnimatedCounter(mockStats.totalCost, 2000)
  const efficiency = useAnimatedCounter(mockStats.efficiency, 1500)

  const categories = ['all', ...new Set(mockDevices.map((d) => d.category))]

  const filteredDevices = mockDevices.filter((d) => 
    categoryFilter === 'all' || d.category === categoryFilter
  )

  const costBreakdown = [
    { name: '电能', cost: mockStats.electricCost, percent: 57.9, color: '#fbbf24' },
    { name: '水耗', cost: mockStats.waterCost, percent: 20.4, color: '#3b82f6' },
    { name: '油耗', cost: mockStats.oilCost, percent: 11.2, color: '#ef4444' },
    { name: '气耗', cost: mockStats.gasCost, percent: 10.5, color: '#8b5cf6' },
  ]

  useEffect(() => {
    if (!trendChartRef.current) return
    const chart = echarts.init(trendChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '能耗趋势分析',
        textStyle: { color: '#94a3b8', fontSize: 14, fontWeight: 'normal' },
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
      legend: {
        data: ['电能', '水耗', '气耗'],
        textStyle: { color: '#94a3b8', fontSize: 12 },
        top: 30,
        itemGap: 20,
      },
      grid: { left: '10%', right: '5%', top: 70, bottom: '15%' },
      xAxis: {
        type: 'category',
        data: dateRange === 'week' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] :
              dateRange === 'month' ? ['第1周', '第2周', '第3周', '第4周'] : ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'kWh',
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
      },
      series: [
        {
          name: '电能',
          type: 'line',
          smooth: true,
          data: [125000, 132000, 128000, 135000, 142000, 138000, 135000].slice(0, dateRange === 'month' ? 4 : 7),
          lineStyle: { color: '#fbbf24', width: 3 },
          itemStyle: { color: '#fbbf24' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(251, 191, 36, 0.3)' },
            { offset: 1, color: 'rgba(251, 191, 36, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          name: '水耗',
          type: 'line',
          smooth: true,
          data: [8500, 9200, 8800, 9500, 10200, 9800, 9500].slice(0, dateRange === 'month' ? 4 : 7),
          lineStyle: { color: '#3b82f6', width: 3 },
          itemStyle: { color: '#3b82f6' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          name: '气耗',
          type: 'line',
          smooth: true,
          data: [3200, 3500, 3300, 3800, 4100, 3900, 3700].slice(0, dateRange === 'month' ? 4 : 7),
          lineStyle: { color: '#8b5cf6', width: 3 },
          itemStyle: { color: '#8b5cf6' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
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
  }, [dateRange])

  useEffect(() => {
    if (!pieChartRef.current) return
    const chart = echarts.init(pieChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '能耗构成分析',
        textStyle: { color: '#94a3b8', fontSize: 14, fontWeight: 'normal' },
        left: 'center',
        top: 5,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        textStyle: { color: '#e2e8f0' },
        padding: [10, 14],
        formatter: '{b}: {c}万元 ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '8%',
        top: 'center',
        textStyle: { color: '#94a3b8', fontSize: 12 },
        itemGap: 12,
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['35%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#0a0f1a', borderWidth: 2 },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 13, fontWeight: 'bold', color: '#fff', formatter: '{b}\n{c}万元' },
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
          data: costBreakdown.map((item) => ({
            value: (item.cost / 10000).toFixed(1),
            name: item.name,
            itemStyle: { color: item.color },
          })),
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
  }, [])

  useEffect(() => {
    if (!radarChartRef.current) return
    const chart = echarts.init(radarChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '设备能效对比',
        textStyle: { color: '#94a3b8', fontSize: 14, fontWeight: 'normal' },
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
      legend: {
        data: ['本月', '上月'],
        textStyle: { color: '#94a3b8', fontSize: 12 },
        top: 30,
      },
      radar: {
        indicator: [
          { name: '进水泵', max: 100 },
          { name: '鼓风机', max: 100 },
          { name: '污泥泵', max: 100 },
          { name: '脱水机', max: 100 },
          { name: '曝气设备', max: 100 },
          { name: '回流泵', max: 100 },
        ],
        axisName: { color: '#94a3b8' },
        splitArea: { areaStyle: { color: ['rgba(13, 148, 136, 0.05)', 'rgba(13, 148, 136, 0.1)'] } },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [86.8, 90.5, 84.6, 88.4, 92.1, 86.8],
              name: '本月',
              lineStyle: { color: '#0d9488' },
              areaStyle: { color: 'rgba(13, 148, 136, 0.3)' },
              itemStyle: { color: '#0d9488' },
            },
            {
              value: [84.5, 88.2, 82.3, 86.1, 90.5, 84.2],
              name: '上月',
              lineStyle: { color: '#64748b' },
              areaStyle: { color: 'rgba(100, 116, 139, 0.2)' },
              itemStyle: { color: '#64748b' },
            },
          ],
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
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case 'warning': return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            能耗分析
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            实时监控能耗数据，优化能源使用效率
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[var(--text-muted)]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field text-sm"
            >
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
            </select>
          </div>
          <button onClick={handleRefresh} className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            刷新数据
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl font-medium hover:bg-blue-500/30 border border-blue-500/30 transition-all">
            <Download size={16} />
            导出报表
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{(totalCost / 10000).toFixed(1)}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">总能耗成本</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={14} className="text-red-400" />
                <span className="text-xs text-red-400">+3.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Zap size={24} className="text-amber-400" />
            </div>
          </div>
        </div>
        {energyTypes.map((item) => (
          <div key={item.type} className="stat-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {item.type === 'electric' ? (mockStats.electricCost / 10000).toFixed(0) :
                   item.type === 'water' ? (mockStats.waterCost / 10000).toFixed(0) :
                   item.type === 'oil' ? (mockStats.oilCost / 10000).toFixed(0) :
                   (mockStats.gasCost / 10000).toFixed(0)}
                  <span className="text-sm font-normal text-[var(--text-muted)] ml-1">万元</span>
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">{item.label}成本</p>
              </div>
              <div className={`p-3 rounded-xl ${item.bgColor}`}>
                <item.icon size={24} style={{ color: item.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Target size={18} className="text-cyan-400" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">综合能效</span>
          </div>
          <p className="text-3xl font-bold text-cyan-400">{efficiency.toFixed(1)}%</p>
          <div className="mt-3 h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" style={{ width: `${efficiency}%` }} />
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Activity size={18} className="text-blue-400" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">今日能耗</span>
          </div>
          <p className="text-3xl font-bold text-white">{mockStats.todayEnergy} <span className="text-sm font-normal text-[var(--text-muted)]">kWh</span></p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400">-2.1%</span>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <TrendingUp size={18} className="text-purple-400" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">峰值功率</span>
          </div>
          <p className="text-3xl font-bold text-white">{mockStats.peakPower} <span className="text-sm font-normal text-[var(--text-muted)]">kW</span></p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight size={14} className="text-red-400" />
            <span className="text-xs text-red-400">+5.8%</span>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <Clock size={18} className="text-teal-400" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">平均功率</span>
          </div>
          <p className="text-3xl font-bold text-white">{mockStats.avgPower} <span className="text-sm font-normal text-[var(--text-muted)]">kW</span></p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400">-1.2%</span>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div ref={trendChartRef} className="h-80" />
        </div>
        <div className="glass-card p-6">
          <div ref={pieChartRef} className="h-80" />
        </div>
        <div className="glass-card p-6">
          <div ref={radarChartRef} className="h-80" />
        </div>
      </div>

      {/* 成本构成分析 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <BarChart3 size={22} className="text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">成本构成分析</h3>
          </div>
          <button className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 group">
            查看详情 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {costBreakdown.map((item) => (
            <div key={item.name} className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl hover:bg-[var(--bg-secondary)]/70 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{item.name}</span>
                <span className="text-lg font-bold" style={{ color: item.color }}>{item.percent}%</span>
              </div>
              <div className="h-3 bg-[var(--bg-card)] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">成本</span>
                <span className="text-white font-medium">{(item.cost / 10000).toFixed(1)}万元</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 设备级能耗分析 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Zap size={22} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">设备级能耗分析</h3>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">全部分类</option>
            {categories.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 设备列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(selectedDevice?.id === device.id ? null : device)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDevice?.id === device.id
                  ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border-teal-500/50 shadow-lg shadow-teal-500/10'
                  : 'bg-[var(--bg-secondary)]/50 border-[var(--border-color)] hover:border-[var(--border-color-hover)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{device.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(device.status)}`}>
                  {device.status === 'normal' ? '正常' : device.status === 'warning' ? '预警' : '异常'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[var(--text-muted)]">能效</span>
                <span className={`text-lg font-bold ${device.efficiency >= 90 ? 'text-emerald-400' : device.efficiency >= 85 ? 'text-amber-400' : 'text-red-400'}`}>
                  {device.efficiency}%
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    device.efficiency >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                    device.efficiency >= 85 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-rose-500'
                  }`}
                  style={{ width: `${device.efficiency}%` }}
                />
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">今日</span>
                <span className="text-amber-400 font-medium">{device.todayEnergy} kWh</span>
              </div>
            </div>
          ))}
        </div>

        {/* 设备详情面板 */}
        {selectedDevice && (
          <div className="mt-6 p-4 bg-[var(--bg-secondary)]/80 rounded-xl border border-teal-500/30 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{selectedDevice.name}</h4>
                <p className="text-sm text-[var(--text-muted)]">{selectedDevice.category} · {selectedDevice.status === 'normal' ? '运行正常' : '需关注'}</p>
              </div>
              <button onClick={() => setSelectedDevice(null)} className="p-2 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white transition-all">
                <ChevronRight size={20} className="rotate-90" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-[var(--bg-card)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">今日能耗</p>
                <p className="text-xl font-bold text-amber-400">{selectedDevice.todayEnergy} <span className="text-sm font-normal text-[var(--text-muted)]">kWh</span></p>
              </div>
              <div className="p-3 bg-[var(--bg-card)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">本周能耗</p>
                <p className="text-xl font-bold text-white">{selectedDevice.weekEnergy} <span className="text-sm font-normal text-[var(--text-muted)]">kWh</span></p>
              </div>
              <div className="p-3 bg-[var(--bg-card)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">本月能耗</p>
                <p className="text-xl font-bold text-white">{selectedDevice.monthEnergy} <span className="text-sm font-normal text-[var(--text-muted)]">kWh</span></p>
              </div>
              <div className="p-3 bg-[var(--bg-card)] rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">能效指数</p>
                <p className={`text-xl font-bold ${selectedDevice.efficiency >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedDevice.efficiency}%</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 btn-primary text-sm">
                <Activity size={14} />
                查看历史趋势
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 btn-secondary text-sm">
                <Settings size={14} />
                设备配置
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
