import { NextResponse } from "next/server";
import {
  getCachedInstagramData,
  saveCachedInstagramData,
  fetchIgProfileRaw,
  fetchIgReelRaw,
  parseFollowerNumber,
  IgLiveCache,
} from "@/lib/instagram-realtime";
import { OFFICIAL_BRANCH_ACCOUNTS } from "@/lib/branch-accounts";

export const dynamic = "force-dynamic";

export async function GET() {
  const cache = getCachedInstagramData();
  return NextResponse.json({
    success: true,
    data: cache,
  });
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const currentCache: IgLiveCache = getCachedInstagramData();
    const now = new Date();
    const updatedAccounts: IgLiveCache["accounts"] = { ...currentCache.accounts };
    const updatedReels: IgLiveCache["reels"] = { ...currentCache.reels };

    // 1. Refresh all 5 official branch accounts live from Instagram
    for (const acc of OFFICIAL_BRANCH_ACCOUNTS) {
      try {
        const live = await fetchIgProfileRaw(acc.url);
        if (live.followers) {
          const num = parseFollowerNumber(live.followers);
          updatedAccounts[acc.id] = {
            id: acc.id,
            name: acc.name,
            handle: acc.handle,
            url: acc.url,
            city: acc.city,
            picName: acc.picName,
            followers: num,
            followersFormatted: live.followers,
            following: parseInt(live.following?.replace(/,/g, "") || "0", 10),
            posts: parseInt(live.posts?.replace(/,/g, "") || "0", 10),
            bioTitle: live.title || undefined,
            lastUpdated: now.toISOString(),
          };
        }
      } catch (err) {
        console.error(`Error refreshing ${acc.handle}:`, err);
      }
    }

    // 2. If specific reel URLs are requested to be fetched live
    const reelUrls: string[] = body.reelUrls || [
      "https://www.instagram.com/reel/DdD9h3wzCxw/",
      "https://www.instagram.com/reel/DdGiT0OzQ_7/",
    ];

    for (const url of reelUrls) {
      if (url && url.startsWith("http")) {
        try {
          const reelLive = await fetchIgReelRaw(url);
          if (reelLive.likes || reelLive.caption) {
            const likesNum = parseFollowerNumber(reelLive.likes);
            const commentsNum = parseInt(reelLive.comments?.replace(/,/g, "") || "0", 10);
            updatedReels[url] = {
              url,
              likes: likesNum,
              likesFormatted: reelLive.likes || "0",
              comments: commentsNum,
              caption: reelLive.caption,
              lastUpdated: now.toISOString(),
            };
          }
        } catch (err) {
          console.error(`Error refreshing reel ${url}:`, err);
        }
      }
    }

    const newCache: IgLiveCache = {
      lastSync: now.toISOString(),
      nextSyncEstimated: new Date(now.getTime() + 3600000).toISOString(),
      accounts: updatedAccounts,
      reels: updatedReels,
    };

    saveCachedInstagramData(newCache);

    return NextResponse.json({
      success: true,
      message: "Berhasil memperbarui data realtime Instagram 5 cabang",
      data: newCache,
    });
  } catch (err: any) {
    console.error("Failed to sync realtime IG:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
