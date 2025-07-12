import { desc, eq } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { questions } from '../../db/schema/questions-sqlite.ts'

export const getRoomQuestions: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params

      const result = await db
        .select({
          id: questions.id,
          question: questions.question,
          answer: questions.answer,
          createdAt: questions.createdAt,
        })
        .from(questions)
        .where(eq(questions.roomId, roomId))
        .orderBy(desc(questions.createdAt))

      return result
    }
  )
}
