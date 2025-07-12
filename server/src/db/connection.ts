import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { rooms } from './schema/rooms-sqlite.ts'
import { questions } from './schema/questions-sqlite.ts'
import { audioChunks } from './schema/audio-chunks-sqlite.ts'

// Usando SQLite para desenvolvimento local quando PostgreSQL não está disponível
const sqlite = new Database('./dev.db')

const schema = {
  rooms,
  questions,
  audioChunks,
}

export const db = drizzle(sqlite, {
  schema,
  casing: 'snake_case',
})

// Exportando sql como compatibilidade
export const sql = sqlite
