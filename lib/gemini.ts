import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn(
    '[SARJOM] GEMINI_API_KEY is not configured.',
  );
}

export const ai = new GoogleGenAI({
  apiKey,
});

/*
 * Primary model used by SARJOM AI verification.
 *
 * Keep the model centralized here so the rest of SARJOM
 * does not need to know which Gemini model is being used.
 */
export const MODEL_NAME = 'gemini-3.5-flash';