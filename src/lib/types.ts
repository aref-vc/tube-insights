import type { AnalyzeCommentsOutput } from "@/ai/flows/analyze-comments";
import type { GenerateVideoIdeasOutput } from "@/ai/flows/generate-video-ideas";

export interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  comments: string[];
  transcript?: string;
}

export interface AnalysisResult {
  analysis: AnalyzeCommentsOutput | null;
  ideas: GenerateVideoIdeasOutput | null;
}

export interface Project {
    id: string;
    name: string;
    videos: Video[];
    chatHistory: { role: 'user' | 'model'; content: string }[];
    notes: string;
}
