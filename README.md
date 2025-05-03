# Twinglish

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
│   │   ├── core/        # App configuration, security
│   │   ├── db/          # Database connection, base models
│   │   ├── models/      # SQLAlchemy models
│   │   ├── routers/     # API routes
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic services
│   │   └── main.py      # FastAPI application
│   ├── alembic/         # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities, API clients
│   ├── pages/           # Next.js pages
│   ├── public/          # Static assets
│   ├── styles/          # Global styles
│   └── next.config.js
└── docker-compose.yml   # Local development setup
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