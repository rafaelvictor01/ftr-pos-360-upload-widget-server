import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '@/infra/db'
import { schemas } from '@/infra/db/schemas'

export const uploadImageController : FastifyPluginAsyncZod = async server => {
  server.post(
    '/upload',
    {
      schema: {
        summary: 'Upload an Image',
        body: z.object({ name: z.string(), password: z.string() }),
        response: {
          200: z.object({ uploadId: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe('Upload already exists.'),
        },
      },
    },
    async (_request, reply) => {
      await db.insert(schemas.uploads).values({
        name: 'test.jpg',
        remoteKey: 'test.jpg',
        remoteUrl: 'http://asdasd.com',
      })

      return reply.status(200).send({ uploadId: 'teste' })
    }
  )
}
