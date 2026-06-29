import { useEffect, useRef, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Table,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Droplets,
  Gauge,
  Activity,
} from 'lucide-react'
import * as echarts from 'echarts'

export default function Analysis() {
  const flowChartRef = useRef<HTMLDivElement>(null)
  const qualityChartRef = useRef<HTMLDivElement>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const [dateRange, setDateRange] = useState('week')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!flowChartRef.current) return
    const chart = echarts.init(flowChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '流量分析',
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
        data: ['进水流量', '出水流量'],
        textStyle: { color: '#94a3b8', fontSize: 12 },
        top: 30,
        itemGap: 20,
      },
      grid: { left: '10%', right: '5%', top: 70, bottom: '15%' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'm³/h',
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
      },
      series: [
        {
          name: '进水流量',
          type: 'line',
          smooth: true,
          data: [1250, 1320, 1280, 1380, 1350, 1420, 1380],
          lineStyle: { color: '#3b82f6', width: 3 },
          itemStyle: { color: '#3b82f6' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: { color: '#3b82f6', borderColor: '#fff', borderWidth: 2 },
          },
        },
        {
          name: '出水流量',
          type: 'line',
          smooth: true,
          data: [1080, 1150, 1100, 1200, 1160, 1250, 1200],
          lineStyle: { color: '#10b981', width: 3 },
          itemStyle: { color: '#10b981' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0)' },
          ])},
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: { color: '#10b981', borderColor: '#fff', borderWidth: 2 },
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
  }, [])

  useEffect(() => {
    if (!qualityChartRef.current) return
    const chart = echarts.init(qualityChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '水质分析',
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
        data: ['COD', 'BOD', '氨氮'],
        textStyle: { color: '#94a3b8', fontSize: 12 },
        top: 30,
        itemGap: 20,
      },
      grid: { left: '10%', right: '5%', top: 70, bottom: '15%' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'mg/L',
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.06)' } },
      },
      series: [
        {
          name: 'COD',
          type: 'bar',
          data: [180, 175, 182, 178, 185, 172, 180],
          itemStyle: { color: '#f97316', borderRadius: [4, 4, 0, 0] },
          emphasis: {
            itemStyle: { color: '#fb923c' },
          },
        },
        {
          name: 'BOD',
          type: 'bar',
          data: [85, 82, 88, 80, 86, 78, 82],
          itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] },
          emphasis: {
            itemStyle: { color: '#a78bfa' },
          },
        },
        {
          name: '氨氮',
          type: 'bar',
          data: [25, 24, 26, 23, 27, 22, 25],
          itemStyle: { color: '#0d9488', borderRadius: [4, 4, 0, 0] },
          emphasis: {
            itemStyle: { color: '#14b8a6' },
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
  }, [])

  useEffect(() => {
    if (!pieChartRef.current) return
    const chart = echarts.init(pieChartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '处理效果分布',
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
          itemStyle: {
            borderRadius: 10,
            borderColor: '#0a0f1a',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
              color: '#fff',
              formatter: '{b}\n{c}%',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              scale: true,
            },
          },
          data: [
            { value: 72, name: 'COD去除', itemStyle: { color: '#f97316' } },
            { value: 68, name: 'BOD去除', itemStyle: { color: '#8b5cf6' } },
            { value: 85, name: '氨氮去除', itemStyle: { color: '#0d9488' } },
            { value: 92, name: '悬浮物去除', itemStyle: { color: '#3b82f6' } },
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

  const stats = {
    totalFlow: 94580,
    avgQuality: 92.5,
    complianceRate: 98.2,
    treatmentEfficiency: 94.8,
    totalDays: 365,
    avgDailyFlow: 259,
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const exportData = () => {
    alert('数据导出功能已触发，将生成报表文件...')
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            数据分析
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            对污水处理数据进行统计分析和趋势预测
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
              <option value="year">本年</option>
            </select>
          </div>
          <button onClick={handleRefresh} className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}>
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            刷新数据
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl font-medium hover:bg-blue-500/30 border border-blue-500/30 transition-all"
          >
            <Download size={16} />
            导出报表
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{(stats.totalFlow / 10000).toFixed(1)}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">本月累计流量</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400">+5.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Droplets size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{stats.avgQuality}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">平均水质指数</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400">+1.8%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/20">
              <Gauge size={24} className="text-teal-400" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emerald-400">{stats.complianceRate}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">达标率</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400">+0.3%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Activity size={24} className="text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="stat-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-teal-400">{stats.treatmentEfficiency}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">处理效率</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight size={14} className="text-red-400" />
                <span className="text-xs text-red-400">-0.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/20">
              <TrendingUp size={24} className="text-cyan-400" />
            </div>
          </div>
        </div>
        <div className="stat-card info p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-400">{stats.totalDays}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">连续运行天数</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Calendar size={24} className="text-purple-400" />
            </div>
          </div>
        </div>
        <div className="stat-card info p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-cyan-400">{stats.avgDailyFlow}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">日均处理量(万m³)</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/20">
              <BarChart3 size={24} className="text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">流量趋势分析</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-[var(--text-muted)]">进水</span>
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-[var(--text-muted)]">出水</span>
            </div>
          </div>
          <div ref={flowChartRef} className="h-80" />
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">水质指标分析</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-[var(--text-muted)]">COD</span>
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-[var(--text-muted)]">BOD</span>
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-xs text-[var(--text-muted)]">氨氮</span>
            </div>
          </div>
          <div ref={qualityChartRef} className="h-80" />
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">处理效果分布</h3>
          </div>
          <div ref={pieChartRef} className="h-80" />
        </div>
      </div>

      {/* 数据报表 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <Table size={22} className="text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">日报表统计</h3>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 text-teal-400 rounded-xl font-medium hover:bg-teal-500/30 transition-all">
              <Download size={16} />
              导出Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl font-medium hover:bg-blue-500/30 transition-all">
              <PieChart size={16} />
              生成图表
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">日期</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">进水流量</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">出水流量</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">COD去除率</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">BOD去除率</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">氨氮去除率</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-muted)]">达标情况</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2024-01-15', inlet: 1250, outlet: 1080, cod: 92.5, bod: 88.2, ammonia: 91.8, status: '达标' },
                { date: '2024-01-14', inlet: 1320, outlet: 1150, cod: 91.8, bod: 87.5, ammonia: 90.5, status: '达标' },
                { date: '2024-01-13', inlet: 1280, outlet: 1100, cod: 93.2, bod: 89.1, ammonia: 92.3, status: '达标' },
                { date: '2024-01-12', inlet: 1380, outlet: 1200, cod: 90.5, bod: 86.8, ammonia: 89.2, status: '达标' },
                { date: '2024-01-11', inlet: 1350, outlet: 1160, cod: 92.1, bod: 88.5, ammonia: 91.0, status: '达标' },
              ].map((row) => (
                <tr key={row.date} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-white font-medium">{row.date}</td>
                  <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">{row.inlet} m³/h</td>
                  <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">{row.outlet} m³/h</td>
                  <td className="py-3 px-4 text-sm text-orange-400">{row.cod}%</td>
                  <td className="py-3 px-4 text-sm text-purple-400">{row.bod}%</td>
                  <td className="py-3 px-4 text-sm text-teal-400">{row.ammonia}%</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                      <Activity size={12} />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}