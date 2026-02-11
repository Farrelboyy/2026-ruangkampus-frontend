# 2026-RuangKampus-Frontend

Repositori ini berisi kode sumber antarmuka pengguna (Frontend) untuk aplikasi **RuangKampus**, sebuah sistem manajemen peminjaman ruangan berbasis web. Proyek ini dikembangkan menggunakan **React** dan **Vite** sebagai bagian dari pemenuhan tugas Project-Based Learning (PBL).

Fokus utama pengembangan saat ini mencakup modul autentikasi yang aman, antarmuka responsif, dan integrasi penuh dengan Backend ASP.NET Core.

## Fitur Utama

### 1. Autentikasi Pengguna
- **Manajemen Akses:** Mendukung login untuk role *User* dan *Administrator*.
- **Registrasi Akun:** Formulir pendaftaran dengan validasi data secara *real-time*.
- **Keamanan Input:** Dilengkapi indikator kekuatan kata sandi (*Password Strength Meter*) dan pengecekan ketersediaan username.

### 2. Antarmuka Pengguna (UI/UX)
- **Tema Tampilan:** Mendukung mode Gelap (*Dark Mode*) dan Terang (*Light Mode*) yang dapat disesuaikan pengguna.
- **Dukungan Multi-bahasa:** Tersedia dalam Bahasa Indonesia dan Bahasa Inggris (ID/EN) untuk aksesibilitas yang lebih luas.
- **Desain Responsif:** Tata letak yang adaptif untuk perangkat desktop maupun seluler.
- **Interaksi:** Notifikasi sistem menggunakan *Modal Dialog* kustom untuk pengalaman pengguna yang lebih baik.

## Teknologi yang Digunakan

- **Core Framework:** React (v18+)
- **Build Tool:** Vite (TypeScript)
- **Styling:** CSS Modules
- **HTTP Client:** Fetch API (Native)
- **Version Control:** Git

## Persyaratan Sistem

Sebelum menjalankan proyek ini, pastikan perangkat Anda telah terinstal:
- **Node.js** (Versi LTS direkomendasikan)
- **NPM** (Node Package Manager)

## Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal:

1. **Clone Repositori**
   Unduh kode sumber ke direktori lokal Anda:
   ```bash
   git clone [https://github.com/pens-pbl/2026-ruangkampus-frontend.git](https://github.com/pens-pbl/2026-ruangkampus-frontend.git)
   cd 2026-ruangkampus-frontend

2. Instalasi Dependensi
   "npm install"

3. Konfigurasi Environment Salin file konfigurasi contoh untuk mengatur koneksi ke Backend:
   "cp .env.example .env"
   Pastikan variabel VITE_API_BASE_URL di dalam file .env sudah mengarah ke port Backend yang benar (Default: http://localhost:5273/api).

4. Menjalankan Aplikasi Jalankan server pengembangan lokal:
   "npm run dev"
   Akses aplikasi melalui peramban web di alamat: http://localhost:5173


src/components: Komponen UI yang dapat digunakan kembali (Login, Register, Modal).

src/utils: Logika utilitas seperti pengaturan tema dan format data.

src/translations: Berkas konfigurasi bahasa (i18n manual).