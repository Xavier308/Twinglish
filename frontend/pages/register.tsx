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
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && isClient) {
      router.push('/');
    }
  }, [user, router, isClient]);

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
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
  
  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const renderPasswordStrength = () => {
    const strength = getPasswordStrength();
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    
    return (
      <div className="password-strength">
        <div className="strength-bars">
          {[1, 2, 3, 4].map((level) => (
            <div 
              key={level} 
              className={`strength-bar ${level <= strength ? `level-${strength}` : ''}`}
            ></div>
          ))}
        </div>
        {password && <span className={`strength-label level-${strength}`}>{labels[strength - 1] || ''}</span>}
      </div>
    );
  };

  if (user && isClient) {
    return <Layout title="Redirecting... | Twinglish"><div className="auth-message">Redirecting to home...</div></Layout>;
  }

  return (
    <Layout title="Register | Twinglish">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join Twinglish to practice your English</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  minLength={8}
                  required
                  disabled={isLoading}
                />
              </div>
              {renderPasswordStrength()}
              <ul className="password-requirements">
                <li className={password.length >= 8 ? 'met' : ''}>At least 8 characters</li>
                <li className={/[A-Z]/.test(password) ? 'met' : ''}>At least one uppercase letter</li>
                <li className={/[0-9]/.test(password) ? 'met' : ''}>At least one number</li>
              </ul>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
              </div>
              {password && confirmPassword && (
                <div className={`password-match ${password === confirmPassword ? 'match' : 'no-match'}`}>
                  {password === confirmPassword ? 'Passwords match ✓' : 'Passwords do not match ✗'}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || !username || !email || !password || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span> 
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link href="/login" className="login-link">
              Log In
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem 1rem;
        }
        
        .auth-card {
          background-color: var(--bg-card);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          width: 100%;
          max-width: 450px;
          border: 1px solid var(--border-color);
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .auth-header h1 {
          margin: 0 0 0.5rem;
          font-size: 1.75rem;
          color: var(--text-primary);
        }
        
        .auth-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 1rem;
        }
        
        .error-message {
          background-color: var(--error-light);
          color: var(--error-color);
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          border-left: 4px solid var(--error-color);
        }
        
        .auth-form {
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        
        .input-container {
          position: relative;
        }
        
        input {
          width: 100%;
          padding: 0.85rem 1rem;
          font-size: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-input);
          color: var(--text-primary);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        input::placeholder {
          color: var(--text-secondary);
          opacity: 0.7;
        }
        
        input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(29, 161, 242, 0.2);
        }
        
        input:disabled {
          background-color: var(--bg-container);
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .password-strength {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        
        .strength-bar {
          height: 6px;
          flex: 1;
          background-color: var(--bg-container);
          border-radius: 3px;
          transition: background-color 0.2s;
        }
        
        .strength-bar.level-1 {
          background-color: #e53935;
        }
        
        .strength-bar.level-2 {
          background-color: #ff9800;
        }
        
        .strength-bar.level-3 {
          background-color: #fdd835;
        }
        
        .strength-bar.level-4 {
          background-color: #4caf50;
        }
        
        .strength-label {
          font-size: 0.85rem;
          font-weight: 500;
          width: 50px;
        }
        
        .strength-label.level-1 {
          color: #e53935;
        }
        
        .strength-label.level-2 {
          color: #ff9800;
        }
        
        .strength-label.level-3 {
          color: #fdd835;
        }
        
        .strength-label.level-4 {
          color: #4caf50;
        }
        
        .password-requirements {
          margin: 0.75rem 0 0;
          padding-left: 1.25rem;
          list-style-type: none;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .password-requirements li {
          margin-bottom: 0.4rem;
          position: relative;
        }
        
        .password-requirements li:before {
          content: "○";
          position: absolute;
          left: -1.25rem;
          color: var(--text-secondary);
        }
        
        .password-requirements li.met {
          color: var(--success-color);
        }
        
        .password-requirements li.met:before {
          content: "✓";
          color: var(--success-color);
        }
        
        .password-match {
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }
        
        .password-match.match {
          color: var(--success-color);
        }
        
        .password-match.no-match {
          color: var(--error-color);
        }
        
        .submit-button {
          width: 100%;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.85rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          height: 48px;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .auth-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          text-align: center;
        }
        
        .auth-footer p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        
        .login-link {
          display: inline-block;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        
        .login-link:hover {
          background-color: var(--primary-light);
          text-decoration: underline;
        }
        
        .auth-message {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem;
            border-radius: 8px;
          }
          
          .auth-header h1 {
            font-size: 1.5rem;
          }
          
          input, .submit-button {
            padding: 0.75rem;
          }
          
          .password-requirements {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </Layout>
  );
}
