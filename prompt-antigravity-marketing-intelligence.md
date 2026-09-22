# Prompt buat Antigravity — Update iseeyou-marketing-intelligence.vercel.app

Copy-paste blok di bawah ini langsung ke Antigravity.

---

## CONTEXT

Kamu akan meng-update web app yang sudah live di **https://iseeyou-marketing-intelligence.vercel.app/**.
Sebelum ngerjain apapun, **audit dulu struktur repo yang ada sekarang** (stack, routing, auth, DB schema, komponen dashboard yang sudah ada) supaya semua fitur baru nyambung sama arsitektur yang sudah jalan, bukan nambah stack baru yang tumpang tindih.

App ini dashboard internal marketing untuk brand optik "I See You" dengan 4 cabang aktif: **Purwokerto, Wonosobo, Purbalingga, Cilacap** — dan sekarang nambah **Tegal** sebagai cabang ke-5 di bagian resume report (kalau Tegal belum ada data operasional lain, cukup masukin ke struktur resume-per-cabang dulu).

Website utama yang datanya mau ditrack: **optikiseeyou.com**

---

## FITUR YANG DITAMBAHIN

### 1. Google Search Console — Click Report
- Integrasi GSC API (Search Analytics: Query) buat narik data klik ke optikiseeyou.com.
- Breakdown per **asal/lokasi klik** (dimension: country/region) dan **jumlah klik**.
- Analisis per bulan (1 bulan penuh), dengan toggle tampilan **Mingguan / Bulanan**.
- Setup: service account GCP + verifikasi domain optikiseeyou.com di GSC, credentials disimpan di env var (jangan hardcode).

### 2. Resume Report per Cabang
- Section ringkasan (resume) yang di-breakdown per cabang: **Purwokerto, Wonosobo, Purbalingga, Cilacap, Tegal**.
- Tiap cabang nunjukkin ringkasan klik web + performa TikTok cabang tsb dalam satu card/tab.

### 3. TikTok Analytics per Cabang
- Tambah section analisis TikTok: konten mana yang **lagi rame (trending)** vs yang **kurang performa**.
- Akun TikTok per cabang (update, termasuk akun baru Cilacap):
  - Purwokerto: https://www.tiktok.com/@iseeyouglasses
  - Cilacap (akun baru): https://www.tiktok.com/@i.see.you.cilacap
  - Purbalingga: https://www.tiktok.com/@iseeyou.purbalingga
  - Wonosobo: https://www.tiktok.com/@iseeyou.wonosobo
- **Catatan penting**: TikTok gak punya public API resmi buat narik analytics akun orang lain secara bebas. Opsi realistis:
  - Kalau akun-akun ini sudah/bisa didaftarin ke **TikTok for Business / Creator Marketplace API** dengan akses admin, pakai itu buat data resmi (views, likes, share, trending post).
  - Kalau belum ada akses API resmi, buat dulu **module input manual/semi-otomatis** (form update mingguan: link post, views, likes, comment, share) sebagai fallback, dengan struktur data yang sama supaya gampang di-swap ke API resmi nanti.
- Tentukan mana yang paling feasible duluan dan kasih rekomendasi ke user sebelum lanjut coding kalau aksesnya belum jelas.

### 4. Tracking Klik "Antrian Cek Mata" di optikiseeyou.com
- Tambahin event tracking (mis. custom event via GA4 atau tracking internal ke DB) khusus di tombol/CTA **"Antrian Cek Mata"** di optikiseeyou.com.
- Data ini masuk ke dashboard marketing-intelligence sebagai metric terpisah (jumlah klik antrian, per hari/minggu/bulan, per cabang kalau device/session bisa dikaitkan ke cabang).

### 5. Modul Aftersales
- Tambah section **Aftersales** ke dalam sistem, nyambung ke data existing (rekam customer / order) kalau relevan.
- Minimal: daftar customer yang perlu follow-up aftersales, status (belum dihubungi / sudah dihubungi / selesai), catatan.

### 6. Drill-down Dashboard → Detail per Orang
- Dari dashboard utama, tiap baris/klik "per orang" bisa diklik dan masuk ke halaman **detail lengkap** orang tsb (riwayat klik, interaksi, status aftersales, dll — sesuaikan sama data yang tersedia).

### 7. Task Tambahan: Design Grafis Feed untuk Yanuar
- Tambah item/task tracker khusus **"Design Grafis Feed"** yang di-assign ke **Yanuar**, masuk ke bagian task/planner yang ada di dashboard (kalau belum ada modul task, buat section sederhana: judul task, assignee, status, deadline).

### 8. Keamanan — Password Protection untuk Data Sensitif
Dashboard ini mau dishare ke grup/tim biar semua bisa akses data operasional — tapi ada 2 bagian yang **harus digembok terpisah**:
- **Bagian Finance & Bonus**: butuh password/kredensial terpisah sebelum bisa diakses.
- **Bagian Report** (laporan performa/analitik yang lebih sensitif): juga butuh password/kredensial terpisah.

Implementasi yang disarankan:
- Buat **route-level auth guard** (middleware) khusus untuk `/finance`, `/bonus`, dan `/report` (atau path yang sesuai struktur project).
- Password/kredensial disimpan **hashed** (bcrypt/argon2), bukan plaintext, dan bisa beda dari akun login utama (login utama = akses dashboard umum, password tambahan = akses section sensitif).
- Session/cookie khusus untuk section sensitif ini, dengan expiry wajar (mis. re-prompt tiap sekian jam atau tiap sesi baru).
- Kalau dashboard belum punya sistem login sama sekali, buat dulu auth dasar (NextAuth atau sejenisnya sesuai stack yang dipakai) sebelum nambah lapisan password kedua ini.
- Tujuannya: seluruh tim bisa akses dashboard umum secara adil, tapi data finance/bonus dan report tetap aman dan cuma bisa diakses yang punya kredensial tambahan.

---

## URUTAN PENGERJAAN YANG DISARANKAN
1. Audit repo & struktur data yang sudah ada.
2. Setup auth dasar (kalau belum ada) + auth guard untuk Finance/Bonus/Report.
3. Integrasi GSC (click report + toggle mingguan/bulanan).
4. Resume report per cabang (5 cabang termasuk Tegal).
5. Tracking klik "Antrian Cek Mata".
6. Modul TikTok analytics (tentukan dulu jalur API resmi vs input manual).
7. Modul Aftersales.
8. Drill-down detail per orang dari dashboard.
9. Task tracker item untuk Yanuar (design grafis feed).
10. QA menyeluruh + testing akses password di section sensitif.

Kasih laporan progress per tahap, dan tandain kalau ada blocker (terutama soal akses TikTok API resmi) sebelum lanjut ke tahap berikutnya.
