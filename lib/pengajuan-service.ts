// Shared interfaces, helpers, and config for Pengajuan Sponsor & Home Service

export interface SponsorSubmissionItem {
  id: string;
  createdAt: string;
  applicantName: string;
  institution: string;
  applicantPhone: string;
  targetBranch: string;
  eventName: string;
  eventDate: string;
  description: string;
  targetAudience: number;
  proposalUrl: string;
  offeredBenefits: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  notes?: string;
}

// Marketing staff Yoshput WA phone number
export const MARKETING_STAFF_PHONE = "087778683766";

/**
 * Format direct WhatsApp template text for Mas Yoshput (Marketing Staff)
 */
export function buildSponsorWhatsAppMessage(item: {
  applicantName: string;
  institution: string;
  eventName: string;
  targetAudience: number | string;
  targetBranch: string;
  eventDate?: string;
  description: string;
  proposalUrl?: string;
  offeredBenefits?: string;
}): string {
  const lines = [
    `Halo Mas Yoshput / Tim Marketing Optik I See You,`,
    ``,
    `Perkenalkan saya *${(item.applicantName || "Pemohon").trim()}* dari *${(item.institution || "Panitia Acara").trim()}*.`,
    `Kami bermaksud mengajukan penawaran proposal kerja sama sponsorship melalui web portal optikiseeyou.com:`,
    ``,
    `- *Nama Kegiatan:* ${item.eventName || "-"}`,
    `- *Target Peserta/Audiens:* ${item.targetAudience || "100+"} orang`,
    `- *Target Cabang:* Optik I See You Cabang ${item.targetBranch || "Purwokerto"}`,
    `- *Tanggal Pelaksanaan:* ${item.eventDate || "Sesuai proposal"}`,
    ``,
    `*Resume Ringkas Kegiatan:*`,
    `"${(item.description || "-").trim()}"`,
    ``,
    item.offeredBenefits ? `*Benefit untuk Optik I See You:*\n"${item.offeredBenefits.trim()}"\n` : "",
    item.proposalUrl ? `*Link Proposal:*\n${item.proposalUrl.trim()}\n` : "",
    `Besar harapan kami untuk dapat berkolaborasi bersama Optik I See You. Mohon kesediaan Mas Yoshput untuk meninjau penawaran ini.`,
    ``,
    `Terima kasih.`,
  ];

  return lines.filter((l): l is string => typeof l === "string").join("\n");
}

/**
 * Format outbound pitching template for Marketing Staff (Yoshput) reaching out to external brands
 */
export function buildBrandPitchWhatsAppMessage(params: {
  brandName: string;
  picName: string;
  category: string;
  recommendedPackage: string;
}): string {
  const brand = params.brandName || "Mitra Brand";
  const lines = [
    `Yth. Pimpinan dan Tim Manajemen ${brand},`,
    params.picName ? `U.p. ${params.picName}` : "",
    `di Tempat`,
    ``,
    `Dengan hormat,`,
    ``,
    `Perkenalkan, saya *Yoshput* dari Divisi Strategic Partnership & Marketing Optik I See You.`,
    ``,
    `Sebagai sesama pelaku usaha dan brand di wilayah ini, kami bermaksud mengajak *${brand}* berkolaborasi melalui kemitraan strategis Business-to-Business (B2B) dalam program unggulan kami:`,
    ``,
    `*"CREATIVE CONTENT MASTERCLASS 2026: Buka Kelas Konten & Digital Brand Collaboration"*`,
    ``,
    `Program ini merupakan masterclass intensif pembuatan konten komersial berkualitas yang menghadirkan narasumber kreator terkemuka, serta diikuti oleh 50+ kreator konten dan pegiat media sosial di Purwokerto dan sekitarnya.`,
    ``,
    `Peluang eksposur dan sinergi kemitraan B2B yang kami sediakan meliputi:`,
    `1. Skema Barter Voucher (Cross-Voucher): Penyertaan voucher diskon / promo ${brand} ke Goodie Bag 50 kreator, disertai penyediaan voucher belanja kacamata untuk pelanggan ${brand}.`,
    `2. Display Meja Kasir 4 Cabang (Cross-Display): Penempatan materi brosur/flyer ${brand} di kasir 4 gerai cabang ritel Optik I See You.`,
    `3. Penayangan video profil / iklan komersial pada layar TV Showroom di 4 cabang ritel Optik I See You.`,
    `4. Space Open Booth / Interactive Activation dan sampling produk langsung di lokasi acara.`,
    `5. Promosi digital terintegrasi di media sosial resmi (@iseeyou.glasses) dengan total 244.000+ pengikut.`,
    ``,
    `Paket rekomendasi untuk ${brand}: *Paket ${params.recommendedPackage}*`,
    ``,
    `Proposal Resmi & Rincian Fasilitas Lengkap dapat diakses melalui:`,
    `https://iseeyou-marketing-intelligence.vercel.app/proposal-sponsor`,
    ``,
    `Besar harapan kami untuk dapat menjadwalkan diskusi singkat via WhatsApp guna membahas bentuk sinergi yang paling optimal.`,
    ``,
    `Demikian penawaran ini kami sampaikan. Atas perhatian dan kesediaan Bapak/Ibu, kami ucapkan terima kasih.`,
    ``,
    `Hormat kami,`,
    `*Yoshput*`,
    `Divisi Strategic Partnership & Marketing`,
    `Optik I See You & Lunar Eyewear`,
    `Kontak WhatsApp: 0877-7868-3766`,
    `Situs Resmi: optikiseeyou.com`,
  ];
  return lines.filter((l): l is string => typeof l === "string").join("\n");
}

export function buildSponsorWhatsAppUrl(item: {
  applicantName: string;
  institution: string;
  eventName: string;
  targetAudience: number | string;
  targetBranch: string;
  eventDate?: string;
  description: string;
  proposalUrl?: string;
  offeredBenefits?: string;
}): string {
  const text = buildSponsorWhatsAppMessage(item);
  const cleanPhone = "62" + MARKETING_STAFF_PHONE.replace(/^0/, "").replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export interface HomeServiceSubmissionItem {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  targetBranch: string;
  branchKey: "pwt" | "pbg" | "clp" | "wns";
  csPhone: string;
  serviceDate: string;
  serviceTime: string;
  address: string;
  participantCount: number;
  complaint: string;
  status: "pending" | "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export const BRANCH_CS_CONFIG: Record<
  "pwt" | "pbg" | "clp" | "wns",
  { name: string; csPhone: string; city: string; label: string }
> = {
  pwt: {
    name: "Optik I See You — Purwokerto (Pusat)",
    csPhone: "081228678088",
    city: "Purwokerto",
    label: "Purwokerto (Pusat)",
  },
  pbg: {
    name: "Optik I See You — Purbalingga",
    csPhone: "081390494490",
    city: "Purbalingga",
    label: "Purbalingga",
  },
  clp: {
    name: "Optik I See You — Cilacap",
    csPhone: "085227771788",
    city: "Cilacap",
    label: "Cilacap",
  },
  wns: {
    name: "Optik I See You — Wonosobo",
    csPhone: "081329299908",
    city: "Wonosobo",
    label: "Wonosobo",
  },
};

/**
 * Format direct WhatsApp template text for Customer Service per Branch
 */
export function buildHomeServiceWhatsAppMessage(item: {
  customerName: string;
  targetBranch: string;
  serviceDate: string;
  serviceTime: string;
  address: string;
  participantCount: number | string;
  complaint?: string;
}): string {
  const lines = [
    `Halo Customer Service ${item.targetBranch},`,
    ``,
    `Saya ingin melakukan *Pemesanan Jadwal Layanan Home Service* (Pemeriksaan Mata & Fitting Frame ke Lokasi) melalui portal optikiseeyou.com:`,
    ``,
    `- *Nama Klien:* ${(item.customerName || "-").trim()}`,
    `- *Rencana Jadwal:* ${item.serviceDate || "-"} pukul ${item.serviceTime || "10:00"} WIB`,
    `- *Alamat / Lokasi Kunjungan:* "${(item.address || "-").trim()}"`,
    `- *Jumlah Peserta Pemeriksaan:* ${item.participantCount || 1} orang`,
    item.complaint ? `- *Keluhan / Kebutuhan Mata:*\n"${item.complaint.trim()}"\n` : "",
    `Mohon konfirmasi ketersediaan slot jadwal tim Refraksionis Optisi (RO) yang bertugas. Terima kasih.`,
  ];

  return lines.filter((l): l is string => typeof l === "string").join("\n");
}

export function buildHomeServiceWhatsAppUrl(
  branchKey: "pwt" | "pbg" | "clp" | "wns",
  item: {
    customerName: string;
    targetBranch: string;
    serviceDate: string;
    serviceTime: string;
    address: string;
    participantCount: number | string;
    complaint?: string;
  }
): string {
  const cfg = BRANCH_CS_CONFIG[branchKey] || BRANCH_CS_CONFIG.pwt;
  const cleanPhone = "62" + cfg.csPhone.replace(/^0/, "").replace(/[^0-9]/g, "");
  const text = buildHomeServiceWhatsAppMessage(item);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
