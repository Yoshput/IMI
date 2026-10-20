export interface SponsorLead {
  id: string;
  brandName: string;
  contactPerson: string;
  phone: string;
  cleanPhone: string;
  category: "Skincare & Clinic" | "Fashion & Tailor" | "Entertainment" | "Sports" | "Retail & Mall" | "Wellness & Spa";
  recommendedPackage: "Diamond (Rp 5.000.000)" | "Gold (Rp 3.000.000)" | "Silver (Rp 1.500.000)" | "Barter Produk & Voucher";
  status: "Belum Dihubungi" | "Chat Terkirim" | "Menunggu Respon" | "Negosiasi" | "Deal Disetujui" | "Ditolak";
  notes: string;
  specificAngle: string;
  lastFollowUp?: string;
}

export const INITIAL_SPONSOR_LEADS: SponsorLead[] = [
  {
    id: "sp-01",
    brandName: "Baby Glows",
    contactPerson: "Tim Manajemen Baby Glows",
    phone: "+62 895-4219-89696",
    cleanPhone: "62895421989696",
    category: "Skincare & Clinic",
    recommendedPackage: "Gold (Rp 3.000.000)",
    status: "Belum Dihubungi",
    notes: "Klinik & produk kecantikan ibu & anak. Target audiens sangat pas dengan segmen ibu muda, mahasiswi, dan kreator cewek Purwokerto.",
    specificAngle: "Peluang open stand/booth konsultasi kulit & penempatan produk di goodie bag 50 kreator konten.",
  },
  {
    id: "sp-02",
    brandName: "GKP - Nuha Cosmetindo",
    contactPerson: "Tim Manajemen Nuha Cosmetindo",
    phone: "+62 812-3456-8220",
    cleanPhone: "6281234568220",
    category: "Skincare & Clinic",
    recommendedPackage: "Diamond (Rp 5.000.000)",
    status: "Belum Dihubungi",
    notes: "Pabrik / maklon kosmetik & skincare skala nasional. Potensi besar untuk paket sponsor utama Diamond guna memperkenalkan jasa maklon ke komunitas kreator.",
    specificAngle: "Sesi product talk / sharing maklon di panggung utama & penayangan video company profile di TV showroom 4 cabang ritel Optik I See You.",
  },
  {
    id: "sp-03",
    brandName: "Taylor De Virdis",
    contactPerson: "Tim Manajemen Taylor De Virdis",
    phone: "+62 851-3373-0893",
    cleanPhone: "6285133730893",
    category: "Fashion & Tailor",
    recommendedPackage: "Silver (Rp 1.500.000)",
    status: "Belum Dihubungi",
    notes: "Brand busana formal & bespoke tailor ternama. Relevan dengan styling fashion konten kreator.",
    specificAngle: "Wardrobe sponsor untuk pembicara utama & display manekin busana dipadukan frame kacamata I See You.",
  },
  {
    id: "sp-04",
    brandName: "Inul Vista (Inviz Purwokerto)",
    contactPerson: "Mas Wahyu (Marketing Inviz)",
    phone: "+62 813-9133-7120",
    cleanPhone: "6281391337120",
    category: "Entertainment",
    recommendedPackage: "Barter Produk & Voucher",
    status: "Belum Dihubungi",
    notes: "Family karaoke & entertainment ternama Purwokerto. Kerjasama skema barter voucher karaoke.",
    specificAngle: "Bundling voucher karaoke untuk doorprize peserta event & barter penayangan iklan di layar TV showroom ritel I See You.",
  },
  {
    id: "sp-05",
    brandName: "Merayu Spa Purbalingga",
    contactPerson: "Kak Nisrina Khoirunnisa S (Account Executive)",
    phone: "+62 896-7447-1692",
    cleanPhone: "6289674471692",
    category: "Wellness & Spa",
    recommendedPackage: "Barter Produk & Voucher",
    status: "Deal Disetujui",
    notes: "MoU Barter Voucher aktif (6 Okt 2026 - 6 Jan 2027) senilai Rp 120.000 dengan I See You Purbalingga. Lanjutan koordinasi kemitraan sponsorship event Optik I See You.",
    specificAngle: "Sinergi barter voucher spa Rp 120.000 untuk VIP goodie bag/doorprize peserta event dan aktivasi display/promosi bersama di gerai & media sosial.",
  },
  {
    id: "sp-06",
    brandName: "Navagreen Purwokerto (Line 1)",
    contactPerson: "Tim Marketing Navagreen",
    phone: "+62 855-4024-6660",
    cleanPhone: "6285540246660",
    category: "Skincare & Clinic",
    recommendedPackage: "Diamond (Rp 5.000.000)",
    status: "Belum Dihubungi",
    notes: "Klinik perawatan wajah alami paling populer di kalangan mahasiswa Banyumas. Match tinggi dengan pelanggan Optik I See You.",
    specificAngle: "Exclusive booth aktivasi di venue, tayangan video promosi di 4 cabang, dan pembagian kupon facial di goodie bag.",
  },
  {
    id: "sp-07",
    brandName: "Reta Beauty Clinic",
    contactPerson: "Tim Sponsorship Reta Clinic",
    phone: "+62 822-4237-4910",
    cleanPhone: "6282242374910",
    category: "Skincare & Clinic",
    recommendedPackage: "Gold (Rp 3.000.000)",
    status: "Belum Dihubungi",
    notes: "Klinik kecantikan medis bereputasi tinggi dengan pasien loyalitas besar di Purwokerto.",
    specificAngle: "Logo sponsor di backdrop panggung dan materi digital, serta demo perawatan mata segar bersama Optik I See You.",
  },
  {
    id: "sp-08",
    brandName: "Rita Padel Club",
    contactPerson: "Tim Manajemen Rita Padel Club",
    phone: "+62 815-5876-0009",
    cleanPhone: "6281558760009",
    category: "Sports",
    recommendedPackage: "Silver (Rp 1.500.000)",
    status: "Belum Dihubungi",
    notes: "Pusat olahraga padel kekinian yang sangat hits di kalangan eksekutif muda & kreator Purwokerto.",
    specificAngle: "Kolaborasi sport-lifestyle: display kacamata polarized/sport I See You & voucher gratis sesi main padel untuk audiens.",
  },
  {
    id: "sp-09",
    brandName: "Rita Supermall / Retail",
    contactPerson: "Tim Promosi & Marketing Rita Group",
    phone: "+62 851-6886-1546",
    cleanPhone: "6285168861546",
    category: "Retail & Mall",
    recommendedPackage: "Diamond (Rp 5.000.000)",
    status: "Belum Dihubungi",
    notes: "Pusat perbelanjaan terbesar se-Banyumas Raya. Sinergi jaringan ritel offline multi-cabang.",
    specificAngle: "Cross-marketing voucher belanja ritel Rita dan promosi event Buka Kelas Konten di titik strategis pusat belanja.",
  },
  {
    id: "sp-10",
    brandName: "Navagreen Promosi & Media (Line 2)",
    contactPerson: "Tim Promosi & Event Navagreen",
    phone: "+62 855-4024-6660",
    cleanPhone: "6285540246660",
    category: "Skincare & Clinic",
    recommendedPackage: "Barter Produk & Voucher",
    status: "Belum Dihubungi",
    notes: "Saluran alternatif tim promosi Navagreen untuk negosiasi barter voucher facial dan goodie bag kit.",
    specificAngle: "Penyediaan produk skincare trial kit & voucher diskon 50rb untuk 50 peserta kelas konten.",
  },
  {
    id: "sp-11",
    brandName: "Merayu Spa (Official CS Line)",
    contactPerson: "Tim Hotline Merayu Spa",
    phone: "+62 821-3682-0064",
    cleanPhone: "6282136820064",
    category: "Wellness & Spa",
    recommendedPackage: "Barter Produk & Voucher",
    status: "Belum Dihubungi",
    notes: "Hotline resmi Merayu Spa (sesuai dokumen MoU). Saluran direct Account Executive ditangani oleh Kak Nisrina (+62 896-7447-1692).",
    specificAngle: "Voucher relaksasi spa untuk VIP hamper pembicara narasumber dan doorprize penutupan kelas konten.",
  },
];

function cleanBrandForLetter(raw: string): string {
  return raw
    .replace(/\s*\(Line\s*\d+\)/gi, "")
    .replace(/\s*\/\s*Retail/gi, "")
    .replace(/^GKP\s*-\s*/gi, "")
    .replace(/\s*\(Inviz\s*Purwokerto\)/gi, " Purwokerto")
    .trim();
}

/**
 * Format teks outreach WhatsApp resmi, formal korporat, tanpa emotikon / simbol AI slop.
 * Mengikuti tata naskah korespondensi bisnis formal Indonesia.
 */
export function buildSponsorPitchText(lead: SponsorLead, senderName = "Yossika Putra"): string {
  const brand = cleanBrandForLetter(lead.brandName);

  // Susun baris tujuan surat secara formal dan spesifik per entitas mitra
  let addresseeLine: string;
  if (lead.brandName.toLowerCase().includes("inul vista")) {
    addresseeLine = `Yth. Mas Wahyu & Tim Marketing Inul Vista Purwokerto`;
  } else if (lead.brandName.toLowerCase().includes("navagreen")) {
    addresseeLine = `Yth. Pimpinan dan Tim Marketing Navagreen Purwokerto`;
  } else if (lead.brandName.toLowerCase().includes("rita supermall")) {
    addresseeLine = `Yth. Pimpinan dan Tim Promosi Rita Supermall Purwokerto`;
  } else if (lead.brandName.toLowerCase().includes("reta")) {
    addresseeLine = `Yth. Pimpinan dan Tim Sponsorship Reta Beauty Clinic`;
  } else if (lead.brandName.toLowerCase().includes("merayu")) {
    addresseeLine = `Yth. Kak Nisrina Khoirunnisa S & Tim Manajemen Merayu Spa Purbalingga`;
  } else if (lead.brandName.toLowerCase().includes("nuha")) {
    addresseeLine = `Yth. Pimpinan dan Tim Manajemen PT Nuha Cosmetindo`;
  } else {
    addresseeLine = `Yth. Pimpinan dan Tim Manajemen ${brand}`;
  }

  const lines = [
    addresseeLine,
    `di Tempat`,
    ``,
    `Dengan hormat,`,
    ``,
    `Perkenalkan, saya *${senderName}* dari Divisi Strategic Partnership & Marketing Optik I See You.`,
    ``,
    `Sehubungan dengan agenda program pengembangan kreator konten dan sinergi industri kreatif di wilayah Banyumas Raya, Optik I See You akan menyelenggarakan program unggulan:`,
    ``,
    `*"CREATIVE CONTENT MASTERCLASS 2026: Buka Kelas Konten & Digital Brand Collaboration"*`,
    ``,
    `Program ini merupakan masterclass intensif pembuatan konten komersial berkualitas yang menghadirkan narasumber kreator terkemuka, serta diikuti oleh lebih dari 50 kreator konten, influencer lokal, dan pegiat media sosial terpilih di Purwokerto dan sekitarnya.`,
    ``,
    `Sebagai sesama pelaku usaha dan brand di wilayah ini, kami bermaksud mengajak *${brand}* berkolaborasi melalui kemitraan strategis Business-to-Business (B2B), baik melalui aktivasi event maupun sinergi promosi silang antar-gerai (store-to-store).`,
    ``,
    `Bentuk fasilitas dan sinergi promosi yang kami tawarkan meliputi:`,
    `1. Skema Barter Voucher (Cross-Voucher): Penyertaan voucher diskon / treatment ${brand} ke dalam Official Goodie Bag 50 peserta kreator, disertai penukaran voucher belanja kacamata Optik I See You untuk pelanggan ${brand}.`,
    `2. Display Meja Kasir 4 Cabang (Cross-Display): Penempatan brosur, flyer, atau tent card promosi ${brand} di area meja kasir 4 gerai cabang ritel kami (Purwokerto, Purbalingga, Cilacap, dan Wonosobo).`,
    `3. Penayangan Video Profil di TV Showroom: Penayangan video profil / iklan komersial ${brand} pada layar TV Showroom di 4 cabang ritel Optik I See You.`,
    `4. Open Booth & Direct Sampling: Penyediaan space promosi, mini booth pameran, atau konsultasi produk langsung di lokasi acara.`,
    `5. Publikasi Multi-Platform: Pencantuman logo resmi pada backdrop panggung, photowall, materi publikasi cetak, serta publikasi digital melalui media sosial @iseeyou.glasses (244.000+ followers).`,
    ``,
    `Rekomendasi Skema Kemitraan: *Paket ${lead.recommendedPackage}*`,
    lead.specificAngle ? `Catatan Fokus Kerjasama: ${lead.specificAngle}` : ``,
    ``,
    `Proposal Resmi & Rincian Fasilitas Lengkap dapat diakses melalui tautan berikut:`,
    `https://iseeyou-marketing-intelligence.vercel.app/proposal-sponsor`,
    ``,
    `Apabila Bapak/Ibu berkenan, kami siap untuk berdiskusi lebih lanjut via WhatsApp atau menjadwalkan audiensi singkat guna membahas teknis sinergi ini.`,
    ``,
    `Demikian penawaran kerjasama ini kami sampaikan. Atas perhatian dan kesediaan Bapak/Ibu, kami ucapkan terima kasih.`,
    ``,
    `Hormat kami,`,
    `*${senderName}*`,
    `Divisi Strategic Partnership & Marketing`,
    `Optik I See You`,
    `Kontak WhatsApp: 0877-7868-3766`,
    `Situs Resmi: optikiseeyou.com`,
  ];

  return lines.filter((l): l is string => typeof l === "string").join("\n");
}


/**
 * Format teks penjajakan awal kemitraan B2B: Barter Voucher & Cross-Display Meja Kasir.
 * Menawarkan alokasi 50 lembar voucher kacamata per bulan dari Optik I See You dan
 * menanyakan kebutuhan kuota serta skema voucher dari pihak mitra secara profesional.
 */
export function buildB2BVoucherPitchText(lead: SponsorLead, senderName = "Yossika Putra"): string {
  const brand = cleanBrandForLetter(lead.brandName);

  // Penanganan khusus untuk Merayu Spa yang sudah memiliki MoU aktif
  if (lead.brandName.toLowerCase().includes("merayu") && !lead.brandName.toLowerCase().includes("official cs")) {
    return [
      `Yth. Kak Nisrina Khoirunnisa S`,
      `Account Executive Merayu Spa Purbalingga`,
      `di Tempat`,
      ``,
      `Dengan hormat,`,
      ``,
      `Perkenalkan, saya *${senderName}* dari Divisi Strategic Partnership & Marketing Optik I See You. Semoga Kak Nisrina dan segenap tim Merayu Spa senantiasa sehat dan sukses dalam beraktivitas.`,
      ``,
      `Melanjutkan kesepakatan kemitraan barter voucher yang telah terjalin aktif antara Merayu Spa dan I See You Purbalingga (MoU periode 6 Oktober 2026 s/d 6 Januari 2027), kami ingin berkoordinasi terkait realisasi dan ketersediaan alokasi voucher.`,
      ``,
      `Dari pihak Optik I See You, kami memiliki alokasi standar *50 lembar voucher belanja/pemeriksaan kacamata per bulan* untuk dibagikan secara eksklusif kepada customer loyal Merayu Spa.`,
      ``,
      `Sehubungan dengan hal tersebut, kami ingin mengonfirmasi dua hal teknis:`,
      `1. Berapa kuota voucher Merayu Spa (nominal Rp 120.000,-) yang dapat kami distribusikan kepada customer kami di gerai I See You untuk alokasi bulan ini?`,
      `2. Apakah materi promosi berupa flyer/tent card Merayu Spa sudah siap untuk kami display di meja kasir gerai kami, dan sebaliknya untuk materi promosi Optik I See You di meja kasir Merayu Spa?`,
      ``,
      `Selain itu, dalam waktu dekat Optik I See You juga sedang menyiapkan agenda kolaborasi event kreatif di Banyumas Raya yang nantinya akan kami koordinasikan lebih lanjut setelah proposal difiksasi.`,
      ``,
      `Apabila Kak Nisrina berkenan, kita dapat berdiskusi singkat via WhatsApp untuk menyelaraskan teknis alokasi voucher ini.`,
      ``,
      `Atas perhatian dan kerja sama baik yang terjalin, kami ucapkan terima kasih.`,
      ``,
      `Hormat kami,`,
      `*${senderName}*`,
      `Divisi Strategic Partnership & Marketing`,
      `Optik I See You`,
      `Kontak WhatsApp: 0877-7868-3766`,
      `Situs Resmi: optikiseeyou.com`,
    ].join("\n");
  }

  // Brand mitra umum baru
  let addresseeLine: string;
  if (lead.brandName.toLowerCase().includes("inul vista")) {
    addresseeLine = `Yth. Mas Wahyu & Tim Marketing Inul Vista Purwokerto`;
  } else if (lead.brandName.toLowerCase().includes("navagreen")) {
    addresseeLine = `Yth. Pimpinan dan Tim Marketing Navagreen Purwokerto`;
  } else if (lead.brandName.toLowerCase().includes("rita supermall")) {
    addresseeLine = `Yth. Pimpinan dan Tim Promosi Rita Supermall Purwokerto`;
  } else if (lead.brandName.toLowerCase().includes("reta")) {
    addresseeLine = `Yth. Pimpinan dan Tim Sponsorship Reta Beauty Clinic`;
  } else if (lead.brandName.toLowerCase().includes("nuha")) {
    addresseeLine = `Yth. Pimpinan dan Tim Manajemen PT Nuha Cosmetindo`;
  } else if (lead.brandName.toLowerCase().includes("padel")) {
    addresseeLine = `Yth. Pimpinan dan Tim Manajemen Rita Padel Club`;
  } else if (lead.brandName.toLowerCase().includes("taylor")) {
    addresseeLine = `Yth. Pimpinan dan Tim Manajemen Taylor De Virdis`;
  } else {
    addresseeLine = `Yth. Pimpinan dan Tim Manajemen ${brand}`;
  }

  return [
    addresseeLine,
    `di Tempat`,
    ``,
    `Dengan hormat,`,
    ``,
    `Perkenalkan, saya *${senderName}* dari Divisi Strategic Partnership & Marketing Optik I See You.`,
    ``,
    `Optik I See You merupakan jaringan ritel kacamata & layanan pemeriksaan refraksi terpadu dengan 4 cabang operasional di Purwokerto (Pusat), Purbalingga, Cilacap, dan Wonosobo, serta komunitas audiens media sosial lebih dari 244.000 pengikut.`,
    ``,
    `Saat ini kami sedang menginisiasi program *B2B Customer Privilege & Store-to-Store Cross Promotion*, yaitu kolaborasi kemitraan strategis saling bertukar benefit loyalitas pelanggan antar-brand ritel di wilayah Banyumas Raya dan sekitarnya.`,
    ``,
    `Melalui program kemitraan ini:`,
    `• Dari pihak Optik I See You siap mengalokasikan *50 lembar voucher belanja/pemeriksaan kacamata per bulan* untuk dibagikan secara eksklusif sebagai nilai tambah (loyalty reward) bagi customer ${brand}.`,
    `• Saling menempatkan media promosi (display flyer / brosur / tent card) di meja kasir gerai masing-masing guna meningkatkan traffic pengunjung baru (store traffic) kedua belah pihak.`,
    ``,
    `Sehubungan dengan penjajakan kerja sama ini, kami ingin menanyakan secara singkat:`,
    `1. Apakah pihak *${brand}* terbuka untuk program sinergi barter voucher dan cross-display meja kasir ini?`,
    `2. Berapa estimasi kuota kebutuhan voucher per bulan yang ideal dari pihak *${brand}* yang dapat diserap/didistribusikan kepada customer Bapak/Ibu?`,
    `3. Bagaimana ketentuan atau skema voucher promosi yang saat ini biasa berjalan di pihak *${brand}*?`,
    ``,
    `Program ini murni skema kemitraan barter sinergi tanpa dikenakan biaya administrasi apa pun. Kami siap menyiapkan draf kesepakatan kerja sama (MoU ringkas) setelah format dan kuota voucher disepakati bersama.`,
    ``,
    `Dokumen Proposal Kemitraan Merchant B2B resmi dapat ditinjau melalui tautan:`,
    `https://iseeyou-marketing-intelligence.vercel.app/proposal-merchant`,
    ``,
    `Apabila Bapak/Ibu berkenan, kami sangat terbuka untuk berdiskusi santai sejenak via WhatsApp guna membahas teknis kolaborasi ini.`,
    ``,
    `Demikian penyampaian penjajakan kemitraan B2B ini kami sampaikan. Atas perhatian dan kesempatan yang diberikan, kami ucapkan terima kasih.`,
    ``,
    `Hormat kami,`,
    `*${senderName}*`,
    `Divisi Strategic Partnership & Marketing`,
    `Optik I See You`,
    `Kontak WhatsApp: 0877-7868-3766`,
    `Situs Resmi: optikiseeyou.com`,
  ].join("\n");
}

export function buildWhatsAppLink(cleanPhone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
