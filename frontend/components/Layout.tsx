// frontend/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'Twinglish' }: LayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Check if user prefers dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        setDarkMode(savedMode === 'true');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(newMode));
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  const isHomePage = router.pathname === '/';
  const isLoginPage = router.pathname === '/login';
  const isRegisterPage = router.pathname === '/register';
  const isAuthPage = isLoginPage || isRegisterPage;

  return (
    <div className={`layout ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Improve your English with Twinglish" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={isAuthPage ? 'header-auth' : ''}>
        <div className="container header-container">
          <div className="logo-container">
            <Link href="/" className="logo">
              <span className="logo-text">Twinglish</span>
            </Link>
          </div>
          
          {!isAuthPage && (
            <>
              <button 
                className="mobile-menu-button" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
              </button>
              
              <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
                {user ? (
                  <div className="auth-links">
                    {/* Theme toggle first */}
                    <button 
                      onClick={toggleDarkMode} 
                      className="theme-toggle" 
                      aria-label="Toggle dark mode"
                      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        width="20" 
                        height="20" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        {darkMode ? (
                          // Sun icon for dark mode
                          <>
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                          </>
                        ) : (
                          // Moon icon for light mode
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        )}
                      </svg>
                    </button>
                    
                    {/* Profile link now second */}
                    <Link 
                      href="/profile" 
                      className="nav-link profile-link" 
                      title={`Profile: ${user.username}`}
                    >
                      <span className="avatar">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          width="20" 
                          height="20" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </span>
                    </Link>
                    
                    {/* Logout button last */}
                    <button 
                      onClick={logout} 
                      className="btn-link logout-btn"
                      title="Logout"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="auth-links">
                    <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle dark mode">
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                    <Link href="/login" className="nav-link">
                      Login
                    </Link>
                    <Link href="/register" className="nav-link register-link">
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </>
          )}
        </div>
      </header>
      <style jsx global>{`
        .logo-container {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative !important;
          z-index: 1000 !important;
        }
        
        .logo, .logo-text {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
          color: white !important;
          font-size: 1.9rem !important;   /* Just slightly larger */
          font-weight: 700 !important;    /* Keep the original weight */
          letter-spacing: 0.5px !important;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      <main className={`${isAuthPage ? 'auth-main' : 'container'}`}>
        {children}
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Twinglish. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: background-color 0.3s, color 0.3s;
        }

        .light-mode {
          --bg-main: #ffffff;
          --bg-card: #ffffff;
          --bg-container: #f8f9fa;
          --bg-input: #ffffff;
          --border-color: #e1e8ed;
          --text-primary: #14171a;
          --text-secondary: #657786;
          --text-header: #ffffff;
          --primary-color: #1da1f2;
          --primary-hover: #1a91da;
          --primary-light: #e8f5fe;
          --success-color: #4caf50;
          --success-light: #e8f5e9;
          --error-color: #e0245e;
          --error-light: #ffebee;
        }

        .dark-mode {
          --bg-main: #15202b;
          --bg-card: #1e2732;
          --bg-container: #192734;
          --bg-input: #253341;
          --border-color: #38444d;
          --text-primary: #ffffff;
          --text-secondary: #8899a6;
          --text-header: #ffffff;
          --primary-color: #1da1f2;
          --primary-hover: #1a91da;
          --primary-light: #1e3040;
          --success-color: #4caf50;
          --success-light: #1e3329;
          --error-color: #e0245e;
          --error-light: #3d1a2b;
        }

        .layout {
          background-color: var(--bg-main);
          color: var(--text-primary);
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        header {
          background-color: var(--primary-color);
          color: var(--text-header);
          padding: 0.8rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-auth {
          background-color: transparent;
          box-shadow: none;
          position: absolute;
          width: 100%;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-header);
          text-decoration: none;
          letter-spacing: 0.5px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        .logo-text {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: var(--text-header);
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger {
          display: block;
          position: relative;
          width: 24px;
          height: 2px;
          background-color: var(--text-header);
          transition: all 0.3s ease;
        }

        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: var(--text-header);
          transition: all 0.3s ease;
        }

        .hamburger::before {
          transform: translateY(-8px);
        }

        .hamburger::after {
          transform: translateY(8px);
        }

        .hamburger.open {
          background-color: transparent;
        }

        .hamburger.open::before {
          transform: rotate(45deg);
        }

        .hamburger.open::after {
          transform: rotate(-45deg);
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-link {
          color: var(--text-header);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .register-link {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
        }

        /* Updated profile link styles */
        .auth-links {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto; /* Push to the right */
        }

        .profile-link {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          transition: background-color 0.2s;
        }

        .profile-link:hover {
          background-color: var(--primary-hover);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: var(--text-header);
        }

        .person-icon {
          font-size: 1.2rem; /* Adjust size as needed */
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--text-header);
          cursor: pointer;
          font-size: 1rem;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .btn-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
        }

        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-header);
          transition: background-color 0.2s;
        }

        .theme-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        main {
          flex: 1;
          padding: 2rem 0;
        }

        .auth-main {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer {
          background-color: var(--bg-container);
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
          padding: 1rem 0;
          text-align: center;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block;
          }

          .nav-menu {
            position: fixed;
            top: 60px;
            right: -100%;
            width: 70%;
            max-width: 300px;
            height: calc(100vh - 60px);
            background-color: var(--bg-card);
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
            transition: right 0.3s ease;
            z-index: 99;
          }

          .nav-menu.open {
            right: 0;
          }

          .auth-links {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
          }

          .nav-link, .btn-link {
            color: var(--text-primary);
            width: 100%;
            text-align: left;
            padding: 0.75rem;
          }

          .nav-link:hover, .btn-link:hover {
            background-color: var(--bg-container);
          }

          .logo-container {
            flex: 1;
            justify-content: center;
          }
          .logo {
            font-size: 1.6rem;
          }

          main {
            padding: 1.5rem 0;
          }
        }
      `}</style>
    </div>
  );
}
