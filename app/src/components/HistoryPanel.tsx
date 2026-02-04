import { Clock, X, FileText, Zap, Trash2, BarChart3, ChevronRight } from 'lucide-react'
import { useAnalyses } from '@/contexts/AnalysisContext'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { getRatingFromScore, getRatingColor } from '@/lib/analysis'
import { formatRelativeTime } from '@/lib/timeUtils'
import type { Analysis } from '@/types'

interface HistoryPanelProps {
  open: boolean
  onClose: () => void
  onSelect: (analysis: Analysis) => void
}

export function HistoryPanel({ open, onClose, onSelect }: HistoryPanelProps) {
  const { analyses, deleteAnalysis } = useAnalyses()
  const { transcripts } = useTranscripts()

  const getTranscriptNames = (ids: string[]) => {
    const names = ids
      .map((id) => transcripts.find((t) => t.id === id)?.name)
      .filter(Boolean)

    if (names.length === 0) {
      return `${ids.length} transcript${ids.length !== 1 ? 's' : ''}`
    }
    if (names.length < ids.length) {
      const missing = ids.length - names.length
      return `${names.join(', ')} (+${missing} more)`
    }
    return names.join(', ')
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this analysis?')) {
      await deleteAnalysis(id)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[420px] max-w-[90vw] z-50
          bg-white border-l border-surface-200
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-surface-500" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-surface-900">
                Analysis History
              </h2>
              <p className="text-xs text-surface-500">
                {analyses.length} {analyses.length === 1 ? 'analysis' : 'analyses'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto h-[calc(100%-73px)]">
          {analyses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-surface-200/50 rounded-2xl blur-2xl" />
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-surface-200 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-surface-400" />
                </div>
              </div>
              <h3 className="font-display text-base font-medium text-surface-800 mb-1">
                No analyses yet
              </h3>
              <p className="text-sm text-surface-500 max-w-[240px]">
                Run your first analysis to see it appear here
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {analyses.map((analysis, index) => (
                <HistoryItem
                  key={analysis.id}
                  analysis={analysis}
                  transcriptNames={getTranscriptNames(analysis.transcriptIds)}
                  onClick={() => {
                    onSelect(analysis)
                    onClose()
                  }}
                  onDelete={(e) => handleDelete(analysis.id, e)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function HistoryItem({
  analysis,
  transcriptNames,
  onClick,
  onDelete,
  index,
}: {
  analysis: Analysis
  transcriptNames: string
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
  index: number
}) {
  const hasScore = analysis.score !== null

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-surface-100 animate-slide-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-surface-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Transcript names */}
          <div className="text-sm font-medium text-surface-800 truncate pr-8">
            {transcriptNames}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-1.5 text-xs text-surface-500">
            <span title={new Date(analysis.createdAt).toLocaleString()}>
              {formatRelativeTime(new Date(analysis.createdAt))}
            </span>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <span className="capitalize">{analysis.variant.replace('-', ' ')}</span>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <span className="truncate">{analysis.model.split('/').pop()}</span>
          </div>

          {/* Score badge if available */}
          {hasScore && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-100">
                <BarChart3 className="h-3.5 w-3.5 text-surface-400" />
                <span className={`text-sm font-semibold ${getRatingColor(analysis.score!.total)}`}>
                  {analysis.score!.total}/35
                </span>
                <span className="text-xs text-surface-500">
                  {getRatingFromScore(analysis.score!.total)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        <ChevronRight className="flex-shrink-0 h-4 w-4 text-surface-400 group-hover:text-surface-600 transition-colors mt-1" />
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
