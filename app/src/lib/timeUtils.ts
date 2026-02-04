/**
 * Format a date as relative time (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return 'Just now'
  }

  if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }

  if (diffDays === 1) {
    return 'Yesterday'
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`
  }

  // For older dates, use absolute format
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Format duration in ms to human-readable string
 */
export function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000)
  const mins = Math.floor(secs / 60)
  const hours = Math.floor(mins / 60)

  if (hours > 0) {
    const remainingMins = mins % 60
    return `${hours}h ${remainingMins}m`
  }

  if (mins > 0) {
    const remainingSecs = secs % 60
    return `${mins}m ${remainingSecs}s`
  }

  return `${secs}s`
}
