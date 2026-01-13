import Dexie, { type EntityTable } from 'dexie'
import type { Transcript, Analysis, Settings } from '@/types'

const db = new Dexie('Hearsay') as Dexie & {
  transcripts: EntityTable<Transcript, 'id'>
  analyses: EntityTable<Analysis, 'id'>
  settings: EntityTable<Settings & { id: string }, 'id'>
}

db.version(1).stores({
  transcripts: 'id, name, createdAt, updatedAt',
  analyses: 'id, createdAt, *transcriptIds',
  settings: 'id',
})

// Migration from old database name already completed - no longer needed

export { db }

// Helper to generate IDs
export function generateId(): string {
  return crypto.randomUUID()
}
