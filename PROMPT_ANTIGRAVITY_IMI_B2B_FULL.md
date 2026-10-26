# MASTER PROMPT — IMI B2B MERCHANT PARTNERSHIP

Model yang diminta: Gemini 3.8 Flash High (jika tersedia di Antigravity; jika tidak, pilih model Flash dengan reasoning/high thinking terdekat dan laporkan model aktual).

Anda adalah senior full-stack engineer, UX designer, dan data-verification analyst. Kerjakan repository https://github.com/Yoshput/IMI pada halaman /pengajuan. AUDIT kode, skema data, dan komponen yang ada SEBELUM mengedit. Jangan merusak fitur, daftar sponsor, kontak, status, atau paket existing.

## Tujuan
Buat direktori prospek B2B multi-kategori untuk Purbalingga, Cilacap, Wonosobo, sambil mempertahankan daftar lama termasuk merchant di Purwokerto. Skema kerja sama: pertukaran voucher, brosur silang, promosi Instagram, bundling, barter benefit. Semua hanya usulan sampai disetujui. Pisahkan kategori `F&B`, `Fashion & Apparel`, `Beauty & Cosmetics`, `Health & Wellness`, `Entertainment`, `Lifestyle & Retail`, dan `Other`. Pisahkan `category` dari `region`, `verificationStatus`, `outreachStatus`, `partnershipStatus`.

## Seed data yang WAJIB di-review, bukan langsung dipercaya
### F&B — 15 kandidat dari riset sebelumnya, semuanya KEEP
Purbalingga: Mie Gacoan Purbalingga; Pawon Semar Purbalingga; Pizza Hut Purbalingga; Bangjo Space & Kitchen; Titik Mula Coffee & Eats.
Cilacap: Mie Gacoan Cilacap; Pizza Hut Cilacap; Wizzmie Cilacap; d'pillars Resto; Fourtrees Coffee.
Wonosobo: Samarasa Coffee and Resto; Aroma Amazy Resto; Dewani View Resto & Cafe; De Koffie; Temu Kamu Wonosobo.
Jangan otomatis menganggap rating, jumlah ulasan, alamat, atau telepon dari percakapan sebelumnya sudah valid. Verifikasi ulang tiap outlet di Google Maps; konfirmasi identitas, alamat, status operasional, dan Instagram melalui sumber resmi. Jika tidak lolos, tetap pertahankan sebagai kandidat berlabel `needs_review`, jangan tampilkan sebagai verified.

### Non-F&B — kandidat tambahan dengan bukti awal
- GKP Store Purbalingga — Beauty & Cosmetics — Jl. Lingkar GOR No.10, Kalimanah; telepon kandidat 0822-6000-3903; profil bisnis https://linktr.ee/gkppbg dan https://linktr.ee/gkpstore_new; cocok voucher produk dan brosur.
- Pinkys Cosmetics Purbalingga — Beauty & Cosmetics — sumber awal https://karirpurwokerto.id/walk-in-interview-pinkys-cosmetics/; lokasi detail, Maps, Instagram, kontak WA harus diaudit.
- Mutiara Rezeki Internasional / toko grosir kaos dan daster Purbalingga — Fashion & Apparel — situs resmi https://mutiararezekiinternasional.com/contact/ ; toko Jl. Letkol Isdiman No.18; verifikasi nomor dan akun Instagram di halaman resminya.
- PT Mahkota Tri Angjaya (Mata Lashes), Purbalingga — Beauty Products / B2B Manufacturer — situs https://mata-lashes.com/ ; tercatat dalam direktori Pemkab Purbalingga https://kepenak-ngodene.purbalinggakab.go.id/mitra-formal/a52f6cc8-89e1-4374-8777-8807bfa76327 ; tipe kerja sama lebih cocok sponsorship/produk daripada voucher ritel.
- Ardani Butik Wonosobo — Fashion & Apparel — Jl. Veteran No.25; sumber https://linktr.ee/ardanibutik_wonosobo; cek Maps dan akun Instagram resmi.
- Jims Honey Wonosobo — Fashion & Accessories — outlet pernah diberitakan di Jl. S Parman, Ruko Joyosono No.15 (2022); https://www.wonosobozone.com/bisnis/amp/pr-4675380283/perkuat-pasar-online-jims-honey-dirikan-toko-offline-di-wonosobo ; WAJIB cek apakah outlet masih aktif pada 2026.
- Qween Cosmetics & Perfumes Wonosobo — Beauty & Cosmetics — Jl. Pasukan Ronggolawe No.22; kandidat telepon 0852-9364-2360; sumber https://www.semuabis.com/qween-cosmetics-perfumes-0852-9364-2360 ; verifikasi silang dengan Maps dan Instagram.
- Mirayya Cosmetics Wonosobo — Beauty & Cosmetics — sumber berita pembukaan cabang https://www.wonosobozone.com/berita/46715260972/antrean-panjang-untuk-mimpi-di-mirayya-cosmetics-ratusan-pelamar-ikuti-interview-langsung-di-wonosobo ; cek cabang masih buka.
- Rita Ritelindo Group / Rita Cilacap — Lifestyle & Retail — tercatat sebagai merchant Cilacap di dokumen Bank Mandiri: https://www.bankmandiri.co.id/documents/20143/175704414/20241003%2BList%2BMerchant%2BKawasan%2BMKN%2BAll%2BRegion%2B1-12.pdf/60b72bb8-de2f-5aa0-4d76-6b8ffca8ebdc?t=1728036366369&version=1.0 ; identifikasi outlet dan kontak resmi sebelum menambahkan.
- Sami Laris Cilacap — Lifestyle & Retail / Fashion (pastikan jenis toko) — Jl. Letjen Suprapto No.69 menurut daftar merchant Bank Mandiri; verifikasi cabang aktif, Maps, Instagram.
- Toserba Jadi Baru Cilacap — Lifestyle & Retail — Jl. Ahmad Yani No.97 menurut daftar merchant Bank Mandiri; verifikasi aktif, Maps, Instagram.

Cari TAMBAHAN merchant besar yang benar-benar ada di Cilacap dan kategori fashion, kosmetik, kesehatan (misalnya optik, klinik kecantikan, spa), serta Wonosobo dan Purbalingga. Target minimal 5 kandidat non-F&B per kabupaten, TETAPI jangan mengarang untuk memenuhi kuota. Jika bukti kurang, tampilkan backlog `research_pending` dengan alasan. Jangan mengasumsikan brand nasional memiliki cabang setempat tanpa bukti spesifik.

## SOP verifikasi per merchant (WAJIB satu per satu)
1. Cari Google Maps place/outlet yang cocok dengan kota, nama, dan alamat; simpan URL Maps asli (bukan link pencarian generik) jika tersedia. Catat place ID bila tersedia, rating, reviewCount, lastCheckedAt, status operasional.
2. Cari akun Instagram melalui situs resmi, bio/link-in-bio resmi, atau tautan Maps; jangan menebak username. Simpan URL dan bukti sumber. Bila tidak terbukti, `instagramUrl=null`.
3. Verifikasi nomor telepon/WhatsApp dari sumber bisnis yang dapat dipercaya; jika belum terbukti `phone=null`, jangan buat tombol Chat WA aktif.
4. Catat sumber untuk setiap fakta penting (`sourceUrl`, `sourceType`, `checkedAt`, `field`). Pisahkan `verified`, `partially_verified`, `needs_review`, `rejected`.
5. Cek duplikasi cabang dan normalisasi nama. Jangan menggandakan brand existing.
6. Bedakan fakta terverifikasi dari angle kolaborasi yang bersifat rekomendasi AI. Jangan menampilkan `sudah bekerja sama` tanpa bukti.
7. Tulis hasil audit per merchant: bukti, konflik, field kosong, keputusan dan alasan. Jangan pernah menyatakan Google Maps/Instagram sudah diperiksa jika akses browsing tidak tersedia.

## UX halaman /pengajuan
Pertahankan gaya visual screenshot existing: kartu rounded, badge kategori, kontak, box angle kolaborasi, rekomendasi benefit, tombol Salin Chat / Chat WA, dropdown status. Tingkatkan dengan header ringkas, total prospek, jumlah terverifikasi, belum dihubungi, follow-up, deal; tabs kategori, filter kota, pencarian nama, sort relevansi, filter verification dan outreach, chips status. F&B harus menjadi kategori sendiri dengan seluruh 15 kandidat lama. Sediakan list/grid responsive, skeleton loading, empty states, pagination atau virtualization bila data besar, microinteraction ringan, keyboard accessible, reduced-motion, WCAG contrast, mobile-first.

Kartu tampilkan: nama, badge kategori, kota, badge tingkat verifikasi, PIC (jika valid), nomor (jika valid), link Maps, link Instagram, angle kolaborasi, opsi voucher/brosur, rekomendasi benefit, dropdown outreach, Salin Chat, Chat WA. Tombol WA disabled dengan tooltip jika nomor belum valid. Buat modal `Detail & Bukti` menampilkan sumber dan tanggal cek. Jangan mengekspos nomor privat atau menyebut seseorang PIC tanpa bukti.

## Arsitektur & engineering
Audit stack dan pola state/data terlebih dahulu. Ikuti komponen, styling, dan persistence yang sudah ada. TypeScript types kuat, schema validation, stable IDs, data normalization, tidak ada duplikat, tidak ada destructive migration. Jika aplikasi memakai DB, tulis migration non-destruktif; jika static dataset, tambahkan typed seed dengan audit metadata. Jangan membuat backend baru jika tidak diperlukan. Data sumber dipisahkan dari UI. Status outreach harus persist; implementasi sesuai backend existing. Salin Chat membuat template natural dengan placeholder yang valid dan tidak mengklaim sudah ada persetujuan. Semua rekomendasi nominal harus jelas hanya estimasi internal, bukan tarif merchant.

## Acceptance tests
- Semua data existing tetap ada.
- F&B memuat 15 kandidat lama dan dapat difilter menurut 3 kabupaten.
- Kandidat non-F&B yang terbukti masuk kategori tepat; kandidat yang tidak terverifikasi tidak menyamar sebagai verified.
- Search, filters, status persistence, copy chat, Chat WA, link Maps/IG, responsivitas berfungsi.
- Tidak ada tautan IG/Maps/telepon karangan.
- Tidak ada runtime error, TypeScript error, broken layout atau duplicate records.
- Jalankan lint, typecheck, build, tes relevan; catat yang tidak bisa dijalankan.

## Output wajib
1. Ringkasan audit repository dan skema data.
2. Tabel audit merchant SATU PER SATU (nama, kota, kategori, Maps, IG, kontak, bukti, status, konflik).
3. Perubahan file beserta alasan.
4. Screenshot desktop/mobile jika lingkungan mendukung.
5. Hasil lint/typecheck/build dan bug yang tersisa.
6. Daftar `needs_review` dengan langkah verifikasi manual.

Jalankan secara bertahap: audit → verifikasi sumber → desain data → implementasi → tes → audit ulang. Berhenti pada field yang tidak terbukti; jangan mengarang. Prioritaskan kebenaran data dan kompatibilitas repo dibanding target kuantitas.
