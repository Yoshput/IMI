"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  Search,
  ExternalLink,
  Target,
  TrendingUp,
  Glasses,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Building2,
  DollarSign,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  handle: string;
  igUrl: string;
  tiktokUrl?: string;
  websiteUrl?: string;
  avatar: string;
  segment: string;
  priceRange: string;
  followersIg: string;
  followersTiktok: string;
  location: string;
  signatureHook: string;
  currentTrend: string;
  contentPillars: string[];
  strengths: string[];
  vulnerabilities: string[];
  tacticalStealForISeeYou: string;
  primaryChannel: string;
  tag: "Direct Competitor" | "Aspirational Benchmark" | "Incumbent Giant" | "Internal Sibling";
  auditDate: string;
}

const competitorsData: Competitor[] = [
  {
    id: "heykama",
    name: "Heykama",
    handle: "@heykama.id",
    igUrl: "https://www.instagram.com/heykama.id/",
    tiktokUrl: "https://www.tiktok.com/@heykama.id",
    avatar: "HK",
    segment: "Fast-Fashion Budget & Korean Aesthetic",
    priceRange: "Rp 120.000 – Rp 350.000",
    followersIg: "185.000+",
    followersTiktok: "320.000+",
    location: "Jakarta, Bandung & Online Nationwide",
    signatureHook: "Punya muka bulet/chubby? Stop pilih frame kotak kaku, tonton ini sampai habis!",
    currentTrend:
      "Sedang sangat ramai dengan konten kurasi 'Kacamata Sesuai Bentuk Wajah Bulat/Oval' menggunakan filter transisi musik K-Pop. Aktif live streaming TikTok Shop 2x sehari dengan paket bundling frame + lensa blueray Rp 149.000.",
    contentPillars: ["POV Face Shape Matching", "Unboxing Paket 100k", "OOTD Kpop Style", "Flash Sale Shopee Live"],
    strengths: [
      "Sangat kuat di TikTok Shop dan live selling interaktif",
      "Katalog frame acetate pastel kekinian untuk Gen Z wanita",
      "Copywriting video sangat relatable, santai, dan cepat to-the-point"
    ],
    vulnerabilities: [
      "Kurang memiliki kredibilitas optisi medis resmi (fokus pada aksesoris fashion)",
      "Proses cek mata offline terbatas pada cabang tertentu",
      "Kualitas lensa minus tinggi sering dikeluhkan tebal di review pelanggan"
    ],
    tacticalStealForISeeYou:
      "Adopsi format 'Rekomendasi Frame untuk Wajah Chubby & Wajah Lebar' di reels Purwokerto. Bedanya, I See You punya keunggulan Refraksionis Optisi resmi dan pilihan lensa anti radiasi index tinggi tipis.",
    primaryChannel: "TikTok & Instagram Reels",
    tag: "Direct Competitor",
    auditDate: "21 September 2026"
  },
  {
    id: "kacamatamoo",
    name: "Kacamatamoo",
    handle: "@kacamatamoo",
    igUrl: "https://www.instagram.com/kacamatamoo/",
    tiktokUrl: "https://www.tiktok.com/@kacamatamoo",
    avatar: "KM",
    segment: "Mass-Market Pelajar & Mahasiswa",
    priceRange: "Rp 99.000 – Rp 250.000",
    followersIg: "460.000+",
    followersTiktok: "650.000+",
    location: "Yogyakarta, Solo, Semarang & Online",
    signatureHook: "Nyesel baru tau kacamata minus + silinder bisa dapet seharga 150rb doang di Jogja!",
    currentTrend:
      "Sedang ramai dengan kampanye tahun ajaran baru & mahasiswa baru (Unsoed, UGM, UNS). Konten sketsa lucu mahasiswa ganti kacamata pecah, serta spill frame yang mirip dipakai idol Korea saat konser.",
    contentPillars: ["Diskon Mahasiswa & Kampus", "Before-After Pasang Lensa", "Spill Frame Dipakai Artis Korea", "Live Streaming Nonstop"],
    strengths: [
      "Penetrasi komunitas kampus Jogja/Solo/Jawa Tengah luar biasa tinggi",
      "Volume produksi konten sangat masif (3-5 postingan video pendek per hari)",
      "Harga bundling agresif mematikan toko optik konvensional daerah"
    ],
    vulnerabilities: [
      "Persepsi brand agak murah (kurang cocok untuk segmen pekerja/profesional)",
      "Customer service saat ramai di store sering antre panjang",
      "Kerapihan visual feed kurang terkurasi secara estetis"
    ],
    tacticalStealForISeeYou:
      "Terapkan program aktivasi kampus regional Barlingmascakeb: Promo khusus mahasiswa Unsoed, UMP, dan perguruan tinggi Purbalingga dengan diskon tukar frame lama atau gratis upgrade lensa Blueray.",
    primaryChannel: "TikTok Live & Instagram Reels",
    tag: "Direct Competitor",
    auditDate: "21 September 2026"
  },
  {
    id: "saturdays",
    name: "Saturdays Eyewear",
    handle: "@saturdays.lifestyle",
    igUrl: "https://www.instagram.com/saturdays.lifestyle/",
    websiteUrl: "https://saturdays.com",
    avatar: "ST",
    segment: "Premium Lifestyle & Artisanal Experience",
    priceRange: "Rp 1.295.000 – Rp 2.495.000",
    followersIg: "128.000+",
    followersTiktok: "75.000+",
    location: "Jabodetabek, Surabaya, Bandung & Bali (Mall Premium)",
    signatureHook: "Beli kacamata sambil ngopi artisan free cookie? Here is our store experience.",
    currentTrend:
      "Menonjolkan 'The Saturdays Cafe Experience' (ngopi gratis cookies saat coba frame), kampanye video editorial berkonsep slow-fashion minimalis, dan demonstrasi augmented reality 'Virtual Try-On' via aplikasi.",
    contentPillars: ["ASMR Store & Unboxing", "Editorial Model Photoshoot", "Home Try-On Tech Demo", "Koleksi Kolaborasi Spesial"],
    strengths: [
      "Branding sangat berkelas dengan packaging unboxing premium",
      "Konsep store hybrid optik + cafe artisan coffee yang nyaman",
      "Aplikasi Home Try-On berbasis augmented reality"
    ],
    vulnerabilities: [
      "Harga terlalu tinggi untuk daya beli mayoritas kota tier 2/tier 3",
      "Hanya hadir di mal mewah kota metropolitan besar",
      "Tidak menyasar pasar massal mahasiswa daerah"
    ],
    tacticalStealForISeeYou:
      "Tiru estetika pencahayaan video (warm minimalist), unboxing box eksklusif, dan suasana store yang ramah serta instagramable di cabang Purwokerto agar pelanggan bangga foto di dalam toko.",
    primaryChannel: "Instagram Feed & Reels",
    tag: "Aspirational Benchmark",
    auditDate: "21 September 2026"
  },
  {
    id: "optik-melawai",
    name: "Optik Melawai",
    handle: "@optik_melawai",
    igUrl: "https://www.instagram.com/optik_melawai/",
    websiteUrl: "https://www.optikmelawai.com",
    avatar: "OM",
    segment: "Legacy Healthcare Authority & Designer Luxury",
    priceRange: "Rp 1.500.000 – Rp 15.000.000+",
    followersIg: "168.000+",
    followersTiktok: "24.000+",
    location: "Seluruh Indonesia (Ratusan Cabang Mall & Standalone)",
    signatureHook: "Pemeriksaan mata standar Zeiss dengan dokter & optometris bersertifikat.",
    currentTrend:
      "Fokus kampanye kesehatan mata anak 'Cegah Mata Minus Naik Cepat Akibat Layar Gadget' dengan lensa Zeiss MyoCare, ditambah promo diskon sunglasses designer (Ray-Ban, Oakley) dan program cicilan 0% bank besar.",
    contentPillars: ["Edukasi Medis Penyakit Mata", "Koleksi Merek Mewah (Gucci, Rayban)", "Promo Cicilan Bank 0%", "Kesehatan Mata Anak"],
    strengths: [
      "Kepercayaan medis tertinggi di mata generasi orang tua / senior",
      "Lisensi resmi merek fashion kelas dunia (Ray-Ban, Oakley, Dior)",
      "Peralatan optometri canggih dari Jerman/Jepang"
    ],
    vulnerabilities: [
      "Image kaku, dingin, dan dianggap sangat mahal oleh anak muda",
      "Engagement di media sosial rendah dan video cenderung formal/membosankan",
      "Kurang lincah mengikuti tren meme atau konten vertikal Gen Z"
    ],
    tacticalStealForISeeYou:
      "Tunjukkan keahlian cek mata dan sertifikasi Refraksionis Optisi I See You, namun dikemas secara fun, hangat, dan tanpa rasa intimidasi harga mahal yang melekat pada optik mall lama.",
    primaryChannel: "Website, Offline Mall & Instagram",
    tag: "Incumbent Giant",
    auditDate: "21 September 2026"
  },
  {
    id: "lunar-eyewear",
    name: "Lunar Eyewear Tegal",
    handle: "@lunareyewear.co",
    igUrl: "https://www.instagram.com/lunareyewear.co",
    avatar: "LN",
    segment: "Sister Brand / Experimental Regional Outlet",
    priceRange: "Rp 150.000 – Rp 450.000",
    followersIg: "3.986 (Live IG)",
    followersTiktok: "3.031",
    location: "Tegal (Second Brand I See You)",
    signatureHook: "POV: Ketika kamu akhirnya nemu optik yang gak maksa beli frame jutaan tapi hasilnya estetik.",
    currentTrend:
      "Reel viral 'pengen normal lagi' tembus 11.000 likes & 87 komentar (per 21 Sept 2026 live sync). Konten daily vlog toko dan soft selling gratis periksa mata 15 menit.",
    contentPillars: ["POV Video Relatable", "Daily Vlog Tim Toko", "Promo Soft Sell", "Review Pelanggan Asli"],
    strengths: [
      "Reels viral: reel 'pengen normal lagi' tembus 11.000 likes (per 21 Sept 2026, sumber: Instagram)",
      "Pendekatan konten sangat kasual dan relatable dengan anak muda Pantura",
      "Kombinasi second brand yang memperluas pasar I See You ke wilayah Tegal"
    ],
    vulnerabilities: [
      "Jumlah pengikut masih tahap awal pertumbuhan",
      "Perlu penguatan konsistensi identitas branding agar tetap sinergis dengan grup I See You"
    ],
    tacticalStealForISeeYou:
      "Format reels POV Amanda di Tegal yang tembus 128k viewers harus segera dibuatkan SOP dan direplikasi ke Purwokerto, Purbalingga, dan Cilacap.",
    primaryChannel: "Instagram Reels & TikTok",
    tag: "Internal Sibling",
    auditDate: "21 September 2026"
  },
];

export const CompetitorRadarView: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("heykama");

  const filteredCompetitors = useMemo(() => {
    return competitorsData.filter((c) => {
      if (selectedTag !== "all" && c.tag !== selectedTag) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchHandle = c.handle.toLowerCase().includes(q);
        const matchSegment = c.segment.toLowerCase().includes(q);
        const matchSteal = c.tacticalStealForISeeYou.toLowerCase().includes(q);
        return matchName || matchHandle || matchSegment || matchSteal;
      }
      return true;
    });
  }, [selectedTag, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-container p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-light text-brand">
              Market Intelligence Radar
            </span>
            <span className="text-xs text-foreground-muted">
              Benchmark Industri Optik Indonesia 2026
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1 tracking-tight">
            Radar Kompetitor & Analisis Taktik Konten
          </h1>
          <p className="text-xs text-foreground-secondary mt-1 max-w-2xl">
            Perbandingan komprehensif antara Optik I See You dengan pemain pasar utama (Heykama, Kacamatamoo, Saturdays, Optik Melawai) dan second brand Lunar Eyewear.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-control bg-surface-secondary border border-border text-xs text-foreground">
            <span className="text-foreground-muted block text-[10px] uppercase font-bold">Posisi I See You</span>
            <span className="font-bold">Affordable Quality + Official RO</span>
          </div>
        </div>
      </div>

      {/* Positioning Matrix Overview */}
      <div className="bg-surface border border-border rounded-container p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Peta Pemetaan Pasar (Market Positioning Map)
            </h3>
          </div>
          <span className="text-[11px] text-foreground-muted">
            Sumbu Harga vs Pendekatan Brand
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-control border border-border bg-surface-secondary space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Mass Campus Budget</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface border border-border">
                Rp 99k - 250k
              </span>
            </div>
            <p className="text-[11px] text-foreground-secondary">
              <strong>Kacamatamoo</strong> · Fokus volume, diskon mahasiswa, live streaming masif.
            </p>
          </div>

          <div className="p-3 rounded-control border border-emerald-300 bg-emerald-50/40 space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950">Sweet Spot: I See You</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Rp 150k - 500k
              </span>
            </div>
            <p className="text-[11px] text-emerald-900">
              <strong>Optik I See You & Lunar</strong> · Estetika kekinian + legalitas medis resmi RO + harga wajar.
            </p>
          </div>

          <div className="p-3 rounded-control border border-border bg-surface-secondary space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Fast-Fashion Social</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface border border-border">
                Rp 120k - 350k
              </span>
            </div>
            <p className="text-[11px] text-foreground-secondary">
              <strong>Heykama</strong> · Kuat di TikTok Shop, styling muka bulat, packaging imut.
            </p>
          </div>

          <div className="p-3 rounded-control border border-border bg-surface-secondary space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Premium / Clinical</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-surface border border-border">
                Rp 1.2M - 10M+
              </span>
            </div>
            <p className="text-[11px] text-foreground-secondary">
              <strong>Saturdays</strong> (Lifestyle Mall) & <strong>Melawai</strong> (Incumbent Medis).
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border rounded-container p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Cari nama kompetitor, taktik konten, atau pilar strategi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-control border border-border bg-surface-secondary text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { key: "all", label: "Semua Brand" },
            { key: "Direct Competitor", label: "Kompetitor Langsung" },
            { key: "Aspirational Benchmark", label: "Benchmark Estetika" },
            { key: "Incumbent Giant", label: "Optik Senior" },
            { key: "Internal Sibling", label: "Second Brand" },
          ].map((tag) => (
            <button
              key={tag.key}
              onClick={() => setSelectedTag(tag.key)}
              className={`px-3 py-1.5 rounded-control text-xs font-semibold whitespace-nowrap transition-all ${selectedTag === tag.key
                  ? "bg-foreground text-surface shadow-subtle"
                  : "bg-surface-secondary text-foreground-secondary hover:text-foreground border border-border"
                }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Competitor Cards Grid */}
      <div className="space-y-4">
        {filteredCompetitors.map((comp) => {
          const isExpanded = expandedId === comp.id;
          return (
            <div
              key={comp.id}
              className={`bg-surface border rounded-container transition-all shadow-subtle overflow-hidden ${isExpanded ? "border-foreground/40 ring-1 ring-border" : "border-border hover:border-foreground/20"
                }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-control bg-foreground text-surface flex items-center justify-center font-bold text-sm shrink-0">
                    {comp.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{comp.name}</h3>
                      <a
                        href={comp.igUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-mono text-xs text-brand hover:underline font-semibold"
                        title="Buka Profil Instagram (Link Real)"
                      >
                        {comp.handle}
                        <ExternalLink className="w-3 h-3 text-brand" />
                      </a>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-surface-secondary text-foreground-secondary border border-border">
                        {comp.tag}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-secondary mt-0.5">
                      {comp.segment} · <span className="font-semibold text-foreground">{comp.priceRange}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-foreground-muted block">Audiens Instagram</span>
                    <span className="font-bold text-foreground">{comp.followersIg}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-foreground-muted block">Audiens TikTok</span>
                    <span className="font-bold text-foreground">{comp.followersTiktok}</span>
                  </div>
                  <button className="p-1.5 rounded-control border border-border hover:bg-surface-secondary text-foreground text-xs font-semibold">
                    {isExpanded ? "Tutup Detail" : "Buka Analisis"}
                  </button>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="p-5 border-t border-border bg-surface-secondary/30 space-y-5 animate-fadeIn">
                  {/* Tren & Konten Sedang Ramai Saat Ini */}
                  <div className="p-4 rounded-control bg-surface border border-border space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                        <TrendingUp className="w-4 h-4 text-brand" />
                        <span>Tren & Konten Sedang Ramai Saat Ini (Audit Pasar {comp.auditDate})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={comp.igUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface-secondary border border-border hover:border-foreground/40 text-[11px] font-semibold text-foreground transition-colors"
                        >
                          <span>Instagram</span>
                          <ExternalLink className="w-3 h-3 text-foreground-muted" />
                        </a>
                        {comp.tiktokUrl && (
                          <a
                            href={comp.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface-secondary border border-border hover:border-foreground/40 text-[11px] font-semibold text-foreground transition-colors"
                          >
                            <span>TikTok</span>
                            <ExternalLink className="w-3 h-3 text-foreground-muted" />
                          </a>
                        )}
                        {comp.websiteUrl && (
                          <a
                            href={comp.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-surface-secondary border border-border hover:border-foreground/40 text-[11px] font-semibold text-foreground transition-colors"
                          >
                            <span>Website</span>
                            <ExternalLink className="w-3 h-3 text-foreground-muted" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-foreground-secondary leading-relaxed">
                      {comp.currentTrend}
                    </p>
                  </div>
                  {/* Hook & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-control bg-surface border border-border">
                      <span className="text-[10px] uppercase font-bold text-foreground-muted block flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-foreground" />
                        Signature Hook Konten Paling Sering Dipakai:
                      </span>
                      <p className="text-xs font-semibold text-foreground mt-1.5 italic">
                        &quot;{comp.signatureHook}&quot;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-control bg-surface border border-border">
                      <span className="text-[10px] uppercase font-bold text-foreground-muted block flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-foreground" />
                        Basis Lokasi & Kanal Distribusi Utama:
                      </span>
                      <p className="text-xs text-foreground mt-1.5">
                        {comp.location} · <strong>{comp.primaryChannel}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Pillars & Swot */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Pilar Konten */}
                    <div className="p-3.5 rounded-control bg-surface border border-border space-y-2">
                      <span className="font-bold text-foreground block">Pilar Konten Kunci:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.contentPillars.map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded bg-surface-secondary text-foreground-secondary border border-border"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Kelebihan */}
                    <div className="p-3.5 rounded-control bg-surface border border-border space-y-1.5">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Kekuatan Utama Brand:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-foreground-secondary text-[11px]">
                        {comp.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Kelemahan */}
                    <div className="p-3.5 rounded-control bg-surface border border-border space-y-1.5">
                      <span className="font-bold text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Celah / Kelemahan Pasar:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-foreground-secondary text-[11px]">
                        {comp.vulnerabilities.map((v, idx) => (
                          <li key={idx}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Golden Takeaway / Tactical Steal */}
                  <div className="p-4 rounded-control bg-brand-light border border-brand/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-brand font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4" />
                      <span>Rekomendasi Taktik untuk Diterapkan di Optik I See You:</span>
                    </div>
                    <p className="text-foreground text-xs leading-relaxed font-medium mt-1">
                      {comp.tacticalStealForISeeYou}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
