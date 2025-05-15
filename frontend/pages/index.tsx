// frontend/pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TweetEditor from '../components/TweetEditor';
import TweetFeed from '../components/TweetFeed';
import { useAuth } from '../lib/auth';
import { Tweet } from '../hooks/useTweets';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [newTweet, setNewTweet] = useState<Tweet | null>(null);

  // Use useEffect to set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push('/login');
    }
  }, [loading, user, router, isClient]);

  const handleTweetCreated = (tweet: Tweet) => {
    setNewTweet(tweet);
    setTimeout(() => {
      setNewTweet(null);
    }, 5000); // Clear the notification after 5 seconds
  };

  if (loading || !isClient) {
    return (
      <Layout title="Loading... | Twinglish">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  // If not logged in and on the client side, we'll redirect (see useEffect above)
  if (!user) {
    return (
      <Layout title="Loading... | Twinglish">
        <div className="loading-container">
          <p>Redirecting to login...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Home | Twinglish">
      <div className="home-page">
        <div className="welcome-section">
          <h1>Welcome, {user.username}!</h1>
          <p className="subtitle">Practice your English by writing short posts and get instant feedback</p>
        </div>
        
        {newTweet && (
          <div className="success-notification">
            <div className="notification-icon">✓</div>
            <div className="notification-content">
              <p className="notification-title">Tweet Created Successfully!</p>
              <p className="notification-message">Your tweet has been corrected and added to your feed.</p>
            </div>
            <button 
              className="notification-close" 
              onClick={() => setNewTweet(null)}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        )}
        
        <TweetEditor onSuccess={handleTweetCreated} />
        <TweetFeed />
      </div>

      <style jsx>{`
        .home-page {
          padding: 0 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .welcome-section {
          margin-bottom: 2rem;
          text-align: center;
        }

        h1 {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-size: 1.75rem;
        }

        .subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1.1rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(29, 161, 242, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .success-notification {
          background-color: var(--success-light);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          border-left: 4px solid var(--success-color);
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .notification-icon {
          background-color: var(--success-color);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-title {
          margin: 0 0 0.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .notification-message {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
          margin-left: 1rem;
          flex-shrink: 0;
        }
        
        .notification-close:hover {
          color: var(--text-primary);
        }
        
        @media (max-width: 640px) {
          .welcome-section {
            text-align: left;
            margin-bottom: 1.5rem;
          }
          
          h1 {
            font-size: 1.5rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .success-notification {
            padding: 0.75rem;
          }
        }
      `}</style>
    </Layout>
  );
}
