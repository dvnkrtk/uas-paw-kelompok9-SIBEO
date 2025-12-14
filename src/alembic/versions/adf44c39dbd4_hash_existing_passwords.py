"""Hash existing passwords

Revision ID: adf44c39dbd4
Revises: 570f61b2d952
Create Date: 2025-12-14 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column, select
from passlib.context import CryptContext

# revision identifiers, used by Alembic.
revision = 'adf44c39dbd4'
down_revision = '570f61b2d952'
branch_labels = None
depends_on = None

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def upgrade() -> None:
    """Hash semua password yang masih plaintext"""
    # Get connection
    connection = op.get_bind()
    
    # Define users table for raw SQL
    users_table = table(
        'users',
        column('id', sa.Integer),
        column('password', sa.String)
    )
    
    # Get all users
    result = connection.execute(
        select(users_table.c.id, users_table.c.password)
    )
    
    # Hash each password
    updated_count = 0
    for row in result:
        user_id = row['id']
        plain_password = row['password']
        
        # Skip if already looks like a hash (starts with $2b$)
        if plain_password.startswith('$2b$'):
            continue
            
        # Hash the password
        hashed_password = pwd_context.hash(plain_password)
        
        # Update the password
        connection.execute(
            users_table.update()
            .where(users_table.c.id == user_id)
            .values(password=hashed_password)
        )
        updated_count += 1
    
    print(f"✅ Successfully hashed {updated_count} passwords")

def downgrade() -> None:
    """Warning: Cannot revert password hashing!"""
    print("⚠️  WARNING: Cannot revert password hashing migration")
    print("   Passwords will remain hashed")
    # Note: We cannot revert to plaintext passwords
    pass