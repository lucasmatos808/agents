import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { schema } from './schema/index.ts'

// Usando SQLite para desenvolvimento local
const sqlite = new Database('./dev.db')
export const db = drizzle(sqlite, {
  schema,
  casing: 'snake_case',
})

// Exportando sql como compatibilidade
export const sql = sqlite
