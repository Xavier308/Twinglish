// frontend/hooks/useTweets.ts
import { useState, useEffect } from 'react';

export interface Tweet {
  id: number;
  original_text: string;
  corrected_text: string;
  explanation: string;
  created_at: string;
  user_id: number;
}

// Mock tweets data for offline development
const MOCK_TWEETS: Tweet[] = [
  {
    id: 1,
    original_text: "I thinked about going to the store yesterday but I forgeted.",
    corrected_text: "I thought about going to the store yesterday but I forgot.",
    explanation: "The past tense of 'think' is 'thought', not 'thinked'. Similarly, the past tense of 'forget' is 'forgot', not 'forgeted'.",
    created_at: new Date().toISOString(),
    user_id: 1
  },
  {
    id: 2,
    original_text: "I have been studing english for 2 years and im getting better everyday.",
    corrected_text: "I have been studying English for 2 years and I'm getting better every day.",
    explanation: "The correct spelling is 'studying' (not 'studing'), 'English' should be capitalized, and 'everyday' should be two words ('every day') in this context.",
    created_at: new Date().toISOString(),
    user_id: 1
  }
];

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // Fetch tweets on mount
  useEffect(() => {
    fetchTweets();
  }, []);

  // Function to fetch tweets
  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log("Fetching tweets with token:", token ? "exists" : "does not exist");
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      try {
        // Try to fetch from API
        const response = await fetch(`${apiUrl}/api/v1/tweets/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          // Short timeout to quickly fall back to mock data if API is unavailable
          signal: AbortSignal.timeout(3000)
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tweets');
        }
        
        let data = await response.json();
        
        // Sort tweets by created_at, newest first
        data.sort((a: Tweet, b: Tweet) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        console.log("Tweets fetched successfully:", data);
        setTweets(data);
        setOfflineMode(false);
      } catch (fetchError) {
        console.warn('Falling back to mock data:', fetchError);
        // Fall back to mock data
        // Sort MOCK_TWEETS by created_at, newest first
        const sortedMockTweets = [...MOCK_TWEETS].sort(
          (a: Tweet, b: Tweet) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTweets(sortedMockTweets);
        setOfflineMode(true);
      }
    } catch (err) {
      console.error('Error in tweet handling:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Fallback to mock data even in case of errors
      // Sort MOCK_TWEETS by created_at, newest first
      const sortedMockTweets = [...MOCK_TWEETS].sort(
        (a: Tweet, b: Tweet) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTweets(sortedMockTweets);
      setOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a tweet
  const createTweet = async (originalText: string) => {
    try {
      // For offline mode, create a mock tweet
      if (offlineMode) {
        console.log("Creating tweet in offline mode");
        
        // Create a mock correction (simulating AI)
        let correctedText = originalText;
        let explanation = "Great job! Your English is perfect in this tweet.";
        
        // Simple offline corrections for demo purposes
        if (originalText.includes("thinked")) {
          correctedText = originalText.replace("thinked", "thought");
          explanation = "The past tense of 'think' is 'thought', not 'thinked'.";
        } else if (originalText.includes("im ")) {
          correctedText = originalText.replace("im ", "I'm ");
          explanation = "The contraction of 'I am' is 'I'm', not 'im'.";
        } else if (originalText.includes("everyday")) {
          correctedText = originalText.replace("everyday", "every day");
          explanation = "'Everyday' (one word) is an adjective meaning 'ordinary'. You need 'every day' (two words) when referring to each day.";
        }
        
        // Create with consistent ISO 8601 format
        const newTweet: Tweet = {
          id: Math.max(0, ...tweets.map(t => t.id)) + 1,
          original_text: originalText,
          corrected_text: correctedText,
          explanation: explanation,
          created_at: new Date().toISOString(),  // This creates proper ISO 8601 format
          user_id: 1
        };
        
        // Update tweets list
        setTweets(prevTweets => [newTweet, ...prevTweets]);
        
        return newTweet;
      }
            
      // Online mode - try to call API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log("Creating tweet with token:", token ? "exists" : "does not exist");
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      try {
        const response = await fetch(`${apiUrl}/api/v1/tweets/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ original_text: originalText }),
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (!response.ok) {
          throw new Error('Failed to create tweet');
        }
        
        const newTweet = await response.json();
        console.log("Tweet created successfully:", newTweet);
        
        // Update tweets list - ensure it's added to the beginning
        setTweets(prevTweets => [newTweet, ...prevTweets]);
        
        return newTweet;
      } catch (fetchError) {
        console.warn('Falling back to mock creation:', fetchError);
        // Fall back to mock creation
        setOfflineMode(true);
        // Call the function again, which will now use offline mode
        return createTweet(originalText);
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  };

  return {
    tweets,
    isLoading,
    error,
    createTweet,
    refreshTweets: fetchTweets,
    offlineMode
  };
}
