import { assertAdminToken } from '../../lib/sarjom-core/admin.js';
import { sarjomRepository } from '../../lib/sarjom-core/repository.js';
import type { SarjomGenericRecord } from '../../lib/sarjom-core/types.js';
import crypto from 'node:crypto';

function token(req: any): string | undefined {
  const h = req.headers?.authorization;
  if (typeof h === 'string' && h.startsWith('Bearer ')) return h.slice(7);
  return typeof req.headers?.['x-sarjom-admin-token'] === 'string' ? req.headers['x-sarjom-admin-token'] : undefined;
}

const TYPES = new Set(['scheme','scholarship','service','syllabus','admit-card','exam','answer-key','result']);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-SARJOM-Admin-Token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    assertAdminToken(token(req));
    if (req.method === 'GET') return res.status(200).json({ success: true, records: await sarjomRepository.listRecords() });
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!TYPES.has(body.contentType) || typeof body.title !== 'string' || !body.title.trim()) return res.status(400).json({ success: false, error: 'contentType and title are required.' });
    const record: SarjomGenericRecord = {
      id: typeof body.id === 'string' && body.id ? body.id : crypto.randomBytes(10).toString('hex'),
      contentType: body.contentType,
      title: body.title.trim().slice(0, 300), description: typeof body.description === 'string' ? body.description : undefined,
      stateCode: typeof body.stateCode === 'string' ? body.stateCode.toUpperCase() : undefined,
      districts: Array.isArray(body.districts) ? body.districts.filter((x: unknown): x is string => typeof x === 'string') : undefined,
      officialUrl: typeof body.officialUrl === 'string' ? body.officialUrl : undefined,
      officialSource: typeof body.officialSource === 'string' ? body.officialSource : undefined,
      publishedAt: typeof body.publishedAt === 'string' ? body.publishedAt : undefined,
      updatedAt: new Date().toISOString(), lastVerifiedAt: new Date().toISOString(),
      status: typeof body.status === 'string' ? body.status : 'active',
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : undefined,
    };
    await sarjomRepository.saveRecord(record);
    return res.status(200).json({ success: true, record });
  } catch (error) {
    const status = error instanceof Error && error.message.startsWith('Unauthorized') ? 401 : 500;
    return res.status(status).json({ success: false, error: error instanceof Error ? error.message : 'Admin content request failed.' });
  }
}
