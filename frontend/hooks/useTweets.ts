// frontend/hooks/useTweets.ts (fixed)
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
      
      const response = await fetch(`${apiUrl}/api/v1/tweets/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Token': token // Sending in both formats to be safe
        }
      });
      
      if (!response.ok) {
        console.error("Failed to fetch tweets:", response.status, response.statusText);
        throw new Error('Failed to fetch tweets');
      }
      
      const data = await response.json();
      console.log("Tweets fetched successfully:", data);
      setTweets(data);
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a tweet
  const createTweet = async (originalText: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log("Creating tweet with token:", token ? "exists" : "does not exist");
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${apiUrl}/api/v1/tweets/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Token': token // Sending in both formats to be safe
        },
        body: JSON.stringify({ original_text: originalText })
      });
      
      if (!response.ok) {
        console.error("Failed to create tweet:", response.status, response.statusText);
        throw new Error('Failed to create tweet');
      }
      
      const newTweet = await response.json();
      console.log("Tweet created successfully:", newTweet);
      
      // Update tweets list
      setTweets(prevTweets => [newTweet, ...prevTweets]);
      
      return newTweet;
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  };

  // Debug token function
  const debugToken = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log("Debugging token:", token);
      
      if (!token) {
        console.error("No token found");
        return;
      }
      
      const response = await fetch(`${apiUrl}/api/v1/debug-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Token': token
        }
      });
      
      const data = await response.json();
      console.log("Token debug response:", data);
      
      return data;
    } catch (error) {
      console.error("Error debugging token:", error);
    }
  };

  return {
    tweets,
    isLoading,
    error,
    createTweet,
    refreshTweets: fetchTweets,
    debugToken
  };
}