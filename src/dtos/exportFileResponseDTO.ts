import z from "zod";

export const exportFileResponseDtoSchema = z.object({
  reportUrl: z.string()
})

export type ExportFileResponseDto = z.input<typeof exportFileResponseDtoSchema>
