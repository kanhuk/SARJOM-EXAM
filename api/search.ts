import { searchSarjom } from '../lib/sarjom-core/search.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    const query = typeof req.query?.q === 'string' ? req.query.q.trim() : '';
    if (!query) return res.status(400).json({ success: false, error: 'Query parameter q is required.' });
    return res.status(200).json({ success: true, query, results: await searchSarjom(query) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Search failed.' });
  }
}
