import { ai, GEMINI_MODEL, bufferToInlinePart } from '../config/gemini.js';
import { AGRO_SYSTEM_PROMPT } from '../prompts/agricultural.prompts.js';

/**
 * Sanitizes and parses raw text response into JSON
 * Handles models returning ```json ``` fences or raw JSON
 * @param {string} text 
 * @returns {object}
 */
export function cleanAndParseJSON(text) {
  if (!text) {
    throw new Error('Received empty response from AI model.');
  }

  let cleaned = text.trim();
  // Strip Markdown JSON codeblocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt to locate first { and last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw new Error(`Failed to parse AI output into JSON: ${err.message}. Raw output snippet: ${cleaned.substring(0, 150)}...`);
  }
}

/**
 * Sends a prompt to Gemini with system instruction and optional multimodal image part
 * Validates the output against a provided Zod schema
 * 
 * @param {string} promptText 
 * @param {import('zod').ZodSchema} responseSchema 
 * @param {object|null} fileAttachment - Optional { buffer, mimeType }
 * @returns {Promise<object>} Parsed & validated object
 */
export async function generateAgroAdvisory(promptText, responseSchema, fileAttachment = null) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please set it in server/.env');
  }

  const parts = [];

  // If an image is attached, prepend the inline image part
  if (fileAttachment && fileAttachment.buffer) {
    parts.push(bufferToInlinePart(fileAttachment.buffer, fileAttachment.mimeType));
  }

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: parts,
      config: {
        systemInstruction: AGRO_SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for high consistency and factual grounding
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    const parsedData = cleanAndParseJSON(responseText);

    // Validate using Zod schema
    const validationResult = responseSchema.safeParse(parsedData);
    if (!validationResult.success) {
      console.warn('AI Output failed Zod validation schema:', validationResult.error.errors);
      // Return parsed data if partial matches, but log warning
      return parsedData;
    }

    return validationResult.data;
  } catch (error) {
    console.error('Error during Gemini API call:', error);
    throw new Error(`Gemini Advisory Generation Failed: ${error.message}`);
  }
}

