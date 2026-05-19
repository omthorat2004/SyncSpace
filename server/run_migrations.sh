#!/bin/bash

# Run Alembic migrations
echo "Running Alembic migrations..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Restart your FastAPI server"
    echo "2. Try creating a space via the API"
    echo "3. Add content to the space"
else
    echo "❌ Migrations failed!"
    exit 1
fi
