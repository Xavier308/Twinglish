#!/usr/bin/env python3
"""
Script to create and apply migrations directly using alembic commands
Run with: python -m run_migration
"""
import os
import sys
import asyncio
from alembic.config import Config
from alembic import command
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Ensure DATABASE_URL is properly set with asyncpg
db_url = os.getenv("DATABASE_URL")
if not db_url:
    # Default URL for local development
    db_url = "postgresql+asyncpg://postgres:postgres@localhost:5433/twinglish"
elif "psycopg2" in db_url:
    # Replace psycopg2 with asyncpg if found
    db_url = db_url.replace("psycopg2", "asyncpg")
elif "asyncpg" not in db_url:
    # Add asyncpg if no driver specified
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

# Print the URL being used
print(f"Using database URL: {db_url}")

def run_migrations():
    """Run alembic migrations"""
    # Get alembic config
    alembic_cfg = Config("alembic.ini")
    
    # Override the sqlalchemy.url config
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)
    
    # Create revision
    print("Creating migration revision...")
    command.revision(alembic_cfg, message="Initial migration", autogenerate=True)
    
    # Apply migration
    print("Applying migration...")
    command.upgrade(alembic_cfg, "head")
    
    print("Migration complete!")

if __name__ == "__main__":
    run_migrations()
