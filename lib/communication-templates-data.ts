/**
 * MARKETING COMMUNICATION CENTER DATA & CONFIGURATION
 * Optik I See You | Marketing Intelligence Dashboard
 * 
 * Pusat pengelolaan template komunikasi WhatsApp standar operasional:
 * 1. Sponsorship & Partnership Communication (10 templates)
 * 2. Model Recruitment & Coordination (5 templates)
 * + Centralized PIC Yossika Putra Erlangga (087778683766)
 */

export type TemplateCategory = "sponsorship" | "model" | "cadence";
export type SubCategory = "sponsorship" | "partnership" | "model" | "upload_reminder" | "cadence_check";

export interface PlaceholderConfig {
  key: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  type?: "text" | "select" | "number";
  options?: string[];
  description?: string;
}

export interface CommunicationTemplate {
  id: string;
  templateNumber: string;
  title: string;
  category: TemplateCategory;
  subcategory: SubCategory;
  badge: string;
  description: string;
  content: string;
  placeholders?: PlaceholderConfig[];
  tags: string[];
}

export interface ModelPrimaryPic {
  name: string;
  role: string;
  organization: string;
  phoneDisplay: string;
  phoneInternational: string;
  waUrl: string;
  note: string;
  responsibilities: string[];
  rulesForStaff: {
    allowed: string[];
    forbidden: string[];
  };
}

/**
 * PIC UTAMA MODEL RECRUITMENT & COORDINATION
 * Seluruh konfirmasi, pendataan, dan koordinasi akhir calon model dilakukan melalui PIC utama.
 */
export const MODEL_PRIMARY_PIC: ModelPrimaryPic = {
  name: "Yossika Putra Erlangga",
  role: "Marketing",
  organization: "Optik I See You",
  phoneDisplay: "087778683766",
  phoneInternational: "6287778683766",
  waUrl: "https://wa.me/6287778683766",
  note: "Seluruh konfirmasi, pendataan, dan koordinasi akhir calon model dilakukan melalui PIC utama.",
  responsibilities: [
    "Konfirmasi ketertarikan calon model",
    "Pendataan lengkap calon model & talent portfolio",
    "Penjelasan detail kegiatan, wardrobe & konsep visual",
    "Koordinasi jadwal & rundown pemotretan",
    "Konfirmasi lokasi store / outdoor shoot",
    "Informasi konsep dan kebutuhan teknis pemotretan",
    "Finalisasi keikutsertaan dan kompensasi model",
  ],
  rulesForStaff: {
    allowed: [
      "Melakukan talent scouting & pencarian calon model di media sosial (IG, TikTok)",
      "Melakukan pendekatan awal & sapaan ramah menggunakan template resmi",
      "Mengirimkan penawaran awal ke calon model",
      "Mengarahkan calon model yang tertarik ke nomor WhatsApp PIC utama",
    ],
    forbidden: [
      "Memberikan konfirmasi final atau janji jadwal secara mandiri",
      "Menentukan kesepakatan fee / kompensasi di luar wewenang PIC utama",
      "Menetapkan lokasi atau tanggal fix pemotretan tanpa persetujuan PIC",
      "Menyimpan data pribadi calon model tanpa izin atau di luar alur resmi",
    ],
  },
};

/**
 * DAFTAR LENGKAP TEMPLATE KOMUNIKASI WHATSAPP
 */
export const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  // =========================================================================
  // KATEGORI A: SPONSORSHIP & PARTNERSHIP (10 TEMPLATES)
  // =========================================================================
  {
    id: "spons-01",
    templateNumber: "TEMPLATE 01",
    title: "Penerimaan Permintaan Sponsorship",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Permintaan Baru",
    description: "Respon awal ramah saat ada pihak panitia, organisasi, atau sekolah/kampus menghubungi Optik I See You untuk penawaran sponsorship.",
    content: `Halo Kak, selamat [pagi/siang/sore].

Terima kasih sudah menghubungi Optik I See You dan tertarik untuk menjalin kerja sama dengan kami.

Untuk informasi lebih lanjut, boleh dibantu kirimkan proposal kegiatan atau detail penawaran kerja samanya terlebih dahulu ya, Kak.

Nantinya akan kami pelajari dan koordinasikan dengan tim manajemen.

Terima kasih, Kak!`,
    placeholders: [
      {
        key: "greeting_time",
        label: "Sapaan Waktu",
        placeholder: "[pagi/siang/sore]",
        defaultValue: "siang",
        type: "select",
        options: ["pagi", "siang", "sore"],
        description: "Pilih waktu saat mengirimkan pesan.",
      },
    ],
    tags: ["permintaan", "proposal", "awal", "sponsorship", "baru", "greeting"],
  },
  {
    id: "spons-02",
    templateNumber: "TEMPLATE 02",
    title: "Konfirmasi Proposal Diterima",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Tanda Terima",
    description: "Konfirmasi tanda terima resmi setelah pemohon mengirimkan dokumen/file proposal kegiatan ke WhatsApp.",
    content: `Baik Kak, proposalnya sudah kami terima.

Selanjutnya akan kami pelajari terlebih dahulu dan koordinasikan dengan pihak manajemen terkait kemungkinan kerja sama yang dapat diberikan.

Mohon ditunggu informasi selanjutnya ya, Kak.

Terima kasih!`,
    tags: ["konfirmasi", "proposal", "diterima", "review", "manajemen"],
  },
  {
    id: "spons-03",
    templateNumber: "TEMPLATE 03",
    title: "Meminta Informasi Tambahan",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Klarifikasi",
    description: "Mengajukan pertanyaan klarifikasi mengenai target audiens, media publikasi, atau teknis acara sebelum keputusan sponsorship diambil.",
    content: `Terima kasih atas proposal yang sudah dikirimkan, Kak.

Izin, ada beberapa informasi tambahan yang ingin kami konfirmasi agar dapat kami sampaikan kepada pihak manajemen:

1. [Pertanyaan pertama]
2. [Pertanyaan kedua]
3. [Pertanyaan ketiga]

Mohon bantuannya untuk memberikan informasi tersebut ya, Kak.

Terima kasih!`,
    placeholders: [
      {
        key: "q1",
        label: "Pertanyaan 1",
        placeholder: "[Pertanyaan pertama]",
        defaultValue: "Berapa estimasi target peserta atau audiens yang hadir pada kegiatan ini?",
        type: "text",
      },
      {
        key: "q2",
        label: "Pertanyaan 2",
        placeholder: "[Pertanyaan kedua]",
        defaultValue: "Apa saja media publikasi yang akan memuat logo Optik I See You (backdrop, pamflet, feeds IG)?",
        type: "text",
      },
      {
        key: "q3",
        label: "Pertanyaan 3",
        placeholder: "[Pertanyaan ketiga]",
        defaultValue: "Apakah pihak panitia bersedia membantu 20 ulasan rating bintang 5 di Google Maps cabang resmi kami?",
        type: "text",
      },
    ],
    tags: ["klarifikasi", "pertanyaan", "audiens", "benefit", "data tambahan"],
  },
  {
    id: "spons-04",
    templateNumber: "TEMPLATE 04",
    title: "Proposal Sedang Diproses",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Status Update",
    description: "Memberikan update berkala secara santun saat partner menanyakan progress peninjauan proposal yang masih dalam tahap rapat manajemen.",
    content: `Halo Kak, izin menginformasikan bahwa proposal kerja samanya saat ini masih dalam proses koordinasi dengan pihak manajemen.

Untuk hasil dan keputusan lebih lanjut akan kami informasikan kembali melalui WhatsApp ini ya, Kak.

Terima kasih atas kesabaran dan pengertiannya!`,
    tags: ["progress", "proses", "tunggu", "manajemen", "update"],
  },
  {
    id: "spons-05",
    templateNumber: "TEMPLATE 05",
    title: "Sponsorship Disetujui",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Disetujui (Deal)",
    description: "Kabar gembira bahwa proposal sponsorship disetujui, mencakup kuota voucher cuci kacamata dan voucher potongan belanja.",
    content: `Halo Kak, selamat [pagi/siang/sore].

Menindaklanjuti proposal sponsorship yang telah diajukan, kami ingin menginformasikan bahwa pihak manajemen Optik I See You menyetujui untuk memberikan dukungan kerja sama berupa:

- [Jumlah] Voucher Cuci Kacamata Gratis.
- [Jumlah] Voucher Potongan Rp50.000 dengan minimal pembelian Rp350.000.

Untuk teknis pengambilan dan penyerahan voucher nantinya akan kami koordinasikan kembali ya, Kak.

Terima kasih atas kesempatan kerja samanya!`,
    placeholders: [
      {
        key: "greeting_time",
        label: "Sapaan Waktu",
        placeholder: "[pagi/siang/sore]",
        defaultValue: "siang",
        type: "select",
        options: ["pagi", "siang", "sore"],
      },
      {
        key: "cuci_count",
        label: "Jumlah Voucher Cuci Kacamata",
        placeholder: "[Jumlah]",
        defaultValue: "10",
        type: "text",
      },
      {
        key: "potongan_count",
        label: "Jumlah Voucher Potongan Rp50.000",
        placeholder: "[Jumlah]",
        defaultValue: "10",
        type: "text",
      },
    ],
    tags: ["disetujui", "voucher", "cuci gratis", "potongan", "deal", "approval"],
  },
  {
    id: "spons-06",
    templateNumber: "TEMPLATE 06",
    title: "Follow-up Pengambilan Voucher",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Koordinasi Fisik",
    description: "Menanyakan kepastian jam dan teknis serah terima fisik voucher resmi di outlet store cabang Optik I See You.",
    content: `Halo Kak, izin follow-up terkait pengambilan voucher sponsorship.

Kira-kira untuk pengambilan voucher rencananya hari ini pukul berapa ya, Kak?

Agar bisa kami koordinasikan dengan tim cabang.

Terima kasih, Kak!`,
    tags: ["voucher", "pengambilan", "store", "cabang", "serah terima", "follow-up"],
  },
  {
    id: "spons-07",
    templateNumber: "TEMPLATE 07",
    title: "Koordinasi Kunjungan / Visit Partner",
    category: "sponsorship",
    subcategory: "partnership",
    badge: "Audiensi Cabang",
    description: "Merespon rencana kunjungan langsung / audiensi pihak mitra kerja sama ke store cabang agar tim outlet siap menyambut.",
    content: `Baik Kak, untuk rencana kunjungannya sudah kami terima.

Nantinya akan kami koordinasikan terlebih dahulu dengan tim cabang terkait waktu dan kesiapan lokasi.

Jika sudah ada konfirmasi, akan segera kami kabarkan kembali ya, Kak.`,
    tags: ["visit", "kunjungan", "audiensi", "cabang", "jadwal", "partner"],
  },
  {
    id: "spons-08",
    templateNumber: "TEMPLATE 08",
    title: "Follow-up Partner",
    category: "sponsorship",
    subcategory: "partnership",
    badge: "Follow-up",
    description: "Menanyakan kabar dan perkembangan lanjutan kepada calon mitra kerja sama yang belum memberikan update kegiatan.",
    content: `Halo Kak, selamat [pagi/siang/sore].

Izin follow-up kembali terkait rencana kerja sama sebelumnya.

Apakah sudah ada informasi atau perkembangan lebih lanjut mengenai kegiatan tersebut, Kak?

Kami tunggu kabarnya ya.

Terima kasih!`,
    placeholders: [
      {
        key: "greeting_time",
        label: "Sapaan Waktu",
        placeholder: "[pagi/siang/sore]",
        defaultValue: "siang",
        type: "select",
        options: ["pagi", "siang", "sore"],
      },
    ],
    tags: ["follow-up", "partner", "kabar", "kelanjutan", "update"],
  },
  {
    id: "spons-09",
    templateNumber: "TEMPLATE 09",
    title: "Penolakan Sponsorship",
    category: "sponsorship",
    subcategory: "sponsorship",
    badge: "Penolakan Santun",
    description: "Menyampaikan permohonan maaf belum dapat berpartisipasi dengan gaya bahasa santun, profesional, dan tetap menjaga hubungan baik untuk kesempatan mendatang.",
    content: `Halo Kak, terima kasih atas proposal dan kesempatan kerja sama yang telah diberikan kepada Optik I See You.

Setelah melalui proses pertimbangan dan koordinasi dengan pihak manajemen, mohon maaf untuk saat ini kami belum dapat berpartisipasi dalam kegiatan tersebut.

Semoga kegiatan yang akan diselenggarakan dapat berjalan dengan lancar dan sukses.

Terima kasih atas pengertiannya, Kak!`,
    tags: ["penolakan", "santun", "maaf", "sponsorship", "closing"],
  },
  {
    id: "spons-10",
    templateNumber: "TEMPLATE 10",
    title: "Penutup Komunikasi",
    category: "sponsorship",
    subcategory: "partnership",
    badge: "Penutup",
    description: "Pesan apresiasi penutup setelah seluruh alur kerja sama selesai terkoordinasi dengan baik.",
    content: `Baik Kak, terima kasih banyak atas informasi dan koordinasinya.

Semoga kerja sama ini dapat berjalan dengan baik.

Jika nantinya ada informasi atau kebutuhan lebih lanjut, silakan menghubungi kami kembali ya, Kak.

Salam,
Tim Marketing Optik I See You.`,
    tags: ["penutup", "terima kasih", "salam", "closing", "selesai"],
  },

  // =========================================================================
  // KATEGORI B: MODEL RECRUITMENT & COORDINATION (5 TEMPLATES)
  // =========================================================================
  {
    id: "model-01",
    templateNumber: "MODEL TEMPLATE 01",
    title: "Penawaran kepada Calon Model",
    category: "model",
    subcategory: "model",
    badge: "Penawaran Awal",
    description: "Pendekatan awal kepada talent/kreator untuk mengajak berpartisipasi sebagai model foto katalog kacamata, softlens, dan konten promosi.",
    content: `Halo Kak! Perkenalkan, kami dari tim Marketing Optik I See You.

Saat ini kami sedang mencari talent/model untuk kebutuhan foto katalog produk kacamata dan konten promosi Optik I See You.

Kami tertarik untuk mengajak Kakak berpartisipasi sebagai model dalam kegiatan tersebut.

Apabila Kakak berkenan atau tertarik, nantinya bisa langsung menghubungi PIC kami melalui WhatsApp berikut:

087778683766 (Yossika)

Untuk informasi lebih lanjut mengenai konsep, jadwal, dan teknis kegiatan akan dijelaskan oleh PIC kami ya, Kak.

Terima kasih! 😊`,
    tags: ["model", "talent", "penawaran", "katalog", "foto", "promosi", "scouting"],
  },
  {
    id: "model-02",
    templateNumber: "MODEL TEMPLATE 02",
    title: "Jika Calon Model Menunjukkan Ketertarikan",
    category: "model",
    subcategory: "model",
    badge: "Merespon Minat",
    description: "Respon saat calon model menyatakan tertarik, langsung mengarahkan nomor kontak PIC Yossika Putra Erlangga untuk koordinasi lanjutan.",
    content: `Wah, baik Kak! Terima kasih atas ketertarikannya.

Untuk informasi lebih lanjut dan konfirmasi keikutsertaan, Kakak bisa langsung menghubungi PIC kami melalui WhatsApp:

087778683766

Nantinya akan dibantu terkait detail kegiatan dan koordinasi selanjutnya ya, Kak.`,
    tags: ["model", "tertarik", "minat", "arahan pic", "lanjutan"],
  },
  {
    id: "model-03",
    templateNumber: "MODEL TEMPLATE 03",
    title: "Jika Calon Model Bertanya Detail Kegiatan",
    category: "model",
    subcategory: "model",
    badge: "Detail Teknis",
    description: "Respon sopan saat model menanyakan konsep pemotretan, lokasi, pakaian, jadwal, atau kompensasi agar dijawab langsung dan jelas oleh PIC utama.",
    content: `Untuk detail kegiatan seperti konsep pemotretan, jadwal, lokasi, serta ketentuan lainnya akan dijelaskan langsung oleh PIC kami agar informasinya lebih lengkap.

Kakak bisa menghubungi WhatsApp berikut ya:

087778683766

Terima kasih, Kak!`,
    tags: ["model", "pertanyaan", "detail", "konsep", "jadwal", "lokasi", "pic"],
  },
  {
    id: "model-04",
    templateNumber: "MODEL TEMPLATE 04",
    title: "Jika Calon Model Bersedia Dihubungi",
    category: "model",
    subcategory: "model",
    badge: "Pendataan",
    description: "Respon saat calon model bersedia untuk didata dan dikontak lebih lanjut untuk sesi pemotretan.",
    content: `Baik Kak, terima kasih atas kesediaannya.

Agar koordinasi dan konfirmasi lebih lanjut bisa dilakukan dengan mudah, boleh langsung menghubungi PIC kami melalui nomor berikut:

087778683766

Nantinya akan dibantu untuk proses pendataan dan konfirmasi selanjutnya.`,
    tags: ["model", "bersedia", "pendataan", "konfirmasi", "pic"],
  },
  {
    id: "model-05",
    templateNumber: "MODEL TEMPLATE 05",
    title: "Follow-up Calon Model",
    category: "model",
    subcategory: "model",
    badge: "Follow-up",
    description: "Menghubungi kembali calon model yang belum membalas penawaran awal foto katalog dan kampanye visual.",
    content: `Halo Kak, izin menghubungi kembali terkait penawaran menjadi model untuk kebutuhan foto katalog dan konten promosi Optik I See You.

Apakah Kakak berkenan untuk berpartisipasi dalam kegiatan tersebut?

Jika tertarik, Kakak bisa langsung menghubungi PIC kami di 087778683766 ya.

Terima kasih, Kak!`,
    tags: ["model", "follow-up", "tanya kabar", "katalog", "reminder"],
  },

  // =========================================================================
  // KATEGORI C: JADWAL UPLOAD & CADENCE REELS 19.00 WIB (5 TEMPLATES)
  // Aturan Operasional: Upload Pukul 19.00 WIB · Reminder 18.30 WIB · Maks 3 Hari
  // =========================================================================
  {
    id: "cadence-01",
    templateNumber: "TEMPLATE 16",
    title: "Reminder Pra-Upload Jam 19.00 (Kirim 18.30 WIB)",
    category: "cadence",
    subcategory: "upload_reminder",
    badge: "Pra-Upload 18.30 WIB",
    description: "Pengingat wajib 30 menit sebelum slot upload prime time (19.00 WIB) ke PIC cabang agar materi video, cover, audio, caption, dan tagging sudah siap tayang.",
    content: `Halo Kak [Nama PIC], selamat sore! 😊

Mengingatkan kembali ya, jadwal upload konten Reels untuk [Nama Cabang / Akun IG] malam ini adalah pukul 19.00 WIB (prime time).

Sebelum tayang pukul 19.00 nanti, mohon dibantu pastikan:
1. Video sudah di-draft dan siap tayang
2. Cover kacamata/talent terlihat jelas & estetik di grid feed
3. Caption, hashtag resmi, dan tagging akun @iseeyou.glasses sudah terpasang
4. Lokasi store [Nama Cabang] sudah ditandai

Jika ada kendala teknis atau materi yang perlu dicek terlebih dahulu, kabari ya, Kak.

Semangat untuk upload malam ini! 🚀👓`,
    placeholders: [
      {
        key: "pic_name",
        label: "Nama PIC Cabang",
        placeholder: "[Nama PIC]",
        defaultValue: "Ilya",
        type: "select",
        options: ["Ilya", "Nuha", "Ajun", "Amanda", "Vio", "Rian"],
      },
      {
        key: "branch_name",
        label: "Akun Cabang / Outlet",
        placeholder: "[Nama Cabang / Akun IG]",
        defaultValue: "@iseeyou.glasses (Purwokerto)",
        type: "select",
        options: [
          "@iseeyou.glasses (Purwokerto)",
          "@iseeyou.purbalingga",
          "@iseeyou.cilacap",
          "@iseeyou.wonosobo",
          "@lunar.eyewear (Tegal)",
        ],
      },
    ],
    tags: ["upload", "reels", "reminder 18.30", "prime time 19.00", "cadence", "cabang"],
  },
  {
    id: "cadence-02",
    templateNumber: "TEMPLATE 17",
    title: "Pengecekan Batas Maksimal 3 Hari Belum Upload Reels",
    category: "cadence",
    subcategory: "cadence_check",
    badge: "Batas Ritme 3 Hari",
    description: "Peringatan ramah dan solutif jika akun cabang sudah 3 hari atau lebih belum memposting Reels baru, untuk menjaga algoritma dan interaksi audiens lokal.",
    content: `Halo Kak [Nama PIC], selamat [pagi/siang/sore]. 😊

Izin mengingatkan terkait ritme upload konten Reels di akun [Nama Cabang / Akun IG]. Berdasarkan catatan evaluasi ritme 3 hari, akun cabang saat ini sudah [Jumlah Hari] hari belum ada postingan Reels baru nih, Kak.

Standar operasional ritme konten kita adalah minimal 1 Reels setiap 3 hari agar reach dan engagement akun tetap optimal.

Kira-kira apakah ada kendala pada proses take video atau editingnya, Kak? Apakah materi [Judul Reels / Konsep Konten] bisa dijadwalkan untuk upload hari ini pada prime time pukul 19.00 WIB?

Jika butuh bantuan ide konsep atau review materi, silakan kabari ya, Kak. Terima kasih banyak! 🙏✨`,
    placeholders: [
      {
        key: "pic_name",
        label: "Nama PIC Cabang",
        placeholder: "[Nama PIC]",
        defaultValue: "Ajun",
        type: "select",
        options: ["Ilya", "Nuha", "Ajun", "Amanda", "Vio", "Rian"],
      },
      {
        key: "branch_name",
        label: "Akun Cabang",
        placeholder: "[Nama Cabang / Akun IG]",
        defaultValue: "@iseeyou.purbalingga",
        type: "select",
        options: [
          "@iseeyou.glasses (Purwokerto)",
          "@iseeyou.purbalingga",
          "@iseeyou.cilacap",
          "@iseeyou.wonosobo",
          "@lunar.eyewear (Tegal)",
        ],
      },
      {
        key: "days_behind",
        label: "Jeda Hari Tanpa Upload",
        placeholder: "[Jumlah Hari]",
        defaultValue: "3",
        type: "number",
      },
      {
        key: "reels_title",
        label: "Rencana Materi Reels",
        placeholder: "[Judul Reels / Konsep Konten]",
        defaultValue: "Reels Edukasi / Fitting Frame",
        type: "text",
      },
      {
        key: "greeting_time",
        label: "Sapaan Waktu",
        placeholder: "[pagi/siang/sore]",
        defaultValue: "siang",
        type: "select",
        options: ["pagi", "siang", "sore"],
      },
    ],
    tags: ["cadence 3 hari", "warning", "reels tertunda", "ritme", "upload 19.00", "evaluasi"],
  },
  {
    id: "cadence-03",
    templateNumber: "TEMPLATE 18",
    title: "Checklist Kesiapan Materi Reels Jam 19.00 (Cover, Audio & Tagging)",
    category: "cadence",
    subcategory: "upload_reminder",
    badge: "Checklist Teknis",
    description: "Panduan pengecekan standar kualitas teknis konten (hook, audio trending, framing 1:1, call-to-action) 30 menit sebelum dipencet Share.",
    content: `Halo Kak [Nama PIC]! 30 menit lagi jam upload prime time (19.00 WIB) ya. ⏰

Yuk kita checklist bareng materi Reels untuk [Nama Cabang / Akun IG] hari ini:
✅ Audio: Gunakan audio original yang jernih atau audio trending rekomendasi
✅ Hook 3 Detik: Frame kacamata atau promo langsung kelihatan di detik awal
✅ Cover Feed: Grid 1:1 rapi dan tidak kepotong teks penting
✅ CTA (Call To Action): Ajak cek mata gratis atau coba virtual try-on di optikiseeyou.com
✅ Tagging & Kolaborasi: Tag @iseeyou.glasses dan pin lokasi store cabang

Siap tayang tepat 19.00 WIB ya, Kak. Let's go! 🔥`,
    placeholders: [
      {
        key: "pic_name",
        label: "Nama PIC Cabang",
        placeholder: "[Nama PIC]",
        defaultValue: "Amanda",
        type: "select",
        options: ["Ilya", "Nuha", "Ajun", "Amanda", "Vio", "Rian"],
      },
      {
        key: "branch_name",
        label: "Akun Cabang",
        placeholder: "[Nama Cabang / Akun IG]",
        defaultValue: "@iseeyou.cilacap",
        type: "select",
        options: [
          "@iseeyou.glasses (Purwokerto)",
          "@iseeyou.purbalingga",
          "@iseeyou.cilacap",
          "@iseeyou.wonosobo",
          "@lunar.eyewear (Tegal)",
        ],
      },
    ],
    tags: ["checklist", "teknis", "hook", "audio trending", "cover feed", "sop upload"],
  },
  {
    id: "cadence-04",
    templateNumber: "TEMPLATE 19",
    title: "Follow-up Pasca Jam 19.00 (Jika Konten Belum Tayang)",
    category: "cadence",
    subcategory: "upload_reminder",
    badge: "Follow-up 19.15 WIB",
    description: "Konfirmasi cepat jika jam upload 19.00 WIB sudah terlewati namun video Reels cabang belum muncul di feed Instagram.",
    content: `Halo Kak [Nama PIC], selamat malam.

Izin konfirmasi ya Kak, kami cek di feed [Nama Cabang / Akun IG] untuk konten Reels jadwal jam 19.00 WIB malam ini sepertinya belum tayang ya?

Apakah proses uploadnya sedang terkendala jaringan / render video, Kak? 

Boleh dibantu update statusnya ya, agar bisa kami pantau bersama. Terima kasih, Kak! 🙏`,
    placeholders: [
      {
        key: "pic_name",
        label: "Nama PIC Cabang",
        placeholder: "[Nama PIC]",
        defaultValue: "Vio",
        type: "select",
        options: ["Ilya", "Nuha", "Ajun", "Amanda", "Vio", "Rian"],
      },
      {
        key: "branch_name",
        label: "Akun Cabang",
        placeholder: "[Nama Cabang / Akun IG]",
        defaultValue: "@iseeyou.wonosobo",
        type: "select",
        options: [
          "@iseeyou.glasses (Purwokerto)",
          "@iseeyou.purbalingga",
          "@iseeyou.cilacap",
          "@iseeyou.wonosobo",
          "@lunar.eyewear (Tegal)",
        ],
      },
    ],
    tags: ["follow-up", "terlambat upload", "kendala render", "monitoring 19.15"],
  },
  {
    id: "cadence-05",
    templateNumber: "TEMPLATE 20",
    title: "Konfirmasi Upload Berhasil & Perawatan Interaksi Awal",
    category: "cadence",
    subcategory: "upload_reminder",
    badge: "Pasca Upload",
    description: "Apresiasi dan panduan aktivasi engagement 1 jam pertama (share story, balas interaksi komen/DM, dan catat ke spreadsheet).",
    content: `Halo Kak [Nama PIC], mantap! Konten Reels hari ini sudah berhasil tayang di [Nama Cabang / Akun IG]. 👏🎉

Untuk memaksimalkan performa algoritma di 1 jam pertama:
1. Tolong langsung share video Reels ini ke Instagram Story cabang dengan sticker interaksi
2. Pantau dan balas komentar atau DM yang masuk dari calon customer
3. Jangan lupa input link dan judul video ke Spreadsheet harian ya

Terima kasih banyak atas kerja kerasnya hari ini, Kak! ✨`,
    placeholders: [
      {
        key: "pic_name",
        label: "Nama PIC Cabang",
        placeholder: "[Nama PIC]",
        defaultValue: "Rian",
        type: "select",
        options: ["Ilya", "Nuha", "Ajun", "Amanda", "Vio", "Rian"],
      },
      {
        key: "branch_name",
        label: "Akun Cabang",
        placeholder: "[Nama Cabang / Akun IG]",
        defaultValue: "@lunar.eyewear (Tegal)",
        type: "select",
        options: [
          "@iseeyou.glasses (Purwokerto)",
          "@iseeyou.purbalingga",
          "@iseeyou.cilacap",
          "@iseeyou.wonosobo",
          "@lunar.eyewear (Tegal)",
        ],
      },
    ],
    tags: ["apresiasi", "story share", "algoritma", "engagement", "interaksi 1 jam"],
  },
];

/**
 * Helper to replace known placeholders in template text
 */
export function applyPlaceholdersToText(
  originalText: string,
  values: Record<string, string>
): string {
  let result = originalText;

  // Specific mappings for known templates
  if (values.greeting_time) {
    result = result.replace(/\[pagi\/siang\/sore\]/g, values.greeting_time);
  }

  if (values.pic_name) {
    result = result.replace(/\[Nama PIC\]/g, values.pic_name);
  }

  if (values.branch_name) {
    result = result.replace(/\[Nama Cabang \/ Akun IG\]/g, values.branch_name);
    result = result.replace(/\[Nama Cabang\]/g, values.branch_name);
  }

  if (values.days_behind) {
    result = result.replace(/\[Jumlah Hari\]/g, values.days_behind);
  }

  if (values.reels_title) {
    result = result.replace(/\[Judul Reels \/ Konsep Konten\]/g, values.reels_title);
  }

  if (values.q1) {
    result = result.replace(/\[Pertanyaan pertama\]/g, values.q1);
  }
  if (values.q2) {
    result = result.replace(/\[Pertanyaan kedua\]/g, values.q2);
  }
  if (values.q3) {
    result = result.replace(/\[Pertanyaan ketiga\]/g, values.q3);
  }

  // Handle voucher template with two [Jumlah] placeholders
  if (values.cuci_count !== undefined && values.potongan_count !== undefined) {
    result = result.replace(
      /-\s*\[Jumlah\]\s*Voucher Cuci Kacamata Gratis\./g,
      `- ${values.cuci_count} Voucher Cuci Kacamata Gratis.`
    );
    result = result.replace(
      /-\s*\[Jumlah\]\s*Voucher Potongan Rp50\.000/g,
      `- ${values.potongan_count} Voucher Potongan Rp50.000`
    );
  }

  return result;
}

/**
 * Generate a clean WhatsApp Web / App share link
 */
export function generateWhatsAppShareUrl(text: string, phone = ""): string {
  const encodedText = encodeURIComponent(text);
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}
