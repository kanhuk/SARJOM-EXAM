import { createContactTicket } from '../lib/sarjom-core/support.js';

const allowedCategories = new Set(['incorrect-information','job-question','scheme-question','scholarship-question','technical','suggestion','other']);

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const category = typeof body.category === 'string' ? body.category : 'other';
    if (!message) return res.status(400).json({ success: false, error: 'Message is required.' });
    if (message.length > 5000) return res.status(400).json({ success: false, error: 'Message is too long.' });
    if (!allowedCategories.has(category)) return res.status(400).json({ success: false, error: 'Invalid category.' });

    const ticket = await createContactTicket({
      category: category as any,
      priority: category === 'incorrect-information' ? 'high' : 'normal',
      name: typeof body.name === 'string' ? body.name.trim().slice(0, 120) : undefined,
      email: typeof body.email === 'string' ? body.email.trim().slice(0, 200) : undefined,
      mobile: typeof body.mobile === 'string' ? body.mobile.trim().slice(0, 40) : undefined,
      message,
      relatedJobId: typeof body.relatedJobId === 'string' ? body.relatedJobId : undefined,
    });

    return res.status(201).json({ success: true, ticketId: ticket.id, message: 'Your request has been sent to SARJOM Admin.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Failed to create ticket.' });
  }
}
