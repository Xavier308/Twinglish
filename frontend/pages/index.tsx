// frontend/pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TweetEditor from '../components/TweetEditor';
import TweetFeed from '../components/TweetFeed';
import { useAuth } from '../lib/auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("Home page - Auth state:", { user, loading });
    
    if (!loading && !user && isClient) {
      console.log("Not authenticated, redirecting to login");
      router.push('/login');
    }
  }, [loading, user, router, isClient]);

  if (loading) {
    return (
      <Layout title="Loading... | Twinglish">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  // Don't render anything on the server if authentication is required
  // This helps prevent hydration issues
  if (!isClient) {
    return <Layout title="Loading... | Twinglish"><div>Loading...</div></Layout>;
  }

  // If not logged in and on the client side, we'll redirect (see useEffect above)
  if (!user) {
    return <Layout title="Loading... | Twinglish"><div>Redirecting to login...</div></Layout>;
  }

  return (
    <Layout title="Home | Twinglish">
      <div className="home-page">
        <h1>Welcome, {user.username}!</h1>
        <p className="subtitle">Practice your English by writing short posts and get instant feedback</p>
        
        <TweetEditor />
        <TweetFeed />
      </div>

      <style jsx>{`
        .home-page {
          padding: 0 1rem;
        }

        h1 {
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #657786;
          margin-bottom: 2rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </Layout>
  );
}