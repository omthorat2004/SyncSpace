# ⚠️ IMMEDIATE ACTION REQUIRED

## Error
```
sqlalchemy.exc.ProgrammingError: relation "contents" does not exist
```

## Root Cause
The database migrations haven't been run yet. The `contents` table doesn't exist in your PostgreSQL database.

## Fix (Takes 30 seconds)

### Step 1: Open Terminal
Navigate to the server directory:
```bash
cd server
```

### Step 2: Run Migrations
```bash
alembic upgrade head
```

### Step 3: Restart Backend
Stop your current backend server and restart it:
```bash
uvicorn src.server.main:app --reload
```

## That's It! ✅

After these 3 steps:
- ✅ `contents` table will be created
- ✅ All other tables will be created/updated
- ✅ API will work correctly
- ✅ You can create spaces and add content

## What Gets Created

Running `alembic upgrade head` creates these tables:
1. `users` - User accounts
2. `refresh_tokens` - Session tokens
3. `spaces` - Workspaces
4. `contents` - Notes, links, code snippets

## Verify It Worked

After running migrations, you should see:
```
INFO  [alembic.runtime.migration] Running upgrade ... -> 20260519_00, create content table
INFO  [alembic.runtime.migration] Done.
```

Then try the API again - it should work!

## Need Help?

See `MIGRATION_INSTRUCTIONS.md` for detailed troubleshooting.
