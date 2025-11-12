import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const uploadImageController : FastifyPluginAsyncZod = async server => {
  server.get('/upload', () => {
    return 'Hello World'
  })
}
