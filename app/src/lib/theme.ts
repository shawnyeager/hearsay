/**
 * Programmatic theme utilities for dynamic styling
 */

// Score-based color utilities for analysis quality ratings
export const scoreColors = {
  getText: (value: number): string => {
    if (value >= 4) return 'text-green-600'
    if (value >= 3) return 'text-amber-600'
    return 'text-red-600'
  },
  getBg: (value: number): string => {
    if (value >= 4) return 'bg-green-50'
    if (value >= 3) return 'bg-amber-50'
    return 'bg-red-50'
  },
  getBorder: (value: number): string => {
    if (value >= 4) return 'border-green-200'
    if (value >= 3) return 'border-amber-200'
    return 'border-red-200'
  },
  getBadge: (value: number): string => {
    if (value >= 4) return 'badge-success'
    if (value >= 3) return 'badge-warning'
    return 'badge-error'
  },
}

// Rating labels with corresponding colors
export const ratingLabels = {
  excellent: { label: 'Excellent', class: 'text-green-600' },
  good: { label: 'Good', class: 'text-blue-600' },
  fair: { label: 'Fair', class: 'text-amber-600' },
  poor: { label: 'Poor', class: 'text-red-600' },
} as const

// Get rating from numeric score
export function getRating(score: number): keyof typeof ratingLabels {
  if (score >= 4.5) return 'excellent'
  if (score >= 3.5) return 'good'
  if (score >= 2.5) return 'fair'
  return 'poor'
}
