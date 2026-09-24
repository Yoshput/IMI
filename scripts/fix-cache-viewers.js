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

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

// Build map of shortcode -> spreadsheet reel
const sheetByCode = new Map();
const branchReels = sheetsData.branchReels || {};

Object.values(branchReels).forEach((list) => {
  if (Array.isArray(list)) {
    list.forEach((r) => {
      const code = extractShortcode(r.reelsLink);
      if (code) {
        sheetByCode.set(code, r);
      }
    });
  }
});

let updated = 0;
for (const [url, c] of Object.entries(cache.reels)) {
  const code = extractShortcode(url);
  const s = sheetByCode.get(code);

  if (s && s.viewers !== undefined) {
    const trueViewers = Number(s.viewers) || 0;
    c.viewers = trueViewers;
    c.viewersFormatted = formatNumber(trueViewers);
    updated++;
  } else if (!s && c.viewers && c.viewers > 10000) {
    // If not in sheet, don't keep artificial * 50 multiplier
    if (code !== 'DdQ1c06zshy') {
      c.viewers = 0;
      c.viewersFormatted = '0';
    }
  }
}

// Ensure Amanda's reel is exact: 285.400 viewers, 20.200 likes
const lunarKey1 = 'https://www.instagram.com/reel/DdQ1c06zshy/';
const lunarKey2 = 'https://www.instagram.com/reel/DdQ1c06zshy/?stkn=MXEzYmZ5Z3Q4cDk0bw==';
[lunarKey1, lunarKey2].forEach(k => {
  if (cache.reels[k]) {
    cache.reels[k].likes = 20200;
    cache.reels[k].likesFormatted = '20.2K';
    cache.reels[k].viewers = 285400;
    cache.reels[k].viewersFormatted = '285.4K';
    cache.reels[k].comments = 95;
    cache.reels[k].shares = 1384;
  }
});

// Ensure OTW CEK MATA is exact: 29.978 viewers, 711 likes, 19 comments
const otwKey = 'https://www.instagram.com/reel/DdRCcGzvG8h/';
if (cache.reels[otwKey]) {
  cache.reels[otwKey].viewers = 29978;
  cache.reels[otwKey].viewersFormatted = '29.9K';
  cache.reels[otwKey].likes = 711;
  cache.reels[otwKey].likesFormatted = '711';
  cache.reels[otwKey].comments = 19;
}

// Ensure Dewasa Passwordnya is exact: 1.850 viewers, 114 likes, 4 comments
['https://www.instagram.com/p/DdLvWkcDzob/', 'https://www.instagram.com/p/DdIvWkcDzoh/'].forEach(k => {
  if (cache.reels[k]) {
    cache.reels[k].viewers = 1850;
    cache.reels[k].viewersFormatted = '1.9K';
    cache.reels[k].likes = 114;
    cache.reels[k].likesFormatted = '114';
    cache.reels[k].comments = 4;
    cache.reels[k].shares = 8;
  }
});

cache.lastSync = new Date().toISOString();
fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
console.log(`✅ Fixed viewers in cache! Updated ${updated} entries to true spreadsheet values.`);
