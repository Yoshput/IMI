const fs = require('fs');
const https = require('https');

const cachePath = './lib/instagram-live-cache.json';
const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
cache.reels = cache.reels || {};

function parseMetricStr(str) {
  if (!str) return 0;
  const s = str.replace(/,/g, '').trim().toUpperCase();
  if (s.endsWith('M')) return Math.round(parseFloat(s) * 1000000);
  if (s.endsWith('K')) return Math.round(parseFloat(s) * 1000);
  return parseInt(s, 10) || 0;
}

function fetchMeta(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.get({
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept": "text/html,application/xhtml+xml",
        },
        timeout: 6000,
      }, (res) => {
        let html = "";
        res.on("data", (c) => (html += c));
        res.on("end", () => {
          const descMatch = html.match(/content="([^"]*likes,[^"]*comments[^"]*)"/i);
          if (descMatch) {
            const likesMatch = descMatch[1].match(/([\d.,KMkm]+)\s+likes/i);
            const commentsMatch = descMatch[1].match(/([\d.,KMkm]+)\s+comments/i);
            const likes = likesMatch ? parseMetricStr(likesMatch[1]) : 0;
            const comments = commentsMatch ? parseMetricStr(commentsMatch[1]) : 0;
            const colonIdx = descMatch[1].indexOf(": ");
            const caption = colonIdx > -1 ? descMatch[1].slice(colonIdx + 2, colonIdx + 400) : "";
            resolve({ url, likes, comments, caption, success: true });
          } else {
            resolve({ url, likes: 0, comments: 0, caption: "", success: false });
          }
        });
      });
      req.on("error", () => resolve({ url, likes: 0, comments: 0, caption: "", success: false }));
      req.on("timeout", () => { req.destroy(); resolve({ url, likes: 0, comments: 0, caption: "", success: false }); });
    } catch {
      resolve({ url, likes: 0, comments: 0, caption: "", success: false });
    }
  });
}

async function syncAllRecent() {
  const defaultData = JSON.parse(fs.readFileSync('./lib/real-sheets-data.json', 'utf8'));
  const urls = new Set();
  
  // Collect all links from 2026-09-29 to 2026-10-05
  Object.values(defaultData.branchReels || {}).forEach(rows => {
    rows.forEach(r => {
      const dt = r.uploadDate || r.reportDate || "";
      if (dt >= "2026-09-22" && dt <= "2026-10-05") {
        if (r.reelsLink && r.reelsLink.includes("instagram.com")) urls.add(r.reelsLink.split('?')[0]);
        if (r.feedLink && r.feedLink.includes("instagram.com")) urls.add(r.feedLink.split('?')[0]);
      }
    });
  });

  console.log(`Found ${urls.size} unique URLs to check...`);

  const urlList = Array.from(urls);
  let updatedCount = 0;

  for (let i = 0; i < urlList.length; i += 3) {
    const chunk = urlList.slice(i, i + 3);
    const results = await Promise.all(chunk.map(u => fetchMeta(u)));
    for (const r of results) {
      if (r.success) {
        console.log(`✓ ${r.url} -> Likes: ${r.likes}, Comments: ${r.comments}`);
        cache.reels[r.url] = {
          url: r.url,
          likes: r.likes,
          likesFormatted: String(r.likes),
          comments: r.comments,
          caption: r.caption,
          lastUpdated: new Date().toISOString()
        };
        updatedCount++;
      } else {
        console.log(`- ${r.url} -> (no meta or private)`);
      }
    }
  }

  cache.lastSync = new Date().toISOString();
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`\nSuccessfully updated ${updatedCount} posts in live cache!`);
}

syncAllRecent();
