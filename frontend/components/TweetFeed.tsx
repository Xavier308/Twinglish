// frontend/components/TweetFeed.tsx
import { useTweets } from '../hooks/useTweets';
import TweetCard from './TweetCard';

export default function TweetFeed() {
  const { tweets, isLoading, error } = useTweets();

  if (isLoading) {
    return <div className="loading">Loading your tweets...</div>;
  }

  if (error) {
    return <div className="error">Failed to load tweets. Please try again.</div>;
  }

  if (tweets.length === 0) {
    return (
      <div className="empty-feed">
        <p>You haven't written any tweets yet. Try creating one above!</p>
      </div>
    );
  }

  return (
    <div className="tweet-feed">
      <h2>Your Feed</h2>
      
      <div className="tweets-list">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>

      <style jsx>{`
        .tweet-feed {
          margin-top: 2rem;
        }

        h2 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .loading, .error, .empty-feed {
          padding: 2rem;
          text-align: center;
          background-color: #f8f9fa;
          border-radius: 8px;
          color: #657786;
        }

        .error {
          color: #e0245e;
        }
      `}</style>
    </div>
  );
}
