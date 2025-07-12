import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  casing: 'snake_case',
  schema: './src/db/schema/*-sqlite.ts',
  out: './src/db/migrations-sqlite',
  dbCredentials: {
    url: './dev.db',
  },
})
