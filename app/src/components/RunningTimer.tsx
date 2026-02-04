import { useState, useEffect } from 'react'

interface RunningTimerProps {
  startTime: number | null
  isRunning: boolean
}

export function RunningTimer({ startTime, isRunning }: RunningTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsed(0)
      return
    }

    const updateElapsed = () => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)

    return () => clearInterval(interval)
  }, [isRunning, startTime])

  if (!isRunning || elapsed === 0) return null

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <span className="text-xs text-surface-500 ml-2">
      {formatTime(elapsed)}
    </span>
  )
}
