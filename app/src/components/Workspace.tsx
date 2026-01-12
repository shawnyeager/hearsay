import { useState, useCallback, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Plus, Play, Square, ChevronDown, ChevronUp, Loader2, Zap, AlertCircle, Download, BarChart3, RotateCcw, Clock } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { useAnalyses } from '@/contexts/AnalysisContext'
import { APIKeyPrompt } from './APIKeyPrompt'
import { WelcomePanel } from './WelcomePanel'
import { TranscriptChips } from './TranscriptChips'
import { AddTranscriptDialog } from './AddTranscriptDialog'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { runAnalysis, scoreAnalysis, getRatingFromScore, getRatingColor } from '@/lib/analysis'
import type { Analysis, AnalysisVariant, RubricScore } from '@/types'
import { PROVIDER_DEFAULTS } from '@/types'

interface WorkspaceProps {
  loadedAnalysis?: Analysis | null
  onClearLoaded?: () => void
}

export function Workspace({ loadedAnalysis, onClearLoaded }: WorkspaceProps) {
  const { settings, hasValidApiKey, getCurrentProviderConfig, setSelectedModel } = useSettings()
  const { transcripts } = useTranscripts()
  const { addAnalysis } = useAnalyses()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // Restore from localStorage
    const stored = localStorage.getItem('selected-transcripts')
    if (stored) {
      try {
        return new Set(JSON.parse(stored))
      } catch {
        return new Set()
      }
    }
    return new Set()
  })

  const [variant, setVariant] = useState<AnalysisVariant>('core')
  const [isRunning, setIsRunning] = useState(false)
  const [isScoring, setIsScoring] = useState(false)
  const [content, setContent] = useState('')
  const [score, setScore] = useState<(RubricScore & { commentary: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showAPIPrompt, setShowAPIPrompt] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const currentConfig = getCurrentProviderConfig()
  const selectedTranscripts = transcripts.filter((t) => selectedIds.has(t.id))

  // Load historical analysis when provided
  useEffect(() => {
    if (loadedAnalysis) {
      setContent(loadedAnalysis.content)
      setScore(loadedAnalysis.score ? { ...loadedAnalysis.score, commentary: '' } : null)
      setVariant(loadedAnalysis.variant)
      setError(null)
    }
  }, [loadedAnalysis])

  const isViewingHistory = Boolean(loadedAnalysis)

  // Persist selection to localStorage
  const handleSelectionChange = useCallback((ids: Set<string>) => {
    setSelectedIds(ids)
    localStorage.setItem('selected-transcripts', JSON.stringify(Array.from(ids)))
  }, [])

  const handleRun = useCallback(async () => {
    if (selectedTranscripts.length === 0) return

    // Show API key prompt if not configured
    if (!hasValidApiKey) {
      setShowAPIPrompt(true)
      return
    }

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

            // Auto-score the analysis
            setIsScoring(true)
            try {
              const scoreResult = await scoreAnalysis(config, fullText)
              setScore(scoreResult)
              await addAnalysis({
                transcriptIds: Array.from(selectedIds),
                variant,
                providerId: settings.selectedProvider,
                model: settings.selectedModel,
                content: fullText,
                score: {
                  themeConcreteness: scoreResult.themeConcreteness,
                  normalizationQuality: scoreResult.normalizationQuality,
                  quantitativeRigor: scoreResult.quantitativeRigor,
                  rankingValidity: scoreResult.rankingValidity,
                  attributionAccuracy: scoreResult.attributionAccuracy,
                  evidenceGrounding: scoreResult.evidenceGrounding,
                  synthesisQuality: scoreResult.synthesisQuality,
                  total: scoreResult.total,
                },
              })
            } catch {
              // Scoring failed, save without score
              await addAnalysis({
                transcriptIds: Array.from(selectedIds),
                variant,
                providerId: settings.selectedProvider,
                model: settings.selectedModel,
                content: fullText,
                score: null,
              })
            } finally {
              setIsScoring(false)
            }
          },
          onError: (err) => {
            // If auth error, show API key prompt instead of error
            const msg = err.message.toLowerCase()
            if (msg.includes('auth') || msg.includes('credentials') || msg.includes('401') || msg.includes('unauthorized')) {
              setShowAPIPrompt(true)
            } else {
              setError(err.message)
            }
            setIsRunning(false)
          },
        },
        abortControllerRef.current.signal
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      const msgLower = message.toLowerCase()
      if (msgLower.includes('auth') || msgLower.includes('credentials') || msgLower.includes('401') || msgLower.includes('unauthorized')) {
        setShowAPIPrompt(true)
      } else {
        setError(message)
      }
      setIsRunning(false)
    }
  }, [selectedTranscripts, selectedIds, variant, settings, addAnalysis, hasValidApiKey])

  const handleStop = () => {
    abortControllerRef.current?.abort()
    setIsRunning(false)
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
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Control Bar - only show when there are transcripts */}
      {transcripts.length > 0 && (
      <div className="flex-shrink-0 px-6 py-4 border-b border-surface-800/60 bg-surface-950/50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Transcripts */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add
            </Button>
            <TranscriptChips
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
            />
          </div>

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1 transition-colors"
          >
            Advanced
            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {/* Run Button */}
          {isRunning ? (
            <Button variant="destructive" onClick={handleStop}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleRun}
              disabled={selectedTranscripts.length === 0}
              className="min-w-[140px]"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
          )}
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-surface-800/40 flex items-center gap-4 animate-slide-down">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-surface-500">Model</span>
              <Select value={settings.selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentConfig.models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Error Message */}
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {content || isRunning ? (
          <div className="space-y-4">
            {/* Historical Analysis Banner */}
            {isViewingHistory && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 animate-slide-down">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-surface-400" />
                  <div>
                    <span className="text-sm font-medium text-surface-300">
                      Viewing historical analysis
                    </span>
                    <span className="text-xs text-surface-500 ml-2">
                      {new Date(loadedAnalysis!.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClearLoaded?.()
                    setContent('')
                    setScore(null)
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  New Analysis
                </Button>
              </div>
            )}

            {/* Analysis Output */}
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
                    {isViewingHistory ? 'Historical Output' : 'Analysis Output'}
                  </span>
                  {isRunning && (
                    <span className="text-xs text-accent-400 ml-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                      Generating...
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 max-h-[500px] overflow-y-auto prose-analysis">
                <ReactMarkdown>{content}</ReactMarkdown>
                {isRunning && <span className="typing-cursor" />}
              </div>
            </div>

            {/* Score Card */}
            {score && <ScoreCard score={score} />}

            {/* Post-Analysis Actions */}
            {!isRunning && content && (
              <div className="flex items-center gap-3 animate-fade-in">
                {isScoring && (
                  <div className="flex items-center gap-2 text-sm text-surface-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scoring quality...
                  </div>
                )}
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>
        ) : transcripts.length === 0 ? (
          <WelcomePanel onAddClick={() => setAddDialogOpen(true)} />
        ) : (
          <EmptyState hasSelection={selectedTranscripts.length > 0} />
        )}
      </div>

      <AddTranscriptDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onTranscriptsAdded={(ids) => {
          const newSelection = new Set([...selectedIds, ...ids])
          handleSelectionChange(newSelection)
          // First-run flow: immediately prompt for API key
          if (!hasValidApiKey) {
            setShowAPIPrompt(true)
          }
        }}
      />
      <APIKeyPrompt
        open={showAPIPrompt}
        onOpenChange={setShowAPIPrompt}
        onSuccess={handleRun}
      />
    </div>
  )
}

function EmptyState({ hasSelection }: { hasSelection: boolean }) {
  if (!hasSelection) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-surface-800/50 rounded-3xl blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center">
            <Zap className="h-10 w-10 text-surface-600" />
          </div>
        </div>
        <h3 className="font-display text-xl font-semibold text-surface-100 mb-2">
          Select transcripts to analyze
        </h3>
        <p className="text-sm text-surface-500 text-center max-w-sm leading-relaxed">
          Click on transcript chips above to select which interviews to include in your analysis.
        </p>
      </div>
    )
  }

  return (
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
        Click "Run Analysis" to identify patterns across your selected transcripts.
      </p>
    </div>
  )
}

function ScoreCard({ score }: { score: RubricScore & { commentary: string } }) {
  const dimensions = [
    { key: 'themeConcreteness', label: 'Concrete', value: score.themeConcreteness },
    { key: 'normalizationQuality', label: 'Normalized', value: score.normalizationQuality },
    { key: 'quantitativeRigor', label: 'Rigorous', value: score.quantitativeRigor },
    { key: 'rankingValidity', label: 'Ranked', value: score.rankingValidity },
    { key: 'attributionAccuracy', label: 'Attributed', value: score.attributionAccuracy },
    { key: 'evidenceGrounding', label: 'Grounded', value: score.evidenceGrounding },
    { key: 'synthesisQuality', label: 'Synthesized', value: score.synthesisQuality },
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
    <div className="card-elevated p-5 animate-slide-up">
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
