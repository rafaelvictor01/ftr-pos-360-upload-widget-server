import { fastifyCors } from "@fastify/cors";
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { uploadImageController } from '@/controllers/uploadImageController'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation Error.',
      issues: error.validation,
    })
  }

  // TODO: Enviar o erro para alguma ferramenta de observabilidade

  return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, { origin: '*' })

server.register(uploadImageController)

server.listen({ port: 3333, host: '0.0.0.0'}).then(() => {
  console.log('HTTP server running!')
})

