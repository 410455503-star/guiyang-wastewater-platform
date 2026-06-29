/**
 * 报警管理 API
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

interface AlarmRecord {
  id: number
  pointId: number
  pointName: string
  type: string
  level: string
  value: string
  threshold: string
  status: string
  createdAt: string
  confirmedAt?: string
  resolvedAt?: string
}

// 模拟数据
const alarms: AlarmRecord[] = [
  { id: 1, pointId: 1, pointName: '城东泵站1#', type: '压力报警', level: 'error', value: '0.92MPa', threshold: '0.90MPa', status: 'pending', createdAt: '2024-01-15 10:32:15' },
  { id: 2, pointId: 2, pointName: '工业园监测点', type: '水质异常', level: 'warning', value: 'COD 85', threshold: 'COD 80', status: 'pending', createdAt: '2024-01-15 09:15:30' },
  { id: 3, pointId: 3, pointName: '城西泵站2#', type: '液位报警', level: 'warning', value: '3.2m', threshold: '3.5m', status: 'confirmed', createdAt: '2024-01-15 08:45:00', confirmedAt: '2024-01-15 09:00:00' },
  { id: 4, pointId: 4, pointName: '县城进水口', type: '流量异常', level: 'info', value: '1850m³/h', threshold: '2000m³/h', status: 'resolved', createdAt: '2024-01-15 06:20:00', resolvedAt: '2024-01-15 07:30:00' },
  { id: 5, pointId: 6, pointName: '乡镇主管道', type: '压力报警', level: 'error', value: '0.95MPa', threshold: '0.90MPa', status: 'pending', createdAt: '2024-01-15 11:05:00' },
]

/**
 * 获取报警列表
 * GET /api/alarm/list
 */
router.get('/list', (req: Request, res: Response): void => {
  const { status, type, startTime, endTime } = req.query
  let filtered = [...alarms]

  if (status && status !== 'all') {
    filtered = filtered.filter((a) => a.status === status)
  }
  if (type) {
    filtered = filtered.filter((a) => a.type === type)
  }

  res.json({
    code: 200,
    message: 'success',
    data: filtered,
  })
})

/**
 * 获取报警统计
 * GET /api/alarm/stats
 */
router.get('/stats', (req: Request, res: Response): void => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      total: alarms.length,
      pending: alarms.filter((a) => a.status === 'pending').length,
      confirmed: alarms.filter((a) => a.status === 'confirmed').length,
      resolved: alarms.filter((a) => a.status === 'resolved').length,
    },
  })
})

/**
 * 确认报警
 * POST /api/alarm/confirm
 */
router.post('/confirm', (req: Request, res: Response): void => {
  const { alarmId } = req.body
  const index = alarms.findIndex((a) => a.id === alarmId)
  if (index !== -1) {
    alarms[index] = {
      ...alarms[index],
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    }
    res.json({
      code: 200,
      message: '确认成功',
      data: alarms[index],
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '报警不存在',
    })
  }
})

/**
 * 恢复报警
 * POST /api/alarm/resolve
 */
router.post('/resolve', (req: Request, res: Response): void => {
  const { alarmId } = req.body
  const index = alarms.findIndex((a) => a.id === alarmId)
  if (index !== -1) {
    alarms[index] = {
      ...alarms[index],
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
    }
    res.json({
      code: 200,
      message: '恢复成功',
      data: alarms[index],
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '报警不存在',
    })
  }
})

/**
 * 获取历史报警
 * GET /api/alarm/history
 */
router.get('/history', (req: Request, res: Response): void => {
  const { startDate, endDate, pointName } = req.query
  let filtered = alarms.filter((a) => a.status === 'resolved')

  if (startDate) {
    filtered = filtered.filter((a) => a.createdAt >= startDate)
  }
  if (endDate) {
    filtered = filtered.filter((a) => a.createdAt <= endDate)
  }
  if (pointName) {
    filtered = filtered.filter((a) => a.pointName.includes(pointName as string))
  }

  res.json({
    code: 200,
    message: 'success',
    data: filtered,
  })
})

export default router
