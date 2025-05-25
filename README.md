# Twinglish

![Twinglish](https://github.com/Xavier308/Assets/raw/main/Twinglish/twinglish-dashboard.png)

Twinglish is a Twitter-style web application where users can post short messages in English (and later other languages) and receive instant AI-powered corrections and style feedback. The goal is to create a fun, safe, judgment-free space to practice writing and build confidence.

## Technology Stack

### Frontend
- Next.js + React
- Plain CSS
- SWR for data fetching
- JWT for authentication

### Backend
- FastAPI (Python)
- PostgreSQL
- Redis for caching & sessions
- OpenAI GPT-4 for AI-powered corrections
- JWT for authentication

### Deployment
- Frontend: Vercel
- Backend: Docker on AWS ECS or App Runner
- Database: AWS RDS (PostgreSQL)
- Cache: AWS ElastiCache (Redis)

## Project Structure

```
twinglish/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py              # Application configuration and settings
│   │   │   └── security.py            # Security utilities (password hashing, JWT creation)
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                # Database base configuration
│   │   │   └── session.py             # Database session management
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                # Base model with common fields
│   │   │   ├── user.py                # User model
│   │   │   └── tweet.py               # Tweet model
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                # Authentication endpoints (/login)
│   │   │   ├── users.py               # User endpoints (/users)
│   │   │   └── tweets.py              # Tweet endpoints (/tweets)
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                # User request/response schemas
│   │   │   ├── tweet.py               # Tweet request/response schemas
│   │   │   └── token.py               # JWT token schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                # Authentication service functions
│   │   │   └── openai_service.py      # OpenAI API integration
│   │   ├── __init__.py
│   │   └── main.py                    # Main FastAPI application
│   ├── alembic/
│   │   ├── versions/                  # Database migration files
│   │   │   └── (migration files)
│   │   ├── env.py                     # Alembic environment configuration
│   │   ├── README                     # Alembic documentation
│   │   └── script.py.mako             # Migration template
│   ├── .env (Moved to the root)       # Environment variables
│   ├── Dockerfile                     # Docker configuration for backend
│   ├── requirements.txt               # Python dependencies
│   └── alembic.ini                    # Alembic configuration
│
├── frontend/
│   ├── components/
│   │   ├── Layout.tsx                 # Main layout component with header/footer
│   │   ├── TweetCard.tsx              # Component for displaying tweets
│   │   ├── TweetEditor.tsx            # Component for creating tweets
│   │   └── TweetFeed.tsx              # Component for listing tweets
│   ├── hooks/
│   │   └── useTweets.ts               # Custom hook for tweet operations
│   ├── lib/
│   │   ├── api.ts                     # API utilities for making requests
│   │   └── auth.ts                    # Authentication context and functions
│   ├── pages/
│   │   ├── api/                       # Next.js API routes (if needed)
│   │   ├── _app.tsx                   # Next.js app wrapper
│   │   ├── index.tsx                  # Home page
│   │   ├── login.tsx                  # Login page
│   │   ├── register.tsx               # Registration page
│   │   └── profile.tsx                # User profile page
│   ├── public/
│   │   └── (static assets)            # Images, fonts, etc.
│   ├── styles/
│   │   └── globals.css                # Global CSS styles
│   ├── .gitignore                     # Git ignore rules
│   ├── package.json                   # Node.js dependencies
│   ├── next.config.js                 # Next.js configuration
│   └── tsconfig.json                  # TypeScript configuration
│---- .env (OpenAI key, and DB)
├── docker-compose.yml                 # Docker Compose configuration
├── .gitignore                         # Git ignore rules (root)
└── README.md                          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose
- OpenAI API key
- PostgreSQL (via Docker or local installation)
- Redis (via Docker or local installation)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/twinglish.git
   cd twinglish
   ```

2. Create a `.env` file in the backend directory:
   ```
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/twinglish
   REDIS_URL=redis://redis:6379/0
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Start the development environment with Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   cd backend
   alembic upgrade head
   ```

5. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

6. Start the frontend development server:
   ```bash
   npm run dev
   ```

7. The application should now be accessible at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - PgAdmin: http://localhost:5050 (email: admin@twinglish.com, password: admin)

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
```

#### Frontend Tests
```bash
cd frontend
npm test
```

## Implementation Plan

### Week 1: Setup and Authentication
- Initialize repositories
- Set up Docker Compose for local development
- Implement user model and database migrations
- Create authentication endpoints (login, register)
- Build login and registration UI

### Week 2: Core Functionality
- Implement Tweet model and CRUD endpoints
- Integrate OpenAI API for text correction
- Create tweet editor component
- Build tweet feed display

### Week 3: Enhanced Features
- Implement caching with Redis
- Add user profiles and stats
- Create basic gamification features (streaks, achievements)
- Polish UI/UX with animations and feedback

### Week 4: Testing and Deployment
- Write unit and integration tests
- Set up CI/CD pipeline
- Deploy to production environment
- Monitor and fix initial issues

## Future Enhancements (Phase 2 & 3)
- Multi-language support
- Advanced gamification (levels, badges, challenges)
- Social features (following, likes, comments)
- Personalized learning paths
- Native mobile apps
- AI-powered tutoring agents
- Semantic search for past corrections

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


## Quick commands
```bash
docker compose down
docker compose build --no-cache api
docker compose up -d
```

Exit venv if deactivate isnt working
```bash
exec bash
```

Usefull for running migration inside the container
```bash
# Enter the API container
docker exec -it twinglish-api-1 bash

# Once inside the container
cd /app
python -m create_first_migration
```

This is for activating the app (backend)
```bash
docker compose up -d

docker exec -it twinglish-api-1 bash
```
For the Front-End  
```bash
sudo npm run dev
```
I have to use sudo because it seems there is a problem with file authorization

Hard reset to clean browser's cache: CTRL+F5 
