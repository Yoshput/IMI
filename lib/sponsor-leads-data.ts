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
    contactPerson: "Tim PIC Baby Glows",
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
    contactPerson: "PIC Nuha Cosmetindo",
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
    contactPerson: "Tim Taylor De Virdis",
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
    brandName: "B2B Clinic",
    contactPerson: "PIC Marketing B2B Clinic",
    phone: "+62 896-7447-1692",
    cleanPhone: "6289674471692",
    category: "Skincare & Clinic",
    recommendedPackage: "Gold (Rp 3.000.000)",
    status: "Belum Dihubungi",
    notes: "Klinik estetika & perawatan kulit modern. Demografi usia 18-35 tahun aktif berkonten.",
    specificAngle: "Penempatan stand konsultasi estetika mini di venue event & voucher diskon treatment untuk seluruh peserta.",
  },
  {
    id: "sp-06",
    brandName: "Navagreen Purwokerto (Line 1)",
    contactPerson: "Customer Relations & Marketing Navagreen",
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
    contactPerson: "PIC Sponsorship Reta Clinic",
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
    contactPerson: "Admin & Marketing Rita Padel Club",
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
    contactPerson: "PIC Partnership Rita Group",
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
    contactPerson: "PIC Promosi & Event Navagreen",
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
    brandName: "Merayu Spa",
    contactPerson: "Manajemen Merayu Spa",
    phone: "+62 821-3682-0064",
    cleanPhone: "6282136820064",
    category: "Wellness & Spa",
    recommendedPackage: "Barter Produk & Voucher",
    status: "Belum Dihubungi",
    notes: "Boutique spa & relaksasi premium Purwokerto. Sangat digemari kreator konten untuk self-care.",
    specificAngle: "Voucher relaksasi spa untuk VIP hamper pembicara narasumber dan doorprize penutupan kelas konten.",
  },
];

/**
 * Format prompt WhatsApp yang sopan, profesional, dan mengkonsepkan event "Buka Kelas Konten"
 */
export function buildSponsorPitchText(lead: SponsorLead, senderName = "Yoshput"): string {
  const lines = [
    `Halo Selamat Pagi/Siang Kak ${lead.contactPerson || "Tim Marketing"} ${lead.brandName},`,
    ``,
    `Salam hangat dari Optik I See You 🙏✨`,
    `Perkenalkan saya *${senderName}* dari Divisi Marketing & Strategic Partnership Optik I See You.`,
    ``,
    `Kami menghubungi Kakak karena melihat *${lead.brandName}* memiliki profil dan target audiens yang sangat selaras dengan segmen anak muda, mahasiswa, profesional, dan kreator konten aktif di Purwokerto dan jaringan 4 cabang kami.`,
    ``,
    `Dalam waktu dekat ini, Optik I See You akan menyelenggarakan event edukatif & kreatif:`,
    `🎯 *"BUKA CLASS KONTEN: Creative Content Masterclass"*`,
    `Sebuah pelatihan intensif pembuatan konten visual & video bersama pembicara/kreator inspiratif, yang akan diikuti oleh 50+ kreator konten pilihan, influencer lokal, dan pegiat media sosial.`,
    ``,
    `Sehubungan dengan agenda tersebut, kami ingin mengundang *${lead.brandName}* untuk berkolaborasi sebagai Official Sponsor / Brand Partner, dengan benefit eksposur multi-channel:`,
    `1. 🎪 *Open Booth & Direct Activation:* Space pameran produk/konsultasi langsung di lokasi acara.`,
    `2. 📺 *Retail Showroom Exposure:* Penayangan video iklan/profil ${lead.brandName} di layar TV 4 cabang ritel Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo).`,
    `3. 🛍️ *Goodie Bag Integration:* Penyisipan sampling produk, tester, atau voucher diskon ${lead.brandName} ke dalam goodie bag resmi seluruh peserta & narasumber.`,
    `4. 📸 *Social Media Amplification:* Publikasi logo di seluruh aset promosi digital, backdrop panggung, serta mention story dari jaringan akun @iseeyou.glasses (244.000+ followers).`,
    ``,
    `💡 *Skema Kolaborasi yang Direkomendasikan:* Paket *${lead.recommendedPackage}*`,
    lead.specificAngle ? `*(Fokus khusus: ${lead.specificAngle})*` : ``,
    ``,
    `📄 *Dokumen Proposal Resmi & Kerjasama Lengkap:*`,
    `Telah kami siapkan secara detail dan dapat diakses melalui portal resmi kami:`,
    `🔗 https://iseeyou-marketing-intelligence.vercel.app/proposal-sponsor`,
    ``,
    `Kira-kira apakah ada waktu luang hari ini atau besok untuk kami follow-up singkat via WhatsApp atau telepon terkait potensi sinergi ini, Kak?`,
    ``,
    `Terima kasih banyak atas perhatian dan waktu Kakak. Sukses selalu untuk ${lead.brandName}! 🙏😊`,
    ``,
    `Hormat kami,`,
    `*${senderName}* · Divisi Marketing & Event`,
    `Optik I See You & Lunar Eyewear`,
    `WhatsApp: 0877-7868-3766`,
    `Website: optikiseeyou.com`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppLink(cleanPhone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
