import os
import sys

# Tambahkan path project ke sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from matakuliah_app.models import Base, DBSession, Matakuliah

def init_db():
    """Initialize database dengan tabel dan data contoh"""
    # Konfigurasi database
    database_url = 'sqlite:///matakuliah.db'
    engine = create_engine(database_url)
    
    # Buat tabel
    Base.metadata.create_all(engine)
    DBSession.configure(bind=engine)
    
    # Data contoh
    matakuliah_data = [
        Matakuliah(kode_mk='MK001', nama_mk='Pemrograman Web', sks=3, semester=4),
        Matakuliah(kode_mk='MK002', nama_mk='Basis Data', sks=3, semester=3),
        Matakuliah(kode_mk='MK003', nama_mk='Algoritma dan Struktur Data', sks=4, semester=2),
    ]
    
    # Tambahkan data
    for data in matakuliah_data:
        DBSession.add(data)
    
    DBSession.commit()
    print("Database initialized with sample data!")