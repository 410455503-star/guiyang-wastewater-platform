import { create } from 'zustand'

export interface MonitoringPoint {
  id: number
  name: string
  type: 'pressure' | 'flow' | 'level' | 'quality'
  lat: number
  lng: number
  status: 'normal' | 'upper_alarm' | 'lower_alarm'
  value: number
  threshold: number
  updatedAt: string
}

export interface Alarm {
  id: number
  pointId: number
  pointName: string
  type: string
  level: 'info' | 'warning' | 'error'
  value: number
  threshold: number
  status: 'pending' | 'confirmed' | 'resolved'
  createdAt: string
  confirmedAt?: string
}

export interface InspectionTask {
  id: number
  planId: number
  assignee: string
  status: 'pending' | 'in_progress' | 'completed'
  content: string
  location: string
  createdAt: string
  completedAt?: string
}

export interface EnergyData {
  type: 'electric' | 'water' | 'oil' | 'gas'
  consumption: number
  cost: number
  unit: string
  date: string
}

interface AppState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // 监测点数据
  monitoringPoints: MonitoringPoint[]
  setMonitoringPoints: (points: MonitoringPoint[]) => void

  // 报警数据
  alarms: Alarm[]
  setAlarms: (alarms: Alarm[]) => void
  addAlarm: (alarm: Alarm) => void
  confirmAlarm: (id: number) => void

  // 巡检任务
  inspectionTasks: InspectionTask[]
  setInspectionTasks: (tasks: InspectionTask[]) => void

  // 能耗数据
  energyData: EnergyData[]
  setEnergyData: (data: EnergyData[]) => void
}

export const useStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  monitoringPoints: [],
  setMonitoringPoints: (points) => set({ monitoringPoints: points }),

  alarms: [],
  setAlarms: (alarms) => set({ alarms }),
  addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] })),
  confirmAlarm: (id) => set((state) => ({
    alarms: state.alarms.map((a) =>
      a.id === id ? { ...a, status: 'confirmed' as const, confirmedAt: new Date().toISOString() } : a
    )
  })),

  inspectionTasks: [],
  setInspectionTasks: (tasks) => set({ inspectionTasks: tasks }),

  energyData: [],
  setEnergyData: (data) => set({ energyData: data }),
}))
