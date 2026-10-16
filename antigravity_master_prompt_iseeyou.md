# Master Prompt Eksekusi Antigravity (Model: Gemini 3.8 Flash High)
**Target Proyek:** `iseeyou-marketing-intelligence.vercel.app` (Landing Page `/` & Sistem Internal `/dashboard`)  
**Referensi Brand Identity:** `optikiseeyou.com` (Optik I See You & Lunar Eyewear)

Salin seluruh blok instruksi di bawah ini dan tempelkan langsung ke **Antigravity** (dengan model **Gemini 3.8 Flash High**) pada workspace repository proyek Anda.

---

## PROMPT UNTUK ANTIGRAVITY (COPY & PASTE)

```markdown
Role & Objective:
Kamu adalah Principal Frontend Architect, UI/UX Designer (spesialis B2B SaaS & Design System), dan Full-Stack Next.js Engineer. Tugasmu adalah melakukan refactoring menyeluruh, menyelaraskan identitas visual (warna & tipografi) dengan brand utama `optikiseeyou.com`, merombak Landing Page (`/`) agar interaktif dan tidak kaku (serta memiliki arsitektur layout B2B Command Center yang berbeda dari web katalog B2C `optikiseeyou.com`), sekaligus memperbaiki seluruh masalah UI/UX, fitur, responsivitas mobile, performa, keamanan akses, dan konfigurasi SEO pada sistem internal (`/dashboard` beserta 10 modulnya).

Eksekusi seluruh perubahan berikut secara langsung, menyeluruh, dan production-ready tanpa merusak data domain yang sudah ada (5 wilayah cabang: Purwokerto, Purbalingga, Cilacap, Wonosobo, Lunar Eyewear Tegal; 6 PIC; 40 konten Reels/Post; 27 kompetitor; 14 KOL; 17 Venue; 11 pengajuan sponsor B2B; serta metrik Aftersales lensa Bluray, Photocromic, dan Bluecromic).

---

### TAHAP 1: PENYELARASAN DESIGN SYSTEM, WARNA & TIPOGRAFI (SAMA DENGAN OPTIKISEEYOU.COM)

Saat ini website menggunakan font bawaan sistem (`-apple-system`, `SF Pro Display`) dan latar abu-abu dingin (`#F5F5F7`) yang terasa generik dan berbeda dari karakter hangat `optikiseeyou.com`. Ubah konfigurasi global (`tailwind.config.ts` / `globals.css` / `layout.tsx`) agar 100% selaras dengan DNA visual `optikiseeyou.com`:

1. **Integrasi Google Fonts (`next/font/google` untuk Zero CLS):**
   - **Font Utama (Heading, Body, UI, Tabel, Dashboard):** `Poppins` (weights: `400`, `500`, `600`, `700`) sebagai font default (`--font-poppins`).
   - **Font Aksen Editorial / Brand Tagline:** `Playfair Display` (weights: `500`, `600`, style: `italic` & `normal`) khusus untuk kata aksen pada headline, badge filosofis, atau sub-tagline seperti *"for every decision"* / *"for every you"* (`--font-playfair`).
   - **Font Angka / Data Tabel & KPI:** Aktifkan `font-variant-numeric: tabular-nums` pada seluruh angka metrik, tabel, persentase, dan mata uang agar sejajar presisi.

2. **Token Palet Warna Eksak (`optikiseeyou.com`):**
   - **Background Utama (Canvas):** `#F8F5ED` (`rgb(248, 245, 237)`) — *Warm Ivory / Cream Tint* (menggantikan `#F5F5F7`).
   - **Background Sekunder / Surface / Muted Card:** `#F3EFE6` dan `#FFFFFF` murni untuk permukaan kartu utama.
   - **Glassmorphism Surface:** `rgba(255, 255, 255, 0.82)` dengan `backdrop-filter: blur(12px)` dan border `rgba(18, 71, 52, 0.10)`.
   - **Primary Brand / Deep Forest Emerald:** `#124734` (`rgb(18, 71, 52)`) untuk tombol utama, kartu highlight eksklusif, dan indikator aktif.
   - **Dark Emerald Heading & Deep Surface:** `#183C30` (`rgb(24, 60, 48)`) untuk teks judul utama (H1–H3) dan sidebar/header kontras tinggi.
   - **Secondary Accent / Status Green:** `#16A34A` & `#22C55E` untuk badge pertumbuhan positif, status *Up-to-Date*, dan indikator live.
   - **Body Text & Muted Text:** Body utama `rgba(18, 71, 52, 0.82)` atau `#2D3A34`; teks sekunder/caption `#5C6B64`.
   - **Border & Divider:** `#E5E0D5` atau `rgba(18, 71, 52, 0.12)` (hindari border abu-abu dingin `#E5E7EB` murni).

3. **Komponen & Geometri Visual:**
   - Tombol & Badge: `rounded-full` (pill shape) dengan micro-interaction `hover:-translate-y-0.5 transition-all duration-200`.
   - Kartu & Panel: `rounded-2xl` hingga `rounded-3xl` dengan shadow hangat lembut `0 8px 30px -4px rgba(18, 71, 52, 0.06)`.

---

### TAHAP 2: OVERHAUL LANDING PAGE (`/`) — INTERAKTIF, TIDAK KAKU, & BERBEDA DARI WEB RETAIL B2C

Landing page saat ini terlalu kaku karena hanya menampilkan gambar preview statis dan daftar teks bernomor (`01`, `02`, `03`). Pastikan arsitektur visualnya tampil sebagai **Executive Marketing Command Center (B2B SaaS)** yang kaya interaksi mikro—bukan seperti katalog kacamata retail `optikiseeyou.com`:

1. **Interactive Hero Workspace Sandbox (Menggantikan Mockup Statis):**
   - Di bagian Hero (*"Lihat lebih jelas. Kerja lebih terarah."* — beri aksen *Playfair Display Italic* pada kata *"lebih jelas"*), bangun komponen **Interactive Live Mini-Dashboard** yang benar-benar bisa diklik langsung oleh pengunjung tanpa harus pindah halaman:
     - **Filter Pill Cabang Interaktif di Hero:** `Semua Jaringan (5)`, `Purwokerto`, `Purbalingga`, `Cilacap`, `Wonosobo`, `Lunar Tegal`. Saat diklik, angka KPI di kartu preview (Followers, Produksi Reels, Story Harian, Status PIC) berubah secara dinamis dengan animasi *count-up*.
     - **4 Mini-Tab Preview di dalam Hero Frame:**
       1. *Ringkasan Eksekutif* (Progress bar laporan 6 PIC & pertumbuhan 244.587 followers).
       2. *Top Reels & Konten* (Preview interaktif kartu performa Reels tertinggi beserta reach & engagement).
       3. *Radar Kompetitor* (Mini scatter plot / radar 27 kompetitor Barlingmascakeb & D2C).
       4. *Aftersales & Lensa* (Donut/bar chart proporsi lensa Bluray 2.393, Photocromic 949, Bluecromic 764).

2. **Bento Grid Interaktif (Menggantikan Daftar Kaku `01 / 02 / 03` pada Section "Pandangan yang utuh"):**
   - Ubah 3 baris teks statis menjadi **Interactive Bento Grid 3-Kartu Besar + 2 Kartu Pendukung**:
     - **Kartu 01 (Konten & Performa):** Dilengkapi mini-widget *Reels & Story Pulse* yang bergerak saat di-hover dan menampilkan tag interaktif (`Konten`, `Spreadsheet`, `Analytics`, `Social Blade`).
     - **Kartu 02 (Tim & Operasional):** Menampilkan simulasi *Live Checklist 6 PIC* (bisa di-toggle centangnya sebagai demo) dan preview generator pesan WhatsApp Pengajuan Sponsor & Aftersales.
     - **Kartu 03 (Riset & Keputusan):** Menampilkan preview interaktif matriks kompetitor, filter 14 KOL lokal, dan 17 venue event kampus/hotel.

3. **Interactive Workspace Launcher (Pada Section "Lebih sedikit langkah. Lebih banyak fokus."):**
   - Buat pemilih cabang & peran (*Quick-Launch Selector*) langsung di Landing Page: pengguna dapat memilih fokus cabang (`Semua Jaringan`, `Purwokerto`, `Purbalingga`, `Cilacap`, `Wonosobo`, `Lunar Eyewear Tegal`) atau modul tujuan awal, menyimpannya ke `localStorage`, dan tombol **"Masuk ke Sistem"** langsung mengarahkan ke `/dashboard` dengan filter cabang tersebut sudah aktif.

4. **Interactive Network Map / Branch Switcher Cards (Pada Section "Dekat dengan setiap cabang"):**
   - Ubah daftar 5 cabang (Purwokerto Pusat, Purbalingga, Cilacap, Wonosobo, Tegal Lunar Eyewear) dari kartu teks statis menjadi **Interactive Branch Cards** yang saat diklik/di-hover menampilkan highlight akun Instagram cabang (`@iseeyou.glasses`, `@iseeyou.purbalingga`, `@iseeyou.cilacap`, `@iseeyou.wonosobo`, `@lunareyewear.co`), fokus pasar lokal, serta tombol pintas *"Buka Workspace Cabang Ini →"*.

---

### TAHAP 3: PERBAIKAN SISTEM INTERNAL (`/dashboard`) — FITUR, UX, & RESPONSIVITAS 10 MODUL

Perbaiki arsitektur navigasi dan fungsionalitas pada ke-10 modul (`Dashboard`, `Spreadsheet`, `Social Blade`, `Konten`, `Pengajuan`, `Aftersales`, `Kompetitor`, `KOL`, `Venue`, `Analytics`):

1. **Restrukturisasi Navigasi (Solusi 10 Tab Horizontal yang Terpotong di Mobile/Tablet):**
   - **Desktop (`lg:` ke atas):** Gunakan **Collapsible Left Sidebar** (atau Grouped Top Navigation dengan 4 kategori jelas) yang mengelompokkan 10 modul secara ergonomis:
     - *Eksekutif & Rekap:* `Dashboard`, `Spreadsheet`, `Analytics`
     - *Sosial & Konten:* `Social Blade`, `Konten`
     - *Riset & Pertumbuhan:* `Kompetitor`, `KOL`, `Venue`
     - *Kemitraan & Pelanggan:* `Pengajuan`, `Aftersales`
   - **Mobile & Tablet (`< lg`):** Buat **Sticky Top Header** (Logo + Filter Cabang + Tombol Search `⌘K` + Tombol Menu Hamburger) dipadukan dengan **Slide-Over Drawer Navigation** dan **Bottom Quick-Bar (4 menu utama + tombol "Lainnya")**. Jangan gunakan deretan 10 tab horizontal yang memaksa scroll menyamping.

2. **Perbaikan Tabel Data & Responsivitas Mobile (Zero Horizontal Overflow):**
   - Pada tab `Spreadsheet`, `Kompetitor`, `Aftersales`, `KOL`, dan `Venue`:
     - Bungkus seluruh tabel dalam container `overflow-x-auto` dengan kolom pertama (*sticky column*) dan indikator bayangan scroll.
     - Sediakan **Responsive View Switcher (Tabel vs Kartu/Grid)** atau otomatis tampilkan format **Compact Card List** pada layar smartphone (`< 640px`) agar PIC cabang yang membuka lewat HP tetap nyaman membaca dan menekan tombol aksi.

3. **Peningkatan Fitur Nyata & Alur Kerja (Workflow Enhancements):**
   - **Global Branch & Period Filter Bar:** Tambahkan filter global di header dashboard (`Semua Cabang`, `Purwokerto`, `Purbalingga`, `Cilacap`, `Wonosobo`, `Lunar Tegal` + pemilih Siklus/Minggu) yang tersinkronisasi dengan URL query parameter (`?branch=...&cycle=...`) dan `localStorage`.
   - **Command Palette (`Ctrl+K` / `⌘K`):** Buat modal pencarian cepat di seluruh dashboard untuk langsung melompat ke salah satu dari 10 modul, mencari nama kompetitor dari 27 daftar, mencari nama KOL dari 14 kreator, mencari venue dari 17 lokasi, atau menjalankan aksi cepat (*"Salin Laporan WA Direksi"*, *"Export CSV Venue"*).
   - **Koneksi Tombol Aksi Nyata (Hapus Dummy Alert):**
     - Tombol **"Chat WA" / "Kirim Pitching WA"** pada modul `Pengajuan`, `KOL`, dan `Spreadsheet` harus membuka tautan `https://wa.me/?text=...` dengan teks template yang sudah di-encode rapi atau menyalin ke clipboard disertai *Toast Notification* interaktif yang elegan.
     - Tombol **"Export CSV"** pada modul `Venue`, `KOL`, `Kompetitor`, dan `Konten` harus benar-benar men-generate dan mengunduh file `.csv` UTF-8 dari data yang sedang difilter.
   - **Persistent State (`localStorage` + Reset/Import/Export JSON):**
     - Semua aksi tambah/edit data pada form modal (seperti *Tambah Venue*, *Tambah/Update Status KOL*, *Update Checklist Harian 6 PIC*, dan *Update Status Pengajuan Sponsor*) harus tersimpan secara persisten di `localStorage` dengan opsi *Export/Import Backup JSON* agar data yang diinput tim tidak hilang saat halaman di-refresh.
   - **Lightweight Access Gate (Proteksi Data Internal):**
     - Tambahkan fitur **Workspace Passcode / Role Selector Gate** sederhana (dengan opsi *Remember Device* di `localStorage`) sebelum mengakses `/dashboard`, agar data rahasia perusahaan (seperti kas 6 PIC, strategi kompetitor Barlingmascakeb, dan angka penjualan lensa) tidak terbuka bebas bagi publik yang mengetik URL `/dashboard`.

---

### TAHAP 4: OPTIMASI SEO GOOGLE, KEAMANAN INDEXING, & PERFORMA

1. **Konfigurasi SEO & OpenGraph Lengkap pada Landing Page (`/`):**
   - Lengkapi Next.js `metadata` pada root/landing page:
     - `title`: `"I See You Marketing Intelligence | Workspace Optik I See You & Lunar Eyewear"`
     - `description`: `"Platform marketing intelligence terpadu untuk memantau performa konten Reels & Story, sinkronisasi laporan 6 PIC, analitik 5 cabang (Purwokerto, Purbalingga, Cilacap, Wonosobo, Tegal), riset kompetitor, KOL, dan aftersales."`
     - `openGraph` & `twitter` card lengkap beserta `canonical` URL.
2. **Proteksi Indexing Mesin Pencari pada Sistem Internal (`/dashboard`):**
   - Pasang `robots: { index: false, follow: false, nocache: true }` (`<meta name="robots" content="noindex, nofollow" />`) khusus untuk route `/dashboard` dan seluruh sub-route internalnya agar data internal perusahaan tidak terindeks di Google Search.
   - Tambahkan `robots.txt` (`Disallow: /dashboard`) dan `sitemap.xml` (hanya mengindeks halaman publik `/`).
3. **Performa & Routing SPA:**
   - Gunakan `next/dynamic` (lazy loading) dengan *skeleton loader* bertema `#F8F5ED` / `#124734` untuk komponen grafik dan modul tab berat agar *First Contentful Paint (FCP)* dan *Interaction to Next Paint (INP)* sangat cepat.
   - Pastikan konfigurasi routing Next.js / `vercel.json` menangani direct refresh pada seluruh sub-path (`/dashboard`, `/spreadsheet`, `/social-blade`, `/content`, `/pengajuan`, `/aftersales`, `/competitors`, `/kol`, `/venue`, `/analytics`) tanpa kendala 404.
```
