Aplikasi ini terintergrasi dengan system absensi dengan Absensi Amazfit Bip 6 "dengan repository https://github.com/denisusanto94/zepapp-absensi-qrcode"

# Sistem Absensi PWA (v2.0)

Aplikasi Absensi QR Code berbasis Progressive Web App (PWA) dengan Vue.js 3, dirancang untuk efisiensi dan akurasi tinggi menggunakan teknologi offline-first dan validasi lokasi real-time.

## Fitur Unggulan (Baru di v2.0)

- **Smart QR Scanner**: Mendukung scan langsung melalui kamera atau unggah gambar dari galeri.
- **Advanced Image Cropper**: Dilengkapi fitur *crop*, *rotate*, dan *flip* untuk memudahkan pembacaan QR Code dari gambar yang diunggah.
- **Verification Box**: Dialog konfirmasi sebelum data disimpan, menampilkan hasil urai (*parse*) JSON dari QR Code.
- **OpenStreetMap Integration**: Deteksi lokasi otomatis yang akurat (Provinsi, Kota, Kecamatan, Kelurahan, Kode Pos) menggunakan API Nominatim OSM.
- **Keamanan Perangkat**: Melacak `Device ID` unik dan `Timestamp` presisi untuk setiap rekaman absensi guna mencegah kecurangan.
- **UI/UX Premium**: Desain modern menggunakan Tailwind CSS dengan animasi halus dan *loading states* yang responsif.

## Fitur Utama

- **Login Multi-role**: Akses berbeda untuk Admin dan User/Karyawan.
- **Offline-First**: Data tersimpan di IndexedDB (Dexie.js) dan sinkron otomatis saat kembali online.
- **Manajemen Absensi**: Rekap data lengkap dengan detail wilayah dan koordinat GPS.
- **Pengajuan Cuti**: Sistem pengajuan dan persetujuan cuti karyawan yang terintegrasi.
- **Instalasi PWA**: Dapat diinstal di Android, iOS, atau Desktop tanpa melalui App Store.

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (via Dexie.js / PouchDB)
- **QR Scanner**: html5-qrcode
- **Image Editor**: Cropper.js
- **Location Service**: OpenStreetMap / Nominatim API

## Instalasi

```bash
# Clone repository
git clone https://github.com/denisusanto94/absensi-vue-pwa.git
cd absensi-vue-pwa

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

## Struktur Folder

```
src/
├── api/                # Konfigurasi Database (Dexie/PouchDB)
├── components/         # Komponen UI (ScannerModal, BaseButton, dll)
├── layouts/            # Layout Navigasi Admin & User
├── store/              # State Absensi & User (Pinia)
├── utils/              # Helper Location, Formatting & QR Logic
└── views/              # Halaman Utama & Dashboard Admin
```

## Audit & Database Schema

Setiap rekaman absensi menyimpan data berikut:
- **Identitas**: `userId`, `userName`
- **Waktu**: `date`, `checkInTime`, `checkOutTime`, `timestamp`
- **Lokasi**: `latitude`, `longitude`, `provinsi`, `kota`, `kecamatan`, `kelurahan`, `kode_pos`
- **Perangkat**: `deviceid`, `userAgent`

## Browser Support

Aplikasi ini berjalan optimal pada browser modern yang mendukung Geolocation API dan Service Workers:
- Google Chrome (Desktop & Mobile)
- Safari (iOS 12+)
- Mozilla Firefox
- Microsoft Edge

## License

MIT
