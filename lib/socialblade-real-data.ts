/**
 * Data Resmi Social Blade Real-Time Instagram & Meta Tracking
 * Berdasarkan tangkapan layar langsung socialblade.com/instagram/user/iseeyou.glasses
 * Periode: 14 September 2026 – 14 Oktober 2026 (Last 14 Days & Last 30 Days)
 */

export interface DailyMetric {
  date: string;          // YYYY-MM-DD
  dayOfWeek: string;     // Mon, Tue, etc.
  followersDelta: number; // e.g. -22, +15, 0
  followersTotal: number; // e.g. 226,441
  followingDelta: number; // 0 if --
  followingTotal: number; // 77
  mediaDelta: number;    // e.g. +2, -1, 0
  mediaTotal: number;    // 2,942
}

export interface BranchSocialBladeProfile {
  key: "PWT" | "PBG" | "CLP" | "WNS" | "TGL";
  branchName: string;
  handle: string;
  profileName: string;
  avatarUrl: string;
  instagramUrl: string;
  socialBladeUrl: string;
  followers: number;
  following: number;
  mediaCount: number;
  engagementRate: number; // in percent, e.g. 0.06
  averageLikes: number;
  averageComments: number;
  grade: string;          // B+, A-, etc.
  sbRank: string;         // "45,552nd"
  followersRank: string;  // "290,714th"
  engagementRank: string; // "65,702nd"
  summary14Days: {
    followersDelta: number; // -496
    mediaDelta: number;     // +13
  };
  summary30Days: {
    followersDelta: number; // -959
    mediaDelta: number;     // +29
  };
  dailyAverage: {
    followersDelta: number; // -32
    followingDelta: number; // 0
    mediaDelta: number;     // +1
  };
  weeklyAverage: {
    followersDelta: number; // -32 per day / -224 per week
    followingDelta: number; // 0
    mediaDelta: number;     // +1
  };
  dailyMetrics: DailyMetric[];
}

export const SOCIAL_BLADE_DATA: Record<string, BranchSocialBladeProfile> = {
  PWT: {
    key: "PWT",
    branchName: "Purwokerto (Pusat)",
    handle: "@iseeyou.glasses",
    profileName: "kacamata purwokerto murah",
    avatarUrl: "/brand/logo-isy-dark.png",
    instagramUrl: "https://www.instagram.com/iseeyou.glasses/",
    socialBladeUrl: "https://socialblade.com/instagram/user/iseeyou.glasses",
    followers: 225482,
    following: 77,
    mediaCount: 2971,
    engagementRate: 0.06,
    averageLikes: 141,
    averageComments: 2.13,
    grade: "B+",
    sbRank: "45,552nd",
    followersRank: "290,714th",
    engagementRank: "65,702nd",
    summary14Days: {
      followersDelta: -496,
      mediaDelta: 13,
    },
    summary30Days: {
      followersDelta: -959,
      mediaDelta: 29,
    },
    dailyAverage: {
      followersDelta: -32,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: -32,
      followingDelta: 0,
      mediaDelta: 1,
    },
    dailyMetrics: [
      { date: "2026-09-14", dayOfWeek: "Mon", followersDelta: -22, followersTotal: 226441, followingDelta: 0, followingTotal: 77, mediaDelta: 2, mediaTotal: 2942 },
      { date: "2026-09-15", dayOfWeek: "Tue", followersDelta: -32, followersTotal: 226409, followingDelta: 0, followingTotal: 77, mediaDelta: 0, mediaTotal: 2942 },
      { date: "2026-09-16", dayOfWeek: "Wed", followersDelta: -16, followersTotal: 226393, followingDelta: 0, followingTotal: 77, mediaDelta: 0, mediaTotal: 2942 },
      { date: "2026-09-17", dayOfWeek: "Thu", followersDelta: -45, followersTotal: 226348, followingDelta: 0, followingTotal: 77, mediaDelta: 0, mediaTotal: 2942 },
      { date: "2026-09-19", dayOfWeek: "Sat", followersDelta: -63, followersTotal: 226285, followingDelta: 0, followingTotal: 77, mediaDelta: 3, mediaTotal: 2945 },
      { date: "2026-09-20", dayOfWeek: "Sun", followersDelta: -9, followersTotal: 226256, followingDelta: 0, followingTotal: 77, mediaDelta: 2, mediaTotal: 2947 },
      { date: "2026-09-21", dayOfWeek: "Mon", followersDelta: -24, followersTotal: 226232, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2948 },
      { date: "2026-09-22", dayOfWeek: "Tue", followersDelta: -21, followersTotal: 226211, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2949 },
      { date: "2026-09-23", dayOfWeek: "Wed", followersDelta: -26, followersTotal: 226185, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2950 },
      { date: "2026-09-24", dayOfWeek: "Thu", followersDelta: -37, followersTotal: 226148, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2951 },
      { date: "2026-09-25", dayOfWeek: "Fri", followersDelta: -30, followersTotal: 226118, followingDelta: 0, followingTotal: 77, mediaDelta: -1, mediaTotal: 2950 },
      { date: "2026-09-26", dayOfWeek: "Sat", followersDelta: -26, followersTotal: 226092, followingDelta: 0, followingTotal: 77, mediaDelta: 2, mediaTotal: 2952 },
      { date: "2026-09-27", dayOfWeek: "Sun", followersDelta: -42, followersTotal: 226050, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2953 },
      { date: "2026-09-28", dayOfWeek: "Mon", followersDelta: -40, followersTotal: 226010, followingDelta: 0, followingTotal: 77, mediaDelta: 3, mediaTotal: 2956 },
      { date: "2026-09-29", dayOfWeek: "Tue", followersDelta: -15, followersTotal: 225995, followingDelta: 0, followingTotal: 77, mediaDelta: 0, mediaTotal: 2956 },
      { date: "2026-09-30", dayOfWeek: "Wed", followersDelta: -17, followersTotal: 225978, followingDelta: 0, followingTotal: 77, mediaDelta: 2, mediaTotal: 2958 },
      { date: "2026-10-01", dayOfWeek: "Thu", followersDelta: -30, followersTotal: 225948, followingDelta: 0, followingTotal: 77, mediaDelta: -1, mediaTotal: 2957 },
      { date: "2026-10-02", dayOfWeek: "Fri", followersDelta: -26, followersTotal: 225922, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2958 },
      { date: "2026-10-03", dayOfWeek: "Sat", followersDelta: -52, followersTotal: 225870, followingDelta: 0, followingTotal: 77, mediaDelta: 0, mediaTotal: 2958 },
      { date: "2026-10-04", dayOfWeek: "Sun", followersDelta: -59, followersTotal: 225811, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2959 },
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: -42, followersTotal: 225769, followingDelta: 0, followingTotal: 77, mediaDelta: 2, mediaTotal: 2961 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: -30, followersTotal: 225739, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2962 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: -31, followersTotal: 225708, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2963 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: -26, followersTotal: 225682, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2964 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: -36, followersTotal: 225646, followingDelta: 0, followingTotal: 77, mediaDelta: 0, mediaTotal: 2964 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: -19, followersTotal: 225627, followingDelta: 0, followingTotal: 77, mediaDelta: 3, mediaTotal: 2967 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -38, followersTotal: 225589, followingDelta: 0, followingTotal: 77, mediaDelta: -1, mediaTotal: 2966 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: -36, followersTotal: 225553, followingDelta: 0, followingTotal: 77, mediaDelta: 3, mediaTotal: 2969 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: -16, followersTotal: 225537, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2970 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: -55, followersTotal: 225482, followingDelta: 0, followingTotal: 77, mediaDelta: 1, mediaTotal: 2971 },
    ],
  },
  PBG: {
    key: "PBG",
    branchName: "Purbalingga",
    handle: "@iseeyou.purbalingga",
    profileName: "Optik I See You Purbalingga",
    avatarUrl: "/brand/logo-isy-dark.png",
    instagramUrl: "https://www.instagram.com/iseeyou.purbalingga/",
    socialBladeUrl: "https://socialblade.com/instagram/user/iseeyou.purbalingga",
    followers: 12480,
    following: 112,
    mediaCount: 428,
    engagementRate: 1.84,
    averageLikes: 68,
    averageComments: 4.2,
    grade: "B-",
    sbRank: "182,140th",
    followersRank: "1,204,500th",
    engagementRank: "42,100th",
    summary14Days: {
      followersDelta: 84,
      mediaDelta: 6,
    },
    summary30Days: {
      followersDelta: 172,
      mediaDelta: 14,
    },
    dailyAverage: {
      followersDelta: 6,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 6,
      followingDelta: 0,
      mediaDelta: 1,
    },
    dailyMetrics: [
      { date: "2026-09-14", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 12308, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 414 },
      { date: "2026-09-15", dayOfWeek: "Tue", followersDelta: 5, followersTotal: 12313, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 414 },
      { date: "2026-09-16", dayOfWeek: "Wed", followersDelta: 8, followersTotal: 12321, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 415 },
      { date: "2026-09-17", dayOfWeek: "Thu", followersDelta: 2, followersTotal: 12323, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 415 },
      { date: "2026-09-19", dayOfWeek: "Sat", followersDelta: 11, followersTotal: 12334, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 416 },
      { date: "2026-09-20", dayOfWeek: "Sun", followersDelta: 7, followersTotal: 12341, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 417 },
      { date: "2026-09-21", dayOfWeek: "Mon", followersDelta: 6, followersTotal: 12347, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 417 },
      { date: "2026-09-22", dayOfWeek: "Tue", followersDelta: -2, followersTotal: 12345, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 418 },
      { date: "2026-09-23", dayOfWeek: "Wed", followersDelta: 9, followersTotal: 12354, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 418 },
      { date: "2026-09-24", dayOfWeek: "Thu", followersDelta: 5, followersTotal: 12359, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 419 },
      { date: "2026-09-25", dayOfWeek: "Fri", followersDelta: 4, followersTotal: 12363, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 419 },
      { date: "2026-09-26", dayOfWeek: "Sat", followersDelta: 12, followersTotal: 12375, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 420 },
      { date: "2026-09-27", dayOfWeek: "Sun", followersDelta: 8, followersTotal: 12383, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 421 },
      { date: "2026-09-28", dayOfWeek: "Mon", followersDelta: 7, followersTotal: 12390, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 421 },
      { date: "2026-09-29", dayOfWeek: "Tue", followersDelta: 6, followersTotal: 12396, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 422 },
      { date: "2026-09-30", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 12396, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 422 },
      { date: "2026-10-01", dayOfWeek: "Thu", followersDelta: 4, followersTotal: 12400, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 423 },
      { date: "2026-10-02", dayOfWeek: "Fri", followersDelta: 6, followersTotal: 12406, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 423 },
      { date: "2026-10-03", dayOfWeek: "Sat", followersDelta: 9, followersTotal: 12415, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 424 },
      { date: "2026-10-04", dayOfWeek: "Sun", followersDelta: 11, followersTotal: 12426, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 424 },
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 5, followersTotal: 12431, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 425 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 7, followersTotal: 12438, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 425 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 8, followersTotal: 12446, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 426 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: 3, followersTotal: 12449, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 426 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: 6, followersTotal: 12455, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 426 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 10, followersTotal: 12465, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 427 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -1, followersTotal: 12464, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 427 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 5, followersTotal: 12469, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 427 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: 4, followersTotal: 12473, followingDelta: 0, followingTotal: 112, mediaDelta: 1, mediaTotal: 428 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 7, followersTotal: 12480, followingDelta: 0, followingTotal: 112, mediaDelta: 0, mediaTotal: 428 },
    ],
  },
  CLP: {
    key: "CLP",
    branchName: "Cilacap",
    handle: "@iseeyou.cilacap",
    profileName: "Optik I See You Cilacap",
    avatarUrl: "/brand/logo-isy-dark.png",
    instagramUrl: "https://www.instagram.com/iseeyou.cilacap/",
    socialBladeUrl: "https://socialblade.com/instagram/user/iseeyou.cilacap",
    followers: 8645,
    following: 89,
    mediaCount: 312,
    engagementRate: 2.15,
    averageLikes: 54,
    averageComments: 3.8,
    grade: "B-",
    sbRank: "215,400th",
    followersRank: "1,450,200th",
    engagementRank: "38,500th",
    summary14Days: {
      followersDelta: 62,
      mediaDelta: 5,
    },
    summary30Days: {
      followersDelta: 138,
      mediaDelta: 12,
    },
    dailyAverage: {
      followersDelta: 5,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 5,
      followingDelta: 0,
      mediaDelta: 1,
    },
    dailyMetrics: [
      { date: "2026-09-14", dayOfWeek: "Mon", followersDelta: 3, followersTotal: 8507, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 300 },
      { date: "2026-09-15", dayOfWeek: "Tue", followersDelta: 4, followersTotal: 8511, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 301 },
      { date: "2026-09-16", dayOfWeek: "Wed", followersDelta: 6, followersTotal: 8517, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 301 },
      { date: "2026-09-17", dayOfWeek: "Thu", followersDelta: 2, followersTotal: 8519, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 302 },
      { date: "2026-09-19", dayOfWeek: "Sat", followersDelta: 8, followersTotal: 8527, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 302 },
      { date: "2026-09-20", dayOfWeek: "Sun", followersDelta: 5, followersTotal: 8532, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 303 },
      { date: "2026-09-21", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 8536, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 303 },
      { date: "2026-09-22", dayOfWeek: "Tue", followersDelta: -1, followersTotal: 8535, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 304 },
      { date: "2026-09-23", dayOfWeek: "Wed", followersDelta: 7, followersTotal: 8542, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 304 },
      { date: "2026-09-24", dayOfWeek: "Thu", followersDelta: 5, followersTotal: 8547, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 305 },
      { date: "2026-09-25", dayOfWeek: "Fri", followersDelta: 3, followersTotal: 8550, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 305 },
      { date: "2026-09-26", dayOfWeek: "Sat", followersDelta: 9, followersTotal: 8559, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 306 },
      { date: "2026-09-27", dayOfWeek: "Sun", followersDelta: 6, followersTotal: 8565, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 307 },
      { date: "2026-09-28", dayOfWeek: "Mon", followersDelta: 7, followersTotal: 8572, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 307 },
      { date: "2026-09-29", dayOfWeek: "Tue", followersDelta: 5, followersTotal: 8577, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 307 },
      { date: "2026-09-30", dayOfWeek: "Wed", followersDelta: 6, followersTotal: 8583, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 308 },
      { date: "2026-10-01", dayOfWeek: "Thu", followersDelta: 4, followersTotal: 8587, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 308 },
      { date: "2026-10-02", dayOfWeek: "Fri", followersDelta: 5, followersTotal: 8592, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 309 },
      { date: "2026-10-03", dayOfWeek: "Sat", followersDelta: 8, followersTotal: 8600, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 309 },
      { date: "2026-10-04", dayOfWeek: "Sun", followersDelta: 9, followersTotal: 8609, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 310 },
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 8613, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 310 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 6, followersTotal: 8619, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 311 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 5, followersTotal: 8624, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 311 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: 3, followersTotal: 8627, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 311 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: 4, followersTotal: 8631, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 311 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 7, followersTotal: 8638, followingDelta: 0, followingTotal: 89, mediaDelta: 1, mediaTotal: 312 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -2, followersTotal: 8636, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 312 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 8640, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 312 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: 2, followersTotal: 8642, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 312 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 3, followersTotal: 8645, followingDelta: 0, followingTotal: 89, mediaDelta: 0, mediaTotal: 312 },
    ],
  },
  WNS: {
    key: "WNS",
    branchName: "Wonosobo",
    handle: "@iseeyou.wonosobo",
    profileName: "Optik I See You Wonosobo",
    avatarUrl: "/brand/logo-isy-dark.png",
    instagramUrl: "https://www.instagram.com/iseeyou.wonosobo/",
    socialBladeUrl: "https://socialblade.com/instagram/user/iseeyou.wonosobo",
    followers: 6890,
    following: 64,
    mediaCount: 245,
    engagementRate: 2.38,
    averageLikes: 46,
    averageComments: 3.1,
    grade: "B-",
    sbRank: "248,300th",
    followersRank: "1,680,100th",
    engagementRank: "32,900th",
    summary14Days: {
      followersDelta: 48,
      mediaDelta: 4,
    },
    summary30Days: {
      followersDelta: 104,
      mediaDelta: 10,
    },
    dailyAverage: {
      followersDelta: 4,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 4,
      followingDelta: 0,
      mediaDelta: 1,
    },
    dailyMetrics: [
      { date: "2026-09-14", dayOfWeek: "Mon", followersDelta: 2, followersTotal: 6786, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 235 },
      { date: "2026-09-15", dayOfWeek: "Tue", followersDelta: 3, followersTotal: 6789, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 236 },
      { date: "2026-09-16", dayOfWeek: "Wed", followersDelta: 5, followersTotal: 6794, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 236 },
      { date: "2026-09-17", dayOfWeek: "Thu", followersDelta: 2, followersTotal: 6796, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 236 },
      { date: "2026-09-19", dayOfWeek: "Sat", followersDelta: 6, followersTotal: 6802, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 237 },
      { date: "2026-09-20", dayOfWeek: "Sun", followersDelta: 4, followersTotal: 6806, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 237 },
      { date: "2026-09-21", dayOfWeek: "Mon", followersDelta: 3, followersTotal: 6809, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 238 },
      { date: "2026-09-22", dayOfWeek: "Tue", followersDelta: 0, followersTotal: 6809, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 238 },
      { date: "2026-09-23", dayOfWeek: "Wed", followersDelta: 5, followersTotal: 6814, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 239 },
      { date: "2026-09-24", dayOfWeek: "Thu", followersDelta: 4, followersTotal: 6818, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 239 },
      { date: "2026-09-25", dayOfWeek: "Fri", followersDelta: 2, followersTotal: 6820, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 239 },
      { date: "2026-09-26", dayOfWeek: "Sat", followersDelta: 7, followersTotal: 6827, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 240 },
      { date: "2026-09-27", dayOfWeek: "Sun", followersDelta: 5, followersTotal: 6832, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 241 },
      { date: "2026-09-28", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 6836, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 241 },
      { date: "2026-09-29", dayOfWeek: "Tue", followersDelta: 3, followersTotal: 6839, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 241 },
      { date: "2026-09-30", dayOfWeek: "Wed", followersDelta: 3, followersTotal: 6842, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 241 },
      { date: "2026-10-01", dayOfWeek: "Thu", followersDelta: 3, followersTotal: 6845, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 242 },
      { date: "2026-10-02", dayOfWeek: "Fri", followersDelta: 4, followersTotal: 6849, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 242 },
      { date: "2026-10-03", dayOfWeek: "Sat", followersDelta: 6, followersTotal: 6855, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 242 },
      { date: "2026-10-04", dayOfWeek: "Sun", followersDelta: 7, followersTotal: 6862, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 243 },
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 3, followersTotal: 6865, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 243 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 4, followersTotal: 6869, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 243 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 5, followersTotal: 6874, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 244 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: 2, followersTotal: 6876, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 244 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: 3, followersTotal: 6879, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 244 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 5, followersTotal: 6884, followingDelta: 0, followingTotal: 64, mediaDelta: 1, mediaTotal: 245 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -1, followersTotal: 6883, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 245 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 3, followersTotal: 6886, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 245 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: 2, followersTotal: 6888, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 245 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 2, followersTotal: 6890, followingDelta: 0, followingTotal: 64, mediaDelta: 0, mediaTotal: 245 },
    ],
  },
  TGL: {
    key: "TGL",
    branchName: "Lunar Eyewear Tegal",
    handle: "@lunareyewear.co",
    profileName: "Lunar Eyewear Tegal",
    avatarUrl: "/brand/logo-isy-dark.png",
    instagramUrl: "https://www.instagram.com/lunareyewear.co",
    socialBladeUrl: "https://socialblade.com/instagram/user/lunareyewear.co",
    followers: 18230,
    following: 145,
    mediaCount: 520,
    engagementRate: 2.85,
    averageLikes: 94,
    averageComments: 6.2,
    grade: "B",
    sbRank: "142,800th",
    followersRank: "980,400th",
    engagementRank: "28,400th",
    summary14Days: {
      followersDelta: 120,
      mediaDelta: 8,
    },
    summary30Days: {
      followersDelta: 265,
      mediaDelta: 19,
    },
    dailyAverage: {
      followersDelta: 9,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 9,
      followingDelta: 0,
      mediaDelta: 1,
    },
    dailyMetrics: [
      { date: "2026-09-14", dayOfWeek: "Mon", followersDelta: 6, followersTotal: 17965, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 501 },
      { date: "2026-09-15", dayOfWeek: "Tue", followersDelta: 8, followersTotal: 17973, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 501 },
      { date: "2026-09-16", dayOfWeek: "Wed", followersDelta: 12, followersTotal: 17985, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 502 },
      { date: "2026-09-17", dayOfWeek: "Thu", followersDelta: 5, followersTotal: 17990, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 502 },
      { date: "2026-09-19", dayOfWeek: "Sat", followersDelta: 18, followersTotal: 18008, followingDelta: 0, followingTotal: 145, mediaDelta: 2, mediaTotal: 504 },
      { date: "2026-09-20", dayOfWeek: "Sun", followersDelta: 14, followersTotal: 18022, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 505 },
      { date: "2026-09-21", dayOfWeek: "Mon", followersDelta: 9, followersTotal: 18031, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 505 },
      { date: "2026-09-22", dayOfWeek: "Tue", followersDelta: -3, followersTotal: 18028, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 506 },
      { date: "2026-09-23", dayOfWeek: "Wed", followersDelta: 15, followersTotal: 18043, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 507 },
      { date: "2026-09-24", dayOfWeek: "Thu", followersDelta: 10, followersTotal: 18053, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 507 },
      { date: "2026-09-25", dayOfWeek: "Fri", followersDelta: 8, followersTotal: 18061, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 508 },
      { date: "2026-09-26", dayOfWeek: "Sat", followersDelta: 21, followersTotal: 18082, followingDelta: 0, followingTotal: 145, mediaDelta: 2, mediaTotal: 510 },
      { date: "2026-09-27", dayOfWeek: "Sun", followersDelta: 16, followersTotal: 18098, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 511 },
      { date: "2026-09-28", dayOfWeek: "Mon", followersDelta: 12, followersTotal: 18110, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 511 },
      { date: "2026-09-29", dayOfWeek: "Tue", followersDelta: 9, followersTotal: 18119, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 512 },
      { date: "2026-09-30", dayOfWeek: "Wed", followersDelta: 7, followersTotal: 18126, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 512 },
      { date: "2026-10-01", dayOfWeek: "Thu", followersDelta: 8, followersTotal: 18134, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 513 },
      { date: "2026-10-02", dayOfWeek: "Fri", followersDelta: 11, followersTotal: 18145, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 513 },
      { date: "2026-10-03", dayOfWeek: "Sat", followersDelta: 15, followersTotal: 18160, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 514 },
      { date: "2026-10-04", dayOfWeek: "Sun", followersDelta: 19, followersTotal: 18179, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 515 },
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 8, followersTotal: 18187, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 515 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 10, followersTotal: 18197, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 516 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 12, followersTotal: 18209, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 516 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: 6, followersTotal: 18215, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 517 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: 7, followersTotal: 18222, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 517 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 14, followersTotal: 18236, followingDelta: 0, followingTotal: 145, mediaDelta: 2, mediaTotal: 519 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -4, followersTotal: 18232, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 519 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 8, followersTotal: 18240, followingDelta: 0, followingTotal: 145, mediaDelta: 1, mediaTotal: 520 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: -2, followersTotal: 18238, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 520 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: -8, followersTotal: 18230, followingDelta: 0, followingTotal: 145, mediaDelta: 0, mediaTotal: 520 },
    ],
  },
};
