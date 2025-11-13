import { PassThrough, pipeline, Readable } from 'node:stream'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import type { ExportFileDto } from "@/dtos/exportFileDTO"
import { exportFileDtoSchema } from "@/dtos/exportFileDTO"
import type { ExportFileResponseDto } from "@/dtos/exportFileResponseDTO"
import { db, pg } from "@/infra/db"
import { schemas } from "@/infra/db/schemas"
import { R2_FOLDERS_ENUM } from '@/infra/storage/r2FoldersEnum';
import { uploadFileToStorage } from '@/infra/storage/uploadFileToStorage'
import { type Either, makeRight } from '@/utils/either'

export async function exportUploads(
  input: ExportFileDto
): Promise<Either<never, ExportFileResponseDto>> {
  const { searchQuery } = exportFileDtoSchema.parse(input)

  const { sql, params } = db
    .select({
      id: schemas.uploads.id,
      name: schemas.uploads.name,
      remoteUrl: schemas.uploads.remoteUrl,
      createdAt: schemas.uploads.createdAt,
    })
    .from(schemas.uploads)
    .where(
      searchQuery
        ? ilike(schemas.uploads.name, `%${searchQuery}%`)
        : undefined
    ).toSQL()
  
  const cursor = pg.unsafe(sql, params as string[]).cursor(1)
  const readableCursor = Readable.from(cursor)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'name', header: 'Name' },
      { key: 'remote_url', header: 'Remote Url' },
      { key: 'created_at', header: 'Uploaded at' },
    ]
  })
  
  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    readableCursor,
    csv,
    uploadToStorageStream,
    err => {
      if (err) console.error('Pipeline failed', err)
      else console.log('Pipeline succeeded')
    }
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: R2_FOLDERS_ENUM.DOWNLOAD,
    fileName: `${new Date().toISOString()}-uploads.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([ uploadToStorage, convertToCSVPipeline])

  return makeRight({ reportUrl: url })
}
