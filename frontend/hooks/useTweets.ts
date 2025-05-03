// frontend/hooks/useTweets.ts
import useSWR from 'swr';
import { fetchWithAuth } from '../lib/api';

export interface Tweet {
  id: number;
  original_text: string;
  corrected_text: string;
  explanation: string;
  created_at: string;
  user_id: number;
}

export function useTweets() {
  const { data, error, mutate } = useSWR<Tweet[]>('/api/v1/tweets/', async (url) => {
    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error('Failed to fetch tweets');
    return res.json();
  });

  const isLoading = !data && !error;

  const createTweet = async (originalText: string) => {
    try {
      const res = await fetchWithAuth('/api/v1/tweets/', {
        method: 'POST',
        body: JSON.stringify({ original_text: originalText })
      });

      if (!res.ok) throw new Error('Failed to create tweet');
      
      const newTweet = await res.json();
      mutate();
      return newTweet;
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  };

  return {
    tweets: data || [],
    isLoading,
    error,
    createTweet,
    mutate
  };
}
