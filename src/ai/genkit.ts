import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Log environment variables for debugging
console.log('Genkit initialization - Environment check:', {
  hasGoogleGenAI: !!process.env.GOOGLE_GENAI_API_KEY,
  keyPreview: process.env.GOOGLE_GENAI_API_KEY ?
    `${process.env.GOOGLE_GENAI_API_KEY.substring(0, 10)}...` : 'NOT SET'
});

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  })],
});
