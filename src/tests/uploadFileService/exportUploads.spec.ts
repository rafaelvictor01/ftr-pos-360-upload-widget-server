import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import * as upload from '@/infra/storage/uploadFileToStorage'
import { exportUploads } from '@/services/fileService/exportUploads'
import { isRight, unwrapEither } from '@/utils/either'
import { makeUpload } from '../factories/makeUpload'

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}.wep` })
    const upload2 = await makeUpload({ name: `${namePattern}.wep` })
    const upload3 = await makeUpload({ name: `${namePattern}.wep` })
    const upload4 = await makeUpload({ name: `${namePattern}.wep` })
    const upload5 = await makeUpload({ name: `${namePattern}.wep` })

    const sut = await exportUploads({
      searchQuery: namePattern,
    })

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'Remote Url', 'Uploaded at'],
      [
        expect.stringContaining(upload1.id),
        expect.stringContaining(upload1.name),
        expect.stringContaining(upload1.remoteUrl),
        expect.any(String),
      ],
      [
        expect.stringContaining(upload2.id),
        expect.stringContaining(upload2.name),
        expect.stringContaining(upload2.remoteUrl),
        expect.any(String),
      ],
      [
        expect.stringContaining(upload3.id),
        expect.stringContaining(upload3.name),
        expect.stringContaining(upload3.remoteUrl),
        expect.any(String),
      ],
      [
        expect.stringContaining(upload4.id),
        expect.stringContaining(upload4.name),
        expect.stringContaining(upload4.remoteUrl),
        expect.any(String),
      ],
      [
        expect.stringContaining(upload5.id),
        expect.stringContaining(upload5.name),
        expect.stringContaining(upload5.remoteUrl),
        expect.any(String),
      ],
    ])
  })
})
