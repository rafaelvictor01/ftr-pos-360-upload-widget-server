import z from "zod";

export const uploadFileDtoResponseSchema = z.object({
  url: z.string(),
})

export type UploadFileResponseDto = z.input<typeof uploadFileDtoResponseSchema>
