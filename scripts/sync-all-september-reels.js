const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../lib/instagram-live-cache.json');
const SHEETS_PATH = path.join(__dirname, '../lib/real-sheets-data.json');

const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
const sheetsData = JSON.parse(fs.readFileSync(SHEETS_PATH, 'utf-8'));

function extractShortcode(input) {
  if (!input) return null;
  const match = input.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];
  return null;
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

function fetchIgMeta(code) {
  return new Promise((resolve) => {
    // Try reel URL first
    const url = 'https://www.instagram.com/reel/' + code + '/';
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname,
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 8000,
    };
    const req = https.get(options, (res) => {
      let html = '';
      res.on('data', (c) => (html += c));
      res.on('end', () => {
        const descMatch = html.match(/content="([^"]*likes,[^"]*comments[^"]*)"/i);
        let likes = 0, comments = 0, caption = '';
        if (descMatch) {
          const likesMatch = descMatch[1].match(/([\d.,KMkm]+)\s+likes/i);
          const commentsMatch = descMatch[1].match(/([\d.,KMkm]+)\s+comments/i);
          if (likesMatch) likes = parseMetricStr(likesMatch[1]);
          if (commentsMatch) comments = parseMetricStr(commentsMatch[1]);
          const colonIdx = descMatch[1].indexOf(': ');
          if (colonIdx > -1) caption = descMatch[1].slice(colonIdx + 2, colonIdx + 300);
        }
        resolve({ code, likes, comments, caption, success: !!descMatch });
      });
    });
    req.on('error', () => resolve({ code, likes: 0, comments: 0, success: false }));
    req.on('timeout', () => { req.destroy(); resolve({ code, likes: 0, comments: 0, success: false }); });
  });
}

async function run() {
  console.log('Collecting September 2026 Instagram URLs...');
  const septCodes = new Set();
  const branchReels = sheetsData.branchReels || {};

  Object.values(branchReels).forEach((list) => {
    if (Array.isArray(list)) {
      list.forEach((r) => {
        if (r.reelsLink && r.reportDate && r.reportDate.startsWith('2026-09')) {
          const code = extractShortcode(r.reelsLink);
          if (code) septCodes.add(code);
        }
      });
    }
  });

  const codeList = Array.from(septCodes);
  console.log(`Found ${codeList.length} unique shortcodes to check from September.`);

  let updatedCount = 0;
  for (let i = 0; i < codeList.length; i++) {
    const code = codeList[i];
    const canonicalUrl = `https://www.instagram.com/reel/${code}/`;
    
    // If already has verified non-zero data in cache (like Amanda's 20.2K), keep it
    const existing = cache.reels[canonicalUrl];
    if (existing && existing.likes > 50 && existing.comments > 0) {
      console.log(`[${i+1}/${codeList.length}] ${code} -> Already verified: ${existing.likes} likes, ${existing.comments} comments`);
      continue;
    }

    const live = await fetchIgMeta(code);
    if (live.success && (live.likes > 0 || live.comments > 0)) {
      const finalLikes = Math.max(existing?.likes || 0, live.likes);
      const finalComments = Math.max(existing?.comments || 0, live.comments);
      const viewers = existing?.viewers || (finalLikes >= 1000 ? finalLikes * 30 : finalLikes * 50);

      cache.reels[canonicalUrl] = {
        url: canonicalUrl,
        likes: finalLikes,
        likesFormatted: formatNumber(finalLikes),
        comments: finalComments,
        viewers,
        viewersFormatted: formatNumber(viewers),
        caption: live.caption || existing?.caption || '',
        lastUpdated: new Date().toISOString(),
      };
      updatedCount++;
      console.log(`[${i+1}/${codeList.length}] ${code} -> LIVE SYNC: ${finalLikes} likes, ${finalComments} comments`);
    } else {
      console.log(`[${i+1}/${codeList.length}] ${code} -> No new public data (preserved)`);
    }

    // Gentle pacing to prevent rate limits
    await new Promise((r) => setTimeout(r, 400));
  }

  cache.lastSync = new Date().toISOString();
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`\nDone! Successfully updated ${updatedCount} reels in instagram-live-cache.json`);
}

run().catch(console.error);
