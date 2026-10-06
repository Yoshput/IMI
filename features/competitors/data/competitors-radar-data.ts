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
      value: "N/A - Fokus Offline & Social D2C",
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
      value: "N/A - Channel Tidak Aktif",
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
      value: "N/A - Direct Store & Social",
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
    priceRange: "Rp 92.500 - Rp 284.000 (Shopee Mall)",
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
      "Koleksi frame kotak Hajime & Najio serta cat eye Sora/Miki sangat kuat di audiens wanita muda",
    ],
    mainAudience: "Gen Z Perempuan, Mahasiswi, dan First Jobber Pecinta Estetika Korea",
    primaryChannel: "Shopee Mall, TikTok Shop Live, & Instagram Reels",
    signatureHook: "Punya muka bulat/chubby? Stop pilih frame kacamata kotak kaku, tonton rekomendasi ini sampai habis!",
    hookCategory: "Face Shape Hook",
    currentTrend: "Kurasi frame 'Anti Wajah Bulat', kampanye 10.10 Sneak Peek di Shopee, dan live streaming bundling frame + lensa blueray.",
    contentPillars: ["Face Shape Matching", "Try-On Frame Pastel", "OOTD Korean Style", "Shopee Live Flash Sale"],
    bestsellers: [
      {
        name: "heykama - Hajime (Frame Kacamata Square)",
        category: "Frame Kacamata Kotak",
        price: "Rp 284.000",
        discountPrice: "Rp 284.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "20RB+ ulasan",
        source: "Shopee Mall heykama",
        sourceUrl: "https://shopee.co.id/search?keyword=heykama%20hajime",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "heykama - Frame Kacamata Najio - Sunyata",
        category: "Frame Kacamata Ramping",
        price: "Rp 225.000",
        discountPrice: "Rp 225.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "15RB+ ulasan",
        source: "Shopee Mall heykama",
        sourceUrl: "https://shopee.co.id/search?keyword=heykama%20najio",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "heykama - Frame Kacamata Sora (Cat Eye)",
        category: "Frame Kacamata Wanita",
        price: "Rp 120.000",
        discountPrice: "Rp 120.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "12RB+ ulasan",
        source: "Shopee Mall heykama",
        sourceUrl: "https://shopee.co.id/search?keyword=heykama%20sora",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "heykama - Frame Kacamata Yoka (Rectangle)",
        category: "Frame Kacamata Persegi",
        price: "Rp 92.500",
        discountPrice: "Rp 92.500",
        soldCount: "7RB+ terjual",
        rating: "4.9",
        reviewCount: "8RB+ ulasan",
        source: "Shopee Mall heykama",
        sourceUrl: "https://shopee.co.id/search?keyword=heykama%20yoka",
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
    priceRange: "Rp 100.000 - Rp 300.000 (Shopee Official)",
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
      "Katalog lensa Bluechromic Rp 300.000, Blueray Rp 180.000, dan CRMC Rp 100.000 masing-masing 10RB+ terjual di Shopee",
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
        name: "KACAMATAMOO Frame Kacamata Unisex TR90",
        category: "Frame Kacamata Ringan",
        price: "Rp 199.000",
        discountPrice: "Rp 199.000",
        soldCount: "Katalog Frame TR90 Terlaris",
        rating: "4.9",
        reviewCount: "12RB+ ulasan",
        source: "Shopee KACAMATAMOO Official Shop",
        sourceUrl: "https://shopee.co.id/search?keyword=kacamatamoo%20unisex%20tr90",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "KACAMATAMOO Paket Lensa Bluechromic Anti Radiasi",
        category: "Paket Lensa Resep",
        price: "Rp 300.000",
        discountPrice: "Rp 300.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "25RB+ ulasan",
        source: "Shopee KACAMATAMOO Official Shop",
        sourceUrl: "https://shopee.co.id/search?keyword=kacamatamoo%20bluechromic",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "KACAMATAMOO Paket Lensa Blueray",
        category: "Paket Lensa Antiradiasi Layar",
        price: "Rp 180.000",
        discountPrice: "Rp 180.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "18RB+ ulasan",
        source: "Shopee KACAMATAMOO Official Shop",
        sourceUrl: "https://shopee.co.id/search?keyword=kacamatamoo%20blueray",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "KACAMATAMOO Paket Lensa CRMC Anti Radiasi Standar",
        category: "Paket Lensa Hemat",
        price: "Rp 100.000",
        discountPrice: "Rp 100.000",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "15RB+ ulasan",
        source: "Shopee KACAMATAMOO Official Shop",
        sourceUrl: "https://shopee.co.id/search?keyword=kacamatamoo%20crmc",
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
      value: "N/A - E-Commerce First (Tanpa Jaringan Ritel Fisik Mandiri)",
      source: "Shopee Mall Berrybarton Official",
      sourceUrl: "https://shopee.co.id/berrybarton",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    igUrl: "https://www.instagram.com",
    tiktokUrl: "https://www.tiktok.com",
    shopeeUrl: "https://shopee.co.id/berrybarton?entryPoint=ShopBySearch&searchKeyword=berrybarton%20kacamata&sp_payload=fbfa4b22-88ce-486d-b46f-ebaa88a9eadb",
    tokopediaUrl: "https://www.tokopedia.com/berrybarton",
    followersIg: {
      value: "N/A - Akun Publik Terpusat Tidak Terverifikasi",
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
      source: "Shopee Store Berrybarton",
      sourceUrl: "https://shopee.co.id/berrybarton",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.8 / 5.0 (500RB+ Penilaian)",
      source: "Shopee Store Berrybarton",
      sourceUrl: "https://shopee.co.id/berrybarton",
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
    priceRange: "Rp 46.024 - Rp 144.050 (Flash Sale Shopee Mall)",
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
      "Volume transaksi sangat tinggi di Shopee kategori kacamata fashion (10RB+ terjual untuk Kacamata Hitam Kotak seharga Rp 46 ribuan)",
      "Harga flash sale agresif mulai Rp 46.024 - Rp 66.762 (diskon hingga 83%) dengan voucher gratis ongkir",
      "Pilihan produk luas di Shopee: Kacamata Hitam Kotak, Metal+PC Glasses, TR 90 Glasses lentur, dan Titanium Frames",
    ],
    mainAudience: "Pembeli Marketplace Impulsif, Pemburu Flash Sale, & Pengguna Kacamata Fashion Non-Resep",
    primaryChannel: "Shopee Mall Flash Sale & TikTok Shop Live",
    signatureHook: "Kacamata hitam anti UV cuma 46 ribuan dan frame TR 90 lentur anti patah diskon sampai 83%, checkout sekarang di Shopee Mall!",
    hookCategory: "Price Hook",
    currentTrend: "Demonstrasi kelenturan kacamata TR 90 ditekuk, flash sale Sunglasses Series (KUKU, HER, RICK) Rp 46.024, dan promo Metal+PC Glasses Rp 66.762.",
    contentPillars: ["Uji Ekstrem Ketahanan Frame", "Live Streaming Nonstop", "Diskon Kilat Flash Sale", "UGC Affiliate Review"],
    bestsellers: [
      {
        name: "Berrybarton - Kacamata Hitam Kotak Anti UV (Sunglasses Series)",
        category: "Sunglasses Outdoor",
        price: "Rp 184.000",
        discountPrice: "Rp 46.024",
        soldCount: "10RB+ terjual",
        rating: "4.9",
        reviewCount: "40RB+ ulasan",
        source: "Shopee Mall Berrybarton Official",
        sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20kacamata%20hitam%20kotak",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Berrybarton - Kacamata Anti Radiasi Metal+PC Glasses",
        category: "Frame Kacamata Antiradiasi",
        price: "Rp 392.700",
        discountPrice: "Rp 66.762",
        soldCount: "4RB+ terjual",
        rating: "4.9",
        reviewCount: "8.5RB ulasan",
        source: "Shopee Mall Berrybarton Official",
        sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20metal%20pc",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Berrybarton - Kacamata Anti Radiasi TR 90 Glasses Flexible",
        category: "Frame Lentur Ringan",
        price: "Rp 299.900",
        discountPrice: "Rp 107.998",
        soldCount: "2RB+ terjual",
        rating: "4.8",
        reviewCount: "5.1RB ulasan",
        source: "Shopee Mall Berrybarton Official",
        sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20tr%2090%20glasses",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Berrybarton - Kacamata Kotak Anti Radiasi Titanium Frames",
        category: "Frame Titanium Anti Patah",
        price: "Rp 514.200",
        discountPrice: "Rp 107.998",
        soldCount: "2RB+ terjual",
        rating: "4.8",
        reviewCount: "4.2RB ulasan",
        source: "Shopee Mall Berrybarton Official",
        sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20titanium%20frames",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Berrybarton - Kacamata Bulat Alloy Lensa Retro",
        category: "Frame Retro Bulat",
        price: "Rp 626.300",
        discountPrice: "Rp 144.050",
        soldCount: "1RB+ terjual",
        rating: "4.9",
        reviewCount: "2.1RB ulasan",
        source: "Shopee Mall Berrybarton Official",
        sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20bulat%20alloy",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Berrybarton - Kacamata Pria Kotak Bingkai Kuat",
        category: "Frame Kacamata Pria",
        price: "Rp 221.300",
        discountPrice: "Rp 79.682",
        soldCount: "3RB+ terjual",
        rating: "4.8",
        reviewCount: "5.5RB ulasan",
        source: "Shopee Mall Berrybarton Official",
        sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20kacamata%20pria%20kotak",
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
        sourceUrl: "https://shopee.co.id/berrybarton",
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
    shopeeUrl: "https://shopee.co.id/mollucaseyewear?entryPoint=ShopBySearch&searchKeyword=molucas%20kacamata&sp_payload=fe32335d-b3cc-4386-b0b0-45445ce4df06",
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
      source: "Shopee Store mollucaseyewear",
      sourceUrl: "https://shopee.co.id/mollucaseyewear",
      checkedAt: "6 Oct 2026",
      confidence: "VERIFIED",
    },
    shopeeRating: {
      value: "4.9 / 5.0",
      source: "Shopee Store mollucaseyewear",
      sourceUrl: "https://shopee.co.id/mollucaseyewear",
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
    priceRange: "Rp 938.191 - Rp 1.606.800 (Designer Premium Acetate)",
    priceCategory: "Premium",
    positioningSpectrum: "Experiential Lifestyle",
    positioningCoords: { x: 3.8, y: 3.5 },
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
      "Koleksi premium handcrafted acetate dengan penamaan seri khas nusantara (Manawa, Kaihulu, Soerabaja Turtle)",
      "Model Kaihulu Gel Clear (Rp 938.191) dan Manawa Midnight (Rp 1.312.193) memiliki rating nyaris sempurna 4.9 - 5.0 di Shopee",
      "Paket bundling mencakup Free Lensa resep dan hardcase pouch eksklusif",
    ],
    mainAudience: "Mahasiswa Seni, Komunitas Indie Kreatif, Arsitek, & Pecinta Kacamata Designer Acetate",
    primaryChannel: "Instagram Feed Estetik & Shopee Store",
    signatureHook: "Rekomendasi kacamata designer acetate high-grade yang bikin tampilan kamu berkarakter dan bold!",
    hookCategory: "Lifestyle Hook",
    currentTrend: "Kurasi frame bold acetate retro, fitting Asian-fit ergonomis, dan bundling gratis lensa.",
    contentPillars: ["OOTD Cafe Hopping", "Vintage Frame Showcase", "Lookbook Mahasiswa", "Review Kacamata Tipis"],
    bestsellers: [
      {
        name: "Mollucas - Manawa Midnight - Free Lensa",
        category: "Designer Acetate Frame",
        price: "Rp 1.958.500",
        discountPrice: "Rp 1.312.193",
        soldCount: "785 terjual",
        rating: "4.9",
        reviewCount: "500+ ulasan",
        source: "Shopee Store mollucaseyewear",
        sourceUrl: "https://shopee.co.id/search?keyword=mollucas%20manawa",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Mollucas - Kaihulu Gel Clear - Gratis Lensa",
        category: "Clear Acetate Asian Fit",
        price: "Rp 1.359.700",
        discountPrice: "Rp 938.191",
        soldCount: "463 terjual",
        rating: "5.0",
        reviewCount: "350+ ulasan",
        source: "Shopee Store mollucaseyewear",
        sourceUrl: "https://shopee.co.id/search?keyword=mollucas%20kaihulu",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Mollucas - The Designer - Soerabaja Turtle",
        category: "Artisan Tortoise Acetate",
        price: "Rp 2.142.400",
        discountPrice: "Rp 1.606.800",
        soldCount: "464 terjual",
        rating: "5.0",
        reviewCount: "320+ ulasan",
        source: "Shopee Store mollucaseyewear",
        sourceUrl: "https://shopee.co.id/search?keyword=mollucas%20soerabaja%20turtle",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Mollucas - Kaihulu Gray - Gratis Lensa",
        category: "Smokey Grey Acetate",
        price: "Rp 1.359.400",
        discountPrice: "Rp 951.580",
        soldCount: "448 terjual",
        rating: "4.9",
        reviewCount: "300+ ulasan",
        source: "Shopee Store mollucaseyewear",
        sourceUrl: "https://shopee.co.id/search?keyword=mollucas%20kaihulu",
        checkedAt: "6 Oct 2026",
        confidence: "VERIFIED",
      },
      {
        name: "Mollucas - Sumba Turtle - Gratis Lensa",
        category: "Turtle Acetate Asian Fit",
        price: "Rp 1.954.093",
        discountPrice: "Rp 1.406.947",
        soldCount: "185 terjual",
        rating: "4.9",
        reviewCount: "140+ ulasan",
        source: "Shopee Store mollucaseyewear",
        sourceUrl: "https://shopee.co.id/search?keyword=mollucas%20sumba%20turtle",
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
    iseeyou: "Rp 450.000 - Rp 650.000",
    heykama: "N/A - Sering Out of Stock",
    kacamatamoo: "Rp 350.000 - Rp 500.000",
    berrybarton: "N/A - Tidak Tersedia",
    saturdays: "+ Rp 600.000 add-on",
    melawai: "Rp 1.850.000 - Rp 4.500.000",
    source: "Verified Prescription Catalog 6 Oct 2026",
    confidence: "VERIFIED",
  },
  {
    category: "Sunglasses Polarized UV400",
    iseeyou: "Rp 149.000 - Rp 289.000",
    heykama: "Rp 129.000 - Rp 220.000",
    kacamatamoo: "Rp 99.000 - Rp 180.000",
    berrybarton: "Rp 59.000 - Rp 119.000",
    saturdays: "Rp 1.495.000+",
    melawai: "Rp 1.200.000 - Rp 5.000.000+",
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
    heykama: "Not verified (Hanya Jakarta)",
    kacamatamoo: "✓ Available (Store Tertentu)",
    saturdays: "✓ Available (Semua Store)",
    melawai: "✓ Available (Semua Cabang)",
    importance: "CRITICAL",
  },
  {
    featureName: "Mesin Faset Potong Lensa di Tempat (15-20 Menit)",
    iseeyou: "✓ Available (15 Menit Jadi)",
    lunar: "✓ Available (Workshop)",
    heykama: "N/A - Kirim Gudang (2-3 Hari)",
    kacamatamoo: "Not verified (Antre 1-2 Hari)",
    saturdays: "✓ Available (20 Menit)",
    melawai: "Not verified (Lab Pusat 2-5 Hari)",
    importance: "CRITICAL",
  },
  {
    featureName: "Pemeriksaan Autorefractor Komputer",
    iseeyou: "✓ Available (Setiap Cabang)",
    lunar: "✓ Available",
    heykama: "N/A - Online First",
    kacamatamoo: "✓ Available",
    saturdays: "✓ Available",
    melawai: "✓ Available (Spek Tertinggi)",
    importance: "HIGH",
  },
  {
    featureName: "Virtual AR Try-On & Face Shape Quiz",
    iseeyou: "✓ Available (Web optikiseeyou.com)",
    lunar: "Not verified",
    heykama: "N/A - Hanya Filter Instagram",
    kacamatamoo: "N/A - Manual Video",
    saturdays: "✓ Available (Mobile App)",
    melawai: "N/A",
    importance: "HIGH",
  },
  {
    featureName: "Layanan Home Service (Cek Mata ke Rumah)",
    iseeyou: "✓ Available (Wilayah Cabang)",
    lunar: "Not verified",
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
    heykama: "Not verified",
    kacamatamoo: "✓ Available",
    saturdays: "N/A - Fokus Kacamata",
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
    melawai: "N/A - Interior Klinik Formal",
    importance: "MEDIUM",
  },
  {
    featureName: "Garansi Kenyamanan Lensa",
    iseeyou: "✓ Available (Garansi Adaptasi)",
    lunar: "✓ Available",
    heykama: "Not verified (Tergantung Kasus)",
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
    description: "Flash sale Shopee Mall: Kacamata Hitam Kotak diskon 75% jadi Rp 46.024 dan Metal+PC diskon 83% jadi Rp 66.762.",
    source: "Shopee Mall Berrybarton Official",
    sourceUrl: "https://shopee.co.id/berrybarton",
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

// ==========================================
// RADAR INTELIJEN CABANG LOKAL (BARLINGMASCAKEB)
// Purwokerto, Purbalingga, Cilacap, Wonosobo
// ==========================================

export type CompetitorTier = "TIER_S" | "TIER_A" | "TIER_B";
export type BranchCity = "Purwokerto" | "Purbalingga" | "Cilacap" | "Wonosobo";

export interface LocalBranchCompetitor {
  id: string;
  name: string;
  city: BranchCity;
  tier: CompetitorTier;
  tierLabel: string;
  tierRank: number;
  category: string;
  address: string;
  phoneOrWa?: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  igHandle?: string;
  igUrl?: string;
  shopeeUrl?: string;
  verificationStatus: ConfidenceLevel;
  verificationNote: string;
  priceLevel: string;
  bpjsPartner: boolean;
  bpjsNote?: string;
  threatLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "WATCHLIST";
  threatScore: number; // 0 - 100
  keyStrength: string[];
  vulnerability: string[];
  threatAnalysis: string;
  actionRecommendationForISeeYou: string;
  lastCheckedDate: string;
}

export const LOCAL_BRANCH_COMPETITORS: LocalBranchCompetitor[] = [
  // ==========================================
  // TIER S - WAJIB BANGET DIPANTAU (5 BRAND)
  // ==========================================
  {
    id: "local-dunia-optic-purbalingga",
    name: "Dunia Optic (Purbalingga & Bobotsari)",
    city: "Purbalingga",
    tier: "TIER_S",
    tierLabel: "Tier S: Wajib Banget Dipantau",
    tierRank: 1,
    category: "Pemain Utama Independen Lokal",
    address: "Jl. Letjen A. Noer No. 1A, Purbalingga (Telp: 0281-891442) & Jl. Kolonel Sugiri No. 19, Bobotsari",
    phoneOrWa: "0281-891442",
    googleMapsUrl: "https://www.google.com/maps/search/Dunia+Optic+Purbalingga",
    websiteUrl: "https://linktr.ee/duniaoptic",
    igHandle: "@duniaoptic",
    igUrl: "https://www.instagram.com/duniaoptic/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi resmi: Akun Instagram @duniaoptic aktif dengan linktree cabang Purbalingga Kota dan Bobotsari.",
    priceLevel: "Budget to Mid (Rp 150K - Rp 750K)",
    bpjsPartner: false,
    bpjsNote: "Layanan optik mandiri non-BPJS komersial",
    threatLevel: "CRITICAL",
    threatScore: 92,
    keyStrength: [
      "Market leader optik independen di Purbalingga dengan basis pelanggan keluarga puluhan tahun",
      "Memiliki 2 cabang strategis di Purbalingga Kota (Jl. Letjen A. Noer) dan simpul utara (Bobotsari)",
      "Stok lensa lokal lengkap dan reputasi keakuratan kacamata diakui warga lokal",
    ],
    vulnerability: [
      "Model frame cenderung konvensional dan formal, kurang menarik bagi gen-Z/mahasiswa",
      "Belum mengadopsi faset kilat 15 menit selesai di tempat",
      "Aktivitas media sosial dan promosi digital masih sporadis",
    ],
    threatAnalysis: "Kompetitor terberat bagi Optik I See You Cabang Purbalingga (Jl. Onje). Pasien keluarga dan pekerja mapan di Purbalingga secara default datang ke Dunia Optic jika tidak ada diferensiasi kuat yang ditawarkan I See You.",
    actionRecommendationForISeeYou: "Posisikan I See You Purbalingga sebagai destinasi modern anak muda: koleksi frame Korean-style/aesthetic, faset kilat 15 menit jadi, dan gratis cek refraksi RO tanpa kewajiban beli.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-optik-melawai-purwokerto",
    name: "Optik Melawai (Purwokerto & Cilacap)",
    city: "Purwokerto",
    tier: "TIER_S",
    tierLabel: "Tier S: Wajib Banget Dipantau",
    tierRank: 2,
    category: "Incumbent / Jaringan Nasional Mall",
    address: "Purwokerto: Rita Supermall GF-42 (0281-6841918) & Jl. HR Boenyamin 57 (0815-2910-3625) | Cilacap: Jl. S. Parman RT 07/02 (0815-1956-6568)",
    phoneOrWa: "0815-8816-267 / 0815-1956-6568",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+Melawai+Purwokerto",
    websiteUrl: "https://optikmelawai.com",
    igHandle: "@optik_melawai",
    igUrl: "https://www.instagram.com/optik_melawai/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi resmi dari direktori website optikmelawai.com untuk cabang Rita Supermall, HR Boenyamin Purwokerto, dan S. Parman Cilacap.",
    priceLevel: "Premium / Mall (Rp 800K - Rp 8.000.000+)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS (Menampung klaim asuransi kesehatan swasta dan korporat perbankan/BUMN)",
    threatLevel: "CRITICAL",
    threatScore: 88,
    keyStrength: [
      "Top-of-mind brand optik nomor 1 nasional dengan kredibilitas klinis puluhan tahun",
      "Memiliki gerai langsung di lantai GF Rita Supermall dan jalan arteri kampus Unsoed (HR Boenyamin)",
      "Koleksi kacamata desainer internasional resmi (Ray-Ban, Oakley, Tommy Hilfiger, dll)",
    ],
    vulnerability: [
      "Harga sangat tinggi (rata-rata kacamata komplit Rp 1.500.000 s/d Rp 6.000.000)",
      "Proses faset lensa sering membutuhkan inden 3-7 hari kerja",
      "Kesan kaku dan intimidatif bagi kalangan mahasiswa dan anak muda beranggaran hemat",
    ],
    threatAnalysis: "Menguasai segmen premium, keluarga mapan, dan ekspatriat/pejabat korporat di Purwokerto dan kawasan industri Cilacap.",
    actionRecommendationForISeeYou: "Jadikan 'Faset Kilat 15 Menit Jadi' dan paket all-in transparan (Rp 199K - Rp 350K) sebagai diferensiasi untuk merebut pengunjung mall yang enggan membayar jutaan rupiah di Melawai.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-optik-seis-purwokerto",
    name: "Optik Seis (Rita Supermall Purwokerto)",
    city: "Purwokerto",
    tier: "TIER_S",
    tierLabel: "Tier S: Wajib Banget Dipantau",
    tierRank: 3,
    category: "Incumbent / Jaringan Nasional Mall",
    address: "Rita Supermall Purwokerto, Lantai Ground Floor (GF) Unit 43, Jl. Jend. Sudirman No. 296, Purwokerto",
    phoneOrWa: "0281-7773559 / WA: 0811-1928-898",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+Seis+Rita+Supermall+Purwokerto",
    websiteUrl: "https://optikseis.com",
    igHandle: "@optikseis",
    igUrl: "https://www.instagram.com/optikseis/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi resmi pada direktori tenant Rita Supermall GF-43 dan store locator optikseis.com.",
    priceLevel: "Premium / Mall (Rp 800K - Rp 7.000.000+)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS komersial ritel",
    threatLevel: "HIGH",
    threatScore: 85,
    keyStrength: [
      "Lokasi berdampingan langsung di lantai GF Rita Supermall dengan display luxury elegan",
      "Katalog kacamata branded internasional lengkap dan promosi kartu kredit perbankan",
      "Pelayanan pramuniaga berpengalaman dan suasana gerai mewah",
    ],
    vulnerability: [
      "Harga tidak terjangkau bagi mayoritas mahasiswa Unsoed, UMP, dan Telkom Purwokerto",
      "Tidak menyediakan layanan potong lensa faset kilat 15 menit langsung di tempat",
      "Komunikasi promosi terpusat dari Jakarta, kurang menyapa dinamika lokal Banyumas",
    ],
    threatAnalysis: "Pesaing langsung gerai I See You di koridor GF Rita Supermall. Pasien yang keluar dari Seis karena kendala harga merupakan target konversi emas untuk I See You.",
    actionRecommendationForISeeYou: "Posisikan gerai I See You Rita Supermall dengan signage visual yang ramah anak muda, harga paket transparan, dan jaminan faset kilat 15 menit langsung bawa pulang.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-dr-specs-purwokerto",
    name: "Dr. Specs (Rita Supermall Purwokerto)",
    city: "Purwokerto",
    tier: "TIER_S",
    tierLabel: "Tier S: Wajib Banget Dipantau",
    tierRank: 4,
    category: "Incumbent / Jaringan Nasional Mall",
    address: "Rita Supermall Purwokerto, Lantai Ground Floor (GF) Unit 29, 30 & 30A, Jl. Jend. Sudirman, Purwokerto",
    phoneOrWa: "0856-0100-8192",
    googleMapsUrl: "https://www.google.com/maps/search/Dr+Specs+Rita+Supermall+Purwokerto",
    websiteUrl: "https://optikdrspecsindonesia.com",
    igHandle: "@drspecs_indonesia",
    igUrl: "https://www.instagram.com/drspecs_indonesia/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi aktif di unit GF 29, 30, 30A Rita Supermall Purwokerto dengan konsep open display.",
    priceLevel: "Mid-Range (Rp 250K - Rp 1.500.000)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS komersial mall",
    threatLevel: "CRITICAL",
    threatScore: 89,
    keyStrength: [
      "Format toko open-concept yang modern, luas, dan mengundang pengunjung mencoba frame secara bebas",
      "Menawarkan sistem bundling frame + lensa dengan range harga yang lebih dekat ke kantong menengah",
      "Lokasi sangat menonjol di koridor tengah GF Rita Supermall Purwokerto",
    ],
    vulnerability: [
      "Brand equity regional rendah (konsumen menganggapnya gerai jaringan generik)",
      "Pelayanan periksa refraksi terkadang terburu-buru saat jam ramai mall",
      "Koleksi frame vintage dan Korean-look terbatas dibanding brand D2C",
    ],
    threatAnalysis: "Ancaman foot-traffic paling nyata bagi I See You di Rita Supermall. Menargetkan segmen konsumen modern yang sama-sama menginginkan kacamata belanja cepat di mall.",
    actionRecommendationForISeeYou: "Unggulkan kehangatan staf lokal I See You, pemeriksaan refraksi optisi (RO) gratis yang detail tanpa buru-buru, serta koleksi frame aesthetic yang lebih up-to-date.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-optik-merdeka-purwokerto",
    name: "Optik Merdeka 1982 (Purwokerto & Purbalingga)",
    city: "Purwokerto",
    tier: "TIER_S",
    tierLabel: "Tier S: Wajib Banget Dipantau",
    tierRank: 5,
    category: "Pemain Utama Independen Lokal",
    address: "Purwokerto 1: Ruko Permata Hijau Blok II No. 5 (Jl. Dr. Angka) | Purwokerto 2: Jl. Kombas 15D | Purbalingga: Jl. Jend. Sudirman 64",
    phoneOrWa: "0811-2991-704 / 0281-638515",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+Merdeka+Purwokerto",
    websiteUrl: "https://optikmerdeka1982.com",
    igHandle: "@optikmerdeka1982",
    igUrl: "https://www.instagram.com/optikmerdeka1982/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi resmi: Website optikmerdeka1982.com dan akun Instagram aktif mempublikasikan 3 gerai di Purwokerto dan Purbalingga.",
    priceLevel: "Mid-Range (Rp 250K - Rp 1.500.000)",
    bpjsPartner: false,
    bpjsNote: "Menerima rujukan resep dokter spesialis mata swasta dan klaim asuransi tertentu",
    threatLevel: "HIGH",
    threatScore: 86,
    keyStrength: [
      "Sejarah 40+ tahun (sejak 1982) di Banyumas, sangat dipercaya generasi orang tua dan keluarga",
      "Lokasi sangat strategis persis di depan Rumah Sakit Elisabeth Purwokerto dan jalan protokol Sudirman Purbalingga",
      "Jaringan rujukan kuat dengan dokter spesialis mata senior di Banyumas",
    ],
    vulnerability: [
      "Citra brand dipersepsikan 'kuno / optik orang tua' oleh mahasiswa dan anak muda",
      "Koleksi frame cenderung konservatif dan lambat merespons tren kacamata media sosial",
      "Kurang aktif dalam kampanye reels, TikTok, atau influencer marketing",
    ],
    threatAnalysis: "Memegang kendali atas pasien resep dokter medis di kawasan RS Elisabeth dan Jl. Kombas Purwokerto. Menjadi rujukan utama keluarga mapan lokal.",
    actionRecommendationForISeeYou: "Posisikan I See You sebagai ikon generasi baru kacamata Banyumas: tempat anak muda memilih frame aesthetic yang tetap presisi medis dengan mesin faset kilat 15 menit.",
    lastCheckedDate: "06 Okt 2026",
  },

  // ==========================================
  // TIER A - PENTING (3 BRAND)
  // ==========================================
  {
    id: "local-optik-budhi-cilacap",
    name: "Optik BUDHI (Cilacap, Kroya & Sidareja)",
    city: "Cilacap",
    tier: "TIER_A",
    tierLabel: "Tier A: Penting",
    tierRank: 6,
    category: "Optik Faskes BPJS Kesehatan",
    address: "Jl. Gatot Subroto No. 97A, Gunungsimping, Cilacap Tengah (+ Cabang Kroya: Optik Budhi Putri & Sidareja)",
    phoneOrWa: "0812-1669-9779",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+BUDHI+Cilacap",
    websiteUrl: "https://optikbudhicilacap.com",
    igHandle: "@optikbudhi_cilacap",
    igUrl: "https://www.instagram.com/optikbudhi_cilacap",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi resmi: Website optikbudhicilacap.com & status Fasilitas Kesehatan Rujukan Tingkat Lanjutan BPJS Kesehatan di Cilacap.",
    priceLevel: "Budget to Mid (Rp 150K - Rp 650K)",
    bpjsPartner: true,
    bpjsNote: "YA - Mitra Resmi Faskes Rujukan BPJS Kesehatan di Kabupaten Cilacap",
    threatLevel: "HIGH",
    threatScore: 82,
    keyStrength: [
      "Mitra resmi BPJS Kesehatan utama di Cilacap dengan aliran volume pasien resep dokter stabil setiap hari",
      "Jangkauan 3 cabang mencakup Cilacap Kota, Kroya, dan Sidareja",
      "Merek telah dikenal lama oleh kalangan ASN, pensiunan, dan peserta BPJS Kesehatan Cilacap",
    ],
    vulnerability: [
      "Antrean resep BPJS memakan waktu dan proses klaim membutuhkan dokumen administrasi berjenjang",
      "Pilihan frame untuk paket klaim BPJS sangat terbatas dan bermodel standar",
      "Tidak menawarkan diferensiasi faset kilat 15 menit bagi pasien yang butuh kacamata segera",
    ],
    threatAnalysis: "Menyedot pangsa pasar berorientasi klaim BPJS Kesehatan di Cilacap. Namun menyisakan peluang besar bagi konsumen yang tidak ingin repot birokrasi dan mencari kacamata modis.",
    actionRecommendationForISeeYou: "Posisikan I See You Cilacap sebagai solusi cepat 'Tanpa Antre, Tanpa Ribet': proses refraksi presisi langsung di tempat, faset 15 menit jadi, dan pilihan frame stylish bergaransi.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-premier-optical-cilacap",
    name: "Premier Optical (Indo Premier Cilacap)",
    city: "Cilacap",
    tier: "TIER_A",
    tierLabel: "Tier A: Penting",
    tierRank: 7,
    category: "Optik Komersial Jalan Utama",
    address: "Jl. Gatot Subroto No. 101A / 319A, Perumahan Pertamina, Gunungsimping, Cilacap Tengah",
    phoneOrWa: "0896-7552-5222",
    googleMapsUrl: "https://www.google.com/maps/search/Premier+Optical+Cilacap",
    igHandle: "@indopremieroptical",
    igUrl: "https://www.instagram.com/indopremieroptical/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi di klaster optik Jl. Gatot Subroto Cilacap dekat komplek Pertamina dengan akun @indopremieroptical.",
    priceLevel: "Budget to Mid (Rp 150K - Rp 550K)",
    bpjsPartner: false,
    bpjsNote: "Layanan optik komersial mandiri",
    threatLevel: "MEDIUM",
    threatScore: 71,
    keyStrength: [
      "Lokasi sangat strategis di koridor komersial Jl. Gatot Subroto Cilacap dekat perumahan Pertamina",
      "Menyediakan pemeriksaan mata komputer dan paket kacamata kasual terjangkau",
      "Pilihan frame komersial reguler cukup beragam",
    ],
    vulnerability: [
      "Branding digital dan aktivitas media sosial belum konsisten",
      "Ketiadaan jaminan faset kilat 15 menit di tempat",
      "Kurang memiliki signature hook konten yang viral di kalangan anak muda Cilacap",
    ],
    threatAnalysis: "Pemain jalan utama yang konsisten menyerap konsumen residensial Pertamina dan masyarakat Cilacap Tengah.",
    actionRecommendationForISeeYou: "Maksimalkan kampanye 'Faset 15 Menit Selesai' dan promo ganti frame gratis pembersihan ultrasonik di I See You Cilacap untuk menarik komuter Jl. Gatot Subroto.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-optik-merdeka-purbalingga",
    name: "Optik Merdeka (Purbalingga)",
    city: "Purbalingga",
    tier: "TIER_A",
    tierLabel: "Tier A: Penting",
    tierRank: 8,
    category: "Pemain Utama Independen Lokal",
    address: "Jl. Jenderal Sudirman No. 64, Purbalingga, Jawa Tengah",
    phoneOrWa: "0811-2991-704",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+Merdeka+Purbalingga",
    websiteUrl: "https://optikmerdeka1982.com",
    igHandle: "@optikmerdeka1982",
    igUrl: "https://www.instagram.com/optikmerdeka1982/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi resmi sebagai outlet Purbalingga di website optikmerdeka1982.com Jl. Jend. Sudirman 64.",
    priceLevel: "Mid-Range (Rp 250K - Rp 1.200.000)",
    bpjsPartner: false,
    bpjsNote: "Layanan resep optik mandiri",
    threatLevel: "HIGH",
    threatScore: 76,
    keyStrength: [
      "Alamat prestisius di jalan protokol utama Jenderal Sudirman Purbalingga",
      "Didukung oleh reputasi jaringan besar Optik Merdeka 1982 Banyumas",
      "Menjadi pilihan utama masyarakat Purbalingga kota yang mengutamakan prestise optik legendaris",
    ],
    vulnerability: [
      "Format toko formal dan terkesan kaku bagi pengunjung usia 17-25 tahun",
      "Harga kacamata komplit lebih tinggi dibanding rata-rata daya beli pelajar Purbalingga",
      "Tidak ada fokus konten digital lokal Purbalingga",
    ],
    threatAnalysis: "Pesaing kedua terkuat di Purbalingga setelah Dunia Optic, memperebutkan segmen profesional, guru, PNS, dan instansi Purbalingga.",
    actionRecommendationForISeeYou: "Hadirkan promo khusus pelajar dan karyawan pabrik Purbalingga dengan harga paket frame anti-radiasi bersahabat di gerai I See You Jl. Onje.",
    lastCheckedDate: "06 Okt 2026",
  },

  // ==========================================
  // TIER B - REGIONAL & LOCAL MONITORING (8 BRAND)
  // ==========================================
  {
    id: "local-optik-wonosobo-sarjana-kacamata",
    name: "Optik Wonosobo Sarjana Kacamata",
    city: "Wonosobo",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 9,
    category: "Pemain Utama Independen Lokal",
    address: "Jl. Sukardi No. 8 (Sebelah timur Pondok Pesantren Al-Hikam), Wonosobo",
    phoneOrWa: "0895-1849-0911 / (0286) 323952",
    googleMapsUrl: "https://www.google.com/maps/search/Sarjana+Kacamata+Wonosobo",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi di Google Maps Jl. Sukardi Wonosobo & direktori lokal dengan reputasi refraksionis optisi berpengalaman.",
    priceLevel: "Budget to Mid (Rp 150K - Rp 500K)",
    bpjsPartner: false,
    bpjsNote: "Layanan optik mandiri",
    threatLevel: "MEDIUM",
    threatScore: 62,
    keyStrength: [
      "Pemilik menyandang gelar 'Sarjana Kacamata' (Refraksionis Optisi) yang sangat dipercaya ketelitian periksa matanya",
      "Hubungan emosional yang erat dengan warga lokal Wonosobo dan santri ponpes sekitar",
      "Biaya layanan refraksi terjangkau dan komunikatif",
    ],
    vulnerability: [
      "Skala gerai fisik kecil dan tampilan display konvensional",
      "Koleksi frame modern minim dan tanpa mesin faset otomatis kilat di toko",
      "Nol kehadiran media sosial (Instagram/TikTok tidak aktif)",
    ],
    threatAnalysis: "Menjadi rujukan tradisional warga Wonosobo yang mengutamakan resep kacamata akurat tanpa mempedulikan gengsi brand.",
    actionRecommendationForISeeYou: "Komunikasikan di Wonosobo bahwa Optik I See You juga memiliki Refraksionis Optisi (RO) berlisensi resmi, didukung peralatan digital komputer canggih dan faset 15 menit.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-vip-optik-purwokerto",
    name: "VIP Optik (Purwokerto)",
    city: "Purwokerto",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 10,
    category: "Optik Komersial Jalan Utama",
    address: "Jl. Jenderal Sudirman No. 687 (Pertigaan Pasar Wage), Purwokerto, Jawa Tengah",
    phoneOrWa: "0281-632590 / WA: 0812-2653-4395 / 0811-2911-964",
    googleMapsUrl: "https://www.google.com/maps/search/Optic+Vip+Jl+Jend+Sudirman+Purwokerto",
    shopeeUrl: "https://shopee.co.id",
    verificationStatus: "SECONDARY",
    verificationNote: "Terverifikasi fisik di pertigaan Pasar Wage Purwokerto & kontak telepon. Media sosial Instagram resmi: N/A (aktivitas dominan offline & WA).",
    priceLevel: "Budget to Mid (Rp 150K - Rp 600K)",
    bpjsPartner: false,
    bpjsNote: "Layanan mandiri",
    threatLevel: "MEDIUM",
    threatScore: 52,
    keyStrength: [
      "Lokasi sangat padat di pertigaan Pasar Wage dengan paparan lalu lintas pedestrian dan kendaraan tinggi",
      "Menyediakan berbagai kacamata baca dan frame terjangkau untuk kalangan pedagang dan warga sekitar",
      "Nomor layanan pelanggan WhatsApp aktif melayani pesanan",
    ],
    vulnerability: [
      "Desain toko konvensional tanpa daya tarik lifestyle bagi mahasiswa",
      "Tidak memiliki strategi branding media sosial maupun konten video",
      "Persepsi brand sebatas toko kacamata umum pasar",
    ],
    threatAnalysis: "Menjaring konsumen lalu lintas Pasar Wage yang mencari kacamata fungsional tanpa mementingkan pengalaman store estetik.",
    actionRecommendationForISeeYou: "Konsumen Purwokerto yang menginginkan suasana berbelanja nyaman ber-AC, garansi lensa presisi, dan model kacamata terkini akan lebih memilih I See You.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-optik-b-riski-purbalingga",
    name: "Optik B. Riski (Purbalingga)",
    city: "Purbalingga",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 11,
    category: "Regional Chain Suburban",
    address: "Jl. Ahmad Yani No. 46, Kalikabong, Kec. Kalimanah, Purbalingga (Utara Terminal Bus Purbalingga)",
    phoneOrWa: "WA Admin Instagram",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+B+Riski+Purbalingga",
    websiteUrl: "https://optikbriski.com",
    igHandle: "@optikbriski.purbalingga",
    igUrl: "https://www.instagram.com/optikbriski.purbalingga/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi di Jl. Ahmad Yani Kalikabong (utara terminal Purbalingga) dengan akun Instagram cabang @optikbriski.purbalingga.",
    priceLevel: "Budget (Rp 100K - Rp 450K)",
    bpjsPartner: false,
    bpjsNote: "Layanan paket hemat mandiri",
    threatLevel: "MEDIUM",
    threatScore: 60,
    keyStrength: [
      "Lokasi strategis di pintu gerbang Purbalingga dekat terminal bus Kalikabong",
      "Paket harga frame hemat yang menjangkau masyarakat suburban Kalimanah",
      "Merupakan bagian dari jaringan regional Optik B. Riski Jawa Tengah",
    ],
    vulnerability: [
      "Jangkauan terbatas pada wilayah transit terminal, minim penetrasi di pusat kota Purbalingga",
      "Persepsi merek lebih condong sebagai optik kacamata murah standar",
      "Variasi frame retro/vintage estetik minim",
    ],
    threatAnalysis: "Pesaing alternatif di gerbang barat Purbalingga bagi komuter yang mencari kacamata cepat murah.",
    actionRecommendationForISeeYou: "Posisikan I See You Purbalingga di Jl. Onje sebagai destinasi pusat kota dengan kualitas lensa anti-radiasi yang jauh lebih unggul dan bergaransi resmi.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-tiga-mata-eyewear-purbalingga",
    name: "Tiga Mata Eyewear (Purbalingga)",
    city: "Purbalingga",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 12,
    category: "Toko Kacamata Lokal Fisik",
    address: "Wilayah Purbalingga (Gerai Kacamata Mandiri Lokal)",
    phoneOrWa: "N/A - Perlu verifikasi survey lapangan langsung",
    verificationStatus: "N/A",
    verificationNote: "Status: Belum diverifikasi publik secara online (Kanal Instagram / Website N/A). Terdaftar sebagai entitas toko kacamata fisik lokal yang memerlukan peninjauan langsung di lapangan.",
    priceLevel: "Budget (Rp 100K - Rp 350K)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS",
    threatLevel: "WATCHLIST",
    threatScore: 40,
    keyStrength: [
      "Gerai fisik lokal yang melayani pasar terdekat di lingkungannya",
      "Harga kacamata dasar yang terjangkau untuk kebutuhan darurat",
    ],
    vulnerability: [
      "Tidak memiliki keberadaan digital (digital footprint) online sama sekali",
      "Ketergantungan 100% pada foot-traffic pejalan kaki sekitar toko",
      "Ketiadaan jaminan mutu lensa atau fasilitas refraksi modern",
    ],
    threatAnalysis: "Toko independen berskala mikro yang tidak mengancam pangsa pasar utama I See You, namun tetap dipantau pergerakan harganya.",
    actionRecommendationForISeeYou: "Dominasi pencarian online Google Maps 'Optik Purbalingga' dan review positif agar konsumen lokal selalu diarahkan ke Optik I See You Jl. Onje.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-indo-optical-cilacap",
    name: "Indo Optical (Cilacap: Katamso & Nusantara)",
    city: "Cilacap",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 13,
    category: "Optik Komersial Jalan Utama",
    address: "Cabang 1: Jl. Brigjend Katamso 45, Sidanegara (0899-6601-981) | Cabang 2: Jl. Nusantara 131, Karangtalun (0896-7552-2555)",
    phoneOrWa: "0899-6601-981 / 0896-7552-2555",
    googleMapsUrl: "https://www.google.com/maps/search/Indo+Optical+Cilacap",
    igHandle: "@indooptical_katamso",
    igUrl: "https://www.instagram.com/indooptical_katamso/",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi aktif dengan 2 cabang jalan utama di Cilacap (Katamso dan Nusantara depan SDN 2 Karangtalun) serta cabang Kroya.",
    priceLevel: "Budget (Rp 100K - Rp 400K)",
    bpjsPartner: false,
    bpjsNote: "Slogan: 'IndoOptical Be Smart Optic' (Komersial)",
    threatLevel: "MEDIUM",
    threatScore: 64,
    keyStrength: [
      "Memiliki 2 cabang strategis di Cilacap Tengah (Katamso) dan Cilacap Utara (Nusantara area pabrik industri)",
      "Jam buka panjang (08.00 s/d 21.00 WIB setiap hari)",
      "Promosi 'Be Smart Optic' menyasar keluarga pekerja dan pelajar dengan harga bersahabat",
    ],
    vulnerability: [
      "Tampilan toko sederhana dan belum mengusung konsep showroom lifestyle",
      "Koleksi frame modern minim inovasi, didominasi model frame standar",
      "Tidak ada layanan potong lensa ekspres 15 menit",
    ],
    threatAnalysis: "Pesaing kuat di segmen komersial jalan raya Cilacap non-mall yang mengandalkan kedekatan dengan kawasan perumahan padat.",
    actionRecommendationForISeeYou: "Tampilkan interior I See You Cilacap yang modern dan estetik, dengan layanan refraksi presisi komputer serta garansi kenyamanan lensa.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-optik-riski-kertek-wonosobo",
    name: "Optik Riski Kertek (Wonosobo)",
    city: "Wonosobo",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 14,
    category: "Regional Chain Suburban",
    address: "Jl. Raya Wonosobo - Kertek KM 7, RT.05/RW.02, Krekel Santren, Karangluhur, Kertek, Wonosobo",
    googleMapsUrl: "https://www.google.com/maps/search/Optik+Riski+Kertek+Wonosobo",
    websiteUrl: "https://optikbriski.com",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi di jalur utama Kertek KM 7 dan terdaftar resmi di direktori website jaringan optikbriski.com.",
    priceLevel: "Budget (Rp 100K - Rp 400K)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS",
    threatLevel: "MEDIUM",
    threatScore: 58,
    keyStrength: [
      "Posisi sangat strategis di jalur persimpangan ramai Kertek (menghubungkan Wonosobo, Parakan, Temanggung)",
      "Menangkap pasar komuter dan warga pedesaan di wilayah timur Wonosobo tanpa harus ke kota",
      "Harga kacamata hemat terjangkau untuk kalangan petani dan pedagang pasar",
    ],
    vulnerability: [
      "Lokasi berjarak 7 KM dari pusat kota Wonosobo",
      "Fasilitas gerai terbatas pada model kacamata standar tanpa pilihan premium",
      "Tidak memiliki aktivitas pemasaran media sosial",
    ],
    threatAnalysis: "Mencegat konsumen wilayah timur Wonosobo agar tidak perlu berbelanja kacamata ke pusat kota.",
    actionRecommendationForISeeYou: "Posisikan gerai I See You Wonosobo di Jl. Soedirman sebagai optik tujuan utama saat warga berakhir pekan atau berbelanja di jantung kota Wonosobo.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-jamika-wonosobo",
    name: "Jamika Wonosobo",
    city: "Wonosobo",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 15,
    category: "Toko Kacamata Fisik Lokal",
    address: "Jl. Jenderal Soedirman, Komplek Pertokoan Matahari Blok A No. 4 (Samping Monosport), Wonosobo",
    googleMapsUrl: "https://www.google.com/maps/search/Jamika+Wonosobo+Jl+Sudirman",
    verificationStatus: "SECONDARY",
    verificationNote: "Terverifikasi fisik di koridor pertokoan Jl. Jend. Soedirman Wonosobo berdampingan dalam satu koridor dengan Optik I See You Wonosobo. Akun Instagram resmi: N/A.",
    priceLevel: "Budget (Rp 100K - Rp 350K)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS",
    threatLevel: "WATCHLIST",
    threatScore: 50,
    keyStrength: [
      "Satu koridor jalan utama dengan gerai I See You Wonosobo di Jl. Jenderal Soedirman",
      "Toko sudah beroperasi lama dan dikenal oleh pengunjung komplek pertokoan Matahari",
      "Menyediakan variasi kacamata dan aksesoris jam tangan",
    ],
    vulnerability: [
      "Fasilitas uji mata refraksi sangat sederhana",
      "Tampilan toko gaya lama tanpa penyejuk udara modern dan pencahayaan estetik",
      "Ketiadaan layanan potong faset kilat 15 menit",
    ],
    threatAnalysis: "Pesaing tetangga satu koridor jalan di Jl. Soedirman Wonosobo. Hanya menyerap pejalan kaki konvensional pasar.",
    actionRecommendationForISeeYou: "Kontras visual I See You Wonosobo yang terang, bersih, modern, dan dilengkapi mesin faset otomatis 15 menit menjadi daya tarik pembeda mutlak.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "local-a-and-d-eyewear-wonosobo",
    name: "Toko Kacamata A & D Eyewear (Wonosobo)",
    city: "Wonosobo",
    tier: "TIER_B",
    tierLabel: "Tier B: Regional / Local Monitoring",
    tierRank: 16,
    category: "Toko Kacamata Hemat / Suburban",
    address: "Depan Rocket Chicken Kalianget, Wonosobo (Jaringan Wonosobo & Banjarnegara)",
    phoneOrWa: "0881-2612-716",
    googleMapsUrl: "https://www.google.com/maps/search/A+%26+D+Eyewear+Kalianget+Wonosobo",
    verificationStatus: "VERIFIED",
    verificationNote: "Terverifikasi aktif di Kalianget Wonosobo dengan nomor WhatsApp 0881-2612-716 dan program paket kacamata Rp 100.000.",
    priceLevel: "Budget (Rp 100K - Rp 350K)",
    bpjsPartner: false,
    bpjsNote: "Non-BPJS",
    threatLevel: "MEDIUM",
    threatScore: 66,
    keyStrength: [
      "Program promosi harga murah sangat agresif: Paket Komplit Frame + Lensa mulai Rp 100.000",
      "Pemeriksaan mata gratis menggunakan alat komputer atau manual di area Kalianget",
      "Menarik konsumen masyarakat suburban yang sangat sensitif terhadap harga",
    ],
    vulnerability: [
      "Kualitas bahan frame rentan patah dan lensa plastik standar non-multi-coating",
      "Tidak ada garansi kenyamanan adaptasi jika resep pusing",
      "Lokasi berada di pinggiran (Kalianget), bukan di koridor prestisius pusat kota",
    ],
    threatAnalysis: "Mengancam pasar bawah (entry-level) yang belum memahami pentingnya presisi refraksi mata dan kenyamanan lensa berkualitas.",
    actionRecommendationForISeeYou: "Edukasi publik Wonosobo mengenai bahaya lensa murah tanpa ukuran akurat (bisa memicu pusing/silinder bertambah), serta tawarkan paket hemat bergaransi resmi I See You.",
    lastCheckedDate: "06 Okt 2026",
  },
];

export const LOCAL_BRANCH_STATS = {
  totalCompetitors: 16,
  byCity: {
    Purwokerto: 5,
    Purbalingga: 4,
    Cilacap: 4,
    Wonosobo: 4,
  },
  byTier: {
    TIER_S: 5,
    TIER_A: 3,
    TIER_B: 8,
  },
  verifiedCount: 13,
  secondaryCount: 2,
  naCount: 1, // Tiga Mata Eyewear
  bpjsPartnersCount: 1, // Optik BUDHI Cilacap
};

// ==========================================
// LAPORAN REKOMENDASI FRAME YANG LAGI TREND
// Berdasarkan Data Nyata Marketplace & Brand Leader 2026
// ==========================================

export interface TrendingFrameReportItem {
  id: string;
  rank: number;
  frameName: string;
  brand: string;
  shapeStyle: "Slim Square" | "Korean Round / Oval" | "Vintage Retro Acetate" | "Bold Cat-Eye" | "Classic Wellington" | "Aviator / Pilot";
  material: string;
  targetFaceShape: string;
  priceReal: string;
  marketSoldCount: string;
  rating: string;
  reviewCount: string;
  trendReason: string;
  signatureAudience: string;
  sourceStore: string;
  sourceUrl: string;
  exactShopeeTitle: string;
  shopeeSearchQuery: string;
  stockRecommendationForISeeYou: string;
  lastCheckedDate: string;
}

export const TRENDING_FRAME_RECOMMENDATIONS: TrendingFrameReportItem[] = [
  {
    id: "trend-frame-1",
    rank: 1,
    frameName: "heykama - Hajime (Frame Kacamata Square)",
    brand: "Heykama",
    shapeStyle: "Slim Square",
    material: "Titanium Frame Square Ringan (Sunyata & Hajime Series)",
    targetFaceShape: "Wajah Bulat & Pipi Chubby (Garis sudut tegas Hajime memberikan ilusi wajah lebih ramping dan tegas)",
    priceReal: "Rp 284.000 (Tersedia juga Seri Najio Rp 225.000)",
    marketSoldCount: "10RB+ Terjual",
    rating: "4.9 / 5.0",
    reviewCount: "20RB+ Ulasan Shopee Mall",
    trendReason: "Bestseller nomor 1 di Shopee Mall Heykama. Mengakomodasi tren frame kotak ramping modern tanpa terkesan kaku untuk pekerja muda dan mahasiswa.",
    signatureAudience: "Mahasiswa & Gen Z yang mencari frame kotak kekinian",
    sourceStore: "Shopee Mall heykama",
    sourceUrl: "https://shopee.co.id/search?keyword=heykama%20hajime",
    exactShopeeTitle: "heykama - Hajime (Frame Kacamata Square)",
    shopeeSearchQuery: "heykama hajime",
    stockRecommendationForISeeYou: "Wajib restock frame titanium kotak tipis warna hitam matte & gunmetal di seluruh cabang (Purwokerto Pusat & Rita Supermall, Purbalingga, Cilacap, Wonosobo) dengan paket lensa antiradiasi Rp 199.000 - Rp 250.000.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "trend-frame-2",
    rank: 2,
    frameName: "Berrybarton - Kacamata Hitam Kotak Anti UV (Sunglasses Series)",
    brand: "Berrybarton",
    shapeStyle: "Slim Square",
    material: "Polycarbonate UV400 Protection (Series KUKU, HER, RICK, VISIT, FRIDA, dll)",
    targetFaceShape: "Universal (Cocok untuk wajah lonjong, oval, dan bulat saat aktivitas outdoor / berkendara)",
    priceReal: "Rp 46.024 (Diskon 75% dari Rp 184.000)",
    marketSoldCount: "10RB+ Terjual",
    rating: "4.9 / 5.0",
    reviewCount: "40RB+ Ulasan Shopee Mall",
    trendReason: "Produk paling laris dengan penjualan 10RB+ di etalase Shopee Mall Berrybarton. Menawarkan 14 pilihan model sunglasses kotak modern bergaya trendi dengan perlindungan UV400 penuh.",
    signatureAudience: "Pengendara motor, pelancong outdoor, mahasiswa, dan pemburu kacamata hitam stylish terjangkau",
    sourceStore: "Shopee Mall Berrybarton Official",
    sourceUrl: "https://shopee.co.id/search?keyword=berrybarton%20kacamata%20hitam%20kotak",
    exactShopeeTitle: "Berry Barton - Kacamata Hitam Kotak Anti UV (Sunglasses Series: KUKU/HER/RICK)",
    shopeeSearchQuery: "Berrybarton Kacamata Hitam Kotak",
    stockRecommendationForISeeYou: "Siapkan rak display kacamata hitam polarized / UV400 di dekat kasir seluruh cabang seharga Rp 75.000 - Rp 99.000 sebagai add-on purchase saat customer menunggu faset kacamata resep.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "trend-frame-3",
    rank: 3,
    frameName: "heykama - Frame Kacamata Sora (Cat Eye)",
    brand: "Heykama",
    shapeStyle: "Bold Cat-Eye",
    material: "High Quality Acetate Ringan + Metal Hinge (Tersedia juga Seri Miki)",
    targetFaceShape: "Wajah Bulat, Oval, & Pipi Berisi (Sudut cat-eye Sora mengangkat siluet mata dan mempertegas kontur tulang pipi)",
    priceReal: "Rp 120.000 (Tersedia juga Seri Miki Rp 110.000)",
    marketSoldCount: "10RB+ Terjual",
    rating: "4.9 / 5.0",
    reviewCount: "12RB+ Ulasan Shopee Mall",
    trendReason: "Model cat-eye terlaris kategori kacamata wanita di Shopee. Desain sudut runcing lembut tanpa terlihat berlebihan sangat digemari mahasiswi dan karyawati.",
    signatureAudience: "Mahasiswi, karyawati muda, dan hijabers yang menyukai gaya feminin chic",
    sourceStore: "Shopee Mall heykama",
    sourceUrl: "https://shopee.co.id/search?keyword=heykama%20sora",
    exactShopeeTitle: "heykama - Frame Kacamata Sora (Cat Eye)",
    shopeeSearchQuery: "heykama sora",
    stockRecommendationForISeeYou: "Perbanyak stok warna rose tea dan clear grey di store I See You karena warna tersebut terbukti paling cepat habis di marketplace.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "trend-frame-4",
    rank: 4,
    frameName: "KACAMATAMOO - Frame Kacamata Unisex TR90 + Bluechromic",
    brand: "Kacamatamoo",
    shapeStyle: "Korean Round / Oval",
    material: "TR-90 Flexible Resin Ringan (Bobot hanya 9 gram, Lentur & Anti Patah)",
    targetFaceShape: "Wajah Kotak / Persegi & Rahang Tegas (Lekukan membulat lembut melunakkan garis rahang tegas)",
    priceReal: "Rp 199.000 (Frame TR90) / Paket Bluechromic Rp 300.000",
    marketSoldCount: "10RB+ Terjual (Paket Lensa Bluechromic)",
    rating: "4.9 / 5.0",
    reviewCount: "25RB+ Ulasan Shopee Official",
    trendReason: "Kombinasi frame TR90 unisex ringan dengan paket lensa Bluechromic seharga Rp 300.000 menjadi bundling paling dominan di kalangan mahasiswa Jawa Tengah dan DIY.",
    signatureAudience: "Mahasiswa dan pengguna kacamata pertama kali yang butuh kenyamanan seharian di depan laptop",
    sourceStore: "Shopee Star+ Kacamatamoo Official",
    sourceUrl: "https://shopee.co.id/search?keyword=kacamatamoo%20unisex%20tr90",
    exactShopeeTitle: "KACAMATAMOO Frame Kacamata Unisex TR90 + Paket Lensa Bluechromic",
    shopeeSearchQuery: "Kacamatamoo Unisex TR90",
    stockRecommendationForISeeYou: "Jadikan frame TR90 lentur andalan di paket 'Mahasiswa Hemat' I See You seharga Rp 199.000 all-in lensa supersin di 4 cabang.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "trend-frame-5",
    rank: 5,
    frameName: "Mollucas - Manawa Midnight / Kaihulu Clear (Free Lensa)",
    brand: "Mollucas Eyewear",
    shapeStyle: "Vintage Retro Acetate",
    material: "Handcrafted Premium High-Grade Acetate (Ergonomic Asian-Fit)",
    targetFaceShape: "Wajah Lonjong, Tirus, & Oval (Ketebalan frame acetate memberikan karakter estetis yang bold)",
    priceReal: "Rp 938.191 (Kaihulu) - Rp 1.312.193 (Manawa Midnight)",
    marketSoldCount: "785 Terjual (Manawa) & 463 Terjual (Kaihulu)",
    rating: "4.9 - 5.0 / 5.0",
    reviewCount: "Ratusan Ulasan Pembeli Terverifikasi",
    trendReason: "Brand lokal pelopor frame acetate premium di Jawa Tengah & DIY. Penamaan budaya khas nusantara (Manawa, Kaihulu, Soerabaja Turtle) dan build quality kokoh dengan engsel 5-barrel besi.",
    signatureAudience: "Komunitas kreatif, arsitek/desainer, penikmat slow-fashion, dan konsumen yang bersedia membayar Rp 1 jutaan untuk acetate berkualitas",
    sourceStore: "Shopee Store Mollucas Eyewear",
    sourceUrl: "https://shopee.co.id/search?keyword=mollucas%20manawa",
    exactShopeeTitle: "Mollucas - Manawa Midnight - Free Lensa / Kaihulu Gel Clear",
    shopeeSearchQuery: "Mollucas Manawa",
    stockRecommendationForISeeYou: "Kurasi seri acetate premium I See You seharga Rp 400.000 - Rp 600.000 sebagai alternatif 'Kualitas Acetate Setara Mollucas dengan Layanan Potong Kilat 15 Menit di Toko'.",
    lastCheckedDate: "06 Okt 2026",
  },
  {
    id: "trend-frame-6",
    rank: 6,
    frameName: "Optik I See You - Bestseller Store Oval & Bold Cat-Eye TR90",
    brand: "Optik I See You (Jaringan 4 Cabang)",
    shapeStyle: "Bold Cat-Eye",
    material: "Ultra-Flex TR-90 Kombinasi Titanium Ringan",
    targetFaceShape: "Wajah Bulat & Lebar (Lekukan sudut lancip mengangkat profil mata dan pipi)",
    priceReal: "Rp 199.000 - Rp 350.000 (Paket All-in Lensa Resep)",
    marketSoldCount: "Bestseller di 4 Cabang Fisik & Reels Instagram",
    rating: "4.9 / 5.0",
    reviewCount: "Ratusan Testimoni Pelanggan Cabang PWT, PBG, CLP, WNS",
    trendReason: "Model cat-eye dan oval modern dengan layanan fitting langsung dan pemasangan lensa 15 menit selesai di toko, menjadikannya pilihan favorit pengunjung gerai offline.",
    signatureAudience: "Pelanggan wanita muda, mahasiswi Unsoed/UMP, karyawati perbankan, dan warga lokal Banyumas Raya",
    sourceStore: "Instagram Resmi @iseeyou.glasses & Toko Fisik",
    sourceUrl: "https://www.instagram.com/iseeyou.glasses/",
    exactShopeeTitle: "Optik I See You Cabang Purwokerto, Purbalingga, Cilacap, Wonosobo",
    shopeeSearchQuery: "Optik I See You",
    stockRecommendationForISeeYou: "Pastikan stok warna champagne, jelly tea, dan hitam glossy selalu terisi di etalase tengah toko menjelang akhir pekan.",
    lastCheckedDate: "06 Okt 2026",
  },
];


