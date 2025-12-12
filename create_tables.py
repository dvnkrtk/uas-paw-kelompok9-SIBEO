import os
import sys

# Tambahkan path project ke sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from matakuliah_app.models import Base

def create_tables():
    """Membuat tabel database"""
    
    # Konfigurasi database
    database_url = 'sqlite:///matakuliah.db'
    engine = create_engine(database_url)
    
    # Buat semua tabel
    Base.metadata.create_all(engine)
    print("✅ Tabel berhasil dibuat!")

if __name__ == '__main__':
    create_tables()