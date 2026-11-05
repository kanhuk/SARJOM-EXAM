import { answerSarjomQuestion } from '../lib/sarjom-core/ai/answer.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }

  try {
    const body =
      req.method === 'POST' &&
      req.body &&
      typeof req.body === 'object'
        ? req.body
        : {};

    const queryQuestion =
      typeof req.query?.q === 'string'
        ? req.query.q
        : typeof req.query?.question === 'string'
          ? req.query.question
          : '';

    const question =
      typeof body.question === 'string'
        ? body.question
        : typeof body.query === 'string'
          ? body.query
          : queryQuestion;

    if (!question.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Question is required.',
      });
    }

    const result = await answerSarjomQuestion(question);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'SARJOM AI request failed.';

    const status =
      message.includes('GEMINI_API_KEY')
        ? 503
        : message.includes('Question is required')
          ? 400
          : 500;

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
}
