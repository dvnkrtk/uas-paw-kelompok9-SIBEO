# SIBEO - Sistem Belajar Online

SIBEO adalah platform e-learning modern yang dirancang untuk memfasilitasi proses belajar mengajar antara Student (Mahasiswa) dan Instructor (Dosen/Pengajar) secara efisien. Proyek ini dikembangkan sebagai tugas besar Pemrograman Aplikasi Web (PAW) Kelompok 9. Aplikasi ini menggunakan skema warna profesional dan elegan, dengan fitur lengkap mulai dari manajemen kursus hingga pelacakan progres belajar.

---

## Tim Pengembang (Kelompok 9)

Proyek ini dikembangkan oleh mahasiswa program studi Teknik Informatika, Institut Teknologi Sumatera (ITERA):

| Nama | NIM | Pembagian Tugas |
| :--- | :--- | :--- |
| **Tengku Hafid Diraputra** | 123140045 | Lead Developer & Frontend Developer |
| **Devina Kartika** | 123140036 | Frontend Developer & UI/UX Designer |
| **Riyan Sandi Prayoga** | 123140176 | Backend Engineer & API Integration |
| **Jonathan Nicholaus Damero Sinaga** | 123140153 | Backend Engineer & API Integration |

---

## Deskripsi Project & Fitur Utama

SIBEO bertujuan untuk menyediakan pusat ilmu daring yang responsif dan mudah digunakan.

### **Fitur Utama:**
* **Autentikasi & Role Management**: Login dan registrasi terpisah untuk Student dan Instructor.
* **Verifikasi OTP**: Sistem keamanan tambahan menggunakan kode OTP saat pendaftaran Instructor.
* **Manajemen Kursus & Modul**: Fitur CRUD lengkap bagi Instructor untuk mengelola materi pembelajaran.
* **Markdown Editor**: Penulisan materi modul menggunakan Markdown dengan fitur preview real-time.
* **Enrollment System**: Student dapat mendaftar (enroll) dan keluar (unenroll) dari kursus pilihan.
* **Interactive Dashboard**: Statistik real-time mengenai kursus dan perkembangan belajar dengan tampilan berbeda sesuai peran.
* **Dark/Light Mode**: Perpindahan tema visual yang tersimpan di localStorage pengguna.
* **Progress Tracking**: Memantau perkembangan belajar Student secara akurat.

---

## Tech Stack

### **Frontend**
* **Framework**: Next.js 15 (App Router).
* **Styling**: Tailwind CSS v4.
* **UI Components**: shadcn/ui.
* **State Management**: React Context API.
* **Markdown Rendering**: `react-markdown`.

### **Backend**
* **Language**: Python.
* **Framework**: Pyramid Framework.
* **Database**: PostgreSQL dengan SQLAlchemy ORM.
* **Server**: Waitress (pserve).

---

## Cara Instalasi & Menjalankan (Local Development)

### **1. Setup Frontend**
```bash
# Masuk ke folder frontend
cd sibeo-frontend

# Instal dependencies
npm install

# Buat file .env.local dan isi dengan:
# NEXT_PUBLIC_API_URL=[https://uas-paw-kelompok9-sibeo.onrender.com/api](https://uas-paw-kelompok9-sibeo.onrender.com/api)

# Jalankan aplikasi
npm run dev

```

### **2. Setup Backend**

```bash
# Masuk ke folder backend
cd sibeo-backend

# Instal dependencies
pip install -e .

# Jalankan server
pserve src/config/development.ini --reload

```

> **Catatan**: Gunakan `python clear_db.py` jika perlu mereset atau membersihkan database testing.

---

## Link Deployment

* **Frontend**: [https://github.com/SIBEO-9/uas-paw-kelompok9-SIBEO.git](https://github.com/SIBEO-9/uas-paw-kelompok9-SIBEO.git) .
* **Backend API**: [https://uas-paw-kelompok9-sibeo.onrender.com/](https://uas-paw-kelompok9-sibeo.onrender.com/).

---

## API Documentation

Backend menggunakan format respons JSON standar: `{ "data": {...}, "message": "Success" }`.

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| **POST** | `/api/login` | Autentikasi user (email & password). |
| **POST** | `/api/register` | Registrasi user baru. |
| **GET** | `/api/courses` | Mengambil daftar semua kursus. |
| **POST** | `/api/courses` | Membuat kursus baru (Instructor only). |
| **POST** | `/api/enrollments` | Mendaftarkan Student ke kursus. |
| **GET** | `/api/courses/{id}/modules` | Mengambil materi modul berdasarkan ID kursus. |

---

## Screenshot Aplikasi

*(Silakan unggah gambar Anda ke folder repositori dan sesuaikan path di bawah ini)*

* **Homepage**: `![Homepage](./public/logo.png)`
* **Dashboard**: `![Dashboard](./public/logo.png)`

---

## Link Video Presentasi

Tonton demo dan penjelasan lengkap aplikasi kami melalui tautan di bawah ini:
**[Video Presentasi SIBEO - YouTube](https://youtu.be/uBqbRFxc-rk)**

---

© 2025 **SIBEO Team** | Teknik Informatika ITERA | UAS Pemrograman Aplikasi Web.
