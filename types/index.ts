export type DataSource =
  | "manual"
  | "instagram_insights"
  | "csv_import"
  | "sheets_sync"
  | "google_search_console"
  | "seed_demo";

export interface MetricProvenance {
  source: DataSource;
  date: string;
  sourceLabel: string;
  isDemo: boolean;
}

export interface MetricRecord {
  id: string;
  key: string;
  label: string;
  value: number;
  unit?: string;
  previousValue?: number;
  deltaPercent?: number;
  date: string;
  source: DataSource;
  sourceLabel: string;
  isDemo: boolean;
  notes?: string;
}

export type ContentFormat = "reels" | "carousel" | "feed" | "story";

export interface ContentItem {
  id: string;
  title: string;
  captionPreview: string;
  format: ContentFormat;
  category: string;
  publishDate: string;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  engagementRate: number;
  saveRate: number; // saves / reach * 100
  rank: number;
  isDominantPerformer?: boolean;
  keyObservation: string;
  source: DataSource;
  isDemo: boolean;
  thumbnail?: string;
  branchName?: string;
  branchKey?: string;
  postUrl?: string;
  pic?: string;
  isPinned?: boolean;
}

export interface PriorityIssue {
  id: string;
  type: "opportunity" | "concern" | "observation";
  title: string;
  description: string;
  impactMetric: string;
  suggestedAction: string;
}

export interface WeeklyReportSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
}

export type AiLayerTag = "FAKTA" | "INTERPRETASI" | "REKOMENDASI";

export interface AiNarrativeItem {
  id: string;
  tag: AiLayerTag;
  text: string;
  metricBasis?: string;
}

export interface WeeklyReport {
  id: string;
  weekNumber: number;
  periodLabel: string;
  startDate: string;
  endDate: string;
  status: "draft" | "reviewed" | "final";
  executiveSummary: string;
  headlineMetrics: {
    totalFollowers: MetricRecord;
    weeklyReach: MetricRecord;
    totalEngagements: MetricRecord;
    saveToReachRatio: MetricRecord;
  };
  pencapaian: string[];
  kendala: string[];
  planStrategi: string[];
  masukanTim: string[];
  aiAnalysis: AiNarrativeItem[];
}

export interface DesignDatabaseItem {
  id: string;
  timestamp: string;
  date: string;
  pic: string;
  designName: string;
  fileUrl: string;
  creator?: string;
  designTitle?: string;
}

export interface MonthlyPeriod {
  monthKey: string; // format "YYYY-MM", e.g. "2026-10" or "2026-11"
  label: string; // e.g. "Oktober 2026", "November 2026"
}

export interface DailyIgPostSummary {
  date: string; // format "YYYY-MM-DD"
  formattedDate: string; // e.g. "13 Oktober 2026"
  postCount: number;
  designCount: number;
  posts: ContentItem[];
  designs: DesignDatabaseItem[];
  totalReach: number;
  totalLikes: number;
  avgEngagementRate: number;
}

export interface DesignerMonthlySummary {
  pic: string;
  totalDesigns: number;
  totalIgPosts: number;
  percentageShare: number;
  designs: DesignDatabaseItem[];
  igPosts: ContentItem[];
  totalReach: number;
  avgEngagementRate: number;
}

export interface MonthlyWebPerformanceData {
  monthKey: string;
  monthLabel: string;
  photobooth: {
    totalSessions: number;
    uniqueUsers: number;
    sharedPhotos: number;
    conversionRate: number;
    topFrames: { model: string; tries: number; shares: number }[];
  };
  queue: {
    totalRegistered: number;
    dailyAverage: number;
    byBranch: { branchName: string; count: number }[];
  };
  gsc: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
    topPages: { page: string; clicks: number; impressions: number }[];
    dailyTrend: { date: string; clicks: number; impressions: number; sessions?: number; queueBookings?: number }[];
  };
}
