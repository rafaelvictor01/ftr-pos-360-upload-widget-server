import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { Readable } from "node:stream";
import { Upload } from '@aws-sdk/lib-storage'
import z from "zod";
import { env } from "@/env";
import { getR2FolderNames, R2_FOLDERS_ENUM } from "@/infra/storage/r2FoldersEnum";
import { r2 } from "./client";


const uploadFileToStorageSchema = z.object({
  folder: z.enum(R2_FOLDERS_ENUM),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadFileToStorageData = z.input<typeof uploadFileToStorageSchema>

export async function uploadFileToStorage(data: UploadFileToStorageData) {
  const { fileName, contentType, contentStream, folder } = uploadFileToStorageSchema.parse(data)

  const fileExtension = extname(fileName)

  const fileNameWithoutExtension = basename(fileName)
  const sanitizedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '')
  const newFileName = sanitizedFileName.concat(fileExtension)

  const folderName = getR2FolderNames(folder)
  const uniqueFileName = `${folderName}/${randomUUID()}-${newFileName}`

  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await upload.done()

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_BUCKET_URL).toString(),
  }
}
