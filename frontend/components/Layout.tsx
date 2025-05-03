// frontend/components/Layout.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'Twinglish' }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Improve your English with Twinglish" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="container">
          <h1 className="logo">
            <Link href="/">Twinglish</Link>
          </h1>
          <nav>
            {user ? (
              <>
                <Link href="/profile">
                  {user.username}
                </Link>
                <button onClick={logout} className="btn-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  Login
                </Link>
                <Link href="/register">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
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
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          padding: 1rem 0;
        }

        header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          margin: 0;
          font-size: 1.5rem;
        }

        nav {
          display: flex;
          gap: 1rem;
        }

        main {
          flex: 1;
          padding: 2rem 0;
        }

        footer {
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
          padding: 1rem 0;
          text-align: center;
        }

        .btn-link {
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: #0070f3;
          padding: 0;
        }

        @media (max-width: 768px) {
          header .container {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
