import { useState, useRef, useCallback } from 'react'
import { Play, Square, Download, BarChart3, Loader2 } from 'lucide-react'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { useAnalyses } from '@/contexts/AnalysisContext'
import { useSettings } from '@/contexts/SettingsContext'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { runAnalysis, scoreAnalysis, getRatingFromScore, getRatingColor } from '@/lib/analysis'
import type { AnalysisVariant, RubricScore } from '@/types'
import { PROVIDER_DEFAULTS } from '@/types'

interface AnalysisPanelProps {
  selectedIds: Set<string>
}

export function AnalysisPanel({ selectedIds }: AnalysisPanelProps) {
  const { transcripts } = useTranscripts()
  const { addAnalysis } = useAnalyses()
  const { settings } = useSettings()

  const [variant, setVariant] = useState<AnalysisVariant>('core')
  const [isRunning, setIsRunning] = useState(false)
  const [isScoring, setIsScoring] = useState(false)
  const [content, setContent] = useState('')
  const [score, setScore] = useState<(RubricScore & { commentary: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const selectedTranscripts = transcripts.filter((t) => selectedIds.has(t.id))
  const hasApiKey = !!settings.providers[settings.selectedProvider].apiKey

  const handleRun = useCallback(async () => {
    if (selectedTranscripts.length === 0) return

    setIsRunning(true)
    setContent('')
    setScore(null)
    setError(null)

    abortControllerRef.current = new AbortController()

    const providerSettings = settings.providers[settings.selectedProvider]
    const config = {
      providerId: settings.selectedProvider,
      apiKey: providerSettings.apiKey,
      baseUrl: providerSettings.baseUrl || PROVIDER_DEFAULTS[settings.selectedProvider].baseUrl,
      model: settings.selectedModel,
    }

    try {
      await runAnalysis(
        config,
        selectedTranscripts,
        variant,
        {
          onToken: (token) => setContent((prev) => prev + token),
          onComplete: async (fullText) => {
            setIsRunning(false)
            // Auto-save the analysis
            await addAnalysis({
              transcriptIds: Array.from(selectedIds),
              variant,
              providerId: settings.selectedProvider,
              model: settings.selectedModel,
              content: fullText,
              score: null,
            })
          },
          onError: (err) => {
            setError(err.message)
            setIsRunning(false)
          },
        },
        abortControllerRef.current.signal
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setIsRunning(false)
    }
  }, [selectedTranscripts, selectedIds, variant, settings, addAnalysis])

  const handleStop = () => {
    abortControllerRef.current?.abort()
    setIsRunning(false)
  }

  const handleScore = async () => {
    if (!content) return

    setIsScoring(true)
    setError(null)

    const providerSettings = settings.providers[settings.selectedProvider]
    const config = {
      providerId: settings.selectedProvider,
      apiKey: providerSettings.apiKey,
      baseUrl: providerSettings.baseUrl || PROVIDER_DEFAULTS[settings.selectedProvider].baseUrl,
      model: settings.selectedModel,
    }

    try {
      const result = await scoreAnalysis(config, content)
      setScore(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scoring failed')
    } finally {
      setIsScoring(false)
    }
  }

  const handleExport = () => {
    if (!content) return

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Analysis</h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Variant:</span>
          <Select
            value={variant}
            onValueChange={(v) => setVariant(v as AnalysisVariant)}
            disabled={isRunning}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Core (Standard)</SelectItem>
              <SelectItem value="with-quotes">Quote-Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isRunning ? (
          <Button variant="destructive" onClick={handleStop}>
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={handleRun}
            disabled={selectedTranscripts.length === 0 || !hasApiKey}
          >
            <Play className="h-4 w-4 mr-1" />
            Run Analysis
          </Button>
        )}

        {content && !isRunning && (
          <>
            <Button
              variant="outline"
              onClick={handleScore}
              disabled={isScoring}
            >
              {isScoring ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-1" />
              )}
              Score
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </>
        )}
      </div>

      {/* Status messages */}
      {selectedTranscripts.length === 0 && (
        <div className="text-sm text-gray-500 mb-4">
          Select transcripts from the left panel to analyze.
        </div>
      )}

      {!hasApiKey && selectedTranscripts.length > 0 && (
        <div className="text-sm text-amber-600 mb-4">
          Configure your API key in Settings to run analysis.
        </div>
      )}

      {selectedTranscripts.length > 0 && hasApiKey && !isRunning && !content && (
        <div className="text-sm text-gray-500 mb-4">
          {selectedTranscripts.length} transcript{selectedTranscripts.length !== 1 ? 's' : ''} selected.
          Click "Run Analysis" to begin.
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-md dark:bg-red-950">
          {error}
        </div>
      )}

      {/* Score display */}
      {score && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Quality Score</h3>
            <span className={`text-2xl font-bold ${getRatingColor(score.total)}`}>
              {score.total}/35 — {getRatingFromScore(score.total)}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <ScorePill label="Theme Concreteness" score={score.themeConcreteness} />
            <ScorePill label="Normalization" score={score.normalizationQuality} />
            <ScorePill label="Quantitative Rigor" score={score.quantitativeRigor} />
            <ScorePill label="Ranking Validity" score={score.rankingValidity} />
            <ScorePill label="Attribution" score={score.attributionAccuracy} />
            <ScorePill label="Evidence" score={score.evidenceGrounding} />
            <ScorePill label="Synthesis" score={score.synthesisQuality} />
          </div>
          {score.commentary && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{score.commentary}</p>
          )}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {(content || isRunning) && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              {content}
              {isRunning && <span className="animate-pulse">▋</span>}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function ScorePill({ label, score }: { label: string; score: number }) {
  const color =
    score >= 4 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
    score >= 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'

  return (
    <div className={`px-2 py-1 rounded ${color}`}>
      <span className="font-medium">{score}/5</span>{' '}
      <span className="text-xs opacity-75">{label}</span>
    </div>
  )
}
