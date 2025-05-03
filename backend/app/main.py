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
