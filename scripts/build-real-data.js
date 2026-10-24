const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const SHEET_EXPORT_URL =
  'https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/export?format=xlsx';

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
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      return s.slice(0, 10);
    }
    const parts = s.split(/[/\-\s]/);
    if (parts.length >= 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const d = parts[2].padStart(2, '0');
        return `${y}-${m}-${d}`;
      } else {
        // DD-MM-YYYY
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const y = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        return `${y}-${m}-${d}`;
      }
    }
    return s;
  }
  return String(serial);
}

function cleanNumber(val) {
  if (val === null || val === undefined || val === '-') return 0;
  if (typeof val === 'number') return Math.round(val * 100) / 100;
  let str = String(val).replace(/[,.]/g, '').replace(/[^0-9-]/g, '');
  const n = parseInt(str, 10);
  return isNaN(n) ? 0 : n;
}

function cleanMetric(val, isViewer = false) {
  if (val === null || val === undefined || val === '-' || val === '') return 0;
  
  if (typeof val === 'number') {
    // Handles decimals like 12.5, 32.9 (representing 12.5k, 32.9k viewers)
    // or Indonesian thousand separators like 29.156 entered in Excel
    if (val > 0 && val < 1000) {
      if (val % 1 !== 0) {
        return Math.round(val * 1000);
      }
      if (isViewer && val < 100) {
        return Math.round(val * 1000);
      }
    }
    return Math.round(val);
  }

  let str = String(val).toLowerCase().trim();
  if (str === 'libur' || str === 'tidak ada' || str === 'belum ada' || str === '-') return 0;

  // Handles: 52,1k, 52.1k, 57,5k, 25rb, 1,1rb, 1.7rb, 14 rb, 214 rb, 643rb
  if (str.includes('rb') || str.includes('k')) {
    const cleanStr = str
      .replace(/rb/g, '')
      .replace(/k/g, '')
      .replace(/\s+/g, '')
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }

  // Indonesian comma decimal e.g. "12,5" or "32,9"
  if (/^\d+,\d+$/.test(str)) {
    const num = parseFloat(str.replace(',', '.'));
    if (!isNaN(num) && num < 1000) {
      return Math.round(num * 1000);
    }
  }

  // Indonesian dot thousand separator e.g. "29.156" or "15.934" or "9.797"
  if (/^\d+\.\d{3}$/.test(str)) {
    const num = parseInt(str.replace(/\./g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

  // Decimal notation e.g. "12.5" or "32.9"
  if (/^\d+\.\d{1,2}$/.test(str)) {
    const num = parseFloat(str);
    if (!isNaN(num) && num < 1000) {
      return Math.round(num * 1000);
    }
  }

  const n = parseInt(str.replace(/[,.]/g, '').replace(/[^0-9-]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function normalizeFollowers(val, isKNotation = false) {
  if (val === null || val === undefined || val === '-') return 0;
  if (typeof val === 'number') {
    if (isKNotation && val < 1000) {
      return Math.round(val * 1000);
    }
    return Math.round(val);
  }
  let str = String(val).replace(/[,]/g, '').trim();
  let num = parseFloat(str);
  if (isNaN(num)) return 0;
  if (isKNotation && num < 1000) return Math.round(num * 1000);
  return Math.round(num);
}

function cleanObstacle(val) {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'number') return '-';
  const str = String(val).trim();
  if (
    !str ||
    str === '-' ||
    str.toLowerCase() === 'libur' ||
    str.toLowerCase() === 'tidak ada' ||
    str.toLowerCase() === 'belum ada' ||
    str.toLowerCase() === 'aman'
  ) {
    return '-';
  }
  if (/^\d{5}$/.test(str) || /^\d{4}-\d{2}-\d{2}$/.test(str)) return '-';
  if (str.startsWith('http://') || str.startsWith('https://')) return '-';
  return str;
}

function createColumnMapper(headerRow) {
  const headers = (headerRow || []).map((h) =>
    String(h || '')
      .toLowerCase()
      .replace(/[\s\r\n\t_]+/g, ' ')
      .trim()
  );

  const findIndex = (patterns) => {
    for (const pattern of patterns) {
      const idx = headers.findIndex((h) =>
        typeof pattern === 'string' ? h.includes(pattern) : pattern.test(h)
      );
      if (idx !== -1) return idx;
    }
    return -1;
  };

  return {
    timestampIdx: findIndex(['cap waktu', 'timestamp']),
    reportDateIdx: findIndex(['tanggal laporan', 'tgl laporan']),
    picIdx: findIndex(['pengisi laporan', 'pic']),
    titleIdx: findIndex(['judul reels', 'judul']),
    pillarIdx: findIndex(['konten pilar', 'pilar']),
    reelsLinkIdx: findIndex(['link reels instagram', 'link reels']),
    feedLinkIdx: findIndex(['link feed/carousel instagram', 'link feed', 'link carousel']),
    storyIdx: findIndex(['story instagram']),
    threadsLinkIdx: findIndex(['link instagram threads', 'threads']),
    tiktokLinkIdx: findIndex(['link video tik- tok', 'tik- tok', 'link tiktok', 'tiktok']),
    igFollowersIdx: findIndex(['jumlah followers (instagram)', 'followers (instagram)', 'followers ig']),
    tiktokFollowersIdx: findIndex(['jumlah followers (tik-tok)', 'followers (tik-tok)', 'followers tiktok']),
    obstacleIdx: findIndex(['kendala content creator', 'kendala']),
    uploadDateIdx: findIndex(['tanggal upload', 'tgl upload']),
    evalTitleIdx: findIndex(['judul reels 2', 'judul 2', 'evaluasi judul']),
    evalViewersIdx: findIndex(['jumlah viewers', 'viewers']),
    evalLikesIdx: findIndex(['jumlah like', 'likes', 'like']),
    bonusIdx: findIndex(['bonus']),
  };
}

async function loadWorkbook() {
  try {
    console.log('Downloading live spreadsheet from Google Sheets...');
    const res = await fetch(SHEET_EXPORT_URL);
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // Save local backup copy
      try {
        fs.writeFileSync(path.join(__dirname, '../google_sheets_data.xlsx'), buffer);
      } catch (e) {
        // ignore write error
      }
      return XLSX.read(buffer, { type: 'buffer' });
    }
  } catch (err) {
    console.warn('Live fetch failed, falling back to local file:', err.message);
  }

  const localFile = path.join(__dirname, '../google_sheets_data.xlsx');
  if (fs.existsSync(localFile)) {
    return XLSX.readFile(localFile);
  }
  throw new Error('Could not load workbook from online or local backup.');
}

async function main() {
  const workbook = await loadWorkbook();
  console.log('Workbook sheets available:', workbook.SheetNames);

  // 1. Process Rekap Story PWT (Mba Nuha)
  const storySheet = workbook.Sheets['Rekap Story PWT'];
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
        storiesUploaded: cleanNumber(row['Jumlah Story di Upload']),
        maxViewers: maxV,
        minViewers: minV,
        dmInquiries: cleanNumber(row['Jumlah DM masuk']),
        frequentQuestions: row['Hal paling sering ditanyakan'] || '-',
        viralComments: cleanNumber(row['Jumlah Komentar Reels Viral']),
        channelBroadcast: row['Posting Saluran Instagram'] || '-',
        csResponseSpeed: row['Pemantauan CS dalam membalas DM'] || '-',
        achievement: row['Apa pencapaian hari ini?'] || '-',
        areaToImprove: row['Apa yang perlu diperbaiki?'] || '-',
        obstacle: row['Kendala yang dihadapi'] || '-',
      };
    })
    .filter((item) => item.reportDate);

  // 2. Process Branch Reels Sheets
  const branchConfigs = [
    { sheetName: 'Rekap PWT', picDefault: 'Ilya', branchName: 'Purwokerto (Pusat)', city: 'Purwokerto', branchKey: 'PWT', isKFollowers: true, isPWT: true },
    { sheetName: 'Rekap PBG', picDefault: 'Ajun', branchName: 'Purbalingga', city: 'Purbalingga', branchKey: 'PBG', isKFollowers: false },
    { sheetName: 'Rekap TGL', picDefault: 'Amanda', branchName: 'Lunar Eyewear Tegal (Second Brand)', city: 'Tegal', branchKey: 'TGL', isKFollowers: false },
    { sheetName: 'Rekap CLP', picDefault: 'Intan', branchName: 'Cilacap', city: 'Cilacap', branchKey: 'CLP', isKFollowers: false },
    { sheetName: 'Rekap WNS', picDefault: 'Febi', branchName: 'Wonosobo', city: 'Wonosobo', branchKey: 'WNS', isKFollowers: false },
  ];

  // Load IG live cache for live metric fallback
  let igLiveCache = null;
  try {
    const igCachePath = path.join(__dirname, '../lib/instagram-live-cache.json');
    if (fs.existsSync(igCachePath)) {
      igLiveCache = JSON.parse(fs.readFileSync(igCachePath, 'utf-8'));
    }
  } catch (e) {
    // ignore
  }

  function findLiveReel(url, igCache) {
    if (!url || !igCache?.reels) return null;
    const clean = String(url).trim();
    if (igCache.reels[clean]) return igCache.reels[clean];
    const m = clean.match(/\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    if (m) {
      const code = m[1];
      for (const [k, v] of Object.entries(igCache.reels)) {
        if (k.includes(code)) return v;
      }
    }
    return null;
  }

  const allBranchReels = {};
  const allFollowerDaily = {};

  branchConfigs.forEach((cfg) => {
    const sheet = workbook.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Pass 1: Collect upload links and metadata by date and title
    const mapper = createColumnMapper(rawRows[0]);

    // Pass 1: Collect upload links and metadata by date and title
    const linkByUploadDate = {};
    const linkByTitle = {};
    const titleToLinkMap = {};

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;
      const date = parseExcelDate(mapper.reportDateIdx !== -1 ? row[mapper.reportDateIdx] : (mapper.timestampIdx !== -1 ? row[mapper.timestampIdx] : null));
      const title = String((mapper.titleIdx !== -1 ? row[mapper.titleIdx] : '') || '').trim();
      const link = String((mapper.reelsLinkIdx !== -1 ? row[mapper.reelsLinkIdx] : '') || '').trim();
      const pillar = String((mapper.pillarIdx !== -1 ? row[mapper.pillarIdx] : '') || 'Umum').trim();
      const feed = String((mapper.feedLinkIdx !== -1 ? row[mapper.feedLinkIdx] : '') || '').trim();
      const threads = String((mapper.threadsLinkIdx !== -1 ? row[mapper.threadsLinkIdx] : '') || '').trim();
      const tiktok = String((mapper.tiktokLinkIdx !== -1 ? row[mapper.tiktokLinkIdx] : '') || '').trim();

      const isLibur = !title || title === '-' || title.toLowerCase().includes('libur');
      if (!isLibur && link.startsWith('http')) {
        const info = { title, link, pillar, feed, threads, tiktok, date };
        if (date) linkByUploadDate[date] = info;
        linkByTitle[title.toLowerCase()] = info;
        titleToLinkMap[title.toLowerCase()] = link;
      }
    }

    // Pass 2: Collect all H+3 evaluations
    const evaluationsByDate = {};
    const evaluationsList = [];

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;
      const evalReportDate = parseExcelDate(mapper.reportDateIdx !== -1 ? row[mapper.reportDateIdx] : (mapper.timestampIdx !== -1 ? row[mapper.timestampIdx] : null));
      const targetUploadDate = parseExcelDate(mapper.uploadDateIdx !== -1 ? row[mapper.uploadDateIdx] : null);
      let evalTitle = String((mapper.evalTitleIdx !== -1 ? row[mapper.evalTitleIdx] : '') || '').trim();
      const evalViewers = mapper.evalViewersIdx !== -1 ? row[mapper.evalViewersIdx] : null;
      const evalLikes = mapper.evalLikesIdx !== -1 ? row[mapper.evalLikesIdx] : null;
      const bonus = String((mapper.bonusIdx !== -1 ? row[mapper.bonusIdx] : '') || '-').trim();

      const isLibur = !evalTitle || evalTitle === '-' || evalTitle.toLowerCase() === 'libur';
      const viewers = cleanMetric(evalViewers, true);
      const likes = cleanMetric(evalLikes, false);

      if (!isLibur && targetUploadDate && (viewers > 0 || likes > 0 || evalTitle.length > 2)) {
        const evalObj = {
          evalReportDate,
          targetUploadDate,
          evalTitle,
          viewers,
          likes,
          bonus,
        };
        evaluationsList.push(evalObj);
        if (!evaluationsByDate[targetUploadDate]) {
          evaluationsByDate[targetUploadDate] = [];
        }
        evaluationsByDate[targetUploadDate].push(evalObj);
      }
    }

    // Pass 3: Build parsedRows
    const parsedRows = [];
    const matchedEvalIndices = new Set();

    for (let i = 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      const reportDate = parseExcelDate(mapper.reportDateIdx !== -1 ? row[mapper.reportDateIdx] : (mapper.timestampIdx !== -1 ? row[mapper.timestampIdx] : null));
      const uploadDateRaw = mapper.uploadDateIdx !== -1 ? parseExcelDate(row[mapper.uploadDateIdx]) : null;
      const uploadDate = uploadDateRaw || reportDate;
      const pic = (mapper.picIdx !== -1 && row[mapper.picIdx] ? String(row[mapper.picIdx]).trim() : '') || cfg.picDefault;
      const rawTitle = String((mapper.titleIdx !== -1 ? row[mapper.titleIdx] : '') || '').trim();
      const pillar = String((mapper.pillarIdx !== -1 ? row[mapper.pillarIdx] : '') || 'Umum').trim();
      let reelsLink = String((mapper.reelsLinkIdx !== -1 ? row[mapper.reelsLinkIdx] : '') || '').trim();
      const feedLink = String((mapper.feedLinkIdx !== -1 ? row[mapper.feedLinkIdx] : '') || '').trim();
      const threadsLink = String((mapper.threadsLinkIdx !== -1 ? row[mapper.threadsLinkIdx] : '') || '').trim();
      const tiktokLink = String((mapper.tiktokLinkIdx !== -1 ? row[mapper.tiktokLinkIdx] : '') || '').trim();
      const igFollowers = normalizeFollowers(mapper.igFollowersIdx !== -1 ? row[mapper.igFollowersIdx] : null, cfg.isKFollowers);
      const tiktokFollowers = normalizeFollowers(mapper.tiktokFollowersIdx !== -1 ? row[mapper.tiktokFollowersIdx] : null, cfg.isKFollowers);
      const obstacle = cleanObstacle(mapper.obstacleIdx !== -1 ? row[mapper.obstacleIdx] : '-');

      if (!reportDate) continue;

      const isDayOff = !rawTitle || rawTitle === '-' || rawTitle.toLowerCase().includes('libur');

      if (isDayOff) {
        parsedRows.push({
          id: `${cfg.sheetName.toLowerCase()}-${i}`,
          sheetKey: cfg.sheetName,
          branch: cfg.branchName,
          branchKey: cfg.branchKey,
          city: cfg.city,
          pic,
          timestamp: reportDate,
          reportDate,
          uploadDate: reportDate,
          evalReportDate: null,
          reelsTitle: '(Libur / Off Duty)',
          secondReelsTitle: undefined,
          contentPillar: pillar,
          reelsLink: '',
          feedLink: '',
          threadsLink: '',
          tiktokLink: '',
          igFollowers,
          tiktokFollowers,
          viewers: 0,
          likes: 0,
          bonus: '-',
          obstacle,
          isDayOff: true,
          isEvaluated: false,
          evaluationCadence: 'Libur',
        });
        continue;
      }

      // Real video upload: match with H+3 evaluation
      const evalMatchDate = reportDate;
      let matchedEval = null;
      const dateEvals = evaluationsByDate[evalMatchDate];
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

      const cleanLink = (url) => {
        const s = String(url || '').trim();
        if (!s || s.toLowerCase() === 'libur' || s === '-' || !s.startsWith('http')) return '';
        return s;
      };

      let actualLink = cleanLink(reelsLink);
      let actualFeedLink = cleanLink(feedLink);

      // If pillar contains a reel link while actualLink has carousel /p/, recover the reel link
      if (pillar.includes('/reel/')) {
        if (!actualFeedLink && actualLink.includes('/p/')) actualFeedLink = actualLink;
        actualLink = pillar;
      }

      if (!actualLink) {
        actualLink = titleToLinkMap[rawTitle.toLowerCase()] || '';
      }

      // Strictly ensure photo carousels (/p/) are never stored in reelsLink for spreadsheet evaluation
      if (actualLink.includes('/p/') && !actualLink.includes('/reel/')) {
        if (!actualFeedLink) actualFeedLink = actualLink;
        actualLink = '';
      }

      parsedRows.push({
        id: `${cfg.sheetName.toLowerCase()}-${i}`,
        sheetKey: cfg.sheetName,
        branch: cfg.branchName,
        branchKey: cfg.branchKey,
        city: cfg.city,
        pic,
        timestamp: reportDate,
        reportDate,
        uploadDate: reportDate,
        evalReportDate: matchedEval ? matchedEval.evalReportDate : null,
        reelsTitle: rawTitle,
        secondReelsTitle: matchedEval ? matchedEval.evalTitle : undefined,
        contentPillar: pillar,
        reelsLink: actualLink,
        feedLink: actualFeedLink,
        threadsLink: cleanLink(threadsLink),
        tiktokLink: cleanLink(tiktokLink),
        igFollowers,
        tiktokFollowers,
        viewers: (matchedEval && matchedEval.viewers > 0) ? matchedEval.viewers : 0,
        likes: (matchedEval && matchedEval.likes > 0) ? matchedEval.likes : 0,
        bonus: matchedEval ? matchedEval.bonus : '-',
        obstacle,
        isDayOff: false,
        isEvaluated: !!(matchedEval && (matchedEval.viewers > 0 || matchedEval.likes > 0)),
        isLiveMetric: false,
        evaluationCadence: (matchedEval && matchedEval.viewers > 0)
          ? 'H+3 Selesai'
          : 'Menunggu H+3',
      });
    }

    // Add any evaluations that were not matched to an upload
    evaluationsList.forEach((e, idx) => {
      if (!matchedEvalIndices.has(idx)) {
        let uploadInfo = linkByUploadDate[e.targetUploadDate] || linkByTitle[e.evalTitle.toLowerCase()];
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
          reelsTitle: uploadInfo?.title || (e.evalTitle.startsWith('http') ? 'Konten Reels' : e.evalTitle),
          secondReelsTitle: e.evalTitle,
          contentPillar: uploadInfo?.pillar || 'Umum',
          reelsLink: uploadInfo?.link || (e.evalTitle.startsWith('http') ? e.evalTitle : ''),
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
          evaluationCadence: 'H+3 Selesai',
        });
      }
    });

    parsedRows.sort((a, b) => (b.reportDate > a.reportDate ? 1 : -1));
    allBranchReels[cfg.sheetName] = parsedRows;

    const dateMap = {};
    parsedRows.forEach((r) => {
      if (r.reportDate && r.igFollowers > 0) {
        dateMap[r.reportDate] = {
          date: r.reportDate,
          igFollowers: r.igFollowers,
          tiktokFollowers: r.tiktokFollowers,
          reelsTitle: r.reelsTitle,
          viewers: r.viewers,
          likes: r.likes,
        };
      }
    });

    const sortedDates = Object.keys(dateMap).sort();
    allFollowerDaily[cfg.branchKey] = sortedDates.map((date, idx) => {
      const current = dateMap[date];
      const prev = idx > 0 ? dateMap[sortedDates[idx - 1]] : null;
      const igDelta = prev ? current.igFollowers - prev.igFollowers : 0;
      const ttDelta = prev ? current.tiktokFollowers - prev.tiktokFollowers : 0;
      return {
        date: current.date,
        igFollowers: current.igFollowers,
        igDelta: igDelta,
        tiktokFollowers: current.tiktokFollowers,
        ttDelta: ttDelta,
        reelsTitle: current.reelsTitle,
        viewers: current.viewers,
        likes: current.likes,
      };
    });
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const picTracker = [
    { pic: 'Nuha', role: 'Rekap Story PWT', branch: 'Purwokerto (Pusat)', sheetKey: 'Rekap Story PWT', data: storyItems },
    { pic: 'Ilya', role: 'Rekap Reels PWT', branch: 'Purwokerto (Pusat)', sheetKey: 'Rekap PWT', data: allBranchReels['Rekap PWT'] || [] },
    { pic: 'Ajun', role: 'Rekap Reels PBG', branch: 'Purbalingga', sheetKey: 'Rekap PBG', data: allBranchReels['Rekap PBG'] || [] },
    { pic: 'Amanda', role: 'Rekap Reels TGL', branch: 'Lunar Eyewear Tegal (Second Brand)', sheetKey: 'Rekap TGL', data: allBranchReels['Rekap TGL'] || [] },
    { pic: 'Intan', role: 'Rekap Reels CLP', branch: 'Cilacap', sheetKey: 'Rekap CLP', data: allBranchReels['Rekap CLP'] || [] },
    { pic: 'Febi', role: 'Rekap Reels WNS', branch: 'Wonosobo', sheetKey: 'Rekap WNS', data: allBranchReels['Rekap WNS'] || [] },
  ].map((p) => {
    const dates = p.data
      .map((d) => d.reportDate)
      .filter((d) => d && d <= todayStr)
      .sort();
    const latestDate = dates.length > 0 ? dates[dates.length - 1] : 'Belum pernah';
    const totalEntries = p.data.length;

    let daysBehind = 0;
    if (latestDate && latestDate.includes('-')) {
      const diff = Math.floor((new Date(todayStr).getTime() - new Date(latestDate).getTime()) / (1000 * 3600 * 24));
      daysBehind = Math.max(0, diff);
    }
    const isUpToDate = daysBehind <= 1;

    return {
      pic: p.pic,
      role: p.role,
      branch: p.branch,
      sheetKey: p.sheetKey,
      latestDate: latestDate,
      totalEntries: totalEntries,
      isUpToDate: isUpToDate,
      daysBehind: daysBehind,
      statusText: isUpToDate ? 'Lengkap & Up-to-date' : `Tertunda ${daysBehind} hari (Terakhir: ${latestDate})`,
      whatsappReminder: `Halo ${p.pic}, mengingatkan untuk pengisian laporan harian di Spreadsheet "${p.sheetKey}". Data terakhir tercatat per tanggal ${latestDate}. Mohon diupdate sebelum meeting evaluasi mingguan ya. Terima kasih!`,
    };
  });

  // Helper: Extract weekly evaluation data for a given 7-day period
  const buildPeriodRecap = (startDate, endDate, meetingDateTitle, meetingStatus) => {
    const weeklyReels = [];
    Object.entries(allBranchReels).forEach(([sheet, rows]) => {
      rows.forEach((r) => {
        const evaluatedInPeriod = r.evalReportDate && r.evalReportDate >= startDate && r.evalReportDate <= endDate;
        const uploadedInPeriod = r.uploadDate && r.uploadDate >= startDate && r.uploadDate <= endDate;

        if (!r.isDayOff && (evaluatedInPeriod || uploadedInPeriod)) {
          let liveIg = findLiveReel(r.reelsLink, igLiveCache);

          const finalV = Math.max(r.viewers || 0, liveIg?.viewers || 0);
          const finalL = Math.max(r.likes || 0, liveIg?.likes || 0);

          weeklyReels.push({
            branch: r.branch,
            sheetKey: sheet,
            pic: r.pic,
            date: r.uploadDate || r.reportDate,
            uploadDate: r.uploadDate || r.reportDate,
            evalReportDate: r.evalReportDate,
            title: r.reelsTitle,
            secondTitle: r.secondReelsTitle,
            pillar: r.contentPillar,
            viewers: finalV,
            sheetViewers: r.viewers,
            likes: finalL,
            sheetLikes: r.likes,
            liveIgLikes: liveIg?.likes || null,
            igLikesFormatted: liveIg?.likesFormatted,
            igComments: liveIg?.comments,
            igCaption: liveIg?.caption || '',
            bonus: r.bonus,
            reelsLink: r.reelsLink,
            tiktokLink: r.tiktokLink,
            isEvaluated: r.isEvaluated || finalV > 0 || finalL > 0,
            isLiveMetric: r.isLiveMetric || (!r.evalReportDate && (finalV > 0 || finalL > 0)),
            evaluationStatus: r.evalReportDate ? 'Evaluasi H+3 Selesai' : (finalV > 0 || finalL > 0 ? 'Live Instagram (H-1/H-2)' : 'Menunggu Evaluasi H+3'),
          });
        }
      });
    });

    const seen = new Set();
    const dedupedReels = [];
    weeklyReels.forEach((r) => {
      const key = r.reelsLink || `${r.branch}_${r.title}_${r.uploadDate}`;
      if (!seen.has(key)) {
        seen.add(key);
        dedupedReels.push(r);
      }
    });

    dedupedReels.sort((a, b) => b.viewers - a.viewers);

    const weeklyStories = storyItems.filter((s) => s.reportDate && s.reportDate >= startDate && s.reportDate <= endDate);
    const questionCounts = {};
    let totalDms = 0;
    weeklyStories.forEach((s) => {
      totalDms += s.dmInquiries || 0;
      if (s.frequentQuestions && s.frequentQuestions !== '-') {
        const items = s.frequentQuestions.split(/[,;\n]/).map((t) => t.trim()).filter(Boolean);
        items.forEach((it) => {
          questionCounts[it] = (questionCounts[it] || 0) + 1;
        });
      }
    });

    const weeklyObstacles = [];
    weeklyStories.forEach((s) => {
      if (s.obstacle && s.obstacle !== '-' && s.obstacle !== 'tidak ada' && s.obstacle !== 'belum ada') {
        weeklyObstacles.push({
          date: s.reportDate,
          pic: 'Nuha',
          role: 'Story PWT',
          obstacle: s.obstacle,
          areaToImprove: s.areaToImprove,
        });
      }
    });
    dedupedReels.forEach((r) => {
      if (r.obstacle && r.obstacle !== '-' && r.obstacle !== 'tidak ada' && r.obstacle !== 'belum ada' && r.obstacle !== 'libur') {
        weeklyObstacles.push({
          date: r.date,
          pic: r.pic,
          role: r.sheetKey,
          obstacle: r.obstacle,
          areaToImprove: '-',
        });
      }
    });

    return {
      periodKey: `${startDate}_to_${endDate}`,
      startDate,
      endDate,
      meetingDateTitle,
      meetingStatus,
      totalReelsUploaded: dedupedReels.filter((r) => r.uploadDate >= startDate && r.uploadDate <= endDate).length,
      totalStoriesRecorded: weeklyStories.length,
      totalStoriesUploaded: weeklyStories.reduce((acc, s) => acc + (s.storiesUploaded || 0), 0),
      totalDmInquiries: totalDms,
      topViralReels: dedupedReels.slice(0, 8),
      allWeeklyReels: dedupedReels,
      frequentStoryInquiries: Object.entries(questionCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([topic, count]) => ({ topic, count })),
      obstacleLogs: weeklyObstacles,
    };
  };

  const periodCycle8 = buildPeriodRecap(
    '2026-10-06',
    '2026-10-12',
    'Selasa, 13 Oktober 2026 (Siklus 8 · 6–12 Okt)',
    'Evaluasi Rapat Terkini (Siklus 8 · 13 Okt 2026)'
  );

  const periodCycle7 = buildPeriodRecap(
    '2026-09-29',
    '2026-10-05',
    'Selasa, 6 Oktober 2026 (Siklus 7 · 29 Sep – 5 Okt)',
    'Evaluasi Rapat Siklus 7 (6 Okt 2026)'
  );

  const periodCycle6 = buildPeriodRecap(
    '2026-09-22',
    '2026-09-28',
    'Selasa, 29 September 2026 (Siklus 6 · 22–28 Sep)',
    'Evaluasi Rapat Siklus 6 (29 Sep 2026)'
  );

  const periodCycle5 = buildPeriodRecap(
    '2026-09-15',
    '2026-09-21',
    'Selasa, 22 September 2026 (Siklus 5 · 15–21 Sep)',
    'Evaluasi Historis Siklus 5 (22 Sep 2026)'
  );

  // Extract spreadsheet followers per branch (H+3 latest recorded)
  const spreadsheetFollowersByBranch = {};
  branchConfigs.forEach((cfg) => {
    const sheet = workbook.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows = XLSX.utils.sheet_to_json(sheet);
    const withFollowers = rawRows.filter((r) => r['Jumlah Followers (Instagram)'] && r['Jumlah Followers (Instagram)'] !== '-');
    const last = withFollowers[withFollowers.length - 1];
    const followersCount = last ? normalizeFollowers(last['Jumlah Followers (Instagram)'], cfg.isKFollowers) : 0;
    const lastDate = last ? parseExcelDate(last['Tanggal Laporan'] || last['Cap waktu'] || last['Tanggal Upload']) : null;
    spreadsheetFollowersByBranch[cfg.branchKey] = {
      branchName: cfg.branchName,
      city: cfg.city,
      followers: followersCount,
      followersFormatted: followersCount >= 100000 ? Math.round(followersCount / 1000) + 'K' : followersCount.toLocaleString('id-ID'),
      lastRecordedDate: lastDate,
      pic: cfg.picDefault,
    };
  });

  // Extract all Bonus rows from Spreadsheet (Bonus Gaji Tim Konten per 3 hari)
  const allBonusEntries = [];
  branchConfigs.forEach((cfg) => {
    const sheet = workbook.Sheets[cfg.sheetName];
    if (!sheet) return;
    const rawRows = XLSX.utils.sheet_to_json(sheet);
    rawRows.forEach((r, idx) => {
      const b = r['Bonus'];
      const numB = typeof b === 'number' ? b : parseInt(String(b).replace(/[^0-9]/g, '')) || 0;
      if (numB > 0) {
        const formatPic = (p) => {
          const s = String(p || '').trim();
          if (!s) return cfg.picDefault;
          return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        };
        allBonusEntries.push({
          id: `${cfg.sheetName.toLowerCase()}-bonus-${idx}`,
          branch: cfg.branchName,
          city: cfg.city,
          pic: formatPic(r['Pengisi Laporan'] || cfg.picDefault),
          title: r['Judul Reels 2'] || r['Judul Reels'] || '-',
          uploadDate: parseExcelDate(r['Tanggal Upload']),
          reviewDate: parseExcelDate(r['Tanggal Laporan']),
          viewersH3: cleanMetric(r['Jumlah Viewers'], true),
          likesH3: cleanMetric(r['Jumlah Like'], false),
          bonusAmount: numB,
          bonusFormatted: 'Rp ' + numB.toLocaleString('id-ID'),
        });
      }
    });
  });

  allBonusEntries.sort((a, b) => (b.reviewDate || '').localeCompare(a.reviewDate || ''));

  const byPicSummary = {};
  allBonusEntries.forEach((item) => {
    if (!byPicSummary[item.pic]) {
      byPicSummary[item.pic] = { pic: item.pic, branch: item.branch, count: 0, totalAmount: 0, totalAmountFormatted: '' };
    }
    byPicSummary[item.pic].count++;
    byPicSummary[item.pic].totalAmount += item.bonusAmount;
    byPicSummary[item.pic].totalAmountFormatted = 'Rp ' + byPicSummary[item.pic].totalAmount.toLocaleString('id-ID');
  });

  const bonusSummary = {
    totalBonusPaid: allBonusEntries.reduce((sum, item) => sum + item.bonusAmount, 0),
    totalBonusPaidFormatted: 'Rp ' + allBonusEntries.reduce((sum, item) => sum + item.bonusAmount, 0).toLocaleString('id-ID'),
    totalEligibleVideos: allBonusEntries.length,
    byPic: Object.values(byPicSummary).sort((a, b) => b.totalAmount - a.totalAmount),
    entries: allBonusEntries,
  };

  // Additional Operational Sheets
  const designSheet = workbook.Sheets['Database Desain'];
  const rawDesign = designSheet ? XLSX.utils.sheet_to_json(designSheet) : [];
  const databaseDesain = rawDesign.map((r, i) => ({
    id: `desain-${i}`,
    timestamp: parseExcelDate(r['Cap waktu']),
    date: parseExcelDate(r['Tanggal, Bulan']),
    creator: r['Penginput'] || '-',
    designTitle: r['Nama Desain *tambahkan keterangan jika hasil Revisi (Contoh : Nama File-Revisi 2)'] || '-',
    fileUrl: r['Upload File '] || '',
  }));

  const proposalSheet = workbook.Sheets['Form Proposal'];
  const rawProposal = proposalSheet ? XLSX.utils.sheet_to_json(proposalSheet) : [];
  const formProposal = rawProposal
    .filter(
      (r) =>
        (r['Nama Event/Kegiatan'] || r['Nama Perusahaan/Sekolah/Event']) &&
        String(r['Nama Event/Kegiatan'] || '').trim() !== '-'
    )
    .map((r, i) => {
      const eventClean = String(r['Nama Event/Kegiatan'] || r['Nama Perusahaan/Sekolah/Event'] || 'event')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 24);
      const dateClean = (parseExcelDate(r['Tanggal Pelaksanaan Event/Kegiatan']) || 'nodate').replace(/[^a-z0-9]/g, '');
      const phoneClean = String(r['Nomor Hp Pengaju'] || '').replace(/[^0-9]/g, '').slice(-4);
      const stableId = `prop_${eventClean}_${dateClean}_${phoneClean || i}`;
      return {
        id: `proposal-${i}`,
        stableId,
        timestamp: parseExcelDate(r['Cap waktu']),
        institution: String(r['Nama Perusahaan/Sekolah/Event'] || '-').trim(),
        targetBranch: String(r['Pengajuan Untuk Cabang'] || 'Purwokerto').trim(),
        eventName: String(r['Nama Event/Kegiatan'] || '-').trim(),
        eventDate: parseExcelDate(r['Tanggal Pelaksanaan Event/Kegiatan']),
        description: String(r['Deskripsi Singkat Event/Kegiatan'] || '-').trim(),
        benefit: String(r['Banefit Yang Ditawarkan'] || '-').trim(),
        applicantName: String(r['Nama Pengaju'] || '-').trim(),
        applicantPhone: String(r['Nomor Hp Pengaju'] || '-').trim(),
        fileUrl: String(r['File Proposal Event/Kegiatan'] || '').trim(),
        sheetNote: r['Kolom 1'] && String(r['Kolom 1']).trim() !== '-' ? String(r['Kolom 1']).trim() : '',
      };
    });

  const pengajuanSheet = workbook.Sheets['Form Pengajuan'];
  const rawPengajuan = pengajuanSheet ? XLSX.utils.sheet_to_json(pengajuanSheet) : [];
  const formPengajuan = rawPengajuan.map((r, i) => ({
    id: `pengajuan-${i}`,
    timestamp: parseExcelDate(r['Cap waktu']),
    branch: r['Cabang'] || '-',
    applicantName: (r['Nama Pengaju'] || '-').replace(/^(Mba|Mas|Pak|Bu|Kak)\s+/i, '').trim(),
    requestedItems: r['Alat/barang yang diajukan (tuliskan juga jumlahnya)'] || '-',
    purpose: r['Tujuan/alasan pengajuan'] || '-',
  }));

    const totalNetworkIG = Object.values(spreadsheetFollowersByBranch).reduce(
      (sum, b) => sum + (b.followers || 0),
      0
    );
    const totalNetworkTT = Object.values(allFollowerDaily).reduce(
      (sum, list) => {
        const last = list && list.length > 0 ? list[list.length - 1] : null;
        return sum + (last?.tiktokFollowers || 0);
      },
      0
    );

    const output = {
      syncTimestamp: new Date().toISOString(),
      sourceUrl: 'https://docs.google.com/spreadsheets/d/1BU0fIDP656Y-eue55bWVSxeaixSeFJwR3GP1n8kwBYc/edit?usp=sharing',
      officialAccounts: [
        { name: 'Optik I See You Purwokerto (Pusat)', handle: '@iseeyou.glasses', url: 'https://www.instagram.com/iseeyou.glasses/', city: 'Purwokerto', pic: 'Ilya & Nuha' },
        { name: 'Optik I See You Purbalingga', handle: '@iseeyou.purbalingga', url: 'https://www.instagram.com/iseeyou.purbalingga/', city: 'Purbalingga', pic: 'Ajun' },
        { name: 'Optik I See You Cilacap', handle: '@iseeyou.cilacap', url: 'https://www.instagram.com/iseeyou.cilacap/', city: 'Cilacap', pic: 'Intan' },
        { name: 'Optik I See You Wonosobo', handle: '@iseeyou.wonosobo', url: 'https://www.instagram.com/iseeyou.wonosobo/', city: 'Wonosobo', pic: 'Febi' },
        { name: 'Lunar Eyewear Tegal (Second Brand)', handle: '@lunareyewear.co', url: 'https://www.instagram.com/lunareyewear.co', city: 'Tegal', pic: 'Amanda' },
      ],
      picTracker: picTracker,
      storyData: storyItems,
      branchReels: allBranchReels,
      dailyFollowersTracker: allFollowerDaily,
      spreadsheetFollowersByBranch: spreadsheetFollowersByBranch,
      bonusSummary: bonusSummary,
      databaseDesain: databaseDesain,
      formProposal: formProposal,
      formPengajuan: formPengajuan,
      executiveRecap: {
        meetingTarget: 'Rapat Evaluasi Mingguan (Selasa, 13 Oktober 2026)',
        liveFollowersByBranch: igLiveCache?.accounts || null,
        spreadsheetFollowersByBranch: spreadsheetFollowersByBranch,
        igLiveCache: igLiveCache || null,
        bonusSummary: bonusSummary,
        latestTotalNetworkFollowers: {
          instagram: totalNetworkIG,
          tiktok: totalNetworkTT,
        },
        periods: {
          cycle8: periodCycle8,
          cycle7: periodCycle7,
          cycle6: periodCycle6,
          cycle5: periodCycle5,
          // Backward-compatibility keys for existing UI components:
          currentMeeting: periodCycle8,
          lastTuesday: periodCycle7,
          nextTuesday: periodCycle6,
        },
        activePeriodKey: 'cycle8',
      },
    };

  fs.writeFileSync(
    path.join(__dirname, '../lib/real-sheets-data.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
  );

  console.log('Successfully updated lib/real-sheets-data.json with live Google Sheets data!');
  console.log('Total PICs:', picTracker.length);
  console.log('Story count:', storyItems.length);
  console.log('Database Desain count:', databaseDesain.length);
  console.log('Proposal count:', formProposal.length);
  console.log('Form Pengajuan count:', formPengajuan.length);
}

main().catch(console.error);
