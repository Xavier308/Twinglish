// frontend/pages/index.tsx (update this file)
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import TweetEditor from '../components/TweetEditor';
import TweetFeed from '../components/TweetFeed';
import { useAuth } from '../lib/auth';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Layout title="Loading... | Twinglish">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
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
