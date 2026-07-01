FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml README.md ./
COPY alembic.ini ./
COPY alembic ./alembic
COPY src ./src

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Run migrations and start the app
EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && uvicorn src.server.main:app --host 0.0.0.0 --port 8000"]
