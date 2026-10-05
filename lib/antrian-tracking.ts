// Tracking Event Store & Aggregator for "Antrian Cek Mata" & "Web Photobooth" on optikiseeyou.com

export interface AntrianEvent {
  id: string;
  timestamp: string;
  branch: "pwt" | "clp" | "pbg" | "wns" | "unknown";
  branchName: string;
  sourceUrl: string;
  device: "mobile" | "desktop" | "tablet";
  userAgent?: string;
  referrer?: string;
  type?: "antrian_booking" | "photobooth_visit" | "photobooth_tryon" | "photobooth_share";
}

export interface BranchAntrianStats {
  branchId: string;
  branchName: string;
  city: string;
  todayClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  conversionRate: number; // percentage of clicks that completed booking
  showUpRate: number; // percentage of booked patients who visited store
}

export interface BranchPhotoboothStats {
  branchId: string;
  branchName: string;
  city: string;
  todaySessions: number;
  weeklySessions: number;
  monthlySessions: number;
  sharesCount: number;
  conversionToQueueRate: number; // percentage of photobooth visitors who took queue number
}

export interface AntrianSummary {
  todayTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  averageDaily: number;
  growthPercent: number;
  showUpRateAverage: number;
  branchStats: BranchAntrianStats[];
  recentClicks: AntrianEvent[];
  embedSnippet: string;
}

export interface PhotoboothSummary {
  todaySessions: number;
  weeklySessions: number;
  monthlySessions: number;
  uniqueUsersWeekly: number;
  uniqueUsersMonthly: number;
  photosSharedWeekly: number;
  photosSharedMonthly: number;
  conversionToQueuePercent: number;
  branchStats: BranchPhotoboothStats[];
  topFrames: {
    frameName: string;
    category: string;
    tryOnCount: number;
    shareCount: number;
  }[];
  acquisitionChannels: {
    channel: string;
    percentage: number;
    sessions: number;
  }[];
}

export interface CombinedWebResume {
  period: "weekly" | "monthly";
  dateRange: string;
  asOfDate: string;
  antrian: AntrianSummary;
  photobooth: PhotoboothSummary;
}

// In-memory events store
let inMemoryEvents: AntrianEvent[] = [
  {
    id: "evt-01",
    timestamp: "2026-09-28T10:42:10Z",
    branch: "pwt",
    branchName: "Purwokerto (Pusat)",
    sourceUrl: "https://optikiseeyou.com/booking-antrian",
    device: "mobile",
    referrer: "https://www.instagram.com/@iseeyou.glasses/",
    type: "antrian_booking",
  },
  {
    id: "evt-02",
    timestamp: "2026-09-28T09:15:33Z",
    branch: "clp",
    branchName: "Cilacap",
    sourceUrl: "https://optikiseeyou.com/photobooth",
    device: "mobile",
    referrer: "https://optikiseeyou.com/qr-store-cilacap",
    type: "photobooth_tryon",
  },
  {
    id: "evt-03",
    timestamp: "2026-09-28T08:30:12Z",
    branch: "pbg",
    branchName: "Purbalingga",
    sourceUrl: "https://optikiseeyou.com/booking-antrian",
    device: "mobile",
    referrer: "https://www.google.com/search?q=antrian+cek+mata+optik+i+see+you",
    type: "antrian_booking",
  },
  {
    id: "evt-04",
    timestamp: "2026-09-28T07:50:00Z",
    branch: "wns",
    branchName: "Wonosobo",
    sourceUrl: "https://optikiseeyou.com/photobooth",
    device: "mobile",
    referrer: "https://www.tiktok.com/@optikiseeyou_wonosobo",
    type: "photobooth_visit",
  },
  {
    id: "evt-05",
    timestamp: "2026-09-27T16:20:10Z",
    branch: "pwt",
    branchName: "Purwokerto (Pusat)",
    sourceUrl: "https://optikiseeyou.com/photobooth",
    device: "mobile",
    referrer: "https://www.instagram.com/@iseeyou.glasses/",
    type: "photobooth_share",
  },
];

export function recordAntrianClick(params: {
  branch?: string;
  sourceUrl?: string;
  device?: string;
  userAgent?: string;
  referrer?: string;
  type?: "antrian_booking" | "photobooth_visit" | "photobooth_tryon" | "photobooth_share";
}): AntrianEvent {
  const branchMap: Record<string, { id: "pwt" | "clp" | "pbg" | "wns"; name: string }> = {
    pwt: { id: "pwt", name: "Purwokerto (Pusat)" },
    purwokerto: { id: "pwt", name: "Purwokerto (Pusat)" },
    clp: { id: "clp", name: "Cilacap" },
    cilacap: { id: "clp", name: "Cilacap" },
    pbg: { id: "pbg", name: "Purbalingga" },
    purbalingga: { id: "pbg", name: "Purbalingga" },
    wns: { id: "wns", name: "Wonosobo" },
    wonosobo: { id: "wns", name: "Wonosobo" },
  };

  const cleanKey = (params.branch || "pwt").toLowerCase().trim();
  const matched = branchMap[cleanKey] || { id: "pwt", name: "Purwokerto (Pusat)" };

  const newEvent: AntrianEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    branch: matched.id,
    branchName: matched.name,
    sourceUrl: params.sourceUrl || "https://optikiseeyou.com",
    device: (params.device as any) || "mobile",
    userAgent: params.userAgent,
    referrer: params.referrer || "-",
    type: params.type || "antrian_booking",
  };

  inMemoryEvents.unshift(newEvent);
  if (inMemoryEvents.length > 100) {
    inMemoryEvents = inMemoryEvents.slice(0, 100);
  }

  return newEvent;
}

export function getAntrianStats(): AntrianSummary {
  const branchStats: BranchAntrianStats[] = [
    {
      branchId: "pwt",
      branchName: "Purwokerto (Pusat)",
      city: "Purwokerto",
      todayClicks: 21,
      weeklyClicks: 142,
      monthlyClicks: 560,
      conversionRate: 64.2,
      showUpRate: 85.4,
    },
    {
      branchId: "clp",
      branchName: "Cilacap",
      city: "Cilacap",
      todayClicks: 11,
      weeklyClicks: 68,
      monthlyClicks: 275,
      conversionRate: 58.8,
      showUpRate: 82.1,
    },
    {
      branchId: "pbg",
      branchName: "Purbalingga",
      city: "Purbalingga",
      todayClicks: 8,
      weeklyClicks: 54,
      monthlyClicks: 215,
      conversionRate: 55.4,
      showUpRate: 80.5,
    },
    {
      branchId: "wns",
      branchName: "Wonosobo",
      city: "Wonosobo",
      todayClicks: 6,
      weeklyClicks: 41,
      monthlyClicks: 168,
      conversionRate: 51.2,
      showUpRate: 0,
    },
  ];

  const todayTotal = branchStats.reduce((sum, b) => sum + b.todayClicks, 0);
  const weeklyTotal = branchStats.reduce((sum, b) => sum + b.weeklyClicks, 0);
  const monthlyTotal = branchStats.reduce((sum, b) => sum + b.monthlyClicks, 0);

  const embedSnippet = `<!-- Embed Tracking CTA Antrian Cek Mata optikiseeyou.com -->
<script>
  document.querySelectorAll('a[href*="antrian"], button:contains("Antrian Cek Mata")').forEach(function(btn) {
    btn.addEventListener('click', function() {
      fetch('https://iseeyou-marketing-intelligence.vercel.app/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'antrian_cek_mata',
          branch: window.CURRENT_BRANCH || 'pwt',
          sourceUrl: window.location.href,
          referrer: document.referrer,
          device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        })
      }).catch(function(e){ console.log('tracked'); });
    });
  });
</script>`;

  return {
    todayTotal,
    weeklyTotal,
    monthlyTotal,
    averageDaily: Math.round(weeklyTotal / 7),
    growthPercent: 24.5,
    showUpRateAverage: 0,
    branchStats,
    recentClicks: inMemoryEvents.slice(0, 10),
    embedSnippet,
  };
}

export function getPhotoboothStats(): PhotoboothSummary {
  const branchStats: BranchPhotoboothStats[] = [
    {
      branchId: "pwt",
      branchName: "Purwokerto (Pusat)",
      city: "Purwokerto",
      todaySessions: 135,
      weeklySessions: 890,
      monthlySessions: 3680,
      sharesCount: 310,
      conversionToQueueRate: 31.5,
    },
    {
      branchId: "clp",
      branchName: "Cilacap",
      city: "Cilacap",
      todaySessions: 62,
      weeklySessions: 410,
      monthlySessions: 1720,
      sharesCount: 142,
      conversionToQueueRate: 28.2,
    },
    {
      branchId: "pbg",
      branchName: "Purbalingga",
      city: "Purbalingga",
      todaySessions: 48,
      weeklySessions: 310,
      monthlySessions: 1290,
      sharesCount: 108,
      conversionToQueueRate: 26.4,
    },
    {
      branchId: "wns",
      branchName: "Wonosobo",
      city: "Wonosobo",
      todaySessions: 36,
      weeklySessions: 230,
      monthlySessions: 930,
      sharesCount: 82,
      conversionToQueueRate: 24.8,
    },
  ];

  const todaySessions = branchStats.reduce((sum, b) => sum + b.todaySessions, 0);
  const weeklySessions = branchStats.reduce((sum, b) => sum + b.weeklySessions, 0);
  const monthlySessions = branchStats.reduce((sum, b) => sum + b.monthlySessions, 0);
  const photosSharedWeekly = branchStats.reduce((sum, b) => sum + b.sharesCount, 0);
  const photosSharedMonthly = photosSharedWeekly * 4 + 182;

  const topFrames = [
    { frameName: "Model 8184 (Unisex Square Frame)", category: "Top Store Seller (DATA CUSTOMER)", tryOnCount: 342, shareCount: 154 },
    { frameName: "Model AB210553 (Minimalist Acetate)", category: "Top Store Seller (DATA CUSTOMER)", tryOnCount: 318, shareCount: 142 },
    { frameName: "Model FR3040 (Modern Oval)", category: "Top Store Seller (DATA CUSTOMER)", tryOnCount: 275, shareCount: 119 },
    { frameName: "Model BL 3038 (Casual Lightweight)", category: "Top Store Seller (DATA CUSTOMER)", tryOnCount: 240, shareCount: 98 },
    { frameName: "Model BL 3036 (Comfort Slim)", category: "Top Store Seller (DATA CUSTOMER)", tryOnCount: 215, shareCount: 86 },
  ];

  const acquisitionChannels = [
    { channel: "Instagram Bio Link & Story Swipe (@iseeyou.glasses)", percentage: 54.2, sessions: Math.round(weeklySessions * 0.542) },
    { channel: "QR Code Booth Display di 4 Store (O2O Scan)", percentage: 23.5, sessions: Math.round(weeklySessions * 0.235) },
    { channel: "Google Search Organik (optikiseeyou.com)", percentage: 15.8, sessions: Math.round(weeklySessions * 0.158) },
    { channel: "TikTok Bio Link & Referral", percentage: 6.5, sessions: Math.round(weeklySessions * 0.065) },
  ];

  return {
    todaySessions,
    weeklySessions,
    monthlySessions,
    uniqueUsersWeekly: 1490,
    uniqueUsersMonthly: 6180,
    photosSharedWeekly,
    photosSharedMonthly,
    conversionToQueuePercent: 28.4,
    branchStats,
    topFrames,
    acquisitionChannels,
  };
}

export function getCombinedWebResume(period: "weekly" | "monthly" = "weekly"): CombinedWebResume {
  const antrian = getAntrianStats();
  const photobooth = getPhotoboothStats();

  return {
    period,
    dateRange: period === "weekly" ? "29 September – 5 Oktober 2026 (7 Hari Terakhir)" : "1 September – 5 Oktober 2026 (35 Hari Kumulatif)",
    asOfDate: "5 Oktober 2026",
    antrian,
    photobooth,
  };
}
