// frontend/pages/register.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../lib/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(username, email, password);
      // Redirect happens automatically in the auth context
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Register | Twinglish">
      <div className="auth-page">
        <div className="auth-card">
          <h1>Create Account</h1>
          
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
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                minLength={8}
                required
              />
              <small>At least 8 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !username || !email || !password || !confirmPassword}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <p className="auth-link">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 2rem 0;
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
        
        small {
          display: block;
          margin-top: 0.25rem;
          color: #657786;
          font-size: 0.8rem;
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
