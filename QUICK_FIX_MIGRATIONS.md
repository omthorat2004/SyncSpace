# 🚀 QUICK FIX: Run Migrations NOW

## The Error
```
relation "contents" does not exist
```

## The Fix (Choose ONE method)

### Method 1: Using Python Script (EASIEST) ⭐

```bash
cd server
python run_migration.py
```

This will:
1. Run all pending migrations
2. Create the `contents` table
3. Show success message

### Method 2: Using Alembic Directly

```bash
cd server
alembic upgrade head
```

### Method 3: Using Poetry

```bash
cd server
poetry run alembic upgrade head
```

---

## After Running Migrations

1. **Restart your backend server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart it:
   uvicorn src.server.main:app --reload
   ```

2. **Test the API**:
   - Create a space
   - Add content to the space
   - Fetch content from the space

---

## Verify It Worked

You should see output like:
```
INFO  [alembic.runtime.migration] Running upgrade ... -> 20260519_00, create content table
INFO  [alembic.runtime.migration] Done.
```

Then the error will be gone! ✅

---

## If It Still Doesn't Work

### Check 1: Is Alembic installed?
```bash
alembic --version
```

If not installed:
```bash
pip install alembic
# or
poetry install
```

### Check 2: Is your database running?
```bash
# Test PostgreSQL connection
psql -U your_user -d your_database -c "SELECT 1"
```

### Check 3: Check migration status
```bash
cd server
alembic current
alembic history
```

### Check 4: View the migration file
The migration file should exist at:
```
server/alembic/versions/20260519_00_create_content_table.py
```

---

## What Gets Created

Running migrations creates these tables:
- ✅ `users` - User accounts
- ✅ `refresh_tokens` - Session tokens  
- ✅ `spaces` - Workspaces
- ✅ `contents` - Notes, links, code (THIS IS WHAT WAS MISSING)

---

## Summary

1. Run: `cd server && python run_migration.py`
2. Restart backend server
3. Done! ✅

The `contents` table will be created and the error will disappear.
