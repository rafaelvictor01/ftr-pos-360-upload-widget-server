import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaDAta = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSwaggerSchemaDAta) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    const body = (schema.body ?? {
      type: 'object',
      required: [],
      properties: {},
    }) as any

    body.properties.file = { type: 'string', format: 'binary' }
    body.required.push('file')

    schema.body = body
  }

  return { schema, url }
}
