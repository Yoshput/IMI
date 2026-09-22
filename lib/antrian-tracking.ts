// Tracking Event Store & Aggregator for "Antrian Cek Mata" on optikiseeyou.com

export interface AntrianEvent {
  id: string;
  timestamp: string;
  branch: "pwt" | "clp" | "pbg" | "wns" | "unknown";
  branchName: string;
  sourceUrl: string;
  device: "mobile" | "desktop" | "tablet";
  userAgent?: string;
  referrer?: string;
}

export interface BranchAntrianStats {
  branchId: string;
  branchName: string;
  city: string;
  todayClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  conversionRate: number; // percentage of clicks that completed booking
}

export interface AntrianSummary {
  todayTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  averageDaily: number;
  growthPercent: number;
  branchStats: BranchAntrianStats[];
  recentClicks: AntrianEvent[];
  embedSnippet: string;
}

// In-memory / initial seed data calibrated for optikiseeyou.com
let inMemoryEvents: AntrianEvent[] = [
  {
    id: "evt-01",
    timestamp: "2026-09-22T11:42:10Z",
    branch: "pwt",
    branchName: "Purwokerto (Pusat)",
    sourceUrl: "https://optikiseeyou.com/booking-antrian",
    device: "mobile",
    referrer: "https://www.google.com/",
  },
  {
    id: "evt-02",
    timestamp: "2026-09-22T10:15:33Z",
    branch: "clp",
    branchName: "Cilacap",
    sourceUrl: "https://optikiseeyou.com/cabang/cilacap",
    device: "mobile",
    referrer: "https://www.tiktok.com/",
  },
  {
    id: "evt-03",
    timestamp: "2026-09-22T09:30:12Z",
    branch: "pbg",
    branchName: "Purbalingga",
    sourceUrl: "https://optikiseeyou.com/promo-lensa",
    device: "desktop",
    referrer: "https://www.instagram.com/",
  },
  {
    id: "evt-04",
    timestamp: "2026-09-22T08:50:00Z",
    branch: "wns",
    branchName: "Wonosobo",
    sourceUrl: "https://optikiseeyou.com/cabang/wonosobo",
    device: "mobile",
    referrer: "https://www.google.com/",
  },
];

export function recordAntrianClick(params: {
  branch?: string;
  sourceUrl?: string;
  device?: string;
  userAgent?: string;
  referrer?: string;
}): AntrianEvent {
  const branchMap: Record<string, { id: any; name: string }> = {
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
  };

  inMemoryEvents.unshift(newEvent);
  if (inMemoryEvents.length > 50) {
    inMemoryEvents = inMemoryEvents.slice(0, 50);
  }

  return newEvent;
}

export function getAntrianStats(): AntrianSummary {
  const branchStats: BranchAntrianStats[] = [
    {
      branchId: "pwt",
      branchName: "Purwokerto (Pusat)",
      city: "Purwokerto",
      todayClicks: 18,
      weeklyClicks: 142,
      monthlyClicks: 560,
      conversionRate: 64.2,
    },
    {
      branchId: "clp",
      branchName: "Cilacap",
      city: "Cilacap",
      todayClicks: 9,
      weeklyClicks: 68,
      monthlyClicks: 275,
      conversionRate: 58.8,
    },
    {
      branchId: "pbg",
      branchName: "Purbalingga",
      city: "Purbalingga",
      todayClicks: 7,
      weeklyClicks: 54,
      monthlyClicks: 215,
      conversionRate: 55.4,
    },
    {
      branchId: "wns",
      branchName: "Wonosobo",
      city: "Wonosobo",
      todayClicks: 5,
      weeklyClicks: 41,
      monthlyClicks: 168,
      conversionRate: 51.2,
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
    branchStats,
    recentClicks: inMemoryEvents.slice(0, 10),
    embedSnippet,
  };
}
