# SIBEO - Sistem Belajar Online Backend API (Pyramid Framework)

Repositori ini berisi kode sumber untuk server backend SIBEO (Sistem Belajar Online). Server ini dibangun menggunakan Python dengan framework Pyramid untuk menyediakan layanan RESTful API bagi aplikasi frontend.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Pyramid](https://img.shields.io/badge/Pyramid-Framework-red?style=for-the-badge&logo=pylons)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-grey?style=for-the-badge&logo=sqlalchemy)

## Tech Stack
- **Framework**: Pyramid
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Authentication**: JWT/Token-based
- **Web Server**: Waitress (pserve)
- **Environment Management**: Virtualenv

---

## Panduan Instalasi & Setup
Ikuti langkah-langkah di bawah ini untuk menjalankan server di lingkungan lokal:

### 1. Persiapan Environment
Sangat disarankan untuk menggunakan virtual environment agar tidak mengganggu package sistem Anda.

```bash
# Buat virtual environment
python -m venv venv

# Aktivasi venv (Windows)
venv\Scripts\activate

# Aktivasi venv (Linux/macOS)
source venv/bin/activate

```

### 2. Instalasi Dependencies
Sesuai dengan struktur project, jalankan perintah berikut untuk menginstal package yang dibutuhkan dalam mode editable:

```bash
# Instal dependencies awal
pip install -e .

# Untuk memperbarui package di kemudian hari
pip install --upgrade -e .

```

### 3. Konfigurasi Database
Pastikan Anda sudah memiliki database PostgreSQL yang berjalan. Sesuaikan koneksi database pada file konfigurasi:
* Lokasi file: `src/config/development.ini`
* Ubah baris `sqlalchemy.url` sesuai dengan kredensial PostgreSQL Anda.

---

## Menjalankan Server

### Menjalankan Server Utama
Gunakan perintah `pserve` untuk menjalankan server dengan fitur *auto-reload* (server akan restart otomatis jika ada perubahan kode):
```bash
pserve src/config/development.ini --reload

```

### Manajemen Database (Reset Data)
Jika Anda perlu membersihkan atau mereset database untuk keperluan testing (seperti menghapus semua tabel dan mengisinya kembali):

```bash
python clear_db.py

```

---

## Struktur Konfigurasi

* `src/config/development.ini`: Konfigurasi untuk lingkungan pengembangan (local).
* `src/config/production.ini`: Konfigurasi untuk lingkungan deployment.
* `clear_db.py`: Script utilitas untuk manajemen siklus hidup database.

---

## Tim Pengembang (Kelompok 9)

* [Tengku Hafid Diraputra](https://github.com/ThDptr)
* [Devina Kartika](https://github.com/dvnkrtk)
* [Riyan Sandi Prayoga](https://github.com/404S4ND1)
* [Jonathan Nicholaus Damero Sinaga](https://github.com/SinagaPande)

---

© 2025 **SIBEO Team** | UAS Pemrograman Aplikasi Web
