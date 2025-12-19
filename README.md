# SIBEO - Sistem Belajar Online

Platform e-learning modern untuk students dan instructor dengan tampilan profesional menggunakan warna hitam, putih, dan ungu.

## Fitur Utama

- **Autentikasi**: Login dan registrasi untuk students dan instructor dengan verifikasi OTP
- **Mode Gelap/Terang**: Toggle dark/light mode untuk kenyamanan pengguna
- **Manajemen Kursus**: CRUD lengkap untuk kursus (instructor)
- **Modul dengan Markdown**: Instructor membuat modul dengan Markdown editor dan preview
- **Enrollment**: Students bisa mendaftar dan keluar dari kursus
- **Dashboard Interaktif**: Dashboard berbeda untuk students dan instructor dengan data real-time
- **Progress Tracking**: Monitor perkembangan belajar students
- **Responsive Design**: Tampilan optimal di semua perangkat

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Markdown**: react-markdown untuk render konten modul
- **Language**: JavaScript (JSX)

## 🚀 Cara Menjalankan di VS Code (Setelah Download ZIP)

### Langkah 1: Download dan Extract

1. Download ZIP dari Vercel atau GitHub
2. Extract file ZIP ke folder pilihan Anda
3. Buka folder hasil extract di VS Code:
   ```bash
   code sibeo-frontend
   ```
   Atau klik kanan folder → "Open with Code"

### Langkah 2: Install Dependencies

Buka terminal di VS Code (Terminal → New Terminal atau Ctrl + `) dan jalankan:

```bash
npm install
```

Tunggu hingga proses instalasi selesai (mungkin 2-5 menit tergantung koneksi internet).

### Langkah 3: Setup Environment Variables

1. Buat file baru bernama `.env.local` di root project (sejajar dengan package.json)
2. Copy paste konfigurasi berikut:

```env
# Backend API URL - Backend sudah di-hosting di Render.com
NEXT_PUBLIC_API_URL=https://uas-paw-kelompok9-sibeo.onrender.com/api
```

**PENTING**: 
- Jangan ubah URL di atas, backend sudah di-hosting dan siap digunakan
- Pastikan file bernama `.env.local` (bukan `.env` atau `.env.txt`)

### Langkah 4: Jalankan Development Server

Di terminal VS Code, jalankan:

```bash
npm run dev
```

Tunggu hingga muncul pesan:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Langkah 5: Buka di Browser

Buka browser dan kunjungi: **http://localhost:3000**

Aplikasi SIBEO sekarang berjalan di komputer Anda!

## 📋 Panduan Testing

### Test Flow Student:

1. **Register** → Pilih "Student" → Isi form → Daftar
2. **Login** → Masukkan email & password
3. **Dashboard** → Lihat statistik dan kursus yang diikuti
4. **Courses** → Browse kursus yang tersedia
5. **Enroll** → Klik detail kursus → "Daftar Kursus"
6. **Belajar** → Lihat modul dan konten kursus

### Test Flow Instructor:

1. **Register** → Pilih "Instructor"
2. **Verifikasi OTP**:
   - Klik "Hubungi Admin" untuk demo (opsional)
   - Masukkan kode OTP: `292929`
3. **Login** → Masukkan email & password
4. **Dashboard** → Lihat statistik kursus Anda
5. **Buat Kursus** → Klik "Tambah Kursus"
6. **Buat Modul** → Buka detail kursus → "Tambah Modul"
7. **Markdown Editor** → Gunakan tab Edit & Preview
8. **Manage** → Edit atau hapus kursus/modul

### Demo Credentials:

**Akun Demo yang Tersedia:**
- Email: `tengku@email.com`
- Password: `123456`
- Role: Instructor

Gunakan akun ini untuk testing tanpa perlu registrasi.

## 📁 Struktur Project

```
sibeo-frontend/
├── app/
│   ├── layout.jsx              # Root layout dengan ThemeProvider
│   ├── page.jsx                # Homepage dengan logo
│   ├── login/page.jsx          # Halaman login dengan error handling
│   ├── register/page.jsx       # Halaman register dengan OTP & validasi
│   ├── courses/
│   │   ├── page.jsx            # Daftar kursus dengan filter & empty state
│   │   └── [id]/page.jsx       # Detail kursus dan enrollment
│   ├── dashboard/page.jsx      # Dashboard students/instructor
│   └── instructor/
│       └── courses/
│           ├── create/page.jsx              # Buat kursus baru
│           └── [id]/
│               ├── page.jsx                 # Detail kursus instructor
│               ├── edit/page.jsx            # Edit kursus
│               └── modules/
│                   ├── create/page.jsx      # Buat modul dengan Markdown
│                   └── [courseId]/modules/[id]/edit/page.jsx
├── components/
│   ├── navbar.jsx              # Navigation dengan logo, dark mode toggle
│   ├── footer.jsx              # Footer dengan GitHub links tim
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── auth-context.jsx        # Authentication dengan real API
│   ├── theme-provider.jsx      # Dark/Light mode provider
│   └── api.js                  # API service (sudah dikonfigurasi ke backend)
├── public/
│   └── logo.png                # Logo SIBEO (muncul di homepage)
├── .env.local                  # Environment variables (BUAT FILE INI!)
└── package.json                # Dependencies
```

## 🎨 Fitur UI/UX

### 1. Empty State Handling
- **No Courses**: Tampilan friendly dengan icon dan CTA saat belum ada kursus
- **No Search Results**: Pesan dan tombol reset filter
- **No Enrolled Courses**: Redirect ke katalog kursus

### 2. Logo di Homepage
- Logo SIBEO (burung hantu dengan kacamata) tampil di atas hero text
- Responsive: 150px di desktop, 128px di mobile
- Logo juga muncul di navbar

### 3. Dark/Light Mode
- Toggle di navbar (icon bulan/matahari)
- Preference tersimpan di localStorage
- Smooth transition antar mode

### 4. Loading States
- Spinner saat load data dari API
- Disabled button saat submit form
- Skeleton states untuk better UX

### 5. Error Handling
- Popup toast notification untuk login/register gagal
- Pesan "Akun tidak ditemukan" jika user belum terdaftar
- Validasi form dengan pesan error yang jelas
- **CORS Error Detection**: Pesan khusus jika backend tidak accessible

## 🔌 Integrasi dengan Backend

### Backend URL

Backend sudah di-hosting di Render.com:
```
https://uas-paw-kelompok9-sibeo.onrender.com/api
```

**CATATAN**: Backend mungkin sleep jika tidak digunakan (free tier Render). Request pertama akan lambat (~30-60 detik) untuk "wake up" server. Request berikutnya akan normal.

### API Endpoints yang Digunakan

**Authentication:**
- `POST /api/register` - Registrasi user
- `POST /api/login` - Login user (returns user_id, email, role)
- `POST /api/logout` - Logout user

**Courses:**
- `GET /api/courses` - Get semua kursus (returns {data: [...], count: n})
- `GET /api/courses/{id}` - Get detail kursus
- `POST /api/courses` - Create kursus (instructor only)
- `PUT /api/courses/{id}` - Update kursus (instructor only)
- `DELETE /api/courses/{id}` - Delete kursus (instructor only)

**Enrollments:**
- `POST /api/enrollments` - Enroll ke kursus (body: {course_id})
- `GET /api/enrollments/me` - Get kursus yang diikuti students
- `DELETE /api/enrollments/{id}` - Unenroll dari kursus

**Modules:**
- `GET /api/courses/{id}/modules` - Get modul dari kursus
- `POST /api/courses/{id}/modules` - Create modul (instructor)
- `PUT /api/modules/{id}` - Update modul (instructor)
- `DELETE /api/modules/{id}` - Delete modul (instructor)

**Dashboard:**
- `GET /api/instructor/dashboard` - Data dashboard instructor
- `GET /api/student/progress` - Progress students

### Response Format

Backend menggunakan Pyramid framework dengan format:
```json
{
  "data": {...},
  "message": "Success"
}
```

Atau untuk list:
```json
{
  "data": [...],
  "count": 10
}
```

Error:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## 🚀 Deploy ke Vercel

### Option 1: Deploy via GitHub

1. **Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit SIBEO frontend"
   git remote add origin https://github.com/dvnkrtk/uas-paw-kelompok9-SIBEO.git
   git push -u origin main
   ```

2. **Connect ke Vercel**:
   - Login ke [vercel.com](https://vercel.com)
   - Klik "Add New Project"
   - Import repository dari GitHub
   - Vercel akan auto-detect Next.js

3. **Set Environment Variable**:
   - Di Vercel dashboard, masuk ke project settings
   - Environment Variables → Add
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://uas-paw-kelompok9-sibeo.onrender.com/api`
   - Klik Save

4. **Deploy**:
   - Klik "Deploy"
   - Tunggu ~2-3 menit
   - Vercel akan memberikan URL: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set production
vercel --prod
```

## 🐛 Troubleshooting

### 1. Backend "503 Service Unavailable"
**Penyebab**: Backend Render.com sedang sleep (free tier)  
**Solusi**: Tunggu 30-60 detik, refresh page. Request pertama akan wake up server.

### 2. "Failed to fetch" atau CORS Error
**Penyebab**: Backend Pyramid belum mengaktifkan CORS atau tidak accessible  
**Solusi Backend (Untuk Tim Backend)**:
```python
# Tambahkan di backend Pyramid __init__.py
from pyramid.config import Configurator

def main(global_config, **settings):
    config = Configurator(settings=settings)
    
    # TAMBAHKAN INI UNTUK CORS
    config.add_tween('pyramid_tm.tm_tween_factory')
    
    def cors_tween_factory(handler, registry):
        def cors_tween(request):
            # Set CORS headers
            request.response.headers.update({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            })
            
            # Handle preflight
            if request.method == 'OPTIONS':
                return request.response
                
            return handler(request)
        return cors_tween
    
    config.add_tween('your_app.cors_tween_factory')
    # ... rest of config
```

**Solusi Frontend (Testing Tanpa Backend)**:
Jika backend belum aktif, Anda akan melihat error toast "Tidak dapat terhubung ke server". Frontend sudah menangani error ini dengan baik.

### 3. "Module not found" Error
**Penyebab**: Dependencies belum terinstall  
**Solusi**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### 4. Environment Variable Not Working
**Penyebab**: File `.env.local` tidak terbaca atau typo  
**Solusi**: 
- Pastikan file bernama `.env.local` (bukan `.env`)
- Restart development server (`Ctrl+C` lalu `npm run dev`)
- Check typo: `NEXT_PUBLIC_API_URL` (harus huruf kapital)

### 5. Login/Register Gagal dengan "Akun tidak ditemukan"
**Penyebab**: Email belum terdaftar di database backend  
**Solusi**: 
- Daftar terlebih dahulu via halaman Register
- Atau gunakan demo account: `tengku@email.com` / `123456`
- Check browser console untuk error detail

### 6. Register Gagal dengan "Email already registered"
**Penyebab**: Email sudah digunakan  
**Solusi**: Gunakan email lain atau login dengan email tersebut

### 7. OTP Tidak Diterima (Instructor Register)
**Penyebab**: OTP hardcoded untuk demo  
**Solusi**: Gunakan kode OTP `292929` (tidak perlu hubungi admin untuk demo)

## 📝 Catatan Penting

1. **Demo Account**: Gunakan `tengku@email.com` / `123456` sebagai instructor untuk testing cepat
2. **OTP Code**: Hardcoded `292929` untuk registrasi instructor (demo purpose only)
3. **OTP Management**: Kode OTP otomatis di-reset setelah submit registrasi berhasil
4. **Error Notifications**: Semua error login/register muncul sebagai toast notification dengan pesan yang jelas
5. **Account Not Found**: Pesan khusus ditampilkan jika email belum terdaftar
6. **API Connection**: Frontend sudah terhubung ke backend Render.com dengan comprehensive error handling
7. **CORS Handling**: Frontend mendeteksi CORS error dan memberikan pesan informatif
8. **Terminology**: Menggunakan "Student" dan "Instructor" (bukan "Mahasiswa" dan "Instruktur")
9. **Authentication**: Session/token management via localStorage dengan auto-cleanup
10. **Console Logging**: Debug logs tersedia di browser console untuk troubleshooting (`[v0] ...`)

## 🔍 Debug Mode

Frontend dilengkapi dengan console logging untuk debugging:
- `[v0] API Call: ...` - Menampilkan URL endpoint yang dipanggil
- `[v0] Request body: ...` - Menampilkan data yang dikirim
- `[v0] Response status: ...` - Menampilkan HTTP status code
- `[v0] API Response: ...` - Menampilkan data response
- `[v0] API Error: ...` - Menampilkan error detail

Buka Browser DevTools (F12) → Console untuk melihat logs ini.

## 👥 Tim Pengembang

Kelompok 9 - UAS Pemrograman Aplikasi Web:

1. [Tengku Hafid Diraputra](https://github.com/ThDptr)
2. [Devina Kartika](https://github.com/dvnkrtk)
3. [Riyan Sandi Prayoga](https://github.com/404S4ND1)
4. [Jonathan Nicholaus Damero Sinaga](https://github.com/SinagaPande)
5. Muhammad Fadhil AB

**Repository Frontend**: [https://github.com/dvnkrtk/uas-paw-kelompok9-SIBEO](https://github.com/dvnkrtk/uas-paw-kelompok9-SIBEO)

**Backend API**: https://uas-paw-kelompok9-sibeo.onrender.com/api

## 📞 Support

Untuk pertanyaan:
- Open issue di GitHub repository
- Hubungi tim development via GitHub profile

---

**SIBEO** - Sistem Belajar Online | Pusat Ilmu Daring  
Built with ❤️ by Kelompok 9
