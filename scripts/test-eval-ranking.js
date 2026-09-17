const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function parseDate(serial) {
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

const wb = XLSX.readFile(path.join(__dirname, '../google_sheets_data.xlsx'));
const branchConfigs = [
  { sheetName: 'Rekap PWT', picDefault: 'Mba Ilya', branchName: 'Purwokerto (Pusat)', city: 'Purwokerto', branchKey: 'PWT', isPWT: true },
  { sheetName: 'Rekap PBG', picDefault: 'Mba Ajun', branchName: 'Purbalingga', city: 'Purbalingga', branchKey: 'PBG' },
  { sheetName: 'Rekap TGL', picDefault: 'Mba Amanda', branchName: 'Lunar Eyewear Tegal (Second Brand)', city: 'Tegal', branchKey: 'TGL' },
  { sheetName: 'Rekap CLP', picDefault: 'Mba Arum', branchName: 'Cilacap', city: 'Cilacap', branchKey: 'CLP' },
  { sheetName: 'Rekap WNS', picDefault: 'Mba Febi', branchName: 'Wonosobo', city: 'Wonosobo', branchKey: 'WNS' },
];

const allEvaluations = [];

branchConfigs.forEach(cfg => {
  const sheet = wb.Sheets[cfg.sheetName];
  if (!sheet) return;
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // 1. Map uploads by date and title
  const uploadByDate = {};
  const uploadByTitle = {};

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    const date = parseDate(cfg.isPWT ? r[1] : r[9]);
    const title = String((cfg.isPWT ? r[4] : r[2]) || '').trim();
    const link = String((cfg.isPWT ? r[6] : r[4]) || '').trim();
    const pillar = String((cfg.isPWT ? r[5] : r[3]) || 'Umum').trim();
    const feedLink = String((cfg.isPWT ? r[7] : r[5]) || '').trim();
    const ttLink = String((cfg.isPWT ? r[10] : r[8]) || '').trim();

    const isLibur = !title || title === '-' || title.toLowerCase().includes('libur');
    if (!isLibur && link.startsWith('http')) {
      const info = { title, link, pillar, feedLink, ttLink, date };
      if (date) uploadByDate[date] = info;
      uploadByTitle[title.toLowerCase()] = info;
    }
  }

  // 2. Extract evaluations
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;

    const evalReportDate = parseDate(cfg.isPWT ? r[1] : r[9]);
    const pic = (cfg.isPWT ? r[2] : r[1]) || cfg.picDefault;
    const evalUploadDate = parseDate(cfg.isPWT ? r[14] : r[13]);
    let evalTitle = String((cfg.isPWT ? r[15] : r[14]) || '').trim();
    const evalViewers = cfg.isPWT ? r[16] : r[15];
    const evalLikes = cfg.isPWT ? r[17] : r[16];
    const bonus = String((cfg.isPWT ? r[18] : r[17]) || '-').trim();

    // Skip if libur or empty
    if (!evalTitle || evalTitle === '-' || evalTitle.toLowerCase() === 'libur') continue;
    const viewers = cleanMetric(evalViewers);
    const likes = cleanMetric(evalLikes);
    if (viewers === 0 && likes === 0) continue;

    // Match with upload
    let matchedUpload = uploadByDate[evalUploadDate];
    if (!matchedUpload) {
      matchedUpload = uploadByTitle[evalTitle.toLowerCase()];
    }
    if (!matchedUpload) {
      // Fuzzy title search
      const foundKey = Object.keys(uploadByTitle).find(k => k.includes(evalTitle.toLowerCase()) || evalTitle.toLowerCase().includes(k));
      if (foundKey) matchedUpload = uploadByTitle[foundKey];
    }

    const finalTitle = matchedUpload?.title || (evalTitle.startsWith('http') ? 'Konten Reels' : evalTitle);
    const finalLink = matchedUpload?.link || (evalTitle.startsWith('http') ? evalTitle : '');
    const finalPillar = matchedUpload?.pillar || 'Umum';
    const finalTiktok = matchedUpload?.ttLink || '';

    allEvaluations.push({
      branch: cfg.branchName,
      sheetKey: cfg.sheetName,
      city: cfg.city,
      pic,
      evalReportDate,
      uploadDate: evalUploadDate || matchedUpload?.date,
      title: finalTitle,
      secondTitle: evalTitle,
      pillar: finalPillar,
      viewers,
      likes,
      bonus,
      reelsLink: finalLink,
      tiktokLink: finalTiktok
    });
  }
});

// Filter by evaluation period 2026-09-08 to 2026-09-14
const periodEvals = allEvaluations.filter(e => e.evalReportDate >= '2026-09-08' && e.evalReportDate <= '2026-09-14');
periodEvals.sort((a, b) => b.viewers - a.viewers);

console.log('\n--- TOP 10 REELS EVALUATED IN PERIODE 8-14 SEP 2026 (H+3 EVALUATION) ---');
periodEvals.slice(0, 10).forEach((e, idx) => {
  console.log(`${idx + 1}. [${e.branch}] "${e.title}"`);
  console.log(`   Upload: ${e.uploadDate} | Eval H+3: ${e.evalReportDate} | Viewers: ${e.viewers.toLocaleString('id-ID')} | Likes: ${e.likes.toLocaleString('id-ID')}`);
  console.log(`   Link: ${e.reelsLink || 'NO LINK'}`);
});
