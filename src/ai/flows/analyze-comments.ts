// src/ai/flows/analyze-comments.ts
'use server';
/**
 * @fileOverview A flow for analyzing YouTube comments to identify common themes and user questions.
 *
 * - analyzeComments - A function that analyzes comments and identifies themes.
 * - AnalyzeCommentsInput - The input type for the analyzeComments function.
 * - AnalyzeCommentsOutput - The return type for the analyzeComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommentsInputSchema = z.object({
  comments: z.array(z.string()).describe('An array of YouTube comments.'),
});
export type AnalyzeCommentsInput = z.infer<typeof AnalyzeCommentsInputSchema>;

const AnalyzeCommentsOutputSchema = z.object({
  themes: z.array(
    z.object({
      theme: z.string().describe('The main theme of the comments.'),
      questions: z.array(z.string()).describe('Example questions related to the theme.'),
      summary: z.string().describe('Summary of the theme and its questions.')
    })
  ).describe('A list of common themes and questions from the comments.'),
});
export type AnalyzeCommentsOutput = z.infer<typeof AnalyzeCommentsOutputSchema>;

export async function analyzeComments(input: AnalyzeCommentsInput): Promise<AnalyzeCommentsOutput> {
  return analyzeCommentsFlow(input);
}

const analyzeCommentsPrompt = ai.definePrompt({
  name: 'analyzeCommentsPrompt',
  input: {schema: AnalyzeCommentsInputSchema},
  output: {schema: AnalyzeCommentsOutputSchema},
  prompt: `Analyze the following YouTube comments to identify common themes and user questions. Group similar questions together and provide a summary of each theme.

Comments:
{{#each comments}}- {{{this}}}
{{/each}}

Return a JSON object with a list of themes, questions, and summaries. Focus on the viewers questions and concerns regarding the videos.`,
});

const analyzeCommentsFlow = ai.defineFlow(
  {
    name: 'analyzeCommentsFlow',
    inputSchema: AnalyzeCommentsInputSchema,
    outputSchema: AnalyzeCommentsOutputSchema,
  },
  async input => {
    const {output} = await analyzeCommentsPrompt(input);
    return output!;
  }
);
