'use server';

import {google} from 'googleapis';
import type {Video} from '@/lib/types';

// Initialize the YouTube API client with the API key
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function fetchYoutubeVideos({query}: {query: string}): Promise<Video[]> {
  if (!process.env.YOUTUBE_API_KEY) {
    const errorMessage = 'YOUTUBE_API_KEY is not set in the environment variables.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: 10,
      order: 'relevance',
      videoDefinition: 'high',
    });

    if (!searchResponse.data.items) {
      return [];
    }

    const videoPromises = searchResponse.data.items.map(async (item) => {
      const videoId = item.id?.videoId;
      if (!videoId) return null;

      let comments: string[] = [];
      try {
        console.log(`Fetching comments for video ${videoId}...`);
        const commentsResponse = await youtube.commentThreads.list({
          part: ['snippet'],
          videoId: videoId,
          maxResults: 20,
          order: 'relevance',
        });

        comments =
          commentsResponse.data.items
            ?.map(
              (commentThread) =>
                commentThread.snippet?.topLevelComment?.snippet?.textDisplay
            )
            .filter((text): text is string => !!text) || [];

        console.log(`Fetched ${comments.length} comments for video: ${item.snippet?.title}`);
        if (comments.length > 0) {
          console.log(`First comment preview: ${comments[0].substring(0, 100)}...`);
        }
      } catch (commentError: any) {
        console.warn(`Could not fetch comments for video ${videoId}:`, {
          error: commentError?.message,
          code: commentError?.code,
          errors: commentError?.errors
        });
      }
        
      return {
        id: videoId,
        title: item.snippet?.title || 'No title',
        channel: item.snippet?.channelTitle || 'No channel',
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ||
          'https://placehold.co/320x180.png',
        comments: comments,
        transcript: 'Transcript functionality is currently disabled.',
      };
    });

    const videos = (await Promise.all(videoPromises)).filter((v): v is Video => v !== null);
    
    return videos;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred while fetching videos.';
    console.error('Error fetching from YouTube API:', errorMessage);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch videos from YouTube: ${errorMessage}`);
  }
}
