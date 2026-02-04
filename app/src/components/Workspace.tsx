import { useState, useCallback, useRef, useEffect } from 'react'
import { Loader2, AlertCircle, Download, BarChart3, RotateCcw, Clock, Plus, Zap, Sparkles, FileText, ArrowRight } from 'lucide-react'
import { HearsayLogo } from './HearsayLogo'
import { useSettings } from '@/contexts/SettingsContext'
import { useTranscripts } from '@/contexts/TranscriptContext'
import { useAnalyses } from '@/contexts/AnalysisContext'
import { APIKeyPrompt } from './APIKeyPrompt'
import { SetupSidebar } from './SetupSidebar'
import { AddTranscriptDialog } from './AddTranscriptDialog'
import { MethodologyPanel } from './MethodologyPanel'
import { ModeDiscoveryCard } from './ModeDiscoveryCard'
import { AnalysisOutput } from './AnalysisOutput'
import { Button, Tooltip } from '@/components/ui'
import { runAnalysis, scoreAnalysis, getRatingFromScore, getRatingColor } from '@/lib/analysis'
import { scoreColors } from '@/lib/theme'
import { getPreset } from '@/prompts/presets'
import { SAMPLE_TRANSCRIPTS } from '@/data/sampleTranscripts'
import type { Analysis, AnalysisVariant, RubricScore } from '@/types'
import { PROVIDER_DEFAULTS } from '@/types'

interface WorkspaceProps {
  loadedAnalysis?: Analysis | null
  onClearLoaded?: () => void
  onGuideClick?: () => void
  triggerAddDialog?: number
}

export function Workspace({ loadedAnalysis, onClearLoaded, onGuideClick, triggerAddDialog }: WorkspaceProps) {
  const { settings, hasValidApiKey } = useSettings()
  const { transcripts, addTranscript } = useTranscripts()
  const { addAnalysis } = useAnalyses()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
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

  const [hasRunAnalysis, setHasRunAnalysis] = useState(() => {
    return localStorage.getItem('hearsay-has-run-analysis') === 'true'
  })
  const [hasSeenModeDiscovery, setHasSeenModeDiscovery] = useState(() => {
    return localStorage.getItem('hearsay-seen-mode-discovery') === 'true'
  })

  const [variant, setVariant] = useState<AnalysisVariant>('standard')
  const [isRunning, setIsRunning] = useState(false)
  const [isScoring, setIsScoring] = useState(false)
  const [content, setContent] = useState('')
  const [score, setScore] = useState<(RubricScore & { commentary: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [showAPIPrompt, setShowAPIPrompt] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [isLoadingSamples, setIsLoadingSamples] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const currentPreset = getPreset(variant)
  const selectedTranscripts = transcripts.filter((t) => selectedIds.has(t.id))
  const isViewingHistory = Boolean(loadedAnalysis)

  // Load historical analysis when provided
  useEffect(() => {
    if (loadedAnalysis) {
      setContent(loadedAnalysis.content)
      setScore(loadedAnalysis.score ? { ...loadedAnalysis.score, commentary: '' } : null)
      setVariant(loadedAnalysis.variant)
      setError(null)
    }
  }, [loadedAnalysis])

  // Open add dialog when triggered from parent
  useEffect(() => {
    if (triggerAddDialog && triggerAddDialog > 0) {
      setAddDialogOpen(true)
    }
  }, [triggerAddDialog])

  // Clean up stale selected IDs when transcripts change (skip while loading)
  useEffect(() => {
    if (transcripts.length === 0) return // Don't clear selections while loading
    const validIds = new Set(transcripts.map(t => t.id))
    setSelectedIds(prev => {
      const cleanedIds = new Set(Array.from(prev).filter(id => validIds.has(id)))
      if (cleanedIds.size !== prev.size) {
        localStorage.setItem('selected-transcripts', JSON.stringify(Array.from(cleanedIds)))
        return cleanedIds
      }
      return prev
    })
  }, [transcripts])

  const handleSelectionChange = useCallback((ids: Set<string>) => {
    setSelectedIds(ids)
    localStorage.setItem('selected-transcripts', JSON.stringify(Array.from(ids)))
  }, [])

  const handleLoadSamples = useCallback(async () => {
    setIsLoadingSamples(true)
    try {
      const addedIds: string[] = []
      for (const sample of SAMPLE_TRANSCRIPTS) {
        const transcript = await addTranscript(sample.name, sample.content)
        addedIds.push(transcript.id)
      }
      // Auto-select all loaded samples
      const newSelection = new Set(addedIds)
      setSelectedIds(newSelection)
      localStorage.setItem('selected-transcripts', JSON.stringify(addedIds))
    } finally {
      setIsLoadingSamples(false)
    }
  }, [addTranscript])

  const handleStartNew = useCallback(() => {
    setContent('')
    setScore(null)
    setError(null)
    onClearLoaded?.()
  }, [onClearLoaded])

  const handleRun = useCallback(async () => {
    if (selectedTranscripts.length === 0) return

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

            if (!hasRunAnalysis) {
              localStorage.setItem('hearsay-has-run-analysis', 'true')
              setHasRunAnalysis(true)
            }

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
            const msg = err.message.toLowerCase()
            if (msg.includes('auth') || msg.includes('credentials') || msg.includes('401') || msg.includes('unauthorized')) {
              setShowAPIPrompt(true)
            } else {
              setError(err.message)
            }
            setIsRunning(false)
          },
          onPartialComplete: (_partialText, err) => {
            // Content is already in UI via onToken - just show the error
            setError(err.message)
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
  }, [selectedTranscripts, selectedIds, variant, settings, addAnalysis, hasValidApiKey, hasRunAnalysis])

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
    <div className="flex-1 flex overflow-hidden">
      {/* Setup Sidebar */}
      <SetupSidebar
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        variant={variant}
        onVariantChange={setVariant}
        hasRunAnalysis={hasRunAnalysis}
        hasContent={Boolean(content)}
        isRunning={isRunning}
        onRun={handleRun}
        onStop={handleStop}
        onStartNew={handleStartNew}
        onAddClick={() => setAddDialogOpen(true)}
        onViewMethodology={() => setShowMethodology(true)}
      />

      {/* Main Results Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Error Message */}
        {error && (
          <div className="flex-shrink-0 mx-6 mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-slide-down">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800">Connection interrupted</p>
                <p className="text-sm text-amber-700 mt-0.5">{error}</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setError(null)
                  handleRun()
                }}
                className="flex-shrink-0"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {content || isRunning ? (
            <div className="space-y-4 max-w-4xl">
              {/* Historical Analysis Banner */}
              {isViewingHistory && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-100 border border-surface-200 animate-slide-down">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-surface-500" />
                    <div>
                      <span className="text-sm font-medium text-surface-700">
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
                </div>
              )}

              {/* Analysis Output */}
              <div className="card-elevated overflow-hidden animate-scale-in">
                <div className="px-4 py-3 border-b border-surface-200 bg-surface-50">
                  <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 text-accent-500 ${isRunning ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-medium text-surface-700">
                      {isViewingHistory ? 'Historical Output' : 'Analysis Output'}
                    </span>
                    {isRunning && (
                      <span className="text-xs text-accent-600 ml-auto flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                        Generating...
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 overflow-y-auto">
                  <AnalysisOutput content={content} isStreaming={isRunning} />
                </div>
              </div>

              {/* Score Card */}
              {score && <ScoreCard score={score} />}

              {/* Action Bar - Export and Start New */}
              {!isRunning && content && (
                <div className="flex items-center justify-between py-4 border-t border-surface-200 animate-fade-in">
                  <div className="flex items-center gap-3">
                    {isScoring && (
                      <div className="flex items-center gap-2 text-sm text-surface-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Scoring quality...
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="ghost" onClick={handleStartNew}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Start New Analysis
                    </Button>
                  </div>
                </div>
              )}

              {/* Mode Discovery - inline at end of content for first-time users */}
              {!isRunning && content && !isViewingHistory && !hasSeenModeDiscovery && (
                <ModeDiscoveryCard
                  onExplore={() => {
                    localStorage.setItem('hearsay-seen-mode-discovery', 'true')
                    setHasSeenModeDiscovery(true)
                    setShowMethodology(true)
                  }}
                  onDismiss={() => {
                    localStorage.setItem('hearsay-seen-mode-discovery', 'true')
                    setHasSeenModeDiscovery(true)
                  }}
                />
              )}
            </div>
          ) : transcripts.length === 0 ? (
            <WelcomeState 
              onAddClick={() => setAddDialogOpen(true)} 
              onGuideClick={onGuideClick}
              onLoadSamples={handleLoadSamples}
              isLoadingSamples={isLoadingSamples}
            />
          ) : selectedTranscripts.length === 0 ? (
            <EmptyState message="Select transcripts" description="Check the transcripts you want to analyze in the sidebar, then click Run Analysis." />
          ) : (
            <ReadyState count={selectedTranscripts.length} />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddTranscriptDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onTranscriptsAdded={(ids) => {
          const newSelection = new Set([...selectedIds, ...ids])
          handleSelectionChange(newSelection)
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
      <MethodologyPanel
        preset={currentPreset ?? null}
        open={showMethodology}
        onClose={() => setShowMethodology(false)}
      />
    </div>
  )
}

function WelcomeState({ 
  onAddClick, 
  onGuideClick,
  onLoadSamples,
  isLoadingSamples,
}: { 
  onAddClick: () => void
  onGuideClick?: () => void
  onLoadSamples: () => void
  isLoadingSamples: boolean
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in px-4">
      <div className="max-w-xl w-full">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="mb-6 inline-block">
            <HearsayLogo size="lg" className="w-20 h-20" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-surface-900 mb-3">
            Turn interviews into insights
          </h1>
          <p className="text-surface-600 leading-relaxed max-w-md mx-auto">
            Add your customer interview transcripts and Hearsay will find patterns, 
            rank problems by frequency, and recommend what to build next.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {/* Add Transcripts Card */}
          <button
            onClick={onAddClick}
            className="group p-5 rounded-xl border-2 border-surface-200 hover:border-accent-400 bg-white hover:bg-accent-50/50 text-left transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mb-3 group-hover:bg-accent-200 transition-colors">
              <Plus className="h-5 w-5 text-accent-600" />
            </div>
            <h3 className="font-display font-semibold text-surface-900 mb-1">
              Add your transcripts
            </h3>
            <p className="text-sm text-surface-500">
              Upload .txt or .md files, or paste interview text directly
            </p>
          </button>

          {/* Load Samples Card */}
          <button
            onClick={onLoadSamples}
            disabled={isLoadingSamples}
            className="group p-5 rounded-xl border-2 border-dashed border-surface-200 hover:border-surface-400 bg-surface-50 hover:bg-surface-100 text-left transition-all duration-200 disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-200 flex items-center justify-center mb-3 group-hover:bg-surface-300 transition-colors">
              {isLoadingSamples ? (
                <Loader2 className="h-5 w-5 text-surface-500 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5 text-surface-500" />
              )}
            </div>
            <h3 className="font-display font-semibold text-surface-900 mb-1">
              Try with sample data
            </h3>
            <p className="text-sm text-surface-500">
              Load 5 example interviews to see how Hearsay works
            </p>
          </button>
        </div>

        {/* How it works */}
        <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
          <h4 className="text-sm font-medium text-surface-700 mb-4">How it works</h4>
          <div className="flex items-start gap-3 text-sm">
            <div className="flex items-center gap-2 text-surface-600">
              <span className="w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-xs font-medium">1</span>
              <span>Add transcripts</span>
            </div>
            <ArrowRight className="h-4 w-4 text-surface-300 mt-1 flex-shrink-0" />
            <div className="flex items-center gap-2 text-surface-600">
              <span className="w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-xs font-medium">2</span>
              <span>Run analysis</span>
            </div>
            <ArrowRight className="h-4 w-4 text-surface-300 mt-1 flex-shrink-0" />
            <div className="flex items-center gap-2 text-surface-600">
              <span className="w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-xs font-medium">3</span>
              <span>Get ranked insights</span>
            </div>
          </div>
        </div>

        {/* Guide link */}
        {onGuideClick && (
          <div className="text-center mt-6">
            <button
              onClick={onGuideClick}
              className="text-sm text-surface-500 hover:text-accent-600 transition-colors"
            >
              New to customer interviews? Read our guide →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message, description }: { message: string; description: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in">
      <div className="mb-6 opacity-40">
        <HearsayLogo size="lg" className="w-20 h-20" />
      </div>
      <h3 className="font-display text-xl font-semibold text-surface-900 mb-2">
        {message}
      </h3>
      <p className="text-sm text-surface-500 text-center max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function ReadyState({ count }: { count: number }) {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in">
      <div className="mb-6">
        <HearsayLogo size="lg" className="w-20 h-20" />
      </div>
      <h3 className="font-display text-xl font-semibold text-surface-900 mb-2">
        Ready to analyze
      </h3>
      <p className="text-sm text-surface-500 text-center max-w-sm leading-relaxed">
        {count} transcript{count !== 1 ? 's' : ''} selected. Click "Run Analysis" in the sidebar to start.
      </p>
    </div>
  )
}

// Rubric dimension descriptions for tooltips
const DIMENSION_INFO: Record<string, { label: string; description: string }> = {
  themeConcreteness: {
    label: 'Concrete',
    description: 'Are themes specific enough to act on? High scores mean themes are buildable features, not vague platitudes.',
  },
  normalizationQuality: {
    label: 'Normalized',
    description: 'Are similar statements properly grouped? High scores mean no duplicates and consistent categorization.',
  },
  quantitativeRigor: {
    label: 'Rigorous',
    description: 'Is frequency counting accurate? High scores mean clear "X of N transcripts" format, counting transcripts not mentions.',
  },
  rankingValidity: {
    label: 'Ranked',
    description: 'Does ranking follow frequency? High scores mean problems ordered by how often they appeared, not opinion.',
  },
  attributionAccuracy: {
    label: 'Attributed',
    description: 'Can claims be traced to sources? High scores mean every theme links to specific interviewees.',
  },
  evidenceGrounding: {
    label: 'Grounded',
    description: 'Are quotes accurate and representative? High scores mean verbatim quotes that fairly represent the data.',
  },
  synthesisQuality: {
    label: 'Synthesized',
    description: 'Do recommendations follow from data? High scores mean suggestions directly map to top-frequency themes.',
  },
}

function ScoreCard({ score }: { score: RubricScore & { commentary: string } }) {
  const dimensions = [
    { key: 'themeConcreteness', value: score.themeConcreteness },
    { key: 'normalizationQuality', value: score.normalizationQuality },
    { key: 'quantitativeRigor', value: score.quantitativeRigor },
    { key: 'rankingValidity', value: score.rankingValidity },
    { key: 'attributionAccuracy', value: score.attributionAccuracy },
    { key: 'evidenceGrounding', value: score.evidenceGrounding },
    { key: 'synthesisQuality', value: score.synthesisQuality },
  ]

  const getScoreColor = scoreColors.getText
  const getScoreBg = scoreColors.getBg

  return (
    <div className="card-elevated p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-sm">
            <BarChart3 className="h-5 w-5 text-surface-500" />
          </div>
          <div>
            <span className="font-display font-semibold text-surface-900">Quality Score</span>
            <div className="text-xs text-surface-500 mt-0.5">Hover over dimensions to learn more</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-display font-bold ${getRatingColor(score.total)}`}>
            {score.total}<span className="text-lg text-surface-400">/35</span>
          </div>
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
              score.total >= 32
                ? 'bg-green-50 text-green-700 border border-green-200'
                : score.total >= 25
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : score.total >= 18
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {getRatingFromScore(score.total)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-5">
        {dimensions.map((dim) => {
          const info = DIMENSION_INFO[dim.key]
          return (
            <Tooltip key={dim.key} content={info.description} position="bottom">
              <div className={`text-center p-2 rounded-lg cursor-help ${getScoreBg(dim.value)}`}>
                <div className={`text-lg font-semibold ${getScoreColor(dim.value)}`}>
                  {dim.value}
                </div>
                <div className="text-[10px] text-surface-500 truncate mt-0.5">{info.label}</div>
              </div>
            </Tooltip>
          )
        })}
      </div>

      {score.commentary && (
        <p className="text-sm text-surface-600 border-t border-surface-200 pt-4 leading-relaxed">
          {score.commentary}
        </p>
      )}
    </div>
  )
}
