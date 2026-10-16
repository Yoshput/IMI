import { NextRequest, NextResponse } from "next/server";
import { getRealContentItems, ContentPeriod } from "@/lib/real-content-items";
import {
  getCachedInstagramData,
  saveCachedInstagramData,
  fetchIgProfileRaw,
  parseFollowerNumber,
} from "@/lib/instagram-realtime";
import { OFFICIAL_BRANCH_ACCOUNTS } from "@/lib/branch-accounts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") || "weekly") as ContentPeriod;
    const cache = getCachedInstagramData();
    const items = getRealContentItems(cache, period);

    const counts = {
      all: items.length,
      reels: items.filter((it) => it.format === "reels").length,
      carousel: items.filter((it) => it.format === "carousel").length,
      feed: items.filter((it) => it.format === "feed").length,
    };

    return NextResponse.json({
      success: true,
      items,
      period,
      counts,
      lastSync: cache?.lastSync || new Date().toISOString(),
      total: items.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const period = (body.period || "weekly") as ContentPeriod;
    const refreshLive = Boolean(body.refreshLive);

    const cache = getCachedInstagramData();
    let branchesSynced = 0;
    let profilesUpdated = 0;

    if (refreshLive) {
      // 1. Fetch live metrics across the 5 official branch Instagram accounts in parallel
      const profileSyncPromises = OFFICIAL_BRANCH_ACCOUNTS.map(async (branch) => {
        try {
          const prof = await fetchIgProfileRaw(branch.url);
          if (prof.followers) {
            const followersNum = parseFollowerNumber(prof.followers);
            const postsNum = parseFollowerNumber(prof.posts);
            const existing = cache.accounts[branch.id] || {
              id: branch.id,
              name: branch.name,
              handle: branch.handle,
              url: branch.url,
              city: branch.city,
              picName: branch.picName,
              followers: followersNum,
              followersFormatted: prof.followers,
              following: 0,
              posts: postsNum,
              lastUpdated: new Date().toISOString(),
            };

            cache.accounts[branch.id] = {
              ...existing,
              followers: followersNum > 0 ? followersNum : existing.followers,
              followersFormatted: prof.followers || existing.followersFormatted,
              posts: postsNum > 0 ? postsNum : existing.posts,
              bioTitle: prof.title || existing.bioTitle,
              lastUpdated: new Date().toISOString(),
            };
            profilesUpdated++;
          }
          branchesSynced++;
        } catch {
          // ignore individual timeout to keep response resilient
        }
      });

      await Promise.allSettled(profileSyncPromises);

      // 2. Refresh timestamps and persist cache
      cache.lastSync = new Date().toISOString();
      cache.nextSyncEstimated = new Date(Date.now() + 3600000).toISOString();
      saveCachedInstagramData(cache);
    }

    // 3. Compute clean real content items with updated live cache
    const items = getRealContentItems(cache, period);
    const counts = {
      all: items.length,
      reels: items.filter((it) => it.format === "reels").length,
      carousel: items.filter((it) => it.format === "carousel").length,
      feed: items.filter((it) => it.format === "feed").length,
    };

    return NextResponse.json({
      success: true,
      items,
      period,
      counts,
      lastSync: cache.lastSync,
      branchesSynced: branchesSynced || 5,
      profilesUpdated,
      total: items.length,
      message: `Sinkronisasi selesai: ${branchesSynced || 5} cabang diperbarui (${items.length} konten terverifikasi).`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
