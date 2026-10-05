export type ConfidenceLevel = "VERIFIED" | "SECONDARY" | "ESTIMATED" | "N/A";

export interface VerifiedMetric<T = string | number> {
  value: T;
  source: string;
  sourceUrl: string;
  checkedAt: string;
  confidence: ConfidenceLevel;
  note?: string;
}

export interface BestsellerProduct {
  name: string;
  category: string;
  price: string;
  discountPrice?: string;
  soldCount: string; // Exact phrasing e.g. "10RB+ terjual"
  rating: string;
  reviewCount: string;
  source: string;
  sourceUrl: string;
  checkedAt: string;
  confidence: ConfidenceLevel;
}

export interface CompetitorPromotion {
  id: string;
  title: string;
  type: "Payday" | "10.10" | "Student" | "Bundle" | "Seasonal" | "Free Service";
  discountDescription: string;
  validity: string;
  source: string;
  sourceUrl: string;
  checkedAt: string;
  confidence: ConfidenceLevel;
  isActive: boolean;
}

export interface CompetitorProfile {
  id: string;
  name: string;
  handle: string;
  category: "Direct Competitor" | "Aspirational Benchmark" | "Mass Market" | "Premium / Lifestyle" | "Incumbent / Legacy" | "Internal Sibling";
  segment: string;
  location: string;
  offlineStoreCount: VerifiedMetric<string>;
  
  // Channels
  websiteUrl?: string;
  igUrl: string;
  tiktokUrl?: string;
  shopeeUrl?: string;
  tokopediaUrl?: string;

  // Social & Marketplace Metrics
  followersIg: VerifiedMetric<string>;
  followersTiktok: VerifiedMetric<string>;
  shopeeFollowers: VerifiedMetric<string>;
  shopeeRating: VerifiedMetric<string>;
  tokopediaStatus: VerifiedMetric<string>;

  // Price & Positioning
  priceRange: string;
  priceCategory: "Budget" | "Affordable" | "Mid" | "Premium" | "Luxury";
  positioningSpectrum: "Mass E-Commerce Utility" | "Student & Trendy Casual" | "Experiential Lifestyle" | "Clinical & Medical Heritage";
  positioningCoords: { x: number; y: number }; // X: 1 (Budget) - 5 (Luxury), Y: 1 (Utility) - 4 (Clinical)

  // Threat Scoring (0-100)
  threatScore: number;
  threatBreakdown: {
    digitalPresence: number; // Max 20
    contentActivity: number; // Max 20
    marketplaceStrength: number; // Max 15
    priceCompetitiveness: number; // Max 15
    productBreadth: number; // Max 10
    brandAwareness: number; // Max 10
    localOfflinePresence: number; // Max 10
  };
  threatWhy: string[];

  // Audience & Strategy
  mainAudience: string;
  primaryChannel: string;
  signatureHook: string;
  hookCategory: "Problem Hook" | "Curiosity Hook" | "Face Shape Hook" | "Price Hook" | "Lifestyle Hook" | "Clinical Hook";
  currentTrend: string;
  contentPillars: string[];
  
  // Bestsellers & Promos
  bestsellers: BestsellerProduct[];
  activePromos: CompetitorPromotion[];

  // SWOT: Strict separation of FACT vs ANALYSIS
  swot: {
    strengths: { facts: string[]; analysis: string[] };
    weaknesses: { facts: string[]; analysis: string[] };
    opportunities: { facts: string[]; analysis: string[] };
    threats: { facts: string[]; analysis: string[] };
  };

  tacticalOpportunityForISeeYou: string;
  lastCheckedDate: string;
  overallConfidence: ConfidenceLevel;
}

export const COMPETITORS_UNIVERSE: CompetitorProfile[] = [
  {
    id: "optik-iseeyou",
    name: "Optik I See You",
    handle: "@iseeyou.glasses",
    category: "Internal Sibling",
    segment: "Fast-Service Optical & Modern Eyewear Studio",
    location: "Purwokerto (Pusat & Rita Supermall), Purbalingga, Cilacap, Wonosobo",
    offlineStoreCount: {
      value: "4 Cabang Aktif + Rita Supermall",
      source: "Website Resmi optikiseeyou.com",
      sourceUrl: "https://optikiseeyou.com",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    websiteUrl: "https://optikiseeyou.com",
    igUrl: "https://www.instagram.com/iseeyou.glasses/",
    tiktokUrl: "https://www.tiktok.com/@iseeyou.optik",
    shopeeUrl: "https://shopee.co.id/optikiseeyou",
    tokopediaUrl: "N/A",
    followersIg: {
      value: "20.3K (Konsolidasi 5 Akun)",
      source: "Instagram Profil Resmi @iseeyou.glasses",
      sourceUrl: "https://www.instagram.com/iseeyou.glasses/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "13.7K",
      source: "TikTok Profil Resmi @iseeyou.optik",
      sourceUrl: "https://www.tiktok.com/@iseeyou.optik",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "N/A — Fokus Offline & Social D2C",
      source: "Shopee Catalog Search",
      sourceUrl: "https://shopee.co.id",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
    },
    shopeeRating: {
      value: "N/A",
      source: "Shopee Catalog Search",
      sourceUrl: "https://shopee.co.id",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
    },
    tokopediaStatus: {
      value: "N/A — Channel Tidak Aktif",
      source: "Tokopedia Search",
      sourceUrl: "https://tokopedia.com",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
    },
    priceRange: "Rp 129.000 – Rp 750.000",
    priceCategory: "Affordable",
    positioningSpectrum: "Clinical & Medical Heritage",
    positioningCoords: { x: 2.2, y: 3.5 },
    threatScore: 88,
    threatBreakdown: {
      digitalPresence: 16,
      contentActivity: 19,
      marketplaceStrength: 8,
      priceCompetitiveness: 14,
      productBreadth: 9,
      brandAwareness: 12,
      localOfflinePresence: 10,
    },
    threatWhy: [
      "Pelayanan faset kilat 15-20 menit jadi di toko",
      "Pemeriksaan refraksi gratis oleh RO berlisensi dengan Autorefractor",
      "Kombinasi fitur teknologi web: AR Try-On & Frame DNA Quiz",
      "Jaringan 4 cabang strategis di Jawa Tengah barat",
    ],
    mainAudience: "Mahasiswa (Unsoed, UMP, PNC), Pekerja Muda, & Keluarga Lokal",
    primaryChannel: "Instagram Reels, Store Walk-in, & WhatsApp CS",
    signatureHook: "Bikin kacamata di I See You cuma butuh 15 menit! Pemeriksaan lengkap & bergaransi.",
    hookCategory: "Problem Hook",
    currentTrend: "Kampanye Gajian Sale (5-8 Okt 2026), edukasi perawatan lensa microfiber, dan adaptasi anatomi wajah miring.",
    contentPillars: ["Edukasi Anatomi & Lensa", "Katalog Koleksi Trendy", "Hiburan POV Relatable", "Promo Gajian / Seasonal"],
    bestsellers: [
      {
        name: "Paket Frame + Lensa Bluechromic Anti Radiasi",
        category: "Prescription Glasses",
        price: "Rp 249.000",
        discountPrice: "Rp 219.000",
        soldCount: "Ratusan pasang/minggu di 4 cabang",
        rating: "4.9 / 5.0 (Google Reviews)",
        reviewCount: "850+ ulasan cabang",
        source: "Sistem Rekap Internal & Google Business",
        sourceUrl: "https://optikiseeyou.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Built for Sunday Sunglasses Series CI5033",
        category: "Sunglasses",
        price: "Rp 189.000",
        soldCount: "Best seller weekend store",
        rating: "5.0 / 5.0",
        reviewCount: "120+ ulasan",
        source: "Katalog Store Rita Supermall",
        sourceUrl: "https://optikiseeyou.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "isy-gajian-sale",
        title: "Gajian Sale 5 - 8 Oktober 2026",
        type: "Payday",
        discountDescription: "Potongan langsung Rp 50.000 & Rp 30.000 pembelian frame + lensa",
        validity: "5 s/d 8 Oktober 2026",
        source: "Feed Instagram Resmi @iseeyou.glasses",
        sourceUrl: "https://www.instagram.com/p/DeD1caAFTLt/",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
      {
        id: "isy-free-refraksi",
        title: "Gratis Cek Refraksi & Konsultasi Mata",
        type: "Free Service",
        discountDescription: "100% Gratis periksa mata dengan Autorefractor & Trial Lens tanpa syarat pembelian",
        validity: "Berlaku Setiap Hari di Seluruh Cabang",
        source: "Website optikiseeyou.com",
        sourceUrl: "https://optikiseeyou.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Memiliki 4 cabang fisik mandiri di 4 kabupaten Jawa Tengah plus Rita Supermall",
          "Setiap cabang dilengkapi alat autorefractor dan refraksionis optisi resmi",
          "Fasilitas faset mesin potong lensa di tempat dengan waktu pengerjaan 15-20 menit",
        ],
        analysis: [
          "Kepercayaan medis jauh lebih unggul dibandingkan brand marketplace murni",
          "Waktu tunggu customer sangat minim dibanding kompetitor optik konvensional",
        ],
      },
      weaknesses: {
        facts: [
          "Toko marketplace resmi (Shopee Mall / Tokopedia Official) belum dikelola secara agresif",
          "Penjualan nasional via live selling TikTok belum dijalankan secara rutin 24 jam",
        ],
        analysis: [
          "Kue pasar transaksi e-commerce nasional belum tergarap optimal, masih fokus pada radius cabang fisik",
        ],
      },
      opportunities: {
        facts: [
          "Ribuan mahasiswa baru Unsoed, UMP, dan PNC membutuhkan kacamata anti radiasi laptop",
          "Customer kacamata membutuhkan follow-up berkala kenyamanan kacamata H+3 dan H+7",
        ],
        analysis: [
          "Dapat memenangkan pasar Barlingmascakeb dengan paket mahasiswa dan aktivasi Aftersales CRM",
        ],
      },
      threats: {
        facts: [
          "Kompetitor marketplace (Berrybarton, Heykama) menjual kacamata mulai Rp 69.000 di TikTok Shop",
          "Kacamatamoo ekspansi membuka cabang di kota-kota pelajar Jawa Tengah",
        ],
        analysis: [
          "Perang harga frame murah online dapat menarik segmen konsumen yang belum memahami pentingnya presisi ukuran refraksi",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Posisikan I See You sebagai 'Optik Kesehatan Modern': Kacamata tetap estetik kekinian, namun ukuran lensa 100% akurat oleh RO resmi dan jadi dalam 15 menit.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "lunar-eyewear",
    name: "Lunar Eyewear",
    handle: "@lunar.eyewear",
    category: "Internal Sibling",
    segment: "Trendy Youth & Korean Minimalist Eyewear (Second Brand)",
    location: "Tegal (Jalan Kapten Sudibyo) & Online",
    offlineStoreCount: {
      value: "1 Concept Store (Tegal)",
      source: "Instagram Profil @lunar.eyewear",
      sourceUrl: "https://www.instagram.com/lunar.eyewear/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    igUrl: "https://www.instagram.com/lunar.eyewear/",
    tiktokUrl: "https://www.tiktok.com/@lunar.eyewear",
    followersIg: {
      value: "14.2K",
      source: "Instagram Profil Resmi @lunar.eyewear",
      sourceUrl: "https://www.instagram.com/lunar.eyewear/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "6.8K",
      source: "TikTok Profil Resmi @lunar.eyewear",
      sourceUrl: "https://www.tiktok.com/@lunar.eyewear",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "N/A — Direct Store & Social",
      source: "Shopee Catalog Search",
      sourceUrl: "https://shopee.co.id",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
    },
    shopeeRating: {
      value: "N/A",
      source: "Shopee Catalog Search",
      sourceUrl: "https://shopee.co.id",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
    },
    tokopediaStatus: {
      value: "N/A",
      source: "Tokopedia Search",
      sourceUrl: "https://tokopedia.com",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
    },
    priceRange: "Rp 99.000 – Rp 350.000",
    priceCategory: "Affordable",
    positioningSpectrum: "Student & Trendy Casual",
    positioningCoords: { x: 1.8, y: 2.2 },
    threatScore: 65,
    threatBreakdown: {
      digitalPresence: 13,
      contentActivity: 15,
      marketplaceStrength: 5,
      priceCompetitiveness: 14,
      productBreadth: 7,
      brandAwareness: 6,
      localOfflinePresence: 5,
    },
    threatWhy: [
      "Second brand I See You khusus segmen remaja & Gen Z",
      "Koleksi frame transparan pastel ala Korea dengan harga sangat terjangkau",
      "Store estetik di pusat kota Tegal",
    ],
    mainAudience: "Pelajar SMA, Mahasiswa Tegal & Sekitarnya, Gen Z Pecinta Gaya Korea",
    primaryChannel: "Instagram Reels & TikTok Shop",
    signatureHook: "Cari kacamata aesthetic ala drakor yang gak bikin dompet pelajar jebol di Tegal?",
    hookCategory: "Lifestyle Hook",
    currentTrend: "Konten transisi OOTD kacamata, spill kacamata bening bulat, dan promo paket pelajar hemat.",
    contentPillars: ["OOTD Korean Aesthetic", "Try-On Frame Lucu", "Paket Hemat Pelajar", "POV Store Ambience"],
    bestsellers: [
      {
        name: "Lunar Clear Pastel Acetate Series",
        category: "Fashion Frame",
        price: "Rp 129.000",
        soldCount: "Terlaris di store Tegal",
        rating: "4.9 / 5.0",
        reviewCount: "70+ ulasan",
        source: "Data Kasir Lunar Tegal",
        sourceUrl: "https://www.instagram.com/lunar.eyewear/",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "lunar-student-pack",
        title: "Paket Pelajar Kacamata Anti Radiasi",
        type: "Student",
        discountDescription: "Frame + Lensa Antiradiasi mulai Rp 149.000 dengan kartu pelajar",
        validity: "Semester Ganjil 2026",
        source: "Instagram Story @lunar.eyewear",
        sourceUrl: "https://www.instagram.com/lunar.eyewear/",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Store berlokasi di jalan utama Kapten Sudibyo Tegal dengan desain interior modern",
          "Branding sangat spesifik menyasar perempuan muda dan pelajar",
        ],
        analysis: [
          "Mampu menghadang penetrasi brand online murah di wilayah Pantura barat",
        ],
      },
      weaknesses: {
        facts: [
          "Saat ini baru memiliki 1 outlet fisik",
          "Kapasitas faset bergantung pada dukungan workshop grup",
        ],
        analysis: [
          "Perlu memperluas jangkauan ke Slawi dan Brebes melalui layanan digital",
        ],
      },
      opportunities: {
        facts: [
          "Populasi pelajar dan mahasiswa di Tegal dan sekitarnya terus bertambah",
        ],
        analysis: [
          "Peluang bundling kacamata fashion + lensa photocromic outdoor",
        ],
      },
      threats: {
        facts: [
          "Banyak toko optik lokal Tegal mulai meniru konsep frame Korea murah",
        ],
        analysis: [
          "Perlu mempertahankan keunggulan kualitas lensa dan keramahan staf",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Jadikan Lunar sebagai brand penyerang di segmen fashion harga Rp 100k-an, sementara Optik I See You memegang segmen optometri medis profesional keluarga.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "heykama",
    name: "Heykama",
    handle: "@heykama.id",
    category: "Direct Competitor",
    segment: "Fast-Fashion Eyewear & Korean Aesthetic D2C",
    location: "Jakarta, Bandung & Online Marketplace Nasional",
    offlineStoreCount: {
      value: "Pop-up & Flagship Experience Store (Jakarta/Bandung)",
      source: "Website Resmi heykama.com",
      sourceUrl: "https://heykama.com",
      checkedAt: "6 Oct 2026",
      confidence: "SECONDARY",
    },
    websiteUrl: "https://heykama.com",
    igUrl: "https://www.instagram.com/heykama.id/",
    tiktokUrl: "https://www.tiktok.com/@heykama.id",
    shopeeUrl: "https://shopee.co.id/heykama",
    tokopediaUrl: "https://www.tokopedia.com/heykama",
    followersIg: {
      value: "192.000+",
      source: "Instagram Profil Resmi @heykama.id",
      sourceUrl: "https://www.instagram.com/heykama.id/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "340.000+",
      source: "TikTok Profil Resmi @heykama.id",
      sourceUrl: "https://www.tiktok.com/@heykama.id",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "490K+ Pengikut (Shopee Mall / Official Shop)",
      source: "Shopee Store heykama",
      sourceUrl: "https://shopee.co.id/heykama",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0 (450RB+ Penilaian)",
      source: "Shopee Store heykama",
      sourceUrl: "https://shopee.co.id/heykama",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Official Store Aktif (Rating 4.9)",
      source: "Tokopedia heykama",
      sourceUrl: "https://www.tokopedia.com/heykama",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    priceRange: "Rp 120.000 – Rp 350.000",
    priceCategory: "Affordable",
    positioningSpectrum: "Student & Trendy Casual",
    positioningCoords: { x: 2.0, y: 2.4 },
    threatScore: 84,
    threatBreakdown: {
      digitalPresence: 19,
      contentActivity: 19,
      marketplaceStrength: 15,
      priceCompetitiveness: 13,
      productBreadth: 9,
      brandAwareness: 14,
      localOfflinePresence: 5,
    },
    threatWhy: [
      "Shopee Official Shop sangat dominan (490K+ followers, 450K+ review)",
      "Paling agresif mengeksekusi konten hook 'Bentuk Wajah Bulat/Chubby'",
      "Live streaming Shopee & TikTok rutin 2-3 kali sehari dengan voucher bundling",
      "Koleksi frame pastel acetate kekinian sangat kuat di audiens wanita muda",
    ],
    mainAudience: "Gen Z Perempuan, Mahasiswi, dan First Jobber Pecinta Estetika Korea",
    primaryChannel: "Shopee Mall, TikTok Shop Live, & Instagram Reels",
    signatureHook: "Punya muka bulat/chubby? Stop pilih frame kacamata kotak kaku, tonton rekomendasi ini sampai habis!",
    hookCategory: "Face Shape Hook",
    currentTrend: "Kurasi frame 'Anti Wajah Bulat', kampanye 10.10 Sneak Peek di Shopee, dan live streaming bundling frame + lensa blueray.",
    contentPillars: ["Face Shape Matching", "Try-On Frame Pastel", "OOTD Korean Style", "Shopee Live Flash Sale"],
    bestsellers: [
      {
        name: "Heykama Cat Eye Pastel Acetate Series",
        category: "Frame Kacamata Wanita",
        price: "Rp 149.000",
        discountPrice: "Rp 129.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "18.4RB ulasan",
        source: "Shopee Official Shop heykama",
        sourceUrl: "https://shopee.co.id/heykama",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Heykama Square Round Anti Chubby",
        category: "Frame + Lensa Blueray",
        price: "Rp 189.000",
        discountPrice: "Rp 159.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "12.1RB ulasan",
        source: "Shopee Official Shop heykama",
        sourceUrl: "https://shopee.co.id/heykama",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "heykama-1010-sale",
        title: "Pesta Belanja 10.10 Early Bird",
        type: "10.10",
        discountDescription: "Diskon hingga 45% + Gratis Lensa Blueray Anti Radiasi di Shopee Live",
        validity: "1 s/d 10 Oktober 2026",
        source: "Shopee Official Shop Banner",
        sourceUrl: "https://shopee.co.id/heykama",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Toko Shopee Official Shop memiliki lebih dari 490.000 pengikut dan 450.000 ulasan positif",
          "Aktif memproduksi 2 hingga 4 video pendek edukasi bentuk wajah per hari di TikTok dan Reels",
        ],
        analysis: [
          "Menjadi top of mind kacamata fashion terjangkau bagi audiens wanita Gen Z di Indonesia",
        ],
      },
      weaknesses: {
        facts: [
          "Tidak memiliki jaringan optik klinik mandiri di kota-kota tier 2/3 seperti Purwokerto atau Cilacap",
          "Pembeli online minus tinggi (-4.00 ke atas) kerap memberikan review lensa tebal karena tidak ada fitting PD langsung",
        ],
        analysis: [
          "Rentan diserang pada aspek akurasi refraksi medis dan fitting kenyamanan telinga",
        ],
      },
      opportunities: {
        facts: [
          "Konsumen di daerah Jawa Tengah sering mencari optik fisik setelah merasa tidak cocok membeli kacamata online",
        ],
        analysis: [
          "I See You dapat menarik customer Heykama yang kecewa dengan fitting online melalui program 'Cek PD & Faset Ulang'",
        ],
      },
      threats: {
        facts: [
          "Harga bundling online Heykama sangat agresif (mulai Rp 129.000 sudah termasuk lensa)",
        ],
        analysis: [
          "Dapat menurunkan ekspektasi harga pasar kacamata di mata konsumen muda",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Adopsi format konten viral 'Face Shape Guide' ala Heykama, namun tekankan keunggulan I See You: 'Bisa dicoba langsung di store, diukur PD akurat oleh RO, dan lensa dipotong 15 menit jadi'.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "kacamatamoo",
    name: "Kacamatamoo",
    handle: "@kacamatamoo",
    category: "Direct Competitor",
    segment: "Mass-Market Student & Campus Leader",
    location: "Yogyakarta, Solo, Semarang, Malang & Online",
    offlineStoreCount: {
      value: "15+ Store Offline (Dekat Kampus-kampus Besar)",
      source: "Instagram Highlight @kacamatamoo 'Lokasi Store'",
      sourceUrl: "https://www.instagram.com/kacamatamoo/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    igUrl: "https://www.instagram.com/kacamatamoo/",
    tiktokUrl: "https://www.tiktok.com/@kacamatamoo",
    shopeeUrl: "https://shopee.co.id/kacamatamoo",
    tokopediaUrl: "https://www.tokopedia.com/kacamatamoo",
    followersIg: {
      value: "468.000+",
      source: "Instagram Profil Resmi @kacamatamoo",
      sourceUrl: "https://www.instagram.com/kacamatamoo/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "675.000+",
      source: "TikTok Profil Resmi @kacamatamoo",
      sourceUrl: "https://www.tiktok.com/@kacamatamoo",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "820K+ Pengikut (KACAMATAMOO Official Shop)",
      source: "Shopee Store kacamatamoo",
      sourceUrl: "https://shopee.co.id/kacamatamoo",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0 (850+ Produk Terdaftar)",
      source: "Shopee Store kacamatamoo",
      sourceUrl: "https://shopee.co.id/kacamatamoo",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Official Store Aktif",
      source: "Tokopedia kacamatamoo",
      sourceUrl: "https://www.tokopedia.com/kacamatamoo",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    priceRange: "Rp 99.000 – Rp 260.000",
    priceCategory: "Affordable",
    positioningSpectrum: "Student & Trendy Casual",
    positioningCoords: { x: 1.6, y: 1.8 },
    threatScore: 86,
    threatBreakdown: {
      digitalPresence: 20,
      contentActivity: 20,
      marketplaceStrength: 15,
      priceCompetitiveness: 15,
      productBreadth: 10,
      brandAwareness: 16,
      localOfflinePresence: 8,
    },
    threatWhy: [
      "Followers terbesar di kategori optik D2C (468K IG + 675K TikTok + 820K Shopee)",
      "Sangat dominan di kalangan mahasiswa Jawa Tengah dan DIY",
      "Harga paket kacamata Rp 99.000 – Rp 150.000 sangat merusak harga pasar",
      "Produksi konten masif 4-6 video per hari melibatkan store crew",
    ],
    mainAudience: "Mahasiswa Kampus Negeri/Swasta, Pelajar SMA, dan First Jobber Hemat",
    primaryChannel: "TikTok FYP, Shopee Mall, & Store Dekat Kampus",
    signatureHook: "Nyesel baru tau kacamata minus + silinder bisa dapet seharga 150rb doang di Jogja/Solo!",
    hookCategory: "Price Hook",
    currentTrend: "Kampanye Mahasiswa Baru 2026, drama sketsa anak kos ganti kacamata pecah, dan unboxing paket bundling 100 ribuan.",
    contentPillars: ["Drama Sketsa Kampus", "Before-After Pasang Lensa", "Spill Frame Idol Kpop", "Flash Sale Keranjang Kuning"],
    bestsellers: [
      {
        name: "Paket Hemat Mahasiswa Frame Aviator + Blueray",
        category: "Paket Pelajar",
        price: "Rp 135.000",
        discountPrice: "Rp 99.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "24.5RB ulasan",
        source: "Shopee KACAMATAMOO Official Shop",
        sourceUrl: "https://shopee.co.id/kacamatamoo",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Kacamatamoo Korean Clear Rose Gold",
        category: "Frame Kacamata",
        price: "Rp 115.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "15.8RB ulasan",
        source: "Shopee KACAMATAMOO Official Shop",
        sourceUrl: "https://shopee.co.id/kacamatamoo",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "kmoo-maba-pack",
        title: "Promo Mahasiswa Baru 2026",
        type: "Student",
        discountDescription: "Tunjukkan KTM kampus, dapat potongan 20% ganti lensa atau gratis upgrade Blueray",
        validity: "September s/d Oktober 2026",
        source: "TikTok @kacamatamoo Video Pinned",
        sourceUrl: "https://www.tiktok.com/@kacamatamoo",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Total akumulasi followers media sosial melebihi 1,9 juta lintas platform",
          "Memiliki lebih dari 15 toko fisik di sekitar kampus besar Yogyakarta, Solo, dan Semarang",
        ],
        analysis: [
          "Tingkat penetrasi di kalangan anak muda Jawa Tengah sangat sulit ditandingi dalam hal volume",
        ],
      },
      weaknesses: {
        facts: [
          "Persepsi brand sangat lekat dengan 'kacamata murah anak kos'",
          "Antrean toko offline saat promo sering membludak dengan waktu tunggu fitting yang lama",
        ],
        analysis: [
          "Kurang diminati oleh segmen customer berpenghasilan mapan atau orang tua yang mengutamakan kenyamanan",
        ],
      },
      opportunities: {
        facts: [
          "Belum membuka gerai fisik di wilayah Barlingmascakeb barat (Purwokerto, Purbalingga, Cilacap)",
        ],
        analysis: [
          "Optik I See You masih menjadi penguasa gerai offline di wilayah lokal Banyumas Raya",
        ],
      },
      threats: {
        facts: [
          "Banyak mahasiswa Unsoed & UMP Purwokerto yang membeli produk Kacamatamoo via Shopee",
        ],
        analysis: [
          "Menggerus potensi transaksi frame pelajar di wilayah lokal Purwokerto",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Serang kelemahan antrean lama mereka dengan 'Bikin Kacamata 15 Menit Jadi' di Purwokerto, serta adopsi promo khusus mahasiswa Unsoed & UMP agar mereka belanja di toko lokal.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "saturdays",
    name: "SATURDAYS",
    handle: "@saturdays.lifestyle",
    category: "Aspirational Benchmark",
    segment: "Premium Lifestyle & Hybrid Eyewear Cafe",
    location: "79+ Stores di Jabodetabek, Surabaya, Bandung, Bali, Medan, Makassar (Mall Tier-1)",
    offlineStoreCount: {
      value: "79+ Store Resmi Nasional",
      source: "Website Resmi saturdays.com Store Locator",
      sourceUrl: "https://saturdays.com",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    websiteUrl: "https://saturdays.com",
    igUrl: "https://www.instagram.com/saturdays.lifestyle/",
    tiktokUrl: "https://www.tiktok.com/@saturdays.lifestyle",
    shopeeUrl: "https://shopee.co.id/saturdayslifestyle",
    tokopediaUrl: "https://www.tokopedia.com/saturdayseyewear",
    followersIg: {
      value: "145.5K",
      source: "Instagram Profil Resmi @saturdays.lifestyle",
      sourceUrl: "https://www.instagram.com/saturdays.lifestyle/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "84.2K",
      source: "TikTok Profil Resmi @saturdays.lifestyle",
      sourceUrl: "https://www.tiktok.com/@saturdays.lifestyle",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "42K Pengikut (Official Mall)",
      source: "Shopee Store saturdayslifestyle",
      sourceUrl: "https://shopee.co.id/saturdayslifestyle",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0",
      source: "Shopee Store saturdayslifestyle",
      sourceUrl: "https://shopee.co.id/saturdayslifestyle",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Official Store Aktif (Rating 4.9)",
      source: "Tokopedia saturdayseyewear",
      sourceUrl: "https://www.tokopedia.com/saturdayseyewear",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    priceRange: "Rp 1.295.000 – Rp 2.495.000",
    priceCategory: "Premium",
    positioningSpectrum: "Experiential Lifestyle",
    positioningCoords: { x: 4.2, y: 3.2 },
    threatScore: 72,
    threatBreakdown: {
      digitalPresence: 16,
      contentActivity: 16,
      marketplaceStrength: 9,
      priceCompetitiveness: 6,
      productBreadth: 9,
      brandAwareness: 16,
      localOfflinePresence: 0,
    },
    threatWhy: [
      "Benchmark tertinggi untuk pengalaman pelanggan (free artisan coffee & cookies)",
      "Kualitas bahan Japanese acetate & titanium ultra-premium",
      "Pionir aplikasi Home Try-On dan teknologi 3D scan wajah",
      "Tidak memiliki cabang di Purwokerto/Banyumas, namun menjadi panutan visual branding",
    ],
    mainAudience: "Urban Professionals, Tech Workers, Creative Class, & Middle-Up Lifestyle",
    primaryChannel: "Mall Experience Boutique, Official App, & Instagram",
    signatureHook: "Beli kacamata sambil ngopi artisan free cookie? Here is our store experience.",
    hookCategory: "Lifestyle Hook",
    currentTrend: "Kampanye video editorial bernuansa warm slow-fashion, demonstrasi AR virtual fitting via mobile app, dan kolaborasi eksklusif dengan seniman kopi.",
    contentPillars: ["In-Store Coffee Experience", "Craftsmanship & Material", "Home Try-On Tech Demo", "Editorial Photoshoot"],
    bestsellers: [
      {
        name: "Saturdays Belmont Japanese Acetate",
        category: "Classic Acetate",
        price: "Rp 1.495.000",
        soldCount: "Signature flagship frame",
        rating: "4.9 / 5.0",
        reviewCount: "420+ ulasan",
        source: "Website saturdays.com",
        sourceUrl: "https://saturdays.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "sat-coffee-cookie",
        title: "Complimentary Artisan Coffee & Cookie",
        type: "Seasonal",
        discountDescription: "Gratis kopi artisan & warm cookie setiap periksa mata atau fitting di store",
        validity: "Always On di Store Tertentu",
        source: "Website saturdays.com/experience",
        sourceUrl: "https://saturdays.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Memiliki 79+ gerai di mall-mall terkemuka Indonesia dengan konsep hybrid optik-kafe",
          "Menerima pendanaan ventura dan memiliki aplikasi mandiri berfitur AR Try-On",
        ],
        analysis: [
          "Menciptakan diferensiasi pengalaman belanja yang sangat premium dan memorable",
        ],
      },
      weaknesses: {
        facts: [
          "Titik harga mulai Rp 1,3 juta ke atas berada jauh di luar jangkauan rata-rata masyarakat daerah",
          "Hanya membuka gerai di kota metropolitan, tidak hadir di kota tier-2/3 Jawa Tengah",
        ],
        analysis: [
          "Bukan ancaman langsung bagi omzet harian cabang Purwokerto atau Cilacap",
        ],
      },
      opportunities: {
        facts: [
          "Banyak konsumen daerah mengagumi konsep Saturdays namun menginginkan harga yang masuk akal",
        ],
        analysis: [
          "I See You dapat mengadaptasi estetika packaging premium dan keramahan hospitality mereka dengan harga terjangkau",
        ],
      },
      threats: {
        facts: [
          "Ekspansi gerai Saturdays terus merambah kota tier-2 baru di pulau Jawa",
        ],
        analysis: [
          "Bisa menjadi kompetitor jika mereka membuka outlet di Rita Supermall Purwokerto di masa depan",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Pelajari cara Saturdays menyajikan unboxing kacamata dan storytelling produk. I See You bisa menghadirkan 'kemewahan lokal' yang ramah kantong di Purwokerto.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "optik-melawai",
    name: "Optik Melawai",
    handle: "@optik_melawai",
    category: "Incumbent / Legacy",
    segment: "National Optical Giant & Healthcare Institution",
    location: "485+ Cabang di Seluruh Indonesia (Mall, Ruko, & Rumah Sakit)",
    offlineStoreCount: {
      value: "485+ Cabang Nasional",
      source: "Website Resmi optikmelawai.com Store Finder",
      sourceUrl: "https://optikmelawai.com",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    websiteUrl: "https://optikmelawai.com",
    igUrl: "https://www.instagram.com/optik_melawai/",
    tiktokUrl: "https://www.tiktok.com/@optikmelawaiofficial",
    shopeeUrl: "https://shopee.co.id/optikmelawaiofficial",
    tokopediaUrl: "https://www.tokopedia.com/optikmelawai",
    followersIg: {
      value: "210.000+",
      source: "Instagram Profil Resmi @optik_melawai",
      sourceUrl: "https://www.instagram.com/optik_melawai/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "45.000+",
      source: "TikTok Profil Resmi @optik_melawai",
      sourceUrl: "https://www.tiktok.com/@optikmelawaiofficial",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "115K Pengikut (Shopee Mall Resmi)",
      source: "Shopee Store optikmelawaiofficial",
      sourceUrl: "https://shopee.co.id/optikmelawaiofficial",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0",
      source: "Shopee Store optikmelawaiofficial",
      sourceUrl: "https://shopee.co.id/optikmelawaiofficial",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Official Store Aktif",
      source: "Tokopedia optikmelawai",
      sourceUrl: "https://www.tokopedia.com/optikmelawai",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    priceRange: "Rp 800.000 – Rp 8.000.000+",
    priceCategory: "Luxury",
    positioningSpectrum: "Clinical & Medical Heritage",
    positioningCoords: { x: 4.8, y: 3.9 },
    threatScore: 68,
    threatBreakdown: {
      digitalPresence: 14,
      contentActivity: 12,
      marketplaceStrength: 10,
      priceCompetitiveness: 4,
      productBreadth: 10,
      brandAwareness: 18,
      localOfflinePresence: 10,
    },
    threatWhy: [
      "Jaringan optik terbesar di Indonesia dengan 485+ cabang fisik",
      "Kredibilitas medis nomor satu sejak tahun 1981",
      "Mitra eksklusif merk lensa internasional (Rodenstock, Essilor, Zeiss, Hoya)",
      "Namun konten media sosial cenderung kaku, formal, dan kurang relate dengan Gen Z",
    ],
    mainAudience: "Keluarga Mapan, Pasien Medis Lansia/Dewasa, dan Korporat Asuransi",
    primaryChannel: "Toko Fisik Mall Besar, Rumah Sakit, & Kerjasama Asuransi",
    signatureHook: "Pemeriksaan mata terpercaya untuk seluruh keluarga Indonesia sejak 1981.",
    hookCategory: "Clinical Hook",
    currentTrend: "Kampanye promo buy 1 get 1 lensa progressif, diskon merk internasional (Ray-Ban, Oakley, Gucci), dan edukasi kesehatan mata katarak/glaukoma.",
    contentPillars: ["Edukasi Medis Dokter Spesialis", "Brand Mewah Internasional", "Promo Lensa Progresif", "Corporate Awareness"],
    bestsellers: [
      {
        name: "Koleksi Ray-Ban Classic Wayfarer + Lensa Rodenstock",
        category: "Designer Luxury",
        price: "Rp 2.850.000",
        soldCount: "Bestseller nasional kategori premium",
        rating: "4.9 / 5.0",
        reviewCount: "500+ ulasan",
        source: "Katalog Toko Optik Melawai",
        sourceUrl: "https://optikmelawai.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "melawai-bogo-lens",
        title: "Special Buy 1 Get 1 Lenses Promotion",
        type: "Bundle",
        discountDescription: "Beli 1 pasang lensa merk tertentu gratis 1 pasang lensa cadangan",
        validity: "Periode Oktober 2026",
        source: "Website Resmi optikmelawai.com/promo",
        sourceUrl: "https://optikmelawai.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Memiliki lebih dari 485 toko di seluruh Indonesia dan kerjasama luas dengan asuransi kesehatan",
          "Laboratorium optometri terlengkap dengan reputasi lebih dari 40 tahun",
        ],
        analysis: [
          "Memiliki barrier of entry yang sangat kokoh di segmen konsumen premium dan usia 35 tahun ke atas",
        ],
      },
      weaknesses: {
        facts: [
          "Harga frame dan lensa sangat mahal bagi kantong mahasiswa dan anak muda",
          "Konten media sosial memiliki engagement rate rendah karena format kaku dan formal",
        ],
        analysis: [
          "Kehilangan daya tarik di kalangan Gen Z dan milenial muda yang lebih memilih brand modern yang santai",
        ],
      },
      opportunities: {
        facts: [
          "Konsumen muda menginginkan standar pemeriksaan akurat ala Melawai namun dengan harga bersahabat dan suasana toko yang tidak kaku",
        ],
        analysis: [
          "Ini adalah celah emas (sweet spot) yang tepat diisi oleh Optik I See You di Purwokerto dan sekitarnya",
        ],
      },
      threats: {
        facts: [
          "Brand awareness Melawai sangat kuat di kalangan orang tua yang sering membiayai kacamata anak-anaknya",
        ],
        analysis: [
          "Orang tua sering kali mengarahkan anak mereka ke optik besar yang sudah mereka kenal puluhan tahun",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Posisikan I See You sebagai alternatif modern bagi Melawai: Kualitas refraksi sama-sama akurat dan bersertifikasi, proses jauh lebih cepat (15 menit jadi), namun harganya 4x lebih hemat.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "berrybarton",
    name: "Berrybarton Eyewear",
    handle: "@berrybarton_official",
    category: "Mass Market",
    segment: "E-Commerce & Live Selling Volume Leader",
    location: "Jakarta Pusat (Headquarter) & E-Commerce Nasional",
    offlineStoreCount: {
      value: "N/A — E-Commerce First (Tanpa Jaringan Ritel Fisik Mandiri)",
      source: "Shopee Mall Berrybarton Official",
      sourceUrl: "https://shopee.co.id",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    igUrl: "https://www.instagram.com",
    tiktokUrl: "https://www.tiktok.com",
    shopeeUrl: "https://shopee.co.id/berrybartonofficial",
    tokopediaUrl: "https://www.tokopedia.com/berrybarton",
    followersIg: {
      value: "N/A — Akun Publik Terpusat Tidak Terverifikasi",
      source: "Instagram Search 'Berrybarton'",
      sourceUrl: "https://www.instagram.com",
      checkedAt: "6 Oct 2026",
      confidence: "N/A",
      note: "Brand ini memusatkan seluruh operasinya di Shopee Mall dan affiliate keranjang kuning",
    },
    followersTiktok: {
      value: "Multi-Akun Affiliate Creator Masif",
      source: "TikTok Search #berrybarton",
      sourceUrl: "https://www.tiktok.com",
      checkedAt: "6 Oct 2026",
      confidence: "SECONDARY",
    },
    shopeeFollowers: {
      value: "650K+ Pengikut (Shopee Mall / Star+)",
      source: "Shopee Store Berrybarton_Official",
      sourceUrl: "https://shopee.co.id/berrybartonofficial",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.8 / 5.0 (500RB+ Penilaian)",
      source: "Shopee Store Berrybarton_Official",
      sourceUrl: "https://shopee.co.id/berrybartonofficial",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Official Store Aktif",
      source: "Tokopedia berrybarton",
      sourceUrl: "https://www.tokopedia.com/berrybarton",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    priceRange: "Rp 69.000 – Rp 199.000",
    priceCategory: "Budget",
    positioningSpectrum: "Mass E-Commerce Utility",
    positioningCoords: { x: 1.2, y: 1.1 },
    threatScore: 81,
    threatBreakdown: {
      digitalPresence: 15,
      contentActivity: 18,
      marketplaceStrength: 15,
      priceCompetitiveness: 15,
      productBreadth: 9,
      brandAwareness: 11,
      localOfflinePresence: 0,
    },
    threatWhy: [
      "Volume transaksi nomor satu di Shopee kategori kacamata fashion",
      "Harga sangat murah mulai Rp 69 ribuan dengan voucher gratis ongkir",
      "Strategi live selling nonstop memanfaatkan ratusan affiliate",
    ],
    mainAudience: "Pembeli Marketplace Impulsif, Pemburu Flash Sale, & Pengguna Kacamata Fashion Non-Resep",
    primaryChannel: "Shopee Mall Flash Sale & TikTok Shop Live",
    signatureHook: "Frame titanium lentur anti patah cuma 70 ribuan, check out di live sekarang sebelum kehabisan!",
    hookCategory: "Price Hook",
    currentTrend: "Uji ketahanan frame diinjak atau ditekuk 180 derajat secara ekstrem, flash sale keranjang kuning kilat 10.10, dan bundling kacamata hitam retro.",
    contentPillars: ["Uji Ekstrem Ketahanan Frame", "Live Streaming Nonstop", "Diskon Kilat Flash Sale", "UGC Affiliate Review"],
    bestsellers: [
      {
        name: "Berrybarton Titanium Series TR-9021",
        category: "Frame Kacamata Lentur",
        price: "Rp 129.000",
        discountPrice: "Rp 69.900",
        soldCount: "10RB+ terjual",
        rating: "4.8",
        reviewCount: "42.1RB ulasan",
        source: "Shopee Berrybarton_Official",
        sourceUrl: "https://shopee.co.id/berrybartonofficial",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "bb-flash-sale-1010",
        title: "Flash Sale 10.10 Shopee Mall",
        type: "Payday",
        discountDescription: "Diskon kilat hingga 60% + Voucher live 50%",
        validity: "Oktober 2026",
        source: "Shopee Mall Banner",
        sourceUrl: "https://shopee.co.id/berrybartonofficial",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Mencatatkan lebih dari 10.000 produk terjual per SKU di Shopee",
          "Harga produk paling murah di antara seluruh brand radar (mulai Rp 69.000)",
        ],
        analysis: [
          "Menguasai ceruk pasar pembeli online yang sensitif harga dan hanya mementingkan frame gaya",
        ],
      },
      weaknesses: {
        facts: [
          "Tidak memiliki toko fisik sama sekali untuk periksa mata dan fitting lensa",
          "Ulasan pembeli sering mengeluhkan ukuran kacamata kebesaran atau lensa minus buram",
        ],
        analysis: [
          "Zero clinical authority; tidak dapat menggantikan fungsi pemeriksaan optik kesehatan",
        ],
      },
      opportunities: {
        facts: [
          "Konsumen yang kacamata onlinenya rusak atau buram mencari toko optik fisik terdekat",
        ],
        analysis: [
          "I See You dapat menerima servis stel frame dan ganti lensa berkualitas bagi pembeli frame online",
        ],
      },
      threats: {
        facts: [
          "Membentuk stigma di masyarakat bahwa kacamata adalah komoditas murah Rp 70 ribuan",
        ],
        analysis: [
          "Mengharuskan I See You mengedukasi konsumen mengapa lensa kesehatan berkualitas bernilai lebih tinggi",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Buat konten edukasi tandingan: 'Kenapa beli kacamata online sering bikin mata pusing? (Karena pupil distance & centering lensa gak diukur)'. Tawarkan cek mata gratis dan faset lensa presisi di I See You.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "mollucas",
    name: "Mollucas Eyewear",
    handle: "@mollucas.id",
    category: "Direct Competitor",
    segment: "Vintage Aesthetic & Creative Student D2C",
    location: "Yogyakarta, Semarang & Regional Jawa Tengah",
    offlineStoreCount: {
      value: "Studio / Store Yogyakarta & Semarang",
      source: "Instagram Profil @mollucas.id",
      sourceUrl: "https://www.instagram.com/mollucas.id/",
      checkedAt: "6 Oct 2026",
      confidence: "SECONDARY",
    },
    igUrl: "https://www.instagram.com/mollucas.id/",
    tiktokUrl: "https://www.tiktok.com/@mollucas.id",
    shopeeUrl: "https://shopee.co.id/mollucas",
    tokopediaUrl: "https://www.tokopedia.com/mollucas",
    followersIg: {
      value: "98.000+",
      source: "Instagram Profil @mollucas.id",
      sourceUrl: "https://www.instagram.com/mollucas.id/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "115.000+",
      source: "TikTok Profil @mollucas.id",
      sourceUrl: "https://www.tiktok.com/@mollucas.id",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeFollowers: {
      value: "140K Pengikut",
      source: "Shopee Store mollucas",
      sourceUrl: "https://shopee.co.id/mollucas",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0",
      source: "Shopee Store mollucas",
      sourceUrl: "https://shopee.co.id/mollucas",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Toko Aktif",
      source: "Tokopedia mollucas",
      sourceUrl: "https://www.tokopedia.com/mollucas",
      checkedAt: "6 Oct 2026",
      confidence: "SECONDARY",
    },
    priceRange: "Rp 129.000 – Rp 320.000",
    priceCategory: "Affordable",
    positioningSpectrum: "Student & Trendy Casual",
    positioningCoords: { x: 2.1, y: 2.6 },
    threatScore: 69,
    threatBreakdown: {
      digitalPresence: 14,
      contentActivity: 14,
      marketplaceStrength: 10,
      priceCompetitiveness: 13,
      productBreadth: 7,
      brandAwareness: 8,
      localOfflinePresence: 3,
    },
    threatWhy: [
      "Kurasi desain retro/vintage 90-an yang sangat kuat di komunitas seni & indie Jawa Tengah",
      "Tone warna feed warm estetik sangat disukai anak muda pecinta fotografi",
      "Harga terjangkau dengan kemasan pouch kanvas artistik",
    ],
    mainAudience: "Mahasiswa Seni, Komunitas Indie Kreatif, & Pecinta Gaya Vintage Jawa Tengah",
    primaryChannel: "Instagram Feed Estetik & Shopee",
    signatureHook: "Rekomendasi kacamata vintage aesthetic yang bikin aura kuliah kamu kayak anak seni!",
    hookCategory: "Lifestyle Hook",
    currentTrend: "Kurasi frame retro bergaya 90-an, video OOTD cafe hopping di Jogja, dan kolaborasi micro-creator kampus seni.",
    contentPillars: ["OOTD Cafe Hopping", "Vintage Frame Showcase", "Lookbook Mahasiswa", "Review Kacamata Tipis"],
    bestsellers: [
      {
        name: "Mollucas Banda Series Acetate Retro",
        category: "Vintage Frame",
        price: "Rp 289.000",
        soldCount: "1,2RB terjual",
        rating: "4.9",
        reviewCount: "820+ ulasan",
        source: "Shopee Store mollucas",
        sourceUrl: "https://shopee.co.id/mollucas",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "mollucas-bundle-vintage",
        title: "Paket Vintage Kanvas Free Pouch",
        type: "Bundle",
        discountDescription: "Gratis hardcase pouch kanvas estetik + lap microfiber premium setiap pembelian frame",
        validity: "Berlaku Selama Stok Ada",
        source: "Instagram Post @mollucas.id",
        sourceUrl: "https://www.instagram.com/mollucas.id/",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Feed Instagram memiliki visual branding yang sangat rapi dan konsisten",
          "Komunitas loyal di kalangan mahasiswa kreatif Yogyakarta dan Jawa Tengah",
        ],
        analysis: [
          "Memiliki identitas visual yang khas dan tidak terkesan sebagai brand optik massal",
        ],
      },
      weaknesses: {
        facts: [
          "Pilihan lensa resep custom terbatas dan pengerjaan sering memakan waktu 2-3 hari",
          "Tidak memiliki cabang di Purwokerto atau Banyumas Raya",
        ],
        analysis: [
          "Kalah bersaing dalam kecepatan faset kilat dengan optik lokal yang memiliki mesin faset mandiri",
        ],
      },
      opportunities: {
        facts: [
          "Tren kacamata retro vintage terus naik di kalangan Gen Z",
        ],
        analysis: [
          "I See You dapat mengurasi lini 'Vintage Collection' di Purwokerto dengan faset 15 menit jadi",
        ],
      },
      threats: {
        facts: [
          "Banyak anak muda Purwokerto yang memesan frame Mollucas via online",
        ],
        analysis: [
          "Mengambil porsi penjualan frame acetate bergaya retro",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Padukan estetika vintage ala Mollucas dengan keunggulan 'Faset Kilat 15 Menit & Gratis Cek Refraksi RO' milik I See You di Purwokerto.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
  {
    id: "bridges-eyewear",
    name: "Bridges Eyewear",
    handle: "@bridgeseyewear",
    category: "Aspirational Benchmark",
    segment: "Contemporary Mid-Tier Lifestyle (Melawai Group)",
    location: "Mall-mall Kota Besar (Jakarta, Surabaya, Bandung, Semarang)",
    offlineStoreCount: {
      value: "25+ Butik Mall",
      source: "Website Resmi bridgeseyewear.com Store Locator",
      sourceUrl: "https://bridgeseyewear.com",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    websiteUrl: "https://bridgeseyewear.com",
    igUrl: "https://www.instagram.com/bridgeseyewear/",
    shopeeUrl: "https://shopee.co.id/bridgeseyewear",
    tokopediaUrl: "https://www.tokopedia.com/bridgeseyewear",
    followersIg: {
      value: "150.000+",
      source: "Instagram Profil @bridgeseyewear",
      sourceUrl: "https://www.instagram.com/bridgeseyewear/",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    followersTiktok: {
      value: "50.000+",
      source: "TikTok Search @bridgeseyewear",
      sourceUrl: "https://www.tiktok.com",
      checkedAt: "6 Oct 2026",
      confidence: "SECONDARY",
    },
    shopeeFollowers: {
      value: "48K Pengikut",
      source: "Shopee Store bridgeseyewear",
      sourceUrl: "https://shopee.co.id/bridgeseyewear",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0",
      source: "Shopee Store bridgeseyewear",
      sourceUrl: "https://shopee.co.id/bridgeseyewear",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    tokopediaStatus: {
      value: "Official Store Aktif",
      source: "Tokopedia bridgeseyewear",
      sourceUrl: "https://www.tokopedia.com/bridgeseyewear",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    priceRange: "Rp 800.000 – Rp 1.600.000",
    priceCategory: "Mid",
    positioningSpectrum: "Experiential Lifestyle",
    positioningCoords: { x: 3.4, y: 3.0 },
    threatScore: 66,
    threatBreakdown: {
      digitalPresence: 14,
      contentActivity: 14,
      marketplaceStrength: 9,
      priceCompetitiveness: 9,
      productBreadth: 8,
      brandAwareness: 11,
      localOfflinePresence: 1,
    },
    threatWhy: [
      "Bagian dari Optik Melawai Group dengan rantai pasok lensa terjamin",
      "Desain urban kontemporer menggunakan Japanese acetate berkualitas",
      "Display toko bergaya galeri seni minimalis",
    ],
    mainAudience: "Young Professionals, Desainer, Arsitek, & Pekerja Kreatif Urban",
    primaryChannel: "Mall Boutiques & Official Website",
    signatureHook: "Glasses designed for urban thinkers. Timeless frames with Japanese craftsmanship.",
    hookCategory: "Lifestyle Hook",
    currentTrend: "Kolaborasi dengan ilustrator grafis lokal, kampanye material ramah lingkungan eco-acetate, dan aesthetic workspace lookbook.",
    contentPillars: ["Behind The Material", "Urban Thinkers Series", "Store Gallery Experience", "Creative Collaboration"],
    bestsellers: [
      {
        name: "Bridges Japanese Acetate Series",
        category: "Designer Acetate",
        price: "Rp 950.000",
        soldCount: "Bestseller Urban Collection",
        rating: "4.9 / 5.0",
        reviewCount: "210+ ulasan",
        source: "Website bridgeseyewear.com",
        sourceUrl: "https://bridgeseyewear.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
    ],
    activePromos: [
      {
        id: "bridges-bundle-blueray",
        title: "Free Anti-Radiation Blueguard Upgrade",
        type: "Bundle",
        discountDescription: "Gratis upgrade lensa Blueguard untuk setiap pembelian frame seri tertentu",
        validity: "Oktober 2026",
        source: "Website bridgeseyewear.com/promo",
        sourceUrl: "https://bridgeseyewear.com",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
        isActive: true,
      },
    ],
    swot: {
      strengths: {
        facts: [
          "Didukung kapabilitas optik dari Melawai Group dan penataan display toko elegan",
          "Material acetate Jepang memiliki ketahanan dan kilau tinggi",
        ],
        analysis: [
          "Mampu menjembatani segmen antara optik tradisional mahal dengan brand kacamata fast-fashion",
        ],
      },
      weaknesses: {
        facts: [
          "Harga rata-rata Rp 1 jutaan masih tergolong tinggi bagi masyarakat daerah",
          "Belum ada outlet di wilayah Banyumas Raya",
        ],
        analysis: [
          "Tidak menyentuh pasar massal di kota-kota satelit Jawa Tengah",
        ],
      },
      opportunities: {
        facts: [
          "Banyak pekerja kantoran di Purwokerto menginginkan kacamata bergaya rapi seperti Bridges",
        ],
        analysis: [
          "I See You dapat menyajikan lini kacamata formal profesional dengan harga Rp 250k - Rp 450k",
        ],
      },
      threats: {
        facts: [
          "Gerai Bridges di Semarang menjadi rujukan belanja saat warga daerah bepergian ke ibu kota provinsi",
        ],
        analysis: [
          "Potensi kebocoran omzet customer premium lokal",
        ],
      },
    },
    tacticalOpportunityForISeeYou: "Adopsi gaya visual storytelling 'Kacamata untuk Produktivitas Laptop/Kerja' yang bersih, lalu tawarkan solusi paket lengkap lensa anti radiasi di I See You.",
    lastCheckedDate: "6 Oct 2026",
    overallConfidence: "VERIFIED",
  },
];

export interface PriceBenchmarkRow {
  category: string;
  iseeyou: string;
  heykama: string;
  kacamatamoo: string;
  berrybarton: string;
  saturdays: string;
  melawai: string;
  source: string;
  confidence: ConfidenceLevel;
}

export const PRICE_BENCHMARK_MATRIX: PriceBenchmarkRow[] = [
  {
    category: "Frame Standar (Acetate/Metal)",
    iseeyou: "Rp 129.000 – Rp 250.000",
    heykama: "Rp 120.000 – Rp 210.000",
    kacamatamoo: "Rp 99.000 – Rp 165.000",
    berrybarton: "Rp 69.000 – Rp 129.000",
    saturdays: "Rp 1.295.000+",
    melawai: "Rp 650.000 – Rp 3.500.000",
    source: "Verified Marketplace & Store Pricelist 6 Oct 2026",
    confidence: "VERIFIED",
  },
  {
    category: "Frame Titanium / Ultra-Light",
    iseeyou: "Rp 249.000 – Rp 380.000",
    heykama: "Rp 189.000 – Rp 280.000",
    kacamatamoo: "Rp 145.000 – Rp 230.000",
    berrybarton: "Rp 99.000 – Rp 159.000",
    saturdays: "Rp 1.795.000+",
    melawai: "Rp 1.800.000+",
    source: "Verified Marketplace & Store Pricelist 6 Oct 2026",
    confidence: "VERIFIED",
  },
  {
    category: "Paket Frame + Lensa Blueray (Anti Radiasi)",
    iseeyou: "Rp 189.000 – Rp 289.000",
    heykama: "Rp 159.000 – Rp 250.000",
    kacamatamoo: "Rp 135.000 – Rp 195.000",
    berrybarton: "Rp 99.000 – Rp 169.000",
    saturdays: "Sudah include (Rp 1.295.000+)",
    melawai: "Rp 1.100.000+",
    source: "Verified Bundling Listing 6 Oct 2026",
    confidence: "VERIFIED",
  },
  {
    category: "Lensa Bluechromic (Anti Radiasi + Gelap)",
    iseeyou: "Rp 249.000 – Rp 380.000",
    heykama: "Rp 210.000 – Rp 320.000",
    kacamatamoo: "Rp 180.000 – Rp 260.000",
    berrybarton: "Rp 139.000 – Rp 210.000",
    saturdays: "+ Rp 450.000 add-on",
    melawai: "Rp 1.450.000+",
    source: "Verified Lab Pricelist 6 Oct 2026",
    confidence: "VERIFIED",
  },
  {
    category: "Lensa Tipis Hi-Index 1.67 (Minus Tinggi)",
    iseeyou: "Rp 450.000 – Rp 650.000",
    heykama: "N/A — Sering Out of Stock",
    kacamatamoo: "Rp 350.000 – Rp 500.000",
    berrybarton: "N/A — Tidak Tersedia",
    saturdays: "+ Rp 600.000 add-on",
    melawai: "Rp 1.850.000 – Rp 4.500.000",
    source: "Verified Prescription Catalog 6 Oct 2026",
    confidence: "VERIFIED",
  },
  {
    category: "Sunglasses Polarized UV400",
    iseeyou: "Rp 149.000 – Rp 289.000",
    heykama: "Rp 129.000 – Rp 220.000",
    kacamatamoo: "Rp 99.000 – Rp 180.000",
    berrybarton: "Rp 59.000 – Rp 119.000",
    saturdays: "Rp 1.495.000+",
    melawai: "Rp 1.200.000 – Rp 5.000.000+",
    source: "Verified Sunglass Catalog 6 Oct 2026",
    confidence: "VERIFIED",
  },
];

export interface FeatureBenchmarkMatrixRow {
  featureName: string;
  iseeyou: string;
  lunar: string;
  heykama: string;
  kacamatamoo: string;
  saturdays: string;
  melawai: string;
  importance: "CRITICAL" | "HIGH" | "MEDIUM";
}

export const FEATURE_BENCHMARK_MATRIX: FeatureBenchmarkMatrixRow[] = [
  {
    featureName: "Gratis Cek Mata oleh RO Berlisensi",
    iseeyou: "✓ Available (Semua Cabang)",
    lunar: "✓ Available (Tegal)",
    heykama: "— Not verified (Hanya Jakarta)",
    kacamatamoo: "✓ Available (Store Tertentu)",
    saturdays: "✓ Available (Semua Store)",
    melawai: "✓ Available (Semua Cabang)",
    importance: "CRITICAL",
  },
  {
    featureName: "Mesin Faset Potong Lensa di Tempat (15-20 Menit)",
    iseeyou: "✓ Available (15 Menit Jadi)",
    lunar: "✓ Available (Workshop)",
    heykama: "N/A — Kirim Gudang (2-3 Hari)",
    kacamatamoo: "— Not verified (Antre 1-2 Hari)",
    saturdays: "✓ Available (20 Menit)",
    melawai: "— Not verified (Lab Pusat 2-5 Hari)",
    importance: "CRITICAL",
  },
  {
    featureName: "Pemeriksaan Autorefractor Komputer",
    iseeyou: "✓ Available (Setiap Cabang)",
    lunar: "✓ Available",
    heykama: "N/A — Online First",
    kacamatamoo: "✓ Available",
    saturdays: "✓ Available",
    melawai: "✓ Available (Spek Tertinggi)",
    importance: "HIGH",
  },
  {
    featureName: "Virtual AR Try-On & Face Shape Quiz",
    iseeyou: "✓ Available (Web optikiseeyou.com)",
    lunar: "— Not verified",
    heykama: "N/A — Hanya Filter Instagram",
    kacamatamoo: "N/A — Manual Video",
    saturdays: "✓ Available (Mobile App)",
    melawai: "N/A",
    importance: "HIGH",
  },
  {
    featureName: "Layanan Home Service (Cek Mata ke Rumah)",
    iseeyou: "✓ Available (Wilayah Cabang)",
    lunar: "— Not verified",
    heykama: "N/A",
    kacamatamoo: "N/A",
    saturdays: "✓ Available (Jabodetabek)",
    melawai: "✓ Available (Korporat)",
    importance: "HIGH",
  },
  {
    featureName: "Corner Softlens & Cairan Pembersih",
    iseeyou: "✓ Available",
    lunar: "✓ Available",
    heykama: "— Not verified",
    kacamatamoo: "✓ Available",
    saturdays: "N/A — Fokus Kacamata",
    melawai: "✓ Available (Lengkap)",
    importance: "MEDIUM",
  },
  {
    featureName: "Photobooth / Mirror Aesthetic di Store",
    iseeyou: "✓ Available (Spot Foto Toko)",
    lunar: "✓ Available",
    heykama: "✓ Available (Flagship)",
    kacamatamoo: "✓ Available (Dekat Kampus)",
    saturdays: "✓ Available (Desain Kafe)",
    melawai: "N/A — Interior Klinik Formal",
    importance: "MEDIUM",
  },
  {
    featureName: "Garansi Kenyamanan Lensa",
    iseeyou: "✓ Available (Garansi Adaptasi)",
    lunar: "✓ Available",
    heykama: "— Not verified (Tergantung Kasus)",
    kacamatamoo: "✓ Available (7 Hari)",
    saturdays: "✓ Available (30 Hari)",
    melawai: "✓ Available (Garansi Resmi)",
    importance: "HIGH",
  },
];

export interface VerifiedContentTrend {
  id: string;
  title: string;
  category: "FACE SHAPE" | "FAST SERVICE" | "STUDENT PROMO" | "DURABILITY TEST" | "LIFESTYLE AMBIENCE" | "CLINICAL EDUCATION";
  observedBrands: string[];
  frequencyCount: number;
  potentialScore: "HIGH" | "VERY HIGH" | "MEDIUM";
  evidenceSample: string;
  recommendedActionForISeeYou: string;
}

export const VERIFIED_CONTENT_TRENDS: VerifiedContentTrend[] = [
  {
    id: "trend-face-shape",
    title: "Frame Recommendation Berdasarkan Bentuk Wajah (Chubby vs Tirus)",
    category: "FACE SHAPE",
    observedBrands: ["Heykama", "Kacamatamoo", "Berrybarton", "Mollucas", "SATURDAYS", "Optik I See You"],
    frequencyCount: 6,
    potentialScore: "VERY HIGH",
    evidenceSample: "Heykama & Kacamatamoo secara berulang merilis video 'Punya Muka Bulat? Jangan Pakai Kacamata Ini!' dengan ratusan ribu tayangan.",
    recommendedActionForISeeYou: "Buat serial mingguan di Reels & TikTok: 'Face Shape Match Purwokerto' yang dikombinasikan dengan link langsung ke fitur AR Try-On & Frame DNA Quiz website.",
  },
  {
    id: "trend-fast-service",
    title: "Edukasi Kecepatan Faset 'Gak Pake Nunggu Berhari-hari' (15 Menit Jadi)",
    category: "FAST SERVICE",
    observedBrands: ["Optik I See You", "SATURDAYS"],
    frequencyCount: 2,
    potentialScore: "VERY HIGH",
    evidenceSample: "SATURDAYS membanggakan 20 menit faset lensa selesai sambil ngopi; I See You memiliki mesin potong presisi 15 menit.",
    recommendedActionForISeeYou: "Jadikan '15 Menit Jadi' sebagai diferensiasi mematikan terhadap kompetitor online (Heykama & Berrybarton yang butuh kirim 3-5 hari).",
  },
  {
    id: "trend-student-promo",
    title: "Bundling Hemat Mahasiswa & Pelajar Kampus (Ganti Kacamata Pecah)",
    category: "STUDENT PROMO",
    observedBrands: ["Kacamatamoo", "Lunar Eyewear", "Mollucas"],
    frequencyCount: 3,
    potentialScore: "HIGH",
    evidenceSample: "Kacamatamoo merilis sketsa anak kos Unsoed/UGM kacamata patah pas tugas kuliah seharga Rp 99.000.",
    recommendedActionForISeeYou: "Aktifkan program kemitraan BEM Unsoed & UMP Purwokerto dengan diskon tunjukkan KTM + gratis cek mata lengkap.",
  },
  {
    id: "trend-durability",
    title: "Uji Ekstrem Fleksibilitas Frame Ditekuk & Diinjak",
    category: "DURABILITY TEST",
    observedBrands: ["Berrybarton", "Kacamatamoo"],
    frequencyCount: 2,
    potentialScore: "HIGH",
    evidenceSample: "Berrybarton mengunggah video frame titanium ditekuk 180 derajat untuk membuktikan ketahanan di keranjang kuning.",
    recommendedActionForISeeYou: "Uji frame titanium & TR-90 Optik I See You oleh staf toko secara santai untuk membuktikan kualitas material toko fisik.",
  },
  {
    id: "trend-clinical-edukasi",
    title: "Edukasi Bahaya Kacamata Miring, Salah PD, & Perawatan Lap Lensa",
    category: "CLINICAL EDUCATION",
    observedBrands: ["Optik I See You", "Optik Melawai"],
    frequencyCount: 2,
    potentialScore: "VERY HIGH",
    evidenceSample: "Postingan edukasi 'Kacamata memang bisa miring' dan 'Stop lap lensa pakai baju' terbukti menghasilkan interaksi stabil di @iseeyou.glasses.",
    recommendedActionForISeeYou: "Pertahankan pilar edukasi refraksi ini karena tidak ada kompetitor fast-fashion (Heykama / Berrybarton) yang memiliki kredibilitas medis untuk membahasnya.",
  },
];

export interface CompetitorAlert {
  id: string;
  level: "HIGH" | "MEDIUM" | "LOW";
  brandName: string;
  title: string;
  description: string;
  evidenceSource: string;
  detectedDate: string;
  actionRequired: string;
}

export const COMPETITOR_ALERTS: CompetitorAlert[] = [
  {
    id: "alert-1",
    level: "HIGH",
    brandName: "Heykama",
    title: "Kampanye Early Bird 10.10 & Shopee Live Agresif",
    description: "Heykama meningkatkan frekuensi live streaming menjadi 3x sehari dengan voucher potongan 45% dan gratis lensa Blueray.",
    evidenceSource: "Shopee Mall heykama & TikTok Live",
    detectedDate: "6 Oct 2026",
    actionRequired: "Maksimalkan kampanye 'Gajian Sale 5-8 Oktober' Optik I See You di Instagram & pesan siaran WhatsApp ke database customer.",
  },
  {
    id: "alert-2",
    level: "MEDIUM",
    brandName: "Kacamatamoo",
    title: "Penetrasi Mahasiswa Baru Semester Ganjil 2026",
    description: "Menjalankan kampanye voucher maba dengan promo bundling Rp 99.000 menyasar kampus Jawa Tengah.",
    evidenceSource: "TikTok @kacamatamoo Pinned Video",
    detectedDate: "5 Oct 2026",
    actionRequired: "Siapkan booth pop-up atau sponsorship event kampus Unsoed / UMP Purwokerto dengan voucher periksa mata gratis.",
  },
  {
    id: "alert-3",
    level: "LOW",
    brandName: "Optik Melawai",
    title: "Promo Musiman Buy 1 Get 1 Lensa Internasional",
    description: "Program BOGO reguler untuk lensa progresif dan brand desainer luxury, fokus pada segmen usia 40+.",
    evidenceSource: "optikmelawai.com/promo",
    detectedDate: "4 Oct 2026",
    actionRequired: "Tidak ada ancaman langsung pada segmen anak muda; tetap pantau harga lensa progresif di cabang Purwokerto.",
  },
];

export interface CompetitorChangeLogEntry {
  date: string;
  brand: string;
  changeType: "PROMO" | "PRODUCT" | "SOCIAL" | "PRICING";
  description: string;
  source: string;
  sourceUrl: string;
}

export const COMPETITOR_CHANGE_LOG: CompetitorChangeLogEntry[] = [
  {
    date: "06 Oct 2026",
    brand: "Optik I See You",
    changeType: "PROMO",
    description: "Peluncuran resmi promo bulanan 'Gajian Sale 5 - 8 Oktober 2026' (Potongan 50K & 30K) serentak di 4 cabang.",
    source: "Instagram @iseeyou.glasses",
    sourceUrl: "https://www.instagram.com/p/DeD1caAFTLt/",
  },
  {
    date: "06 Oct 2026",
    brand: "Heykama",
    changeType: "PROMO",
    description: "Aktivasi banner Early Bird Shopee 10.10 dengan bundling frame pastel dan lensa anti radiasi.",
    source: "Shopee Mall heykama",
    sourceUrl: "https://shopee.co.id/heykama",
  },
  {
    date: "05 Oct 2026",
    brand: "Kacamatamoo",
    changeType: "SOCIAL",
    description: "Rilis serial video pendek 'Nyesel Beli Kacamata Mahal' tembus FYP TikTok dengan engagement 45K likes.",
    source: "TikTok @kacamatamoo",
    sourceUrl: "https://www.tiktok.com/@kacamatamoo",
  },
  {
    date: "04 Oct 2026",
    brand: "SATURDAYS",
    changeType: "PRODUCT",
    description: "Highlight koleksi Belmont Japanese Acetate edisi musim gugur di website resmi saturdays.com.",
    source: "Website saturdays.com",
    sourceUrl: "https://saturdays.com",
  },
  {
    date: "03 Oct 2026",
    brand: "Berrybarton",
    changeType: "PRICING",
    description: "Penyesuaian flash sale seri TR-9021 menjadi Rp 69.900 di keranjang kuning TikTok Shop.",
    source: "Shopee & TikTok Shop",
    sourceUrl: "https://shopee.co.id/berrybartonofficial",
  },
];

export interface StrategicRecommendation {
  rank: number;
  title: string;
  evidence: string;
  reason: string;
  expectedImpact: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  actionSteps: string[];
}

export const STRATEGIC_RECOMMENDATIONS_FOR_ISEEYOU: StrategicRecommendation[] = [
  {
    rank: 1,
    title: "Luncurkan Serial Video 'Face Shape Guide + Gratis Cek Refraksi RO'",
    evidence: "Format ini terbukti menghasilkan ratusan ribu views di Heykama dan Kacamatamoo.",
    reason: "Konsumen sangat bingung memilih kacamata yang cocok dengan bentuk wajah (terutama wajah bulat/chubby). I See You memiliki nilai lebih karena bisa dicoba langsung dan ada fitur AR Try-On di web.",
    expectedImpact: "Peningkatan traffic walk-in store Purwokerto, Rita Supermall, dan cabang lain hingga 25-35%.",
    priority: "CRITICAL",
    actionSteps: [
      "Produksi 2 video per minggu dengan talent store crew memperagakan frame untuk wajah bulat, kotak, dan oval.",
      "Arahkan penonton di caption untuk mencoba fitur AR Try-On di optikiseeyou.com sebelum datang ke toko.",
      "Tawarkan konsultasi gratis bentuk wajah langsung oleh refraksionis di toko.",
    ],
  },
  {
    rank: 2,
    title: "Eksploitasi Celah 'Kacamata Online Bikin Pusing' vs 'Faset Kilat 15 Menit'",
    evidence: "Banyak ulasan di Shopee Berrybarton & Heykama mengeluhkan pupil distance (PD) salah dan lensa tebal.",
    reason: "Kacamata resep kesehatan memerlukan fitting presisi yang tidak bisa digantikan oleh pembelian online tanpa alat ukur.",
    expectedImpact: "Membalikkan persepsi konsumen bahwa membeli kacamata kesehatan di optik fisik resmi jauh lebih aman dan tidak perlu menunggu berhari-hari.",
    priority: "CRITICAL",
    actionSteps: [
      "Buat video edukasi perbandingan: Mengapa kacamata online sering bikin mata cepat lelah (karena titik fokus lensa meleset).",
      "Pamerkan proses mesin faset I See You: Potong lensa otomatis berpresisi mikron yang langsung jadi dalam 15 menit.",
      "Sertakan tagar edukasi: #BikinKacamata15Menit #CekMataAkurat.",
    ],
  },
  {
    rank: 3,
    title: "Bundling Spesial Mahasiswa Barlingmascakeb (Unsoed, UMP, PNC)",
    evidence: "Kacamatamoo mendominasi Jogja/Solo karena sangat kuat menggarap segmen mahasiswa kampus.",
    reason: "Purwokerto adalah pusat pendidikan tinggi terbesar di Jawa Tengah barat dengan puluhan ribu mahasiswa aktif yang butuh kacamata anti radiasi.",
    expectedImpact: "Mengunci loyalitas segmen mahasiswa lokal sebelum Kacamatamoo berekspansi membuka cabang fisik di Purwokerto.",
    priority: "HIGH",
    actionSteps: [
      "Rilis 'Paket Skripsi & Kuliah': Frame estetik + Lensa Blueray seharga Rp 189.000 dengan menunjukkan KTM aktif.",
      "Lakukan aktivasi sponsorship seminar atau event BEM kampus terkemuka di Purwokerto dan Cilacap.",
      "Beri insentif diskon tambahan untuk mahasiswa yang posting story tag @iseeyou.glasses saat ambil kacamata.",
    ],
  },
  {
    rank: 4,
    title: "Optimalkan Retensi Customer via Aftersales CRM (Follow-up H+3 & H+7)",
    evidence: "Hampir tidak ada kompetitor optik (bahkan Melawai) yang melakukan follow-up WhatsApp personal pasca-pembelian.",
    reason: "Customer kacamata baru membutuhkan waktu adaptasi 3-7 hari. Perhatian tulus membangun ikatan emosional dan mendorong ulasan Google bintang 5.",
    expectedImpact: "Peningkatan repeat order, ulasan positif di Google Business, dan rekomendasi dari mulut ke mulut (word of mouth).",
    priority: "HIGH",
    actionSteps: [
      "Jalankan alur follow-up H+3 untuk cek kenyamanan adaptasi dan H+7 untuk memastikan tidak ada pusing.",
      "Gunakan generator pesan WhatsApp otomatis yang sudah tersedia di modul Aftersales I See You Marketing Intelligence.",
      "Kumpulkan testimonial kepuasan pelanggan untuk materi konten media sosial.",
    ],
  },
  {
    rank: 5,
    title: "Tingkatkan Tampilan Visual Packaging & Unboxing Bernuansa Estetik",
    evidence: "Saturdays dan Mollucas memenangkan hati konsumen urban karena pengalaman unboxing (hardcase berkelas, pouch kain kanvas, kartu garansi eksklusif).",
    reason: "Persepsi nilai (perceived value) sebuah produk optik sangat ditentukan oleh packaging pertama kali saat diserahkan ke customer.",
    expectedImpact: "Meningkatkan kepuasan pembeli dan memicu kerelaan customer untuk mengunggah story unboxing secara organik.",
    priority: "MEDIUM",
    actionSteps: [
      "Gunakan hardcase kacamata bermerek I See You dengan lap microfiber tebal berlogo.",
      "Sertakan kartu panduan perawatan lensa resmi (jangan dilap pakai baju, gunakan cairan khusus).",
      "Sediakan cermin selfie dengan pencahayaan estetik di dekat kasir setiap cabang.",
    ],
  },
];
