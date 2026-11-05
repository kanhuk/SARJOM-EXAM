import { assertAdminToken } from '../../lib/sarjom-core/admin.js';
import { hasPersistentSarjomStore, sarjomRepository } from '../../lib/sarjom-core/repository.js';

function token(req: any): string | undefined {
  const header = req.headers?.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) return header.slice(7);
  return typeof req.headers?.['x-sarjom-admin-token'] === 'string' ? req.headers['x-sarjom-admin-token'] : undefined;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    assertAdminToken(token(req));
    const [jobs, tickets, changes] = await Promise.all([
      sarjomRepository.listJobs(), sarjomRepository.listTickets(), sarjomRepository.listChanges(),
    ]);
    return res.status(200).json({ success: true, persistentStore: hasPersistentSarjomStore, counts: { jobs: jobs.length, tickets: tickets.length, changes: changes.length }, now: new Date().toISOString() });
  } catch (error) {
    const status = error instanceof Error && error.message.startsWith('Unauthorized') ? 401 : 500;
    return res.status(status).json({ success: false, error: error instanceof Error ? error.message : 'Health check failed.' });
  }
}
