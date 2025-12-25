# Cara Deploy ke Firebase Console

Projek ini sudah disiapkan untuk dideploy ke Firebase Hosting. Berikut adalah langkah-langkah yang perlu Anda lakukan:

### 1. Persiapan di Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat projek baru (contoh: `my-awesome-stream`).
3. Setelah projek dibuat, catat **Project ID** Anda.

### 2. Hubungkan Projek Lokal
1. Buka file `.firebaserc` di projek ini.
2. Ganti `YOUR_PROJECT_ID_HERE` dengan Project ID yang Anda catat tadi.

### 3. Deploy menggunakan CLI
Karena Anda di Replit, Anda bisa menjalankan perintah ini di Shell:

```bash
# Install Firebase Tools jika belum ada
npm install -g firebase-tools

# Login ke akun Google Anda (akan muncul link untuk diklik)
firebase login --no-localhost

# Jalankan perintah deploy yang sudah disiapkan
npm run deploy
```

### Catatan Penting:
- **Public Directory**: Sudah diatur ke `dist` (sesuai standar Vite).
- **Single Page App**: Sudah diatur agar semua URL mengarah ke `index.html` (penting untuk React Router).
- **Update**: Setiap kali ada perubahan kode, cukup jalankan `npm run deploy` lagi.
