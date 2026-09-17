export type DataSource =
  | "manual"
  | "instagram_insights"
  | "csv_import"
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
  postUrl?: string;
  pic?: string;
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
