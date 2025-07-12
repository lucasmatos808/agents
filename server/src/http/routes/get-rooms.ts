import { count, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/connection.ts'
import { rooms } from '../../db/schema/rooms-sqlite.ts'
import { questions } from '../../db/schema/questions-sqlite.ts'

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
  app.get('/rooms', async () => {
    const results = await db
      .select({
        id: rooms.id,
        name: rooms.name,
        createdAt: rooms.createdAt,
        questionsCount: count(questions.id),
      })
      .from(rooms)
      .leftJoin(questions, eq(questions.roomId, rooms.id))
      .groupBy(rooms.id)
      .orderBy(rooms.createdAt)

    return results
  })
}
