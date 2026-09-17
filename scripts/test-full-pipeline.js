const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function parseExcelDate(serial) {
  if (!serial) return null;
  if (typeof serial === 'string') {
    const parts = serial.trim().split(/[/\-\s]/);
    if (parts.length >= 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2].length === 2 ? '20' + parts[2] : parts[2];
      return `${y}-${m}-${d}`;
    }
    return serial;
  }
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const date_info = new Date(utc_days * 86400 * 1000);
    const y = date_info.getFullYear();
    const m = String(date_info.getMonth() + 1).padStart(2, '0');
    const d = String(date_info.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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

function cleanMetric(val) {
  if (val === null || val === undefined || val === '-' || val === '') return 0;
  if (typeof val === 'number') return Math.round(val);
  let str = String(val).toLowerCase().trim();
  if (str === 'libur' || str === 'tidak ada' || str === 'belum ada') return 0;
  if (str.includes('rb') || str.includes('k')) {
    const num = parseFloat(str.replace(/,/g, '.').replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : Math.round(num * 1000);
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

const wb = XLSX.readFile(path.join(__dirname, '../google_sheets_data.xlsx'));

const branchConfigs = [
  { sheetName: 'Rekap PWT', picDefault: 'Mba Ilya', branchName: 'Purwokerto (Pusat)', city: 'Purwokerto', branchKey: 'PWT', isKFollowers: true, isPWT: true },
  { sheetName: 'Rekap PBG', picDefault: 'Mba Ajun', branchName: 'Purbalingga', city: 'Purbalingga', branchKey: 'PBG', isKFollowers: false },
  { sheetName: 'Rekap TGL', picDefault: 'Mba Amanda', branchName: 'Lunar Eyewear Tegal (Second Brand)', city: 'Tegal', branchKey: 'TGL', isKFollowers: false },
  { sheetName: 'Rekap CLP', picDefault: 'Mba Arum', branchName: 'Cilacap', city: 'Cilacap', branchKey: 'CLP', isKFollowers: false },
  { sheetName: 'Rekap WNS', picDefault: 'Mba Febi', branchName: 'Wonosobo', city: 'Wonosobo', branchKey: 'WNS', isKFollowers: false },
];

const allBranchReels = {};
const allFollowerDaily = {};

branchConfigs.forEach(cfg => {
  const sheet = wb.Sheets[cfg.sheetName];
  if (!sheet) return;
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // 1. First pass: Collect all links by date, title, or url
  const linkByUploadDate = {};
  const linkByTitle = {};
  const titleToLinkMap = {};

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;
    const date = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
    const title = String((cfg.isPWT ? row[4] : row[2]) || '').trim();
    const link = String((cfg.isPWT ? row[6] : row[4]) || '').trim();
    const pillar = String((cfg.isPWT ? row[5] : row[3]) || 'Umum').trim();
    const feed = String((cfg.isPWT ? row[7] : row[5]) || '').trim();
    const threads = String((cfg.isPWT ? row[9] : row[7]) || '').trim();
    const tiktok = String((cfg.isPWT ? row[10] : row[8]) || '').trim();

    const isLibur = !title || title === '-' || title.toLowerCase().includes('libur');
    if (!isLibur && link.startsWith('http')) {
      const info = { title, link, pillar, feed, threads, tiktok, date };
      if (date) linkByUploadDate[date] = info;
      linkByTitle[title.toLowerCase()] = info;
      titleToLinkMap[title.toLowerCase()] = link;
    }
  }

  // 2. Second pass: Collect all evaluations (H+3)
  const evaluationsByDate = {};
  const evaluationsList = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;
    const evalReportDate = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
    const targetUploadDate = parseExcelDate(cfg.isPWT ? row[14] : row[13]);
    let evalTitle = String((cfg.isPWT ? row[15] : row[14]) || '').trim();
    const evalViewers = cfg.isPWT ? row[16] : row[15];
    const evalLikes = cfg.isPWT ? row[17] : row[16];
    const bonus = String((cfg.isPWT ? row[18] : row[17]) || '-').trim();

    const isLibur = !evalTitle || evalTitle === '-' || evalTitle.toLowerCase() === 'libur';
    const viewers = cleanMetric(evalViewers);
    const likes = cleanMetric(evalLikes);

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

  // 3. Third pass: Build parsedRows
  const parsedRows = [];
  const matchedEvalIndices = new Set();

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const reportDate = parseExcelDate(cfg.isPWT ? row[1] : row[9]);
    const pic = (cfg.isPWT ? row[2] : row[1]) || cfg.picDefault;
    const rawTitle = String((cfg.isPWT ? row[4] : row[2]) || '').trim();
    const pillar = String((cfg.isPWT ? row[5] : row[3]) || 'Umum').trim();
    let reelsLink = String((cfg.isPWT ? row[6] : row[4]) || '').trim();
    const feedLink = String((cfg.isPWT ? row[7] : row[5]) || '').trim();
    const threadsLink = String((cfg.isPWT ? row[9] : row[7]) || '').trim();
    const tiktokLink = String((cfg.isPWT ? row[10] : row[8]) || '').trim();
    const igFollowers = normalizeFollowers(cfg.isPWT ? row[11] : row[10], cfg.isKFollowers);
    const tiktokFollowers = normalizeFollowers(cfg.isPWT ? row[12] : row[11], cfg.isKFollowers);
    const obstacle = String((cfg.isPWT ? row[13] : row[12]) || '-').trim();

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
        obstacle: obstacle !== 'tidak ada' && obstacle !== 'belum ada' ? obstacle : '-',
        isDayOff: true,
        isEvaluated: false,
        evaluationCadence: 'Libur',
      });
      continue;
    }

    // This is an actual video upload!
    // Try to find its H+3 evaluation
    let matchedEval = null;
    const dateEvals = evaluationsByDate[reportDate];
    if (dateEvals && dateEvals.length > 0) {
      matchedEval = dateEvals[0];
    } else {
      // Find by title in evaluationsList
      matchedEval = evaluationsList.find(e => {
        if (!e.evalReportDate || !reportDate) return false;
        const daysDiff = Math.abs((new Date(e.evalReportDate).getTime() - new Date(reportDate).getTime()) / (1000 * 3600 * 24));
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
    if (!actualLink) {
      actualLink = titleToLinkMap[rawTitle.toLowerCase()] || '';
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
      feedLink: cleanLink(feedLink),
      threadsLink: cleanLink(threadsLink),
      tiktokLink: cleanLink(tiktokLink),
      igFollowers,
      tiktokFollowers,
      viewers: matchedEval ? matchedEval.viewers : 0,
      likes: matchedEval ? matchedEval.likes : 0,
      bonus: matchedEval ? matchedEval.bonus : '-',
      obstacle: obstacle !== 'tidak ada' && obstacle !== 'belum ada' ? obstacle : '-',
      isDayOff: false,
      isEvaluated: !!matchedEval,
      evaluationCadence: matchedEval ? 'H+3 Selesai' : 'Menunggu H+3',
    });
  }

  // 4. Also add any evaluations that were not matched to an upload
  evaluationsList.forEach((e, idx) => {
    if (!matchedEvalIndices.has(idx)) {
      // Unmatched evaluation (e.g. earlier upload outside the recorded table)
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

  // Sort parsedRows by reportDate descending
  parsedRows.sort((a, b) => (b.reportDate > a.reportDate ? 1 : -1));
  allBranchReels[cfg.sheetName] = parsedRows;

  // Follower tracker
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
    return {
      date: current.date,
      igFollowers: current.igFollowers,
      igDelta: prev ? current.igFollowers - prev.igFollowers : 0,
      tiktokFollowers: current.tiktokFollowers,
      ttDelta: prev ? current.tiktokFollowers - prev.tiktokFollowers : 0,
      reelsTitle: current.reelsTitle,
      viewers: current.viewers,
      likes: current.likes,
    };
  });
});

console.log('Branch Reels summary:');
Object.entries(allBranchReels).forEach(([sheet, list]) => {
  const dayOffs = list.filter(r => r.isDayOff).length;
  const withViewers = list.filter(r => r.viewers > 0).length;
  console.log(`- ${sheet}: ${list.length} total (${dayOffs} day offs, ${withViewers} evaluated with viewers > 0)`);
});

// Test period evaluation
const buildPeriodRecap = (startDate, endDate, meetingDateTitle, meetingStatus) => {
  const weeklyReels = [];
  Object.entries(allBranchReels).forEach(([sheet, rows]) => {
    rows.forEach((r) => {
      // Reel qualifies if its H+3 evaluation was in this period OR uploaded in this period with evaluation
      const evaluatedInPeriod = r.evalReportDate && r.evalReportDate >= startDate && r.evalReportDate <= endDate;
      const uploadedInPeriod = r.reportDate >= startDate && r.reportDate <= endDate;

      if (!r.isDayOff && (evaluatedInPeriod || uploadedInPeriod)) {
        weeklyReels.push({
          branch: r.branch,
          sheetKey: sheet,
          pic: r.pic,
          date: r.reportDate,
          uploadDate: r.uploadDate,
          evalReportDate: r.evalReportDate,
          title: r.reelsTitle,
          secondTitle: r.secondReelsTitle,
          pillar: r.contentPillar,
          viewers: r.viewers,
          sheetViewers: r.viewers,
          likes: r.likes,
          sheetLikes: r.likes,
          liveIgLikes: null,
          igLikesFormatted: null,
          igComments: undefined,
          igCaption: '',
          bonus: r.bonus,
          reelsLink: r.reelsLink,
          tiktokLink: r.tiktokLink,
          evaluationStatus: r.isEvaluated ? 'Evaluasi H+3 Selesai' : 'Menunggu Evaluasi H+3',
        });
      }
    });
  });

  // Deduplicate by reelsLink or title+branch
  const seen = new Set();
  const dedupedReels = [];
  weeklyReels.forEach(r => {
    const key = r.reelsLink || `${r.branch}_${r.title}_${r.uploadDate}`;
    if (!seen.has(key)) {
      seen.add(key);
      dedupedReels.push(r);
    }
  });

  dedupedReels.sort((a, b) => b.viewers - a.viewers);

  return {
    startDate,
    endDate,
    meetingDateTitle,
    meetingStatus,
    totalReelsUploaded: dedupedReels.filter(r => r.uploadDate >= startDate && r.uploadDate <= endDate).length,
    topViralReels: dedupedReels.slice(0, 8),
    allWeeklyReels: dedupedReels,
  };
};

const periodLastTuesday = buildPeriodRecap(
  '2026-09-08',
  '2026-09-14',
  'Selasa, 15 September 2026 (Periode 8–14 Sep)',
  'Sudah Berjalan / Evaluasi Resmi'
);

console.log('\n--- TOP VIRAL REELS (PERIODE 8-14 SEP 2026) ---');
periodLastTuesday.topViralReels.forEach((r, idx) => {
  console.log(`${idx + 1}. [${r.branch}] "${r.title}"`);
  console.log(`   Upload: ${r.uploadDate} | Eval H+3: ${r.evalReportDate || '-'} | Viewers: ${r.viewers.toLocaleString('id-ID')} | Likes: ${r.likes.toLocaleString('id-ID')}`);
  console.log(`   Link: ${r.reelsLink}`);
});
console.log(`\nTotal reels uploaded in period: ${periodLastTuesday.totalReelsUploaded}`);
