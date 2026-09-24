const fs = require('fs');
const sheetsData = JSON.parse(fs.readFileSync('lib/real-sheets-data.json', 'utf8'));
const igCache = JSON.parse(fs.readFileSync('lib/instagram-live-cache.json', 'utf8'));

function extractShortcode(input) {
  if (!input) return null;
  const match = input.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];
  if (/^[A-Za-z0-9_-]{8,15}$/.test(input.trim())) {
    return input.trim();
  }
  return null;
}

const liveMap = new Map();
if (igCache && igCache.reels) {
  for (const [url, data] of Object.entries(igCache.reels)) {
    const code = extractShortcode(url);
    if (code) {
      const existing = liveMap.get(code);
      if (!existing || (data.likes && Number(data.likes) > (Number(existing.likes) || 0))) {
        liveMap.set(code, data);
      }
    }
  }
}

const rawReels = [];
const branchReels = sheetsData.branchReels || {};

Object.entries(branchReels).forEach(([sheetKey, list]) => {
  if (Array.isArray(list)) {
    list.forEach((r) => {
      if (!r.isDayOff && r.reelsTitle && r.reportDate && r.reportDate.startsWith('2026-09')) {
        rawReels.push(r);
      }
    });
  }
});

const items = [];
const seenCodes = new Set(['DdOfUrMj7MU', 'DdLvWkcDzob', 'DdIvWkcDzoh']);
const seenTitles = new Set(['lupa kedip', 'dewasa passwordnya']);

for (const r of rawReels) {
  const code = extractShortcode(r.reelsLink);
  if (code && seenCodes.has(code)) continue;
  if (code) seenCodes.add(code);

  const normTitle = (r.reelsTitle || '').toLowerCase().trim();
  if (seenTitles.has(normTitle) || normTitle.length < 3) continue;
  seenTitles.add(normTitle);

  const liveData = code ? liveMap.get(code) : null;
  let reach = 0;
  let likes = 0;
  if (liveData && liveData.likes > 0) {
    likes = Number(liveData.likes);
    reach = Math.max(Number(liveData.viewers) || 0, Number(r.viewers) || 0, Math.round(likes * 14));
  } else {
    likes = Number(r.likes) || 0;
    reach = Number(r.viewers) || (likes > 0 ? Math.round(likes * 14) : 0);
  }
  items.push({
    title: r.reelsTitle,
    code,
    reach,
    likes,
    branch: r.branch
  });
}

items.sort((a, b) => b.reach - a.reach);
console.log('Top 10 sorted items:');
items.slice(0, 10).forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.reach}] ${it.title} (${it.branch}) code: ${it.code} likes: ${it.likes}`);
});
