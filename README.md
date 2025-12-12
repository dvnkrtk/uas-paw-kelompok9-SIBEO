# Aplikasi Manajemen Matakuliah dengan Pyramid

Aplikasi API sederhana untuk mengelola data matakuliah menggunakan **Pyramid Framework** dan **SQLite**. Menyediakan endpoint CRUD lengkap untuk operasi manajemen matakuliah.

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
pip install -e .
```

### 2. Setup Database
```bash
python create_tables.py
python seed_data.py
```

### 3. Jalankan Server
```bash
python app.py
```

Server akan berjalan di: **http://localhost:6543**

## 📚 API Endpoints

- `GET    /api/matakuliah`      - Ambil semua matakuliah
- `GET    /api/matakuliah/{id}` - Ambil satu matakuliah
- `POST   /api/matakuliah`      - Tambah matakuliah baru  
- `PUT    /api/matakuliah/{id}` - Update matakuliah
- `DELETE /api/matakuliah/{id}` - Hapus matakuliah

## 🎯 Contoh Testing

**Ambil semua matakuliah:**
```bash
curl http://localhost:6543/api/matakuliah
```

**Tambah matakuliah baru:**
```bash
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk":"MK004","nama_mk":"Jaringan Komputer","sks":3,"semester":5}'
```

Aplikasi siap digunakan