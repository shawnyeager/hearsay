import { useState, useRef, useCallback } from 'react'
import {
  Play,
  Square,
  Download,
  BarChart3,
  Loader2,
  FileText,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
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

  // Empty state - no transcripts selected
  if (selectedTranscripts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-surface-800/50 rounded-3xl blur-2xl scale-150" />
          <div className="relative w-24 h-24 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center">
            <FileText className="h-12 w-12 text-surface-600" />
          </div>
        </div>
        <h3 className="font-display text-xl font-semibold text-surface-100 mb-2">
          Select transcripts to analyze
        </h3>
        <p className="text-sm text-surface-500 text-center max-w-sm leading-relaxed">
          Choose one or more interview transcripts from the sidebar, then run analysis
          to extract frequency-ranked insights.
        </p>
        <div className="flex items-center gap-2 mt-6 text-xs text-surface-600">
          <span>Sidebar</span>
          <ArrowRight className="h-3 w-3" />
          <span>Select</span>
          <ArrowRight className="h-3 w-3" />
          <span>Analyze</span>
        </div>
      </div>
    )
  }

  // No API key configured
  if (!hasApiKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-2xl scale-150" />
          <div className="relative w-24 h-24 rounded-2xl bg-surface-900 border border-amber-500/30 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        <h3 className="font-display text-xl font-semibold text-surface-100 mb-2">
          API key required
        </h3>
        <p className="text-sm text-surface-500 text-center max-w-sm mb-4 leading-relaxed">
          Configure your LLM provider API key in Settings to run analysis.
        </p>
        <div className="px-3 py-1.5 rounded-full bg-surface-800 text-xs text-surface-400">
          {selectedTranscripts.length} transcript{selectedTranscripts.length !== 1 ? 's' : ''} selected
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-surface-800/60 bg-surface-950/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Selected count */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">
              {selectedTranscripts.length} transcript{selectedTranscripts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="h-5 w-px bg-surface-800" />

          {/* Variant selector */}
          <Select
            value={variant}
            onValueChange={(v) => setVariant(v as AnalysisVariant)}
            disabled={isRunning}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Standard</SelectItem>
              <SelectItem value="with-quotes">Quote-Heavy</SelectItem>
            </SelectContent>
          </Select>

          {/* Run/Stop button */}
          {isRunning ? (
            <Button variant="destructive" onClick={handleStop}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button onClick={handleRun}>
              <Play className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
          )}

          {/* Post-analysis actions */}
          {content && !isRunning && (
            <>
              <div className="h-5 w-px bg-surface-800" />
              <Button variant="outline" onClick={handleScore} disabled={isScoring}>
                {isScoring ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                Score
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex-shrink-0 mx-6 mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-slide-down">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">Error</p>
              <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Score display */}
      {score && (
        <div className="flex-shrink-0 mx-6 mt-4 animate-slide-down">
          <ScoreCard score={score} />
        </div>
      )}

      {/* Results or ready state */}
      <div className="flex-1 overflow-y-auto p-6">
        {content || isRunning ? (
          <div className="card-elevated overflow-hidden animate-scale-in">
            <div className="px-4 py-3 border-b border-surface-800/50 bg-surface-800/30">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Zap className="h-4 w-4 text-accent-500" />
                  {isRunning && (
                    <div className="absolute inset-0 animate-ping">
                      <Zap className="h-4 w-4 text-accent-500 opacity-50" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-surface-300">
                  Analysis Output
                </span>
                {isRunning && (
                  <span className="text-xs text-accent-400 ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                    Generating...
                  </span>
                )}
              </div>
            </div>
            <div className="p-5 max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm text-surface-300 leading-relaxed">
                {content}
                {isRunning && <span className="typing-cursor" />}
              </pre>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent-500/20 rounded-3xl blur-3xl scale-150 animate-pulse-glow" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-xl shadow-accent-500/30">
                <Zap className="h-10 w-10 text-surface-950" strokeWidth={2} />
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold text-surface-100 mb-2">
              Ready to analyze
            </h3>
            <p className="text-sm text-surface-500 text-center max-w-sm leading-relaxed">
              Click "Run Analysis" to identify patterns across your {selectedTranscripts.length} selected
              transcript{selectedTranscripts.length !== 1 ? 's' : ''}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreCard({ score }: { score: RubricScore & { commentary: string } }) {
  const dimensions = [
    { key: 'themeConcreteness', label: 'Concreteness', value: score.themeConcreteness },
    { key: 'normalizationQuality', label: 'Normalization', value: score.normalizationQuality },
    { key: 'quantitativeRigor', label: 'Rigor', value: score.quantitativeRigor },
    { key: 'rankingValidity', label: 'Ranking', value: score.rankingValidity },
    { key: 'attributionAccuracy', label: 'Attribution', value: score.attributionAccuracy },
    { key: 'evidenceGrounding', label: 'Evidence', value: score.evidenceGrounding },
    { key: 'synthesisQuality', label: 'Synthesis', value: score.synthesisQuality },
  ]

  const getScoreColor = (value: number) => {
    if (value >= 4) return 'text-green-400'
    if (value >= 3) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (value: number) => {
    if (value >= 4) return 'bg-green-500/10'
    if (value >= 3) return 'bg-amber-500/10'
    return 'bg-red-500/10'
  }

  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-surface-400" />
          </div>
          <div>
            <span className="font-display font-semibold text-surface-100">Quality Score</span>
            <div className="text-xs text-surface-500 mt-0.5">Analysis evaluation</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-display font-bold ${getRatingColor(score.total)}`}>
            {score.total}<span className="text-lg text-surface-600">/35</span>
          </div>
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
              score.total >= 32
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : score.total >= 25
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : score.total >= 18
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {getRatingFromScore(score.total)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-5">
        {dimensions.map((dim) => (
          <div key={dim.key} className={`text-center p-2 rounded-lg ${getScoreBg(dim.value)}`}>
            <div className={`text-lg font-semibold ${getScoreColor(dim.value)}`}>
              {dim.value}
            </div>
            <div className="text-[10px] text-surface-500 truncate mt-0.5">{dim.label}</div>
          </div>
        ))}
      </div>

      {score.commentary && (
        <p className="text-sm text-surface-400 border-t border-surface-800 pt-4 leading-relaxed">
          {score.commentary}
        </p>
      )}
    </div>
  )
}
