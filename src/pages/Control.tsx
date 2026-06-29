import { useEffect, useRef, useState } from 'react'
import {
  Settings,
  Droplets,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RefreshCw,
  Activity,
  Thermometer,
  Wind,
  Clock,
  Zap,
} from 'lucide-react'
import * as echarts from 'echarts'

export default function Control() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [processStatus, setProcessStatus] = useState('running')

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current)

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: '工艺流程实时数据',
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
      series: [
        {
          type: 'sankey',
          layout: 'none',
          emphasis: { focus: 'adjacency' },
          nodeAlign: 'left',
          lineStyle: { color: 'gradient', curveness: 0.5 },
          data: [
            { name: '进水', itemStyle: { color: '#3b82f6' } },
            { name: '格栅', itemStyle: { color: '#0d9488' } },
            { name: '沉砂池', itemStyle: { color: '#0d9488' } },
            { name: '曝气池', itemStyle: { color: '#0d9488' } },
            { name: '二沉池', itemStyle: { color: '#0d9488' } },
            { name: '消毒', itemStyle: { color: '#0d9488' } },
            { name: '出水', itemStyle: { color: '#10b981' } },
          ],
          links: [
            { source: '进水', target: '格栅', value: 1250 },
            { source: '格栅', target: '沉砂池', value: 1200 },
            { source: '沉砂池', target: '曝气池', value: 1180 },
            { source: '曝气池', target: '二沉池', value: 1150 },
            { source: '二沉池', target: '消毒', value: 1100 },
            { source: '消毒', target: '出水', value: 1080 },
          ],
          label: { color: '#e2e8f0', fontSize: 12 },
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

  const processData: Record<string, Record<string, string | number>> = {
    inlet: { flow: 1250, quality: 180, level: 2.5, temperature: 18.5 },
    grid: { flow: 1200, status: '运行中' },
    sandPool: { flow: 1180, level: 3.2 },
    aeration: { do: 2.5, mlss: 2500, status: '运行中', ph: 7.2 },
    secondary: { flow: 1150, level: 3.5 },
    disinfection: { chlorine: 0.8, status: '运行中' },
    outlet: { flow: 1080, quality: 15, level: 1.8 },
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const toggleProcess = () => {
    setProcessStatus(processStatus === 'running' ? 'stopped' : 'running')
  }

  const devices = [
    { name: '1#进水泵', status: '运行中', speed: 85, power: 15.5 },
    { name: '2#进水泵', status: '运行中', speed: 82, power: 14.8 },
    { name: '1#鼓风机', status: '运行中', speed: 75, power: 28.5 },
    { name: '2#鼓风机', status: '备用', speed: 0, power: 0 },
    { name: '1#污泥泵', status: '运行中', speed: 60, power: 8.2 },
    { name: '2#污泥泵', status: '维护', speed: 0, power: 0 },
    { name: '1#格栅', status: '运行中', speed: 100, power: 3.5 },
    { name: '2#格栅', status: '运行中', speed: 100, power: 3.5 },
    { name: '脱水机1', status: '运行中', speed: 70, power: 12.5 },
    { name: '脱水机2', status: '备用', speed: 0, power: 0 },
    { name: '回流泵', status: '运行中', speed: 55, power: 6.8 },
    { name: '加药泵', status: '运行中', speed: 45, power: 2.5 },
  ]

  return (
    <div className="space-y-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            中央控制
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            实时监控和控制污水处理工艺流程
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
            onClick={toggleProcess}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              processStatus === 'running'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {processStatus === 'running' ? <Pause size={16} /> : <Play size={16} />}
            {processStatus === 'running' ? '停止工艺' : '启动工艺'}
          </button>
        </div>
      </div>

      {/* 工艺状态概览 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${processStatus === 'running' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
              <Activity size={24} className={processStatus === 'running' ? 'text-emerald-400' : 'text-amber-400'} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">工艺运行状态</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`status-dot ${processStatus === 'running' ? 'online' : 'warning'}`} />
                <span className={`text-sm ${processStatus === 'running' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {processStatus === 'running' ? '正常运行中' : '已停止'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Droplets size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">进水流量</p>
                <p className="text-lg font-bold text-white">{processData.inlet.flow} m³/h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Droplets size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">出水流量</p>
                <p className="text-lg font-bold text-white">{processData.outlet.flow} m³/h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20">
                <Gauge size={18} className="text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">处理效率</p>
                <p className="text-lg font-bold text-white">{((Number(processData.outlet.flow) / Number(processData.inlet.flow)) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 流程卡片 */}
        <div className="grid grid-cols-7 gap-3">
          {[
            { name: '进水口', icon: Droplets, data: processData.inlet, color: 'blue', params: ['flow', 'quality', 'temperature'] },
            { name: '格栅', icon: Settings, data: processData.grid, color: 'teal', params: ['flow', 'status'] },
            { name: '沉砂池', icon: Gauge, data: processData.sandPool, color: 'teal', params: ['flow', 'level'] },
            { name: '曝气池', icon: AlertTriangle, data: processData.aeration, color: 'teal', params: ['do', 'mlss', 'ph'] },
            { name: '二沉池', icon: Droplets, data: processData.secondary, color: 'teal', params: ['flow', 'level'] },
            { name: '消毒', icon: CheckCircle, data: processData.disinfection, color: 'teal', params: ['chlorine', 'status'] },
            { name: '出水口', icon: Droplets, data: processData.outlet, color: 'emerald', params: ['flow', 'quality'] },
          ].map((step, idx) => (
            <div key={step.name} className="relative group">
              <div className={`bg-[var(--bg-secondary)]/50 border rounded-xl p-4 transition-all hover:bg-[var(--bg-secondary)]/70 ${
                step.color === 'blue' ? 'border-l-3 border-l-blue-500' :
                step.color === 'emerald' ? 'border-l-3 border-l-emerald-500' : 'border-l-3 border-l-teal-500'
              }`}>
                <div className={`p-2 rounded-lg mb-3 w-fit transition-transform group-hover:scale-110 ${
                  step.color === 'blue' ? 'bg-blue-500/10' :
                  step.color === 'emerald' ? 'bg-emerald-500/10' : 'bg-teal-500/10'
                }`}>
                  <step.icon size={20} className={
                    step.color === 'blue' ? 'text-blue-400' :
                    step.color === 'emerald' ? 'text-emerald-400' : 'text-teal-400'
                  } />
                </div>
                <p className="text-sm font-medium text-white mb-2">{step.name}</p>
                <div className="space-y-1">
                  {step.name === '进水口' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">流量</span>
                        <span className="text-white">{step.data.flow} m³/h</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">COD</span>
                        <span className="text-amber-400">{step.data.quality} mg/L</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">温度</span>
                        <span className="text-cyan-400">{step.data.temperature} ℃</span>
                      </p>
                    </>
                  )}
                  {step.name === '格栅' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">流量</span>
                        <span className="text-white">{step.data.flow} m³/h</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">状态</span>
                        <span className="text-emerald-400">{step.data.status}</span>
                      </p>
                    </>
                  )}
                  {step.name === '沉砂池' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">流量</span>
                        <span className="text-white">{step.data.flow} m³/h</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">液位</span>
                        <span className="text-blue-400">{step.data.level} m</span>
                      </p>
                    </>
                  )}
                  {step.name === '曝气池' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">DO</span>
                        <span className="text-emerald-400">{step.data.do} mg/L</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">MLSS</span>
                        <span className="text-white">{step.data.mlss} mg/L</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">pH</span>
                        <span className="text-cyan-400">{step.data.ph}</span>
                      </p>
                    </>
                  )}
                  {step.name === '二沉池' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">流量</span>
                        <span className="text-white">{step.data.flow} m³/h</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">液位</span>
                        <span className="text-blue-400">{step.data.level} m</span>
                      </p>
                    </>
                  )}
                  {step.name === '消毒' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">余氯</span>
                        <span className="text-white">{step.data.chlorine} mg/L</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">状态</span>
                        <span className="text-emerald-400">{step.data.status}</span>
                      </p>
                    </>
                  )}
                  {step.name === '出水口' && (
                    <>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">流量</span>
                        <span className="text-white">{step.data.flow} m³/h</span>
                      </p>
                      <p className="text-xs flex items-center justify-between">
                        <span className="text-[var(--text-muted)]">COD</span>
                        <span className="text-emerald-400">{step.data.quality} mg/L</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
              {idx < 6 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-teal-500/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 实时数据和趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 关键参数 */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <Activity size={22} className="text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">关键运行参数</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '进水流量', value: '1250', unit: 'm³/h', status: 'normal', icon: Droplets, color: 'text-blue-400' },
              { label: '出水流量', value: '1080', unit: 'm³/h', status: 'normal', icon: Droplets, color: 'text-emerald-400' },
              { label: '进水COD', value: '180', unit: 'mg/L', status: 'normal', icon: Gauge, color: 'text-amber-400' },
              { label: '出水COD', value: '15', unit: 'mg/L', status: 'good', icon: Gauge, color: 'text-emerald-400' },
              { label: '溶解氧', value: '2.5', unit: 'mg/L', status: 'normal', icon: Wind, color: 'text-cyan-400' },
              { label: '污泥浓度', value: '2500', unit: 'mg/L', status: 'normal', icon: Settings, color: 'text-purple-400' },
              { label: '余氯', value: '0.8', unit: 'mg/L', status: 'normal', icon: Thermometer, color: 'text-red-400' },
              { label: 'pH值', value: '7.2', unit: '', status: 'normal', icon: Gauge, color: 'text-teal-400' },
            ].map((param) => (
              <div key={param.label} className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl hover:bg-[var(--bg-secondary)]/70 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[var(--text-muted)]">{param.label}</span>
                  <param.icon size={14} className={param.color} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${param.status === 'good' ? 'text-emerald-400' : 'text-white'}`}>
                    {param.value}
                  </span>
                  {param.unit && <span className="text-xs text-[var(--text-muted)]">{param.unit}</span>}
                </div>
                {param.status === 'good' && (
                  <div className="mt-2 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 趋势图 */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">工艺流程数据流向</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">实时</span>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div ref={chartRef} className="h-80" />
        </div>
      </div>

      {/* 设备状态 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Settings size={22} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">主要设备状态</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-[var(--text-muted)]">运行中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-[var(--text-muted)]">备用</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-[var(--text-muted)]">维护</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {devices.map((device) => (
            <div key={device.name} className="p-4 bg-[var(--bg-secondary)]/50 rounded-xl hover:bg-[var(--bg-secondary)]/70 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{device.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  device.status === '运行中' ? 'bg-emerald-500/20 text-emerald-400' :
                  device.status === '备用' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {device.status}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--text-muted)]">转速</span>
                    <span className="text-white">{device.speed}%</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        device.status === '运行中' ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-slate-600'
                      }`}
                      style={{ width: `${device.speed}%` }}
                    />
                  </div>
                </div>
                {device.status === '运行中' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">功率</span>
                    <div className="flex items-center gap-1">
                      <Zap size={12} className="text-amber-400" />
                      <span className="text-amber-400">{device.power} kW</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}