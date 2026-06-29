import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import {
  Droplets,
  Gauge,
  Activity,
  AlertTriangle,
  TrendingUp,
  Factory,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChevronRight,
  Zap,
  Thermometer,
  Wind,
  Clock,
} from 'lucide-react'
import { useAnimatedCounter, useInterval, useRealtimeClock } from '@/hooks/useAnimatedCounter'

export default function Dashboard() {
  const chartRef = useRef<HTMLDivElement>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const [chartData, setChartData] = useState({
    inletFlow: [1820, 1932, 1901, 2134, 1890, 2200, 2150],
    outletFlow: [1750, 1850, 1820, 2050, 1800, 2100, 2050],
    pressure: [0.82, 0.88, 0.85, 0.90, 0.83, 0.87, 0.85],
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const time = useRealtimeClock()

  const stats = {
    totalPoints: 48,
    normalPoints: 42,
    alarmPoints: 6,
    todayFlow: 125680,
    avgPressure: 0.85,
    waterQuality: 98.5,
    energyConsumption: 135680,
    treatmentRate: 94.8,
    dailyCost: 8560,
    activeDevices: 56,
  }

  const totalPoints = useAnimatedCounter(stats.totalPoints, 1500)
  const normalPoints = useAnimatedCounter(stats.normalPoints, 1500)
  const alarmPoints = useAnimatedCounter(stats.alarmPoints, 1500)
  const todayFlow = useAnimatedCounter(stats.todayFlow, 2000)
  const waterQuality = useAnimatedCounter(stats.waterQuality, 1500)

  useInterval(() => {
    setChartData((prev) => ({
      inletFlow: prev.inletFlow.map((v) => v + Math.random() * 100 - 50),
      outletFlow: prev.outletFlow.map((v) => v + Math.random() * 100 - 50),
      pressure: prev.pressure.map((v) => Math.max(0.5, Math.min(1.2, v + Math.random() * 0.1 - 0.05))),
    }))
  }, 5000)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '近7日监测数据趋势',
        textStyle: { color: '#94a3b8', fontSize: 14, fontWeight: 'normal' },
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        textStyle: { color: '#e2e8f0' },
        padding: [12, 16],
        borderWidth: 1,
      },
      legend: {
        data: ['进水流量', '出水流量', '压力'],
        textStyle: { color: '#94a3b8', fontSize: 12 },
        top: 40,
        itemGap: 20,
      },
      grid: {
        left: '5%',
        right: '5%',
        top: 80,
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: '流量(m³/h)',
          nameTextStyle: { color: '#94a3b8', fontSize: 10 },
          axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
          axisLabel: { color: '#94a3b8', fontSize: 11 },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
        },
        {
          type: 'value',
          name: '压力(MPa)',
          nameTextStyle: { color: '#94a3b8', fontSize: 10 },
          axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
          axisLabel: { color: '#94a3b8', fontSize: 11 },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '进水流量',
          type: 'line',
          smooth: true,
          data: chartData.inletFlow,
          lineStyle: { color: '#0d9488', width: 3 },
          itemStyle: { color: '#0d9488' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(13, 148, 136, 0.35)' },
            { offset: 1, color: 'rgba(13, 148, 136, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: { color: '#0d9488', borderColor: '#fff', borderWidth: 2 },
            scale: true,
          },
        },
        {
          name: '出水流量',
          type: 'line',
          smooth: true,
          data: chartData.outletFlow,
          lineStyle: { color: '#3b82f6', width: 3 },
          itemStyle: { color: '#3b82f6' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: { color: '#3b82f6', borderColor: '#fff', borderWidth: 2 },
            scale: true,
          },
        },
        {
          name: '压力',
          type: 'line',
          smooth: true,
          data: chartData.pressure,
          lineStyle: { color: '#f97316', width: 2.5, type: 'dashed' },
          itemStyle: { color: '#f97316' },
          yAxisIndex: 1,
          symbol: 'diamond',
          symbolSize: 6,
          emphasis: {
            itemStyle: { color: '#f97316', borderColor: '#fff', borderWidth: 2 },
            scale: true,
          },
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
  }, [chartData])

  useEffect(() => {
    if (!pieChartRef.current) return
    const chart = echarts.init(pieChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '监测点状态分布',
        textStyle: { color: '#94a3b8', fontSize: 14, fontWeight: 'normal' },
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        textStyle: { color: '#e2e8f0' },
        padding: [10, 14],
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
          radius: ['45%', '70%'],
          center: ['35%', '55%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 12,
            borderColor: '#0a0f1a',
            borderWidth: 3,
          },
          label: { show: false },
          emphasis: {
            label: { 
              show: true, 
              fontSize: 14, 
              fontWeight: 'bold', 
              color: '#fff',
              formatter: '{b}\n{c}个 ({d}%)'
            },
            itemStyle: { 
              shadowBlur: 15, 
              shadowOffsetX: 0, 
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              scale: true,
            },
          },
          data: [
            { value: 42, name: '正常', itemStyle: { color: '#10b981' } },
            { value: 3, name: '上限报警', itemStyle: { color: '#ef4444' } },
            { value: 3, name: '下限报警', itemStyle: { color: '#eab308' } },
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

  const statCards = [
    {
      title: '监测点总数',
      value: totalPoints,
      suffix: '个',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      change: '+2',
      trend: 'up',
    },
    {
      title: '正常运行',
      value: normalPoints,
      suffix: '个',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500',
      change: '+1',
      trend: 'up',
    },
    {
      title: '报警中',
      value: alarmPoints,
      suffix: '个',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      change: '-1',
      trend: 'down',
    },
    {
      title: '今日处理量',
      value: todayFlow,
      format: (v: number) => (v / 1000).toFixed(1),
      suffix: '万m³',
      icon: Droplets,
      color: 'from-cyan-500 to-blue-500',
      change: '+3.2%',
      trend: 'up',
    },
    {
      title: '水质达标率',
      value: waterQuality,
      suffix: '%',
      icon: Gauge,
      color: 'from-teal-500 to-emerald-500',
      change: '+0.5%',
      trend: 'up',
    },
    {
      title: '能耗',
      value: stats.energyConsumption,
      format: (v: number) => (v / 1000).toFixed(0),
      suffix: 'kWh',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      change: '-2.1%',
      trend: 'down',
    },
  ]

  const quickStats = [
    { label: '处理效率', value: stats.treatmentRate, suffix: '%', icon: Activity, color: 'text-teal-400' },
    { label: '日运行成本', value: stats.dailyCost, suffix: '元', icon: TrendingUp, color: 'text-amber-400' },
    { label: '在线设备', value: stats.activeDevices, suffix: '台', icon: Factory, color: 'text-blue-400' },
    { label: '进水温度', value: '18.5', suffix: '℃', icon: Thermometer, color: 'text-cyan-400' },
  ]

  const recentAlarms = [
    { id: 1, point: '城东泵站1#', type: '压力报警', value: '0.92MPa', time: '10:32', level: 'error' },
    { id: 2, point: '工业园监测点', type: '水质异常', value: 'COD 85', time: '09:15', level: 'warning' },
    { id: 3, point: '城西泵站2#', type: '液位报警', value: '3.2m', time: '08:45', level: 'warning' },
  ]

  const facilities = [
    { name: '县城污水处理厂', points: 12, status: 'running', online: 12 },
    { name: '城东泵站', points: 8, status: 'running', online: 8 },
    { name: '城西泵站', points: 6, status: 'running', online: 6 },
    { name: '工业园泵站', points: 10, status: 'warning', online: 8 },
    { name: '乡镇污水站点', points: 12, status: 'running', online: 11 },
  ]

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
            监控中心大屏
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            实时监控污水处理系统运行状态
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            刷新数据
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
            <Clock size={18} className="text-cyan-400" />
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">系统时间</p>
              <p className="text-sm font-mono text-cyan-400">
                {time.toLocaleTimeString('zh-CN', { hour12: false })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="stat-card p-5 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-500 animate-fade-in-up cursor-pointer group"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-[var(--text-muted)] mb-2">{card.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {card.format ? card.format(card.value) : Math.round(card.value)}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{card.suffix}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {card.trend === 'up' ? (
                    <ArrowUpRight size={14} className="text-emerald-400" />
                  ) : (
                    <ArrowDownRight size={14} className="text-red-400" />
                  )}
                  <span className={`text-xs ${card.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div ref={chartRef} className="h-80" />
        </div>
        <div className="glass-card p-6">
          <div ref={pieChartRef} className="h-80" />
        </div>
      </div>

      {/* 快速信息和最近报警 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 设施分布 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20">
                <Factory size={22} className="text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">设施分布</h3>
            </div>
            <button className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 group">
              查看全部 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-3">
            {facilities.map((item) => (
              <div
                key={item.name}
                className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl hover:bg-[var(--bg-secondary)]/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <div className={`status-dot ${item.status === 'running' ? 'online' : 'warning'}`} />
                    <span className={`text-xs ${item.status === 'running' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.status === 'running' ? '运行中' : '预警'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-2 bg-[var(--bg-card)] rounded-full overflow-hidden mr-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'running' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${(item.online / item.points) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {item.online}/{item.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近报警 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">最近报警</h3>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                {recentAlarms.length}条
              </span>
            </div>
            <button className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 group">
              查看全部 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-3">
            {recentAlarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-4 bg-[var(--bg-secondary)]/50 rounded-xl border-l-4 ${
                  alarm.level === 'error' ? 'border-red-500' : 'border-amber-500'
                } hover:bg-[var(--bg-secondary)]/70 transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{alarm.point}</p>
                    <p className="text-xs text-[var(--text-muted)]">{alarm.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${alarm.level === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
                      {alarm.value}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{alarm.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 实时数据 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Activity size={22} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">实时数据</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: '进水流量', value: '1,250', unit: 'm³/h', trend: 'up' },
              { label: '出水流量', value: '1,080', unit: 'm³/h', trend: 'up' },
              { label: '溶解氧', value: '2.5', unit: 'mg/L', trend: 'stable' },
              { label: 'pH值', value: '7.2', unit: '', trend: 'stable' },
              { label: '污泥浓度', value: '2,500', unit: 'mg/L', trend: 'down' },
              { label: '余氯', value: '0.8', unit: 'mg/L', trend: 'stable' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {item.value}
                    {item.unit && <span className="text-[var(--text-muted)] ml-1">{item.unit}</span>}
                  </span>
                  {item.trend === 'up' && (
                    <ArrowUpRight size={12} className="text-emerald-400" />
                  )}
                  {item.trend === 'down' && (
                    <ArrowDownRight size={12} className="text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">数据更新时间</span>
              <span className="text-cyan-400 font-mono">
                {time.toLocaleTimeString('zh-CN', { hour12: false })}
              </span>
            </div>
          </div>
        </div>

        {/* 快捷统计 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <TrendingUp size={22} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">快捷统计</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickStats.map((item) => (
              <div key={item.label} className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon size={16} className={item.color} />
                  <span className="text-xs text-[var(--text-muted)]">{item.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {item.value}
                  <span className="text-sm font-normal text-[var(--text-muted)] ml-1">{item.suffix}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-400">今日运营状态</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">系统运行正常，出水达标</p>
              </div>
              <div className="flex items-center gap-2">
                <Wind size={20} className="text-teal-400 animate-pulse" />
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                  运行中
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}