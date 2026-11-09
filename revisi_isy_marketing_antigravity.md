# Dokumen Audit & Master Plan Eksekusi Antigravity: Revisi Bulanan `isy-marketing` (ISeeYou Marketing Intelligence)

Dokumen ini berisi hasil audit teknis menyeluruh terhadap repositori [Yoshput/IMI di GitHub](https://github.com/Yoshput/IMI) dan aplikasi live [ISeeYou Marketing Intelligence Dashboard](https://iseeyou-marketing-intelligence.vercel.app/dashboard), diikuti dengan spesifikasi teknis dan instruksi eksekusi langkah demi langkah yang siap dijalankan langsung di **Antigravity**.

## 1. Hasil Audit Lengkap Repositori & Live Web Saat Ini

Berdasarkan pemeriksaan kode sumber pada [Repositori GitHub Yoshput/IMI](https://github.com/Yoshput/IMI) dan verifikasi antarmuka pada [Halaman Dashboard Utama](https://iseeyou-marketing-intelligence.vercel.app/dashboard) serta [Halaman Evaluasi Konten & Database Desain](https://iseeyou-marketing-intelligence.vercel.app/content), berikut adalah kondisi arsitektur saat ini dan temuan celah (*gap analysis*) terhadap permintaan revisi atasan:

| Area Komponen | Kondisi Saat Ini di Repo & Live Web | Gap terhadap Permintaan Revisi Atasan |
| :--- | :--- | :--- |
| **Tech Stack & Package (`package.json`)** | Menggunakan Next.js `^15.1.7` (App Router), React `^19.0.0`, TypeScript `^5.7.3`, Tailwind CSS `^3.4.17`, GSAP `^3.15.0`, Lucide React `^0.475.0`, dan `xlsx` `^0.18.5` di [Yoshput/IMI](https://github.com/Yoshput/IMI). | **Belum ada library ekspor PDF maupun PPT.** Saat ini hanya ada ekspor CSV melalui `lib/export-csv.ts` (`downloadCSV`). Perlu instalasi `jspdf`, `jspdf-autotable`, dan `pptxgenjs`. |
| **Laporan Web & Performa (`WebPhotoboothAndQueueResume.tsx`, `lib/gsc.ts`, `lib/antrian-tracking.ts`)** | Menampilkan statistik Web Photobooth Virtual Try-On (`/photobooth`), Nomor Antrian Online Cek Mata (`/booking-antrian`), dan Google Search Console (`/api/gsc`) di [Dashboard ISeeYou](https://iseeyou-marketing-intelligence.vercel.app/dashboard) dengan filter preset `1 Minggu (7 Hari)` dan `30 Hari Terakhir`. | **Belum berbasis filter Bulan Kalender (`YYYY-MM`) dan belum bisa diekspor ke PDF/PPT.** Atasan meminta Laporan Web dan Performa khusus per bulan (misal: Oktober 2026, November 2026) yang merangkum trafik web, GSC, photobooth, dan antrian online selama 1 bulan penuh beserta tombol ekspor PDF dan PPT. |
| **Database Desain & Konten CC (`DatabaseDesainView.tsx`, `ContentView.tsx`)** | Di [Halaman Konten ISeeYou](https://iseeyou-marketing-intelligence.vercel.app/content), tab `Evaluasi Kinerja Konten` (53 postingan) dan `Database Desain (Mas Yanuar)` (35 berkas dari sheet `Form_Responses6` via `/api/sync-sheets`) masih terpisah. Kartu ringkasan masih bertuliskan statis `Produksi Bulan Ini (Okt 2026): 15 desain`. | **Label bulan masih hardcoded (`Okt 2026`) dan belum otomatis menyesuaikan pergantian bulan (misal ke November).** Selain itu, belum ada laporan terpadu per bulan yang menggabungkan performa konten Instagram `@iseeyou.glasses` dengan pelacakan tanggal per posting (*date-by-date tracker*) dan rekap karya per desainer/CC dalam sebulan. |
| **Pelacakan Tanggal Posting IG & Output Desainer (`lib/real-content-items.ts`, `/api/content-items`)** | Data `ContentItem` menyimpan `publishDate`, `format`, `reach`, `likes`, `comments`, `saves`, `shares`, `engagementRate`, dan `pic`, sedangkan `DesignDatabaseItem` menyimpan `date`, `timestamp`, `pic` (`Yanuar`, `Dimas`, `Yasin`, `anam`), `designName`, dan `fileUrl` di [Yoshput/IMI](https://github.com/Yoshput/IMI). | **Belum ada agregasi per tanggal tayang (`publishDate`) dan per desainer dalam satu bulan.** Atasan ingin melihat dalam 1 bulan (misal Oktober atau November): desainer sudah membuat berapa desain, daftar desain/konten apa saja yang dibuat, serta terdeteksi diposting di Instagram `@iseeyou.glasses` pada tanggal berapa saja dan berapa jumlah postingan di tiap tanggal tersebut, lengkap dengan ekspor PDF dan PPT. |

## 2. Arsitektur Solusi untuk Kedua Revisi Atasan

### Revisi 1: Modul Laporan Web dan Performa / Bulan (Ekspor PDF & PPT)
Modul ini dikhususkan untuk merangkum seluruh performa aset web ISeeYou selama **1 bulan kalender penuh (`YYYY-MM`)**:
1. **Filter Bulan Dinamis (`YYYY-MM`)**:
   - Menggunakan pemilih bulan (contoh: `2026-10` untuk Oktober 2026, `2026-11` untuk November 2026) yang otomatis mengambil default bulan berjalan (`new Date().toISOString().slice(0, 7)`).
2. **Cakupan Data Laporan Web & Performa Bulanan**:
   - **Performa SEO & Google Search Console (`lib/gsc.ts` & `/api/gsc`)**: Total Klik, Total Impresi, Rata-rata CTR (%), Rata-rata Posisi Pencarian, Top 10 Kata Kunci (`topQueries`), Top Halaman (`topPages`), dan grafik/tabel tren trafik harian sepanjang bulan terpilih.
   - **Performa Web Photobooth Virtual Try-On (`lib/antrian-tracking.ts` & `/api/traffic`)**: Total Sesi Photobooth bulanan, Pengguna Unik, Jumlah Foto Di-share (viral organik), Conversion Rate ke Booking Antrian (%), dan Ranking Frame Kacamata Terpopuler bulan tersebut.
   - **Performa Nomor Antrian Online Cek Mata (`/api/venue-dashboard`)**: Total pasien mendaftar antrian online selama sebulan, rata-rata antrian per hari, serta distribusi per cabang (Purwokerto Pusat, Purbalingga, Cilacap, Wonosobo).
3. **Fitur Ekspor PDF & PPT**:
   - Tombol **Export PDF** dan **Export PPT** langsung mengunduh dokumen laporan bernama `Laporan_Web_Performa_ISY_[Bulan]_[Tahun].pdf` dan `.pptx`.

### Revisi 2: Modul Laporan CC Performa Konten Design / Bulan `@iseeyou.glasses` (Ekspor PDF & PPT)
Modul ini dirancang khusus untuk menjawab kebutuhan atasan dalam memantau kinerja tim Content Creator (CC) & Graphic Designer pada akun Instagram `@iseeyou.glasses` setiap bulannya:
1. **Penyesuaian Bulan Otomatis & Riwayat Bulanan Dinamis**:
   - Menghilangkan teks statis `Okt 2026` pada `DatabaseDesainView.tsx` dan `ContentView.tsx`.
   - Saat kalender masuk ke bulan **November 2026 (`2026-11`)**, sistem otomatis menampilkan data bulan November sebagai default, namun pengguna tetap dapat memilih bulan **Oktober 2026 (`2026-10`)** atau bulan lainnya melalui dropdown pemilih bulan.
2. **Deteksi Tanggal Posting Instagram per Hari (`Date-by-Date Posting & Design Tracker`)**:
   - Mengelompokkan seluruh postingan Instagram `@iseeyou.glasses` berdasarkan tanggal rilis (`publishDate`) di bulan terpilih.
   - Menampilkan **Tabel & Timeline Tanggal Posting Bulanan**: tanggal berapa saja konten tayang di Instagram `@iseeyou.glasses`, berapa jumlah postingan pada masing-masing tanggal (misal: `13 Okt 2026: 2 Postingan`, `18 Okt 2026: 1 Postingan`), judul/caption konten, format (`reels`, `carousel`, `feed`), dan metrik performanya.
3. **Rekap Produktivitas & Daftar Karya Desainer / CC Selama Sebulan**:
   - Merangkum output setiap desainer/PIC (`Yanuar`, `Dimas`, `Yasin`, `anam`, serta PIC konten cabang) selama bulan terpilih:
     - **Total Desain & Konten Selesai** selama 1 bulan.
     - **Daftar Lengkap Desain Apa Saja yang Dibuat** (`designName` dari Google Sheets `Form_Responses6` beserta link Google Drive `fileUrl` dan tanggal input `date`).
     - **Performa Postingan di Instagram `@iseeyou.glasses`**: Reach, Likes, Comments, Saves, Shares, Save Rate (%), dan Engagement Rate (%) untuk melihat desain/konten mana yang paling efektif di bulan tersebut.
4. **Fitur Ekspor PDF & PPT**:
   - Tombol **Export PDF** dan **Export PPT** menghasilkan laporan siap presentasi bernama `Laporan_CC_Konten_Design_iseeyou.glasses_[Bulan]_[Tahun].pdf` dan `.pptx`.

## 3. Instruksi Eksekusi Lengkap untuk Antigravity (Siap Copy-Paste)

Salin seluruh instruksi tugas di bawah ini dan jalankan langsung di **Antigravity** pada workspace proyek [Yoshput/IMI](https://github.com/Yoshput/IMI):

```markdown
# TASK FOR ANTIGRAVITY: Implementasi Revisi Laporan Bulanan Web Performa & Laporan CC Performa Konten Design (@iseeyou.glasses) + Export PDF/PPT

Kamu bekerja di repositori Next.js 15 App Router + TypeScript (`Yoshput/IMI`). Tolong eksekusi seluruh langkah revisi berikut secara berurutan, pastikan tidak ada error TypeScript (`npm run build` lolos), dan pertahankan desain visual premium khas ISeeYou Marketing Intelligence.

---

## TAHAP 1: Instalasi Library Export PDF & PPT

Jalankan perintah instalasi package berikut di terminal proyek:
`npm install jspdf jspdf-autotable pptxgenjs`

Jika diperlukan type definitions tambahan:
`npm install -D @types/jspdf`

---

## TAHAP 2: Update Type Definitions di `types/index.ts`

Tambahkan interface berikut ke dalam `types/index.ts` (tanpa menghapus tipe yang sudah ada):

1. `MonthlyPeriod`:
   - `monthKey: string` (format `"YYYY-MM"`, contoh `"2026-10"` atau `"2026-11"`)
   - `label: string` (contoh `"Oktober 2026"`, `"November 2026"`)

2. `DailyIgPostSummary`:
   - `date: string` (format `"YYYY-MM-DD"`)
   - `formattedDate: string` (contoh `"13 Oktober 2026"`)
   - `postCount: number`
   - `designCount: number`
   - `posts: ContentItem[]`
   - `designs: DesignDatabaseItem[]`
   - `totalReach: number`
   - `totalLikes: number`
   - `avgEngagementRate: number`

3. `DesignerMonthlySummary`:
   - `pic: string`
   - `totalDesigns: number`
   - `totalIgPosts: number`
   - `percentageShare: number`
   - `designs: DesignDatabaseItem[]`
   - `igPosts: ContentItem[]`
   - `totalReach: number`
   - `avgEngagementRate: number`

4. `MonthlyWebPerformanceData`:
   - `monthKey: string`
   - `monthLabel: string`
   - `photobooth`: `{ totalSessions: number; uniqueUsers: number; sharedPhotos: number; conversionRate: number; topFrames: { model: string; tries: number; shares: number }[] }`
   - `queue`: `{ totalRegistered: number; dailyAverage: number; byBranch: { branchName: string; count: number }[] }`
   - `gsc`: `{ totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number; topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]; topPages: { page: string; clicks: number; impressions: number }[]; dailyTrend: { date: string; clicks: number; impressions: number; sessions?: number; queueBookings?: number }[] }`

---

## TAHAP 3: Buat Helper Format Tanggal Bulan & Utility Ekspor PDF/PPT

### 3.1. Buat file `lib/month-utils.ts`
Buat helper yang menangani logika bulan dinamis agar aplikasi otomatis menyesuaikan bulan saat berganti dari Oktober ke November dan seterusnya:
- `getCurrentMonthKey(): string` -> mengembalikan bulan berjalan `"YYYY-MM"` (misal `"2026-11"`).
- `formatMonthLabel(monthKey: string): string` -> mengubah `"2026-10"` menjadi `"Oktober 2026"`, `"2026-11"` menjadi `"November 2026"`, dst. dalam Bahasa Indonesia.
- `extractMonthKeyFromDate(dateStr: string): string | null` -> mengekstrak `"YYYY-MM"` baik dari format ISO (`"2026-10-13"`), format slash Google Sheets (`"10/28/2026"` atau `"28/10/2026"`), maupun timestamp penuh. Pastikan parser menangani format `MM/DD/YYYY` pada `Form_Responses6` (contoh `"10/28/2026"` -> `"2026-10"`) dengan akurat.
- `normalizeDateToISO(dateStr: string): string` -> menormalisasi tanggal input/posting ke `"YYYY-MM-DD"` agar bisa diurutkan dan dikelompokkan per tanggal.
- `getAvailableMonths(contentItems: ContentItem[], designItems: DesignDatabaseItem[]): MonthlyPeriod[]` -> mengumpulkan daftar unik seluruh bulan yang memiliki data + selalu menyertakan bulan berjalan (`getCurrentMonthKey()`) serta `"2026-10"` dan `"2026-11"`, diurutkan dari terbaru ke terlama.

### 3.2. Buat file `lib/export-pdf-ppt.ts`
Buat fungsi ekspor PDF (menggunakan `jspdf` dan `jspdf-autotable`) dan PPTX (menggunakan `pptxgenjs`) untuk kedua laporan:

1. `exportWebPerformanceToPDF(data: MonthlyWebPerformanceData)`
   - Menghasilkan file `Laporan_Web_Performa_ISY_${data.monthKey}.pdf`.
   - Halaman 1: Judul Laporan (`LAPORAN WEB & PERFORMA BULANAN - ${data.monthLabel.toUpperCase()}`), Ringkasan Eksekutif (Kartu KPI Web Photobooth, Nomor Antrian Online, dan Google Search Console), serta Tabel Breakdown Antrian per Cabang & Top Frame Photobooth.
   - Halaman 2: Tabel Performa SEO Google Search Console (Top Queries & Top Pages) dan Tabel Tren Trafik Harian selama bulan `${data.monthLabel}`.

2. `exportWebPerformanceToPPT(data: MonthlyWebPerformanceData)`
   - Menghasilkan file `Laporan_Web_Performa_ISY_${data.monthKey}.pptx` menggunakan `pptxgenjs`.
   - Slide 1: Cover Slide (`Laporan Web & Performa Bulanan ISeeYou`, Periode `${data.monthLabel}`).
   - Slide 2: Ringkasan KPI Utama (Sesi Photobooth, Users Unik, Share Organik, Konversi Booking, Total Antrian Cek Mata, Klik & Impresi GSC).
   - Slide 3: Tabel Breakdown Cabang & Ranking Frame Virtual Try-On Terpopuler.
   - Slide 4: Performa Pencarian Organik (Top Queries & Halaman Teratas GSC) + Tren Harian Bulanan.

3. `exportCcContentDesignToPDF(params: { monthKey: string; monthLabel: string; accountHandle: string; designerSummaries: DesignerMonthlySummary[]; dailySummaries: DailyIgPostSummary[]; filteredPosts: ContentItem[]; filteredDesigns: DesignDatabaseItem[] })`
   - Menghasilkan file `Laporan_CC_Konten_Design_${params.monthKey}.pdf`.
   - Bagian 1: Ringkasan Eksekutif Performa Konten `@iseeyou.glasses` & Produksi Desain Bulan `${params.monthLabel}` (Total Postingan IG, Total Desain Dibuat, Total Reach Bulanan, Rata-rata Engagement Rate, Hari Aktif Posting).
   - Bagian 2: Tabel Produktivitas Tim Desainer / CC Selama 1 Bulan (Nama Desainer/PIC, Jumlah Desain Selesai, Jumlah Postingan IG, % Kontribusi, Daftar Judul Desain).
   - Bagian 3: Tabel Deteksi Tanggal Posting Instagram `@iseeyou.glasses` (`Date-by-Date Tracker`: Tanggal, Jumlah Posting, Jumlah Desain, Judul Konten/Desain, Format, Reach, Likes, Engagement Rate).
   - Bagian 4: Tabel Rincian Lengkap Seluruh Desain Bulan `${params.monthLabel}` (Tanggal Input, PIC Desainer, Nama Desain & Keterangan, Link Google Drive) dan Rincian Postingan IG `@iseeyou.glasses`.

4. `exportCcContentDesignToPPT(params: { monthKey: string; monthLabel: string; accountHandle: string; designerSummaries: DesignerMonthlySummary[]; dailySummaries: DailyIgPostSummary[]; filteredPosts: ContentItem[]; filteredDesigns: DesignDatabaseItem[] })`
   - Menghasilkan file `Laporan_CC_Konten_Design_${params.monthKey}.pptx` menggunakan `pptxgenjs`.
   - Slide 1: Cover (`Laporan Bulanan CC & Performa Konten Design - @iseeyou.glasses`, Periode `${params.monthLabel}`).
   - Slide 2: Highlight Performa Bulanan & Produktivitas per Desainer/CC (Tabel ringkasan berapa desain yang dibuat masing-masing desainer selama `${params.monthLabel}`).
   - Slide 3: Kalender / Log Deteksi Tanggal Posting Instagram `@iseeyou.glasses` (Tanggal berapa saja posting dan berapa konten per tanggal).
   - Slide 4+: Daftar Lengkap Desain yang Dibuat Selama Bulan `${params.monthLabel}` & Evaluasi Top Content Instagram `@iseeyou.glasses`.

---

## TAHAP 4: Implementasi Revisi 1 — Laporan Web dan Performa / Bulan

### 4.1. Update API & Data Handler (`lib/antrian-tracking.ts`, `lib/gsc.ts`, `/api/traffic/route.ts`, `/api/gsc/route.ts`)
- Tambahkan dukungan filter parameter `month` (`YYYY-MM`, contoh `?month=2026-10` atau `?month=2026-11`) pada `/api/traffic/route.ts` dan `/api/gsc/route.ts`.
- Buat fungsi `getMonthlyWebPerformanceData(monthKey: string): MonthlyWebPerformanceData` yang mengagregasi metrik Web Photobooth, Antrian Online per cabang, dan Google Search Console khusus untuk bulan `monthKey` yang dipilih (beserta rincian tren harian dari tanggal 1 s/d akhir bulan tersebut).

### 4.2. Buat Komponen `features/reports/components/MonthlyWebPerformanceReport.tsx`
Buat komponen laporan bulanan khusus Web & Performa dengan fitur:
- **Header Kontrol**:
  - Dropdown **Pilih Bulan Laporan** (`Oktober 2026`, `November 2026`, dst., otomatis default ke bulan aktif/terpilih).
  - Tombol **Export PDF** (memanggil `exportWebPerformanceToPDF`) dan **Export PPT** (memanggil `exportWebPerformanceToPPT`).
- **4 Kartu KPI Utama Bulanan**:
  1. Total Sesi Web Photobooth & Users Unik (bulan terpilih).
  2. Total Share Foto & Rate Konversi ke Antrian Online (`%`).
  3. Total Pendaftaran Nomor Antrian Online Cek Mata (beserta rata-rata harian & breakdown 4 cabang ISY).
  4. Performa Organik Google Search Console (Total Klik, Impresi, CTR, Rata-rata Posisi).
- **Tabel & Visualisasi Detail Bulanan**:
  - Tabel Breakdown Trafik & Antrian per Cabang ISY selama 1 bulan.
  - Tabel Top Frame Virtual Try-On Terpopuler bulan terpilih.
  - Tabel Top Queries & Top Pages dari Google Search Console bulan terpilih.
  - Tabel Log / Tren Harian Trafik Web & Antrian per tanggal sepanjang bulan tersebut.

### 4.3. Integrasikan ke Dashboard & Halaman Report
- Pada `features/dashboard/components/WebPhotoboothAndQueueResume.tsx`:
  - Tambahkan selector bulan (`YYYY-MM`) di samping filter periode serta tombol cepat **Export PDF Bulanan** & **Export PPT Bulanan**, dan tombol menuju tab/panel lengkap **Laporan Web & Performa Bulanan**.
- Pada `app/reports/page.tsx` (dan `app/analytics/page.tsx`):
  - Tampilkan `<MonthlyWebPerformanceReport />` agar atasan dapat langsung membuka, memfilter per bulan, dan mengekspor laporan Web & Performa ke PDF/PPT.

---

## TAHAP 5: Implementasi Revisi 2 — Laporan CC Performa Konten Design / Bulan (`@iseeyou.glasses`)

### 5.1. Update `features/content/components/DatabaseDesainView.tsx`
Perbaiki seluruh bagian yang sebelumnya statis dan tambahkan fitur pelacakan bulanan:
1. **Hapus Hardcode `Okt 2026`**:
   - Ubah kartu ringkasan ke-3 dari teks statis `"Produksi Bulan Ini (Okt 2026)"` menjadi dinamis mengikuti `selectedMonth` (jika `selectedMonth === 'all'`, gunakan bulan berjalan dari `getCurrentMonthKey()`, misal `"Produksi Bulan Ini (Nov 2026)"` atau sesuai bulan yang sedang dipilih di filter seperti `"Produksi Oktober 2026"`).
2. **Sinkronisasi Filter Bulan Dinamis**:
   - Pastikan dropdown bulan mendukung pemilihan per bulan (`YYYY-MM`) dan otomatis mendeteksi jika sudah masuk bulan baru (November 2026, Desember 2026, dst.).

### 5.2. Buat Komponen `features/content/components/MonthlyCcDesignReportView.tsx`
Buat komponen khusus **Laporan CC Performa Konten & Design Bulanan (`@iseeyou.glasses`)** yang menjawab seluruh kebutuhan evaluasi bulanan atasan:
1. **Filter Bar & Action Buttons**:
   - **Month Picker Dinamis (`YYYY-MM`)**: Otomatis menyesuaikan bulan saat ini (misal masuk November -> otomatis menampilkan November, dan bisa diganti ke Oktober atau bulan lain).
   - **Filter Akun / Cabang**: Default menampilkan `@iseeyou.glasses` (Optik I See You Purwokerto / Utama) dengan opsi melihat semua cabang atau `@lunareyewear.co`.
   - **Filter Desainer / PIC**: Semua Desainer, `Yanuar`, `Dimas`, `Yasin`, `anam`, dll.
   - **Tombol Ekspor**:
     - Tombol **Export PDF** (`exportCcContentDesignToPDF`)
     - Tombol **Export PPT** (`exportCcContentDesignToPPT`)
     - Tombol **Export CSV** (`downloadCSV`)
2. **Section A — Ringkasan Output Desainer / CC Selama 1 Bulan**:
   - Menampilkan kartu & tabel rekap per desainer (`Yanuar`, `Dimas`, `Yasin`, `anam`, dsb.) pada bulan terpilih:
     - Berapa total desain yang dibuat di bulan tersebut.
     - Berapa postingan Instagram `@iseeyou.glasses` yang tayang di bulan tersebut.
     - Daftar rincian nama desain (`designName`) yang dikerjakan selama bulan tersebut beserta tanggal pembuatan (`date`) dan link file Google Drive (`fileUrl`).
3. **Section B — Deteksi Tanggal Posting Instagram `@iseeyou.glasses` (`Date-by-Date Posting Tracker`)**:
   - Menampilkan kalender / tabel kronologis per tanggal di dalam bulan terpilih:
     - Mendeteksi secara otomatis tanggal berapa saja ada postingan di Instagram `@iseeyou.glasses` dan tanggal berapa saja ada desain baru yang diinput.
     - Menampilkan jumlah postingan di setiap tanggal (contoh: `13 Okt 2026 — 2 Postingan IG, 1 Desain Baru`), lengkap dengan badge format (`Reels`, `Carousel`, `Feed`), judul/caption konten, PIC, Reach, Likes, Comments, Saves, Shares, dan Engagement Rate (`%`).
4. **Section C — Tabel Performa Konten Postingan `@iseeyou.glasses` Bulanan**:
   - Menampilkan seluruh postingan Instagram `@iseeyou.glasses` pada bulan terpilih yang diurutkan berdasarkan tanggal posting (`publishDate`) atau performa (`rank` / `reach` / `engagementRate`), lengkap dengan tautan langsung ke postingan Instagram (`postUrl`).

### 5.3. Integrasikan ke `features/content/components/ContentView.tsx` & Dashboard
- Pada `features/content/components/ContentView.tsx`, tambahkan tab navigasi utama:
  1. `Evaluasi Kinerja Konten`
  2. `Database Desain (Mas Yanuar)`
  3. **`Laporan Bulanan CC & IG (@iseeyou.glasses)`** (merender `<MonthlyCcDesignReportView />` lengkap dengan tombol Export PDF & PPT).
- Tambahkan juga akses cepat (Quick Action button) di header `ContentView.tsx` dan `DatabaseDesainView.tsx` untuk langsung **Export PDF Bulanan** dan **Export PPT Bulanan**.

---

## TAHAP 6: Verifikasi & Build Check

1. Jalankan `npm run build` atau `npx tsc --noEmit` untuk memastikan tidak ada error TypeScript di seluruh file baru maupun file yang dimodifikasi.
2. Pastikan tombol **Export PDF** dan **Export PPT** berfungsi di sisi client (`"use client"`) tanpa memicu error SSR (`window is not defined`) dengan melakukan dynamic import (`await import("jspdf")` dan `await import("pptxgenjs")`) di dalam fungsi klik ekspor jika diperlukan.
3. Uji skenario pergantian bulan:
   - Pilih **Oktober 2026 (`2026-10`)**: pastikan seluruh 15 desain Oktober 2026 dan daftar postingan IG Oktober `@iseeyou.glasses` muncul lengkap per tanggal beserta rekap per desainer (`Yanuar`, `Dimas`, `Yasin`, `anam`).
   - Pilih **November 2026 (`2026-11`)**: pastikan filter otomatis menyesuaikan ke data bulan November 2026 tanpa ada label statis `Okt 2026` yang tertinggal.
```

## 4. Panduan Cara Menjalankan di Antigravity

1. Buka proyek lokal `IMI` (`isy-marketing`) Anda di **Antigravity**.
2. Salin blok instruksi pada **Bagian 3 (`TASK FOR ANTIGRAVITY`)** di atas atau lampirkan file `.md` ini langsung ke kolom prompt Agent Antigravity.
3. Biarkan Antigravity mengeksekusi **Tahap 1 hingga Tahap 6** secara berurutan (mulai dari instalasi `jspdf`, `jspdf-autotable`, dan `pptxgenjs`, pembuatan `lib/month-utils.ts` dan `lib/export-pdf-ppt.ts`, hingga pembuatan komponen laporan bulanan Web & CC Konten Design).
4. Setelah selesai, jalankan `npm run dev` dan cek halaman `/dashboard`, `/content`, serta `/reports` untuk menguji filter bulan (Oktober, November, dst.) dan mengunduh hasil **Export PDF** serta **Export PPT**.
