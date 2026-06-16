# Kandank Iwak

![Platform](https://img.shields.io/badge/platform-Web-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black)
![React](https://img.shields.io/badge/React-19.2.4-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-12.14.0-ffca28)
![License](https://img.shields.io/badge/license-Proprietary-red)

Aplikasi e-commerce untuk toko ikan nila segar yang menghubungkan hasil budidaya langsung ke konsumen. Menyediakan ikan segar, fillet, bibit, pakan, bumbu khas, dan paket bundling dengan sistem pemesanan online dan notifikasi WhatsApp.

![Kandank Iwak Screenshot](docs/screenshot.png)

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Struktur Folder](#struktur-folder)
- [Prasyarat](#prasyarat)
- [Instalasi dan Menjalankan](#instalasi-dan-menjalankan)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Arsitektur](#arsitektur)
- [Penggunaan](#penggunaan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Fitur Utama

### 🛒 Untuk Pelanggan

- **Katalog Produk** — Jelajahi produk berdasarkan kategori: Ikan Segar, Olahan, Budidaya, Bumbu, dan Paket Bundling
- **Detail Produk** — Halaman detail lengkap dengan spesifikasi, trust badges, breadcrumb, rekomendasi Apriori ("Sering Dibeli Bersama"), dan produk serupa
- **Keranjang Belanja** — Tambah, ubah jumlah, dan hapus produk dengan penyimpanan otomatis di browser
- **Checkout WhatsApp** — Pesanan langsung dikirim ke WhatsApp admin dengan detail lengkap
- **Lacak Pesanan** — Pantau status pesanan menggunakan kode unik (format: KI-YYYYMMDD-XXX)
- **Rekomendasi Cerdas** — Widget "Sering Dibeli Bersama" powered by algoritma Apriori
- **Pilihan Alamat** — Integrasi API wilayah Indonesia untuk pemilihan provinsi, kota, kecamatan, dan kelurahan

### 👨‍💼 Untuk Admin

- **Dashboard Analitik** — Statistik penjualan bulanan, grafik 7 hari terakhir, produk terlaris, dan pesanan terbaru
- **Manajemen Produk** — CRUD produk dengan upload gambar ke Cloudinary, atur stok, harga, dan kategori
- **Manajemen Pesanan** — Lihat semua pesanan, update status (ordered → paid → shipped → completed)
- **Manajemen Pembayaran** — Konfigurasi metode pembayaran yang tersedia
- **Analisis Apriori** — Jalankan market basket analysis untuk menemukan pola pembelian dan generate rekomendasi otomatis
- **Autentikasi** — Login admin dengan Firebase Authentication

---

## Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16.2.7 | Framework React dengan App Router |
| React | 19.2.4 | Library UI |
| Tailwind CSS | 4.x | Styling utility-first |
| React Compiler | 1.0.0 | Optimasi otomatis komponen React |

### Backend & Database

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Firebase | 12.14.0 | Authentication & Firestore database |
| Firestore | - | NoSQL database untuk produk, pesanan, transaksi |

### Services & Tools

| Teknologi | Kegunaan |
|-----------|----------|
| Cloudinary | Upload dan hosting gambar produk |
| WhatsApp API | Notifikasi pesanan ke admin |
| Wilayah Indonesia API | Data provinsi, kota, kecamatan, kelurahan |

### Development Tools

- **ESLint 9** — Linting kode
- **PostCSS** — CSS processing
- **Babel Plugin React Compiler** — Kompilasi optimasi React

---

## Struktur Folder

```
react-next-kandankiwak/
├── public/                          # Aset statis
│   ├── kandank-iwak-logo.png        # Logo utama
│   ├── logo-footer.webp             # Logo footer
│   └── payment-icon/                # Icon metode pembayaran
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (store)/                 # Route group untuk toko
│   │   │   ├── page.js              # Homepage toko
│   │   │   ├── products/            # Halaman katalog produk
│   │   │   │   ├── page.js          # Katalog dengan filter & sorting
│   │   │   │   └── [id]/            # Detail produk
│   │   │   │       ├── page.js      # Halaman detail + rekomendasi
│   │   │   │       └── layout.js    # Dynamic metadata (SEO)
│   │   │   ├── cart/                # Keranjang belanja
│   │   │   ├── checkout/            # Halaman checkout
│   │   │   └── track/               # Lacak pesanan
│   │   ├── admin/                   # Panel admin
│   │   │   ├── login/               # Halaman login
│   │   │   └── (authed)/            # Route group terproteksi
│   │   │       ├── page.js          # Dashboard admin
│   │   │       ├── products/        # CRUD produk
│   │   │       ├── orders/          # Manajemen pesanan
│   │   │       ├── transactions/    # Riwayat transaksi
│   │   │       ├── payment-methods/ # Metode pembayaran
│   │   │       └── apriori/         # Analisis Apriori
│   │   ├── api/                     # API routes
│   │   │   └── wilayah/             # Proxy API wilayah Indonesia
│   │   ├── layout.js                # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/                  # Komponen React
│   │   ├── admin/                   # Komponen khusus admin
│   │   │   ├── AdminShell.jsx       # Layout shell admin
│   │   │   ├── StatCard.jsx         # Kartu statistik
│   │   │   ├── OrderStatusBadge.jsx # Badge status pesanan
│   │   │   └── RuleChips.jsx        # Chip aturan Apriori
│   │   ├── store/                   # Komponen khusus toko
│   │   │   ├── StoreHeader.jsx      # Header toko
│   │   │   ├── StoreFooter.jsx      # Footer toko
│   │   │   ├── ProductCard.jsx      # Kartu produk
│   │   │   ├── BoughtTogether.jsx   # Widget rekomendasi Apriori
│   │   │   └── RelatedProducts.jsx  # Produk serupa (kategori sama)
│   │   └── ui/                      # Komponen UI reusable
│   │       ├── Icon.jsx             # Icon system
│   │       ├── Illo.jsx             # Ilustrasi produk
│   │       ├── Logo.jsx             # Logo komponen
│   │       ├── Wave.jsx             # Decorative wave
│   │       └── ...
│   ├── context/                     # React Context
│   │   ├── AuthContext.jsx          # State autentikasi admin
│   │   └── CartContext.jsx          # State keranjang belanja
│   └── lib/                         # Utility functions
│       ├── firebase/                # Firebase services
│       │   ├── client.js            # Firebase initialization
│       │   ├── auth.js              # Authentication helpers
│       │   ├── products.js          # CRUD produk
│       │   ├── orders.js            # Manajemen pesanan
│       │   ├── transactions.js      # Transaksi
│       │   ├── payment-methods.js   # Metode pembayaran
│       │   └── rules.js             # Aturan Apriori
│       ├── cloudinary/              # Cloudinary integration
│       │   └── upload.js            # Upload gambar
│       ├── whatsapp/                # WhatsApp integration
│       │   └── build-message.js     # Format pesan checkout
│       ├── wilayah/                 # Wilayah Indonesia
│       │   └── api.js               # API wrapper
│       ├── utils/                   # Utility umum
│       │   ├── format.js            # Format rupiah, dll
│       │   └── order-code.js        # Generator kode pesanan
│       └── sample-data.js           # Data contoh
├── .env.local.example               # Template environment variables
├── firebase.json                    # Konfigurasi Firebase
├── firestore.rules                  # Security rules Firestore
├── firestore.indexes.json           # Index Firestore
├── next.config.mjs                  # Konfigurasi Next.js
├── postcss.config.mjs               # Konfigurasi PostCSS
├── eslint.config.mjs                # Konfigurasi ESLint
└── package.json                     # Dependencies & scripts
```

---

## Prasyarat

Sebelum menjalankan project ini, pastikan sudah terinstal:

- **Node.js** >= 18.x
- **npm** >= 9.x (atau yarn/pnpm/bun)
- **Akun Firebase** — untuk membuat project dan mendapatkan konfigurasi
- **Akun Cloudinary** — untuk upload gambar produk (opsional, bisa pakai URL manual)

---

## Instalasi dan Menjalankan

### 1. Clone Repository

```bash
git clone <repository-url>
cd react-next-kandankiwak
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase Project

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan **Authentication** dengan metode Email/Password
3. Buat database **Firestore** (pilih lokasi `asia-southeast2` atau sesuai kebutuhan)
4. Deploy Firestore rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules
   ```
5. Catat konfigurasi Firebase dari: Project Settings → Your apps → SDK setup

### 4. Setup Cloudinary (Opsional)

1. Daftar di [Cloudinary](https://cloudinary.com/)
2. Buat **Upload Preset** dengan mode **Unsigned**
3. Catat Cloud Name dan Upload Preset

### 5. Konfigurasi Environment Variables

Salin file `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi nilai variabel di file `.env.local` (lihat section [Konfigurasi Environment](#konfigurasi-environment)).

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 7. Build untuk Production

```bash
npm run build
npm start
```

---

## Konfigurasi Environment

Semua variabel environment disimpan di file `.env.local` (tidak di-commit ke Git).

| Variable | Deskripsi | Contoh Nilai | Wajib |
|----------|-----------|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API key dari Firebase Console | `AIzaSy...` | Ya |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain Firebase | `myproject.firebaseapp.com` | Ya |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID Firebase | `myproject-12345` | Ya |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket Firebase | `myproject.appspot.com` | Ya |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789012` | Ya |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID Firebase | `1:123456789012:web:abc123` | Ya |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name dari Cloudinary | `mycloud` | Opsional |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset (mode Unsigned) | `unsigned_preset` | Opsional |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor WhatsApp admin (format internasional tanpa +) | `6281234567890` | Ya |

**Catatan:** 
- Variabel dengan prefix `NEXT_PUBLIC_` diakses dari browser (client-side)
- Jangan commit file `.env.local` ke repository
- Untuk Cloudinary, pastikan upload preset di-set ke mode **Unsigned**

---

## Arsitektur

### Pola Arsitektur

Aplikasi ini menggunakan **Next.js App Router** dengan pendekatan **Client-Side Rendering (CSR)** untuk sebagian besar halaman, dikombinasikan dengan **Firebase** sebagai backend-as-a-service.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router                                          │
│  ├── Route Groups: (store) untuk toko, admin untuk panel    │
│  ├── React Context: AuthContext, CartContext                 │
│  └── Components: admin/, store/, ui/                         │
├─────────────────────────────────────────────────────────────┤
│  Firebase SDK                                                │
│  ├── Authentication (login admin)                            │
│  ├── Firestore (produk, pesanan, transaksi, dll)            │
│  └── Security Rules (kontrol akses)                          │
├─────────────────────────────────────────────────────────────┤
│  External Services                                           │
│  ├── Cloudinary (upload gambar)                              │
│  ├── WhatsApp API (notifikasi checkout)                      │
│  └── Wilayah Indonesia API (data alamat)                     │
└─────────────────────────────────────────────────────────────┘
```

### Layer Utama

1. **Presentation Layer** (`src/app/`, `src/components/`)
   - Halaman dan komponen UI
   - Menggunakan React 19 dengan React Compiler untuk optimasi otomatis

2. **State Management** (`src/context/`)
   - `AuthContext` — mengelola status login admin
   - `CartContext` — mengelola keranjang belanja (persisten di localStorage)

3. **Data Access Layer** (`src/lib/firebase/`)
   - Fungsi CRUD untuk setiap collection Firestore
   - Abstraksi Firebase SDK untuk memudahkan testing dan maintenance

4. **Integration Layer** (`src/lib/cloudinary/`, `src/lib/whatsapp/`, `src/lib/wilayah/`)
   - Integrasi dengan layanan eksternal
   - Format pesan WhatsApp, upload gambar, dan data wilayah

### Firestore Collections

| Collection | Deskripsi | Akses |
|------------|-----------|-------|
| `products` | Data produk (nama, harga, stok, gambar) | Public read, Admin write |
| `orders` | Pesanan pelanggan | Public create/get, Admin list/update |
| `transactions` | Riwayat transaksi | Public create, Admin read |
| `payment_methods` | Metode pembayaran tersedia | Public read, Admin write |
| `rules` | Aturan Apriori (rekomendasi) | Public read, Admin write |

---

## Penggunaan

### Alur Pelanggan

1. **Browse Produk** — Buka homepage, lihat produk unggulan atau jelajahi berdasarkan kategori
2. **Lihat Detail Produk** — Klik produk untuk melihat detail lengkap: spesifikasi, rekomendasi "Sering Dibeli Bersama", dan produk serupa
3. **Tambah ke Keranjang** — Pilih jumlah, klik "Tambah ke Keranjang" atau "Beli Sekarang"
4. **Review Keranjang** — Klik icon keranjang di header, ubah jumlah atau hapus produk
5. **Checkout** — Isi data pengiriman (nama, alamat, kontak), pilih metode pembayaran
6. **Konfirmasi via WhatsApp** — Klik "Pesan via WhatsApp", pesan otomatis terkirim ke admin
7. **Lacak Pesanan** — Gunakan kode pesanan (KI-YYYYMMDD-XXX) untuk cek status

### Alur Admin

1. **Login** — Buka `/admin/login`, masukkan email dan password
2. **Dashboard** — Lihat statistik penjualan, produk terlaris, dan pesanan terbaru
3. **Kelola Produk** — Menu "Produk" untuk tambah, edit, atau nonaktifkan produk
4. **Proses Pesanan** — Menu "Pesanan" untuk update status (ordered → paid → shipped → completed)
5. **Analisis Apriori** — Menu "Apriori" untuk jalankan analisis dan generate rekomendasi

### Membuat Admin Pertama

1. Buka Firebase Console → Authentication → Users
2. Klik "Add user", masukkan email dan password
3. User ini bisa login ke `/admin/login`

---

## Kontribusi

### Branch Naming Convention

- `feature/nama-fitur` — untuk fitur baru
- `fix/nama-bug` — untuk perbaikan bug
- `hotfix/nama-hotfix` — untuk perbaikan kritis di production

### Commit Message Format

Gunakan format konvensional:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Contoh:
- `feat(store): tambah filter produk berdasarkan kategori`
- `fix(checkout): perbaiki validasi nomor WhatsApp`
- `docs(readme): update instruksi instalasi`

### Langkah Berkontribusi

1. Fork repository
2. Clone fork: `git clone <your-fork-url>`
3. Buat branch baru: `git checkout -b feature/nama-fitur`
4. Commit perubahan: `git commit -m "feat: deskripsi fitur"`
5. Push ke fork: `git push origin feature/nama-fitur`
6. Buat Pull Request ke repository utama

---

## Lisensi

© 2026 Kandank Iwak. All rights reserved.

Aplikasi ini adalah proprietary software. Dilarang mendistribusikan, memodifikasi, atau menggunakan kode ini untuk tujuan komersial tanpa izin tertulis dari pemilik.
