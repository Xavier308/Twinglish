# alembic/README
Alembic migrations

To create a new migration:
alembic revision --autogenerate -m "description"

To upgrade to the latest version:
alembic upgrade head

To downgrade:
alembic downgrade -1

To get current version:
alembic current
