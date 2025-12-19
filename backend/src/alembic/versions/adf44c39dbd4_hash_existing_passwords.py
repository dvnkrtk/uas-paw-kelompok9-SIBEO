# File: src/alembic/versions/adf44c39dbd4_hash_existing_passwords.py
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

# ⭐⭐ PERBAIKAN DI SINI: SAMAKAN SCHEME DENGAN models.py ⭐⭐
# Password hashing context - GUNAKAN ARGON2 (sama dengan models.py)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

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
        
        # ⭐⭐ PERBAIKAN DI SINI: CEK ARGON2 & BCRYT ⭐⭐
        # Skip jika sudah terlihat seperti hash (Argon2 atau bcrypt)
        if plain_password.startswith('$argon2') or plain_password.startswith('$2b$'):
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
    pass