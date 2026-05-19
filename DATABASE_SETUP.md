# Database Setup Guide

## Problem
The `contents` table does not exist in the database. This is because the Alembic migrations haven't been run yet.

## Solution

### Step 1: Run Alembic Migrations

Navigate to the server directory and run the migrations:

```bash
cd server
alembic upgrade head
```

This will:
1. Create the `users` table (if not exists)
2. Create the `refresh_tokens` table (if not exists)
3. Create the `spaces` table (if not exists)
4. Create the `contents` table with proper schema

### Step 2: Verify Database Tables

You can verify the tables were created by connecting to your PostgreSQL database:

```bash
psql -U your_user -d your_database -c "\dt"
```

You should see:
- `users` table
- `refresh_tokens` table
- `spaces` table
- `contents` table

### Step 3: Restart the Backend Server

After running migrations, restart your FastAPI server:

```bash
uvicorn src.server.main:app --reload
```

## Migration Files

### Existing Migrations
1. `20260420_00_create_initial_users_table.py` - Creates users table
2. `20260420_01_add_refresh_tokens_and_token_version.py` - Creates refresh_tokens table
3. `fd39ba1c3c73_create_space_table.py` - Creates spaces table

### New Migration
4. `20260519_00_create_content_table.py` - Creates contents table with:
   - `id` (Integer, Primary Key, Auto-increment)
   - `space_id` (Integer, Foreign Key to spaces.id)
   - `title` (String, Required)
   - `type` (Enum: 'note', 'link', 'code')
   - `content` (Text, Required)
   - `url` (String, Optional)
   - `created_at` (DateTime with timezone, Server default: now())

## Schema Details

### Contents Table
```sql
CREATE TABLE contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    space_id INTEGER NOT NULL,
    title VARCHAR NOT NULL,
    type VARCHAR NOT NULL,  -- Enum: 'note', 'link', 'code'
    content TEXT NOT NULL,
    url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
    INDEX ix_contents_space_id (space_id)
);
```

## Troubleshooting

### If migrations fail:

1. **Check database connection**:
   ```bash
   psql -U your_user -d your_database -c "SELECT 1"
   ```

2. **Check Alembic configuration**:
   - Verify `alembic.ini` has correct database URL
   - Verify `alembic/env.py` is properly configured

3. **Reset migrations** (⚠️ WARNING: This deletes all data):
   ```bash
   alembic downgrade base
   alembic upgrade head
   ```

4. **Check migration status**:
   ```bash
   alembic current
   alembic history
   ```

## Next Steps

After running migrations:
1. Restart the backend server
2. Create a space via the API
3. Add content to the space
4. Verify data is stored in the database

## Environment Variables

Make sure your `.env` file has the correct database URL:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/syncspace
```

Replace:
- `user` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `localhost` - Your database host
- `5432` - Your database port
- `syncspace` - Your database name
