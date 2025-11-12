import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { uploadFileDtoResponseSchema } from '@/dtos/uploadFileResponseDTO'
import { uploadFile } from '@/services/uploadFileService'
import { isRight, unwrapEither } from '@/utils/either'
import { FILE_SIZE_2MB } from '@/utils/sharedConsts'

export const uploadFileController: FastifyPluginAsyncZod = async server => {
  server.post(
    '/upload',
    {
      schema: {
        summary: 'Upload an File',
        consumes: ['multipart/form-data'],
        response: {
          200: uploadFileDtoResponseSchema,
          400: z.object({ message: z.string() }).describe('File is required.'),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: { fileSize: FILE_SIZE_2MB },
      })

      if (!uploadedFile) return reply.status(400)

      const result = await uploadFile({
        fileName: uploadedFile.filename,
        contentStream: uploadedFile.file,
        contentType: uploadedFile.mimetype,
      })

      if (isRight(result))
        return reply.status(200).send({ url: result.right.url })

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
        default:
          return reply.status(400)
      }
    }
  )
}
