import z from "zod";

export const exportFileDtoSchema = z.object({
  searchQuery: z.string().optional()
})

export type ExportFileDto = z.input<typeof exportFileDtoSchema>
