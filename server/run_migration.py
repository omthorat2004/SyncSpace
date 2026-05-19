#!/usr/bin/env python
"""
Simple script to run Alembic migrations.
Run this from the server directory: python run_migration.py
"""

import subprocess
import sys
import os

def run_migrations():
    """Run Alembic migrations."""
    print("=" * 60)
    print("Running Alembic Migrations")
    print("=" * 60)
    
    # Change to server directory
    server_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(server_dir)
    
    print(f"\nWorking directory: {os.getcwd()}")
    print("\nRunning: alembic upgrade head\n")
    
    try:
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            check=True,
            capture_output=False
        )
        
        print("\n" + "=" * 60)
        print("✅ Migrations completed successfully!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Restart your FastAPI server")
        print("2. Try creating a space via the API")
        print("3. Add content to the space")
        print("\nThe 'contents' table is now ready to use!")
        
        return 0
        
    except subprocess.CalledProcessError as e:
        print("\n" + "=" * 60)
        print("❌ Migrations failed!")
        print("=" * 60)
        print(f"\nError: {e}")
        return 1
    except FileNotFoundError:
        print("\n" + "=" * 60)
        print("❌ Alembic not found!")
        print("=" * 60)
        print("\nPlease install alembic:")
        print("  pip install alembic")
        print("  # or if using poetry:")
        print("  poetry install")
        return 1

if __name__ == "__main__":
    sys.exit(run_migrations())
