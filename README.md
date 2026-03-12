Aplikasi ini terintergrasi dengan system absensi dengan Absensi Amazfit Bip 6 "dengan repository https://github.com/denisusanto94/zepapp-absensi-qrcode"

# Sistem Absensi PWA (v2.2)

Aplikasi Absensi QR Code berbasis Progressive Web App (PWA) dengan Vue.js 3, dirancang untuk efisiensi dan akurasi tinggi menggunakan teknologi offline-first dan validasi lokasi real-time.

## Fitur Unggulan (Baru di v2.2)

- **2FA Google Authenticator**: Peningkatan keamanan login dengan Otentikasi Dua Faktor (TOTP). Pengguna diwajibkan melakukan scan QR Code pada aplikasi Google Authenticator saat pertama kali login.
- **Email Recovery (Nodemailer Proxy)**: Fitur "Lupa QR Code" yang mengirimkan ulang kode QR autentikasi langsung ke email pengguna. Dilengkapi dengan **Local Mail Proxy** di server Vite guna menghindari kendala koneksi CDN/SMTP eksternal.
- **CID Image Compatibility**: Pengiriman gambar QR Code di email menggunakan metode *inline attachment* (CID) sehingga gambar muncul dengan sempurna di berbagai klien email (Gmail, Outlook, dll).
- **Global Toast System**: Notifikasi *real-time* dengan desain modern di bagian atas-tengah layar untuk memberitahukan status pengiriman email, login, dan aksi lainnya.
- **Smart QR Scanner**: Mendukung scan langsung melalui kamera atau unggah gambar dari galeri.
- **Advanced Image Cropper**: Fitur *crop*, *rotate*, dan *flip* untuk memudahkan pembacaan QR Code dari gambar yang diunggah.
- **OpenStreetMap Integration**: Deteksi lokasi otomatis yang akurat (Provinsi, Kota, Kecamatan, Kelurahan, Kode Pos).
- **Keamanan Perangkat**: Melacak `Device ID` unik dan `Timestamp` presisi untuk setiap rekaman absensi.

## Fitur Utama

- **Login Multi-role**: Akses berbeda untuk Admin dan User/Karyawan.
- **Offline-First**: Data tersimpan di IndexedDB (Dexie.js).
- **Manajemen Absensi**: Rekap data lengkap dengan detail wilayah dan koordinat GPS.
- **Manajemen Karyawan**: Admin dapat memberikan hak akses "Authenticator" kepada karyawan tertentu.
- **Instalasi PWA**: Dapat diinstal di Android, iOS, atau Desktop tanpa melalui App Store.

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API)
- **Build Tool**: Vite (with custom Email Proxy Plugin)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (via Dexie.js)
- **2FA Library**: otpauth & qrcode
- **Email Delivery**: Nodemailer (via Local Server Proxy) & SmtpJS (Fallback)
- **QR Scanner**: html5-qrcode
- **Image Editor**: Cropper.js

## Instalasi

```bash
# Clone repository
git clone https://github.com/denisusanto94/absensi-vue-pwa.git
cd absensi-vue-pwa

# Install dependencies
npm install

# Jalankan development server (Wajib untuk fitur Email Proxy)
npm run dev

# Build untuk production
npm run build
```

## Kredensial Default

Saat pertama kali dijalankan, sistem akan membuat akun admin default:

- **Email**: denisusanto94@gmail.com
- **Password**: admin123

> ⚠️ **Catatan 2FA**: Setelah memasukkan password, Anda akan diminta melakukan scan QR Code menggunakan aplikasi Google Authenticator.

## Audit & Database Schema

### Tabel Users
- `_id`, `email`, `role`, `name`, `department`, `isActive`, `is_authenticator`, `otp_secret`, `createdAt`.

### Tabel Attendance
- **Identitas**: `userId`, `userName`
- **Waktu**: `date`, `checkInTime`, `checkOutTime`, `timestamp`
- **Lokasi**: `latitude`, `longitude`, `provinsi`, `kota`, `kecamatan`, `kelurahan`, `kode_pos`
- **Perangkat**: `deviceid`, `userAgent`

## Browser Support

Aplikasi ini berjalan optimal pada browser modern yang mendukung Geolocation API, Service Workers, dan Crypto API:
- Google Chrome (Desktop & Mobile)
- Safari (iOS 12+)
- Mozilla Firefox
- Microsoft Edge

## License

MIT
