# VENUE & EVENT INTELLIGENCE — DOKUMENTASI SISTEM OPERASIONAL
**Optik I See You Glasses (Purwokerto, Purbalingga, Cilacap, Wonosobo) & Lunar Eyewear Tegal**  
*Enterprise Multi-Channel Marketing Intelligence & Operational CRM*

---

## 1. Ringkasan Eksekutif & Misi
Modul **Venue & Event Intelligence** adalah sistem intelijen operasional end-to-end yang dibangun langsung di dalam dashboard marketing intelligence Optik I See You Glasses tanpa memecah arsitektur aplikasi yang ada.

Modul ini memfasilitasi tim pemasaran dalam:
1. Menemukan dan meriset tempat penyelenggaraan *Content Creation Class*, workshop digital marketing, seminar kesehatan mata, creator gathering, dan aktivasi pop-up booth.
2. Memverifikasi keabsahan sumber informasi, kontak pengelola, kapasitas, harga sewa, fasilitas, dan perizinan branding secara anti-fabrikasi data.
3. Melakukan scoring kelayakan venue secara transparan dan berbobot 100%.
4. Mengelola alur penjangkauan pengelola (Outreach CRM) dengan 17 tahapan pipeline dan 15 template Bahasa Indonesia terpersonalisasi.
5. Melakukan inspeksi survei lapangan (Checklist 6 kategori: Lokasi, Ruangan, Produksi Konten, Branding, Komersial, Dokumentasi).
6. Mengatur perencanaan acara, task board, rundown, mitigasi risiko, dan anggaran (Estimated vs Quoted vs Approved vs Actual & Variance).
7. Menghitung metrik KPI performa (Response rate, Survey conversion, Attendance rate, Cost per Attendee, Cost per Lead).
8. Mengkomparasikan 2–5 venue pilihan berdampingan (*side-by-side comparison*) serta ekspor database ke CSV.

---

## 2. Arsitektur Modul & Stack Teknologi

| Komponen | Spesifikasi / Pustaka |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components & Route Handlers) |
| **Frontend UI** | React 19, Tailwind CSS 3 (Dark/Light mode via CSS Variables) |
| **Icons & Visual** | Lucide React |
| **Data Layer** | Server-side JSON Store (`data/venue-intelligence.json`) dengan File-lock safe read/write |
| **Type System** | TypeScript 5.7+ Strict Mode (`lib/venue-types.ts`, 1.460+ baris tipe terdefinisi) |
| **API Endpoints** | REST Route Handlers di `/api/venues`, `/api/venue-dashboard`, `/api/venue-events`, `/api/venue-outreach`, `/api/venue-templates`, `/api/venue-surveys`, `/api/venue-evidence`, `/api/venue-export` |
| **Test Suite** | Node/TS runner script (`lib/__tests__/run-venue-tests.ts`, dijalankan via `npm run test:venue`) |

---

## 3. Struktur File & Modul

```
iseeyou-marketing-intelligence/
├── app/
│   ├── venue/
│   │   └── page.tsx                         # Entry point halaman /venue
│   └── api/
│       ├── venues/                          # GET (filter & search) & POST (tambah venue)
│       │   └── [id]/route.ts                # GET single, PUT update, DELETE archive
│       ├── venue-dashboard/route.ts         # Agregasi metrik KPI & statistik ringkasan
│       ├── venue-events/route.ts            # CRUD perencanaan event
│       ├── venue-outreach/route.ts          # Pipeline & log aktivitas penjangkauan
│       ├── venue-templates/route.ts         # Pustaka 15 template komunikasi
│       ├── venue-surveys/route.ts           # CRUD formulir inspeksi survei lapangan
│       ├── venue-evidence/route.ts          # Registry bukti & rujukan klaim (C2)
│       └── venue-export/route.ts            # Ekspor database venue ke file CSV
├── features/venue/components/
│   ├── VenueIntelligenceView.tsx            # Hub utama dengan KPI cards & navigasi 7 tab
│   ├── VenueDatabaseTab.tsx                 # Tab database: card/table view, filter, sort, ekspor CSV
│   ├── VenueCompareView.tsx                 # Tab komparasi 2-5 venue side-by-side & score matrix
│   ├── OutreachTab.tsx                      # Tab CRM pipeline & template copy-to-clipboard
│   ├── EventPlannerTab.tsx                  # Tab perencanaan event, rundown, task board
│   ├── SurveyTab.tsx                        # Tab checklist inspeksi fisik 6 kategori
│   ├── BudgetTab.tsx                        # Tab kalkulator anggaran & analisis varians biaya
│   ├── VenueReportsTab.tsx                  # Tab laporan eksekutif, corong outreach, kesiapan event
│   ├── VenueFormModal.tsx                   # Modal formulir tambah/edit venue berkonteks
│   └── VenueDetailModal.tsx                 # Modal detail lengkap, skor radar, & manajemen bukti klaim
├── lib/
│   ├── venue-types.ts                       # Domain model, interfaces, helper functions, formatters
│   ├── venue-service.ts                     # Persistence service layer, CRUD, filtering, CSV exporter
│   ├── seed-venues.ts                       # Seeder 17 venue riset terverifikasi Purwokerto/Banyumas
│   └── __tests__/
│       └── run-venue-tests.ts               # Unit test suite logika skor, varians, pembagian nol & KPI
├── data/
│   └── venue-intelligence.json              # Penyimpanan data JSON lokal aman
└── VENUE_EVENT_INTELLIGENCE.md              # Dokumentasi lengkap sistem
```

---

## 4. Model Data & Dictionary (Ringkasan Entitas)

### A. Venue (`lib/venue-types.ts`)
- `id`: UUID acak unik
- `name`: Nama resmi tempat
- `nameAlternatives`: Daftar nama panggilan atau alias
- `category`: `kampus` | `gedung_pertemuan` | `hotel` | `coworking` | `creative_space` | `kafe_restoran` | `komunitas` | `lainnya`
- `address`, `city`, `district`, `coordinates`, `googleMapsUrl`
- `phone`, `whatsappBusiness`, `email`, `websiteUrl`, `instagramHandle`
- `picName`, `picRole`: Hanya dicatat jika telah dipublikasikan secara sah
- `capacityTotal`: Kapasitas total peserta
- `capacityByLayout`: `theater`, `classroom`, `ushape`, `standing`, `boardroom`
- `rentalOptions`: Opsi paket durasi dan biaya sewa
- `pricing`: Rincian biaya, satuan, mata uang, dan periode berlaku
- `facilities`: Daftar fasilitas (Proyektor, sound system, Wi-Fi, AC, dsb.) beserta status keabsahannya
- `brandingPermissions`: Perizinan pemasangan backdrop, banner, booth kacamata, display produk, sponsor, QR code
- `operationalStatus`: `active` | `temporarily_closed` | `permanently_closed` | `unknown` | `under_renovation`
- `outreachStatus`: 17 tahapan pipeline penjangkauan
- `score`: Nilai kelayakan berbobot (0–100) dan penjelasan kontribusi kriteria
- `evidences`: Array dokumen bukti pendukung klaim
- `isAmbiguous`: Penanda jika nama venue memiliki ambiguitas di publik (misal: "Etos", "Gedung Suteja")
- `ambiguityNotes`: Penjelasan klarifikasi identitas tempat

### B. Evidence & Source Registry (C2)
- `evidenceId`, `venueId`
- `claimField`: Bidang klaim (misal: "Kapasitas", "Harga Sewa", "Kontak")
- `claimValue`: Nilai fakta yang diklaim (misal: "100 pax", "Rp2.500.000/hari")
- `sourceUrl`: Tautan URL sumber publik
- `sourceTitle`: Judul artikel, laman, atau dokumen sumber
- `sourceType`: `official_website` | `official_brochure` | `official_social_media` | `direct_confirmation` | `reputable_directory` | `user_provided` | `unverified_lead`
- `verificationStatus`: `verified` | `partially_verified` | `unverified` | `conflicting` | `stale` | `rejected`
- `confidenceLevel`: Tingkat keyakinan (0–100%)

---

## 5. Scoring Engine & Formula Perhitungan

### A. Bobot Skor Kelayakan Venue (Total = 100%)
1. **Kesesuaian Biaya (Cost Fit):** 25% (0.25)
2. **Kesesuaian Kapasitas (Capacity Fit):** 20% (0.20)
3. **Relevansi Audiens (Audience Relevance):** 20% (0.20)
4. **Kualitas Fasilitas (Facility Quality):** 15% (0.15)
5. **Aksesibilitas & Lokasi (Accessibility Location):** 10% (0.10)
6. **Potensi Kolaborasi & Branding (Collaboration Potential):** 10% (0.10)

Setiap kriteria diberi nilai 0.0 hingga 5.0. Skor dinormalisasikan ke skala 0–100:
$$\text{Normalized Score} = \left( \frac{\sum (\text{Skor Kriteria}_i \times \text{Bobot}_i)}{\sum \text{Bobot}_i} \right) \times 20$$

### B. Kalkulasi Anggaran
- **Total Estimated:** $\sum \text{estimatedCost}_i$
- **Total Approved:** $\sum \text{approvedBudget}_i$
- **Total Actual:** $\sum \text{actualCost}_i$
- **Variance:** $\text{totalActual} - \text{totalApproved}$  
  *(Nilai positif menandakan over-budget, nilai negatif menandakan efisiensi/under-budget)*
- **Cost per Attendee:** $\frac{\text{totalActual}}{\text{attendees}}$  
  *(Mengembalikan `null` jika peserta $= 0$ atau biaya $= 0$)*
- **Cost per Lead:** $\frac{\text{totalActual}}{\text{leads}}$  
  *(Mengembalikan `null` jika leads $= 0$ atau biaya $= 0$)*

### C. Metrik KPI Corong
- **Response Rate:** $\frac{\text{Jumlah Venue yang Merespons}}{\text{Total Venue Dihubungi}} \times 100\%$
- **Survey Conversion Rate:** $\frac{\text{Venue yang Berhasil Disurvei}}{\text{Total Venue yang Merespons}} \times 100\%$
- **Attendance Rate:** $\frac{\text{Peserta Hadir}}{\text{Pendaftar Aktual}} \times 100\%$
- **Evidence Coverage:** $\frac{\text{Klaim Berstatus 'verified'}}{\text{Total Klaim Bukti}} \times 100\%$

---

## 6. Seed Data Riset Awal (17 Venue Banyumas/Purwokerto)

Berikut 17 kandidat venue teridentifikasi dari sumber publik resmi di Purwokerto dan Banyumas:
1. **Hetero Space Banyumas** (Coworking / Creative Hub Pemprov Jateng, Jl. Gatot Subroto No. 67)
2. **ASTON Purwokerto Hotel & Convention Center** (Hotel Bintang 4, Jl. Overste Isdiman No. 33)
3. **Java Heritage Hotel Purwokerto** (Hotel Bintang 4 & Hastinapura CC, Jl. Dr. Angka No. 71)
4. **Luminor Hotel Purwokerto** (Hotel Bintang 3-4 Waringin Hospitality, Jl. Jend. Soedirman No. 324)
5. **Taman Budaya Soetedja** (Gedung Kesenian Pemkab Banyumas, Jl. Pancurawis No. 1)
6. **Jati Ngayom Restaurant & Convention Hall** (Imperial Hall & Resto, Jl. Raya Baturaden KM 6)
7. **Universitas Amikom Purwokerto** (Kampus Kreatif, Lab Multimedia & Podcast, Jl. Letjend Pol. Soemarto)
8. **FISIP Universitas Jenderal Soedirman** (Auditorium & Aula FISIP, Jl. Prof. Dr. HR Boenyamin No. 708)
9. **Wisata Niaga Hotel** (Hotel Bintang 3 & WN Cafe Coworking, Jl. Merdeka No. 5)
10. **COR Hotel Purwokerto** (Hotel Bisnis Dominic Group, Jl. Jend. Sudirman No. 508)
11. **Gedung Soemardjito UNSOED** (Auditorium 1.500 pax, Jl. Dr. Soeparno)
12. **Graha Widyatama UNSOED** (Auditorium Akbar 3.000 pax, Jl. Prof. Dr. HR Boenyamin)
13. **Convention Hall Putra Sang Fajar** (Kompleks Menara Teratai Banyumas, Jl. Bung Karno)
14. **D'Garden Hall & Resto Purwokerto** (Resto & Convention 13 ruangan, Jl. Dr. Soeparno No. 97)
15. **Ethos Digital Valley** (Kawasan Kreatif & Teknologi PT Ethos Kreatif Indonesia, Karanggintung)
16. **Grand Karlita Hotel Purwokerto** (Hotel Bintang 4, Diamond Ballroom 2.000 pax, Jl. S. Parman No. 296)
17. **Lumenna Hotel Purwokerto** (Eks-Meotel Artotel Wanderlust, Buggati Room, Jl. Dr. Soeparno No. 1)

---

## 7. Hasil Pengujian & Verifikasi Kualitas

### A. Unit Tests Logika Bisnis (`npm run test:venue`)
```bash
> iseeyou-marketing-intelligence@1.0.0 test:venue
> npx tsx lib/__tests__/run-venue-tests.ts

🧪 Memulai Pengujian Unit Modul Venue & Event Intelligence...

✅ PASSED: Bobot awal penilaian venue totalnya tepat 100% (1.0)
✅ PASSED: Skor ternormalisasi berada dalam rentang valid 0–100
✅ PASSED: Kesesuaian biaya tinggi untuk harga terjangkau (<= 1.5jt)
✅ PASSED: Potensi kolaborasi tinggi ketika seluruh perizinan branding aktif
✅ PASSED: Total approved budget dihitung dengan benar
✅ PASSED: Total actual cost dihitung dengan benar
✅ PASSED: Variance = totalActual - totalApproved (2.550.000 - 2.550.000 = 0)
✅ PASSED: Variance bernilai positif (+100.000) saat biaya riil melebihi anggaran disetujui
✅ PASSED: Cost per attendee mengembalikan null saat peserta = 0 (tanpa NaN/Infinity)
✅ PASSED: Cost per attendee mengembalikan null saat actual cost = 0
✅ PASSED: Cost per attendee benar dihitung saat input valid (2.500.000 / 50 = 50.000)
✅ PASSED: Cost per lead mengembalikan null saat leads = 0 (tanpa NaN/Infinity)
✅ PASSED: Cost per lead benar dihitung saat input valid (2.500.000 / 25 = 100.000)
✅ PASSED: Response rate tepat 50% (1 respons dari 2 aktivitas kontak)
✅ PASSED: Attendance rate tepat 90% (36 hadir dari 40 pendaftar aktual)
✅ PASSED: Evidence coverage tepat 50% (1 dari 2 bukti berstatus verified)
✅ PASSED: Label kategori coworking terformat
✅ PASSED: Label kategori hotel terformat
✅ PASSED: Label status new_lead terformat
✅ PASSED: Label status booked_confirmed terformat

🎉 SELURUH PENGUJIAN LOGIKA & FORMULA BISNIS BERHASIL 100%!
```

### B. TypeScript Compilation Check (`npm run typecheck`)
- Command: `tsc --noEmit`
- Status: **0 errors (Exit code 0)**

---

## 8. Panduan Penggunaan Operasional

### A. Panduan untuk Tim Marketing (Outreach & Event)
1. **Mencari & Memfilter Venue:**
   - Masuk ke tab **Venue** di navigasi atas.
   - Gunakan kolom pencarian atau filter kategori (Kampus, Hotel, Coworking, dll.) dan status.
   - Buka **Detail** untuk melihat nomor kontak resmi dan perizinan branding (backdrop, booth kacamata).
2. **Melakukan Penjangkauan (Outreach CRM):**
   - Buka tab **Outreach CRM**.
   - Di bagian bawah, temukan 15 template Bahasa Indonesia (misal: *WhatsApp pembuka hotel*, *Permohonan kerja sama kampus*, *Permintaan izin booth kacamata*).
   - Klik **Salin ke Clipboard** lalu kirimkan melalui kanal komunikasi resmi venue.
3. **Survei Fisik Lapangan:**
   - Masuk ke tab **Survei Lapangan**.
   - Klik **Buat Formulir Survei Baru**, pilih venue dan masukkan nama petugas.
   - Centang checklist pada 6 kategori: Akses/Parkir, Ruangan/AC, Audio Visual/Lighting, Branding, Komersial, dan Sudut Dokumentasi foto/video.
4. **Komparasi Venue:**
   - Masuk ke tab **Komparasi**.
   - Pilih 2 hingga 5 venue yang ingin diperbandingkan untuk menampilkan matriks perbandingan nilai, biaya, dan fasilitas.

### B. Panduan untuk Admin / Manajemen
1. **Mengaudit & Menyetujui Anggaran:**
   - Masuk ke tab **Anggaran**, pilih event yang sedang direncanakan.
   - Periksa selisih biaya (*Variance*). Jika *Variance* positif berwarna merah, biaya aktual melampaui plafon yang disetujui.
2. **Ekspor Data untuk Pelaporan:**
   - Klik tombol **Ekspor CSV** di tab Database Venue atau tab Laporan untuk mengunduh rekapitulasi data format spreadsheet.

---

## 9. Petunjuk Menjalankan Aplikasi Secara Lokal

```bash
# 1. Pastikan dependensi terpasang
npm install

# 2. Jalankan pengujian logika bisnis
npm run test:venue

# 3. Jalankan verifikasi tipe TypeScript
npm run typecheck

# 4. Jalankan build produksi
npm run build

# 5. Jalankan server pengembangan lokal
npm run dev
# Buka http://localhost:3000/venue di browser
```
