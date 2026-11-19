import {
  PipelineStage,
  ContentCategoryType,
  MessageTemplateConfig,
  Campaign,
} from "./types";

/**
 * 14 TAHAPAN KOLABORASI PIPELINE KANBAN (MASTER SPECIFICATION §6)
 */
export interface StageMeta {
  id: PipelineStage;
  label: string;
  order: number;
  shortLabel: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  badgeClass: string;
  description: string;
}

export const PIPELINE_STAGES: StageMeta[] = [
  {
    id: "candidate_identified",
    label: "1. Kandidat Ditemukan",
    shortLabel: "Kandidat",
    order: 1,
    colorBg: "bg-slate-500/10",
    colorText: "text-slate-700 dark:text-slate-300",
    colorBorder: "border-slate-500/20",
    badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300",
    description: "KOL ditemukan melalui scouting media sosial (IG/TikTok) & masuk radar kurasi awal.",
  },
  {
    id: "under_review",
    label: "2. Sedang Ditinjau",
    shortLabel: "Review",
    order: 2,
    colorBg: "bg-indigo-500/10",
    colorText: "text-indigo-700 dark:text-indigo-300",
    colorBorder: "border-indigo-500/20",
    badgeClass: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border-indigo-300",
    description: "Penilaian visual appeal, kecocokan branding kacamata, dan analisis engagement rate.",
  },
  {
    id: "ready_to_contact",
    label: "3. Siap Dihubungi",
    shortLabel: "Siap Outreach",
    order: 3,
    colorBg: "bg-cyan-500/10",
    colorText: "text-cyan-700 dark:text-cyan-300",
    colorBorder: "border-cyan-500/20",
    badgeClass: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-200 border-cyan-300",
    description: "KOL telah disetujui untuk dihubungi; template penawaran barter produk sudah disiapkan.",
  },
  {
    id: "message_sent",
    label: "4. Pesan Terkirim",
    shortLabel: "Terkirim",
    order: 4,
    colorBg: "bg-blue-500/10",
    colorText: "text-blue-700 dark:text-blue-300",
    colorBorder: "border-blue-500/20",
    badgeClass: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300",
    description: "Penawaran awal barter produk telah dikirimkan via WhatsApp atau Instagram DM.",
  },
  {
    id: "waiting_response",
    label: "5. Menunggu Balasan",
    shortLabel: "Tunggu Balas",
    order: 5,
    colorBg: "bg-amber-500/10",
    colorText: "text-amber-700 dark:text-amber-300",
    colorBorder: "border-amber-500/20",
    badgeClass: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300",
    description: "Pesan telah terbaca; menunggu konfirmasi minat atau kesediaan barter produk.",
  },
  {
    id: "negotiation",
    label: "6. Negosiasi & Barter",
    shortLabel: "Negosiasi",
    order: 6,
    colorBg: "bg-orange-500/10",
    colorText: "text-orange-700 dark:text-orange-300",
    colorBorder: "border-orange-500/20",
    badgeClass: "bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-200 border-orange-300",
    description: "Penyelarasan pemilihan frame kacamata, jenis lensa, dan kesepakatan deliverables video.",
  },
  {
    id: "collab_approved",
    label: "7. Kolaborasi Disetujui",
    shortLabel: "Deal Disetujui",
    order: 7,
    colorBg: "bg-emerald-500/10",
    colorText: "text-emerald-700 dark:text-emerald-300",
    colorBorder: "border-emerald-500/20",
    badgeClass: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300",
    description: "Kedua pihak sepakat dengan paket barter produk kacamata & deliverables konten.",
  },
  {
    id: "product_prep",
    label: "8. Penyiapan Produk",
    shortLabel: "Packing Produk",
    order: 8,
    colorBg: "bg-teal-500/10",
    colorText: "text-teal-700 dark:text-teal-300",
    colorBorder: "border-teal-500/20",
    badgeClass: "bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-300",
    description: "Tim lab/gudang menyiapkan frame, fitting lensa anti-radiasi, hardcase & pembersihan.",
  },
  {
    id: "product_shipped",
    label: "9. Produk Dikirim",
    shortLabel: "Dikirim (Resi)",
    order: 9,
    colorBg: "bg-sky-500/10",
    colorText: "text-sky-700 dark:text-sky-300",
    colorBorder: "border-sky-500/20",
    badgeClass: "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 border-sky-300",
    description: "Paket kacamata telah dikirim via kurir ke alamat rumah creator; no. resi telah diinfokan.",
  },
  {
    id: "product_received",
    label: "10. Produk Diterima",
    shortLabel: "Diterima",
    order: 10,
    colorBg: "bg-purple-500/10",
    colorText: "text-purple-700 dark:text-purple-300",
    colorBorder: "border-purple-500/20",
    badgeClass: "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-300",
    description: "Creator mengonfirmasi paket kacamata telah tiba dalam kondisi aman & pas dipakai.",
  },
  {
    id: "content_production",
    label: "11. Produksi Konten",
    shortLabel: "Produksi",
    order: 11,
    colorBg: "bg-pink-500/10",
    colorText: "text-pink-700 dark:text-pink-300",
    colorBorder: "border-pink-500/20",
    badgeClass: "bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-200 border-pink-300",
    description: "Creator sedang dalam proses shooting & editing video try-on/review kacamata.",
  },
  {
    id: "content_published",
    label: "12. Konten Tayang",
    shortLabel: "Tayang Live",
    order: 12,
    colorBg: "bg-green-500/10",
    colorText: "text-green-700 dark:text-green-300",
    colorBorder: "border-green-500/20",
    badgeClass: "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-200 border-green-300",
    description: "Video Reels/TikTok resmi terbit; tim marketing mulai monitoring views & link postingan.",
  },
  {
    id: "completed",
    label: "13. Selesai & Evaluasi",
    shortLabel: "Selesai",
    order: 13,
    colorBg: "bg-emerald-600/15",
    colorText: "text-emerald-800 dark:text-emerald-200",
    colorBorder: "border-emerald-600/30",
    badgeClass: "bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border-emerald-400",
    description: "Seluruh deliverables terpenuhi; performa engagement tercatat & diarsip secara resmi.",
  },
  {
    id: "rejected",
    label: "14. Ditolak / Batal",
    shortLabel: "Batal / Tolak",
    order: 14,
    colorBg: "bg-rose-500/10",
    colorText: "text-rose-700 dark:text-rose-300",
    colorBorder: "border-rose-500/20",
    badgeClass: "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300",
    description: "KOL menolak sistem barter produk, tidak merespon follow-up, atau kolaborasi dibatalkan.",
  },
];

/**
 * KATEGORI KONTEN CREATOR
 */
export const CONTENT_CATEGORIES: { id: ContentCategoryType; label: string; icon: string }[] = [
  { id: "hijab_fashion", label: "Hijab & Modest Fashion", icon: "🧕" },
  { id: "aesthetic_lifestyle", label: "Aesthetic Lifestyle & OOTD", icon: "✨" },
  { id: "daily_vlog", label: "Daily Vlog & Kuliner", icon: "☕" },
  { id: "beauty_makeup", label: "Beauty & Personal Care", icon: "💄" },
  { id: "campus_student", label: "Kampus & Mahasiswa", icon: "🎓" },
  { id: "eyewear_fashion", label: "Spesialis Fashion Kacamata", icon: "👓" },
  { id: "creative_comedy", label: "Kreatif & Hiburan Lokal", icon: "🎬" },
  { id: "other", label: "Lainnya", icon: "📌" },
];

/**
 * 9 TEMPLATE PESAN KOLABORASI BARTER PRODUK (MASTER SPECIFICATION §7)
 * Seluruh pesan menekankan prinsip:
 * 1. Barter produk kacamata resmi dikirimkan langsung ke alamat rumah
 * 2. Creator TIDAK PERLU visit / datang ke toko
 * 3. Bebas berpartisipasi dari mana saja di Indonesia
 * 4. Produksi konten review / try-on secara mandiri
 */
export const MESSAGE_TEMPLATES: MessageTemplateConfig[] = [
  {
    id: "tpl-a-outreach",
    key: "A",
    title: "Template A — Initial Collaboration Outreach",
    category: "outreach",
    badge: "Tawaran Awal",
    description: "Pesan sapaan awal menawarkan kolaborasi barter produk kacamata dengan pengiriman langsung ke rumah creator.",
    tones: {
      semi_formal: `Halo Kak [Nama], selamat sore! 😊

Perkenalkan, saya dari tim Marketing Optik I See You.

Kami tertarik untuk mengajak Kakak berkolaborasi dalam campaign promosi produk kacamata dari Optik I See You.

Untuk konsep kerja samanya menggunakan sistem barter produk. Nantinya kami akan mengirimkan produk kacamata [Produk] langsung ke alamat rumah Kakak, sehingga Kakak tidak perlu datang atau visit ke store kami.

Sebagai bentuk kerja sama, kami berharap Kakak dapat membuat konten berupa [Deliverables] yang nantinya dipublikasikan melalui akun media sosial Kakak.

Untuk detail produk, konsep konten, serta ketentuan kerja sama bisa kita diskusikan lebih lanjut.

Apakah Kakak tertarik untuk berkolaborasi bersama Optik I See You?

Terima kasih sebelumnya, Kak! ✨👓`,
      formal: `Selamat siang/sore Kak [Nama],

Perkenalkan, kami dari tim Marketing Optik I See You.

Kami telah meninjau profil media sosial Kakak dan sangat mengapresiasi kualitas visual serta engagement konten yang Kakak bagikan. Oleh karena itu, kami ingin menawarkan kesempatan kerja sama promosi untuk produk kacamata Optik I See You.

Kerja sama ini berbasis barter produk resmi, di mana kami akan mengirimkan paket kacamata [Produk] secara langsung ke alamat Kakak (tanpa kewajiban visit ke gerai store). Sebagai timbal balik, kami mengharapkan publikasi konten berupa [Deliverables].

Apabila Kakak berkenan, kami siap berkoordinasi lebih lanjut terkait detail konsep dan spesifikasi frame.

Terima kasih atas perhatian dan kerja samanya.

Salam hormat,
Tim Marketing Optik I See You`,
      casual: `Halo Kak [Nama]! ✨👋

Suka banget sama konten-konten Kakak di feed, aesthetic banget! Kenalin aku dari tim Marketing Optik I See You 👓

Kita lagi ada project kolaborasi barter produk kacamata nih kak. Nanti kacamata [Produk] bakal kita kirim langsung ke alamat rumah Kakak (free ongkir & gak perlu repot visit ke toko sama sekali).

Sebagai gantinya, Kakak cukup bikin konten [Deliverables] pas kacamata udah sampai.

Kira-kira Kakak tertarik buat collab bareng kita gak nih, Kak? Boleh banget kabari yaa! Makasih banyak Kak 😊✨`,
    },
  },
  {
    id: "tpl-b-followup",
    key: "B",
    title: "Template B — Follow-up After No Response",
    category: "follow_up",
    badge: "Follow-up",
    description: "Pengingat ramah jika calon creator belum membalas tawaran awal barter produk setelah 2–3 hari.",
    tones: {
      semi_formal: `Halo Kak [Nama], selamat siang/sore. 😊

Izin follow-up kembali terkait penawaran kolaborasi barter produk kacamata dari Optik I See You yang kami kirimkan sebelumnya.

Kira-kira apakah Kakak berkenan untuk bekerja sama dalam campaign [Campaign] ini?

Nantinya produk kacamata akan kami kirimkan langsung ke rumah Kakak tanpa perlu visit ke store.

Jika ada hal yang ingin ditanyakan terlebih dahulu, jangan ragu untuk berdiskusi ya, Kak. Kami tunggu kabar baiknya! 🙏`,
      formal: `Selamat siang Kak [Nama],

Menindaklanjuti pesan penawaran kolaborasi kerja sama barter produk kacamata Optik I See You sebelumnya, kami ingin mengonfirmasi apakah pesan tersebut telah diterima dengan baik.

Besar harapan kami dapat menjalin kemitraan promosi bersama Kakak dalam campaign [Campaign].

Apabila Kakak berkenan, kami siap mengirimkan detail teknis lebih lanjut. Terima kasih banyak atas waktunya.`,
      casual: `Halo Kak [Nama]! 😊 Mau follow-up sedikit nih soal penawaran barter kacamata Optik I See You kemarin.

Kira-kira Kakak tertarik untuk ikutan collab ini gak yaa? Paket kacamata bakal langsung kita kirim ke alamat Kakak.

Ditunggu kabarnya ya Kak, have a great day! ✨`,
    },
  },
  {
    id: "tpl-c-details",
    key: "C",
    title: "Template C — Creator Interested / Requesting Details",
    category: "deal",
    badge: "Penjelasan Detail",
    description: "Menjelaskan detail teknis barter, pemilihan frame kacamata, dan bentuk deliverables setelah creator menunjukkan minat.",
    tones: {
      semi_formal: `Halo Kak [Nama], terima kasih banyak atas respon positifnya! Senang sekali Kakak tertarik untuk berkolaborasi. 😊

Berikut kami sampaikan detail kerja sama barter produk Optik I See You:

1. Barter Produk: Kami akan mengirimkan 1 paket kacamata lengkap ([Produk]) senilai ±[Estimasi Nilai]. Kakak bebas memilih model frame kacamata kekinian favorit Kakak dari katalog kami.
2. Pengiriman: Paket dikirim langsung ke alamat rumah Kakak (ongkir 100% ditanggung Optik I See You). Kakak tidak perlu datang ke store.
3. Deliverables Konten: Kakak diharapkan membuat [Deliverables] dengan durasi tayang minimal 30 hari.
4. Highlight: Menampilkan kenyamanan frame, kejernihan lensa, dan tagging akun resmi @iseeyou.glasses.

Kira-kira apakah ketentuan ini sudah sesuai untuk Kakak? Jika sudah, kami akan kirimkan link katalog frame untuk Kakak pilih ya! 👓✨`,
      formal: `Yth. Kak [Nama],

Terima kasih atas ketertarikan Kakak terhadap penawaran kemitraan Optik I See You.

Berikut poin-poin kesepakatan kolaborasi barter produk yang kami tawarkan:
- Paket Barter: 1 set kacamata resmi ([Produk]) senilai [Estimasi Nilai] bebas pilih model.
- Distribusi: Produk dikirim langsung ke alamat domisili tanpa keharusan kunjungan gerai.
- Luaran Konten (Deliverables): [Deliverables] dengan penandaan akun resmi @iseeyou.glasses.
- Timeline: Batas publikasi H+7 setelah paket diterima.

Mohon konfirmasinya apabila poin di atas dapat disetujui, agar kami dapat segera memproses katalog pemilihan frame. Terima kasih.`,
      casual: `Wah asyik! Makasih banyak ya Kak [Nama] udah tertarik collab bareng kita! 🥳✨

Jadi sistemnya gampang banget Kak:
1. Kakak bebas pilih kacamata favorit dari katalog kita ([Produk]).
2. Kita kirim langsung ke rumah Kakak (free ongkir).
3. Setelah kacamata sampai, Kakak tinggal bikin konten [Deliverables].
4. Jangan lupa tag @iseeyou.glasses ya!

Gimana Kak, aman ya? Kalau oke, aku kirimin katalog kacamata buat Kakak pilih sekarang ya! 👓`,
    },
  },
  {
    id: "tpl-d-confirmation",
    key: "D",
    title: "Template D — Collaboration Confirmation",
    category: "deal",
    badge: "Konfirmasi Deal",
    description: "Konfirmasi kesepakatan akhir mengenai model kacamata yang dipilih dan komitmen jadwal tayang konten.",
    tones: {
      semi_formal: `Baik Kak [Nama], terima kasih atas konfirmasinya! 🙌

Dengan ini kolaborasi barter produk untuk campaign [Campaign] resmi disepakati dengan rincian:
• Produk Pilihan: [Produk]
• Deliverables: [Deliverables]
• Estimasi Deadline Tayang: [Deadline] (±7 hari setelah produk tiba)

Selanjutnya kami akan memproses penyiapan kacamata Kakak di bagian lab dan logistik.

Mohon bantuannya untuk mengisi data alamat pengiriman pada pesan berikutnya ya, Kak. Terima kasih! 😊`,
      formal: `Terima kasih atas konfirmasinya, Kak [Nama].

Kami mencatat bahwa kolaborasi barter produk telah disetujui bersama dengan rincian:
1. Spesifikasi Produk: [Produk]
2. Bentuk Publikasi: [Deliverables]
3. Batas Publikasi: Maksimal [Deadline] setelah produk diterima.

Tim kami saat ini mulai menyiapkan produk pesanan Kakak. Mohon kesediaannya melengkapi format alamat pengiriman. Terima kasih.`,
      casual: `Sip deal ya Kak [Nama]! 🎉 

Kacamata pilihan Kakak ([Produk]) udah kita catat dan langsung masuk antrian packing. Deliverables-nya [Deliverables] ya Kak.

Tinggal kirimin alamat pengiriman Kakak biar paketnya bisa segera kita kirim. Makasih banyak Kak! ✨`,
    },
  },
  {
    id: "tpl-e-address",
    key: "E",
    title: "Template E — Request Shipping Address",
    category: "shipping",
    badge: "Minta Alamat",
    description: "Meminta format alamat rumah lengkap dan nomor kontak penerima untuk pengiriman paket barter kacamata.",
    tones: {
      semi_formal: `Halo Kak [Nama], agar paket kacamata [Produk] bisa segera kami kirimkan ke rumah Kakak, boleh dibantu melengkapi format alamat berikut ya:

Nama Penerima: 
Nomor WhatsApp/HP Aktif: 
Alamat Lengkap (beserta no. rumah, RT/RW, kelurahan, kecamatan): 
Kota / Kabupaten: 
Provinsi: 
Kode Pos: 
Patokan Alamat (opsional): 

Nantinya setelah paket dikirim, kami akan segera infokan nomor resi ekspedisinya ya, Kak. Terima kasih! 🙏📦`,
      formal: `Untuk keperluan ekspedisi pengiriman paket kacamata [Produk], mohon bantuannya untuk melengkapi data pengiriman berikut:

Nama Lengkap Penerima:
Nomor Telepon / WhatsApp:
Alamat Lengkap (Jalan, No., RT/RW, Kelurahan, Kecamatan):
Kota/Kabupaten & Provinsi:
Kode Pos:

Biaya pengiriman sepenuhnya ditanggung oleh pihak Optik I See You. Terima kasih atas kerja samanya.`,
      casual: `Kak [Nama], izin minta data pengiriman kacamata yaa biar bisa langsung kita kirim hari ini:

Nama Penerima:
No. HP / WA:
Alamat Lengkap (plus RT/RW & patokan):
Kota & Kode Pos:

Kalau udah, langsung kabari yaa Kak. Makasih banyak! 📦✨`,
    },
  },
  {
    id: "tpl-f-shipping",
    key: "F",
    title: "Template F — Product Shipping Notification",
    category: "shipping",
    badge: "Nomor Resi",
    description: "Memberitahukan bahwa kacamata sudah dikirim beserta nomor resi pelacakan kurir.",
    tones: {
      semi_formal: `Halo Kak [Nama], kabar baik! 📦✨

Paket kacamata kolaborasi Kakak ([Produk]) sudah berhasil kami kirimkan hari ini.

Berikut informasi pengirimannya:
• Ekspedisi: [Ekspedisi / Kurir]
• Nomor Resi: [No Resi]
• Estimasi Tiba: [Estimasi Tiba]

Apabila paketnya sudah sampai nanti, mohon dibantu konfirmasi ya, Kak. Semoga suka dan cocok dengan kacamatanya! Terima kasih. 😊👓`,
      formal: `Selamat siang Kak [Nama],

Kami menginformasikan bahwa paket kacamata kolaborasi ([Produk]) telah diserahkan kepada pihak ekspedisi untuk dikirimkan ke alamat Kakak.

Rincian Pengiriman:
- Jasa Ekspedisi: [Ekspedisi / Kurir]
- Nomor Resi Pelacakan: [No Resi]

Mohon kesediaannya untuk mengabari kami kembali ketika paket telah tiba di lokasi. Terima kasih atas kerja sama yang baik.`,
      casual: `Halo Kak [Nama]! Paket kacamata kamu udah meluncur yaa! 🚀📦

No. Resi: [No Resi] ([Ekspedisi / Kurir])

Bisa dicek berkala ya Kak. Nanti kalau paketnya udah sampai kabarin kita yaa, can't wait to see your try-on! ✨👓`,
    },
  },
  {
    id: "tpl-g-received",
    key: "G",
    title: "Template G — Product Received Follow-up",
    category: "production",
    badge: "Cek Kedatangan",
    description: "Memastikan paket kacamata telah sampai dengan aman dan menanyakan kenyamanan fitting frame sebelum produksi konten.",
    tones: {
      semi_formal: `Halo Kak [Nama], selamat siang/sore! 😊

Berdasarkan pelacakan kurir, paket kacamata sepertinya sudah tiba di alamat Kakak ya?

Kira-kira paketnya sudah diterima dalam kondisi baik dan aman ya, Kak? Semoga kacamatanya cocok dan nyaman saat dicoba!

Untuk produksi konten [Deliverables], jika ada yang ingin dikoordinasikan terkait konsep atau materi pendukung, silakan kabari kami ya, Kak. Semangat untuk proses shooting-nya! ✨🎬`,
      formal: `Selamat siang Kak [Nama],

Kami memantau melalui nomor resi bahwa paket kiriman telah berstatus diterima.

Izin mengonfirmasi apakah produk kacamata telah sampai dengan baik tanpa kendala? Kami berharap produk tersebut sesuai dengan ekspektasi Kakak.

Terkait pembuatan konten [Deliverables], mohon dapat diselesaikan sesuai jadwal yang telah disepakati. Terima kasih banyak.`,
      casual: `Halo Kak [Nama]! Paket kacamatanya udah sampai kan ya? Gimana Kak, kacamatanya pas dan cocok gak di wajah? Semoga suka yaa! 🥰👓

Nanti kalau udah mulai take konten [Deliverables] kabarin ya Kak, kalau butuh logo atau materi grafis bisa langsung bilang ke kita. Semangat take videonya! 🔥`,
    },
  },
  {
    id: "tpl-h-deadline",
    key: "H",
    title: "Template H — Content Deadline Reminder",
    category: "production",
    badge: "Pengingat Deadline",
    description: "Pengingat ramah dan sopan menjelang batas waktu publikasi konten yang telah disepakati.",
    tones: {
      semi_formal: `Halo Kak [Nama], selamat siang/sore. 😊

Izin mengingatkan secara ramah ya Kak, terkait jadwal publikasi konten kolaborasi kacamata [Produk] yang direncanakan tayang pada [Deadline].

Kira-kira apakah proses take video atau editingnya berjalan lancar, Kak? 

Jika ada kendala yang dihadapi, silakan kabari kami ya, agar bisa kita koordinasikan bersama. Terima kasih banyak atas kerja samanya, Kak! 🙏`,
      formal: `Selamat siang Kak [Nama],

Semoga Kakak senantiasa dalam keadaan sehat.

Kami ingin mengonfirmasi terkait progress konten kolaborasi kacamata Optik I See You yang dijadwalkan untuk dipublikasikan pada [Deadline].

Mohon kesediaannya memberikan update status pengerjaan konten tersebut. Apabila ada kendala teknis, kami siap membantu. Terima kasih.`,
      casual: `Halo Kak [Nama]! ✨ Mau reminder ramah nih buat video kacamata kita yang rencananya tayang [Deadline].

Udah beres editingnya kah Kak? Kalau butuh review atau ada kendala kabarin aja yaa. Ditunggu banget tayangnya! 🙌🔥`,
    },
  },
  {
    id: "tpl-i-thankyou",
    key: "I",
    title: "Template I — Thank You After Content Publication",
    category: "appreciation",
    badge: "Apresiasi & Selesai",
    description: "Ucapan terima kasih profesional setelah video review/try-on resmi terbit di feed Instagram / TikTok creator.",
    tones: {
      semi_formal: `Halo Kak [Nama], terima kasih banyak ya! 🎉👏

Konten kolaborasi kacamata Optik I See You di akun Kakak sudah kami lihat. Hasil videonya sangat rapi, estetik, dan penyampaian review-nya sangat menarik!

Senang sekali bisa bekerja sama dengan Kakak dalam campaign [Campaign] ini. Semoga kacamata dari Optik I See You bermanfaat dan nyaman dipakai sehari-hari ya, Kak.

Sukses selalu untuk Kakak, dan semoga di lain kesempatan kita bisa berkolaborasi kembali! Salam hangat dari seluruh tim Optik I See You. 🙏👓✨`,
      formal: `Yth. Kak [Nama],

Kami dari manajemen dan tim Marketing Optik I See You mengucapkan terima kasih yang sebesar-besarnya atas publikasi konten kolaborasi yang sangat baik.

Kualitas video dan pesan promosi yang disampaikan sangat representatif bagi brand kami. Kerja sama ini telah kami catat berstatus selesai dengan hasil yang sangat memuaskan.

Semoga kemitraan baik ini dapat berlanjut pada campaign-campaign mendatang. Sukses selalu untuk karier dan karya Kakak.`,
      casual: `Keren banget Kak [Nama]! Videonya udah aku tonton, hasilnya pecah dan bagus bangett! 😍🔥

Makasih banyak ya Kak udah collab bareng Optik I See You. Kacamata barunya dipakai terus yaa semoga awet dan bermanfaat.

Next time kita collab lagi ya Kak! Sukses terus buat konten-kontennya! 💖👓✨`,
    },
  },
];

/**
 * INISIALISASI DATA KAMPANYE AKTIF (MASTER SPECIFICATION §8)
 */
export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-pastel-q4",
    name: "Barter Launching Frame Hexagonal Pastel Q4 2026",
    objective: "Meningkatkan brand awareness koleksi frame pastel kekinian dan mendorong booking virtual try-on di optikiseeyou.com melalui review OOTD creator.",
    startDate: "2026-10-15",
    endDate: "2026-11-30",
    status: "active",
    participatingCreatorIds: ["kol-wsb-hanna", "kol-pwt-ericall", "kol-pwt-alinalifah", "kol-clp-nadia"],
    totalProductsAllocated: 12,
    totalShippingCosts: 245000,
    totalCollaborationCosts: 850000,
    totalPublishedContent: 8,
    totalViews: 142500,
    totalReach: 112000,
    averageEngagement: 6.4,
    notes: "Fokus barter produk kacamata komplit untuk micro-influencer fashion & lifestyle Jawa Tengah.",
  },
  {
    id: "camp-campus-ambassador",
    name: "Campus Eyewear Ambassador Barter 2026",
    objective: "Menjangkau segmen mahasiswa Unsoed, UMP, IAIN, dan kampus regional via barter kacamata anti-radiasi blue ray untuk tugas kuliah & skripsi.",
    startDate: "2026-11-01",
    endDate: "2026-12-15",
    status: "active",
    participatingCreatorIds: ["kol-pbg-dhea", "kol-tgl-fajar", "kol-pwt-novia"],
    totalProductsAllocated: 8,
    totalShippingCosts: 180000,
    totalCollaborationCosts: 300000,
    totalPublishedContent: 5,
    totalViews: 68400,
    totalReach: 52000,
    averageEngagement: 7.2,
    notes: "Prioritas creator dengan visual fresh & audiens aktif usia 18–24 tahun.",
  },
  {
    id: "camp-hijab-aesthetic",
    name: "Hijab Aesthetic Eyewear National Barter",
    objective: "Kolaborasi barter produk kacamata nyaman tanpa pusing/tertekan hijab untuk creator modest fashion nasional.",
    startDate: "2026-11-10",
    endDate: "2026-12-31",
    status: "active",
    participatingCreatorIds: ["kol-wsb-hanna", "kol-pwt-alinalifah"],
    totalProductsAllocated: 6,
    totalShippingCosts: 165000,
    totalCollaborationCosts: 500000,
    totalPublishedContent: 3,
    totalViews: 89000,
    totalReach: 74000,
    averageEngagement: 8.1,
    notes: "Fokus keunggulan gagang kacamata lentur (anti pusing dipakai di balik ciput).",
  },
];

/**
 * DAFTAR LOKASI UNTUK FILTER & DROPDOWN
 */
export const LOCATIONS_LIST = [
  "Purwokerto",
  "Purbalingga",
  "Cilacap",
  "Wonosobo",
  "Tegal",
  "Yogyakarta",
  "Semarang",
  "Solo",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Lainnya (Nasional)",
];
