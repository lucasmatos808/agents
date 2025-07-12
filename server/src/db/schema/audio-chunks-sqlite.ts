import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { rooms } from './rooms-sqlite.ts'

export const audioChunks = sqliteTable('audio_chunks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomId: text('room_id')
    .references(() => rooms.id)
    .notNull(),
  transcription: text('transcription').notNull(),
  embeddings: text('embeddings').notNull(), // Storing as JSON string in SQLite
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
})
