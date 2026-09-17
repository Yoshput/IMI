/**
 * AUTO-SYNC Instagram Metrics
 * Fetches live likes/comments from Instagram for all tracked reel/post URLs
 * Updates lib/instagram-live-cache.json automatically
 * 
 * Run: node scripts/auto-sync-ig-metrics.js
 * Also called by /api/sync-sheets when syncing spreadsheet
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../lib/instagram-live-cache.json');

// Viewer estimates based on likes ratio (Instagram avg ratio ~1:50 to 1:200)
function estimateViewers(likes, existingViewers) {
  if (existingViewers && existingViewers > 0) return existingViewers;
  if (likes >= 10000) return likes * 25;   // viral: 13.1K likes → ~278K views
  if (likes >= 1000) return likes * 40;
  if (likes >= 100) return likes * 60;
  if (likes >= 10) return likes * 100;
  return likes * 150;
}

function parseMetricStr(str) {
  if (!str) return 0;
  const s = str.replace(/,/g, '').trim().toUpperCase();
  if (s.endsWith('M')) return Math.round(parseFloat(s) * 1000000);
  if (s.endsWith('K')) return Math.round(parseFloat(s) * 1000);
  return parseInt(s, 10) || 0;
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

async function fetchReelMeta(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        timeout: 12000,
      };
      const req = https.get(options, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
          // Extract og:description which contains "X likes, Y comments - @handle on DATE: caption"
          const descMatch = html.match(/content="([^"]*likes,[^"]*comments[^"]*)"/i);
          let likes = 0, comments = 0;
          if (descMatch) {
            const likesMatch = descMatch[1].match(/([\d.,KMkm]+)\s+likes/i);
            const commentsMatch = descMatch[1].match(/([\d.,KMkm]+)\s+comments/i);
            if (likesMatch) likes = parseMetricStr(likesMatch[1]);
            if (commentsMatch) comments = parseMetricStr(commentsMatch[1]);
          }
          // Extract caption
          const captionMatch = html.match(/og:description[^>]+content="([^"]*)"/i);
          const caption = captionMatch ? captionMatch[1].replace(/&quot;/g, '"').replace(/&#039;/g, "'").slice(0, 300) : '';
          resolve({ url, likes, comments, caption, success: true });
        });
      });
      req.on('error', (e) => resolve({ url, likes: 0, comments: 0, error: e.message, success: false }));
      req.on('timeout', () => { req.destroy(); resolve({ url, likes: 0, comments: 0, error: 'timeout', success: false }); });
    } catch (err) {
      resolve({ url, likes: 0, comments: 0, error: err.message, success: false });
    }
  });
}

async function autoSyncMetrics(extraUrls = []) {
  // 1. Load current cache
  let cache = { lastSync: null, accounts: {}, reels: {} };
  if (fs.existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    } catch (e) { /* start fresh */ }
  }

  // 2. Collect all URLs to sync: existing cache + any new ones passed in
  const existingUrls = Object.keys(cache.reels || {});
  const allUrls = [...new Set([...existingUrls, ...extraUrls])];

  console.log(`\n🔄 AUTO-SYNC Instagram Metrics`);
  console.log(`📋 URLs to sync: ${allUrls.length}`);
  console.log('');

  let updated = 0;
  let added = 0;

  for (const url of allUrls) {
    process.stdout.write(`  Fetching: ${url.replace('https://www.instagram.com/', '')} ... `);
    const result = await fetchReelMeta(url);
    
    if (!result.success || (result.likes === 0 && result.comments === 0)) {
      console.log(`⚠️  No data (likes=0)`);
      // Keep existing cached data if any
      continue;
    }

    const existing = cache.reels[url] || {};
    const existingViewers = existing.viewers || 0;
    
    // Use actual viewers if already manually set (manual > 0), else estimate
    const viewers = existingViewers > 0 ? existingViewers : estimateViewers(result.likes, 0);
    
    const isNew = !cache.reels[url];
    const likesChanged = existing.likes !== result.likes;
    
    cache.reels[url] = {
      url,
      likes: result.likes,
      likesFormatted: formatNumber(result.likes),
      viewers,
      viewersFormatted: formatNumber(viewers),
      comments: result.comments,
      caption: result.caption || existing.caption || '',
      lastUpdated: new Date().toISOString(),
    };

    if (isNew) { added++; console.log(`✅ NEW  ${result.likes} likes → ${formatNumber(viewers)} viewers est.`); }
    else if (likesChanged) { updated++; console.log(`🔄 UPD  ${existing.likes || 0} → ${result.likes} likes`); }
    else { console.log(`✓  OK  ${result.likes} likes (no change)`); }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 800));
  }

  // 3. Update lastSync timestamp
  cache.lastSync = new Date().toISOString();
  cache.nextSyncEstimated = new Date(Date.now() + 3600000).toISOString();

  // 4. Save updated cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');

  console.log('');
  console.log(`✅ Sync complete! Added: ${added}, Updated: ${updated}`);
  console.log(`💾 Cache saved to: lib/instagram-live-cache.json`);
  console.log(`🕐 Next auto-sync estimated: ${cache.nextSyncEstimated}`);
  
  return { added, updated, total: allUrls.length };
}

// If run directly, also check for any new known viral reels
const KNOWN_NEW_REELS = [
  'https://www.instagram.com/reel/DdQ1c06zshy/',  // Lunar TGL - VIRAL 13.1K likes, 278K views
];

autoSyncMetrics(KNOWN_NEW_REELS).catch(console.error);
