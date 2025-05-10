#!/bin/bash
# Twinglish Project Setup Script

# Create project root directory
mkdir -p twinglish
cd twinglish

# Create backend directory structure
mkdir -p backend/app/routers backend/app/services backend/app/models backend/app/schemas backend/app/db backend/app/core

# Create frontend directory structure
mkdir -p frontend/pages frontend/components frontend/styles frontend/public frontend/lib frontend/hooks

# Create Docker related files
touch backend/Dockerfile
touch docker-compose.yml

# Create backend basic files
cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Twinglish API",
    description="Twitter-style application for language learning",
    version="0.115.12"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # Local frontend
    "https://twinglish.vercel.app",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Twinglish API"}
EOF

# Create requirements.txt
cat > backend/requirements.txt << 'EOF'
fastapi==0.115.12
uvicorn==0.34.2
sqlalchemy==2.0.40
alembic==1.15.2
pydantic==2.11.4
pydantic-settings==	2.9.1
asyncpg==0.30.0
aioredis==2.0.1
httpx==0.27.0
python-jose==3.4.0
passlib==1.7.4
python-multipart==0.0.9
langchain==0.1.12
openai==1.13.3
tiktoken==0.6.0
bcrypt==4.1.2
EOF

# Create package.json for frontend
cat > frontend/package.json << 'EOF'
{
  "name": "twinglish-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.3.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "swr": "2.2.4",
    "jose": "5.2.2"
  },
  "devDependencies": {
    "@types/node": "20.11.20",
    "@types/react": "18.2.58",
    "@types/react-dom": "18.2.19",
    "eslint": "8.57.0",
    "eslint-config-next": "15.3.1",
    "typescript": "5.3.3"
  }
}
EOF

# Create next.config.js
cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/twinglish
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=changethisinproduction
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=twinglish
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Create Dockerfile for backend
cat > backend/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Create basic frontend pages
mkdir -p frontend/pages/api

cat > frontend/pages/index.tsx << 'EOF'
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [text, setText] = useState('');
  const [corrected, setCorrected] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // This is a placeholder for the actual API call
      // We'll implement the real API call when the backend is ready
      console.log('Submitting:', text);
      setTimeout(() => {
        setCorrected('This is a placeholder for corrected text.');
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting text:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Twinglish</title>
        <meta name="description" content="Improve your English writing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Twinglish</h1>
        <p>Practice your English writing with instant feedback</p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something in English..."
            maxLength={280}
            rows={4}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={!text || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {corrected && (
          <div className="result">
            <h2>Corrected Version</h2>
            <p>{corrected}</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }

        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }

        form {
          margin-top: 2rem;
          width: 100%;
        }

        textarea {
          width: 100%;
          padding: 0.5rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
        }

        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .result {
          margin-top: 2rem;
          padding: 1rem;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
EOF

# Create _app.tsx
cat > frontend/pages/_app.tsx << 'EOF'
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp;
EOF

# Create global CSS
mkdir -p frontend/styles
cat > frontend/styles/globals.css << 'EOF'
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
  body {
    color: white;
    background: #121212;
  }
}
EOF

# Create basic backend models
cat > backend/app/models/base.py << 'EOF'
from sqlalchemy import Column, Integer, DateTime, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Base class for all models
class Base:
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

Base = declarative_base(cls=Base)

# DB Connection
async def get_db():
    from app.core.config import settings
    
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        yield session
EOF

# Create user model
cat > backend/app/models/user.py << 'EOF'
from sqlalchemy import Column, String, Boolean
from .base import Base

class User(Base):
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
EOF

# Create tweet model
cat > backend/app/models/tweet.py << 'EOF'
from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base

class Tweet(Base):
    original_text = Column(String(280))
    corrected_text = Column(String(280))
    explanation = Column(Text)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="tweets")
EOF

echo "Project structure created successfully!"