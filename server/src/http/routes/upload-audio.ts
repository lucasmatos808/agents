import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { audioChunks } from '../../db/schema/audio-chunks-sqlite.ts'

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const audio = await request.file()

      if (!audio) {
        throw new Error('Audio is required.')
      }

      const audioBuffer = await audio.toBuffer()
      const audioAsBase64 = audioBuffer.toString('base64')

      // Para desenvolvimento com SQLite, vamos simular a transcrição
      const transcription = "Transcrição simulada para desenvolvimento"
      const embeddings = "[]" // JSON string vazia para SQLite

      const result = await db
        .insert(audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning()

      const chunk = result[0]

      if (!chunk) {
        throw new Error('Erro ao salvar chunk de áudio')
      }

      return reply.status(201).send({ chunkId: chunk.id })
    }
  )
}
