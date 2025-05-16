// frontend/components/TweetFeed.tsx
import { useEffect, useState } from 'react';
import { useTweets, Tweet } from '../hooks/useTweets';
import TweetCard from './TweetCard';

export default function TweetFeed() {
  const { tweets, isLoading, error, refreshTweets, offlineMode } = useTweets();
  const [filter, setFilter] = useState<'all' | 'perfect' | 'corrections'>('all');
  
  // Create a sorted copy of tweets, newest first
  const sortedTweets = [...tweets].sort((a: Tweet, b: Tweet) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Periodically refresh tweets when not in offline mode
  useEffect(() => {
    if (offlineMode) return;
    
    const interval = setInterval(() => {
      refreshTweets();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [refreshTweets, offlineMode]);

  // Filter tweets based on selected filter - using sortedTweets
  const filteredTweets = () => {
    if (filter === 'all') return sortedTweets;
    if (filter === 'perfect') return sortedTweets.filter(t => t.original_text === t.corrected_text);
    return sortedTweets.filter(t => t.original_text !== t.corrected_text);
  };

  // Get the count of tweets for each filter - using sortedTweets
  const getCounts = () => {
    const perfectCount = sortedTweets.filter(t => t.original_text === t.corrected_text).length;
    const correctionsCount = sortedTweets.filter(t => t.original_text !== t.corrected_text).length;
    
    return {
      all: sortedTweets.length,
      perfect: perfectCount,
      corrections: correctionsCount
    };
  };

  const counts = getCounts();

  if (isLoading) {
    return (
      <div className="tweet-feed-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your posts...</p>
        </div>
      </div>
    );
  }

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
      </div>
    );
  }

  return (
    <div className="tweet-feed-container">
      <div className="feed-header">
        <h2>Your Practice Posts</h2>
        
        {offlineMode && (
          <div className="offline-badge">
            Offline Mode
          </div>
        )}
      </div>
      
      {sortedTweets.length > 0 && (
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
      
      {sortedTweets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Write your first post in English above and get instant feedback!</p>
        </div>
      ) : filteredTweets().length === 0 ? (
        <div className="empty-filter-state">
          <p>No posts match the selected filter. Try a different filter.</p>
        </div>
      ) : (
        <div className="tweets-list">
          {filteredTweets().map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}

      <style jsx>{`
        .tweet-feed-container {
          margin-top: 1rem;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
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

        .loading-state,
        .error-state,
        .empty-state,
        .empty-filter-state {
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

        .error-state {
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 2rem;
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

        .empty-state {
          padding: 3rem 2rem;
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
          color: var(--text-secondary);
        }

        .empty-filter-state p {
          margin: 0;
        }

        .tweets-list {
          margin-bottom: 1rem;
        }

        @media (max-width: 640px) {
          .feed-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 1rem;
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
