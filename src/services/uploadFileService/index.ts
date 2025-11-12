import type { UploadFileDto } from '@/dtos/uploadFileDTO'
import { uploadFileDtoSchema } from '@/dtos/uploadFileDTO'
import type { UploadFileResponseDto } from '@/dtos/uploadFileResponseDTO'
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas"
import type { Either } from '@/utils/either'
import { makeLeft, makeRight } from '@/utils/either'
import { ALLOWED_MIME_TYPES } from "@/utils/sharedConsts"
import { InvalidFileFormat } from './errors/invalidFileFormat'

export async function uploadFile(
  input: UploadFileDto
): Promise<Either<InvalidFileFormat, UploadFileResponseDto>> {
  const { fileName, contentType } = uploadFileDtoSchema.parse(input)

  if (!ALLOWED_MIME_TYPES.includes(contentType))
    return makeLeft(new InvalidFileFormat())

  await db.insert(schemas.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remoteUrl: fileName,
  })

  return makeRight({ url: '' })
}