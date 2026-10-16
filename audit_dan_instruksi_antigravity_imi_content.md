# Audit Total & Master Prompt Antigravity (v2 - Full System): Perbaikan `/dashboard`, Filter Cabang Global, Halaman Finance & Report Berpassword, serta Akurasi Live Sync `/content` (`Yoshput/IMI`)

Dokumen ini adalah pembaruan menyeluruh (**v2 - Full System Overhaul**) untuk repositori [Yoshput/IMI](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FYoshput%2FIMI) yang dideploy di [Optik I See You Marketing Intelligence (/dashboard)](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fdashboard) dan [Evaluasi Kinerja Konten (/content)](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fcontent). Dokumen ini dirancang khusus sebagai instruksi eksekusi lengkap beserta kode referensi siap pakai untuk **Antigravity (Model: Gemini 3.8 Flash - High)** agar tidak terjadi lagi kesalahan pengambilan data, kesalahan pencampuran tanggal konten lama ke tab Mingguan, maupun tombol/filter cabang yang mati.

## 1. Jawaban Audit: Mengapa Fitur Bermasalah & Ke Mana Perginya Halaman Finance / Report Berpassword?

Berdasarkan hasil pemeriksaan terhadap [Dashboard Utama (/dashboard)](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fdashboard), halaman [Evaluasi Kinerja Konten (/content)](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fcontent), dan struktur repositori [Yoshput/IMI](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FYoshput%2FIMI), berikut adalah penyebab pasti dari 3 masalah utama yang Anda temukan:

| Masalah yang Ditemukan | Penyebab Teknis di Kode (`Yoshput/IMI`) | Solusi Perbaikan Permanen |
| :--- | :--- | :--- |
| **1. Dropdown `Semua Cabang (5)` di `/dashboard` (Purwokerto Pusat, Purbalingga, Cilacap, Wonosobo, Lunar Tegal) Tidak Ada Bedanya Saat Dipilih** | State dropdown cabang di Header atas bersifat terisolasi atau tidak dihubungkan ke komponen metrik di `/dashboard`. Selain itu, terdapat **ketidakcocokan penamaan string cabang** antara opsi dropdown (`"Purwokerto Pusat"`, `"Lunar Tegal"`) dengan data PIC/Sheet (`"Purwokerto (Pusat)"`, `"Lunar Eyewear Tegal"`, `"Lunar Tegal (Second Brand)"`). Akibatnya, angka `18 video reels`, `92 story IG`, dan 6 kartu PIC (`Nuha`, `Ilya`, `Ajun`, `Amanda`, `Arum`, `Febi`) tetap menampilkan angka konsolidasi statis meskipun cabang diubah. | Buat `BranchContext` global dengan **Canonical Branch ID** (`all`, `purwokerto`, `purbalingga`, `cilacap`, `wonosobo`, `lunar_tegal`). Hubungkan seluruh halaman (`/dashboard`, `/content`, `/finance`, `/report`) ke `BranchContext` sehingga memilih 1 cabang otomatis memfilter kartu PIC, kuota post, jumlah Reels, jumlah Story, dan tabel ke cabang tersebut saja. |
| **2. Halaman `Finance` & `Report` yang Menggunakan Proteksi Password Hilang** | Saat perombakan navigasi atas menjadi 5 menu dropdown *B2B Command Center* (`Eksekutif & Rekap`, `Sosial & Konten`, `Riset & Pertumbuhan`, `Kemitraan & Pelanggan`, `Proposal B2B`), tautan menu menuju rute **Finance** dan **Executive/Financial Report Berpassword (`🔒`)** tidak dimasukkan ke array navigasi utama atau tertimpa oleh rute baru. | Kembalikan rute `/finance` dan `/report` (beserta komponen **Password Gate Modal / PIN Lock**), lalu pasang menu aksesnya secara jelas di Navbar atas (baik di dalam dropdown `Eksekutif & Rekap` maupun sebagai tombol khusus `Finance & Report 🔒` di bar navigasi utama). |
| **3. Kesalahan Antigravity di Perbaikan Kedua pada Halaman `/content` (Salah Ambil Data & Salah Periode Mingguan vs Rekor Lama)** | Pada grid profil Instagram ([@lunareyewear.co](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Flunareyewear.co%2Freels%2F), [@iseeyou.glasses](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.glasses%2Freels%2F), [@iseeyou.purbalingga](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.purbalingga%2Freels%2F)), baris paling atas memuat **Pinned Reels (sematan lama)** seperti video `5.4M` views (terbit 2 Juli 2025) dan video helm `1.8M` views (terbit 19 Juni 2026). Antigravity sebelumnya memasukkan video lama tersebut ke tab **Mingguan** dengan tanggal palsu, lalu pada perbaikan kedua justru memotong/merusak struktur data saat mencoba memisahkannya. | Gunakan tanggal unggah asli (`taken_at_timestamp` / `publishDate`) dari setiap post Instagram dan pisahkan secara ketat ke 3 tab periode: **1) `Mingguan (7 Hari Terakhir)`** khusus post yang terbit dalam 7 hari terakhir, **2) `Bulanan (September–Oktober 2026)`**, dan **3) `Semua Waktu / All-Time (Rekor Viral)`** untuk menampung seluruh konten termasuk Pinned Reels jutaan views dengan tanggal aslinya. |

## 2. Daftar Lengkap Fitur, Tombol, dan Halaman yang Wajib Berfungsi 100%

Agar tidak ada lagi komponen yang sekadar pajangan (*dummy UI*), berikut adalah daftar komponen di seluruh aplikasi yang wajib diaktifkan oleh Antigravity:

1. **Global Header & Navbar (Semua Halaman)**:
   - **Dropdown Cabang Global (`Semua Cabang (5)`)**: Mengubah seluruh isi halaman aktif (`/dashboard`, `/content`, `/finance`, `/report`, dll.) secara reaktif sesuai cabang yang dipilih (`Semua Cabang`, `Purwokerto Pusat`, `Purbalingga`, `Cilacap`, `Wonosobo`, `Lunar Tegal`).
   - **Menu `Finance & Report 🔒`**: Menampilkan halaman keuangan dan laporan eksekutif yang dilindungi **Password Gate Modal** (user harus memasukkan password yang benar sebelum data terbuka, lengkap dengan tombol *Lock / Kunci Kembali*).
   - **Tombol `Cari ⌘K`**: Membuka Command Palette / Modal Pencarian cepat untuk mencari konten, nama PIC (`Nuha`, `Ilya`, `Ajun`, `Amanda`, `Arum`, `Febi`), cabang, atau halaman.
   - **Toggle Dark/Light Mode**: Mengubah tema warna aplikasi secara penuh dan menyimpannya di `localStorage`.
2. **Halaman `/dashboard` ([Marketing Performance](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fdashboard))**:
   - **Badge Target Output & Target Kuota**: Menghitung ulang rasio realisasi per cabang saat filter cabang diubah (misalnya saat memilih `Purwokerto Pusat`, hanya menghitung kuota & realisasi Purwokerto).
   - **Tombol `Sinkronkan Spreadsheet`**: Memicu `POST /api/sync-sheets` secara riil, menampilkan animasi loading, memperbarui angka dari Google Sheets, dan memunculkan *toast notification* status sinkronisasi.
   - **Tombol `Buka Rekap Lengkap ->`**: Membuka halaman/modal rekapitulasi lengkap seluruh siklus dan cabang.
   - **6 Kartu PIC (`Nuha`, `Ilya`, `Ajun`, `Amanda`, `Arum`, `Febi`)**: Saat salah satu kartu PIC diklik, membuka **Drawer / Modal Audit Detail PIC** yang menampilkan riwayat konten PIC tersebut, status kelengkapan laporan harian, kendala/keluhan, dan tombol kirim pengingat via WhatsApp. Saat cabang difilter di atas, hanya kartu PIC dari cabang tersebut yang ditampilkan (atau di-highlight).
   - **Kartu Metrik Kunci (`Produksi Reels Terverifikasi`, `Produksi Story`, dll.)**: Angka utama, persentase pertumbuhan, dan teks keterangan di bawahnya berubah dinamis mengikuti cabang yang dipilih.
3. **Halaman `/content` ([Evaluasi Kinerja Konten](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fcontent))**:
   - **3 Tab Periode yang Ketat & Akurat**:
     - `Mingguan (7 Hari Terakhir)`: Hanya menampilkan konten yang benar-benar diunggah dalam 7 hari terakhir (diurutkan dari views/reach tertinggi minggu ini).
     - `Bulanan (30 Hari / Sep–Okt 2026)`: Menampilkan konten yang diunggah sepanjang September–Oktober 2026.
     - `Semua Waktu / All-Time (Rekor Viral)`: Menampilkan seluruh konten sepanjang masa termasuk Pinned Reels jutaan views dari [@lunareyewear.co](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Flunareyewear.co%2Freels%2F) (`5.4M`, `1.8M`, `640K`, `194K` views) dengan tanggal terbit aslinya.
   - **4 Tab Format (`Semua Format`, `Reels`, `Carousel`, `Feed Single`)**: Semuanya terisi data nyata tanpa judul placeholder `"Carousel [Cabang] ([Tanggal])"` dan tanpa nilai `0` palsu.
   - **Filter Cabang & Kartu Rank #1 Top Performer**: Sinkron dengan filter cabang global di atas maupun filter cabang di tabel, sehingga **Rank #1 Top Performer** langsung menampilkan juara #1 sesuai periode, cabang, dan format yang sedang aktif.

## 3. Master Prompt Eksekusi Lengkap untuk Antigravity (Model: Gemini 3.8 Flash - High)

Salin seluruh blok kode di bawah ini dan tempelkan langsung ke **Antigravity** (pastikan menggunakan model **Gemini 3.8 Flash - High**):

```markdown
# INSTRUKSI EKSEKUSI TOTAL (SYSTEM OVERHAUL) — REPOSITORI `Yoshput/IMI`
**Target Model**: Gemini 3.8 Flash - High
**Aturan Keras (STRICT RULES)**:
1. DILARANG KERAS mengarang tanggal unggah (`publishDate`) palsu atau memasukkan video lama/Pinned Reels (seperti video tahun 2025 atau Juni 2026) ke dalam tab `Mingguan (7 Hari Terakhir)`.
2. DILARANG KERAS membiarkan dropdown cabang, tombol, atau kartu PIC menjadi UI statis/pajangan. Semua filter dan tombol WAJIB fungsional 100%.
3. Eksekusi seluruh langkah di bawah ini secara berurutan sampai tuntas dan pastikan `npm run build` sukses tanpa error.

---

## BAGIAN 1: PERBAIKI GLOBAL BRANCH SELECTOR (`Semua Cabang (5)`) & HALAMAN `/dashboard`

### Masalah Saat Ini:
Di halaman `/dashboard` (dan halaman lainnya), ketika user mengubah dropdown atas dari `Semua Cabang (5)` ke `Purwokerto Pusat`, `Purbalingga`, `Cilacap`, `Wonosobo`, atau `Lunar Tegal`, tampilan halaman TIDAK BERUBAH sama sekali. Selain itu, penamaan cabang di dropdown (`"Purwokerto Pusat"`, `"Lunar Tegal"`) tidak cocok dengan nama cabang di data (`"Purwokerto (Pusat)"`, `"Lunar Eyewear Tegal"`, `"Lunar Tegal (Second Brand)"`).

### Tindakan & Kode Referensi Wajib:
1. **Buat Normalisasi & Global Branch Context (`lib/branch-accounts.ts` & `context/BranchContext.tsx`)**:
   Gunakan fungsi normalisasi kanonik berikut di seluruh aplikasi (baik di `/dashboard`, `/content`, `/finance`, maupun `/report`):
   ```ts
   export type CanonicalBranchId = "all" | "purwokerto" | "purbalingga" | "cilacap" | "wonosobo" | "lunar_tegal";

   export function normalizeBranchId(raw?: string | null): CanonicalBranchId {
     if (!raw) return "all";
     const s = raw.toLowerCase().trim();
     if (s.includes("semua") || s === "all") return "all";
     if (s.includes("purwokerto") || s.includes("pwt") || s.includes("iseeyou.glasses")) return "purwokerto";
     if (s.includes("purbalingga") || s.includes("pbg") || s.includes("iseeyou.purbalingga")) return "purbalingga";
     if (s.includes("cilacap") || s.includes("clp") || s.includes("iseeyou.cilacap")) return "cilacap";
     if (s.includes("wonosobo") || s.includes("wns") || s.includes("iseeyou.wonosobo")) return "wonosobo";
     if (s.includes("lunar") || s.includes("tegal") || s.includes("tgl") || s.includes("lunareyewear")) return "lunar_tegal";
     return "all";
   }

   export function matchesBranch(itemBranch: string, selectedBranch: string): boolean {
     const target = normalizeBranchId(selectedBranch);
     if (target === "all") return true;
     return normalizeBranchId(itemBranch) === target;
   }
   ```
   - Simpan `selectedBranchId` di `BranchContext` global (dan sinkronkan dengan URL query param `?branch=...` serta `localStorage`) agar saat user memilih cabang di Header atas, seluruh halaman (`/dashboard`, `/content`, `/finance`, `/report`) langsung bereaksi secara real-time.

2. **Buat `/dashboard` 100% Dinamis Mengikuti Cabang yang Dipilih**:
   - Saat `selectedBranchId === "all"`, tampilkan konsolidasi 5 cabang (6 PIC: `Nuha` & `Ilya` untuk Purwokerto, `Ajun` untuk Purbalingga, `Amanda` untuk Lunar Tegal, `Arum` untuk Cilacap, `Febi` untuk Wonosobo).
   - Saat user memilih 1 cabang spesifik (misalnya `Purwokerto Pusat` -> `"purwokerto"`):
     - Filter daftar kartu PIC dengan `matchesBranch(pic.branch, selectedBranch)` sehingga hanya menampilkan PIC cabang tersebut (Purwokerto: `Nuha` & `Ilya`; Purbalingga: `Ajun`; Lunar Tegal: `Amanda`; Cilacap: `Arum`; Wonosobo: `Febi`).
     - Hitung ulang badge **Target Output** (misal per cabang target 3 atau 4 post/minggu vs realisasi), **Target Kuota %**, kartu **Produksi Reels Terverifikasi**, **Produksi Story**, serta seluruh metrik dan grafik di `/dashboard` khusus untuk cabang yang dipilih!
     - Ubah teks sub-header dan judul metrik agar mencantumkan nama cabang yang sedang aktif.

3. **Aktifkan Semua Tombol & Interaksi di `/dashboard`**:
   - **6 Kartu PIC (`Nuha`, `Ilya`, `Ajun`, `Amanda`, `Arum`, `Febi`)**: Saat diklik, buka Modal/Drawer **Audit Detail PIC** yang menampilkan daftar konten yang diunggah PIC tersebut, tanggal laporan terakhir, catatan kendala/keluhan dari Sheet, dan tombol aksi langsung (termasuk tombol buka Google Sheet & pengingat WhatsApp).
   - **Tombol `Sinkronkan Spreadsheet`**: Hubungkan ke endpoint `POST /api/sync-sheets`, tampilkan spinner saat loading, perbarui data di layar, dan tampilkan toast konfirmasi berisi timestamp terbaru.
   - **Tombol `Buka Rekap Lengkap ->`**: Arahkan ke bagian/modal tabel rekapitulasi lengkap lintas siklus atau halaman laporan detail.
   - **Tombol `Cari ⌘K`**: Pastikan saat diklik (atau menekan `Ctrl+K` / `Cmd+K`) membuka modal pencarian interaktif yang bisa mencari halaman, cabang, PIC, dan judul konten, lalu mengarahkan user saat hasil diklik.

---

## BAGIAN 2: KEMBALIKAN HALAMAN `FINANCE` & `REPORT` BERPASSWORD (`🔒`)

### Masalah Saat Ini:
Sebelumnya terdapat fitur/halaman **Finance** dan **Report** yang mengharuskan user memasukkan **Password** terlebih dahulu sebelum bisa masuk dan melihat data. Saat ini menu/halaman tersebut hilang dari navigasi.

### Tindakan & Kode Referensi Wajib:
1. **Cek & Pulihkan Rute `/finance` dan `/report` (atau `/reports`)**:
   - Periksa seluruh file di `app/`, `features/`, `components/`, dan riwayat git (`git log --stat`) untuk menemukan komponen Finance, Executive Report, atau Password Gate yang pernah ada.
   - Pastikan rute `app/finance/page.tsx` dan `app/report/page.tsx` tersedia, lengkap, dan terhubung ke `BranchContext` (ikut terfilter saat dropdown cabang diubah).
2. **Pasang Proteksi Password (`components/auth/PasswordGate.tsx`)**:
   - Bungkus halaman **Finance** dan **Report Rahasia** dengan komponen `PasswordGate` yang meminta password sebelum menampilkan data sensitif:
     - Simpan status autentikasi di `sessionStorage.getItem("imi_confidential_unlocked") === "true"`.
     - Sediakan tombol **`Kunci Kembali 🔒`** di pojok kanan atas halaman Finance & Report untuk mengunci ulang kapan saja.
     - Tampilkan petunjuk/validasi password yang jelas dan dukung konfigurasi via `NEXT_PUBLIC_FINANCE_PASSWORD` dengan fallback password manajemen bawaan yang sudah pernah digunakan di repo (cek commit history untuk password eksisting, serta dukung kode akses manajemen seperti `iseeyou2026` / `admin123` / password asli di git history).
3. **Tampilkan Kembali di Navbar Atas**:
   - Tambahkan menu **`Finance 🔒`** (`/finance`) dan **`Report Eksekutif 🔒`** (`/report`) secara jelas di Navbar atas (masukkan di bawah menu `Eksekutif & Rekap` DAN tampilkan juga link cepat berikon gembok `🔒 Finance & Report` di bar navigasi atas agar langsung terlihat oleh user).

---

## BAGIAN 3: PERBAIKI TOTAL DATA & FILTER PERIODE DI HALAMAN `/content` (JANGAN SAMPAI SALAH AMBIL DATA LAGI!)

### Akar Masalah Kegagalan Sebelumnya di `/content`:
Pada perbaikan sebelumnya, kamu melakukan kesalahan fatal:
1. Kamu memasukkan video Pinned/lama dari `@lunareyewear.co` (seperti `"cewek + makeup + kacamata ="` 5.4M views yang diunggah **2 Juli 2025** dan video helm 1.8M views yang diunggah **19 Juni 2026**) ke dalam tab **Mingguan (Terbaru)** dengan tanggal palsu.
2. Ketika diminta memperbaiki pemisahan periode Mingguan vs Lama, filter yang kamu buat justru membuat data konten terbaru di ke-5 cabang tidak sinkron dengan kondisi real di Instagram.

### Aturan Pengambilan Data & Pemisahan Periode yang WAJIB Diikuti di `/content`:

1. **Tarik Data Real & Tanggal Unggah Asli (`taken_at_timestamp` / `publishDate`) dari 5 Akun Instagram**:
   - Ke-5 akun resmi cabang adalah:
     1. Purwokerto (Pusat): `https://www.instagram.com/iseeyou.glasses/` (`@iseeyou.glasses`)
     2. Purbalingga: `https://www.instagram.com/iseeyou.purbalingga/` (`@iseeyou.purbalingga`)
     3. Wonosobo: `https://www.instagram.com/iseeyou.wonosobo/` (`@iseeyou.wonosobo`)
     4. Cilacap: `https://www.instagram.com/iseeyou.cilacap/` (`@iseeyou.cilacap`)
     5. Lunar Eyewear Tegal: `https://www.instagram.com/lunareyewear.co/` (`@lunareyewear.co`)
   - Untuk setiap post (`Reels`, `Carousel`, `Feed Single`), ambil **tanggal publikasi asli** (`publishDate` dalam format `YYYY-MM-DD` berdasarkan `taken_at_timestamp` dari JSON profil/embed Instagram atau tanggal di Google Sheets jika valid). **JANGAN PERNAH menebak tanggal dari urutan baris pertama grid Instagram**, karena 3 item pertama di grid Instagram adalah **Pinned Post (Sematkan)** dari bulan/tahun lalu!
   - Tandai post yang disematkan di profil dengan flag `isPinned: true`.

2. **Bagi Menjadi 3 Tab Periode yang Tegas, Jelas, dan Tidak Tercampur (`features/content/components/ContentView.tsx` & `lib/real-content-items.ts`)**:
   Gunakan logika pemisahan tanggal yang ketat berikut ini:
   ```ts
   export type ContentPeriod = "weekly" | "monthly" | "all_time";

   export function isEligibleForPeriod(
     publishDateStr: string,
     period: ContentPeriod,
     isPinned?: boolean,
     referenceDate: Date = new Date("2026-10-16T23:59:59+07:00")
   ): boolean {
     const pubDate = new Date(publishDateStr);
     if (isNaN(pubDate.getTime())) return period === "all_time";

     const diffDays = (referenceDate.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24);

     if (period === "weekly") {
       // STRICT: Hanya konten yang diunggah dalam 7-10 hari terakhir (Minggu Ini / Siklus Aktif Oktober 2026)
       // Pinned post lama (misal Juli 2025 atau Juni 2026) otomatis DITOLAK di tab Mingguan!
       return diffDays >= -1 && diffDays <= 10;
     }

     if (period === "monthly") {
       // STRICT: Hanya konten September - Oktober 2026 (2026-09-01 s.d. 2026-10-31)
       return pubDate >= new Date("2026-09-01T00:00:00+07:00") && pubDate <= referenceDate;
     }

     // "all_time": Tampilkan seluruh konten termasuk Pinned Reels & Rekor Viral sepanjang masa
     return true;
   }
   ```
   - **Tab 1: `Mingguan (Minggu Ini · 7 Hari Terakhir)`**:
     - HANYA menampilkan konten yang diunggah dalam minggu aktif Oktober 2026 (`diffDays <= 10`).
     - Diurutkan berdasarkan `Reach / Views` tertinggi di minggu ini, sehingga user langsung melihat pemenang sesungguhnya untuk **minggu ini** (tanpa tercampur video tahun 2025 atau Juni 2026).
   - **Tab 2: `Bulanan (September – Oktober 2026)`**:
     - Menampilkan seluruh konten yang diunggah pada periode **1 September 2026 s.d. 16 Oktober 2026**.
   - **Tab 3: `Semua Waktu / All-Time (Termasuk Rekor Viral & Pinned)`**:
     - Menampilkan **seluruh konten tanpa batas tanggal**, termasuk konten viral sepanjang masa dari `@lunareyewear.co` (`"cewek + makeup + kacamata ="` 5.4M views - 2 Juli 2025, video helm 1.8M views - 19 Juni 2026, `"mata silinder / mata minus+silinder"` 640K views, `"knp lu kalo malem pelan bgt si nyetirnya?"` 194K views), konten `@iseeyou.glasses` (`"When : Gambar Nyata dari Mesin Cek mata"` 28.2K views, `"penglihatan mata silinder di siang hari"` 14.7K views, `"When : Liat Bocil Pulang Sekolah Seru'an"` 13.3K views, `"Bantuan Air Bersih di Purwokerto"` 19.178 views), dan `@iseeyou.purbalingga` (`"tinggalkan satu pesan"` 25.6K & 14.6K views, `"karnaval core"` 15.4K views).
     - Berikan badge khusus `📌 Pinned / Rekor All-Time` beserta tanggal unggah aslinya (`2025-07-02`, `2026-06-19`, dst.) agar transparan.

3. **Pastikan Ke-3 Format (`Reels`, `Carousel`, `Feed Single`) Memiliki Data Asli & Lengkap**:
   - **`Reels`**: Seluruh Reels memiliki angka `Reach / Views`, `Likes`, `Komentar`, `Shares`, judul/caption asli, thumbnail asli, dan link Instagram `/reel/{shortcode}` yang bisa diklik. Tidak boleh ada Reels yang sudah tayang di Instagram tetapi bernilai `0` reach di web!
   - **`Carousel`**: Ambil caption asli dan metrik interaksi riil dari post `/p/{shortcode}` bertipe `GraphSidecar` / multi-slide. Hapus seluruh judul placeholder `"Carousel Purwokerto (Pusat) (2026-10-12)"` dan ganti dengan judul/caption asli postingan Carousel-nya.
   - **`Feed Single`**: Pastikan post foto tunggal (`GraphImage` / `Single`) terklasifikasi dengan benar sebagai `"Single"` dan tampil saat user mengklik filter **`Feed Single`** (tidak boleh `0 konten terverifikasi`).

4. **Hubungkan Filter Cabang Global & Lokal + Hapus Duplikat + Decode HTML Entities**:
   - Jika user memilih cabang di dropdown atas (`Semua Cabang (5)`) ATAU mengklik tombol filter cabang di halaman `/content` (`Purwokerto (Pusat)`, `Purbalingga`, `Cilacap`, `Wonosobo`, `Lunar Tegal`), keduanya harus saling tersinkronisasi dan memperbarui:
     1. Kartu **Rank #1 Top Performer** di bagian atas halaman `/content` (menampilkan juara #1 khusus untuk periode, cabang, dan format yang sedang dipilih!).
     2. Isi tabel peringkat di bawahnya.
   - Deduplikasi semua item berdasarkan **Canonical Shortcode** (sehingga `"Bantuan Air Bersih di Purwokerto"` tidak muncul 2 kali antara Google Sheets dan Meta Sync — ambil nilai metrik tertinggi dan gabungkan menjadi 1 baris).
   - Pastikan teks di kolom `OBSERVASI ANALIS` di-generate ulang dari angka metrik final setelah merge agar angkanya 100% identik dengan kolom `REACH` dan `INTERAKSI`.
   - Decode seluruh HTML entities (`&#x1f917;`, `&quot;`, `&#xfe0f;`, `&#x200d;`, `&#x1f525;`, dll.) menggunakan `String.fromCodePoint`.

---

## BAGIAN 4: CHECKLIST VERIFIKASI WAJIB SEBELUM SELESAI
Sebelum kamu menyelesaikan tugas ini, jalankan verifikasi berikut:
1. Jalankan script sinkronisasi live (`node scripts/sync-all-instagram-live.js` atau sejenisnya) untuk memperbarui file cache JSON dengan data dan timestamp Instagram yang asli.
2. Jalankan `npm run build` dan pastikan **0 error** (TypeScript, ESLint, dan Next.js static/dynamic route generation).
3. Pastikan:
   - Dropdown `Semua Cabang (5)` di `/dashboard` benar-benar mengubah angka KPI, daftar PIC, jumlah Reels, dan jumlah Story saat diganti ke `Purwokerto Pusat`, `Purbalingga`, `Cilacap`, `Wonosobo`, atau `Lunar Tegal`.
   - Halaman **Finance** dan **Report** yang menggunakan **Password** sudah kembali muncul di Navbar atas, bisa dibuka dengan password, dan berfungsi penuh.
   - Di halaman `/content`, tab **Mingguan** HANYA berisi post dari minggu aktif (diurutkan dari views tertinggi minggu ini), tab **Bulanan** berisi post Sep–Okt 2026, dan tab **Semua Waktu (All-Time)** berisi seluruh post termasuk Pinned Reels jutaan views dengan tanggal aslinya.
   - Filter **Reels**, **Carousel**, dan **Feed Single** semuanya berisi data valid tanpa nilai 0 palsu atau judul placeholder.
```