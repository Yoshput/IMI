// TikTok Accounts Registry, Analytics Data & Weekly Entry Model

export interface TikTokPostItem {
  id: string;
  postUrl: string;
  title: string;
  category: "frame_tryon" | "promo_diskon" | "edukasi_lensa" | "behind_the_scenes" | "humor_trend" | "review_customer";
  status: "trending" | "underperforming" | "average";
  uploadDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saveCount?: number;
  engagementRate: number; // ((likes + comments + shares) / views) * 100
  keyTakeaway: string;
}

export interface TikTokBranchData {
  branchId: string;
  branchName: string;
  city: string;
  handle: string;
  profileUrl: string;
  picName: string;
  isNewAccount?: boolean;
  followers: number;
  followersGrowth: number;
  weeklyViews: number;
  weeklyLikes: number;
  weeklyShares: number;
  avgEngagementRate: number;
  trendingPosts: TikTokPostItem[];
  underperformingPosts: TikTokPostItem[];
}

export const TIKTOK_BRANCH_REGISTRY: TikTokBranchData[] = [
  {
    branchId: "pwt",
    branchName: "Purwokerto (Pusat)",
    city: "Purwokerto",
    handle: "@iseeyouglasses",
    profileUrl: "https://www.tiktok.com/@iseeyouglasses",
    picName: "Ilya",
    followers: 87200,
    followersGrowth: 340,
    weeklyViews: 145200,
    weeklyLikes: 11400,
    weeklyShares: 1280,
    avgEngagementRate: 8.7,
    trendingPosts: [
      {
        id: "tt-pwt-01",
        postUrl: "https://www.tiktok.com/@iseeyouglasses/video/7412891238129",
        title: "POV: Kacamata bulat vintage bikin muka lonjong keliatan aesthetic banget",
        category: "frame_tryon",
        status: "trending",
        uploadDate: "2026-09-12",
        views: 64200,
        likes: 5890,
        comments: 184,
        shares: 742,
        engagementRate: 10.6,
        keyTakeaway: "Format POV try-on wajah lonjong sangat viral di kalangan mahasiswa Unsoed & Banyumas.",
      },
      {
        id: "tt-pwt-02",
        postUrl: "https://www.tiktok.com/@iseeyouglasses/video/7412891238999",
        title: "Eksperimen lensa Bluechromic disinar laser UV vs lensa biasa",
        category: "edukasi_lensa",
        status: "trending",
        uploadDate: "2026-09-10",
        views: 42100,
        likes: 3120,
        comments: 142,
        shares: 310,
        engagementRate: 8.5,
        keyTakeaway: "Edukasi visual demonstratif menghasilkan share tinggi dan direct inquiry via DM/Bio.",
      },
    ],
    underperformingPosts: [
      {
        id: "tt-pwt-03",
        postUrl: "https://www.tiktok.com/@iseeyouglasses/video/7412891237111",
        title: "Slide Foto Promo Diskon 20% Lensa Kacamata",
        category: "promo_diskon",
        status: "underperforming",
        uploadDate: "2026-09-09",
        views: 3100,
        likes: 98,
        comments: 6,
        shares: 4,
        engagementRate: 3.5,
        keyTakeaway: "Format slide gambar statis kaku di TikTok ditekan algoritma, segera ganti ke format video reaksi staf/customer.",
      },
    ],
  },
  {
    branchId: "clp",
    branchName: "Cilacap",
    city: "Cilacap",
    handle: "@i.see.you.cilacap",
    profileUrl: "https://www.tiktok.com/@i.see.you.cilacap",
    picName: "Arum",
    isNewAccount: true,
    followers: 3031,
    followersGrowth: 285,
    weeklyViews: 28400,
    weeklyLikes: 1980,
    weeklyShares: 215,
    avgEngagementRate: 7.7,
    trendingPosts: [
      {
        id: "tt-clp-01",
        postUrl: "https://www.tiktok.com/@i.see.you.cilacap/video/7413001122334",
        title: "Gak nyangka di Cilacap ada optik kacamata se-aesthetic ini! Lokasi dekat Teluk Penyu",
        category: "behind_the_scenes",
        status: "trending",
        uploadDate: "2026-09-13",
        views: 18500,
        likes: 1420,
        comments: 92,
        shares: 164,
        engagementRate: 9.1,
        keyTakeaway: "Local hook 'Wong Cilacap' dan visual toko baru sangat menarik interaksi audiens lokal.",
      },
    ],
    underperformingPosts: [
      {
        id: "tt-clp-02",
        postUrl: "https://www.tiktok.com/@i.see.you.cilacap/video/7413001122999",
        title: "Tebak harga frame kacamata ini berapa?",
        category: "humor_trend",
        status: "underperforming",
        uploadDate: "2026-09-11",
        views: 1420,
        likes: 64,
        comments: 11,
        shares: 2,
        engagementRate: 5.4,
        keyTakeaway: "Hook di 3 detik pertama kurang kuat, retention rate turun sebelum penonton tahu harganya.",
      },
    ],
  },
  {
    branchId: "pbg",
    branchName: "Purbalingga",
    city: "Purbalingga",
    handle: "@iseeyou.purbalingga",
    profileUrl: "https://www.tiktok.com/@iseeyou.purbalingga",
    picName: "Ajun",
    followers: 979,
    followersGrowth: 68,
    weeklyViews: 12600,
    weeklyLikes: 890,
    weeklyShares: 94,
    avgEngagementRate: 7.8,
    trendingPosts: [
      {
        id: "tt-pbg-01",
        postUrl: "https://www.tiktok.com/@iseeyou.purbalingga/video/7412999887711",
        title: "Ganti kacamata patah langsung jadi 20 menit di Purbalingga",
        category: "behind_the_scenes",
        status: "trending",
        uploadDate: "2026-09-12",
        views: 7800,
        likes: 610,
        comments: 48,
        shares: 72,
        engagementRate: 9.4,
        keyTakeaway: "Value proposition 'faset cepat di tempat' paling dicari customer Purbalingga.",
      },
    ],
    underperformingPosts: [
      {
        id: "tt-pbg-02",
        postUrl: "https://www.tiktok.com/@iseeyou.purbalingga/video/7412999887755",
        title: "Katalog frame titanium anti patah",
        category: "frame_tryon",
        status: "underperforming",
        uploadDate: "2026-09-08",
        views: 890,
        likes: 38,
        comments: 3,
        shares: 1,
        engagementRate: 4.7,
        keyTakeaway: "Audio sound background terlalu kencang dan tidak memakai voice-over manusia.",
      },
    ],
  },
  {
    branchId: "wns",
    branchName: "Wonosobo",
    city: "Wonosobo",
    handle: "@iseeyou.wonosobo",
    profileUrl: "https://www.tiktok.com/@iseeyou.wonosobo",
    picName: "Febi",
    followers: 42,
    followersGrowth: 14,
    weeklyViews: 4800,
    weeklyLikes: 340,
    weeklyShares: 32,
    avgEngagementRate: 8.0,
    trendingPosts: [
      {
        id: "tt-wns-01",
        postUrl: "https://www.tiktok.com/@iseeyou.wonosobo/video/7413111002233",
        title: "Dingin-dingin di Wonosobo lensa kacamata ngembun? Pakai lensa anti-fog ini!",
        category: "edukasi_lensa",
        status: "trending",
        uploadDate: "2026-09-11",
        views: 3600,
        likes: 275,
        comments: 29,
        shares: 26,
        engagementRate: 9.2,
        keyTakeaway: "Relevansi iklim lokal Wonosobo (dingin & kabut Dieng) sangat klop dengan solusi lensa anti embun.",
      },
    ],
    underperformingPosts: [
      {
        id: "tt-wns-02",
        postUrl: "https://www.tiktok.com/@iseeyou.wonosobo/video/7413111002299",
        title: "Vlog unboxing kacamata baru",
        category: "behind_the_scenes",
        status: "underperforming",
        uploadDate: "2026-09-09",
        views: 450,
        likes: 19,
        comments: 2,
        shares: 0,
        engagementRate: 4.6,
        keyTakeaway: "Pencahayaan video terlalu redup dan transisi terlalu lambat.",
      },
    ],
  },
  {
    branchId: "tgl",
    branchName: "Lunar Eyewear Tegal",
    city: "Tegal",
    handle: "@lunareyewear.co",
    profileUrl: "https://www.tiktok.com/@lunareyewear.co",
    picName: "Amanda",
    followers: 541,
    followersGrowth: 42,
    weeklyViews: 8900,
    weeklyLikes: 680,
    weeklyShares: 78,
    avgEngagementRate: 8.5,
    trendingPosts: [
      {
        id: "tt-tgl-01",
        postUrl: "https://www.tiktok.com/@lunareyewear.co/video/7413222334455",
        title: "Frame cat-eye aesthetic buat ciwi-ciwi Tegal hits",
        category: "frame_tryon",
        status: "trending",
        uploadDate: "2026-09-13",
        views: 5900,
        likes: 490,
        comments: 38,
        shares: 61,
        engagementRate: 10.0,
        keyTakeaway: "Target segmen cewek muda/kuliah di Tegal merespon kuat model frame cat-eye.",
      },
    ],
    underperformingPosts: [
      {
        id: "tt-tgl-02",
        postUrl: "https://www.tiktok.com/@lunareyewear.co/video/7413222334499",
        title: "Perkenalan optik Lunar Eyewear Tegal",
        category: "behind_the_scenes",
        status: "underperforming",
        uploadDate: "2026-09-07",
        views: 920,
        likes: 42,
        comments: 4,
        shares: 2,
        engagementRate: 5.2,
        keyTakeaway: "Kurang call to action dan lokasi spesifik di caption.",
      },
    ],
  },
];
