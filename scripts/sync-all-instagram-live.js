const fs = require('fs');
const https = require('https');

const CACHE_FILE = './lib/instagram-live-cache.json';
const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
const sheetsData = JSON.parse(fs.readFileSync('./lib/real-sheets-data.json', 'utf-8'));

// Helper to fetch live metadata from Instagram
function fetchMeta(url) {
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
        timeout: 4000,
      };
      https.get(options, (res) => {
        let html = '';
        res.on('data', (c) => html += c);
        res.on('end', () => {
          const descMatch = html.match(/content="([^"]*likes,[^"]*comments[^"]*)"/i);
          let likes = 0, comments = 0, caption = '';
          if (descMatch) {
            const likesMatch = descMatch[1].match(/([\d.,KMkm]+)\s+likes/i);
            const commentsMatch = descMatch[1].match(/([\d.,KMkm]+)\s+comments/i);
            if (likesMatch) {
              const s = likesMatch[1].replace(/,/g, '').trim().toUpperCase();
              if (s.endsWith('M')) likes = Math.round(parseFloat(s) * 1000000);
              else if (s.endsWith('K')) likes = Math.round(parseFloat(s) * 1000);
              else likes = parseInt(s, 10) || 0;
            }
            if (commentsMatch) {
              const s = commentsMatch[1].replace(/,/g, '').trim().toUpperCase();
              if (s.endsWith('M')) comments = Math.round(parseFloat(s) * 1000000);
              else if (s.endsWith('K')) comments = Math.round(parseFloat(s) * 1000);
              else comments = parseInt(s, 10) || 0;
            }
            const colonIdx = descMatch[1].indexOf(': ');
            if (colonIdx > -1) caption = descMatch[1].slice(colonIdx + 2, colonIdx + 400);
          }
          resolve({ url, likes, comments, caption, success: !!descMatch });
        });
      }).on('error', () => resolve({ url, likes: 0, comments: 0, caption: '', success: false }))
        .on('timeout', () => resolve({ url, likes: 0, comments: 0, caption: '', success: false }));
    } catch {
      resolve({ url, likes: 0, comments: 0, caption: '', success: false });
    }
  });
}

function fetchProfile(url) {
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
        timeout: 4000,
      };
      https.get(options, (res) => {
        let html = '';
        res.on('data', (c) => html += c);
        res.on('end', () => {
          const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
          let followers = null, following = null, posts = null;
          if (descMatch) {
            const m = descMatch.match(/([0-9.,KMkm]+)\s+Followers,\s+([0-9.,KMkm]+)\s+Following,\s+([0-9.,KMkm]+)\s+Posts/i);
            if (m) {
              followers = m[1];
              following = m[2];
              posts = m[3];
            }
          }
          resolve({ url, followers, following, posts });
        });
      }).on('error', () => resolve({ url, followers: null, following: null, posts: null }));
    } catch {
      resolve({ url, followers: null, following: null, posts: null });
    }
  });
}

async function run() {
  console.log('--- 1. Refreshing Official 5 Instagram Branch Profiles ---');
  const accountsToRefresh = [
    { id: 'pwt', url: 'https://www.instagram.com/iseeyou.glasses/' },
    { id: 'pbg', url: 'https://www.instagram.com/iseeyou.purbalingga/' },
    { id: 'clp', url: 'https://www.instagram.com/iseeyou.cilacap/' },
    { id: 'wns', url: 'https://www.instagram.com/iseeyou.wonosobo/' },
    { id: 'tgl', url: 'https://www.instagram.com/lunareyewear.co/' },
  ];

  for (const acc of accountsToRefresh) {
    const prof = await fetchProfile(acc.url);
    if (prof.followers) {
      console.log(`Live Profile ${acc.id}: ${prof.followers} followers, ${prof.posts} posts`);
      if (cache.accounts[acc.id]) {
        const clean = prof.followers.replace(/,/g, '').trim().toUpperCase();
        let num = 0;
        if (clean.endsWith('K')) num = Math.round(parseFloat(clean.slice(0, -1)) * 1000);
        else if (clean.endsWith('M')) num = Math.round(parseFloat(clean.slice(0, -1)) * 1000000);
        else num = parseInt(clean, 10) || 0;

        cache.accounts[acc.id].followers = num;
        cache.accounts[acc.id].followersFormatted = prof.followers;
        cache.accounts[acc.id].lastUpdated = new Date().toISOString();
      }
    }
  }

  console.log('--- 2. Collecting All Video & Post URLs to Sync ---');
  const targetUrls = new Set();

  for (const [sheetKey, rows] of Object.entries(sheetsData.branchReels || {})) {
    for (const r of rows) {
      if (r.reelsLink && r.reelsLink.includes('instagram.com')) {
        const m = r.reelsLink.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
        if (m) targetUrls.add('https://www.instagram.com/reel/' + m[1] + '/');
      }
      if (r.feedLink && r.feedLink.includes('instagram.com')) {
        const m = r.feedLink.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
        if (m) targetUrls.add('https://www.instagram.com/p/' + m[1] + '/');
      }
    }
  }

  console.log(`Total target URLs: ${targetUrls.size}`);
  const urlArray = Array.from(targetUrls);

  // Process in batches of 5
  const concurrency = 5;
  let updatedCount = 0;
  let newCount = 0;

  for (let i = 0; i < urlArray.length; i += concurrency) {
    const batch = urlArray.slice(i, i + concurrency);
    const results = await Promise.all(batch.map((u) => fetchMeta(u)));

    for (const res of results) {
      if (res.success && (res.likes > 0 || res.caption)) {
        const existing = cache.reels[res.url] || {};
        const isNew = !cache.reels[res.url];
        
        cache.reels[res.url] = {
          url: res.url,
          likes: Math.max(existing.likes || 0, res.likes),
          likesFormatted: res.likes >= 1000 ? (res.likes / 1000).toFixed(1) + 'K' : String(res.likes),
          viewers: existing.viewers || 0,
          viewersFormatted: existing.viewersFormatted || '0',
          comments: Math.max(existing.comments || 0, res.comments),
          caption: res.caption || existing.caption || '',
          lastUpdated: new Date().toISOString(),
        };

        if (isNew) newCount++;
        else updatedCount++;
      }
    }

    if (i % 50 === 0 || i + concurrency >= urlArray.length) {
      process.stdout.write(`Processed ${Math.min(i + concurrency, urlArray.length)}/${urlArray.length} (New: ${newCount}, Updated: ${updatedCount})\r`);
    }
  }

  console.log(`\nFinished live sync! New items: ${newCount}, Updated items: ${updatedCount}`);

  cache.lastSync = new Date().toISOString();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  console.log('Cache successfully saved to', CACHE_FILE);
}

run();
