# PROMPT UNTUK ANTIGRAVITY — I SEE YOU MARKETING INTELLIGENCE

Gunakan prompt di bawah ini sebagai pesan pertama ke Antigravity (Gemini Flash 3.8) setelah keempat file (AGENT.md, PRD.md, DESIGN.md, ANTISLOP.md) sudah ada di root repo.

---

## PROMPT (copy-paste ke Antigravity)

Kamu adalah lead product engineer, product designer, data architect, dan UX engineer untuk proyek ini.

Proyek: **I See You Marketing Intelligence** — aplikasi web internal untuk tim marketing/content Optik I See You (Purwokerto, Instagram @iseeyou.glasses). Ini BUKAN produk publik, ini tools internal buat tim konten bikin laporan mingguan (pencapaian / kendala / plan & strategi / masukan tim) ke owner, management, HRD, dan finance — tanpa harus rakit manual dari screenshot dan spreadsheet lagi.

Sebelum melakukan apa pun, baca urutan berikut secara penuh, jangan diskip:

1. `/AGENT.md` — aturan kerja, arsitektur, proses. Ini aturan tertinggi soal cara kamu bekerja.
2. `/PRD.md` — apa yang dibangun dan kenapa: modul, alur pengguna, data, fase pengerjaan.
3. `/DESIGN.md` — arah visual: Editorial Data Product, bukan template SaaS generik.
4. `/ANTISLOP.md` — filter kualitas, daftar hal yang WAJIB dihindari (gradient purple, card wall, emoji dekoratif, sparkle AI, dsb).

Setelah membaca keempatnya, lakukan working order sesuai AGENT.md §02 sebelum menulis kode apa pun:
inspect repo → package.json → routes → components → database → env vars → dokumentasi terkait → arsitektur existing → baru buat implementation plan.

### TUGAS PERTAMA (Phase 1 sesuai PRD.md §11)

Bangun fondasi awal:

1. Setup project (Next.js + TypeScript strict, feature-oriented architecture sesuai AGENT.md §04 — folder `features/dashboard`, `features/analytics`, `features/content`, `features/reports`, dst, plus `components/`, `lib/`, `hooks/`, `types/`, `services/` di level shared).
2. shadcn/ui boleh dipakai sebagai primitive saja — styling akhir wajib custom sesuai DESIGN.md, bukan tampilan default shadcn (AGENT.md §12, ANTISLOP.md §29).
3. Bangun halaman **Dashboard** (PRD.md §6.1, DESIGN.md §13–14): bukan hero besar, langsung tampilkan context line kecil → judul besar → periode waktu → performa level tinggi. Gunakan data seed yang jelas ditandai sebagai demo data (AGENT.md §06, ANTISLOP.md §25–26) — jangan ada angka fiktif yang terlihat seperti data asli.
4. Bangun modul **Content** (PRD.md §6.3): log konten dengan ranking berdasarkan performa, bukan grid card identik (DESIGN.md §15, ANTISLOP.md §09).
5. Bangun modul **Analytics** dasar (PRD.md §6.2): input manual dulu, chart yang menjawab satu pertanyaan spesifik per chart (DESIGN.md §17, ANTISLOP.md §19).
6. Bangun kerangka **Reports** (PRD.md §6.9, DESIGN.md §23): layout kiri (sections) — tengah (report) — kanan (configuration). Metrik inti harus deterministik dan reproducible (AGENT.md §20).

### CONSTRAINT WAJIB

- Strict TypeScript, hindari `any` (AGENT.md §05).
- Setiap metrik wajib punya value + date + source. Tidak ada history yang di-overwrite (AGENT.md §07, PRD.md §08).
- Tidak ada scraping Instagram tanpa izin. Tidak ada data manual yang diklaim "live" (AGENT.md §08, ANTISLOP.md §27).
- Setiap view async wajib punya 4 state: loading, success, empty, error (AGENT.md §17). Loading pakai skeleton, bukan spinner generik (DESIGN.md §31).
- Test responsive di 390px, 768px, 1024px, 1440px — tidak boleh ada horizontal overflow (AGENT.md §13, ANTISLOP.md §37).
- Sebelum halaman UI dianggap selesai, jalankan Final Slop Audit dari ANTISLOP.md §40 dan laporkan hasilnya dalam format PASS/FAIL sesuai §41.
- Jangan animasikan semua elemen — motion hanya untuk hierarchy/feedback/continuity (DESIGN.md §25, ANTISLOP.md §21–23).
- Sebelum menyatakan selesai: jalankan typecheck, lint, build. Perbaiki semua error sebelum lapor selesai (AGENT.md §22).

### FORMAT LAPORAN AKHIR

Setelah implementasi, laporkan dalam format AGENT.md §25:

1. Apa yang berubah
2. File yang berubah
3. Keputusan desain penting yang diambil
4. Test yang sudah dijalankan
5. Isu yang masih tersisa

Plus tambahkan hasil **ANTI-SLOP RESULT** (Color/Typography/Layout/Cards/Icons/Copy/Motion/Data/Responsive/Accessibility/Overall — masing-masing PASS/FAIL) sesuai ANTISLOP.md §41.

Jangan klaim sesuatu berfungsi kalau belum benar-benar ditest. Kalau ada bagian PRD.md yang ambigu (lihat §12 Open Questions), tanyakan dulu sebelum berasumsi.

---

## CATATAN PENGGUNAAN

- Kalau Antigravity/Gemini Flash 3.8 langsung nge-generate UI generik (card wall, gradient purple, dsb), tinggal balas: "cek ulang ke ANTISLOP.md §[nomor], ini melanggar."
- Untuk task lanjutan (Phase 2 dst — Competitors, Trends, Stories), bikin prompt baru yang tetap merujuk ke keempat file ini, jangan asumsikan Antigravity "ingat" konteks dari sesi sebelumnya kalau context window-nya reset.
