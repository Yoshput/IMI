# Audit Total & Master Prompt Antigravity: Perbaikan Live Sync Halaman Konten (`Yoshput/IMI`)

Dokumen ini memuat hasil audit menyeluruh terhadap halaman [Evaluasi Kinerja Konten (/content)](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fcontent), perbandingan terhadap performa aktual di 5 akun Instagram ([@iseeyou.glasses](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.glasses%2Freels%2F), [@iseeyou.purbalingga](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.purbalingga%2Freels%2F), [@iseeyou.wonosobo](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.wonosobo%2F), [@iseeyou.cilacap](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.cilacap%2F), dan [@lunareyewear.co](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Flunareyewear.co%2Freels%2F)), bedah *root cause* pada kode repositori [Yoshput/IMI](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FYoshput%2FIMI), serta **Master Prompt Instruksi Eksekusi untuk Antigravity** yang siap disalin (*copy-paste*) langsung ke Antigravity agar seluruh perbaikan dieksekusi sampai tuntas.

## 1. Perbandingan Data Dashboard (`/content`) vs Aktual Live Instagram

Saat ini halaman [Evaluasi Kinerja Konten (/content)](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fcontent) tertahan pada snapshot data lama (`2026-10-08` s.d. `2026-10-12`) dan belum menampilkan konten-konten terbaru maupun konten *top performer* sesungguhnya per 16 Oktober 2026.

| Cabang & Akun Instagram | Tampilan di Dashboard (`/content`) Saat Ini | Kondisi Aktual di Live Instagram | Gap / Masalah Utama |
| :--- | :--- | :--- | :--- |
| **Purwokerto (Pusat)** ([@iseeyou.glasses](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.glasses%2Freels%2F)) | Menampilkan 8 item (5 Reels, 3 Carousel, 0 Single). Rank #1: *Bantuan Air Bersih di Purwokerto* (`19.178` reach, `654` likes) yang muncul **duplikat** di Rank #2 (`15.400` reach). Konten *Ketika ngeliat bocil pulang sekolah* (12 Okt) tercatat `0` reach, dan 3 Carousel tercatat `0` reach. | Memiliki banyak Reels baru pasca 12 Okt dengan views tinggi: *penglihatan mata silinder di siang hari* (`14.7K` views), *Gerakan Setetes Harapan* (`5.121` views), *When : Gambar Nyata dari Mesin Cek mata* (`28.2K` views), dan *When : Liat Bocil Pulang Sekolah Seru"an* (`13.3K` views). | Reels terbaru (`28.2K` & `14.7K` views) belum masuk sama sekali; Reels 12 Okt masih `0` reach; terjadi duplikasi post antara sumber Google Sheets dan Meta Sync. |
| **Purbalingga** ([@iseeyou.purbalingga](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.purbalingga%2Freels%2F)) | Menampilkan 6 item (6 Reels, 0 Carousel, 0 Single). Tertinggi hanya *HADUH GIMANA YA* (`2.600` reach, 7 Okt), sedangkan *Princes* (12 Okt) masih `0` reach. | Reels terbaru sudah menembus puluhan ribu views: *karnaval core* (`15.4K` views), *tinggalkan satu pesan* (`25.6K` views & `14.6K` views), *OPTIK I SEE YOU PURBALINGGA* (`6.521` views), serta *pov : lagi bersih2 ga nyangka liat princess se nyata ini* yang sudah tayang aktif. | Seluruh Reels terbaru dengan `14.6K`–`25.6K` views tidak terdeteksi; konten 12 Okt (*Princes*) gagal tersinkronisasi metriknya (`0` reach). |
| **Lunar Eyewear Tegal** ([@lunareyewear.co](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Flunareyewear.co%2Freels%2F)) | Menampilkan 11 item (5 Reels, 6 Carousel, 0 Single). Rank #1 tercatat *pov: nemu kacamata cuma 100rban* (`16.136` reach, 10 Okt). Seluruh 6 Carousel bernilai `0` reach. | Memiliki banyak Reels viral terbaru: *cewek + makeup + kacamata =* (`5.4M` views), Reels helm hitam (`1.8M` views), *mata silinder / mata minus+silinder* (`640K` views), *knp lu kalo malem pelan bgt si nyetirnya?* (`194K` views), *pov: maksa keluar malem ga pake kacamata* (`19.4K` views), *hah masa huruf segitu ga kebaca sih?* (`14.6K` views), dan *POTONGAN LENSA SAMPAI JUTAAN! RITA MALL TEGAL* (`6.034` views). | Gap paling kritis: konten jutaan views (`5.4M`, `1.8M`, `640K`, `194K`) tidak masuk ke dashboard sehingga kartu **Rank #1 Top Performer Reels** salah menampilkan konten Purwokerto (`19.178` reach). |
| **Cilacap** ([@iseeyou.cilacap](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.cilacap%2F)) | Menampilkan 10 item (5 Reels, 5 Carousel, 0 Single). Reels tertinggi `3.487` reach (7 Okt); Reels 11–12 Okt (*minus silinder*, *tren meme kucing*) dan seluruh 5 Carousel tercatat `0` reach. | Memiliki post Reels, Carousel, dan Single Post aktif setelah 10 Oktober yang metriknya sudah berjalan di profil Instagram. | Konten tanggal 11–16 Oktober tidak ter-update metriknya dan tertahan di angka `0`. |
| **Wonosobo** ([@iseeyou.wonosobo](https://www.google.com/search?q=https%3A%2F%2Fwww.instagram.com%2Fiseeyou.wonosobo%2F)) | Menampilkan 5 item (5 Reels, 0 Carousel, 0 Single). Hanya tanggal 7–8 Okt yang memiliki reach (`1.843` & `1.786`), sedangkan tanggal 9–11 Okt (*Ocular parasitosis*, *prank*, *Coba Kacamata*) semuanya `0` reach. | Konten tanggal 9–16 Oktober di profil Instagram sudah memiliki views dan likes aktif, ditambah konten Carousel/Single yang belum masuk. | Metrik Reels mulai 9 Oktober ke atas gagal ditarik (`0` reach) dan format Carousel/Single absen. |

## 2. Audit Teknis: 8 Root Cause pada Repositori `Yoshput/IMI`

Berdasarkan pemeriksaan kode sumber di repositori [Yoshput/IMI](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FYoshput%2FIMI), berikut adalah 8 penyebab teknis mengapa halaman `/content` tidak bisa *update live*:

1. **Tombol "Sinkronkan Live Instagram" Hanya Memproses Daftar URL Statis (Hardcoded) dan Bukan Menarik Feed Profil Baru**:
   - **Lokasi File**: `features/content/components/ContentView.tsx` & `app/api/content-items/route.ts`.
   - **Penyebab**: Saat tombol diklik, `handleSync()` memanggil `POST /api/content-items` dengan `{ refreshLive: true, period }`. Namun handler `POST` di `app/api/content-items/route.ts` hanya mengirim daftar URL/shortcode statis yang sudah ada ke `/api/sync-ig-metrics`. Sistem **sama sekali tidak melakukan *profile feed discovery*** ke 5 akun di `lib/branch-accounts.ts` untuk mendeteksi postingan baru yang terbit setelah tanggal 12 Oktober.
2. **Penulisan Cache ke Local File System (`fs.writeFileSync`) Gagal atau Bersifat Ephemeral di Vercel Serverless**:
   - **Lokasi File**: `app/api/content-items/route.ts`, `app/api/sync-sheets/route.ts`, `lib/instagram-live-cache.json`, dan `lib/real-sheets-data.json`.
   - **Penyebab**: Di environment produksi Vercel ([iseeyou-marketing-intelligence.vercel.app](https://www.google.com/search?q=https%3A%2F%2Fiseeyou-marketing-intelligence.vercel.app%2Fcontent)), sistem file proyek bersifat *read-only* setelah *build*. Mengandalkan file JSON lokal (`lib/instagram-live-cache.json` dan `lib/real-sheets-data.json`) tanpa database/KV atau *live runtime fetching* menyebabkan hasil sinkronisasi tidak tersimpan secara persisten antar-request, sehingga halaman selalu kembali membaca file JSON statis bawaan *commit* terakhir (`2026-10-08` / `2026-10-12`).
3. **Pembatasan Tanggal Hardcoded (`ACTIVE_MEETING_CYCLE` & `isEligibleDate`) Memblokir Konten Baru**:
   - **Lokasi File**: `lib/real-content-items.ts`.
   - **Penyebab**: Fungsi `getRealContentItems(liveCache, period)` memfilter item berdasarkan `ACTIVE_MEETING_CYCLE` dan `isEligibleDate(publishDate)`. Rentang tanggal siklus rapat yang dikunci secara statis membuat konten yang baru dipublikasikan atau di luar jendela statis terfilter keluar dari tab Mingguan maupun Bulanan.
4. **Format Carousel Menampilkan 0 Metrik & Judul Placeholder Generik**:
   - **Lokasi File**: `lib/real-content-items.ts` & `lib/instagram-realtime.ts`.
   - **Penyebab**: Scraper `lib/instagram-realtime.ts` (`fetchIgReelRaw`) hanya mem-parsing tag `<meta property="og:description">` dengan pola regex khusus Reels, dan gagal mengekstrak likes/comments serta caption dari URL `/p/` (Carousel/Single). Selain itu, di `lib/real-content-items.ts`, setiap Carousel yang tidak terdaftar secara manual di konstanta hardcoded `VERIFIED_CAROUSEL_METADATA` otomatis diberi judul placeholder `` `Carousel ${branchName} (${date})` `` dengan nilai `reach: 0, likes: 0, comments: 0, shares: 0`.
5. **Format `Feed Single` Kosong (0 Konten Terverifikasi)**:
   - **Lokasi File**: `lib/real-content-items.ts`, `features/content/components/ContentFilterToolbar.tsx`, & `lib/real-sheets-data.json`.
   - **Penyebab**: Deteksi tipe media di `lib/real-content-items.ts` dan skrip sinkronisasi hanya memetakan `/reel/` sebagai `"Reel"` dan sisanya ke `"Carousel"`, atau membuang post `/p/` bertipe foto tunggal (`GraphImage` / `IMAGE`). Akibatnya, tidak ada satupun item yang memiliki properti `format: "Single"` (atau ketidakcocokan nilai filter `"Single"` vs `"Feed Single"`), sehingga tab **Feed Single** selalu menampilkan `0 konten terverifikasi`.
6. **Duplikasi Konten Antara Google Sheets vs Meta Sync**:
   - **Lokasi File**: `lib/real-content-items.ts` (`getRealContentItems`).
   - **Penyebab**: Deduplikasi menggunakan `seenCodes` (`Set<string>`) gagal ketika item dari `lib/real-sheets-data.json` memiliki format URL berbeda (misalnya URL dengan query parameter `?igsh=...`, `/p/` vs `/reel/`, atau tanpa shortcode) dibandingkan item di `lib/instagram-live-cache.json`. Contoh nyata: *Bantuan Air Bersih di Purwokerto* muncul ganda di Rank #1 (`19.178` reach dari Google Sheets) dan Rank #2 (`15.400` reach dari Meta Sync).
7. **Inkonsistensi Angka Tabel vs Kolom "Observasi Analis"**:
   - **Lokasi File**: `lib/real-content-items.ts` & `features/content/components/RankedContentTable.tsx`.
   - **Penyebab**: Ketika metrik `likes` atau `reach` di-override oleh `liveCache`, string narasi `analystNote` / `observation` masih menggunakan teks lama yang di-generate saat import awal (contoh: pada *Pov : Nonton Bola Ga bawa Kacamata*, kolom Reach tertulis `8.837` dan Likes `230`, tetapi kolom Observasi Analis masih tertulis `Live IG Reels: 8.138 viewers, 195 likes, 3 komentar`).
8. **Bug Karakter HTML Entity (`&#x1f917;`, `&quot;`, `&#xfe0f;`) yang Tidak Ter-decode**:
   - **Lokasi File**: `lib/instagram-realtime.ts` (`fetchIgReelRaw`).
   - **Penyebab**: Pembersihan teks caption dari meta tag HTML hanya menggunakan `.replace()` manual untuk segelintir kode hex, bukan *universal HTML entity decoder* untuk seluruh kode `&#x...;` (hex), `&#...;` (desimal), dan named entities (`&amp;`, `&quot;`, `&apos;`).

## 3. Rekomendasi Arsitektur & Saran Pengembangan (Best Practices)

Agar halaman `/content` benar-benar menjadi **Real-Time Marketing Intelligence Command Center** yang andal di Vercel:

1. **Gunakan Dual-Layer Live Fetching (Profile Feed Crawler + Live Google Sheets CSV/API Fetch)**:
   - Jangan pernah lagi hanya mengandalkan `lib/real-sheets-data.json` dan `lib/instagram-live-cache.json` statis dari waktu build.
   - Saat `/api/content-items` dipanggil (atau tombol **Sinkronkan Live Instagram** diklik), lakukan:
     - **Layer 1 (Live Google Sheets Sync)**: Fetch langsung data terbaru dari Google Sheets semua 5 cabang secara runtime (`cache: 'no-store'` atau ISR 300 detik) sehingga setiap baris baru yang diinput tim cabang atau di-update lewat Apps Script/Sheet langsung terbaca tanpa harus `git commit` ulang.
     - **Layer 2 (Live Instagram Profile & Post Discovery)**: Tarik daftar post terbaru (Reels, Carousel, dan Single Post) langsung dari 5 profil Instagram (`@iseeyou.glasses`, `@iseeyou.purbalingga`, `@iseeyou.wonosobo`, `@iseeyou.cilacap`, `@lunareyewear.co`) menggunakan endpoint JSON profil publik Instagram (`https://www.instagram.com/api/v1/users/web_profile_info/?username={handle}` dengan header `x-ig-app-id: 936619743392459` + fallback scraping/Embed endpoint `https://www.instagram.com/p/{shortcode}/embed/captioned/`) sehingga post baru (termasuk Reels, Carousel `GraphSidecar`, dan Single `GraphImage`) otomatis terdeteksi beserta jumlah `video_view_count`, `edge_liked_by.count`, `edge_media_to_comment.count`, caption asli, dan thumbnail asli.
2. **Deteksi Format Otomatis (`Reels`, `Carousel`, `Single`)**:
   - Gunakan tipe media asli dari payload Instagram (`__typename` / `product_type` / `media_type`):
     - ` product_type === "clips"` atau `__typename === "GraphVideo"` → **Reels**
     - `__typename === "GraphSidecar"` atau `carousel_media_count > 1` → **Carousel**
     - `__typename === "GraphImage"` (1 foto statis) → **Feed Single**
   - Untuk post Carousel dan Single yang tidak menyediakan angka `Reach` publik tanpa token Instagram Graph API Business, hitung **Estimated Reach** secara transparan (atau ambil dari kolom Reach Google Sheets jika tersedia, dan tampilkan badge `Live Likes & Comments + Est. Reach` alih-alih membiarkan angka `0`).
3. **Deduplikasi Berbasis Canonical Shortcode + Normalisasi Judul**:
   - Buat fungsi `extractCanonicalShortcode(url)` yang mengekstrak kode 11 karakter dari format `/reel/{code}`, `/reels/{code}`, atau `/p/{code}` (mengabaikan query string `?igsh=...`).
   - Jika satu shortcode ada di Google Sheets sekaligus Live Instagram, gabungkan (*merge*) menjadi **1 item tunggal** dengan mengambil nilai maksimum (`Math.max(sheetReach, liveViews)`) dan caption terbersih.
4. **Tambahkan Feedback Visual (Toast Status Sync) & Jadwal Auto-Sync (Vercel Cron)**:
   - Tampilkan notifikasi ringkasan setelah tombol **Sinkronkan Live Instagram** selesai diklik (misalnya: *"Sinkronisasi selesai: 5 cabang diperbarui, 18 konten baru ditemukan"*).
   - Tambahkan konfigurasi `vercel.json` Cron Job setiap 1–6 jam ke `/api/content-items?refresh=true` agar data selalu segar saat halaman dibuka.

## 4. Master Prompt Instruksi Eksekusi untuk Antigravity

Salin seluruh teks di dalam blok di bawah ini dan berikan langsung kepada **Antigravity** di workspace repositori [Yoshput/IMI](https://www.google.com/search?q=https%3A%2F%2Fgithub.com%2FYoshput%2FIMI):

```markdown
Tolong eksekusi perbaikan menyeluruh (end-to-end overhaul) pada sistem halaman `/content` (Evaluasi Kinerja Konten) di repositori ini (`Yoshput/IMI`) agar data konten dari 5 akun Instagram cabang benar-benar update secara LIVE, akurat, bebas duplikat, dan mendukung penuh ke-3 format (Reels, Carousel, dan Feed Single).

### Daftar 5 Akun Instagram Cabang Target:
1. Purwokerto (Pusat): `https://www.instagram.com/iseeyou.glasses/` (`@iseeyou.glasses`)
2. Purbalingga: `https://www.instagram.com/iseeyou.purbalingga/` (`@iseeyou.purbalingga`)
3. Wonosobo: `https://www.instagram.com/iseeyou.wonosobo/` (`@iseeyou.wonosobo`)
4. Cilacap: `https://www.instagram.com/iseeyou.cilacap/` (`@iseeyou.cilacap`)
5. Lunar Eyewear Tegal (Second Brand): `https://www.instagram.com/lunareyewear.co/` (`@lunareyewear.co`)

---

### Masalah Kritis Saat Ini yang WAJIB Kamu Perbaiki:
1. **Data Stale & Tidak Menarik Postingan Baru**:
   - Saat ini halaman `/content` tertahan di data lama (8–12 Oktober 2026) karena `POST /api/content-items` hanya me-refresh array shortcode lama yang di-hardcode dan menulis ke `lib/instagram-live-cache.json` (yang bersifat read-only/ephemeral di Vercel Serverless).
   - Banyak Reels terbaru dan viral di Instagram belum masuk ke sistem, seperti:
     - `@lunareyewear.co`: Reels `"cewek + makeup + kacamata ="` (5.4M views), Reels helm (1.8M views), `"mata silinder / mata minus+silinder"` (640K views), `"knp lu kalo malem pelan bgt si nyetirnya?"` (194K views), `"pov: maksa keluar malem ga pake kacamata"` (19.4K views), `"hah masa huruf segitu ga kebaca sih? SEPORSI KEKALAHAN"` (14.6K views), `"POTONGAN LENSA SAMPAI JUTAAN! LUNA EYEWEAR DI RITA MALL TEGAL"` (6,034 views).
     - `@iseeyou.glasses`: `"When : Gambar Nyata dari Mesin Cek mata"` (28.2K views), `"penglihatan mata silinder di siang hari"` (14.7K views), `"When : Liat Bocil Pulang Sekolah Seru\"an"` (13.3K views — di web saat ini tertulis 0 reach), `"Gerakan Setetes Harapan"` (5,121 views).
     - `@iseeyou.purbalingga`: `"tinggalkan satu pesan"` (25.6K views & 14.6K views), `"karnaval core"` (15.4K views), `"OPTIK I SEE YOU PURBALINGGA"` (6,521 views), `"pov : lagi bersih2 ga nyangka liat princess se nyata ini"`.
2. **Filter Format Carousel & Feed Single Rusak/Kosong**:
   - Seluruh 14 item **Carousel** saat ini menampilkan `0 Reach, 0 Likes, 0 Komentar, 0 Shares` dan menggunakan nama placeholder generik seperti `"Carousel Purwokerto (Pusat) (2026-10-12)"` karena `VERIFIED_CAROUSEL_METADATA` di `lib/real-content-items.ts` bersifat statis dan scraper gagal mengambil metadata dari URL `/p/`.
   - Filter **Feed Single** menampilkan `0 konten terverifikasi` karena post foto tunggal (`GraphImage` / Single Post) tidak diklasifikasikan sebagai `"Single"` atau terbuang oleh filter.
3. **Filter Tanggal Hardcoded (`ACTIVE_MEETING_CYCLE` / `isEligibleDate`)**:
   - Di `lib/real-content-items.ts`, filter periode Mingguan dan Bulanan memotong postingan baru karena batas tanggal yang di-hardcode.
4. **Duplikasi Post (Google Sheets vs Meta Sync)**:
   - Contoh nyata: `"Bantuan Air Bersih di Purwokerto"` (2026-10-08) muncul 2 kali di peringkat #1 (19.178 reach - Google Sheets) dan peringkat #2 (15.400 reach - Meta Sync) karena `seenCodes` gagal menormalisasi variasi URL (`/p/` vs `/reel/` vs URL dengan query string).
5. **Inkonsistensi Metrik Tabel vs Kolom "Observasi Analis"**:
   - Saat angka Reach/Likes di-update dari Live Instagram, teks di kolom `OBSERVASI ANALIS` masih menampilkan angka lama (contoh: di kolom Reach tertulis `8.837` dan Likes `230`, tapi di Observasi Analis tertulis `8.138 viewers, 195 likes`).
6. **HTML Entities Tidak Ter-decode**:
   - Karakter seperti `&quot;`, `&#x1f917;`, `&#x2764;`, `&#xfe0f;`, `&#x200d;`, `&#x1f525;` masih tampil mentah di judul/caption karena `lib/instagram-realtime.ts` hanya melakukan `.replace()` manual terbatas.

---

### Rencana Eksekusi Teknis (File demi File) yang Harus Kamu Kerjakan:

#### Langkah 1: Upgrade `lib/instagram-realtime.ts` (Live Profile Feed Discovery + Multi-Format Scraper + Universal HTML Decoder)
1. Buat fungsi baru `fetchBranchLiveFeed(username: string)` yang menarik daftar postingan terbaru (Reels, Carousel, dan Single Post) langsung dari profil publik Instagram untuk ke-5 akun cabang di `lib/branch-accounts.ts`:
   - Gunakan endpoint `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}` (dengan header `x-ig-app-id: 936619743392459`, `User-Agent` browser modern, dan `Accept: application/json`) serta fallback ke endpoint embed/public HTML (`https://www.instagram.com/p/${shortcode}/embed/captioned/` dan meta tag `facebookexternalhit/1.1`).
   - Ekstrak semua item dari `edge_owner_to_timeline_media.edges` dan `edge_felix_video_timeline.edges` (atau `xdt_api__v1__feed__user_timeline_graphql_connection`).
2. Klasifikasikan format setiap post secara akurat:
   - Jika `__typename === "GraphVideo"` atau `is_video === true` atau `product_type === "clips"` -> `format: "Reels"` (atau `"Reel"` sesuai tipe internal, pastikan sinkron dengan filter UI).
   - Jika `__typename === "GraphSidecar"` atau memiliki `edge_sidecar_to_children` -> `format: "Carousel"`.
   - Jika `__typename === "GraphImage"` (1 gambar tunggal tanpa video/sidecar) -> `format: "Single"`.
3. Ekstrak metrik riil untuk semua format:
   - `views / reach`: Ambil dari `video_view_count` / `play_count` untuk Reels. Untuk **Carousel** dan **Single**, jika `reach` dari Google Sheets adalah 0 atau belum tersedia, ambil `likes` (`edge_media_preview_like.count` / `edge_liked_by.count`) dan `comments` (`edge_media_to_comment.count`) dari Instagram, lalu hitung estimasi jangkauan yang realistis berbasis engagement + followers cabang (atau tampilkan metrik Likes & Comments riil tanpa membiarkan semuanya `0`).
   - `title / caption`: Ambil baris pertama atau kalimat utama dari caption asli Instagram (`edge_media_to_caption.edges[0].node.text`). Jangan pernah gunakan judul placeholder `"Carousel [Cabang] ([Tanggal])"` lagi jika caption atau teks embed tersedia!
4. Buat fungsi `decodeHtmlEntities(text: string)` yang men-decode **semua** entitas HTML:
   - Regex hex: `/&#x([0-9a-fA-F]+);/g` -> `String.fromCodePoint(parseInt(hex, 16))`
   - Regex desimal: `/&#(\d+);/g` -> `String.fromCodePoint(parseInt(dec, 10))`
   - Named entities: `&quot;`, `&amp;`, `&apos;`, `&lt;`, `&gt;`, `&nbsp;`.

#### Langkah 2: Perbaiki Deduplikasi, Filter Tanggal, dan Sinkronisasi Narasi di `lib/real-content-items.ts`
1. **Hapus Hardcoded Date Lock (`ACTIVE_MEETING_CYCLE`)**:
   - Ubah `isEligibleDate(publishDate, period)` agar bersifat dinamis terhadap tanggal hari ini (`new Date()`) atau tanggal post terbaru di dataset:
     - `period === "weekly"`: 7 hari terakhir dari tanggal terbaru/hari ini (atau tampilkan seluruh post terbaru dari 7-14 hari terakhir).
     - `period === "monthly"`: 30–60 hari terakhir (September–Oktober 2026 hingga hari ini).
2. **Deduplikasi Berbasis Canonical Shortcode + Kemiripan Judul**:
   - Buat helper `getCanonicalKey(item)` yang mengekstrak shortcode Instagram 11 karakter dari URL (`/reel/XXXX`, `/reels/XXXX`, `/p/XXXX`). Jika salah satu sumber tidak memiliki shortcode, gunakan kombinasi `${branchNormalized}_${normalizedTitleSlug}_${publishDate}`.
   - Saat terjadi kecocokan antara data Google Sheets dan data Live Instagram/Meta Sync:
     - **Merge menjadi 1 baris tunggal** (jangan masukkan keduanya!).
     - Gunakan nilai tertinggi untuk metrik: `reach = Math.max(sheetItem.reach || 0, liveItem.reach || 0)`, `likes = Math.max(sheetItem.likes || 0, liveItem.likes || 0)`, `comments = Math.max(sheetItem.comments || 0, liveItem.comments || 0)`, `shares = Math.max(sheetItem.shares || 0, liveItem.shares || 0)`.
3. **Generate Ulang `analystNote` / `OBSERVASI ANALIS` Setelah Merge**:
   - Pastikan string narasi di kolom `OBSERVASI ANALIS` dan kotak `CATATAN ANALISIS TIM KONTEN` dibuat **setelah** metrik final selesai di-merge, sehingga angkanya 100% konsisten dengan kolom `REACH` dan `INTERAKSI`.

#### Langkah 3: Overhaul Endpoint `app/api/content-items/route.ts` & `app/api/sync-sheets/route.ts` untuk Vercel Serverless
1. Pada `GET /api/content-items` dan `POST /api/content-items`:
   - Jangan mengandalkan `fs.writeFileSync` ke `lib/` sebagai satu-satunya penyimpanan karena filesystem Vercel bersifat read-only/ephemeral di production.
   - Simpan hasil cache runtime di memory global (`globalThis.__imiLiveCache`) + `/tmp/instagram-live-cache.json` (direktori `/tmp` diizinkan tulis di Vercel Serverless) serta dukung pre-warm / live fetch saat `refreshLive: true`.
   - Saat `POST /api/content-items` (`refreshLive: true`) dipanggil:
     1. Tarik data Google Sheets terbaru secara live (via logic di `app/api/sync-sheets/route.ts`).
     2. Panggil `fetchBranchLiveFeed(handle)` secara paralel (`Promise.allSettled`) untuk ke-5 akun cabang (`iseeyou.glasses`, `iseeyou.purbalingga`, `iseeyou.wonosobo`, `iseeyou.cilacap`, `lunareyewear.co`).
     3. Refresh juga metrik untuk URL spesifik yang ada di Google Sheets.
     4. Kembalikan data gabungan yang sudah ter-update beserta metadata `{ syncedAt, totalItems, newItemsCount, branchesSynced: 5 }`.
2. Jalankan juga skrip sinkronisasi (`scripts/sync-all-instagram-live.js` yang sudah diperbarui) sebelum commit agar file fallback `lib/instagram-live-cache.json` dan `lib/real-sheets-data.json` di dalam repo sudah berisi data terbaru per hari ini (termasuk seluruh Reels terbaru `@lunareyewear.co` yang 5.4M & 1.8M views, `@iseeyou.glasses` yang 28.2K & 14.7K views, `@iseeyou.purbalingga` yang 25.6K & 15.4K views, serta item Carousel dan Single Post dari ke-5 cabang).

#### Langkah 4: Perbaiki Filter Format & Umpan Balik UI di `features/content/components/`
1. **`ContentFilterToolbar.tsx` & `ContentView.tsx`**:
   - Pastikan nilai filter untuk **Reels**, **Carousel**, dan **Feed Single** cocok 100% dengan field `format` pada objek data (`"Reels"` / `"Carousel"` / `"Single"`), dan tampilkan jumlah counter item per tab format secara akurat (misal: `Reels (X)`, `Carousel (Y)`, `Feed Single (Z)`).
   - Saat tombol **"Sinkronkan Live Instagram"** diklik:
     - Tampilkan state loading dengan indikator progres yang jelas.
     - Setelah selesai, tampilkan banner/toast konfirmasi berisi waktu sinkronisasi terbaru (`UPDATE: HH:MM:SS WIB`) dan jumlah konten yang berhasil disinkronkan dari 5 cabang.
2. **`DominantPerformer.tsx`**:
   - Pastikan kartu **Rank #1 Top Performer** otomatis menyesuaikan dengan filter cabang dan format yang sedang dipilih (serta menampilkan Top Performer sesungguhnya secara keseluruhan saat memilih `Semua Cabang`).

---

### Kriteria Verifikasi Sebelum Selesai (Definition of Done):
1. Jalankan `npm run build` dan pastikan tidak ada error TypeScript maupun Next.js build error.
2. Verifikasi bahwa untuk ke-5 cabang (`@iseeyou.glasses`, `@iseeyou.purbalingga`, `@iseeyou.wonosobo`, `@iseeyou.cilacap`, `@lunareyewear.co`):
   - Tab **Reels** menampilkan seluruh Reels terbaru beserta angka views/reach dan likes aktual (tidak ada lagi Reels yang sudah tayang berhari-hari tetapi bernilai `0` reach, dan Reels viral `@lunareyewear.co` 5.4M / 1.8M views, `@iseeyou.glasses` 28.2K views, serta `@iseeyou.purbalingga` 25.6K views sudah masuk).
   - Tab **Carousel** menampilkan judul/caption asli dari post Carousel (bukan placeholder `"Carousel [Cabang] ([Tanggal])"`) dan memiliki metrik Likes/Comments/Reach yang valid (bukan `0` semua).
   - Tab **Feed Single** menampilkan postingan foto tunggal (`Single`) dari akun cabang (tidak lagi `0 konten terverifikasi`).
   - Tidak ada lagi duplikasi post yang sama di tabel ranking.
   - Tidak ada lagi karakter HTML entity mentah (`&#x...;`, `&quot;`) di judul maupun deskripsi.
   - Angka pada kolom `REACH` dan `INTERAKSI` sama persis dengan angka di kolom `OBSERVASI ANALIS`.
```
