import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { db, generateId } from '@/lib/db'
import type { Transcript } from '@/types'

interface TranscriptContextValue {
  transcripts: Transcript[]
  isLoading: boolean
  addTranscript: (name: string, content: string) => Promise<Transcript>
  updateTranscript: (id: string, updates: Partial<Pick<Transcript, 'name' | 'content'>>) => Promise<void>
  deleteTranscript: (id: string) => Promise<void>
  getTranscript: (id: string) => Transcript | undefined
}

const TranscriptContext = createContext<TranscriptContextValue | null>(null)

export function TranscriptProvider({ children }: { children: ReactNode }) {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load transcripts on mount
  useEffect(() => {
    async function loadTranscripts() {
      try {
        const all = await db.transcripts.orderBy('createdAt').reverse().toArray()
        setTranscripts(all)
      } catch (error) {
        console.error('Failed to load transcripts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTranscripts()
  }, [])

  const addTranscript = useCallback(async (name: string, content: string) => {
    const now = new Date()
    const transcript: Transcript = {
      id: generateId(),
      name,
      content,
      createdAt: now,
      updatedAt: now,
    }
    await db.transcripts.add(transcript)
    setTranscripts((prev) => [transcript, ...prev])
    return transcript
  }, [])

  const updateTranscript = useCallback(
    async (id: string, updates: Partial<Pick<Transcript, 'name' | 'content'>>) => {
      const updatedAt = new Date()
      await db.transcripts.update(id, { ...updates, updatedAt })
      setTranscripts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt } : t))
      )
    },
    []
  )

  const deleteTranscript = useCallback(async (id: string) => {
    await db.transcripts.delete(id)
    setTranscripts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTranscript = useCallback(
    (id: string) => transcripts.find((t) => t.id === id),
    [transcripts]
  )

  return (
    <TranscriptContext.Provider
      value={{
        transcripts,
        isLoading,
        addTranscript,
        updateTranscript,
        deleteTranscript,
        getTranscript,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  )
}

export function useTranscripts() {
  const context = useContext(TranscriptContext)
  if (!context) {
    throw new Error('useTranscripts must be used within a TranscriptProvider')
  }
  return context
}
