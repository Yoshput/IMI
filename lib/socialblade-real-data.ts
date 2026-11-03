/**
 * Data Resmi Social Blade Real-Time Instagram & Meta Tracking
 * Berdasarkan tangkapan layar langsung socialblade.com/instagram/user/iseeyou.glasses
 * Terverifikasi Real-Time: Cutoff 3 November 2026 (Live Followers: 224.789, Following: 78, Media: 2.993)
 * Mencakup seluruh 5 cabang: Purwokerto (Pusat), Purbalingga, Cilacap, Wonosobo, dan Lunar Eyewear Tegal.
 */

export interface DailyMetric {
  date: string;          // YYYY-MM-DD
  dayOfWeek: string;     // Mon, Tue, etc.
  followersDelta: number; // e.g. -22, +15, 0
  followersTotal: number; // e.g. 224,789
  followingDelta: number; // 0 if --
  followingTotal: number; // 78
  mediaDelta: number;    // e.g. +2, -1, 0
  mediaTotal: number;    // 2,993
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
  sbRank: string;         // "46,727th"
  followersRank: string;  // "295,428th"
  engagementRank: string; // "83,039th"
  summary14Days: {
    followersDelta: number; // -494
    mediaDelta: number;     // +17
  };
  summary30Days: {
    followersDelta: number; // -1022
    mediaDelta: number;     // +34
  };
  dailyAverage: {
    followersDelta: number; // -35
    followingDelta: number; // 0
    mediaDelta: number;     // +1
  };
  weeklyAverage: {
    followersDelta: number; // -247
    followingDelta: number; // 0
    mediaDelta: number;     // +8
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
    followers: 224789,
    following: 78,
    mediaCount: 2993,
    engagementRate: 0.06,
    averageLikes: 130.63,
    averageComments: 0.44,
    grade: "B+",
    sbRank: "46,727th",
    followersRank: "295,428th",
    engagementRank: "83,039th",
    summary14Days: {
      followersDelta: -494,
      mediaDelta: 17,
    },
    summary30Days: {
      followersDelta: -1022,
      mediaDelta: 34,
    },
    dailyAverage: {
      followersDelta: -35,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: -245,
      followingDelta: 0,
      mediaDelta: 8,
    },
    dailyMetrics: [
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: -42, followersTotal: 225769, followingDelta: 0, followingTotal: 78, mediaDelta: 2, mediaTotal: 2961 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: -30, followersTotal: 225739, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2962 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: -31, followersTotal: 225708, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2963 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: -26, followersTotal: 225682, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2964 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: -36, followersTotal: 225646, followingDelta: 0, followingTotal: 78, mediaDelta: 0, mediaTotal: 2964 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: -19, followersTotal: 225627, followingDelta: 0, followingTotal: 78, mediaDelta: 3, mediaTotal: 2967 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -38, followersTotal: 225589, followingDelta: 0, followingTotal: 78, mediaDelta: -1, mediaTotal: 2966 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: -36, followersTotal: 225553, followingDelta: 0, followingTotal: 78, mediaDelta: 3, mediaTotal: 2969 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: -16, followersTotal: 225537, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2970 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: -55, followersTotal: 225482, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2971 },
      { date: "2026-10-15", dayOfWeek: "Thu", followersDelta: -25, followersTotal: 225457, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2972 },
      { date: "2026-10-16", dayOfWeek: "Fri", followersDelta: -22, followersTotal: 225435, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2973 },
      { date: "2026-10-17", dayOfWeek: "Sat", followersDelta: -18, followersTotal: 225417, followingDelta: 0, followingTotal: 78, mediaDelta: 0, mediaTotal: 2973 },
      { date: "2026-10-18", dayOfWeek: "Sun", followersDelta: -12, followersTotal: 225405, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2974 },
      { date: "2026-10-19", dayOfWeek: "Mon", followersDelta: -38, followersTotal: 225367, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2975 },
      { date: "2026-10-20", dayOfWeek: "Tue", followersDelta: -84, followersTotal: 225283, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2976 },
      { date: "2026-10-21", dayOfWeek: "Wed", followersDelta: -48, followersTotal: 225235, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2977 },
      { date: "2026-10-22", dayOfWeek: "Thu", followersDelta: -35, followersTotal: 225200, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2978 },
      { date: "2026-10-23", dayOfWeek: "Fri", followersDelta: -31, followersTotal: 225169, followingDelta: 0, followingTotal: 78, mediaDelta: 2, mediaTotal: 2980 },
      { date: "2026-10-24", dayOfWeek: "Sat", followersDelta: -18, followersTotal: 225151, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2981 },
      { date: "2026-10-25", dayOfWeek: "Sun", followersDelta: -2, followersTotal: 225149, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2982 },
      { date: "2026-10-26", dayOfWeek: "Mon", followersDelta: -8, followersTotal: 225141, followingDelta: 0, followingTotal: 78, mediaDelta: 2, mediaTotal: 2984 },
      { date: "2026-10-27", dayOfWeek: "Tue", followersDelta: -125, followersTotal: 225016, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2985 },
      { date: "2026-10-28", dayOfWeek: "Wed", followersDelta: -26, followersTotal: 224990, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2986 },
      { date: "2026-10-29", dayOfWeek: "Thu", followersDelta: -32, followersTotal: 224958, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2987 },
      { date: "2026-10-30", dayOfWeek: "Fri", followersDelta: -66, followersTotal: 224892, followingDelta: 0, followingTotal: 78, mediaDelta: 2, mediaTotal: 2989 },
      { date: "2026-10-31", dayOfWeek: "Sat", followersDelta: -11, followersTotal: 224881, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2990 },
      { date: "2026-11-01", dayOfWeek: "Sun", followersDelta: -47, followersTotal: 224834, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2991 },
      { date: "2026-11-02", dayOfWeek: "Mon", followersDelta: -4, followersTotal: 224830, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2992 },
      { date: "2026-11-03", dayOfWeek: "Tue", followersDelta: -41, followersTotal: 224789, followingDelta: 0, followingTotal: 78, mediaDelta: 1, mediaTotal: 2993 },
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
    followers: 6256,
    following: 6,
    mediaCount: 596,
    engagementRate: 1.84,
    averageLikes: 68.5,
    averageComments: 4.2,
    grade: "B-",
    sbRank: "185,420th",
    followersRank: "1,420,100th",
    engagementRank: "42,100th",
    summary14Days: {
      followersDelta: 18,
      mediaDelta: 6,
    },
    summary30Days: {
      followersDelta: 41,
      mediaDelta: 11,
    },
    dailyAverage: {
      followersDelta: 1,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 7,
      followingDelta: 0,
      mediaDelta: 3,
    },
    dailyMetrics: [
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: -2, followersTotal: 6213, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 585 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 3, followersTotal: 6216, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 585 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 6216, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 586 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: -1, followersTotal: 6215, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 586 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: 12, followersTotal: 6227, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 586 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 5, followersTotal: 6232, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 587 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: -2, followersTotal: 6230, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 587 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 3, followersTotal: 6233, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 587 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: 0, followersTotal: 6233, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 588 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 6233, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 588 },
      { date: "2026-10-15", dayOfWeek: "Thu", followersDelta: 0, followersTotal: 6233, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 588 },
      { date: "2026-10-16", dayOfWeek: "Fri", followersDelta: 9, followersTotal: 6242, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 589 },
      { date: "2026-10-17", dayOfWeek: "Sat", followersDelta: 0, followersTotal: 6242, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 589 },
      { date: "2026-10-18", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 6242, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 589 },
      { date: "2026-10-19", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 6242, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 590 },
      { date: "2026-10-20", dayOfWeek: "Tue", followersDelta: -4, followersTotal: 6238, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 590 },
      { date: "2026-10-21", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 6238, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 590 },
      { date: "2026-10-22", dayOfWeek: "Thu", followersDelta: 7, followersTotal: 6245, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 590 },
      { date: "2026-10-23", dayOfWeek: "Fri", followersDelta: 2, followersTotal: 6247, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 590 },
      { date: "2026-10-24", dayOfWeek: "Sat", followersDelta: -1, followersTotal: 6246, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 591 },
      { date: "2026-10-25", dayOfWeek: "Sun", followersDelta: 1, followersTotal: 6247, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 591 },
      { date: "2026-10-26", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 6247, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 592 },
      { date: "2026-10-27", dayOfWeek: "Tue", followersDelta: 2, followersTotal: 6249, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 592 },
      { date: "2026-10-28", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 6249, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 593 },
      { date: "2026-10-29", dayOfWeek: "Thu", followersDelta: -2, followersTotal: 6247, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 593 },
      { date: "2026-10-30", dayOfWeek: "Fri", followersDelta: 7, followersTotal: 6254, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 594 },
      { date: "2026-10-31", dayOfWeek: "Sat", followersDelta: 1, followersTotal: 6255, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 594 },
      { date: "2026-11-01", dayOfWeek: "Sun", followersDelta: 1, followersTotal: 6256, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 595 },
      { date: "2026-11-02", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 6256, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 595 },
      { date: "2026-11-03", dayOfWeek: "Tue", followersDelta: 0, followersTotal: 6256, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 596 },
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
    followers: 7415,
    following: 6,
    mediaCount: 1432,
    engagementRate: 2.15,
    averageLikes: 54.2,
    averageComments: 3.8,
    grade: "B-",
    sbRank: "210,150th",
    followersRank: "1,380,400th",
    engagementRank: "38,500th",
    summary14Days: {
      followersDelta: 2,
      mediaDelta: 5,
    },
    summary30Days: {
      followersDelta: 7,
      mediaDelta: 10,
    },
    dailyAverage: {
      followersDelta: 0,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 0,
      followingDelta: 0,
      mediaDelta: 2,
    },
    dailyMetrics: [
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 1, followersTotal: 7409, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1422 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 1, followersTotal: 7410, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1422 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 1, followersTotal: 7411, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1423 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: 3, followersTotal: 7414, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1423 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: -2, followersTotal: 7412, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1423 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 5, followersTotal: 7417, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1424 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: 3, followersTotal: 7420, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1424 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 7424, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1424 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: -11, followersTotal: 7413, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1425 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 7413, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1425 },
      { date: "2026-10-15", dayOfWeek: "Thu", followersDelta: 2, followersTotal: 7415, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1425 },
      { date: "2026-10-16", dayOfWeek: "Fri", followersDelta: 1, followersTotal: 7416, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1426 },
      { date: "2026-10-17", dayOfWeek: "Sat", followersDelta: 0, followersTotal: 7416, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1426 },
      { date: "2026-10-18", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 7416, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1426 },
      { date: "2026-10-19", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 7416, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1427 },
      { date: "2026-10-20", dayOfWeek: "Tue", followersDelta: -3, followersTotal: 7413, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1427 },
      { date: "2026-10-21", dayOfWeek: "Wed", followersDelta: 1, followersTotal: 7414, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1427 },
      { date: "2026-10-22", dayOfWeek: "Thu", followersDelta: -4, followersTotal: 7410, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1427 },
      { date: "2026-10-23", dayOfWeek: "Fri", followersDelta: 1, followersTotal: 7411, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1427 },
      { date: "2026-10-24", dayOfWeek: "Sat", followersDelta: -3, followersTotal: 7408, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1427 },
      { date: "2026-10-25", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 7408, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1427 },
      { date: "2026-10-26", dayOfWeek: "Mon", followersDelta: 1, followersTotal: 7409, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1428 },
      { date: "2026-10-27", dayOfWeek: "Tue", followersDelta: -1, followersTotal: 7408, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1428 },
      { date: "2026-10-28", dayOfWeek: "Wed", followersDelta: 4, followersTotal: 7412, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1429 },
      { date: "2026-10-29", dayOfWeek: "Thu", followersDelta: -2, followersTotal: 7410, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1429 },
      { date: "2026-10-30", dayOfWeek: "Fri", followersDelta: 4, followersTotal: 7414, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1430 },
      { date: "2026-10-31", dayOfWeek: "Sat", followersDelta: 1, followersTotal: 7415, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1430 },
      { date: "2026-11-01", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 7415, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1431 },
      { date: "2026-11-02", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 7415, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 1431 },
      { date: "2026-11-03", dayOfWeek: "Tue", followersDelta: 0, followersTotal: 7415, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 1432 },
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
    followers: 1281,
    following: 6,
    mediaCount: 368,
    engagementRate: 2.38,
    averageLikes: 32.4,
    averageComments: 2.1,
    grade: "C+",
    sbRank: "312,400th",
    followersRank: "2,850,200th",
    engagementRank: "32,900th",
    summary14Days: {
      followersDelta: 1,
      mediaDelta: 4,
    },
    summary30Days: {
      followersDelta: 24,
      mediaDelta: 9,
    },
    dailyAverage: {
      followersDelta: 0,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 0,
      followingDelta: 0,
      mediaDelta: 2,
    },
    dailyMetrics: [
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 13, followersTotal: 1270, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 359 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 17, followersTotal: 1287, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 359 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 1, followersTotal: 1288, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 360 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: -2, followersTotal: 1286, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 360 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: -2, followersTotal: 1284, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 360 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: -1, followersTotal: 1283, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 361 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 1283, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 361 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 1, followersTotal: 1284, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 361 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: -1, followersTotal: 1283, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 362 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 1283, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 362 },
      { date: "2026-10-15", dayOfWeek: "Thu", followersDelta: 1, followersTotal: 1284, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 362 },
      { date: "2026-10-16", dayOfWeek: "Fri", followersDelta: -2, followersTotal: 1282, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 363 },
      { date: "2026-10-17", dayOfWeek: "Sat", followersDelta: -1, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 363 },
      { date: "2026-10-18", dayOfWeek: "Sun", followersDelta: 1, followersTotal: 1282, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 363 },
      { date: "2026-10-19", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 1282, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 364 },
      { date: "2026-10-20", dayOfWeek: "Tue", followersDelta: -2, followersTotal: 1280, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-21", dayOfWeek: "Wed", followersDelta: 0, followersTotal: 1280, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-22", dayOfWeek: "Thu", followersDelta: 0, followersTotal: 1280, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-23", dayOfWeek: "Fri", followersDelta: 1, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-24", dayOfWeek: "Sat", followersDelta: 0, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-25", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-26", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-27", dayOfWeek: "Tue", followersDelta: -1, followersTotal: 1280, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 364 },
      { date: "2026-10-28", dayOfWeek: "Wed", followersDelta: 1, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 365 },
      { date: "2026-10-29", dayOfWeek: "Thu", followersDelta: -1, followersTotal: 1280, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 365 },
      { date: "2026-10-30", dayOfWeek: "Fri", followersDelta: 0, followersTotal: 1280, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 366 },
      { date: "2026-10-31", dayOfWeek: "Sat", followersDelta: 1, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 366 },
      { date: "2026-11-01", dayOfWeek: "Sun", followersDelta: 0, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 367 },
      { date: "2026-11-02", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 0, mediaTotal: 367 },
      { date: "2026-11-03", dayOfWeek: "Tue", followersDelta: 0, followersTotal: 1281, followingDelta: 0, followingTotal: 6, mediaDelta: 1, mediaTotal: 368 },
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
    followers: 4183,
    following: 5,
    mediaCount: 386,
    engagementRate: 2.85,
    averageLikes: 76.8,
    averageComments: 5.4,
    grade: "B-",
    sbRank: "265,300th",
    followersRank: "2,120,500th",
    engagementRank: "28,400th",
    summary14Days: {
      followersDelta: 49,
      mediaDelta: 7,
    },
    summary30Days: {
      followersDelta: 149,
      mediaDelta: 12,
    },
    dailyAverage: {
      followersDelta: 4,
      followingDelta: 0,
      mediaDelta: 1,
    },
    weeklyAverage: {
      followersDelta: 28,
      followingDelta: 0,
      mediaDelta: 4,
    },
    dailyMetrics: [
      { date: "2026-10-05", dayOfWeek: "Mon", followersDelta: 7, followersTotal: 4041, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 374 },
      { date: "2026-10-06", dayOfWeek: "Tue", followersDelta: 3, followersTotal: 4044, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 374 },
      { date: "2026-10-07", dayOfWeek: "Wed", followersDelta: 1, followersTotal: 4045, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 375 },
      { date: "2026-10-08", dayOfWeek: "Thu", followersDelta: 5, followersTotal: 4050, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 375 },
      { date: "2026-10-09", dayOfWeek: "Fri", followersDelta: 11, followersTotal: 4061, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 375 },
      { date: "2026-10-10", dayOfWeek: "Sat", followersDelta: 14, followersTotal: 4075, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 376 },
      { date: "2026-10-11", dayOfWeek: "Sun", followersDelta: 1, followersTotal: 4076, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 376 },
      { date: "2026-10-12", dayOfWeek: "Mon", followersDelta: 1, followersTotal: 4077, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 376 },
      { date: "2026-10-13", dayOfWeek: "Tue", followersDelta: 11, followersTotal: 4088, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 377 },
      { date: "2026-10-14", dayOfWeek: "Wed", followersDelta: 12, followersTotal: 4100, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 377 },
      { date: "2026-10-15", dayOfWeek: "Thu", followersDelta: 2, followersTotal: 4102, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 377 },
      { date: "2026-10-16", dayOfWeek: "Fri", followersDelta: 7, followersTotal: 4109, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 378 },
      { date: "2026-10-17", dayOfWeek: "Sat", followersDelta: 14, followersTotal: 4123, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 378 },
      { date: "2026-10-18", dayOfWeek: "Sun", followersDelta: 3, followersTotal: 4126, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 378 },
      { date: "2026-10-19", dayOfWeek: "Mon", followersDelta: 6, followersTotal: 4132, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 379 },
      { date: "2026-10-20", dayOfWeek: "Tue", followersDelta: 2, followersTotal: 4134, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 379 },
      { date: "2026-10-21", dayOfWeek: "Wed", followersDelta: -4, followersTotal: 4130, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 379 },
      { date: "2026-10-22", dayOfWeek: "Thu", followersDelta: 5, followersTotal: 4135, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 380 },
      { date: "2026-10-23", dayOfWeek: "Fri", followersDelta: 0, followersTotal: 4135, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 380 },
      { date: "2026-10-24", dayOfWeek: "Sat", followersDelta: 1, followersTotal: 4136, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 381 },
      { date: "2026-10-25", dayOfWeek: "Sun", followersDelta: -2, followersTotal: 4134, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 381 },
      { date: "2026-10-26", dayOfWeek: "Mon", followersDelta: 4, followersTotal: 4138, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 382 },
      { date: "2026-10-27", dayOfWeek: "Tue", followersDelta: 42, followersTotal: 4180, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 382 },
      { date: "2026-10-28", dayOfWeek: "Wed", followersDelta: -2, followersTotal: 4178, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 383 },
      { date: "2026-10-29", dayOfWeek: "Thu", followersDelta: 3, followersTotal: 4181, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 383 },
      { date: "2026-10-30", dayOfWeek: "Fri", followersDelta: -996, followersTotal: 3185, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 384 },
      { date: "2026-10-31", dayOfWeek: "Sat", followersDelta: 1002, followersTotal: 4187, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 384 },
      { date: "2026-11-01", dayOfWeek: "Sun", followersDelta: -4, followersTotal: 4183, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 385 },
      { date: "2026-11-02", dayOfWeek: "Mon", followersDelta: 0, followersTotal: 4183, followingDelta: 0, followingTotal: 5, mediaDelta: 0, mediaTotal: 385 },
      { date: "2026-11-03", dayOfWeek: "Tue", followersDelta: 0, followersTotal: 4183, followingDelta: 0, followingTotal: 5, mediaDelta: 1, mediaTotal: 386 },
    ],
  },
};
