# Landing page I See You Intelligence

Preview: https://iseeyou-workspace-landing.premiumportal4.chatgpt.site
Dashboard tujuan: https://iseeyou-marketing-intelligence.vercel.app/dashboard

## Isi paket
- nextjs/: enam file untuk integrasi ke repo IMI.
- IMI_Landing.patch: perubahan terhadap main commit f85cfde030c8a6f3cb7d333196a0828025bb3b70.
- Preview_Landing_IMI.html: versi satu file, bisa dibuka di browser tanpa instalasi.

## Cara pasang dengan Antigravity
Buka folder project IMI Anda. Extract paket ini di folder terpisah, lalu berikan instruksi berikut:

"Integrasikan landing page dari paket IMI_Landing_Integration ke project IMI ini. Baca AGENT.md, DESIGN.md, ANTISLOP.md dan periksa git status dulu. Bandingkan enam file dalam folder nextjs dengan kode terbaru, kemudian terapkan perubahan secara incremental. Jangan menimpa perubahan lokal saya. Root app/page.tsx harus menampilkan LandingView, bukan redirect server langsung. AppFrame mempertahankan shell sistem di halaman lain dan menyembunyikannya hanya pada root landing. Gunakan logo yang sudah ada di public/brand. Jangan ubah source data, API, proteksi Reports/Finance atau sistem login bagian sensitif. Entry landing menyimpan preferensi lokal imi.workspace.v1, tanpa akun/password; kunjungan berikutnya ke root langsung ke /dashboard. Query ?intro=1 harus selalu dapat membuka ulang landing. Jalankan typecheck, lint, build, lalu cek browser pada 390, 768, 1024 dan 1440 px serta alur pengguna baru/kembali, keyboard, reduced motion. Setelah verifikasi, gunakan workflow deployment Vercel project yang sudah ada dan laporkan URL serta commit yang benar-benar terdeploy."

Jika source masih sama dengan baseline dan tidak ada perubahan lokal bertabrakan, alternatifnya:

```bash
git apply --check IMI_Landing.patch
git apply IMI_Landing.patch
npm run typecheck
npm run lint
npm run build
```

Jika check patch gagal, jangan force apply atau reset. Gunakan perbandingan file melalui Antigravity.

## Alur masuk
- Pertama kali: CTA membuka pemilihan workspace, pilih jaringan/cabang, lalu Lanjut ke dashboard.
- Ingat pilihan aktif: preferensi version 1 dan cabang disimpan di localStorage.
- Kunjungan berikutnya ke root: location.replace('/dashboard').
- Membuka ulang landing: /?intro=1, juga melalui link Tentang workspace di footer sistem.
- Menonaktifkan Ingat pilihan saat masuk menghapus preferensi lama.
- Browser yang memblokir storage tetap dapat membuka dashboard; auto entry tidak dijanjikan pada browser tersebut.
- Preferensi hanya berlaku pada browser dan origin yang sama. Incognito, perangkat lain atau storage yang dihapus memulai alur lagi.
- Pilihan cabang adalah preferensi perangkat, bukan filter dataset dashboard dan bukan otorisasi. Semua modul yang sebelumnya tersedia tetap mengikuti perilaku sistem.
- Proteksi Reports dan Finance tetap berlaku. Tidak ada cookie/token autentikasi yang dibuat oleh landing.
- Preview terpisah menuju Vercel melalui URL absolut; preferensi pada origin preview tidak ditransfer ke origin Vercel. Setelah kode ini dipasang pada root Vercel, entry dan dashboard berada pada origin yang sama.

## Desain dan interaksi
Warna putih hangat dan hijau I See You. System font memakai SF Pro pada perangkat Apple dan Segoe UI pada Windows. Tidak ada download font atau library 3D tambahan. Perspektif CSS merespons pointer, memiliki opsi datar dan menghormati reduced motion. Tab Ringkasan, Konten, Operasional dapat dijelajahi dengan pointer dan keyboard. Dialog memakai elemen native HTML. Preview bar aktivitas diberi label visual ilustratif; tidak menyatakan angka performa riil.

## Validasi yang selesai
- npm run typecheck: PASS.
- npm run lint: PASS, tanpa warning/error ESLint.
- npm run build: PASS, seluruh 21 halaman generated, seluruh route existing masih dibangun.
- git diff --check: PASS.
- 10 test DOM untuk first entry, repeat entry, intro override, opt out, storage invalid/blocked, tab keyboard, reduced motion, cleanup Strict Mode, dan ID/copy UI: PASS.

Browser QA visual, native focus trap, overflow aktual di setiap breakpoint dan screenshot belum diverifikasi pada runtime ini. Test DOM bukan pengganti pengujian browser. Perlu cek hasil di browser sebelum deployment produksi IMI.

Deployment preview terpisah berhasil; deployment Vercel project asli belum diubah. Build tidak menandakan seluruh fitur data sistem telah diperbaiki.
