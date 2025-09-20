'use server';

/**
 * @fileOverview This flow analyzes user comments and generates video ideas.
 *
 * - generateVideoIdeas - A function that takes a list of comments and generates video ideas.
 * - GenerateVideoIdeasInput - The input type for the generateVideoIdeas function.
 * - GenerateVideoIdeasOutput - The return type for the generateVideoIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoIdeasInputSchema = z.object({
  comments: z.array(z.string()).describe('List of user comments from YouTube videos.'),
});
export type GenerateVideoIdeasInput = z.infer<typeof GenerateVideoIdeasInputSchema>;

const GenerateVideoIdeasOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the video idea.'),
    summary: z
      .string()
      .describe(
        'A short summary of the main viewer question/concern that the video will address.'
      ),
  })
);
export type GenerateVideoIdeasOutput = z.infer<typeof GenerateVideoIdeasOutputSchema>;

export async function generateVideoIdeas(input: GenerateVideoIdeasInput): Promise<GenerateVideoIdeasOutput> {
  return generateVideoIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoIdeasPrompt',
  input: {schema: GenerateVideoIdeasInputSchema},
  output: {schema: GenerateVideoIdeasOutputSchema},
  prompt: `You are a YouTube content strategist expert. Analyze the following comments from YouTube videos and suggest new video ideas to address common user questions and concerns.

Comments:
{{#each comments}}{{{this}}}
{{/each}}

Suggest video ideas that directly address viewer questions and concerns expressed in the comments. For each video idea, provide a title and a short summary of the main viewer question/concern that the video will address.

Output must be an array of JSON objects.
`,
});

const generateVideoIdeasFlow = ai.defineFlow(
  {
    name: 'generateVideoIdeasFlow',
    inputSchema: GenerateVideoIdeasInputSchema,
    outputSchema: GenerateVideoIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
