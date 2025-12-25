# 🚀 Panduan Deployment ke Firebase Hosting

## Status Project Anda
✅ **Dzeck Stream** - Siap deploy  
- Build size: **273.96 KB** (83.96 KB gzipped)
- Platform: **Firebase Hosting**
- Folder build: `dist/` (sudah tersedia)

---

## 📋 Step 1: Persiapan Awal

### Pastikan Anda memiliki:
1. **Google Account** (gunakan https://console.firebase.google.com)
2. **Node.js** (sudah terinstal di Replit)
3. **Akses ke project Firebase** yang Anda inginkan

---

## 🔧 Step 2: Install Firebase CLI & Setup

### A. Login ke Firebase (di terminal Replit):
```bash
npm install -g firebase-tools
firebase login
```
Ini akan membuka browser untuk login dengan Google account Anda.

### B. Initialize Firebase Project:
```bash
firebase init hosting
```

**Jawab pertanyaan seperti ini:**
```
? What do you want to use as your public directory? → dist
? Configure as a single-page app (rewrite all urls to index.html)? → Yes
? Set up automatic builds and deploys with GitHub? → No
```

Ini akan membuat 2 file:
- `firebase.json` (konfigurasi deployment)
- `.firebaserc` (konfigurasi project)

---

## 🏗️ Step 3: Build & Deploy

### A. Build project untuk production:
```bash
npm run build
```
✓ Hasilnya ada di folder `dist/`

### B. Deploy ke Firebase:
```bash
firebase deploy --only hosting
```

**Output yang Anda lihat:**
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/_/overview
Hosting URL: https://dzeck-stream-xxxxx.web.app
```

---

## ✨ Hasil Akhir

Setelah deploy selesai, app Anda bisa diakses di:
- **Production URL**: `https://your-project-name.web.app`
- **Alternate URL**: `https://your-project-name.firebaseapp.com`

---

## 🔄 Update & Redeploy

Setiap kali ada perubahan:
```bash
npm run build    # Build ulang
firebase deploy  # Deploy ulang ke Firebase
```

---

## 📝 Konfigurasi Firebase (firebase.json)

File `firebase.json` akan terlihat seperti:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Ini penting untuk **single-page app** seperti React dengan React Router.

---

## 🚨 Tips Penting

1. **Jangan commit** `node_modules/` (sudah ada di .gitignore ✓)
2. **Jangan push** `.env` files (sudah ada di .gitignore ✓)
3. **Build selalu** sebelum deploy: `npm run build`
4. **Check browser** bahwa app berjalan di production URL
5. **Test semua routes** (Home, Search, Trending, Indo Dub, Detail, Player)

---

## 🆘 Troubleshooting

### Build gagal?
```bash
npm install  # Install ulang dependencies
npm run build
```

### Deploy gagal "permission denied"?
```bash
firebase logout
firebase login  # Login ulang
```

### App tidak loading?
1. Check console browser (F12 > Console tab)
2. Pastikan `firebase.json` ada `rewrites` untuk single-page app
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Informasi Project

**Tech Stack:**
- React 19 + TypeScript
- Vite 6
- React Router DOM
- Tailwind CSS (CDN)
- Lucide React Icons

**Performance:**
- Build time: ~11s
- Gzip size: ~84 KB
- Network: Responsive HLS streaming

---

**Siap deploy? 🎉 Gunakan panduan di atas dan app Anda akan live dalam 5 menit!**
