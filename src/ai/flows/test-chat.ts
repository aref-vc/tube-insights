'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function testSimpleChat(prompt: string): Promise<string> {
  console.log('=== TEST SIMPLE CHAT ===');
  console.log('Testing with prompt:', prompt);
  console.log('API Key check:', !!process.env.GOOGLE_GENAI_API_KEY);

  try {
    // Test with a simple prompt - no Handlebars, no complex template
    const testPrompt = ai.definePrompt({
      name: 'testPrompt',
      model: 'googleai/gemini-1.5-flash',
      input: {
        schema: z.object({
          question: z.string(),
        }),
      },
      prompt: `Answer this question: {{question}}`,
    });

    console.log('Calling test prompt...');
    const result = await testPrompt({ question: prompt });

    console.log('Test result:', {
      hasResult: !!result,
      hasOutput: !!result?.output,
      output: result?.output,
    });

    return result?.output || 'No response from test';
  } catch (error: any) {
    console.error('TEST ERROR:', {
      message: error?.message,
      code: error?.code,
      details: JSON.stringify(error, null, 2)
    });
    return `Test failed: ${error?.message || 'Unknown error'}`;
  }
}