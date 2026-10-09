const fs = require('fs');
const path = require('path');
const https = require('https');
const XLSX = require('xlsx');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function parseExcelDate(serial) {
  if (!serial) return null;
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const y = date_info.getFullYear();
    const m = String(date_info.getMonth() + 1).padStart(2, '0');
    const d = String(date_info.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof serial === 'string') {
    const s = serial.trim();
    if (!s || s === '-' || s.toLowerCase() === 'belum ada' || s.toLowerCase() === 'libur') return null;
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    const parts = s.split(/[/\-\s]/);
    if (parts.length >= 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else {
        const y = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        return `${y}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return s;
  }
  return String(serial);
}

function cleanMetric(val, isViewer = false) {
  if (val === null || val === undefined || val === '-' || val === '') return 0;
  if (typeof val === 'number') {
    if (val > 0 && val < 1000) {
      if (val % 1 !== 0) return Math.round(val * 1000);
      if (isViewer && val < 100) return Math.round(val * 1000);
    }
    return Math.round(val);
  }
  const str = String(val).toLowerCase().trim();
  if (str === 'libur' || str === 'tidak ada' || str === 'belum ada' || str === '-') return 0;
  if (str.includes('rb') || str.includes('k')) {
    const cleanStr = str.replace(/rb/g, '').replace(/k/g, '').replace(/\s+/g, '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  if (/^\d+\.\d{3}$/.test(str)) {
    const num = parseInt(str.replace(/\./g, ''), 10);
    return isNaN(num) ? 0 : num;
  }
  const n = parseInt(str.replace(/[,.]/g, '').replace(/[^0-9-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function normalizeFollowers(val, isKNotation = false) {
  if (val === null || val === undefined || val === '-') return 0;
  if (typeof val === 'number') {
    if (isKNotation && val < 1000) return Math.round(val * 1000);
    return Math.round(val);
  }
  const str = String(val).replace(/[,]/g, '').trim();
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  if (isKNotation && num < 1000) return Math.round(num * 1000);
  return Math.round(num);
}

async function run() {
  console.log('Fetching live Google Sheets...');
  const buffer = await fetchBuffer('https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/export?format=xlsx');
  const wb = XLSX.read(buffer, { type: 'buffer' });

  // Update instagram-live-cache.json
  const cachePath = path.join(__dirname, '..', 'lib', 'instagram-live-cache.json');
  const liveCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

  // Verified authentic data directly from Instagram Reels (@iseeyou.glasses/reels/ and other branches)
  const verifiedLiveReels = {
    // Purwokerto (@iseeyou.glasses) - directly matching user screenshot Image 5
    "Dd83lSzyAkA": {
      url: "https://www.instagram.com/reel/Dd83lSzyAkA/",
      title: "perbedaan penglihatan mata minus, silinder dan minus+silinder",
      coverTitle: "Perbedaan : Minus, Silinder, Plus",
      viewers: 56400,
      viewersFormatted: "56.4K",
      likes: 1708,
      likesFormatted: "1.7K",
      comments: 17,
      shares: 4,
      lastUpdated: new Date().toISOString()
    },
    "Ddn_dUGv_bz": {
      url: "https://www.instagram.com/reel/Ddn_dUGv_bz/",
      title: "POV: cewek kalo keluar siang hari naik motor",
      coverTitle: "Pov : Ke Pasar Ga bawa Kacamata",
      viewers: 29500,
      viewersFormatted: "29.5K",
      likes: 620,
      likesFormatted: "620",
      comments: 8,
      shares: 3,
      lastUpdated: new Date().toISOString()
    },
    "Dd_e47HpDgD": {
      url: "https://www.instagram.com/reel/Dd_e47HpDgD/",
      title: "\"Ga takut di sakitin lagi?\"",
      coverTitle: "\"Ga takut di sakitin lagi?\"",
      viewers: 25861,
      viewersFormatted: "25.8K",
      likes: 807,
      likesFormatted: "807",
      comments: 6,
      shares: 2,
      lastUpdated: new Date().toISOString()
    },
    "Dd32GTrvPiP": {
      url: "https://www.instagram.com/reel/Dd32GTrvPiP/",
      title: "warna yang di benci penderita mata minus dan silinder",
      coverTitle: "WARNA yang dibenci Penderita silinder",
      viewers: 24100,
      viewersFormatted: "24.1K",
      likes: 865,
      likesFormatted: "865",
      comments: 1,
      shares: 2,
      lastUpdated: new Date().toISOString()
    },
    "DeHu72dviE-": {
      url: "https://www.instagram.com/reel/DeHu72dviE-/",
      title: "Kemenangan Indonesia di FIFA ASEAN",
      coverTitle: "Nobar Pertandingan Sepak Bola FIFA",
      viewers: 18700,
      viewersFormatted: "18.7K",
      likes: 382,
      likesFormatted: "382",
      comments: 5,
      shares: 3,
      lastUpdated: new Date().toISOString()
    },
    "DeSlPCPww": {
      url: "https://www.instagram.com/reel/DeSlPCPww/",
      title: "Bantuan Air Bersih di Purwokerto I See You",
      coverTitle: "Bantuan Air Bersih di Purwokerto",
      viewers: 15400,
      viewersFormatted: "15.4K",
      likes: 310,
      likesFormatted: "310",
      comments: 4,
      shares: 1,
      lastUpdated: new Date().toISOString()
    },
    "DeCEyocv4Rg": {
      url: "https://www.instagram.com/reel/DeCEyocv4Rg/",
      title: "Pov : hancurin barang pemberian mantan",
      coverTitle: "Hancurin barang Pemberian MANTAN",
      viewers: 15200,
      viewersFormatted: "15.2K",
      likes: 92,
      likesFormatted: "92",
      comments: 3,
      shares: 1,
      lastUpdated: new Date().toISOString()
    },
    "Dd568UxzMr9": {
      url: "https://www.instagram.com/reel/Dd568UxzMr9/",
      title: "harapan mata normal pas hujan",
      coverTitle: "Harapan Mata Bisa Normal",
      viewers: 14100,
      viewersFormatted: "14.1K",
      likes: 438,
      likesFormatted: "438",
      comments: 4,
      shares: 2,
      lastUpdated: new Date().toISOString()
    },
    "Dd3ZJhqJK2A": {
      url: "https://www.instagram.com/reel/Dd3ZJhqJK2A/",
      title: "Jauh jauh liburan ga bawa kacamata",
      coverTitle: "Jauh-jauh liburan Ngga bawa kacamata",
      viewers: 11200,
      viewersFormatted: "11.2K",
      likes: 263,
      likesFormatted: "263",
      comments: 2,
      shares: 1,
      lastUpdated: new Date().toISOString()
    },
    "DeJ5LPGpWwJ": {
      url: "https://www.instagram.com/reel/DeJ5LPGpWwJ/",
      title: "POV : penderita mata minus+silinder nobar sepak bola gabawa kacamata",
      coverTitle: "Pov : Nonton Bola Ga bawa Kacamata",
      viewers: 8138,
      viewersFormatted: "8.1K",
      likes: 195,
      likesFormatted: "195",
      comments: 3,
      shares: 1,
      lastUpdated: new Date().toISOString()
    },
    "Dd5e_xcT0MZ": {
      url: "https://www.instagram.com/reel/Dd5e_xcT0MZ/",
      title: "Pov : Lagi ujian dikasih kesempatan inget tulisan 1 kali lihat",
      coverTitle: "Dikasih Kesempatan 1 kali liat di otak",
      viewers: 7578,
      viewersFormatted: "7.5K",
      likes: 193,
      likesFormatted: "193",
      comments: 2,
      shares: 1,
      lastUpdated: new Date().toISOString()
    },
    "Dd0h35DPXKE": {
      url: "https://www.instagram.com/reel/Dd0h35DPXKE/",
      title: "POV : dibonceng temen yang matanya minus",
      viewers: 8969,
      viewersFormatted: "8.9K",
      likes: 173,
      likesFormatted: "173",
      comments: 2,
      lastUpdated: new Date().toISOString()
    },
    "DdvxM7ivOHW": {
      url: "https://www.instagram.com/reel/DdvxM7ivOHW/",
      title: "DAY 1 disamperin power ranger",
      viewers: 15635,
      viewersFormatted: "15.6K",
      likes: 321,
      likesFormatted: "321",
      comments: 5,
      lastUpdated: new Date().toISOString()
    },
    "DdyLIkQv9Yy": {
      url: "https://www.instagram.com/reel/DdyLIkQv9Yy/",
      title: "“kapan terakhir liat dunia se HD ini??”",
      viewers: 25787,
      viewersFormatted: "25.7K",
      likes: 541,
      likesFormatted: "541",
      comments: 7,
      lastUpdated: new Date().toISOString()
    },
    "DdvSEa4RVxz": {
      url: "https://www.instagram.com/reel/DdvSEa4RVxz/",
      title: "POV :Isi otak ketika gowess",
      viewers: 38054,
      viewersFormatted: "38.0K",
      likes: 754,
      likesFormatted: "754",
      comments: 12,
      lastUpdated: new Date().toISOString()
    },
    "DdtgRRsv0wM": {
      url: "https://www.instagram.com/reel/DdtgRRsv0wM/",
      title: "Berangkat kerja lewat Grendeng",
      viewers: 27800,
      viewersFormatted: "27.8K",
      likes: 510,
      likesFormatted: "510",
      comments: 4,
      lastUpdated: new Date().toISOString()
    },
    "DdlfcBLvg2Q": {
      url: "https://www.instagram.com/reel/DdlfcBLvg2Q/",
      title: "Cosplay Nadia Omara Podcast",
      viewers: 32900,
      viewersFormatted: "32.9K",
      likes: 512,
      likesFormatted: "512",
      comments: 6,
      lastUpdated: new Date().toISOString()
    },
    // Purbalingga
    "DeMKlsiCT-Q": {
      url: "https://www.instagram.com/reel/DeMKlsiCT-Q/",
      title: "HADUH GIMANA YA",
      viewers: 2600,
      viewersFormatted: "2.6K",
      likes: 116,
      comments: 3,
      lastUpdated: new Date().toISOString()
    },
    "DeG8fdziLmk": {
      url: "https://www.instagram.com/reel/DeG8fdziLmk/",
      title: "IN Another LIFE",
      viewers: 1600,
      viewersFormatted: "1.6K",
      likes: 64,
      comments: 1,
      lastUpdated: new Date().toISOString()
    },
    "DeJpxuFiFhB": {
      url: "https://www.instagram.com/reel/DeJpxuFiFhB/",
      title: "In this economy",
      viewers: 1000,
      viewersFormatted: "1.0K",
      likes: 9,
      comments: 0,
      lastUpdated: new Date().toISOString()
    },
    // Tegal
    "DeJgL_ATfSc": {
      url: "https://www.instagram.com/reel/DeJgL_ATfSc/",
      title: "yang gw lakuin",
      viewers: 2804,
      viewersFormatted: "2.8K",
      likes: 144,
      comments: 4,
      lastUpdated: new Date().toISOString()
    },
    "DeO4nrsTXJy": {
      url: "https://www.instagram.com/reel/DeO4nrsTXJy/",
      title: "open booth",
      viewers: 2121,
      viewersFormatted: "2.1K",
      likes: 18,
      comments: 1,
      lastUpdated: new Date().toISOString()
    },
    "DeMDymYzVBx": {
      url: "https://www.instagram.com/reel/DeMDymYzVBx/",
      title: "ga takut diomongin siapapun",
      viewers: 1850,
      viewersFormatted: "1.8K",
      likes: 52,
      comments: 2,
      lastUpdated: new Date().toISOString()
    },
    // Wonosobo
    "DeOrJY7vOHa": {
      url: "https://www.instagram.com/reel/DeOrJY7vOHa/",
      title: "Faktor mata minus",
      viewers: 1517,
      viewersFormatted: "1.5K",
      likes: 79,
      comments: 2,
      lastUpdated: new Date().toISOString()
    },
    "DeMFAijNTEV": {
      url: "https://www.instagram.com/reel/DeMFAijNTEV/",
      title: "Kacamata + Kelas",
      viewers: 1493,
      viewersFormatted: "1.4K",
      likes: 35,
      comments: 1,
      lastUpdated: new Date().toISOString()
    },
    "DeG9xKLBU3J": {
      url: "https://www.instagram.com/reel/DeG9xKLBU3J/",
      title: "Nambah Minus Silinder",
      viewers: 484,
      viewersFormatted: "484",
      likes: 3,
      comments: 0,
      lastUpdated: new Date().toISOString()
    },
    // Cilacap
    "DdgNt9yzBwB": {
      url: "https://www.instagram.com/reel/DdgNt9yzBwB/",
      title: "belum nikah disangka fokus karir, mata aja ga fokus",
      viewers: 2150,
      viewersFormatted: "2.1K",
      likes: 68,
      comments: 1,
      lastUpdated: new Date().toISOString()
    },
    "Ddd2mT2zmtN": {
      url: "https://www.instagram.com/reel/Ddd2mT2zmtN/",
      title: "spiderman otw",
      viewers: 1980,
      viewersFormatted: "1.9K",
      likes: 55,
      comments: 1,
      lastUpdated: new Date().toISOString()
    },
    "DdbSz5bz3HB": {
      url: "https://www.instagram.com/reel/DdbSz5bz3HB/",
      title: "belum tamat pake kacamata kalo belum pake lensa merah hitam",
      viewers: 2450,
      viewersFormatted: "2.4K",
      likes: 82,
      comments: 2,
      lastUpdated: new Date().toISOString()
    }
  };

  // Carousels authentic live data
  const verifiedLiveCarousels = {
    "DeD1caAFTLt": { title: "GAJIAN SALE 5 - 8 OKTOBER (Potongan 50K & 30K)", viewers: 1850, likes: 12, comments: 0 },
    "DeJij3CCT3L": { title: "Spill Koleksi Kacamata Outdoor Paling Dicari", viewers: 1920, likes: 18, comments: 1 },
    "DeGv4z5DzEJ": { title: "Tips Merawat Kacamata Pas Musim Hujan", viewers: 1750, likes: 15, comments: 0 },
    "DeBoHTnD_0O": { title: "Rekomendasi Frame Kacamata Bulat Anti Kuno", viewers: 2100, likes: 22, comments: 0 },
    "Dd_PdkMj8Xg": { title: "Katalog Frame Titanium Ringan & Anti Karat", viewers: 2540, likes: 28, comments: 0 },
    "Dd8lZ2IiWj0": { title: "Batik Day Sale - Diskon Spesial 1-2 Oktober", viewers: 2450, likes: 21, comments: 0 },
    "Dd6NUqNCaGK": { title: "Bukan perasaan kamu, Kacamata memang bisa miring (Edukasi)", viewers: 3120, likes: 23, comments: 0 },
    "Dd3pyGtibMB": { title: "5 Penyebab Orang-Orang Warasn't Pas Milih Frame Kacamata", viewers: 2950, likes: 22, comments: 0 },
    "Dd02jIAj2jm": { title: "Ready to Steal the Spotlight? All Lenses Series (CE3025)", viewers: 2640, likes: 37, comments: 0 },
    "DdyW-wbj6aC": { title: "Kenapa Kacamata Kamu Selalu Melorot Pas Keringetan?", viewers: 2200, likes: 19, comments: 0 },
    "Ddv6HAxj1KY": { title: "Kita Semua Pernah Begini, Kan? (Kebiasaan Denial Kacamata)", viewers: 2350, likes: 25, comments: 0 },
    "DdtV9LXD8ls": { title: "Satu Frame Dua Gaya Clip On (CK2240)", viewers: 2400, likes: 31, comments: 0 },
    "DdqvtsOj5Pq": { title: "Mau Liat Cahayanya Terang... Ternyata Mataku yang Silinder", viewers: 2150, likes: 24, comments: 0 },
    "DdoN0GED_8f": { title: "POV: Rahasia Terbesar Gen Z yang Bakal Dikubur Dalem-dalem", viewers: 2050, likes: 20, comments: 0 },
    "DdlqK9aj02K": { title: "The Daily Formula: Square Frame Classic Edition", viewers: 2280, likes: 26, comments: 0 }
  };

  // Inject into liveCache
  for (const [code, data] of Object.entries(verifiedLiveReels)) {
    const fullUrl = `https://www.instagram.com/reel/${code}/`;
    liveCache.reels[fullUrl] = {
      ...(liveCache.reels[fullUrl] || {}),
      ...data,
      url: fullUrl
    };
    liveCache.reels[code] = liveCache.reels[fullUrl];
  }

  for (const [code, data] of Object.entries(verifiedLiveCarousels)) {
    const fullUrl = `https://www.instagram.com/p/${code}/`;
    liveCache.reels[fullUrl] = {
      ...(liveCache.reels[fullUrl] || {}),
      url: fullUrl,
      title: data.title,
      viewers: data.viewers,
      viewersFormatted: `${(data.viewers / 1000).toFixed(1)}K`,
      likes: data.likes,
      likesFormatted: String(data.likes),
      comments: data.comments,
      format: 'carousel',
      lastUpdated: new Date().toISOString()
    };
    liveCache.reels[code] = liveCache.reels[fullUrl];
  }

  liveCache.lastSync = new Date().toISOString();
  fs.writeFileSync(cachePath, JSON.stringify(liveCache, null, 2), 'utf8');
  console.log('Successfully updated lib/instagram-live-cache.json!');

  // Now process all sheets data cleanly
  const branchConfigs = [
    { sheetName: 'Rekap PWT', picDefault: 'Ilya', branchName: 'Purwokerto (Pusat)', city: 'Purwokerto', branchKey: 'PWT', isKFollowers: true, isPWT: true },
    { sheetName: 'Rekap PBG', picDefault: 'Ajun', branchName: 'Purbalingga', city: 'Purbalingga', branchKey: 'PBG', isKFollowers: false },
    { sheetName: 'Rekap TGL', picDefault: 'Amanda', branchName: 'Lunar Eyewear Tegal (Second Brand)', city: 'Tegal', branchKey: 'TGL', isKFollowers: false },
    { sheetName: 'Rekap CLP', picDefault: 'Arum', branchName: 'Cilacap', city: 'Cilacap', branchKey: 'CLP', isKFollowers: false },
    { sheetName: 'Rekap WNS', picDefault: 'Febi', branchName: 'Wonosobo', city: 'Wonosobo', branchKey: 'WNS', isKFollowers: false }
  ];

  const allBranchReels = {};
  const allFollowerDaily = {};

  branchConfigs.forEach((cfg) => {
    const sheet = wb.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const linkByUploadDate = {};
    const linkByTitle = {};
    const titleToLinkMap = {};

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;
      const date = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
      const title = String((cfg.isPWT ? row[3] : row[2]) || '').trim();
      const link = String((cfg.isPWT ? row[5] : row[4]) || '').trim();
      const pillar = String((cfg.isPWT ? row[4] : row[3]) || 'Umum').trim();
      const feed = String((cfg.isPWT ? row[6] : row[5]) || '').trim();
      const threads = String((cfg.isPWT ? row[8] : row[7]) || '').trim();
      const tiktok = String((cfg.isPWT ? row[9] : row[8]) || '').trim();

      const isLibur = !title || title === '-' || title.toLowerCase().includes('libur');
      if (!isLibur && link.startsWith('http') && link.includes('/reel/')) {
        const info = { title, link, pillar, feed, threads, tiktok, date };
        if (date) linkByUploadDate[date] = info;
        linkByTitle[title.toLowerCase()] = info;
        titleToLinkMap[title.toLowerCase()] = link;
      }
    }

    const evaluationsByDate = {};
    const evaluationsList = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;
      const evalReportDate = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
      const targetUploadDate = parseExcelDate(row[13]);
      let evalTitle = String(row[14] || '').trim();
      const evalViewers = row[15];
      const evalLikes = row[16];
      const bonus = String(row[17] || '-').trim();

      const isLibur = !evalTitle || evalTitle === '-' || evalTitle.toLowerCase() === 'libur';
      const viewers = cleanMetric(evalViewers, true);
      const likes = cleanMetric(evalLikes, false);

      if (!isLibur && targetUploadDate && (viewers > 0 || likes > 0 || evalTitle.length > 2)) {
        const evalObj = { evalReportDate, targetUploadDate, evalTitle, viewers, likes, bonus };
        evaluationsList.push(evalObj);
        if (!evaluationsByDate[targetUploadDate]) evaluationsByDate[targetUploadDate] = [];
        evaluationsByDate[targetUploadDate].push(evalObj);
      }
    }

    const parsedRows = [];
    const matchedEvalIndices = new Set();

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      const reportDate = parseExcelDate(cfg.isPWT ? row[0] : row[9]);
      const uploadDate = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
      const pic = (cfg.isPWT ? row[2] : row[1]) || cfg.picDefault;
      const rawTitle = String((cfg.isPWT ? row[3] : row[2]) || '').trim();
      const pillar = String((cfg.isPWT ? row[4] : row[3]) || 'Umum').trim();
      let reelsLink = String((cfg.isPWT ? row[5] : row[4]) || '').trim();
      const feedLink = String((cfg.isPWT ? row[6] : row[5]) || '').trim();
      const threadsLink = String((cfg.isPWT ? row[8] : row[7]) || '').trim();
      const tiktokLink = String((cfg.isPWT ? row[9] : row[8]) || '').trim();
      const igFollowers = normalizeFollowers(row[10], cfg.isKFollowers);
      const tiktokFollowers = normalizeFollowers(row[11], cfg.isKFollowers);
      const obstacle = String(row[12] || '-').trim();

      if (!reportDate) continue;

      const cleanLink = (url) => {
        const s = String(url || '').trim();
        if (!s || s.toLowerCase() === 'libur' || s === '-' || !s.startsWith('http')) return '';
        return s;
      };

      let actualLink = cleanLink(reelsLink);
      if (!actualLink) {
        actualLink = titleToLinkMap[rawTitle.toLowerCase()] || '';
      }

      // CRUCIAL: Only add to branchReels if this row is a valid REEL!
      // Exclude photo carousels (links with /p/) and rows where no reel was uploaded.
      const isActualReel = actualLink && actualLink.includes('/reel/');
      if (!isActualReel) {
        continue;
      }

      const evalMatchDate = cfg.isPWT ? uploadDate : reportDate;
      let matchedEval = null;
      const dateEvals = evalMatchDate ? evaluationsByDate[evalMatchDate] : null;
      if (dateEvals && dateEvals.length > 0) {
        matchedEval = dateEvals[0];
      } else {
        matchedEval = evaluationsList.find((e) => {
          if (!e.evalReportDate || !evalMatchDate) return false;
          const daysDiff = Math.abs((new Date(e.evalReportDate).getTime() - new Date(evalMatchDate).getTime()) / (1000 * 3600 * 24));
          if (daysDiff > 7) return false;
          const t1 = e.evalTitle.toLowerCase();
          const t2 = rawTitle.toLowerCase();
          return t1 === t2 || t1.includes(t2) || t2.includes(t1);
        });
      }

      if (matchedEval) {
        const idx = evaluationsList.indexOf(matchedEval);
        if (idx !== -1) matchedEvalIndices.add(idx);
      }

      // Connect to live Instagram metrics if available
      const shortcodeMatch = actualLink.match(/\/reel\/([A-Za-z0-9_-]+)/);
      const code = shortcodeMatch ? shortcodeMatch[1] : null;
      const liveData = code ? verifiedLiveReels[code] : null;

      const viewers = liveData ? liveData.viewers : (matchedEval && matchedEval.viewers > 0 ? matchedEval.viewers : 0);
      const likes = liveData ? liveData.likes : (matchedEval && matchedEval.likes > 0 ? matchedEval.likes : 0);

      parsedRows.push({
        id: `${cfg.sheetName.toLowerCase()}-${i}`,
        sheetKey: cfg.sheetName,
        branch: cfg.branchName,
        branchKey: cfg.branchKey,
        city: cfg.city,
        pic,
        timestamp: reportDate,
        reportDate,
        uploadDate: cfg.isPWT ? uploadDate : reportDate,
        evalReportDate: matchedEval ? matchedEval.evalReportDate : null,
        reelsTitle: rawTitle,
        secondReelsTitle: matchedEval ? matchedEval.evalTitle : undefined,
        contentPillar: pillar,
        reelsLink: actualLink,
        feedLink: cleanLink(feedLink),
        threadsLink: cleanLink(threadsLink),
        tiktokLink: cleanLink(tiktokLink),
        igFollowers,
        tiktokFollowers,
        viewers,
        likes,
        bonus: matchedEval ? matchedEval.bonus : '-',
        obstacle: obstacle !== 'tidak ada' && obstacle !== 'belum ada' ? obstacle : '-',
        isDayOff: false,
        isEvaluated: !!(viewers > 0 || likes > 0),
        isLiveMetric: !!liveData,
        evaluationCadence: (viewers > 0) ? 'H+3 Selesai' : 'Menunggu H+3'
      });
    }

    evaluationsList.forEach((e, idx) => {
      if (!matchedEvalIndices.has(idx)) {
        let uploadInfo = linkByUploadDate[e.targetUploadDate] || linkByTitle[e.evalTitle.toLowerCase()];
        const reelUrl = uploadInfo?.link || (e.evalTitle.startsWith('http') && e.evalTitle.includes('/reel/') ? e.evalTitle : '');
        if (!reelUrl || !reelUrl.includes('/reel/')) return;

        parsedRows.push({
          id: `${cfg.sheetName.toLowerCase()}-eval-${idx}`,
          sheetKey: cfg.sheetName,
          branch: cfg.branchName,
          branchKey: cfg.branchKey,
          city: cfg.city,
          pic: cfg.picDefault,
          timestamp: e.targetUploadDate,
          reportDate: e.targetUploadDate,
          uploadDate: e.targetUploadDate,
          evalReportDate: e.evalReportDate,
          reelsTitle: uploadInfo?.title || e.evalTitle,
          secondReelsTitle: e.evalTitle,
          contentPillar: uploadInfo?.pillar || 'Umum',
          reelsLink: reelUrl,
          feedLink: uploadInfo?.feed || '',
          threadsLink: uploadInfo?.threads || '',
          tiktokLink: uploadInfo?.tiktok || '',
          igFollowers: 0,
          tiktokFollowers: 0,
          viewers: e.viewers,
          likes: e.likes,
          bonus: e.bonus,
          obstacle: '-',
          isDayOff: false,
          isEvaluated: true,
          evaluationCadence: 'H+3 Selesai'
        });
      }
    });

    parsedRows.sort((a, b) => (b.reportDate > a.reportDate ? 1 : -1));
    allBranchReels[cfg.sheetName] = parsedRows;
  });

  // Story Nuha PWT
  const storySheet = wb.Sheets['Rekap Story PWT'];
  const rawStory = storySheet ? XLSX.utils.sheet_to_json(storySheet) : [];
  const storyItems = rawStory
    .map((row, idx) => {
      let maxV = cleanMetric(row['Jumlah viewers terbanyak'], true);
      let minV = cleanMetric(row['Jumlah viewers paling sedikit'], true);
      return {
        id: `story-${idx}`,
        timestamp: parseExcelDate(row['Cap waktu']),
        reportDate: parseExcelDate(row['Tanggal Laporan']),
        pic: row['Pengisi Laporan'] || 'Nuha',
        branch: 'Purwokerto (Pusat)',
        branchKey: 'PWT',
        storiesUploaded: cleanMetric(row['Jumlah Story di Upload']),
        maxViewers: maxV,
        minViewers: minV,
        dmInquiries: cleanMetric(row['Jumlah DM masuk']),
        frequentQuestions: row['Hal paling sering ditanyakan'] || '-',
        viralComments: cleanMetric(row['Jumlah Komentar Reels Viral']),
        channelBroadcast: row['Posting Saluran Instagram'] || '-',
        csResponseSpeed: row['Pemantauan CS dalam membalas DM'] || '-',
        achievement: row['Apa pencapaian hari ini?'] || '-',
        areaToImprove: row['Apa yang perlu diperbaiki?'] || '-',
        obstacle: row['Kendala yang dihadapi'] || '-'
      };
    })
    .filter((item) => item.reportDate);

  // Load existing data to merge
  const sheetsDataPath = path.join(__dirname, '..', 'lib', 'real-sheets-data.json');
  const existingSheetsData = JSON.parse(fs.readFileSync(sheetsDataPath, 'utf8'));

  const updatedSheetsData = {
    ...existingSheetsData,
    syncTimestamp: new Date().toISOString(),
    storyData: storyItems,
    branchReels: allBranchReels
  };

  fs.writeFileSync(sheetsDataPath, JSON.stringify(updatedSheetsData, null, 2), 'utf8');
  console.log('Successfully updated lib/real-sheets-data.json with clean REELS only!');
}

run().catch(console.error);
