// frontend/hooks/useTweets.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export interface Tweet {
  id: number;
  original_text: string;
  corrected_text: string;
  explanation: string;
  created_at: string;
  user_id: number;
}

export interface TweetCounts {
  total: number;
  perfect: number;
  corrections: number;
}

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tweetsPerPage, setTweetsPerPageState] = useState(() => {
    // Try to get the value from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem('tweetsPerPage');
      if (savedValue) {
        const parsed = parseInt(savedValue, 10);
        if ([5, 10, 20, 50].includes(parsed)) {
          return parsed;
        }
      }
    }
    return 10; // Default value
  });
  const [totalTweets, setTotalTweets] = useState(0);
  const [tweetCounts, setTweetCounts] = useState<TweetCounts>({ total: 0, perfect: 0, corrections: 0 });
  
  // Track active requests to handle concurrency
  const activeRequest = useRef<AbortController | null>(null);
  const isChangingPage = useRef(false);

  // Clear any localStorage cached tweets on first load
  useEffect(() => {
    // Clear all localStorage items that might contain tweets
    if (typeof window !== 'undefined') {
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
    }
    
    // Now fetch tweets from server
    fetchTweets();
    fetchTweetCounts();
  }, []);

  // Function to fetch tweet counts
  const fetchTweetCounts = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      try {
        const controller = new AbortController();
        
        const response = await fetch(`${apiUrl}/api/v1/tweets/count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          cache: 'no-store',
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tweet counts');
        }
        
        const counts = await response.json();
        setTweetCounts(counts);
        setTotalTweets(counts.total);
        
        console.log('Tweet counts fetched:', counts);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        console.warn('API fetch error for counts:', fetchError);
        setOfflineMode(true);
      }
    } catch (err) {
      console.error('Error fetching tweet counts:', err);
    }
  }, []);

  // Function to fetch tweets with pagination and better concurrency handling
  const fetchTweets = useCallback(async (page: number = 1) => {
    // Cancel any active request
    if (activeRequest.current) {
      activeRequest.current.abort();
      activeRequest.current = null;
    }
    
    // Set a flag indicating we're changing pages
    isChangingPage.current = true;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log(`Fetching tweets for page ${page}, tweets per page: ${tweetsPerPage}`);
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      try {
        // Create a new abort controller
        const controller = new AbortController();
        activeRequest.current = controller;
        
        // Calculate skip based on page and limit
        const skip = (page - 1) * tweetsPerPage;
        
        // Try to fetch from API with pagination parameters
        const response = await fetch(`${apiUrl}/api/v1/tweets/?skip=${skip}&limit=${tweetsPerPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          cache: 'no-store',
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tweets');
        }
        
        let data = await response.json();
        
        console.log(`Fetched ${data.length} tweets for page ${page}`);
        
        // Only update state if this request is still active
        if (activeRequest.current === controller) {
          setTweets(data);
          setCurrentPage(page);
          setOfflineMode(false);
          activeRequest.current = null;
        }
      } catch (fetchError) {
        // Ignore aborted requests
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        console.warn('API fetch error:', fetchError);
        setTweets([]);
        setOfflineMode(true);
      }
    } catch (err) {
      console.error('Error in tweet handling:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setTweets([]);
      setOfflineMode(true);
    } finally {
      setIsLoading(false);
      isChangingPage.current = false;
    }
    
    return true;
  }, [tweetsPerPage]);

  // Change page function with better synchronization
  const changePage = useCallback((page: number) => {
    // If we're already changing pages, don't trigger another change
    if (isChangingPage.current) {
      console.log('Page change in progress, ignoring request');
      return;
    }
    
    console.log('Changing page to:', page);
    
    if (page < 1) page = 1;
    
    // Calculate the max pages based on total tweets and tweets per page
    const maxPages = Math.max(1, Math.ceil(totalTweets / tweetsPerPage));
    
    if (page > maxPages) page = maxPages;
    
    console.log('Final page to fetch:', page, 'maxPages:', maxPages);
    
    // Only fetch if the page is different
    if (page !== currentPage) {
      fetchTweets(page);
    }
  }, [totalTweets, tweetsPerPage, currentPage, fetchTweets]);

  // Function to set tweets per page
  const setTweetsPerPage = useCallback((count: number) => {
    // Valid values: 5, 10, 20, 50
    if (![5, 10, 20, 50].includes(count)) {
      count = 10; // Default to 10 if invalid
    }
    
    console.log('Setting tweets per page to:', count);
    
    // Store the value in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tweetsPerPage', count.toString());
    }
    
    // Update the state
    setTweetsPerPageState(count);
    
    // Recalculate current page to keep the view consistent
    const newTotalPages = Math.max(1, Math.ceil(totalTweets / count));
    const newPage = Math.min(currentPage, newTotalPages);
    
    console.log('After changing items per page, new page:', newPage, 'of', newTotalPages);
    
    // Cancel any active request
    if (activeRequest.current) {
      activeRequest.current.abort();
      activeRequest.current = null;
    }
    
    // Fetch tweets with new pagination
    fetchTweets(newPage);
  }, [totalTweets, currentPage, fetchTweets]);

  // Function to create a tweet
  const createTweet = useCallback(async (originalText: string) => {
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
        
        // Update tweets list immediately - don't check page
        setTweets(prevTweets => [newTweet, ...prevTweets]);
        
        // Update counts
        setTotalTweets(prev => prev + 1);
        setTweetCounts(prev => ({
          ...prev,
          total: prev.total + 1,
          perfect: prev.perfect + 1
        }));
        
        return newTweet;
      }
            
      // Online mode - try to call API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('authToken');
      
      console.log("Creating tweet with token:", token ? "exists" : "does not exist");
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Set loading state to true while creating tweet
      setIsLoading(true);
      
      try {
        const response = await fetch(`${apiUrl}/api/v1/tweets/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ original_text: originalText }),
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to create tweet');
        }
        
        const newTweet = await response.json();
        console.log("Tweet created successfully:", newTweet);
        
        // Always update tweets list with new tweet at the top, regardless of current page
        setTweets(prevTweets => [newTweet, ...prevTweets]);
        
        // If not on first page, go to first page to show the new tweet
        if (currentPage !== 1) {
          changePage(1);
        }
        
        // Update counts
        fetchTweetCounts();
        
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
        
        // Update tweets list immediately - don't check page
        setTweets(prevTweets => [newTweet, ...prevTweets]);
        
        // Update counts
        setTotalTweets(prev => prev + 1);
        setTweetCounts(prev => ({
          ...prev,
          total: prev.total + 1,
          perfect: prev.perfect + 1
        }));
        
        return newTweet;
      } finally {
        // Reset loading state
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  }, [tweets, currentPage, offlineMode, fetchTweetCounts, changePage]);

  // Function to refresh current page of tweets
  const refreshTweets = useCallback(() => {
    fetchTweets(currentPage);
  }, [fetchTweets, currentPage]);

  // Hard reset function to clear everything
  const hardReset = useCallback(() => {
    // Clear all localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    
    // Clear state
    setTweets([]);
    setCurrentPage(1);
    setTotalTweets(0);
    setTweetCounts({ total: 0, perfect: 0, corrections: 0 });
    
    // Force a page refresh to clean any in-memory cache
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return {
    tweets,
    isLoading,
    error,
    createTweet,
    refreshTweets,
    hardReset,
    offlineMode,
    // Pagination related
    currentPage,
    totalTweets,
    tweetsPerPage,
    totalPages: Math.max(1, Math.ceil(totalTweets / tweetsPerPage)),
    changePage,
    setTweetsPerPage,
    tweetCounts
  };
}