import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUploadFileResponseDtoSchema } from '@/dtos/getUploadFileResponseDTO'
import { listDtoSchema } from '@/dtos/listDTO'
import { getUploadImage } from '@/services/uploadFileService/getUploadImage'
import { unwrapEither } from '@/utils/either'

export const getUploadsRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/uploads',
    {
      schema: {
        summary: 'Get Uploads',
        tags: ['uploads'],
        querystring: listDtoSchema,
        response: { 200: getUploadFileResponseDtoSchema },
      },
    },
    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } = request.query

      const result = await getUploadImage({
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection,
      })

      const { total, uploads } = unwrapEither(result)
      return reply.status(200).send({ total, uploads })
    }
  )
}
