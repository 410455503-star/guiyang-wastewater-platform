import { useState, useEffect, useRef } from 'react'

export function useAnimatedCounter(targetValue: number, duration: number = 1000) {
  const [count, setCount] = useState(0)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    startTime.current = null

    const animate = (currentTime: number) => {
      if (!startTime.current) {
        startTime.current = currentTime
      }

      const elapsed = currentTime - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = targetValue * easeOut

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration])

  return count
}

export function useRealtimeClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return time
}

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const timer = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => clearInterval(timer)
  }, [delay])
}
