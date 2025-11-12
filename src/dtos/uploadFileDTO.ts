import { Readable } from "node:stream";
import z from "zod";

export const uploadFileDtoSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable)
})

export type UploadFileDto = z.input<typeof uploadFileDtoSchema>
