import crypto from 'node:crypto';

import {
  TemporaryDocumentStorage,
  StoredDocument,
} from './document-storage.js';

export interface DownloadedOfficialDocument {
  buffer: Buffer;
  document: StoredDocument;
  sourceUrl: string;
}

const MAX_PDF_SIZE =
  20 * 1024 * 1024; // 20 MB

const storage =
  new TemporaryDocumentStorage();

function createDocumentId(
  url: string,
): string {

  return crypto
    .createHash('sha256')
    .update(url)
    .digest('hex')
    .slice(0, 24);
}

function createStorageKey(
  url: string,
): string {

  const id =
    createDocumentId(url);

  return `temporary/official/${id}.pdf`;
}

export async function downloadOfficialDocument(
  url: string,
): Promise<DownloadedOfficialDocument> {

  if (!url.startsWith('http://') &&
      !url.startsWith('https://')) {

    throw new Error(
      'Invalid official document URL.',
    );
  }

  console.log(
    `[SARJOM] Downloading official document: ${url}`,
  );

  const response =
    await fetch(url, {
      headers: {
        'User-Agent':
          'SARJOM-Baha/2.0 Official-Document-Resolver',
        'Accept':
          'application/pdf,*/*',
      },
    });

  if (!response.ok) {

    throw new Error(
      `Official document download failed: ${response.status} ${response.statusText}`,
    );
  }

  const contentLength =
    response.headers.get(
      'content-length',
    );

  if (
    contentLength &&
    Number(contentLength) >
      MAX_PDF_SIZE
  ) {

    throw new Error(
      `PDF exceeds maximum allowed size of ${MAX_PDF_SIZE} bytes.`,
    );
  }

  const arrayBuffer =
    await response.arrayBuffer();

  const buffer =
    Buffer.from(arrayBuffer);

  if (
    buffer.length >
    MAX_PDF_SIZE
  ) {

    throw new Error(
      `PDF exceeds maximum allowed size of ${MAX_PDF_SIZE} bytes.`,
    );
  }

  if (buffer.length === 0) {

    throw new Error(
      'Downloaded PDF is empty.',
    );
  }

  const documentId =
    createDocumentId(url);

  const storageKey =
    createStorageKey(url);

  const document =
    await storage.save(
      buffer,
      {
        documentId,
        storageKey,
        contentType:
          'application/pdf',
      },
    );

  console.log(
    `[SARJOM] PDF downloaded: ${buffer.length} bytes`,
  );

  return {
    buffer,
    document,
    sourceUrl: url,
  };
}