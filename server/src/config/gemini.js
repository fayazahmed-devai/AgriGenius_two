import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini calls will fail until configured.');
}

export const ai = new GoogleGenAI({
  apiKey: apiKey || 'dummy-api-key',
});

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Helper to convert an uploaded Multer memory buffer to an inline part for multimodal analysis
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 * @returns {object}
 */
export function bufferToInlinePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

