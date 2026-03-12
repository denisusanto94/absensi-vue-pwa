Aplikasi ini terintergrasi dengan system absensi dengan Absensi Amazfit Bip 6 "dengan repository https://github.com/denisusanto94/zepapp-absensi-qrcode"

# Sistem Absensi PWA (v2.3)

Aplikasi Absensi QR Code berbasis Progressive Web App (PWA) dengan Vue.js 3, dirancang untuk efisiensi dan akurasi tinggi menggunakan teknologi offline-first dan validasi lokasi real-time.

## Fitur Unggulan (Baru di v2.3)

- **Unified Verification Box**: Peningkatan alur absensi di mana hasil scan kamera maupun unggahan gambar dari galeri sama-sama akan menampilkan **Confirmation Box** terlebih dahulu. Pengguna dapat memverifikasi data QR dan lokasi OSM sebelum data disimpan.
- **Hash Mode Routing**: Menggunakan `createWebHashHistory` untuk menjamin stabilitas navigasi di server produksi tanpa memerlukan konfigurasi khusus pada *web server* (mencegah error 404 saat refresh).
- **Admin 2FA Bypass**: Fitur khusus bagi administrator untuk masuk ke sistem tanpa token 2FA dalam keadaan darurat atau untuk akses cepat.
- **2FA Google Authenticator**: Keamanan login menggunakan TOTP (Otentikasi Dua Faktor).
- **Email Recovery (Nodemailer Proxy)**: Fitur kirim ulang QR Code ke email dengan dukungan **Local Mail Proxy** dan **CID Images** agar gambar QR muncul sempurna di inbox (Gmail/Outlook).
- **Global Toast System**: Notifikasi status aksi (sukses/gagal) yang elegan di bagian atas-tengah layar.
- **Advanced Image Cropper**: Mendukung prapemrosesan gambar QR dari galeri untuk tingkat pembacaan (*parsing*) yang lebih akurat.
- **OpenStreetMap Integration**: Deteksi lokasi otomatis (Provinsi, Kota, Kecamatan, Kelurahan, Kode Pos).

## Fitur Utama

- **Login Multi-role**: Akses berbeda untuk Admin dan User/Karyawan.
- **Offline-First**: Sinkronisasi data otomatis via IndexedDB (Dexie.js).
- **Manajemen Absensi**: Rekap data lengkap dengan metadata perangkat (`Device ID` & `User Agent`).
- **Instalasi PWA**: Mendukung instalasi sebagai aplikasi mandiri di Android/iOS/Desktop.

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **Router**: Vue Router 4 (Hash Mode)
- **State Management**: Pinia
- **Database**: IndexedDB (Dexie.js)
- **Email Delivery**: Nodemailer & SmtpJS
- **QR Scanner**: html5-qrcode
- **Location Service**: OpenStreetMap / Nominatim API

## Instalasi & Deployment

```bash
# Clone & Install
git clone https://github.com/denisusanto94/absensi-vue-pwa.git
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

**Catatan Produksi**: Hasil build di dalam folder `dist` sudah menyertakan file `.htaccess` untuk kompatibilitas server Apache.

## Kredensial Default

Saat pertama kali dijalankan, sistem membuat akun admin default:

- **Email**: denisusanto94@gmail.com
- **Password**: admin123

> ⚠️ **Catatan 2FA**: Admin memiliki opsi tombol khusus untuk **Login Langsung Tanpa 2FA** pada layar autentikasi tahap kedua.

## Audit & Database Schema

### Tabel Users
- `_id`, `email`, `role`, `name`, `department`, `isActive`, `is_authenticator`, `otp_secret`.

### Tabel Attendance
- **Identitas**: `userId`, `userName`
- **Waktu**: `date`, `checkInTime`, `checkOutTime`, `timestamp`
- **Lokasi**: `latitude`, `longitude`, `provinsi`, `kota`, `kecamatan`, `kelurahan`, `kode_pos`
- **Perangkat**: `deviceid`, `userAgent`

## License

MIT
