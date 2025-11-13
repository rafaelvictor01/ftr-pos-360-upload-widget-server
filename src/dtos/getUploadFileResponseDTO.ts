import z from 'zod'

export const getUploadFileResponseDtoSchema = z.object({
  total: z.number(),
  uploads: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      remoteKey: z.string(),
      remoteUrl: z.string(),
      createdAt: z.date(),
    })
  ),
})

export type GetUploadFileResponseDTO = z.input<
  typeof getUploadFileResponseDtoSchema
>
