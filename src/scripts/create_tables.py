import os
import sys

# PERBAIKAN: Tambahkan path ke parent directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from e_learning.models import Base

def create_tables():
    """Membuat tabel database"""
    
    # Konfigurasi database
    database_url = 'sqlite:///instance/e_learning.db'
    engine = create_engine(database_url)
    
    # Buat semua tabel
    Base.metadata.create_all(engine)
    print("✅ Tabel berhasil dibuat!")

if __name__ == '__main__':
    create_tables()