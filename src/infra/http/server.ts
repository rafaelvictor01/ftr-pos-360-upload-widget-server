import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { exportUploadsRoute } from '@/routes/exportUploadsRoute'
import { getUploadsRoute } from '@/routes/getUploadsRoute'
import { uploadFileRoute } from '@/routes/uploadFileRoute'
import { transformSwaggerSchema } from '../utils/transformSwaggerSchema'

const server = fastify()

// Fastify configs

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, { origin: '*' })
server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: { info: { title: 'Upload Server', version: '1.0.0' } },
  transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Routes
server.register(uploadFileRoute)
server.register(getUploadsRoute)
server.register(exportUploadsRoute)

// Error Handler
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

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
  console.log('See: ', `http://localhost:${env.PORT}/docs`)
})

