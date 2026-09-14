const https = require('https');
const fs = require('fs');
const path = require('path');

const OFFICIAL_BRANCH_ACCOUNTS = [
  { id: 'pwt-pusat', name: 'Optik I See You Purwokerto (Pusat)', handle: '@iseeyou.glasses', url: 'https://www.instagram.com/iseeyou.glasses/', city: 'Purwokerto', picName: 'Mba Ilya & Mba Nuha' },
  { id: 'pbg', name: 'Optik I See You Purbalingga', handle: '@iseeyou.purbalingga', url: 'https://www.instagram.com/iseeyou.purbalingga/', city: 'Purbalingga', picName: 'Mba Ajun' },
  { id: 'clp', name: 'Optik I See You Cilacap', handle: '@iseeyou.cilacap', url: 'https://www.instagram.com/iseeyou.cilacap/', city: 'Cilacap', picName: 'Mba Arum' },
  { id: 'wns', name: 'Optik I See You Wonosobo', handle: '@iseeyou.wonosobo', url: 'https://www.instagram.com/iseeyou.wonosobo/', city: 'Wonosobo', picName: 'Mba Febi' },
  { id: 'tgl', name: 'Lunar Eyewear Tegal (Second Brand)', handle: '@lunareyewear.co', url: 'https://www.instagram.com/lunareyewear.co', city: 'Tegal', picName: 'Mba Amanda' }
];

function parseFollowerNumber(str) {
  if (!str) return 0;
  const clean = str.replace(/,/g, '').trim().toUpperCase();
  if (clean.endsWith('K')) return Math.round(parseFloat(clean.slice(0, -1)) * 1000);
  if (clean.endsWith('M')) return Math.round(parseFloat(clean.slice(0, -1)) * 1000000);
  return parseInt(clean, 10) || 0;
}

function fetchIgProfileRaw(url) {
  return new Promise((resolve) => {
    try {
      const normalizedUrl = url.endsWith('/') ? url : `${url}/`;
      const u = new URL(normalizedUrl);
      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': '*/*'
        }
      };

      https.get(options, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
          const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
          const titleMatch = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];

          let followers = null;
          let following = null;
          let posts = null;

          if (descMatch) {
            const m = descMatch.match(/([0-9.,KMkm]+)\s+Followers,\s+([0-9.,KMkm]+)\s+Following,\s+([0-9.,KMkm]+)\s+Posts/i);
            if (m) {
              followers = m[1];
              following = m[2];
              posts = m[3];
            }
          }

          resolve({ followers, following, posts, title: titleMatch || null });
        });
      }).on('error', () => resolve({ followers: null, following: null, posts: null, title: null }));
    } catch {
      resolve({ followers: null, following: null, posts: null, title: null });
    }
  });
}

function fetchIgReelRaw(url) {
  return new Promise((resolve) => {
    try {
      if (!url || !url.startsWith('http')) return resolve({ likes: null, comments: null, caption: '' });
      const u = new URL(url);
      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': '*/*'
        }
      };

      https.get(options, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
          const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
          let likes = null;
          let comments = null;
          let caption = '';

          if (descMatch) {
            const m = descMatch.match(/([0-9.,KMkm]+)\s+likes,\s+([0-9.,KMkm]+)\s+comments\s*-\s*([^\s:]+)\s+on\s+([^:]+):\s*["']?([\s\S]*?)["']?\.?$/i);
            if (m) {
              likes = m[1];
              comments = m[2];
              caption = m[5] || '';
            } else {
              caption = descMatch;
            }

            caption = caption
              .replace(/&quot;/g, '"')
              .replace(/&#x27;/g, "'")
              .replace(/&amp;/g, '&')
              .replace(/&#x1f62d;/g, '😭')
              .replace(/&#x1f917;/g, '🤗')
              .replace(/&#x2764;&#xfe0f;&#x200d;&#x1f525;/g, '❤️‍🔥')
              .replace(/&#x1f4cd;/g, '📍')
              .replace(/&#x2705;/g, '✅');
          }

          resolve({ likes, comments, caption });
        });
      }).on('error', () => resolve({ likes: null, comments: null, caption: '' }));
    } catch {
      resolve({ likes: null, comments: null, caption: '' });
    }
  });
}

async function run() {
  console.log('Fetching live Instagram profiles for all 5 branches...');
  const accounts = {};
  const now = new Date();

  for (const acc of OFFICIAL_BRANCH_ACCOUNTS) {
    const live = await fetchIgProfileRaw(acc.url);
    console.log(`- ${acc.name}: ${live.followers} followers`);
    accounts[acc.id] = {
      id: acc.id,
      name: acc.name,
      handle: acc.handle,
      url: acc.url,
      city: acc.city,
      picName: acc.picName,
      followers: parseFollowerNumber(live.followers),
      followersFormatted: live.followers || '0',
      following: parseInt((live.following || '0').replace(/,/g, ''), 10),
      posts: parseInt((live.posts || '0').replace(/,/g, ''), 10),
      bioTitle: live.title || undefined,
      lastUpdated: now.toISOString()
    };
  }

  // Fetch top viral reels
  const targetReels = [
    'https://www.instagram.com/reel/DdD9h3wzCxw/',
    'https://www.instagram.com/reel/DdGiT0OzQ_7/',
    'https://www.instagram.com/reel/DdGmCEvvB-X/',
    'https://www.instagram.com/reel/DdBa28YijET/',
    'https://www.instagram.com/reel/DdOQvBbT45k/',
    'https://www.instagram.com/reel/DdJHG_jTUGa/'
  ];
  const reels = {};
  for (const url of targetReels) {
    console.log(`Fetching reel: ${url}...`);
    const r = await fetchIgReelRaw(url);
    reels[url] = {
      url,
      likes: parseFollowerNumber(r.likes),
      likesFormatted: r.likes || '0',
      comments: parseInt((r.comments || '0').replace(/,/g, ''), 10),
      caption: r.caption,
      lastUpdated: now.toISOString()
    };
    console.log(`  Likes: ${r.likes} | Comments: ${r.comments} | Caption len: ${r.caption.length}`);
  }

  const output = {
    lastSync: now.toISOString(),
    nextSyncEstimated: new Date(now.getTime() + 3600000).toISOString(),
    accounts,
    reels
  };

  const outPath = path.join(__dirname, '../lib/instagram-live-cache.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log('Saved live cache to', outPath);
}

run();
