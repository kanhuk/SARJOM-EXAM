import { sarjomRepository } from '../lib/sarjom-core/repository.js';
import { isVerifiedPyq } from '../lib/sarjom-core/pyqs.js';
import type { SarjomContentType } from '../lib/sarjom-core/types.js';

const TYPES = new Set<SarjomContentType>(['scheme','scholarship','service','syllabus','admit-card','exam','answer-key','result','pyq']);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    const type = typeof req.query?.type === 'string' ? req.query.type as SarjomContentType : undefined;
    if (type && !TYPES.has(type)) return res.status(400).json({ success: false, error: 'Invalid content type.' });
    const state = typeof req.query?.state === 'string' ? req.query.state.toUpperCase() : undefined;
    const id = typeof req.query?.id === 'string' ? req.query.id : undefined;

    const allRecords = await sarjomRepository.listRecords();
    const records = allRecords.filter(record => {
      if (record.contentType === 'pyq' && !isVerifiedPyq(record)) return false;
      if (id && record.id !== id) return false;
      if (type && record.contentType !== type) return false;
      if (state && record.stateCode !== state) return false;
      return true;
    });
    return res.status(200).json({ success: true, records });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load content.' });
  }
}


