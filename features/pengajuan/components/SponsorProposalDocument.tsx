"use client";

import React, { useEffect, useState } from "react";
import { Download, RotateCcw, PencilLine, Info } from "lucide-react";

export interface ProposalFollowerRow {
  account: string;
  label: string;
  igFollowers: number;
  tiktokFollowers: number;
  asOf: string | null;
  isSecondBrand?: boolean;
}

interface Props {
  followers: ProposalFollowerRow[];
  sourceUrl: string;
}

interface EditableFields {
  recipientCompany: string;
  recipientName: string;
  letterDate: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  participants: string;
}

const PLACEHOLDER = "Akan dikonfirmasi";

const DEFAULT_FIELDS: EditableFields = {
  recipientCompany: "[Nama Perusahaan / Brand]",
  recipientName: "Brand Manager / Marketing Manager",
  letterDate: "Oktober 2026",
  eventDate: PLACEHOLDER,
  eventTime: PLACEHOLDER,
  venue: PLACEHOLDER,
  participants: PLACEHOLDER,
};

const STORAGE_KEY = "isy-proposal-sponsor-fields-v2";

// =====================================================================
// STRICT 2-TONE PALETTE: HIJAU EMERALD & PUTIH IVORY
// =====================================================================
const C = {
  emeraldDark: "#064E3B",   // Emerald Tua / Utama (Header, Judul, Border Kuat)
  emerald: "#047857",       // Emerald Sedang (Aksen, Tombol, Ceklis)
  emeraldMid: "#059669",    // Emerald Cerah
  emeraldLight: "#ECFDF5",  // Tint Emerald Halus
  emeraldBorder: "#10B981", // Garis Tepi Emerald
  ivory: "#FDFBF7",         // Putih Ivory Kertas Utama
  ivoryLight: "#FFFFFF",    // Putih Bersih Permukaan Kartu
  ivoryMuted: "#F4F1EA",    // Putih Ivory Aksen Garis & Tabel
  ivoryBorder: "#E2DDD2",   // Border Halus Ivory
  textTitle: "#064E3B",     // Warna Judul & Subjudul (Emerald Tegas)
  textBody: "#111827",      // Teks Isi Hitam Arang Berkontras Tinggi
  textMuted: "#4B5563",     // Teks Keterangan Abu Gelap
};

const fmt = (n: number) => n.toLocaleString("id-ID");

const fmtDate = (iso: string | null) => {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
};

/* ------------------------------------------------------------------ */
/* Packages                                                            */
/* ------------------------------------------------------------------ */

type Cell = string | boolean;

const MATRIX: { group?: string; label: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { group: "Aktivasi di Lokasi Event", label: "Open Stand / Interactive Booth", cells: ["Eksklusif", false, false, false] },
  { label: "Sesi Presentasi / Demo Produk (15 menit)", cells: [true, false, false, false] },
  { label: "Bagi Sample / Voucher langsung ke peserta", cells: [true, false, false, false] },
  { label: "Ad-Lips oleh MC", cells: ["10x", "5x", false, false] },
  { group: "TV Showroom 4 Cabang", label: "Durasi tayang", cells: ["1 Bulan", "2 Minggu", "1 Minggu", false] },
  { label: "Format tayang", cells: ["Video", "Video", "Poster", false] },
  { group: "Branding Logo", label: "Backdrop utama", cells: ["Large", "Medium", false, false] },
  { label: "Banner event", cells: ["Large", "Medium", "Standard", "Small"] },
  { label: "Frame Photobooth (digital & cetak)", cells: ["Large", "Medium", false, false] },
  { label: "Web campaign & flyer digital", cells: [true, true, true, false] },
  { group: "Distribusi Materi", label: "Voucher / flyer di Goodie Bag", cells: [true, true, true, false] },
  { label: "Display voucher di kasir 4 cabang", cells: [false, true, false, false] },
  { label: "Flyer di area registrasi", cells: [false, false, false, true] },
  { label: "Menyediakan Goodie Bag / Gift / Doorprize", cells: [false, false, false, true] },
  { group: "Media Sosial", label: "Dedicated Post (Feed & Reels)", cells: [true, false, false, false] },
  { label: "Joint Feed Post", cells: [false, true, false, false] },
  { label: "Mention & Tag di Story", cells: [true, true, true, false] },
  { label: "Story Sponsor Appreciation", cells: [false, false, false, true] },
];

const PACKAGES = [
  {
    name: "DIAMOND",
    tag: "Tier Utama / Eksklusif",
    price: "Rp 5.000.000",
    color: C.emeraldDark,
    items: [
      "Hak eksklusif space Open Stand / Interactive Booth di area event Buka Class Konten.",
      "Penayangan Video Profil / Iklan Produk di Layar TV Showroom 4 cabang Optik I See You selama 1 bulan penuh.",
      "Logo ukuran Utama (Large) pada Backdrop Utama, Banner Event, Frame Photobooth Digital & Cetak, serta Web Campaign.",
      "Slot Sesi Presentasi Eksklusif / Demo Produk selama 15 menit saat acara berlangsung.",
      "Hak membagikan Sample Produk / Voucher fisik langsung ke seluruh peserta.",
      "Ad-Lips oleh MC sebanyak 10x selama acara.",
      "Dedicated Post (Feed & Reels) di media sosial resmi Optik I See You.",
    ],
  },
  {
    name: "PLATINUM",
    tag: "Eksposur Ritel & Digital",
    price: "Rp 3.000.000",
    color: C.emerald,
    items: [
      "Penayangan Video Profil / Iklan Produk di Layar TV Showroom 4 cabang selama 2 minggu.",
      "Logo ukuran Sedang (Medium) pada Backdrop, Banner, Frame Photobooth, dan media promosi.",
      "Display Voucher / Flyer Produk di area kasir 4 cabang Optik I See You.",
      "Hak menyertakan Voucher / Sample Produk dalam Goodie Bag peserta.",
      "Ad-Lips oleh MC sebanyak 5x.",
      "Joint Feed Post di Instagram Optik I See You.",
    ],
  },
  {
    name: "GOLD",
    tag: "Visibilitas Event & Digital",
    price: "Rp 1.500.000",
    color: C.emeraldMid,
    items: [
      "Logo ukuran Standard pada Banner Event & Flyer Digital media sosial.",
      "Penayangan Slide Poster / Image Banner di TV Showroom 4 cabang selama 1 minggu.",
      "Penyebaran Voucher Promo / Flyer dalam Goodie Bag peserta.",
      "Mention & Tag di Story media sosial resmi Optik I See You.",
    ],
  },
  {
    name: "SILVER",
    tag: "In-Kind / Produk & Voucher",
    price: "In-Kind",
    color: "#0F766E",
    items: [
      "Menyediakan Goodie Bag, Voucher Diskon, Gift Set, atau Product Sampling untuk peserta / doorprize.",
      "Logo ukuran Small pada Banner Kolektif Sponsor.",
      "Digital Story Sponsor Appreciation di Instagram Optik I See You.",
      "Penyebaran flyer / voucher di area registrasi event.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

const Page: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <section
    className={`proposal-page relative mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-xl print:shadow-none overflow-hidden ${className}`}
    style={{ backgroundColor: C.ivory, color: C.textBody, ...style }}
  >
    {children}
  </section>
);

const PageHeader: React.FC<{ no: string; title: string }> = ({ no, title }) => (
  <div className="flex items-end justify-between gap-4 pb-3 mb-6 border-b-2" style={{ borderColor: C.emeraldDark }}>
    <div>
      <div className="text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: C.emerald }}>
        Bagian {no}
      </div>
      <h2 className="text-[22px] font-black leading-tight tracking-tight mt-0.5" style={{ color: C.textTitle }}>
        {title}
      </h2>
    </div>
    <div className="text-right text-[10px] font-bold uppercase tracking-widest" style={{ color: C.emeraldDark }}>
      Optik I See You
      <br />
      <span className="text-[9px] font-semibold text-emerald-700">Buka Class Konten</span>
    </div>
  </div>
);

const PageFooter: React.FC<{ page: number }> = ({ page }) => (
  <div
    className="absolute bottom-0 left-0 right-0 px-[18mm] py-3 flex items-center justify-between text-[9px] font-semibold"
    style={{ backgroundColor: C.emeraldDark, color: C.ivory }}
  >
    <span>Proposal Sponsorship · Buka Class Konten · Optik I See You</span>
    <span style={{ color: C.emeraldLight }}>optikiseeyou.com · Hal. {page}</span>
  </div>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-[18mm] pt-[16mm] pb-[22mm] text-[11.5px] leading-[1.65]" style={{ color: C.textBody }}>
    {children}
  </div>
);

const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-[13px] font-black uppercase tracking-wide mt-5 mb-2 flex items-center gap-2" style={{ color: C.emeraldDark }}>
    <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: C.emerald }} />
    <span>{children}</span>
  </h3>
);

const Bullets: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((it, i) => (
      <li key={i} className="flex gap-2.5 items-start">
        <span className="mt-[6px] w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: C.emerald }} />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const renderCell = (c: Cell) => {
  if (c === true) return <span style={{ color: C.emerald }} className="font-extrabold text-[13px]">✓</span>;
  if (c === false) return <span className="text-neutral-300 font-bold">—</span>;
  return <span className="font-black text-[11px]" style={{ color: C.emeraldDark }}>{c}</span>;
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export const SponsorProposalDocument: React.FC<Props> = ({ followers, sourceUrl }) => {
  const [f, setF] = useState<EditableFields>(DEFAULT_FIELDS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setF({ ...DEFAULT_FIELDS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
    } catch {
      /* ignore */
    }
  }, [f, loaded]);

  const update = (k: keyof EditableFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const totalIg = followers.reduce((s, r) => s + r.igFollowers, 0);
  const totalTt = followers.reduce((s, r) => s + r.tiktokFollowers, 0);
  const totalAll = totalIg + totalTt;
  const latestAsOf = followers
    .map((r) => r.asOf)
    .filter(Boolean)
    .sort()
    .pop() as string | undefined;

  const pending = (v: string) => v.trim() === "" || v === PLACEHOLDER;
  const pendingCount = [f.eventDate, f.eventTime, f.venue, f.participants].filter(pending).length +
    (f.recipientCompany.startsWith("[") ? 1 : 0);

  const Val: React.FC<{ v: string }> = ({ v }) =>
    pending(v) ? (
      <span className="italic font-bold" style={{ color: C.emerald }}>
        {PLACEHOLDER}
      </span>
    ) : (
      <span className="font-bold text-gray-950">{v}</span>
    );

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#047857]/40";

  return (
    <div className="space-y-6">
      {/* ===================== Control panel (not printed) ===================== */}
      <div className="no-print rounded-2xl border border-border bg-surface p-5 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black text-foreground flex items-center gap-2">
              <PencilLine className="w-5 h-5 text-emerald-700" />
              Proposal Sponsorship · Buka Class Konten
            </h1>
            <p className="text-xs text-foreground-secondary mt-1">
              Dokumen resmi standar <b>Hijau Emerald &amp; Putih Ivory</b>. Isi parameter di bawah, dokumen langsung ter-update secara real-time. Klik <b>Download PDF</b> lalu pilih &quot;Save as PDF&quot; (Ukuran A4).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setF(DEFAULT_FIELDS)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-surface-secondary text-xs font-semibold text-foreground hover:bg-surface-secondary/70 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white shadow-subtle active:scale-95 transition-all"
              style={{ backgroundColor: C.emeraldDark }}
            >
              <Download className="w-3.5 h-3.5" /> Download PDF (A4)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="space-y-1">
            <span className="text-[11px] font-bold text-foreground-secondary">Nama Brand / Perusahaan Tujuan</span>
            <input className={inputCls} value={f.recipientCompany} onChange={update("recipientCompany")} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-bold text-foreground-secondary">Ditujukan kepada (jabatan)</span>
            <input className={inputCls} value={f.recipientName} onChange={update("recipientName")} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-bold text-foreground-secondary">Tanggal Surat</span>
            <input className={inputCls} value={f.letterDate} onChange={update("letterDate")} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-bold text-foreground-secondary">Tanggal Event</span>
            <input className={inputCls} placeholder="cth: Sabtu, 14 November 2026" value={f.eventDate} onChange={update("eventDate")} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-bold text-foreground-secondary">Waktu Event</span>
            <input className={inputCls} placeholder="cth: 09.00 – 15.00 WIB" value={f.eventTime} onChange={update("eventTime")} />
          </label>
          <label className="space-y-1 lg:col-span-2">
            <span className="text-[11px] font-bold text-foreground-secondary">Lokasi / Venue</span>
            <input className={inputCls} placeholder="cth: Optik I See You Purwokerto (Pusat)" value={f.venue} onChange={update("venue")} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-bold text-foreground-secondary">Target Jumlah Peserta</span>
            <input className={inputCls} placeholder="cth: 50 orang" value={f.participants} onChange={update("participants")} />
          </label>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-start gap-2 text-xs rounded-xl px-3 py-2 border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-700" />
            <span>
              Terdapat <b>{pendingCount} field</b> yang masih default. Pada cetakan dokumen akan bertuliskan &quot;{PLACEHOLDER}&quot; secara profesional tanpa data fiktif.
            </span>
          </div>
        )}
      </div>

      {/* ===================== Document Pages ===================== */}
      <div className="proposal-doc space-y-8 print:space-y-0 overflow-x-auto pb-4">
        {/* ---------- 1. COVER ---------- */}
        <Page style={{ backgroundColor: C.emeraldDark, color: C.ivory }}>
          <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: C.emerald }} />
          <div className="absolute top-3 left-0 right-0 h-1" style={{ backgroundColor: C.emeraldBorder }} />
          <div
            className="absolute -right-24 top-40 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: C.ivory }}
          />
          <div
            className="absolute -left-16 bottom-32 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: C.emeraldLight }}
          />

          <div className="relative px-[20mm] pt-[30mm] pb-[20mm] flex flex-col min-h-[297mm]">
            <div className="text-[11px] font-black tracking-[0.35em] uppercase text-emerald-300">
              Optik I See You · Marketing Department
            </div>

            <div className="mt-[36mm]">
              <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-emerald-200">
                Proposal Pengajuan Kerjasama
              </div>
              <h1 className="mt-2 text-[34px] font-black leading-[1.1] tracking-tight text-white">
                SPONSORSHIP &amp;
                <br />
                KERJASAMA MITRA
                <br />
                STRATEGIS
              </h1>
              <div className="mt-6 h-1 w-24 bg-emerald-400" />
              <div className="mt-6 text-[26px] font-black text-emerald-200">
                &quot;Buka Class Konten&quot;
              </div>
              <div className="mt-1 text-[13px] font-semibold text-emerald-100 leading-relaxed">
                Kelas Konten &amp; Digital Creator Masterclass
                <br />
                Optik I See You Marketing Intelligence &amp; Creator Initiative
              </div>
            </div>

            <div className="mt-auto space-y-6">
              <div className="rounded-xl p-5 border border-emerald-600/60 bg-emerald-950/70 backdrop-blur-sm">
                <div className="text-[10px] font-black tracking-[0.25em] uppercase text-emerald-300">
                  Ditujukan kepada
                </div>
                <div className="mt-1 text-[18px] font-black text-white">{f.recipientCompany}</div>
                <div className="text-[11.5px] text-emerald-200 font-medium mt-0.5">u.p. {f.recipientName}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] text-emerald-200 font-medium">
                <div>
                  <div className="font-black uppercase tracking-widest text-[9px] text-emerald-300">Jaringan 4 Cabang Ritel</div>
                  Purwokerto (Pusat) · Purbalingga · Cilacap · Wonosobo
                </div>
                <div className="text-right">
                  <div className="font-black uppercase tracking-widest text-[9px] text-emerald-300">Website Resmi</div>
                  optikiseeyou.com
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{ backgroundColor: C.emerald }} />
        </Page>

        {/* ---------- 2. SURAT PENGANTAR ---------- */}
        <Page>
          <Body>
            <PageHeader no="I" title="Surat Pengantar Sponsorship" />

            <div className="space-y-4">
              <p className="text-right font-semibold" style={{ color: C.textTitle }}>Purwokerto, {f.letterDate}</p>

              <div>
                <p>Kepada Yth.</p>
                <p className="font-black text-[13px]" style={{ color: C.emeraldDark }}>{f.recipientName}</p>
                <p className="font-black text-[13px]" style={{ color: C.emeraldDark }}>{f.recipientCompany}</p>
                <p>di Tempat</p>
              </div>

              <p>
                <b>Perihal:</b> Penawaran Kerjasama Sponsorship — &quot;Buka Class Konten&quot; by Optik I See You
              </p>

              <p>Dengan hormat,</p>

              <p>
                Bersama surat ini, Tim Marketing Optik I See You bermaksud mengajukan penawaran kerjasama
                sponsorship untuk program <b>&quot;Buka Class Konten&quot;</b> — kelas pembuatan konten dan
                pengembangan kreator digital yang kami selenggarakan sebagai bagian dari inisiatif pemberdayaan
                komunitas kreatif di wilayah Purwokerto dan sekitarnya.
              </p>

              <p>
                Optik I See You saat ini mengoperasikan <b>4 cabang ritel</b> di Purwokerto (Pusat), Purbalingga,
                Cilacap, dan Wonosobo. Setiap cabang dilengkapi <b>layar TV digital di area showroom</b> yang dapat
                menayangkan materi promosi mitra selama jam operasional toko. Di kanal digital, akun resmi
                Optik I See You beserta second brand Lunar Eyewear memiliki total{" "}
                <b>{fmt(totalAll)} pengikut</b> di Instagram dan TikTok
                {latestAsOf ? ` (data terverifikasi per ${fmtDate(latestAsOf)})` : ""}.
              </p>

              <p>
                Melalui program ini, brand Anda dapat hadir langsung di hadapan peserta yang mayoritas merupakan
                Gen-Z, mahasiswa, profesional muda, dan kreator konten lokal — sekaligus memperoleh paparan
                lanjutan di jaringan toko ritel dan media sosial Optik I See You.
              </p>

              <p>
                Kami terbuka untuk mendiskusikan skema kerjasama yang paling sesuai dengan objektif pemasaran
                brand Anda. Detail paket dan ketentuan kami lampirkan pada halaman berikutnya.
              </p>

              <p>Atas perhatian dan kesempatan yang diberikan, kami ucapkan terima kasih.</p>

              <div className="pt-6">
                <p>Hormat kami,</p>
                <div className="h-14" />
                <p className="font-black text-[13px]" style={{ color: C.emeraldDark }}>Yoshput</p>
                <p className="font-semibold text-gray-700">Staff Marketing &amp; Partnership — Optik I See You</p>
                <p className="font-bold text-emerald-800">WhatsApp: 0877-7868-3766</p>
              </div>
            </div>
          </Body>
          <PageFooter page={2} />
        </Page>

        {/* ---------- 3. LATAR BELAKANG + DETAIL EVENT ---------- */}
        <Page>
          <Body>
            <PageHeader no="II" title="Latar Belakang & Tujuan" />

            <SubTitle>A. Latar Belakang</SubTitle>
            <p className="mb-3 leading-relaxed">
              Media sosial kini menjadi salah satu kanal utama konsumen muda dalam mencari referensi produk —
              mulai dari skincare, fashion, kacamata, hingga gaya hidup. Di sisi lain, banyak pelaku UMKM,
              mahasiswa, dan calon kreator di daerah yang membutuhkan keterampilan praktis untuk membuat konten
              yang menarik, otentik, dan konsisten.
            </p>
            <p className="leading-relaxed">
              Sebagai brand eyewear yang aktif membangun komunitas melalui konten, Optik I See You melihat
              keterkaitan alami antara <b>kacamata, estetika visual, perawatan diri (skincare &amp; grooming),
              dan personal branding</b>. Kreator yang tampil percaya diri — dengan frame yang tepat, kulit yang
              terawat, dan gaya yang khas — adalah titik temu yang ideal bagi brand kecantikan, lifestyle, dan
              bisnis lokal untuk menjangkau audiens potensial secara organik.
            </p>

            <SubTitle>B. Tujuan Program</SubTitle>
            <Bullets
              items={[
                <><b>Edukasi kreator lokal</b> — pelatihan praktis pembuatan konten Reels, TikTok, dan Story.</>,
                <><b>Aktivasi brand mitra multi-channel</b> — di lokasi event, di layar TV 4 cabang showroom, dan di media sosial resmi.</>,
                <><b>Membangun komunitas kreatif</b> yang terhubung dengan Optik I See You dan brand mitra untuk kolaborasi berkelanjutan.</>,
                <><b>Interaksi langsung dengan audiens</b> — bukan sekadar logo pasif, melainkan sesi demo produk, sampling, dan interaksi nyata.</>,
              ]}
            />

            <div className="mt-8">
              <PageHeader no="III" title="Detail Pelaksanaan Event" />
              <table className="w-full border-collapse text-[11px] rounded-lg overflow-hidden border" style={{ borderColor: C.ivoryBorder }}>
                <tbody>
                  {[
                    ["Nama Acara", <span key="n" className="font-bold text-gray-950">&quot;Buka Class Konten&quot; — Kelas Konten &amp; Digital Creator Masterclass</span>],
                    ["Penyelenggara", <span key="p" className="font-bold text-emerald-800">Tim Marketing, Optik I See You</span>],
                    ["Tanggal", <Val key="d" v={f.eventDate} />],
                    ["Waktu", <Val key="t" v={f.eventTime} />],
                    ["Lokasi", <Val key="l" v={f.venue} />],
                    ["Target Peserta", <Val key="j" v={f.participants} />],
                    ["Profil Peserta", <span key="pp" className="font-semibold text-gray-800">Gen-Z, mahasiswa, profesional muda, pelaku UMKM, dan kreator konten lokal</span>],
                    ["Format Acara", <span key="f" className="font-semibold text-gray-800">Workshop konten, demo produk mitra, sesi praktik editing, dan networking</span>],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? C.ivoryMuted : C.ivoryLight }}>
                      <td className="py-2.5 px-3.5 w-[32%] font-black align-top" style={{ color: C.emeraldDark }}>{k}</td>
                      <td className="py-2.5 px-3.5 leading-relaxed">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Body>
          <PageFooter page={3} />
        </Page>

        {/* ---------- 4. SKEMA KEUNTUNGAN ---------- */}
        <Page>
          <Body>
            <PageHeader no="IV" title="Skema Keuntungan Mitra Sponsor" />

            <p className="mb-4 leading-relaxed">
              Mitra sponsor mendapatkan paparan di <b>tiga kanal sekaligus</b> — tidak berhenti di hari acara,
              tetapi berlanjut di jaringan showroom toko fisik dan media sosial resmi Optik I See You.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { t: "On-Site Event", d: "Booth, demo produk, sampling, ad-lips MC, dan branding di backdrop & banner utama.", c: C.emeraldDark },
                { t: "4 Cabang Ritel", d: "Penayangan video/poster di layar TV showroom dan display flyer di kasir 4 cabang.", c: C.emerald },
                { t: "Digital & Web", d: "Post Feed/Reels, Story tag, dan logo pada frame Photobooth di optikiseeyou.com.", c: C.emeraldMid },
              ].map((x) => (
                <div key={x.t} className="rounded-xl p-4 border" style={{ backgroundColor: C.ivoryMuted, borderColor: C.ivoryBorder, borderTop: `4px solid ${x.c}` }}>
                  <div className="text-[12.5px] font-black" style={{ color: x.c }}>{x.t}</div>
                  <p className="text-[10.5px] mt-1 leading-snug text-gray-700">{x.d}</p>
                </div>
              ))}
            </div>

            <SubTitle>Jangkauan Media Sosial Resmi</SubTitle>
            <table className="w-full border-collapse text-[10.5px] rounded-lg overflow-hidden border" style={{ borderColor: C.ivoryBorder }}>
              <thead>
                <tr style={{ backgroundColor: C.emeraldDark, color: C.ivory }}>
                  <th className="py-2.5 px-3 text-left font-black">Akun Resmi</th>
                  <th className="py-2.5 px-3 text-right font-black">Instagram</th>
                  <th className="py-2.5 px-3 text-right font-black">TikTok</th>
                  <th className="py-2.5 px-3 text-right font-black">Data per</th>
                </tr>
              </thead>
              <tbody>
                {followers.map((r, i) => (
                  <tr key={r.account} style={{ backgroundColor: i % 2 === 0 ? C.ivoryMuted : C.ivoryLight }}>
                    <td className="py-2 px-3">
                      <span className="font-black" style={{ color: C.emeraldDark }}>{r.account}</span>
                      <span className="text-gray-600 font-medium"> · {r.label}</span>
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-bold text-gray-950">{fmt(r.igFollowers)}</td>
                    <td className="py-2 px-3 text-right tabular-nums font-bold text-gray-950">{r.tiktokFollowers ? fmt(r.tiktokFollowers) : "-"}</td>
                    <td className="py-2 px-3 text-right text-gray-600 font-medium">{fmtDate(r.asOf)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: C.emerald, color: C.ivory }}>
                  <td className="py-2.5 px-3 font-black text-white">Total Jangkauan Jaringan</td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-black text-white">{fmt(totalIg)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-black text-white">{fmt(totalTt)}</td>
                  <td className="py-2.5 px-3 text-right font-black text-white">{fmt(totalAll)}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[9.5px] text-gray-600 italic">
              Sumber: Rekapitulasi harian PIC media sosial 4 cabang resmi Optik I See You &amp; Lunar Eyewear.
            </p>

            <SubTitle>Nilai Tambah untuk Brand Skincare, Beauty &amp; Lifestyle</SubTitle>
            <Bullets
              items={[
                "Audiens yang relevan: Peserta kelas konten adalah kreator aktif yang siap mengulas dan membagikan produk mitra ke pengikut mereka.",
                "Paparan berulang: Materi mitra tayang di layar TV toko selama periode paket, dinikmati oleh pengunjung harian yang sedang fitting frame atau menunggu cek mata.",
                "Kolaborasi konten: Dokumentasi momen demo dan sampling di acara dapat diangkat menjadi bahan konten bersama di feed & reels.",
              ]}
            />
          </Body>
          <PageFooter page={4} />
        </Page>

        {/* ---------- 5. MATRIX PAKET ---------- */}
        <Page>
          <Body>
            <PageHeader no="V" title="Pilihan Paket Sponsorship" />

            <table className="w-full border-collapse text-[10px] border" style={{ borderColor: C.ivoryBorder }}>
              <thead>
                <tr>
                  <th className="py-2.5 px-2.5 text-left align-bottom font-black" style={{ color: C.emeraldDark }}>
                    Fasilitas &amp; Hak Sponsor
                  </th>
                  {PACKAGES.map((p) => (
                    <th key={p.name} className="py-2.5 px-1.5 text-center text-white w-[16%]" style={{ backgroundColor: p.color }}>
                      <div className="text-[11px] font-black tracking-wider">{p.name}</div>
                      <div className="text-[9.5px] font-bold opacity-95">{p.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, i) => (
                  <React.Fragment key={i}>
                    {row.group && (
                      <tr>
                        <td colSpan={5} className="pt-3 pb-1 px-2.5 text-[9.5px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-900 border-t border-b border-emerald-200">
                          {row.group}
                        </td>
                      </tr>
                    )}
                    <tr style={{ backgroundColor: i % 2 === 0 ? C.ivoryMuted : C.ivoryLight }}>
                      <td className="py-1.5 px-2.5 font-medium text-gray-900">{row.label}</td>
                      {row.cells.map((c, j) => (
                        <td key={j} className="py-1.5 px-1 text-center">{renderCell(c)}</td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Body>
          <PageFooter page={5} />
        </Page>

        {/* ---------- 6. DETAIL PAKET ---------- */}
        <Page>
          <Body>
            <PageHeader no="V" title="Rincian Fasilitas Tiap Paket" />
            <div className="grid grid-cols-2 gap-4">
              {PACKAGES.map((p) => (
                <div key={p.name} className="rounded-xl overflow-hidden border shadow-xs" style={{ borderColor: p.color, backgroundColor: C.ivoryLight }}>
                  <div className="px-4 py-3 text-white" style={{ backgroundColor: p.color }}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[15px] font-black tracking-wider">{p.name}</span>
                      <span className="text-[13px] font-black">{p.price}</span>
                    </div>
                    <div className="text-[9.5px] font-bold opacity-95 uppercase tracking-wider">{p.tag}</div>
                  </div>
                  <ul className="px-4 py-3 space-y-1.5 text-[10.5px] leading-snug">
                    {p.items.map((it, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="mt-[5px] w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-gray-900">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[11px] text-gray-700 italic">
              * Fasilitas paket dapat disesuaikan dengan kebutuhan objektif promosi brand Anda. Tim Marketing Optik I See You siap mendiskusikan opsi kustomisasi lanjutan.
            </p>
          </Body>
          <PageFooter page={6} />
        </Page>

        {/* ---------- 7. KONTRAK & PEMBAYARAN ---------- */}
        <Page>
          <Body>
            <PageHeader no="VI" title="Kontrak Kerjasama & Prosedur Pembayaran" />

            <SubTitle>A. Alur Kerjasama</SubTitle>
            <ol className="space-y-1.5 list-decimal pl-5 text-[11.5px] leading-relaxed">
              <li>Mitra memilih paket sponsorship yang sesuai dengan target promosi.</li>
              <li>Optik I See You menyiapkan Surat Perjanjian Kerjasama (MoU) resmi berisi hak dan kewajiban kedua pihak.</li>
              <li>Mitra menyerahkan materi (logo resolusi tinggi, video/poster iklan TV showroom, voucher/flyer) paling lambat <b>H-7</b> sebelum acara.</li>
              <li>Setelah acara, mitra menerima laporan evaluasi dokumentasi foto/video acara dan bukti tayang iklan di cabang.</li>
            </ol>

            <SubTitle>B. Skema Pembayaran</SubTitle>
            <table className="w-full border-collapse text-[11px] rounded-lg overflow-hidden border" style={{ borderColor: C.ivoryBorder }}>
              <thead>
                <tr style={{ backgroundColor: C.emeraldDark, color: C.ivory }}>
                  <th className="py-2.5 px-3 text-left font-black">Tahap Pembayaran</th>
                  <th className="py-2.5 px-3 text-left font-black">Waktu Pelaksanaan</th>
                  <th className="py-2.5 px-3 text-right font-black">Nominal</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: C.ivoryMuted }}>
                  <td className="py-2.5 px-3 font-bold" style={{ color: C.emeraldDark }}>Down Payment (DP)</td>
                  <td className="py-2.5 px-3">Setelah penandatanganan MoU kerjasama</td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-800">50%</td>
                </tr>
                <tr style={{ backgroundColor: C.ivoryLight }}>
                  <td className="py-2.5 px-3 font-bold" style={{ color: C.emeraldDark }}>Pelunasan</td>
                  <td className="py-2.5 px-3">Paling lambat H-3 sebelum pelaksanaan acara</td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-800">50%</td>
                </tr>
              </tbody>
            </table>

            <SubTitle>C. Ketentuan Kerjasama</SubTitle>
            <Bullets
              items={[
                "Pembayaran melalui transfer ke rekening resmi Optik I See You yang tercantum di MoU.",
                "Paket Silver (In-Kind) tidak memerlukan pembayaran tunai; jenis dan jumlah produk/voucher disepakati bersama dan dicantumkan dalam MoU.",
                "Ketentuan perubahan jadwal dan pembatalan diatur secara formal dalam MoU.",
              ]}
            />

            <SubTitle>D. Kontak Kerjasama Resmi</SubTitle>
            <div className="rounded-xl p-5 grid grid-cols-2 gap-4 border" style={{ backgroundColor: C.emeraldDark, color: C.ivory, borderColor: C.emeraldBorder }}>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-300">Contact Person (PIC)</div>
                <div className="text-[16px] font-black text-white">Yoshput</div>
                <div className="text-[11px] text-emerald-200">Staff Marketing &amp; Partnership</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-300">Direct WhatsApp</div>
                <div className="text-[16px] font-black text-white">0877-7868-3766</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-300">Website Resmi</div>
                <div className="text-[13px] font-bold text-white">optikiseeyou.com</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-emerald-300">Instagram Resmi</div>
                <div className="text-[13px] font-bold text-white">@iseeyou.glasses</div>
              </div>
            </div>

            <div className="mt-7 p-4 rounded-xl text-center border" style={{ backgroundColor: C.ivoryMuted, borderColor: C.ivoryBorder, borderLeft: `5px solid ${C.emeraldDark}` }}>
              <p className="text-[12px] leading-relaxed text-gray-900">
                Kami sangat menantikan kesempatan berkolaborasi bersama <b>{f.recipientCompany}</b> dalam program
                &quot;Buka Class Konten&quot; dan membangun sinergi ekosistem kreatif yang saling menguntungkan.
              </p>
            </div>

            <p className="mt-4 text-[9px] text-gray-500 italic text-center no-print">
              Data jangkauan media sosial terintegrasi langsung: <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-800">Spreadsheet Rekap Marketing</a>
            </p>
          </Body>
          <PageFooter page={7} />
        </Page>
      </div>
    </div>
  );
};
