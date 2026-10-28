/**
 * SARJOM DOCUMENT STORAGE
 *
 * Important:
 * This abstraction deliberately does NOT write official PDFs
 * to the developer's local filesystem.
 *
 * The public SARJOM backend can later connect this interface
 * to an object-storage provider without changing the rest of
 * the job-discovery pipeline.
 */

export interface StoredDocument {
  documentId: string;
  storageKey: string;
  url?: string;
  size: number;
  contentType: string;
  sha256: string;
  createdAt: string;
}

export interface DocumentStorage {
  save(
    data: Buffer,
    options: {
      documentId: string;
      contentType: string;
      storageKey: string;
    },
  ): Promise<StoredDocument>;

  exists(
    storageKey: string,
  ): Promise<boolean>;

  delete(
    storageKey: string,
  ): Promise<void>;
}

/**
 * Temporary/no-persistence storage.
 *
 * This is intentionally safe for development.
 * Nothing is permanently stored on the user's machine.
 */
export class TemporaryDocumentStorage
  implements DocumentStorage {

  private documents =
    new Map<
      string,
      StoredDocument
    >();

  async save(
    data: Buffer,
    options: {
      documentId: string;
      contentType: string;
      storageKey: string;
    },
  ): Promise<StoredDocument> {

    const crypto =
      await import('node:crypto');

    const sha256 =
      crypto
        .createHash('sha256')
        .update(data)
        .digest('hex');

    const document: StoredDocument = {
      documentId:
        options.documentId,

      storageKey:
        options.storageKey,

      size:
        data.length,

      contentType:
        options.contentType,

      sha256,

      createdAt:
        new Date().toISOString(),
    };

    this.documents.set(
      options.storageKey,
      document,
    );

    return document;
  }

  async exists(
    storageKey: string,
  ): Promise<boolean> {

    return this.documents.has(
      storageKey,
    );
  }

  async delete(
    storageKey: string,
  ): Promise<void> {

    this.documents.delete(
      storageKey,
    );
  }
}