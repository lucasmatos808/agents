import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { questions } from '../../db/schema/questions-sqlite.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      // Para desenvolvimento com SQLite, vamos apenas criar a pergunta sem embeddings
      const answer = "Esta é uma resposta simulada para desenvolvimento."

      const result = await db
        .insert(questions)
        .values({ roomId, question, answer })
        .returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error('Failed to create new question.')
      }

      return reply.status(201).send({
        questionId: insertedQuestion.id,
        answer,
      })
    }
  )
}
