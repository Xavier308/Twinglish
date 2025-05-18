// frontend/components/TweetFeed.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { useTweets, Tweet } from '../hooks/useTweets';
import TweetCard from './TweetCard';
import Pagination from './Pagination';
import PageSizeSelector from './PageSizeSelector';

export default function TweetFeed() {
  // Get tweet data and functions from the hook
  const { 
    tweets, 
    isLoading, 
    error, 
    refreshTweets, 
    offlineMode,
    currentPage,
    totalTweets,
    tweetsPerPage,
    totalPages,
    changePage,
    setTweetsPerPage,
    tweetCounts
  } = useTweets();
  
  // Component state
  const [filter, setFilter] = useState<'all' | 'perfect' | 'corrections'>('all');
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [filteredTotalPages, setFilteredTotalPages] = useState(1);
  
  // Using direct pageNumber state instead of depending on remote state
  const [pageNumber, setPageNumber] = useState(1);
  
  // Various refs to prevent re-renders and unwanted effects
  const initialLoad = useRef(true);
  const pageChangeBlocked = useRef(false);
  const lastPageChangeTime = useRef(0);
  
  // Update filtered tweets whenever tweets or filter changes
  useEffect(() => {
    let filtered = [...tweets];
    
    if (filter === 'perfect') {
      filtered = tweets.filter(t => t.original_text === t.corrected_text);
    } else if (filter === 'corrections') {
      filtered = tweets.filter(t => t.original_text !== t.corrected_text);
    }
    
    setFilteredTweets(filtered);
  }, [tweets, filter]);
  
  // Calculate filtered total pages whenever counts or page size changes
  useEffect(() => {
    let totalFilteredItems = 0;
    
    if (filter === 'all') {
      totalFilteredItems = tweetCounts.total;
    } else if (filter === 'perfect') {
      totalFilteredItems = tweetCounts.perfect;
    } else if (filter === 'corrections') {
      totalFilteredItems = tweetCounts.corrections;
    }
    
    const calculatedTotalPages = Math.max(1, Math.ceil(totalFilteredItems / tweetsPerPage));
    setFilteredTotalPages(calculatedTotalPages);
  }, [filter, tweetCounts, tweetsPerPage]);
  
  // Update remote page only when pageNumber changes, with debounce
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    
    if (pageChangeBlocked.current) {
      return;
    }
    
    // Skip if we're trying to change to the same page
    if (pageNumber === currentPage) {
      return;
    }
    
    // Debounce page changes to prevent race conditions
    const now = Date.now();
    if (now - lastPageChangeTime.current < 300) {
      return;
    }
    
    lastPageChangeTime.current = now;
    
    console.log(`Changing page from ${currentPage} to ${pageNumber}`);
    
    // Block further page changes until this one completes
    pageChangeBlocked.current = true;
    
    // Set a timeout to unblock if something goes wrong
    const timeout = setTimeout(() => {
      pageChangeBlocked.current = false;
    }, 5000);
    
    // Actually change the page
    changePage(pageNumber);
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    return () => clearTimeout(timeout);
  }, [pageNumber, changePage, currentPage]);
  
  // Sync currentPage back to pageNumber if needed
  useEffect(() => {
    if (currentPage !== pageNumber) {
      setPageNumber(currentPage);
    }
    
    // Unblock page changes when we get a successful update
    pageChangeBlocked.current = false;
  }, [currentPage, pageNumber]);
  
  // When filter changes, go back to page 1
  useEffect(() => {
    setPageNumber(1);
  }, [filter]);
  
  // Handle page change from pagination component
  const handlePageChange = useCallback((page: number) => {
    if (pageChangeBlocked.current) {
      console.log('Page change blocked, try again in a moment');
      return;
    }
    
    if (page === pageNumber) {
      console.log('Already on page', page);
      return;
    }
    
    console.log('Setting page number to', page);
    setPageNumber(page);
  }, [pageNumber]);
  
  // Periodically refresh tweets when not in offline mode
  useEffect(() => {
    if (offlineMode) return;
    
    const interval = setInterval(() => {
      refreshTweets();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [refreshTweets, offlineMode]);
  
  // Get the count of tweets for each category
  const counts = {
    all: tweetCounts.total,
    perfect: tweetCounts.perfect,
    corrections: tweetCounts.corrections
  };

  // Loading state component
  if (isLoading && initialLoad.current) {
    return (
      <div className="tweet-feed-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your posts...</p>
        </div>
        
        <style jsx>{`
          .tweet-feed-container {
            margin-top: 1rem;
          }
          .loading-state {
            padding: 2rem;
            text-align: center;
            background-color: var(--bg-card);
            border-radius: 12px;
            margin-bottom: 1rem;
            border: 1px solid var(--border-color);
          }
          .loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid rgba(29, 161, 242, 0.2);
            border-radius: 50%;
            border-top-color: var(--primary-color);
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .loading-state p {
            margin: 0;
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  // Error state component
  if (error) {
    return (
      <div className="tweet-feed-container">
        <div className="error-state">
          <div className="error-icon">!</div>
          <div className="error-content">
            <h3>Unable to load posts</h3>
            <p>There was a problem retrieving your posts. Please try again.</p>
            <button onClick={refreshTweets} className="retry-button">
              Retry
            </button>
          </div>
        </div>
        
        <style jsx>{`
          .tweet-feed-container {
            margin-top: 1rem;
          }
          .error-state {
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 2rem;
            text-align: center;
            background-color: var(--bg-card);
            border-radius: 12px;
            margin-bottom: 1rem;
            border: 1px solid var(--border-color);
          }
          .error-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--error-color);
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            font-size: 1.2rem;
          }
          .error-content h3 {
            margin: 0 0 0.5rem;
            color: var(--text-primary);
          }
          .error-content p {
            margin: 0 0 1rem;
            color: var(--text-secondary);
          }
          .retry-button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 0.6rem 1.2rem;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .retry-button:hover {
            background-color: var(--primary-hover);
          }
        `}</style>
      </div>
    );
  }

  // Main component content
  return (
    <div className="tweet-feed-container">
      <div className="feed-header">
        <h2>Your Practice Posts</h2>
        
        <div className="feed-controls">
          {offlineMode && (
            <div className="offline-badge">
              Offline Mode
            </div>
          )}
          
          {counts.all > 0 && (
            <PageSizeSelector 
              currentPageSize={tweetsPerPage}
              onPageSizeChange={setTweetsPerPage}
            />
          )}
        </div>
      </div>
      
      {counts.all > 0 && (
        <div className="filter-bar">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="count">{counts.all}</span>
          </button>
          <button 
            className={`filter-button ${filter === 'perfect' ? 'active' : ''}`}
            onClick={() => setFilter('perfect')}
          >
            Perfect <span className="count">{counts.perfect}</span>
          </button>
          <button 
            className={`filter-button ${filter === 'corrections' ? 'active' : ''}`}
            onClick={() => setFilter('corrections')}
          >
            With Corrections <span className="count">{counts.corrections}</span>
          </button>
        </div>
      )}
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {counts.all === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Write your first post in English above and get instant feedback!</p>
        </div>
      ) : filteredTweets.length === 0 && !isLoading ? (
        <div className="empty-filter-state">
          <p>No posts match the selected filter. Try a different filter.</p>
        </div>
      ) : (
        <div className="tweets-list">
          {filteredTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
      
      {/* Always render pagination if we have more than one page */}
      {counts.all > 0 && filteredTotalPages > 1 && (
        <div className="pagination-container">
          <Pagination 
            currentPage={pageNumber}
            totalPages={filteredTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      {/* Debug section removed */}

      <style jsx>{`
        .tweet-feed-container {
          margin-top: 1rem;
          position: relative;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        
        .feed-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        h2 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        
        .offline-badge {
          background-color: var(--bg-container);
          color: var(--text-secondary);
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid var(--border-color);
        }

        .filter-bar {
          display: flex;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
          scrollbar-width: none; /* Hide scrollbar for Firefox */
          -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
          -webkit-overflow-scrolling: touch;
        }

        .filter-bar::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari and Opera */
        }

        .filter-button {
          background: none;
          border: none;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          cursor: pointer;
          color: var(--text-secondary);
          position: relative;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .filter-button:hover {
          color: var(--text-primary);
        }

        .filter-button.active {
          color: var(--primary-color);
          font-weight: 600;
        }

        .filter-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary-color);
        }

        .count {
          display: inline-block;
          background-color: var(--bg-container);
          color: var(--text-secondary);
          border-radius: 10px;
          padding: 0.1rem 0.4rem;
          font-size: 0.8rem;
          margin-left: 0.4rem;
          font-weight: normal;
        }

        .filter-button.active .count {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }
        
        .loading-overlay {
          display: flex;
          justify-content: center;
          padding: 2rem 0;
        }
        
        .loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(29, 161, 242, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          padding: 3rem 2rem;
          text-align: center;
          background-color: var(--bg-card);
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem;
          color: var(--text-primary);
        }

        .empty-state p {
          margin: 0;
          color: var(--text-secondary);
          max-width: 300px;
          margin: 0 auto;
        }

        .empty-filter-state {
          padding: 1.5rem;
          text-align: center;
          background-color: var(--bg-card);
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .empty-filter-state p {
          margin: 0;
        }

        .tweets-list {
          margin-bottom: 1.5rem;
        }
        
        .pagination-container {
          margin-top: 1.5rem;
        }
        
        /* Debugging styles removed */

        @media (max-width: 640px) {
          .feed-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
          }
          
          .feed-controls {
            width: 100%;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          
          .filter-bar {
            margin-top: 0.5rem;
            width: 100%;
          }
          
          .filter-button {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
          }
          
          .loading-state,
          .error-state,
          .empty-state,
          .empty-filter-state {
            padding: 1.5rem 1rem;
            border-radius: 8px;
          }
        }
      `}</style>
    </div>
  );
}