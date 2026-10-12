# Prompt Antigravity — IMI siap meeting 13 Oktober 2026

Gunakan model Gemini 3.8 Flash dengan thinking High bila tersedia di model selector. Pengaturan model dilakukan di Antigravity, bukan melalui teks prompt.

Cara pakai: buka folder lokal repo IMI di Antigravity. Salin seluruh bagian PROMPT EKSEKUSI di bawah ke chat agent. Prompt ini juga dapat dipakai oleh Codex pada repo yang sama. Jalankan satu agent penulis pada satu branch agar perubahan tidak saling menimpa.

## PROMPT EKSEKUSI

Anda adalah engineer penanggung jawab pemutakhiran I See You Marketing Intelligence (IMI). Audit, perbaiki, jalankan, dan verifikasi project ini sampai menghasilkan release candidate yang dapat dipresentasikan pada meeting Selasa, 13 Oktober 2026. Jangan berhenti pada rencana, saran, atau perubahan tampilan saja.

REPOSITORY:
https://github.com/Yoshput/IMI.git
WEBSITE SAAT AUDIT:
https://iseeyou-marketing-intelligence.vercel.app/dashboard

KONTEKS PRODUK:
Platform internal marketing intelligence Optik I See You: Purwokerto, Purbalingga, Cilacap, Wonosobo; serta Lunar Eyewear Tegal sebagai second brand. Ada 6 PIC: Nuha untuk Story PWT, Ilya untuk Reels PWT, Ajun untuk PBG, Arum untuk CLP, Febi untuk WNS, Amanda untuk TGL. Konfirmasikan pemetaan dari konfigurasi dan sumber yang sudah tersedia. Domain optikiseeyou.com melayani 4 cabang ISY; jangan mengatribusikan trafik domain itu ke Lunar tanpa bukti.

TUJUAN:
Seluruh halaman dan fitur memakai data terbaru yang benar-benar tersedia, konsisten, dapat ditelusuri, dan layak untuk evaluasi manajemen. Data terbaru bukan sekadar tanggal baru. Jangan mengarang angka, transaksi, insight, followers, booking, harga, kapasitas, jadwal, keputusan proposal, atau hak penggunaan konten KOL.

1. MULAI DARI REPO DAN BUKTI
- Baca AGENT.md, PRD.md, DESIGN.md, ANTISLOP.md, VENUE_EVENT_INTELLIGENCE.md dan instruksi lokal lain yang relevan.
- Periksa git status dan branch. Pertahankan perubahan lokal pengguna. Buat branch perbaikan meeting dari kondisi kerja yang aman; jangan reset, force-push, atau menghapus histori.
- Inventaris semua routes, subtab, komponen, endpoint, fungsi ekspor, form, sumber data, cache, dan tempat penyimpanan.
- PRD awal masih menyebut satu cabang dan scope yang lebih kecil. Rekonsiliasikan dengan project yang sudah mempunyai 5 wilayah dan modul tambahan; pertahankan fitur yang sudah berjalan.
- Periksa nama env yang dibutuhkan dan status ketersediaannya tanpa mencetak nilai rahasia.
- Buat checklist P0/P1/P2 dengan bukti file/fungsi, lalu langsung kerjakan P0 dan P1. P2 masuk backlog setelah alur meeting lulus.

2. TEMUAN AWAL YANG WAJIB DIVERIFIKASI DAN DIPERBAIKI
Temuan berikut berasal dari audit live UI dan main repo commit f85cfde030c8a6f3cb7d333196a0828025bb3b70 pada 12 Oktober 2026. Cek ulang karena repo/deployment bisa berubah:
- features/dashboard/components/DashboardView.tsx masih memakai periode 29 Sep–5 Okt/rapat 6 Okt dan totalPostsPublished=36.
- Header/nav menampilkan Week 40; KpiMetricGroup masih bertajuk Week 39; KPI produksi menampilkan 38; header pertumbuhan +90.3% sedangkan KPI +7.2%. Ada pembanding vs W36. Telusuri definisi masing-masing, jangan menyamakan angka dengan menebak.
- lib/actual-marketing-data.ts berisi konstanta KPI dan narasi bertanggal 6 Oktober. Klaim ACTUAL/isDemo:false bukan bukti data nyata.
- lib/gsc.ts menghasilkan calibrated_mock tetapi isLive:true. fetchGscReport masih mengembalikan simulasi bahkan saat env kredensial tersedia.
- app/api/traffic/route.ts membentuk pengunjung, sesi, aktivitas, channel, dan pertumbuhan dari konstanta/kurva jam.
- lib/antrian-tracking.ts memakai seeded events, nilai dasar booking/photobooth, dan counter in-memory. Berbagai tipe event menaikkan counter yang sama.
- app/api/track-event/route.ts mempunyai GET action ping/simulate yang menulis event. Jangan panggil fitur ini di production untuk pengujian.
- lib/real-content-items.ts memakai rentang “weekly” 20 Sep–31 Okt, bukan 7 hari. Live /content menampilkan konten September pada label “7 Hari Terakhir”.
- app/api/content-items/route.ts punya daftar refresh URL statis, fallback waktu sekarang, dan success message walaupun refresh dapat gagal.
- app/api/sync-sheets/route.ts memetakan sejumlah kolom berdasarkan indeks. Live spreadsheet menampilkan “Kendala PIC: 46303/46301/46299” dan URL menjadi keterangan kategori. Ini indikasi mapping/parser salah, bukan kendala asli.
- features/analytics/components/AnalyticsView.tsx melakukan refresh waktu melalui timer; ManualEntryModal menambah history hanya ke state React.
- features/competitors/components/CompetitorRadarView.tsx handleRefresh memakai setTimeout dan pesan live crawl tanpa request sumber.
- features/pengajuan/components/PengajuanHubView.tsx membaca JSON yang di-import statis.
- lib/venue-service.ts menyimpan ke JSON, /tmp, dan memori; app/api/kol/route.ts menulis JSON; proposal-decisions melaporkan “permanen” walaupun write dapat gagal; Aftersales PATCH mengubah cache memori.
- lib/auth.ts mempunyai password fallback dalam source dan token sesi deterministik. SensitiveGate berada di client; audit proteksi server dan API, termasuk bonusSummary dari sync-sheets serta data pelanggan Aftersales.
- MeetingReportModal masih menanam angka followers/fallback statis. ReportBuilderView menggunakan ACTUAL_WEEKLY_REPORT dan state approval lokal.
- Label Aftersales “Hari Ini (29 Sep)” dan “Bulan Ini (September 2026)” sudah tertinggal.
- UI kompetitor menyebut 16 lokal/9 nasional, sementara tab menyebut 17/10. UI Venue menunjukkan 17 venue, 0 terverifikasi; jangan menaikkan status tanpa evidence.
- KOL menyebut followers sebagai estimasi reach dan kesiapan raw footage 12/12; verifikasi sumber dan bukti persetujuan, bukan asumsi.

3. SATU PERIODE DAN SATU DEFINISI DATA
- Buat konfigurasi bersama: timezone Asia/Jakarta, meetingDate 2026-10-13, evaluationStart 2026-10-06, evaluationEnd 2026-10-12, previousStart 2026-09-29, previousEnd 2026-10-05.
- Nama utama “Siklus 8 · 6–12 Oktober 2026 · Rapat 13 Oktober”. Jangan mencampur nomor siklus bisnis dengan ISO week.
- Batas waktu dihitung di server dengan timezone eksplisit. Pada 12 Oktober sebelum hari berakhir, periode masih parsial; tampilkan dataAsOf aktual. Jangan mengklaim data penuh sampai 23:59 ketika cutoff belum terjadi.
- Bedakan siklus rapat, rolling 7 hari, 30 hari terakhir, bulan kalender, custom range, serta periode historis.
- Dashboard, spreadsheet, content, analytics, reports, meeting, finance, clipboard, dan export memakai agregasi/selector yang sama untuk scope yang sama.
- Pisahkan publishedAt, reportSubmittedAt, metricObservedAt, fetchedAt, lastSuccessfulSyncAt, reportGeneratedAt. Timestamp request baru tidak membuat observasi lama menjadi baru.
- Metrik perlu value number|null, unit, platform, branch, period, sourceType, sourceRef, observedAt, verificationStatus, isDemo, dan reason bila kosong. Implementasikan dengan tipe domain yang sesuai arsitektur repo.
- Null = tidak tersedia; 0 = benar-benar nol berdasarkan sumber. Jangan memakai fallback “|| angka-buatan”.
- Jangan menyebut views sebagai unique reach, followers sebagai reach atau unique audience, atau klik WhatsApp sebagai pasien terdaftar.
- Interaksi dipisah likes/comments/shares/saves/DM; label harus sesuai komponen yang dihitung.
- ER harus menyebut denominator; jangan menjumlah/merata-ratakan persentase sembarangan. CTR total = total clicks/total impressions.
- WoW hanya muncul jika kedua periode sebanding dan baseline tersedia; baseline 0 tidak menghasilkan infinity atau pertumbuhan buatan.
- Followers adalah snapshot per akun/platform, bukan penjumlahan snapshot harian. Gabungan IG+TikTok bukan audiens unik.
- H+3 mengikuti aturan evaluasi yang ada dan dibuktikan sumber. Pisahkan pending H+3, evaluasi jatuh tempo tetapi belum diisi, dan evaluasi lengkap.

4. PERBARUI SUMBER YANG TERSEDIA
- Gunakan integrasi Sheets yang sudah dikonfigurasi untuk rekap Story, Reels per cabang, followers, alat, proposal, kas, serta sumber Aftersales/customer.
- Baca schema/header aktual. Gunakan mapping header yang dinormalisasi dengan alias eksplisit per tab; jangan mengandalkan posisi tanpa validasi.
- Uji tanggal Excel serial, tanggal teks Indonesia, timestamp, multiline, angka 52,1k/1,7rb/29.156, missing value, dan duplikasi.
- Jangan mengubah angka biasa menjadi ribuan tanpa konteks field. Validasi satuan followers dari sumber.
- Simpan raw import dan provenance row/tab/importRunId untuk audit; row number bukan satu-satunya ID stabil.
- Normalisasikan URL post/reel dan deduplikasi berdasarkan ID konten+platform+akun. Evaluasi H+3 harus terkait konten yang tepat.
- Refresh harus menemukan item baru dari sumber aktual; bukan hanya memperbarui daftar URL lama.
- Sync dicatat per sumber/cabang: berhasil, parsial, gagal, stale, belum dikonfigurasi. Pertahankan snapshot terakhir yang berhasil.
- Beri timeout, penanganan rate-limit, retry terbatas, dan cache bersama. Hindari setiap widget mem-fetch workbook yang sama sendiri.
- Jangan memberi label Meta API/Instagram Insights pada data yang hanya berasal dari HTML metadata, screenshot, input manual, atau spreadsheet. Gunakan API resmi bila akses tersedia; jika tidak, gunakan import resmi/manual dengan bukti.
- Jangan memperluas crawler atau mengakali login/anti-bot.
- Implementasikan GSC API nyata hanya dengan kredensial dan izin property yang tersedia, atau import export GSC. Bila belum tersedia, status “Belum terhubung”; gunakan snapshot terverifikasi bertanggal jika ada.
- GSC bukan sumber pengunjung aktif, sesi, kota dari ISP, atau booking. Jangan membuat city breakdown GSC; gunakan sumber lokasi terpisah yang sah atau atribusi landing page cabang yang diberi label.
- Hormati timezone/latensi data provider, termasuk tanggal GSC; tampilkan perbedaannya dari periode WIB bila relevan.
- Gunakan GA4/provider analytics/event store nyata untuk trafik bila sudah tersedia. Tanpa sumber itu, sembunyikan grafik simulasi dari laporan produksi dan beri empty state.
- Jangan mengganti angka simulasi dengan angka karangan yang “lebih realistis”.

5. PENYIMPANAN DAN AKSES — P0
- Data operasional yang dapat diedit perlu durable storage yang tersedia untuk deployment ini. Gunakan provider yang sudah ada; jangan mengasumsikan Supabase/Neon tertentu telah terpasang.
- JSON repo boleh menjadi seed/snapshot read-only, bukan tempat write utama production. /tmp, state React, localStorage, dan cache memori bukan penyimpanan bersama permanen.
- Buat schema/migrasi/import yang aman, idempotent, serta backup sebelum migrasi. Pertahankan histori dan audit actor/time.
- Persist keputusan proposal, KOL, Venue/event/outreach/survei/budget, Aftersales status/notes/log, manual metrics, dan report draft/approval.
- Success hanya setelah commit storage benar-benar berhasil. Tampilkan error write; jangan memalsukan sukses.
- Jika durable storage belum tersedia, selesaikan jalur baca berbasis snapshot valid dan nonaktifkan write terkait dengan keterangan jelas. Catat sebagai BLOCKED, bukan DONE. Jangan menutup hambatan hanya dengan /tmp.
- Implementasikan autentikasi/otorisasi server untuk data internal dan operasi tulis. Hapus password fallback source; missing env harus fail closed.
- Session memakai mekanisme aman, expirasi, rate-limit login, dan pemeriksaan izin endpoint. Proteksi UI saja tidak cukup.
- Pisahkan payload keuangan dari endpoint umum. Cegah data bonus, kontak pribadi, alamat, dan resep pelanggan terkirim ke pengguna tanpa izin.
- Presentation/export meeting menggunakan agregat, minimalkan data personal. Tidak mengirim pesan/WhatsApp, mengubah deal, atau melakukan pembayaran secara otomatis.
- Event publik boleh tetap menerima telemetry tervalidasi tanpa login pengguna internal, tetapi gunakan schema, eventId/idempotency, rate limit, aturan origin sesuai domain resmi. CORS saja bukan autentikasi.
- GET tidak menulis event simulasi. Test/demo traffic terpisah dan tidak masuk KPI production.

6. CHECKLIST SELURUH HALAMAN
A. /dashboard
KPI, target/output, top content, ringkasan 5 wilayah, kepatuhan 6 PIC, kendala, dan tindakan dari periode terpilih. Ambil target dari kebijakan sumber; jangan menganggap 14 target jaringan bila sebenarnya per PIC. Semua drill-down cocok dengan total. Status data terlihat tanpa memenuhi layar dengan jargon.

B. /spreadsheet — seluruh tab
Rekap 3 hari/mingguan, alat, proposal, kas, direksi, kepatuhan, followers, raw log, detail PIC, webhook, meeting modal dan copy WA. Data raw diurutkan tanggal secara benar. Kepatuhan berdasarkan jadwal/cutoff yang terdokumentasi, bukan latestDate saja. Distinguisikan “tidak ada laporan” dari “tidak ada aktivitas”. Perbaiki mapping PWT dan evaluasi H+3. Push webhook harus benar-benar dikonfigurasi/terlindungi atau diberi status belum aktif.

C. /content
Filter periode/cabang/format dan ranking benar. Top performer berasal dari filter yang sama; jangan menampilkan konten luar filter saat hasil kosong. Bedakan Reels/carousel/feed/story. Sumber dan tanggal metrik sesuai observasi. Thumbnail/link/modal bekerja dan fallback gambar tidak mengubah bukti metrik.

D. /pengajuan, /sponsor, /proposal, /proposal-sponsor dan alias yang ditemukan
Hubungkan daftar dan jumlah pengajuan terbaru dengan sumber yang sama; pertahankan stable ID dan keputusan nyata. Validasi formulir dan simpan sebelum memberi sukses. Nomor tujuan WA dari konfigurasi yang terverifikasi. Membuka WA adalah draft, bukan bukti pesan terkirim. Jangan mengubah pending menjadi approved/contacted tanpa aksi pengguna dan audit. Pisahkan draft penawaran dari kontrak/deal.

E. /aftersales
Tanggal/filter, pencarian, cabang, status, detail, update notes/log, ranking frame/lensa benar dan persist. Jangan reset perubahan follow-up setelah sync. Sumber nol, loading, error, dan empty dibedakan. Angka transaksi dan best seller dihitung dari dataset serta periode yang jelas; tidak ditanam di copy. Detail pelanggan dilindungi server dan tidak dimasukkan ke meeting umum.

F. /competitors — semua subtab
Radar lokal/nasional, harga, tren frame, jadwal wisuda, positioning, fitur, konten/tren dan aksi. Jumlah berasal dari dataset. Setiap klaim dinamis punya URL bukti, observedAt, lokasi, confidence/status. Verifikasi sumber resmi terbaru yang dapat diakses; harga promo expired ditandai. Tanpa bukti baru, pertahankan tanggal lama/stale. Tombol “Perbarui” harus melakukan refresh nyata atau alur review manual jujur. Label FACT/INTERPRETATION/RECOMMENDATION; inferensi seperti penyebab retention turun butuh metrik atau diberi label hipotesis.

G. /kol
Data kandidat, followers, ER, rate card, status, kontak, histori kolaborasi/eksklusi dan penggunaan footage bertanggal dan bersumber. Rate card belum diterima = null; budget target bukan tarif talent. Raw footage rights “belum dikonfirmasi” sampai ada evidence agreement. Header “12/12 siap” dan daftar kandidat dihitung dari data aktual. Link profil/video dicek; jangan membuat video ID. CRUD/filter/copy/export persist dan benar.

H. /venue — semua subtab
Database, detail, komparasi, outreach, event planner, survei, anggaran dan export. Alamat/kapasitas/harga/status punya bukti atau unverified. Score berasal dari metode dan coverage bukti, bukan tampilan kepastian. Zero verified dipertahankan bila bukti belum ada. Shortlist boleh dibuat sebagai rekomendasi riset dengan ketidakpastian. Jangan mengubah lead menjadi “dihubungi/terkonfirmasi” tanpa aksi/bukti. Total budget dari line items; aktual dan estimasi dipisah.

I. /analytics
Grafik/history, input manual, format efficiency, TikTok, trafik dan GSC memakai sumber bersama. Refresh tidak hanya mengganti jam. History bertahan reload. Hapus klaim realtime saat hanya snapshot. Grafik trend tidak dibentuk dari konstanta atau proyeksi tanpa label. Nol valid boleh diinput.

J. /reports
Bangun draft terbaru dari snapshot periode yang sama dengan dashboard. Struktur: ringkasan, pencapaian, kendala, plan/strategi, masukan tim, keputusan yang diminta. Setiap tindakan punya PIC, deadline dan indikator hasil. Narasi manual/AI diberi label dan tidak menambah fakta. Report status awal draft, bukan otomatis reviewed/final; approval persist dan sesuai izin.

K. /finance
Bonus H+3, kas, per-PIC/cabang/periode memakai sumber valid. Pisahkan eligible/approved/paid; payment hanya jika bukti pembayaran ada. Hindari menyebut bonus “terbayar” dari kalkulasi eligibility saja. Klaim penghematan setara ads/Rp8.4 juta hanya boleh sebagai estimasi dengan asumsi terbuka atau dihapus. Jaga akses server, export, dan clipboard.

L. Shared UI
Navigasi/nav period/footer/live badge/dev controls, dark/light, loading/empty/error/retry, modal/focus/keyboard, mobile tables, print styles dan format angka/tanggal. QA Dev Mode hanya untuk lingkungan development/akses yang sesuai. Jangan menambah teks teknis dari DESIGN.md ke produk.

7. HASIL MEETING YANG HARUS TERSEDIA
- Gunakan/refactor MeetingReportModal dan ExecutiveMeetingRecap yang sudah ada; jangan membuat sistem presentasi duplikat tanpa kebutuhan.
- Entry “Mode Rapat” membuka komposisi khusus yang enak dibaca di proyektor; navigasi kecil dan tabel mentah tidak mendominasi.
- Paket rapat 13 Oktober: periode 6–12 Oktober, dataAsOf, status sumber dan cakupan; ringkasan jaringan dan per cabang/PIC; Story+Reels/H+3; followers per platform; kendala yang benar dari input PIC; rekomendasi KOL/kompetitor/venue; pengajuan/aftersales agregat; finance hanya untuk audiens berizin.
- Top 3 pencapaian/kendala hanya jika bukti tersedia. Metrik belum tersedia tidak diisi agar terlihat lengkap.
- Tampilkan keputusan yang dibutuhkan dan daftar aksi: tindakan, PIC, deadline, indikator sukses.
- Web/booking/GSC masuk paket hanya jika terverifikasi; bila belum, tampilkan keterbatasan singkat dan jangan gunakan untuk klaim hasil.
- Buat snapshot immutable reportId+schemaVersion+period+generatedAt+dataAsOf+source versions. Perubahan live selanjutnya tidak mengubah laporan yang sudah finalized.
- Print/PDF dan copy teks rapat mengambil snapshot yang sama. Tampilan cetak tidak terpotong, tidak memuat nav/dev controls atau data personal yang tak diperlukan.
- Snapshot terverifikasi terakhir tetap dapat dibaca ketika integrasi gagal. Jelaskan tanggal/statusnya; jangan berubah menjadi angka nol.

8. PRIORITAS DAN BATAS RILIS
P0: integritas angka/sumber/periode; parser; akses data internal; persist atau penonaktifan write tidak andal; laporan meeting terverifikasi.
P1: semua page/subtab/form/filter/export dan link utama; kualitas presentation/print; bug UI.
P2: integrasi baru yang belum punya akses, fitur perluasan, otomatisasi tambahan, redesign besar.

Pertahankan Next.js/React/TypeScript dan arsitektur yang berjalan. Jangan mengganti seluruh aplikasi atau menambah banyak dependencies untuk mengejar deadline. Bila akses provider menghambat satu modul, kerjakan modul lain dan tampilkan blocker spesifik. Tidak mengklaim semua data live ketika sebagian manual/stale.

9. VERIFIKASI WAJIB
- Install dari lockfile sesuai package manager, lalu npm run typecheck, npm run lint, npm run build, npm run test:venue.
- Verifikasi kompatibilitas script “next lint” dengan versi Next terpasang. Bila script gagal karena konfigurasi/tooling, perbaiki konfigurasi yang tepat; jangan menghapus lint atau mematikan rule agar lolos.
- Tambah test bermakna untuk period boundary/WIB, Excel date+mapping, null vs zero, dedupe, H+3, total per cabang vs jaringan, WoW denominator, persistence failures, auth data access, dan snapshot/report export.
- Uji semua route dan seluruh subtab di 390/768/1024/1440 px, light/dark, keyboard, loading/error/empty dan print. Tabel boleh horizontal-scroll di wrapper; halaman tidak overflow.
- Uji CRUD di local/preview dengan data test terpisah. Read-after-write dari instance/session baru; jangan mengandalkan refresh di instance yang sama sebagai bukti permanen.
- Uji unauthorized read/write tidak menerima payload sensitif; finance tidak muncul di endpoint umum.
- Uji gagal sync tidak memberi success palsu, dan tidak mengubah observedAt snapshot lama.
- Uji klik biasa/photobooth tidak terhitung sebagai confirmed booking. Jangan menjalankan ping/simulate terhadap production.
- Uji seluruh tombol: sync, input, save, filter, sort, modal, copy, export/print, meeting. Jangan hanya menyatakan “semua tombol bekerja” tanpa hasil.
- Pastikan console/runtime/HTTP error kritis selesai. Catat limitation yang belum terselesaikan.
- Cocokkan dashboard, sheet recap, content, report, meeting, clipboard dan PDF untuk period/scope/snapshot yang sama.

10. DEPLOYMENT DAN LAPORAN AKHIR
- Buat release candidate dan gunakan preview deployment melalui alur project yang sudah terhubung bila akses tersedia.
- Build lokal lolos bukan bukti Vercel sudah update. Verifikasi deployment commit, env yang dibutuhkan, migrasi yang telah diterapkan, URL dan hasil smoke test.
- Siapkan diff/commit terfokus, ringkasan perubahan, serta langkah rollback. Jangan mengirim source/customer data ke layanan baru tanpa kebutuhan dan izin.
- Production mengikuti otorisasi deployment pengguna dan workflow repo. Jika akses push/deploy tidak tersedia, laporkan langkah tepat; jangan menyatakan live sudah diperbaiki.
- Hasil akhir wajib memuat:
  a. Perubahan dan file terkait.
  b. Matriks setiap page/fitur: DONE / PARTIAL / BLOCKED / NOT TESTED.
  c. Source, observedAt, lastSuccessfulSyncAt, period dan status verifikasi per modul.
  d. Jumlah records import/dedupe/quarantine serta error mapping.
  e. Test commands dan hasil nyata; screenshot desktop/mobile/meeting/print.
  f. Link preview/production yang benar-benar diuji dan commit deployment.
  g. Daftar data/akses yang belum tersedia.
  h. Paket rapat dan walkthrough 5–10 menit.
  i. Keputusan GO/NO-GO berdasarkan acceptance gates, bukan kesan UI.

Mulai sekarang: baca repo, buat checklist singkat, lalu implementasikan dan uji. Jangan berhenti setelah audit. Jangan menjanjikan semua terhubung tanpa bukti. Selesai berarti angka jujur, sumber terlihat, interaksi bekerja, data edit tersimpan, dan meeting dapat dijalankan dengan snapshot yang konsisten.

## Catatan audit dan batas verifikasi
Audit pendahuluan dilakukan pada 12 Oktober 2026 melalui navigasi website dan pembacaan kode main commit f85cfde030c8a6f3cb7d333196a0828025bb3b70. Ini bukan pengujian seluruh kombinasi fitur, build, integrasi dengan kredensial production, atau hasil implementasi. Isi Reports/Finance dibaca dari source; akses halaman live tidak dibuka menggunakan password. Data Aftersales tidak diunduh untuk paket audit ini. Repo/deployment belum diubah oleh penyusun prompt.

Angka terbaru yang terlihat pada spreadsheet saat audit: periode Siklus 8, 92 Story, 18 video dan 27 DM; 5/6 PIC berstatus up-to-date, CLP terakhir 22 September. Itu observasi UI sementara, bukan pengganti pemeriksaan raw source dan parser. Jangan menanam angka tersebut sebagai hasil final.

Rujukan provider:
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://antigravity.google/blog/gemini-3-8-flash-in-google-antigravity/
- https://learn.chatgpt.com/docs/codex/ide
- https://learn.chatgpt.com/docs/auth
- https://learn.chatgpt.com/docs/pricing

