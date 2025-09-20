'use server';
/**
 * @fileOverview A flow for chatting about YouTube video content.
 *
 * - chatWithContext - A function that takes a prompt and context and returns a response.
 * - ChatWithContextInput - The input type for the chatWithContext function.
 * - ChatWithContextOutput - The return type for the chatWithContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  channel: z.string(),
  thumbnailUrl: z.string(),
  comments: z.array(z.string()),
  transcript: z.string().optional(),
});

const ChatWithContextInputSchema = z.object({
  prompt: z.string().describe("The user's message or question."),
  videos: z.array(VideoSchema).describe('The video content to use as context.'),
});
export type ChatWithContextInput = z.infer<typeof ChatWithContextInputSchema>;

export type ChatWithContextOutput = string;

export async function chatWithContext(input: ChatWithContextInput): Promise<ChatWithContextOutput> {
  return chatWithContextFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatWithContextInputSchema},
  model: 'googleai/gemini-1.5-flash',
  system: `You are an expert YouTube content strategist. Your goal is to help creators analyze their audience feedback and come up with new ideas.

You will be given a user's question and the context from the titles, and comments of several YouTube videos.

Your task is to answer the user's question based on the provided context. Synthesize information from the video content and comments to identify patterns, common questions, and viewer sentiment.

If you receive videos with comments, analyze them thoroughly. If no comments are available, work with the video titles provided.`,
  prompt: `Context from videos:
---
{{#each videos}}
Video Title: {{{this.title}}}

Comments:
{{#each this.comments}}
- {{{this}}}
{{/each}}
---
{{/each}}

User's Question:
"{{{prompt}}}"

Please provide a helpful and detailed answer based on the video titles and comments above.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const chatWithContextFlow = ai.defineFlow(
  {
    name: 'chatWithContextFlow',
    inputSchema: ChatWithContextInputSchema,
  },
  async input => {
    console.log('=== CHAT FLOW DEBUG START ===');
    console.log('1. Input received:', {
      prompt: input.prompt,
      videosCount: input.videos.length,
      totalComments: input.videos.reduce((sum, v) => sum + v.comments.length, 0)
    });

    // Log first video details
    if (input.videos.length > 0) {
      console.log('2. First video details:', {
        title: input.videos[0].title,
        channel: input.videos[0].channel,
        commentsCount: input.videos[0].comments.length,
        firstThreeComments: input.videos[0].comments.slice(0, 3),
        hasTranscript: !!input.videos[0].transcript
      });
    }

    // Build the actual prompt to see what's being sent
    const debugPrompt = `Context from videos:
---
${input.videos.map(v => `Video Title: ${v.title}

Comments:
${v.comments.map(c => `- ${c}`).join('\n')}
---`).join('\n')}

User's Question:
"${input.prompt}"

Please provide a helpful and detailed answer based on the video titles and comments above.`;

    console.log('3. Actual prompt being sent (first 500 chars):', debugPrompt.substring(0, 500));
    console.log('4. Total prompt length:', debugPrompt.length);

    try {
      console.log('5. Calling chatPrompt...');
      const result = await chatPrompt(input);

      console.log('6. Chat prompt result:', {
        hasResult: !!result,
        hasOutput: !!result?.output,
        outputLength: result?.output?.length || 0,
        outputPreview: result?.output?.substring(0, 200) || 'NO OUTPUT'
      });

      if (!result?.output) {
        console.error('7. WARNING: No output from chatPrompt, returning fallback message');
        console.error('   Full result object:', JSON.stringify(result, null, 2));
      }

      console.log('=== CHAT FLOW DEBUG END ===');
      return result?.output ?? "I'm sorry, I couldn't find an answer based on the provided videos.";
    } catch (error: any) {
      console.error('=== CHAT FLOW ERROR ===');
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        details: error?.details
      });
      console.error('Full error:', error);
      console.error('=== CHAT FLOW ERROR END ===');
      throw error;
    }
  }
);
