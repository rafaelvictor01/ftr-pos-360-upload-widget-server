import z from "zod";

export const getUploadFileDtoSchema = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20)
})

export type GetUploadFileDto = z.input<typeof getUploadFileDtoSchema>
