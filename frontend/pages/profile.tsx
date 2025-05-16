// frontend/pages/profile.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../lib/auth';
import { useTweets } from '../hooks/useTweets';
import Link from 'next/link';


export default function Profile() {
  const { user, loading } = useAuth();
  const { tweets, isLoading: tweetsLoading } = useTweets();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || tweetsLoading) {
    return (
      <Layout title="Profile | Twinglish">
        <div className="loading">Loading profile data...</div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Calculate stats
  const totalTweets = tweets.length;
  const joinDate = new Date(); // This would come from user data in a real app
  const joinedDaysAgo = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // This is a placeholder - in a real app, we'd have more sophisticated streak calculation
  const currentStreak: number = 3; // Add type annotation to make it a number type

  return (
    <Layout title="Profile | Twinglish">
      <div className="profile-page">
        <div className="navigation-bar">
          <Link href="/" className="back-home-link">
            <span className="back-arrow">←</span> Home
          </Link>
        </div>

        <div className="profile-header">
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h1>{user.username}</h1>
            <p className="email">{user.email}</p>
            <p className="joined">Joined {joinedDaysAgo} days ago</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <div className="stat-value">{totalTweets}</div>
          </div>
          
          <div className="stat-card">
            <h3>Current Streak</h3>
            <div className="stat-value">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'} 🔥
            </div>
          </div>
          
          <div className="stat-card">
            <h3>Daily Goal</h3>
            <div className="stat-value">1/3</div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>

        <div className="achievement-section">
          <h2>Achievements</h2>
          <div className="achievements">
            <div className="achievement">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-info">
                <h4>First Post</h4>
                <p>Made your first post on Twinglish</p>
              </div>
            </div>
            <div className="achievement locked">
              <div className="achievement-icon">🔒</div>
              <div className="achievement-info">
                <h4>Weekly Warrior</h4>
                <p>Complete 7 days in a row</p>
              </div>
            </div>
            <div className="achievement locked">
              <div className="achievement-icon">🔒</div>
              <div className="achievement-info">
                <h4>Grammar Master</h4>
                <p>Write 10 posts with no grammatical errors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .profile-header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          color: var(--text-primary);
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          margin-right: 1.5rem;
        }

        .user-info h1 {
          margin: 0 0 0.5rem 0;
          color: var(--text-primary);
        }

        .email, .joined {
          margin: 0;
          color: var(--text-secondary);
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background-color: var(--bg-card);
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
          border: 1px solid var(--border-color);
        }

        .stat-card h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--text-primary);
        }

        .progress-bar {
          height: 8px;
          background-color: var(--bg-container);
          border-radius: 4px;
          margin-top: 1rem;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background-color: var(--primary-color);
        }

        .achievement-section h2 {
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .achievements {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .achievement {
          display: flex;
          align-items: center;
          background-color: var(--bg-card);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-color);
        }

        .achievement.locked {
          opacity: 0.7;
        }

        .achievement-icon {
          font-size: 2rem;
          margin-right: 1rem;
          width: 40px;
          text-align: center;
        }

        .achievement-info h4 {
          margin: 0 0 0.25rem 0;
          color: var(--text-primary);
        }

        .achievement-info p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
        }

        .navigation-bar {
          margin-bottom: 1.5rem;
        }
        
        .back-home-link {
          display: inline-flex;
          align-items: center;
          color: var(--primary-color);
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .back-home-link:hover {
          background-color: var(--primary-light);
        }
        
        .back-arrow {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        @media (max-width: 600px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .avatar {
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .stats-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}