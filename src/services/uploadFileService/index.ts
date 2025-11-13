import type { UploadFileDto } from '@/dtos/uploadFileDTO'
import { uploadFileDtoSchema } from '@/dtos/uploadFileDTO'
import type { UploadFileResponseDto } from '@/dtos/uploadFileResponseDTO'
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas"
import { R2_FOLDERS_ENUM } from '@/infra/storage/r2FoldersEnum'
import { uploadFileToStorage } from '@/infra/storage/uploadFileToStorage'
import type { Either } from '@/utils/either'
import { makeLeft, makeRight } from '@/utils/either'
import { ALLOWED_IMG_MIME_TYPES } from '@/utils/sharedConsts'
import { InvalidFileFormat } from './errors/invalidFileFormat'

export async function uploadImage(
  input: UploadFileDto
): Promise<Either<InvalidFileFormat, UploadFileResponseDto>> {
  const { fileName, contentType, contentStream } =
    uploadFileDtoSchema.parse(input)

  if (!ALLOWED_IMG_MIME_TYPES.includes(contentType))
    return makeLeft(new InvalidFileFormat())

  const { key, url } = await uploadFileToStorage({
    folder: R2_FOLDERS_ENUM.IMAGES,
    contentStream: contentStream,
    contentType: contentType,
    fileName: fileName,
  })

  await db.insert(schemas.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url,
  })

  return makeRight({ url })
}