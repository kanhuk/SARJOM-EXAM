import { monitorOfficialSources } from '../../lib/sarjom-core/source-monitor.js';
import { refreshAllStoredJobs } from '../../lib/sarjom-core/auto-engine.js';
import { hasPersistentSarjomStore } from '../../lib/sarjom-core/repository.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  const expected = process.env.CRON_SECRET;
  const authorization = req.headers?.authorization || '';
  if (expected && authorization !== `Bearer ${expected}`) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    const sourceMonitoring = await monitorOfficialSources();
    const lifecycle = await refreshAllStoredJobs();
    return res.status(200).json({ success: true, persistentStore: hasPersistentSarjomStore, sourceMonitoring, lifecycle, ranAt: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Auto update failed.' });
  }
}
