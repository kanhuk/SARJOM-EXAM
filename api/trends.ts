import { redis } from '../lib/redis.js';
import {
  FALLBACK_TRENDS,
  rankTrends,
  type TrendItem
} from '../lib/trends.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed'
    });
  }

  try {
    let items: TrendItem[] = FALLBACK_TRENDS;

    if (redis) {
      const stored =
        await redis.get<TrendItem[]>('sarjom:trends');

      if (stored && Array.isArray(stored)) {
        items = stored;
      }
    }

    const ranked =
      rankTrends(items).slice(0, 12);

    return res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(),
      items: ranked,
      top: ranked.slice(0, 4),
      persistentStore: Boolean(redis)
    });

  } catch (error: any) {
    console.error(
      'Trend API error:',
      error
    );

    const ranked =
      rankTrends(FALLBACK_TRENDS);

    return res.status(200).json({
      success: true,
      updatedAt: new Date().toISOString(),
      items: ranked,
      top: ranked.slice(0, 4),
      persistentStore: false,
      warning: 'Fallback feed in use.'
    });
  }
}