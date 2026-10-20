# Revisi Proposal Sponsor Optik I See You
## Audit tangkapan layar dan prompt implementasi Antigravity

**Status:** Dokumen ini berisi hasil audit dari tangkapan layar pengguna, naskah pengganti, dan instruksi implementasi. Website dan repositori belum diubah. Akses ke kedua URL dari sesi pemeriksaan mengembalikan “Forbidden. Calls to this URL are not allowed.” Struktur kode, fungsi editor, penyimpanan, dan hasil ekspor belum dapat diperiksa.

**Sumber visual:** image(20261020-024112).png, unggahan pengguna.
**Halaman sasaran:** https://iseeyou-marketing-intelligence.vercel.app/proposal-sponsor
**Repositori sasaran:** https://github.com/Yoshput/IMI
**Lingkungan eksekusi yang diminta pengguna:** Antigravity.
**Model pilihan pengguna:** Gemini 3.8 Flash High. Nama dan ketersediaan model belum diverifikasi. Pilih melalui pemilih model Antigravity jika tersedia; isi prompt tidak dapat mengganti model aplikasi.

## A. Hasil audit

Dasar proposal sudah formal: halaman putih, kop, pembagian bagian, serta warna identitas yang konsisten. Namun, proposal perlu diperbaiki sebelum dipakai sebagai penawaran sponsor umum.

| Bagian yang terlihat | Temuan | Keputusan revisi |
| --- | --- | --- |
| Judul kop | “OPTIK I SEE YOU & LUNAR EYEWEAR” | Ubah menjadi “OPTIK I SEE YOU”. |
| Informasi gerai | Terdapat “Lunar Eyewear Tegal”. | Keluarkan entri tersebut dari proposal. Verifikasi informasi gerai Optik I See You sebelum mempertahankannya. |
| Narasi penyelenggara | “Optik I See You bersama Lunar Eyewear menginisiasi program …” | Nyatakan Optik I See You sebagai satu-satunya penyelenggara. |
| Identitas visual | Logo utama masih cukup proporsional; “for every you” lebih dominan secara visual. | Pertahankan logo utama dan jadikan “for every you” unsur pendukung yang lebih kecil. |
| Kontak di kop | Informasi sangat kecil dan padat pada tangkapan layar. | Ringkas menjadi kontak kemitraan yang relevan dan mudah dibaca. |
| Pembuka | Bagian yang terlihat langsung masuk ke BAB I. | Pada awal proposal, tampilkan judul penawaran, kegiatan, penyelenggara, penerima, tanggal, dan lokasi. Periksa struktur seluruh dokumen sebelum menambah bagian agar tidak menggandakan judul yang sudah ada. |
| Cakupan | Terikat pada masterclass konten, kreator, Gen-Z, dan wilayah tertentu. | Jadikan nama, format, sasaran, dan lokasi acara sebagai data yang dapat diedit. |
| Angka dan manfaat | Terdapat 50 peserta, 4 gerai, 244.000+ pengikut, penayangan TV showroom, serta aktivitas promosi tertentu. | Jangan jadikan angka atau fasilitas tersebut janji otomatis untuk semua acara. Tampilkan hanya data dan manfaat yang relevan serta dapat dikonfirmasi. |

Ukuran CSS asli, skala browser, dan ukuran cetak tidak dapat ditentukan hanya dari screenshot. Semua ukuran dalam instruksi berikut merupakan titik awal desain untuk diuji, bukan hasil pengukuran kode.

## B. Cara menggunakan

1. Buka checkout repositori IMI di Antigravity.
2. Pilih model yang diminta pengguna jika tersedia.
3. Salin instruksi pada bagian “PROMPT EKSEKUSI” sampai selesai.
4. Minta agen mengimplementasikan perubahan pada kode, memverifikasi hasil, dan melaporkan file serta perilaku yang berubah.
5. Hindari menyatakan website live sudah berubah sebelum deployment yang sesuai benar-benar terverifikasi.

---

# PROMPT EKSEKUSI

Anda adalah engineer frontend dan editor dokumen bisnis. Kerjakan perbaikan nyata pada fitur proposal sponsor proyek IMI. Lanjutkan sampai perubahan kode dan pemeriksaan yang relevan selesai, jangan berhenti pada rencana atau contoh desain.

## 1. Sasaran dan konteks

Repositori: https://github.com/Yoshput/IMI
Route yang diperbaiki: /proposal-sponsor
Website referensi: https://iseeyou-marketing-intelligence.vercel.app/proposal-sponsor

Tujuan pengguna:

- Proposal terlihat profesional dan layak digunakan untuk penawaran sponsor kepada berbagai perusahaan atau organisasi.
- Optik I See You merupakan satu-satunya pihak penyelenggara dalam proposal ini.
- Lunar Eyewear tidak berkontribusi pada acara ini. Hapus seluruh atribusi, logo, lokasi, peran, dan narasi kontribusi Lunar dari keluaran proposal.
- Pertahankan logo Optik I See You dan elemen “for every you”; rapikan proporsinya.
- Template dapat digunakan untuk berbagai jenis acara dan calon sponsor.
- Konten proposal tetap dapat diedit melalui antarmuka, disimpan dengan mekanisme yang sesuai, ditinjau, dan dicetak atau diekspor melalui fitur yang tersedia.

“Untuk umum” berarti template dapat dipakai bagi berbagai calon sponsor dan kegiatan. Ini bukan instruksi untuk membuka akses edit kepada semua pengunjung.

Sumber audit awal hanya tangkapan layar; jangan menganggap nama file, framework, database, editor, atau alur ekspor sudah diketahui. Verifikasi semuanya dari checkout.

## 2. Pemeriksaan awal dan batas perubahan

Baca instruksi proyek yang berlaku, termasuk AGENTS.md bila ada. Periksa status git dan hormati perubahan pengguna yang belum disimpan dalam commit.

Temukan route, komponen, aset, sumber default, serta mekanisme edit, preview, simpan, reset, print, dan ekspor proposal. Gunakan pencarian terarah, misalnya istilah berikut:

- proposal-sponsor / proposalSponsor;
- Lunar / Lunar Eyewear;
- OPTIK I SEE YOU & LUNAR EYEWEAR;
- bersama Lunar Eyewear;
- Lunar Eyewear Tegal;
- for every you;
- Creative Content Masterclass;
- angka dan narasi paket yang terlihat pada proposal lama.

Pencarian boleh menemukan pemakaian di seluruh proyek untuk memahami dependensi. Perubahan hanya diterapkan pada fitur proposal sponsor dan dependensi yang memang dibutuhkan.

Jangan menjalankan penggantian global yang menghapus Lunar dari modul lain. Jika kop bersama digunakan oleh halaman lain, berikan konfigurasi atau komponen khusus proposal agar perubahan tidak mengganggu modul tersebut.

Pertahankan framework, pola komponen, akses pengguna, dan mekanisme penyimpanan yang sudah digunakan jika memadai. Hindari menambah layanan backend, sistem login, atau dependensi besar untuk perapian proposal ini.

## 3. Koreksi identitas penyelenggara

Gunakan “Optik I See You” sebagai identitas penyelenggara baku. Tampilan huruf kapital pada kop boleh menggunakan “OPTIK I SEE YOU”.

Perbaikan yang sudah pasti diperlukan dari screenshot:

1. “OPTIK I SEE YOU & LUNAR EYEWEAR” menjadi “OPTIK I SEE YOU”.
2. Hapus entri “Lunar Eyewear Tegal” dari baris gerai proposal.
3. Ganti narasi “Optik I See You bersama Lunar Eyewear menginisiasi …” dengan narasi yang menyebut Optik I See You saja.

Periksa kemungkinan atribusi serupa pada kop lanjutan, isi, tabel, footer, bagian penanggung jawab, tanda tangan, alt text aset proposal, nama dokumen ekspor, dan metadata yang dipakai fitur proposal. Ubah hanya yang benar-benar ditemukan.

Pertahankan aset asli logo Optik I See You. “for every you” diperlakukan sebagai unsur pendukung identitas, bukan sponsor terpisah. Jangan membuat logo pengganti atau mengganti tipografi resmi dalam aset.

Pastikan informasi kontak, gerai, dan fasilitas yang tertinggal memang milik Optik I See You. Jangan sekadar mengganti nama Lunar menjadi Optik I See You pada sebuah alamat atau fasilitas karena itu dapat menghasilkan informasi yang tidak benar. Bila kepemilikan tidak dapat dikonfirmasi, kosongkan isian terkait untuk dilengkapi pengguna.

## 4. Perapian kop dan tata letak

Pertahankan kesan formal: dasar putih, hijau identitas merek dari aset atau token yang tersedia, teks gelap, jarak konsisten, dan garis kop sederhana.

Arah utama tata letak:

- Logo resmi berada di kiri.
- Nama Optik I See You dan kontak ringkas berada di sisi kanan logo.
- “for every you” tampil lebih kecil di bawah identitas atau pada area pendukung yang tidak bersaing dengan nama penyelenggara.
- Gunakan ruang secara efisien agar kop tidak mengambil terlalu banyak area isi.
- Batasi kontak pada satu atau dua baris yang relevan. Daftar gerai yang panjang dapat dipindahkan ke profil penyelenggara bila memang dibutuhkan.

Titik awal ukuran untuk cetak A4:

| Elemen | Rekomendasi awal |
| --- | --- |
| Logo utama | Lebar sekitar 28–32 mm; tinggi mengikuti rasio asli. |
| Aset “for every you” | Lebar sekitar 22–26 mm; tinggi mengikuti rasio asli. |
| Nama penyelenggara | Sekitar 14–16 pt, disesuaikan dengan font dokumen. |
| Kontak dan informasi pendukung | Sekitar 9–10 pt. |
| Isi utama | Sekitar 10,5–11 pt dengan jarak baris 1,4–1,5. |
| Margin halaman | Sekitar 20 mm, lalu sesuaikan berdasarkan hasil cetak. |

Ukuran ini bukan ketentuan merek resmi. Sesuaikan setelah memeriksa rasio aset dan hasil pada ukuran aktual.

Gunakan ukuran proporsional dan object-fit: contain untuk gambar. Jangan menarik logo hingga gepeng, memotong wordmark, atau memaksa logo dan tagline memiliki tinggi yang sama.

Gunakan styles yang dibatasi pada fitur proposal. Jangan mengubah elemen heading, tabel, atau print aplikasi secara global tanpa memeriksa pengaruhnya.

Pada desktop dan perangkat seluler, editor harus tetap mudah digunakan. Pratinjau halaman A4 boleh menggunakan skala atau area gulir yang jelas, tetapi jangan membuat halaman editor ikut melebar dan tidak dapat digunakan. Periksa juga saat teks panjang dan zoom browser diperbesar.

## 5. Struktur proposal yang dapat digunakan secara umum

Periksa struktur yang sudah tersedia. Pertahankan bagian yang masih relevan, rapikan penamaan, dan hindari pengulangan. Susunan yang disarankan:

1. Judul penawaran dan identitas proposal.
2. Ringkasan kegiatan.
3. Latar belakang dan tujuan.
4. Gambaran kegiatan, sasaran, dan agenda.
5. Bentuk dukungan sponsor.
6. Rincian manfaat bagi mitra.
7. Pelaksanaan, koordinasi, dan dokumentasi.
8. Penutup serta kontak penanggung jawab.

Judul utama:
“PROPOSAL PENAWARAN KERJA SAMA SPONSOR”

Informasi ringkas:
- Nama kegiatan: [Nama Kegiatan]
- Disusun oleh: Optik I See You
- Ditujukan kepada: [Nama Calon Mitra]
- Tanggal pelaksanaan: [Tanggal]
- Lokasi: [Lokasi]

Untuk draft baru, sediakan isian kosong yang jelas. Teks dalam kurung siku di brief ini adalah penanda isian, bukan informasi nyata. Jangan mengisi nama sponsor, alamat, tanggal, nominal, atau statistik secara acak.

Pastikan template tidak mengunci pengguna pada masterclass, kreator konten, Gen-Z, Banyumas, tahun 2026, atau jenis usaha tertentu. Detail yang masih dibutuhkan oleh pengguna pada draft lama dapat dipertahankan sebagai data acara yang dapat diedit.

## 6. Naskah pengganti

Gunakan naskah berikut sebagai default atau dasar penyuntingan pada bagian yang sesuai. Hubungkan isian berulang dengan data yang sama agar nama, tanggal, atau sasaran tidak berbeda antarbagian.

### Latar belakang

Optik I See You mengajukan kerja sama sponsor untuk mendukung pelaksanaan [nama kegiatan]. Kegiatan ini direncanakan pada [tanggal] di [lokasi] dan ditujukan kepada [sasaran peserta], dengan agenda utama [ringkasan kegiatan].

Melalui kegiatan ini, Optik I See You membuka kesempatan bagi calon mitra untuk berpartisipasi sesuai dengan tujuan komunikasi dan kebutuhan kegiatan. Bentuk kerja sama dapat mencakup dukungan pendanaan, produk, layanan, atau bentuk dukungan lain yang disepakati.

Ruang lingkup dukungan, manfaat bagi mitra, jadwal pelaksanaan, serta tanggung jawab setiap pihak akan dirumuskan bersama dan dicantumkan dalam kesepakatan kerja sama.

### Tujuan kegiatan

1. Menyelenggarakan [nama kegiatan] sesuai dengan tujuan dan kebutuhan [sasaran peserta].
2. Membuka kesempatan kerja sama antara Optik I See You dan mitra sponsor melalui bentuk dukungan yang relevan.
3. Memberikan manfaat kepada peserta melalui [manfaat utama kegiatan].
4. Menyampaikan dokumentasi pelaksanaan dan realisasi manfaat sponsor sesuai kesepakatan.

### Penawaran kerja sama

Optik I See You menawarkan kesempatan kerja sama yang dapat disesuaikan dengan kebutuhan calon mitra. Bentuk dukungan dan manfaat sponsor dibahas berdasarkan relevansi dengan kegiatan, kemampuan pelaksanaan, serta kesepakatan kedua pihak.

### Manfaat sponsor

Manfaat sponsor dapat meliputi pencantuman identitas mitra pada materi kegiatan, penyebutan dalam publikasi, ruang aktivasi produk atau layanan, serta dokumentasi pelaksanaan. Manfaat yang berlaku mengikuti paket atau ruang lingkup kerja sama yang disepakati.

Paragraf manfaat ini menjelaskan opsi. Jangan otomatis mengubah semua contoh menjadi janji pasti. Tampilkan rincian manfaat yang benar-benar dipilih untuk proposal tersebut.

### Penutup

Demikian proposal ini kami sampaikan sebagai bahan pertimbangan kerja sama. Optik I See You terbuka untuk mendiskusikan bentuk dukungan dan manfaat sponsor yang sesuai dengan kebutuhan calon mitra. Untuk pembahasan lebih lanjut, silakan menghubungi [nama penanggung jawab] melalui [nomor kontak] atau [email].

## 7. Data, manfaat, dan angka

Pisahkan identitas penyelenggara dari data acara. Identitas penyelenggara pada template ini adalah Optik I See You; detail acara dan penawaran harus fleksibel.

Gunakan bidang yang tersedia atau tambahkan yang memang diperlukan:

- Identitas proposal: nomor, tanggal dokumen, judul.
- Penerima: nama calon mitra dan penanggung jawab.
- Kegiatan: nama, tema, format, tanggal, jam bila relevan, tempat, sasaran, target peserta.
- Isi: latar belakang, tujuan, agenda, kebutuhan dukungan.
- Dukungan: jenis dukungan, nominal bila digunakan, produk atau layanan.
- Manfaat: rincian, jumlah atau durasi bila relevan, kanal, waktu pelaksanaan, dan catatan.
- Kontak: nama PIC, jabatan, nomor telepon, email.
- Penutup dan catatan kerja sama.

Tabel manfaat sponsor sebaiknya dapat diedit per baris. Kolom dapat berupa “Bentuk Dukungan”, “Rincian”, “Manfaat bagi Mitra”, dan “Periode/Keterangan”. Jangan menetapkan nominal atau jumlah unggahan tanpa data pengguna.

Jangan jadikan 50 peserta, 4 gerai, atau 244.000+ pengikut sebagai default seluruh proposal. Angka yang ditampilkan harus sesuai acara dan memiliki konteks. Tulis jumlah peserta rencana sebagai “target peserta”, bukan peserta terdaftar.

Penayangan TV showroom, sampling, live try-on, distribusi materi gerai, dan publikasi media sosial hanya muncul jika memang dipilih serta tersedia. Jangan menjanjikan penjualan, jangkauan, konversi, atau hasil promosi tertentu tanpa dasar.

Jika metrik media sosial digunakan, sediakan konteks akun dan tanggal pembaruan dengan pola data yang proporsional terhadap sistem yang ada. Jika kosong, bagian opsional disembunyikan dengan rapi.

## 8. Fungsi edit, simpan, dan konsistensi keluaran

Pertahankan kemampuan edit yang sudah ada. Gunakan satu sumber data yang sama untuk editor, pratinjau, dan hasil print atau ekspor.

Ketentuan perilaku:

- Mengubah nama kegiatan, tanggal, lokasi, calon sponsor, atau kontak memperbarui semua penampilan yang bergantung pada data tersebut.
- Teks panjang serta baris manfaat yang dapat ditambah dan dihapus tidak merusak tata letak.
- Konten yang diedit tidak kembali ke default saat komponen dirender ulang.
- Simpan menggunakan mekanisme aplikasi yang telah tersedia.
- Jika sebelumnya hanya tersimpan di memori dan tidak ada backend yang sesuai, gunakan penyimpanan lokal yang dibatasi untuk fitur ini. Jelaskan lewat antarmuka bahwa draft tersimpan di perangkat/browser tersebut; jangan mengklaim sinkronisasi lintas perangkat.
- Tangani kegagalan simpan agar indikator “tersimpan” tidak muncul jika operasi sebenarnya gagal.
- Reset mengembalikan default Optik I See You yang sudah diperbaiki; jangan menjalankan reset otomatis saat halaman dibuka.
- Sebelum reset yang membuang suntingan, beri konfirmasi yang jelas atau gunakan mekanisme pemulihan yang sudah tersedia.
- Jangan mengubah kebijakan akses edit, membuka database, atau menjadikan editor publik hanya karena template ditujukan untuk penggunaan umum.
- Bila editor menyimpan rich text, pertahankan validasi dan sanitasi yang sudah digunakan. Jangan menambahkan jalur HTML mentah tanpa perlindungan.

Data wajib yang masih kosong perlu diberi petunjuk di editor agar pengguna tahu apa yang harus dilengkapi sebelum mengirim proposal. Petunjuk teknis editor tidak ikut dicetak.

## 9. Draft lama dan migrasi

Mengubah default saja mungkin belum memperbaiki draft yang sudah tersimpan. Periksa sumber data yang benar-benar dipakai.

Jika diperlukan migrasi:

1. Cadangkan data terkait atau gunakan mekanisme versioning proyek sebelum perubahan tersimpan.
2. Buat migrasi eksplisit dan idempoten, terbatas pada template atau draft proposal yang relevan.
3. Perbaiki nama penyelenggara dan entri atribusi Lunar yang diketahui.
4. Ganti blok lama dengan naskah general hanya jika masih identik dengan default lama.
5. Pertahankan isi custom pengguna, data sponsor, angka, kontak, dan draft lain yang tidak terkait.
6. Jika blok custom masih memuat atribusi Lunar, tandai bagian tersebut untuk ditinjau di editor. Jangan memotong sembarang kata atau mengganti nama pada seluruh teks secara buta.
7. Pastikan draft dengan atribusi Lunar yang belum diselesaikan tidak ditandai siap dikirim sebagai versi final.
8. Jika atribusi penyelenggara atau kontribusi Lunar belum terselesaikan dalam teks custom, pertahankan teks aslinya dalam draft yang dapat dipulihkan dan tampilkan bagian yang perlu diperbaiki di editor. Jangan izinkan pencetakan, ekspor, atau publikasi sebagai proposal final sampai atribusi tersebut diperbaiki. Jelaskan bagian yang menghalangi proses tanpa menghapus isi pengguna secara otomatis. Setelah diperbaiki, pastikan preview dan seluruh keluaran final tidak lagi memuat atribusi Lunar.
9. Muat ulang draft dan periksa lagi agar identitas lama tidak muncul kembali dari penyimpanan.

Jangan menghapus seluruh localStorage, seluruh tabel database, riwayat git, atau arsip hanya untuk membersihkan proposal. Backup dan riwayat lama tidak termasuk konten final yang ditampilkan kepada calon sponsor.

## 10. Cetak dan ekspor

Periksa mekanisme yang benar-benar ada. Jika fitur menggunakan print browser, rapikan print stylesheet tanpa menambahkan generator PDF baru yang tidak dibutuhkan. Jika sudah ada generator PDF atau DOCX, perbarui sumber data dan layout yang dipakai generator tersebut.

Periksa:

- A4 dengan margin konsisten dan teks terbaca pada ukuran aktual.
- Tombol, panel editor, menu aplikasi, dan pesan teknis tidak ikut tercetak.
- Kop, judul, dan tabel tidak terpotong atau saling menimpa.
- Hindari pemisahan judul dari paragraf pertama dengan aturan page-break yang sesuai.
- Jangan menerapkan break-inside: avoid pada blok sangat panjang hingga menimbulkan halaman kosong atau overflow.
- Baris tabel pendek dan blok tanda tangan tetap utuh jika memungkinkan.
- Isi yang panjang tetap mengalir ke halaman berikutnya.
- Logo mempertahankan rasio dan ketajaman.
- Nama file ekspor, isi, serta metadata fitur proposal menggunakan identitas yang benar.

## 11. Verifikasi yang harus dilakukan

Jalankan build dan pemeriksaan proyek yang memang relevan. Jangan memasang banyak tes yang sekadar mengulang implementasi. Fokuskan tes otomatis pada perubahan logika yang berisiko, misalnya migrasi draft, persistensi, atau transformasi data ekspor.

Lakukan pemeriksaan fungsional berikut melalui cara yang didukung lingkungan:

| Skenario | Hasil yang diharapkan |
| --- | --- |
| Membuka template baru | Hanya Optik I See You sebagai penyelenggara; tidak ada atribusi Lunar. |
| Mengubah nama kegiatan, penerima, dan tanggal | Preview dan hasil cetak/ekspor memperlihatkan nilai terbaru secara konsisten. |
| Mengubah isi lalu menyimpan dan memuat ulang | Nilai tetap ada sesuai mekanisme penyimpanan yang dipakai. |
| Memuat draft lama | Atribusi yang diketahui dibersihkan atau ditandai untuk peninjauan; suntingan lain tidak hilang. Print, ekspor, dan publikasi final ditahan selama atribusi kontribusi Lunar belum diperbaiki, lalu berfungsi kembali setelah perbaikan. |
| Menggunakan reset | Default baru muncul setelah persetujuan yang sesuai; tidak ada default Lunar. |
| Teks dan nama sponsor panjang | Tidak ada teks bertumpuk, terpotong, atau membuat editor melebar tanpa kendali. |
| Menambah beberapa baris manfaat | Tabel tetap dapat dibaca dan mengalir antarahalaman. |
| Perangkat seluler dan desktop | Editor dapat digunakan, pratinjau dapat dibaca, logo proporsional. |
| Print/PDF A4 | Kontrol editor hilang; isi terbaru muncul; layout tidak rusak. |
| Membuka modul lain yang memakai kop/aset terkait | Perilaku sebelumnya tetap berjalan. |

Audit final untuk atribusi Lunar harus mencakup seluruh konten proposal yang dirender dan diekspor. Pencarian source perlu ditinjau secara kontekstual karena kata Lunar boleh tetap ada dalam tes migrasi, backup, riwayat, atau modul lain yang tidak termasuk perubahan.

## 12. Penyelesaian dan laporan

Setelah implementasi:

- Jelaskan file yang diubah beserta alasannya.
- Ringkas perubahan visual, naskah, serta perilaku edit dan simpan.
- Laporkan pemeriksaan yang benar-benar dijalankan dan hasilnya.
- Sertakan screenshot pratinjau desktop dan seluler serta hasil cetak bila lingkungan memungkinkan.
- Sebutkan bagian yang belum dapat diverifikasi dengan jelas.
- Tampilkan diff yang terfokus pada permintaan ini.

Gunakan alur version control dan deployment proyek yang tersedia sesuai otorisasi pengguna. Jangan menghapus pekerjaan lain, mengganti hosting, melakukan force-push, atau mengubah akun maupun akses.

Jika hanya perubahan lokal yang selesai, nyatakan demikian. Jika deployment juga dilakukan, laporkan URL dan revisi yang benar-benar terdeploy setelah keberhasilannya terverifikasi. Jangan menyatakan “website sudah diperbaiki” hanya karena patch atau build lokal berhasil.

Hasil akhir yang diharapkan: proposal sponsor Optik I See You yang formal, terbaca, fleksibel untuk berbagai acara dan calon mitra, tetap dapat diedit, serta konsisten pada draft, preview, dan keluaran final.

# AKHIR PROMPT EKSEKUSI

