# Database Migration Instructions

## Problem
When trying to fetch content, you get this error:
```
sqlalchemy.exc.ProgrammingError: relation "contents" does not exist
```

This means the `contents` table hasn't been created in the database yet.

## Solution: Run Alembic Migrations

### Quick Start (Recommended)

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Run migrations**:
   ```bash
   alembic upgrade head
   ```

3. **Restart your backend server**:
   ```bash
   uvicorn src.server.main:app --reload
   ```

That's it! The `contents` table will now be created.

---

## What Gets Created

Running `alembic upgrade head` will create/update these tables:

### 1. Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `token_version` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### 2. Refresh Tokens Table
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id)
- `token_hash` (String)
- `token_version` (Integer)
- `ip_address` (String, Optional)
- `valid` (Boolean)
- `created_at` (DateTime)

### 3. Spaces Table
- `id` (Primary Key)
- `name` (String)
- `description` (String, Optional)
- `owner_id` (Foreign Key → users.id)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### 4. Contents Table (NEW)
- `id` (Primary Key)
- `space_id` (Foreign Key → spaces.id)
- `title` (String)
- `type` (Enum: 'note', 'link', 'code')
- `content` (Text)
- `url` (String, Optional)
- `created_at` (DateTime)

---

## Migration Files

All migration files are in `server/alembic/versions/`:

1. **20260420_00_create_initial_users_table.py**
   - Creates users table
   - Creates refresh_tokens table

2. **20260420_01_add_refresh_tokens_and_token_version.py**
   - Adds token_version column to users

3. **fd39ba1c3c73_create_space_table.py**
   - Creates spaces table

4. **20260519_00_create_content_table.py** (NEW)
   - Creates contents table
   - Creates ContentType ENUM

---

## Verification

### Check if migrations ran successfully:

```bash
# Check current migration status
alembic current

# View migration history
alembic history

# Connect to database and verify tables
psql -U your_user -d your_database -c "\dt"
```

You should see all 4 tables listed.

---

## Troubleshooting

### Issue: "relation 'contents' does not exist"
**Solution**: Run `alembic upgrade head`

### Issue: "Database connection refused"
**Solution**: 
- Check your `.env` file has correct `DATABASE_URL`
- Verify PostgreSQL is running
- Verify database exists

### Issue: "Alembic command not found"
**Solution**: 
```bash
pip install alembic
# or if using poetry
poetry install
```

### Issue: "Migration conflicts"
**Solution**:
```bash
# Check current state
alembic current

# If stuck, you can downgrade and re-upgrade
alembic downgrade base
alembic upgrade head
```

---

## After Running Migrations

1. **Restart your backend server**:
   ```bash
   uvicorn src.server.main:app --reload
   ```

2. **Test the API**:
   - Create a space
   - Add content to the space
   - Fetch content from the space

3. **Verify in database**:
   ```bash
   psql -U your_user -d your_database
   
   # Check spaces
   SELECT * FROM spaces;
   
   # Check contents
   SELECT * FROM contents;
   ```

---

## Environment Setup

Make sure your `.env` file in the `server` directory has:

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/syncspace

# Other settings
SECRET_KEY=your_secret_key_here
DEBUG=True
```

Replace:
- `user` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `localhost` - Your database host (usually localhost for local development)
- `5432` - Your database port (default PostgreSQL port)
- `syncspace` - Your database name

---

## Common Commands

```bash
# Run all pending migrations
alembic upgrade head

# Downgrade to previous migration
alembic downgrade -1

# Downgrade to base (removes all tables)
alembic downgrade base

# Create a new migration (auto-detect changes)
alembic revision --autogenerate -m "description"

# View current migration
alembic current

# View all migrations
alembic history

# View migration details
alembic show <revision_id>
```

---

## Next Steps

After migrations are complete:

1. ✅ Backend database is ready
2. ✅ All tables are created
3. ✅ API endpoints can now access the database
4. ✅ Frontend can create spaces and content

You're all set! Start using the application.
