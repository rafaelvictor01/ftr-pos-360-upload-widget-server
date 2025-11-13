import { fakerPT_BR } from '@faker-js/faker';
import type { InferInsertModel } from "drizzle-orm";
import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";

export async function makeUpload(
  overrides?: Partial<InferInsertModel<typeof schemas.uploads>>
) {
  const fileName = fakerPT_BR.system.fileName()

  const result = await db
    .insert(schemas.uploads)
    .values({
      name: fileName,
      remoteKey: `images/${fileName}`,
      remoteUrl: `http://example.com/images/${fileName}`,
      ...overrides,
    })
    .returning()

  return result[0]
}