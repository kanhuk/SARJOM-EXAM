import { assertAdminToken } from '../../lib/sarjom-core/admin.js';
import { sarjomRepository } from '../../lib/sarjom-core/repository.js';

function token(req: any): string | undefined {
  const header = req.headers?.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) return header.slice(7);
  return typeof req.headers?.['x-sarjom-admin-token'] === 'string' ? req.headers['x-sarjom-admin-token'] : undefined;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-SARJOM-Admin-Token');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    assertAdminToken(token(req));
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return res.status(200).json({ success: true, tickets: await sarjomRepository.listTickets(), changes: await sarjomRepository.listChanges() });
  } catch (error) {
    const status = error instanceof Error && error.message.startsWith('Unauthorized') ? 401 : 500;
    return res.status(status).json({ success: false, error: error instanceof Error ? error.message : 'Admin request failed.' });
  }
}
