import os
import sys
from sqlalchemy import create_engine

# Import Base dari models Anda
# Pastikan path ini sesuai dengan struktur folder Anda!
from src.e_learning.models import Base

def create_tables():
    # Ambil URL Database dari Environment Variable Render
    db_url = os.environ.get('DATABASE_URL')
    
    if not db_url:
        print("❌ Error: DATABASE_URL not found.")
        return

    # Fix URL untuk SQLAlchemy (Render pakai postgres://, SQLAlchemy butuh postgresql://)
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    print(f"🔄 Connecting to database...")
    try:
        engine = create_engine(db_url)
        
        # Perintah ini akan membuat tabel JIKA belum ada
        print("🔨 Creating tables (if not exist)...")
        Base.metadata.create_all(engine)
        print("✅ Tables check/creation finished!")
        
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")

if __name__ == "__main__":
    create_tables()