import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { exportFileDtoSchema } from '@/dtos/exportFileDTO'
import { exportFileResponseDtoSchema } from '@/dtos/exportFileResponseDTO'
import { exportUploads } from '@/services/fileService/exportUploads'
import { unwrapEither } from '@/utils/either'

export const exportUploadsRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads/exports',
    {
      schema: {
        summary: 'Export Uploads',
        tags: ['Uploads'],
        querystring: exportFileDtoSchema,
        response: { 200: exportFileResponseDtoSchema },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query

      const result = await exportUploads({ searchQuery })

      const { reportUrl } = unwrapEither(result)
      return reply.status(200).send({ reportUrl })
    }
  )
}
