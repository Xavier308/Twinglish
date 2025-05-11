// frontend/pages/login.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../lib/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If user is already logged in, redirect to home
  useEffect(() => {
    console.log("Login page - Auth state:", { user, loading, isClient });
    
    if (user && isClient && !loading) {
      console.log("Already logged in, redirecting to home");
      router.push('/');
    }
  }, [user, router, loading, isClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Attempting login from form submit");
      await login(username, password);
      // Redirect happens automatically in the auth context
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show the login form if we're already logged in and on the client side
  if (user && isClient && !loading) {
    return <Layout title="Redirecting... | Twinglish"><div>Redirecting to home...</div></Layout>;
  }

  return (
    <Layout title="Login | Twinglish">
      <div className="auth-page">
        <div className="auth-card">
          <h1>Login</h1>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="auth-link">
            Don't have an account? <Link href="/register">Register</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }
        
        .auth-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }
        
        h1 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .error {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.5rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #e1e8ed;
          border-radius: 4px;
        }
        
        input:focus {
          outline: none;
          border-color: #1da1f2;
        }
        
        button {
          width: 100%;
          background-color: #1da1f2;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 1rem;
        }
        
        button:hover:not(:disabled) {
          background-color: #1a91da;
        }
        
        button:disabled {
          background-color: #9ad0f9;
          cursor: not-allowed;
        }
        
        .auth-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }
        
        .auth-link a {
          color: #1da1f2;
          text-decoration: underline;
        }
      `}</style>
    </Layout>
  );
}