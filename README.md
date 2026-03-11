# Sistem Absensi PWA

Aplikasi Absensi QR Code berbasis Progressive Web App (PWA) dengan Vue.js 3, menggunakan PouchDB untuk fitur offline-first.

## Fitur

- **Login Multi-role**: Admin dan User dengan akses berbeda
- **Scan QR Code**: Absensi menggunakan QR Code scanner
- **Offline-First**: Data tersimpan lokal dan sync otomatis saat online
- **Geolokasi**: Validasi lokasi saat absensi
- **Pengajuan Cuti**: Karyawan dapat mengajukan cuti
- **Dashboard Admin**: Kelola karyawan, rekap absensi, approval cuti
- **PWA**: Dapat diinstall seperti aplikasi native

## Tech Stack

- Vue.js 3 (Composition API)
- Vite (Build tool)
- Pinia (State Management)
- Vue Router (Navigation)
- PouchDB (Offline Database)
- Tailwind CSS (Styling)
- html5-qrcode (QR Scanner)
- Vite PWA Plugin

## Instalasi

```bash
# Clone atau masuk ke direktori project
cd absensi-pwa

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

## Konfigurasi

### Environment Variables (.env)

```env
VITE_COUCHDB_URL=https://your-couchdb-server.com
VITE_COUCHDB_USERNAME=admin
VITE_COUCHDB_PASSWORD=password
VITE_APP_NAME=Sistem Absensi PWA
```

### PWA Icons

Generate icon PWA menggunakan tool seperti:
- [PWA Asset Generator](https://github.com/nickvision-apps/pwagen)
- [Real Favicon Generator](https://realfavicongenerator.net/)

Ukuran yang diperlukan:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Letakkan file PNG di folder `public/icons/` dengan nama:
- icon-72x72.png
- icon-96x96.png
- dst...

Juga tambahkan di root `public/`:
- pwa-192x192.png
- pwa-512x512.png
- apple-touch-icon.png (180x180)
- favicon.ico

## Struktur Folder

```
absensi-pwa/
├── public/
│   ├── icons/              # Ikon PWA
│   ├── favicon.ico
│   └── manifest.webmanifest
├── src/
│   ├── assets/             # CSS Global
│   ├── api/                # Database & Auth Service
│   ├── components/         # Komponen Reusable
│   ├── layouts/            # Layout Admin & User
│   ├── views/              # Halaman
│   ├── store/              # Pinia Stores
│   ├── router/             # Vue Router
│   ├── utils/              # Helper functions
│   ├── App.vue
│   └── main.js
├── .env
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Kredensial Default

Saat pertama kali dijalankan, sistem akan membuat akun admin default:

- **Email**: admin@absensi.com
- **Password**: admin123

> ⚠️ Segera ganti password setelah login pertama kali!

## Penggunaan

### User (Karyawan)

1. Login dengan akun yang sudah terdaftar
2. Dashboard menampilkan status absensi hari ini
3. Klik "Scan Absen" untuk check-in/check-out
4. Izinkan akses lokasi saat diminta
5. Ajukan cuti melalui menu "Pengajuan Cuti"

### Admin

1. Login dengan akun admin
2. Dashboard menampilkan statistik keseluruhan
3. Kelola karyawan di menu "Kelola Karyawan"
4. Lihat rekap absensi dan export ke CSV
5. Approve/reject pengajuan cuti

## Sinkronisasi Data

Aplikasi menggunakan PouchDB untuk menyimpan data secara lokal. Jika dikonfigurasi dengan CouchDB server:

- Data akan sync otomatis saat online
- Perubahan dari perangkat lain akan langsung terupdate
- Absensi yang dilakukan offline akan tersimpan dan sync saat kembali online

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## License

MIT
