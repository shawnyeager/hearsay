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

// Migrate from old database name if it exists (runs once on first load)
const MIGRATED_KEY = 'hearsay-migrated-from-old-db'
if (!localStorage.getItem(MIGRATED_KEY)) {
  localStorage.setItem(MIGRATED_KEY, 'true') // Set immediately to prevent re-runs

  Dexie.exists('InterviewAnalysis').then(async (exists) => {
    if (!exists) return

    try {
      const oldDb = new Dexie('InterviewAnalysis')
      oldDb.version(1).stores({
        transcripts: 'id, name, createdAt, updatedAt',
        analyses: 'id, createdAt, *transcriptIds',
        settings: 'id',
      })
      await oldDb.open()

      const [oldSettings, oldTranscripts, oldAnalyses] = await Promise.all([
        (oldDb as any).settings.toArray(),
        (oldDb as any).transcripts.toArray(),
        (oldDb as any).analyses.toArray(),
      ])

      await db.transaction('rw', [db.settings, db.transcripts, db.analyses], async () => {
        for (const s of oldSettings) await db.settings.put(s)
        for (const t of oldTranscripts) await db.transcripts.put(t)
        for (const a of oldAnalyses) await db.analyses.put(a)
      })

      oldDb.close()
      console.log('Migrated data from old database')
    } catch (e) {
      console.warn('Migration failed:', e)
    }
  })
}

export { db }

// Helper to generate IDs
export function generateId(): string {
  return crypto.randomUUID()
}
