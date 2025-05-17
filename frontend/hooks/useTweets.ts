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

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // Clear any localStorage cached tweets on first load
  useEffect(() => {
    // Clear all localStorage items that might contain tweets
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('tweet') || key.includes('mock'))) {
        localStorage.removeItem(key);
      }
    }
    
    // Also remove any other potential cache keys
    localStorage.removeItem('twinglish-tweets');
    localStorage.removeItem('tweets');
    localStorage.removeItem('offlineTweets');
    
    // Now fetch tweets from server
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
          // Add cache control to prevent browser caching
          cache: 'no-store',
          signal: AbortSignal.timeout(5000)
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
        console.warn('API fetch error:', fetchError);
        // Start with a completely empty array
        setTweets([]);
        setOfflineMode(true);
      }
    } catch (err) {
      console.error('Error in tweet handling:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Start with an empty array
      setTweets([]);
      setOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a tweet
  const createTweet = async (originalText: string) => {
    try {
      // For offline mode, create a basic tweet
      if (offlineMode) {
        console.log("Creating tweet in offline mode");
        
        // Create a simple tweet without corrections
        const newTweet: Tweet = {
          id: Math.max(0, ...tweets.map(t => t.id), 0) + 1,
          original_text: originalText,
          corrected_text: originalText, // No correction in offline mode
          explanation: "Unable to provide corrections in offline mode.",
          created_at: new Date().toISOString(),
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
          cache: 'no-store',
          signal: AbortSignal.timeout(5000)
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
        console.warn('API error when creating tweet:', fetchError);
        setOfflineMode(true);
        
        // Create a simple tweet
        const newTweet: Tweet = {
          id: Math.max(0, ...tweets.map(t => t.id), 0) + 1,
          original_text: originalText,
          corrected_text: originalText, // No correction
          explanation: "Connection error. Please try again when you're back online.",
          created_at: new Date().toISOString(),
          user_id: 1
        };
        
        // Update tweets list
        setTweets(prevTweets => [newTweet, ...prevTweets]);
        
        return newTweet;
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  };

  // Hard reset function to clear everything
  const hardReset = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Clear state
    setTweets([]);
    
    // Force a page refresh to clean any in-memory cache
    window.location.reload();
  };

  return {
    tweets,
    isLoading,
    error,
    createTweet,
    refreshTweets: fetchTweets,
    hardReset,
    offlineMode
  };
}
