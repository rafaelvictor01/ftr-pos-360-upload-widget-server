import { asc, count, desc, ilike } from 'drizzle-orm';
import type { GetUploadFileDto } from '@/dtos/getUploadFileDTO';
import { getUploadFileDtoSchema } from '@/dtos/getUploadFileDTO'
import type { GetUploadFileResponseDTO } from '@/dtos/getUploadFileResponseDTO';
import { db } from '@/infra/db';
import { schemas } from '@/infra/db/schemas';
import { type Either, makeRight } from '@/utils/either'

export async function getUploadImage(
  input: GetUploadFileDto
): Promise<Either<never, GetUploadFileResponseDTO>> {
  const { searchQuery, sortBy, sortDirection, page, pageSize } =
    getUploadFileDtoSchema.parse(input)

  const [uploads, [{ total }]] = await Promise.all([
    db
      .select({
        id: schemas.uploads.id,
        name: schemas.uploads.name,
        remoteKey: schemas.uploads.remoteKey,
        remoteUrl: schemas.uploads.remoteUrl,
        createdAt: schemas.uploads.createdAt,
      })
      .from(schemas.uploads)
      .where(
        searchQuery
          ? ilike(schemas.uploads.name, `%${searchQuery}%`)
          : undefined
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') return asc(fields[sortBy])
        if (sortBy && sortDirection === 'desc') return desc(fields[sortBy])
        return desc(fields.id)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    db
      .select({ total: count(schemas.uploads.id) })
      .from(schemas.uploads)
      .where(
        searchQuery
          ? ilike(schemas.uploads.name, `%${searchQuery}%`)
          : undefined
      ),
  ])

  return makeRight({ total, uploads })
}
