/**
 * 监测点管理 API
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

// 模拟数据
const monitoringPoints = [
  { id: 1, name: '城东泵站1#', type: 'pressure', status: 'normal', value: 0.85, threshold: 0.9, lat: 25.75, lng: 112.85, updatedAt: new Date().toISOString() },
  { id: 2, name: '工业园监测点', type: 'quality', status: 'upper_alarm', value: 85, threshold: 80, lat: 25.73, lng: 112.88, updatedAt: new Date().toISOString() },
  { id: 3, name: '城西泵站2#', type: 'level', status: 'lower_alarm', value: 3.2, threshold: 3.5, lat: 25.76, lng: 112.80, updatedAt: new Date().toISOString() },
  { id: 4, name: '县城进水口', type: 'flow', status: 'normal', value: 1250, threshold: 1500, lat: 25.74, lng: 112.83, updatedAt: new Date().toISOString() },
  { id: 5, name: '县城出水口', type: 'quality', status: 'normal', value: 15, threshold: 30, lat: 25.74, lng: 112.84, updatedAt: new Date().toISOString() },
  { id: 6, name: '乡镇主管道', type: 'pressure', status: 'normal', value: 0.72, threshold: 0.9, lat: 25.78, lng: 112.86, updatedAt: new Date().toISOString() },
]

/**
 * 获取监测点列表
 * GET /api/monitoring/points
 */
router.get('/points', (req: Request, res: Response): void => {
  res.json({
    code: 200,
    message: 'success',
    data: monitoringPoints,
  })
})

/**
 * 获取监测点详情
 * GET /api/monitoring/points/:id
 */
router.get('/points/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id)
  const point = monitoringPoints.find((p) => p.id === id)
  if (point) {
    res.json({
      code: 200,
      message: 'success',
      data: point,
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '监测点不存在',
    })
  }
})

/**
 * 获取监测点实时数据
 * GET /api/monitoring/points/:id/data
 */
router.get('/points/:id/data', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id)
  const point = monitoringPoints.find((p) => p.id === id)
  if (point) {
    res.json({
      code: 200,
      message: 'success',
      data: {
        pressure: point.type === 'pressure' ? point.value : 0.85,
        flow: point.type === 'flow' ? point.value : 1250,
        level: point.type === 'level' ? point.value : 3.5,
        quality: point.type === 'quality' ? point.value : 25,
        timestamp: new Date().toISOString(),
      },
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '监测点不存在',
    })
  }
})

/**
 * 创建监测点
 * POST /api/monitoring/points
 */
router.post('/points', (req: Request, res: Response): void => {
  const { name, type, lat, lng } = req.body
  const newPoint = {
    id: monitoringPoints.length + 1,
    name,
    type,
    status: 'normal',
    value: 0,
    threshold: 100,
    lat,
    lng,
    updatedAt: new Date().toISOString(),
  }
  monitoringPoints.push(newPoint)
  res.json({
    code: 200,
    message: '创建成功',
    data: newPoint,
  })
})

/**
 * 更新监测点
 * PUT /api/monitoring/points/:id
 */
router.put('/points/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id)
  const index = monitoringPoints.findIndex((p) => p.id === id)
  if (index !== -1) {
    monitoringPoints[index] = { ...monitoringPoints[index], ...req.body, updatedAt: new Date().toISOString() }
    res.json({
      code: 200,
      message: '更新成功',
      data: monitoringPoints[index],
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '监测点不存在',
    })
  }
})

/**
 * 删除监测点
 * DELETE /api/monitoring/points/:id
 */
router.delete('/points/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id)
  const index = monitoringPoints.findIndex((p) => p.id === id)
  if (index !== -1) {
    monitoringPoints.splice(index, 1)
    res.json({
      code: 200,
      message: '删除成功',
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '监测点不存在',
    })
  }
})

export default router
