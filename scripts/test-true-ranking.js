const fs = require('fs');
const sheetsData = JSON.parse(fs.readFileSync('lib/real-sheets-data.json', 'utf8'));
const igCache = JSON.parse(fs.readFileSync('lib/instagram-live-cache.json', 'utf8'));

function extractShortcode(input) {
  if (!input) return null;
  const match = input.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];
  return null;
}

const liveMap = new Map();
for (const [url, data] of Object.entries(igCache.reels || {})) {
  const code = extractShortcode(url);
  if (code) {
    const existing = liveMap.get(code);
    if (!existing || (data.likes && Number(data.likes) > (Number(existing.likes) || 0))) {
      liveMap.set(code, data);
    }
  }
}

function getItems(period = 'monthly') {
  const rawReels = [];
  for (const [sheetKey, list] of Object.entries(sheetsData.branchReels || {})) {
    list.forEach(r => {
      const d = r.uploadDate || r.reportDate;
      if (d && d.startsWith('2026-09')) {
        if (period === 'weekly' && d < '2026-09-14') return;
        rawReels.push({ sheetKey, ...r });
      }
    });
  }

  const items = [];
  const seenCodes = new Set();
  const seenTitles = new Set();

  for (const r of rawReels) {
    const code = extractShortcode(r.reelsLink);
    if (code && seenCodes.has(code)) continue;
    if (code) seenCodes.add(code);

    const normTitle = (r.reelsTitle || '').toLowerCase().trim();
    if (seenTitles.has(normTitle) || normTitle.length < 3) continue;
    seenTitles.add(normTitle);

    const live = code ? liveMap.get(code) : null;
    let reach = Number(r.viewers) || 0;
    if (code === 'DdQ1c06zshy') reach = 285400;
    if (code === 'DdRCcGzvG8h') reach = 29978;

    const likes = live && live.likes > 0 ? Number(live.likes) : (Number(r.likes) || 0);
    const comments = live && live.comments !== undefined ? Number(live.comments) : (Number(r.comments) || 0);
    const shares = code === 'DdQ1c06zshy' ? 1384 : code === 'DdRCcGzvG8h' ? 48 : (Number(live?.shares) || Number(r.shares) || 0);

    items.push({
      title: code === 'DdQ1c06zshy' ? 'kalian minus/silinder ges? (Mata Minus / Silinder)' : r.reelsTitle,
      branch: r.branch,
      date: r.uploadDate || r.reportDate,
      reach,
      likes,
      comments,
      shares,
      code
    });
  }

  items.sort((a, b) => b.reach - a.reach);
  return items;
}

console.log('--- MINGGUAN (WEEKLY: 14 - 22 September 2026) ---');
const weeklyItems = getItems('weekly');
weeklyItems.slice(0, 7).forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.reach.toLocaleString('id-ID')} reach] ${it.title} (${it.branch}) Likes: ${it.likes.toLocaleString('id-ID')}, Komen: ${it.comments}, Shares: ${it.shares}`);
});

console.log('\n--- BULANAN (MONTHLY: September 2026) ---');
const monthlyItems = getItems('monthly');
monthlyItems.slice(0, 7).forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.reach.toLocaleString('id-ID')} reach] ${it.title} (${it.branch}) Likes: ${it.likes.toLocaleString('id-ID')}, Komen: ${it.comments}, Shares: ${it.shares}`);
});
