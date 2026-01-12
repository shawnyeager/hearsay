import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { db, generateId } from '@/lib/db'
import type { Analysis, AnalysisVariant, ProviderId, RubricScore } from '@/types'

interface AnalysisContextValue {
  analyses: Analysis[]
  isLoading: boolean
  addAnalysis: (params: {
    transcriptIds: string[]
    variant: AnalysisVariant
    providerId: ProviderId
    model: string
    content: string
    score?: RubricScore | null
  }) => Promise<Analysis>
  updateAnalysis: (id: string, updates: Partial<Pick<Analysis, 'content' | 'score'>>) => Promise<void>
  deleteAnalysis: (id: string) => Promise<void>
  getAnalysis: (id: string) => Analysis | undefined
  getAnalysesForTranscripts: (transcriptIds: string[]) => Analysis[]
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null)

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load analyses on mount
  useEffect(() => {
    async function loadAnalyses() {
      try {
        const all = await db.analyses.orderBy('createdAt').reverse().toArray()
        setAnalyses(all)
      } catch (error) {
        console.error('Failed to load analyses:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAnalyses()
  }, [])

  const addAnalysis = useCallback(
    async (params: {
      transcriptIds: string[]
      variant: AnalysisVariant
      providerId: ProviderId
      model: string
      content: string
      score?: RubricScore | null
    }) => {
      const analysis: Analysis = {
        id: generateId(),
        transcriptIds: params.transcriptIds,
        variant: params.variant,
        providerId: params.providerId,
        model: params.model,
        content: params.content,
        score: params.score ?? null,
        createdAt: new Date(),
      }
      await db.analyses.add(analysis)
      setAnalyses((prev) => [analysis, ...prev])
      return analysis
    },
    []
  )

  const updateAnalysis = useCallback(
    async (id: string, updates: Partial<Pick<Analysis, 'content' | 'score'>>) => {
      await db.analyses.update(id, updates)
      setAnalyses((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      )
    },
    []
  )

  const deleteAnalysis = useCallback(async (id: string) => {
    await db.analyses.delete(id)
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const getAnalysis = useCallback(
    (id: string) => analyses.find((a) => a.id === id),
    [analyses]
  )

  const getAnalysesForTranscripts = useCallback(
    (transcriptIds: string[]) => {
      const idSet = new Set(transcriptIds)
      return analyses.filter((a) =>
        a.transcriptIds.length === transcriptIds.length &&
        a.transcriptIds.every((id) => idSet.has(id))
      )
    },
    [analyses]
  )

  return (
    <AnalysisContext.Provider
      value={{
        analyses,
        isLoading,
        addAnalysis,
        updateAnalysis,
        deleteAnalysis,
        getAnalysis,
        getAnalysesForTranscripts,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalyses() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalyses must be used within an AnalysisProvider')
  }
  return context
}
