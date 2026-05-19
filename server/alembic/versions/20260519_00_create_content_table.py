"""Create content table.

Revision ID: 20260519_00
Revises: fd39ba1c3c73
Create Date: 2026-05-19 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20260519_00'
down_revision = 'fd39ba1c3c73'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create ENUM type for content type (if not exists)
    enum_exists = False
    try:
        # Try to create the enum
        op.execute("CREATE TYPE contenttype AS ENUM ('note', 'link', 'code')")
    except Exception:
        # ENUM already exists, that's fine
        enum_exists = True
    
    # Create contents table if it doesn't exist
    try:
        op.create_table(
            'contents',
            sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
            sa.Column('space_id', sa.Integer(), nullable=False),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('type', postgresql.ENUM('note', 'link', 'code', name='contenttype', create_type=False), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('url', sa.String(), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.ForeignKeyConstraint(['space_id'], ['spaces.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
            sa.Index('ix_contents_space_id', 'space_id'),
        )
    except Exception as e:
        # Table might already exist
        print(f"Note: {e}")


def downgrade() -> None:
    # Drop contents table
    try:
        op.drop_table('contents')
    except Exception:
        pass
    
    # Drop ENUM type
    try:
        op.execute("DROP TYPE IF EXISTS contenttype")
    except Exception:
        pass

