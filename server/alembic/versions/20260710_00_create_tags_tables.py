"""Create tags and content_tags tables.

Revision ID: 20260710_00
Revises: 40fcefbb9341
Create Date: 2026-07-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260710_00'
down_revision = '40fcefbb9341'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'tags',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )
    op.create_index('ix_tags_name', 'tags', ['name'])

    op.create_table(
        'content_tags',
        sa.Column('content_id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['content_id'], ['contents.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('content_id', 'tag_id'),
    )


def downgrade() -> None:
    op.drop_table('content_tags')
    op.drop_index('ix_tags_name', table_name='tags')
    op.drop_table('tags')
