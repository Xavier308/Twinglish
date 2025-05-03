# create_first_migration.py
"""
Script to create the initial migration
Run with: python -m create_first_migration
"""
import asyncio
import os
import sys

from alembic.config import Config
from alembic import command

def create_initial_migration():
    # Create alembic directory if not exists
    if not os.path.exists('alembic'):
        os.makedirs('alembic/versions', exist_ok=True)
    
    # Create alembic.ini if not exists
    if not os.path.exists('alembic.ini'):
        with open('alembic.ini', 'w') as f:
            f.write("""[alembic]
script_location = alembic
prepend_sys_path = .
sqlalchemy.url = postgresql+asyncpg://postgres:postgres@localhost:5432/twinglish

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
""")
    
    # Create env.py in alembic directory if not exists
    if not os.path.exists('alembic/env.py'):
        with open('alembic/env.py', 'w') as f:
            f.write("""import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Add the app directory to the path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Import Base and all models
from app.db.base import Base
from app.core.config import settings

# This is the Alembic Config object
config = context.config

# Update the SQLAlchemy URL from settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    \"\"\"Run migrations in 'offline' mode.\"\"\"
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    \"\"\"Run migrations in 'online' mode.\"\"\"
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
""")
    
    # Create script.py.mako in alembic directory if not exists
    if not os.path.exists('alembic/script.py.mako'):
        with open('alembic/script.py.mako', 'w') as f:
            f.write("""\"\"\"${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

\"\"\"
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade() -> None:
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    ${downgrades if downgrades else "pass"}
""")
    
    # Create the initial migration
    alembic_cfg = Config("alembic.ini")
    command.revision(alembic_cfg, message="Initial migration", autogenerate=True)
    print("Initial migration created successfully!")

if __name__ == "__main__":
    create_initial_migration()