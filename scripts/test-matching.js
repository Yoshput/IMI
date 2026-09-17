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

branchConfigs.forEach(cfg => {
  console.log('====================================');
  console.log(cfg.sheetName, cfg.branchName);
  const sheet = wb.Sheets[cfg.sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  // Collect all uploads
  const uploads = [];
  // Collect all evaluations
  const evaluations = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    
    // Parse upload record
    const reportDate = parseDate(cfg.isPWT ? r[1] : r[9]);
    const pic = (cfg.isPWT ? r[2] : r[1]) || cfg.picDefault;
    const title = String(cfg.isPWT ? r[4] : r[2] || '').trim();
    const pillar = String(cfg.isPWT ? r[5] : r[3] || 'Umum').trim();
    const reelsLink = String(cfg.isPWT ? r[6] : r[4] || '').trim();
    const feedLink = String(cfg.isPWT ? r[7] : r[5] || '').trim();
    const storyStatus = String(cfg.isPWT ? r[8] : r[6] || '').trim();
    const threadsLink = String(cfg.isPWT ? r[9] : r[7] || '').trim();
    const tiktokLink = String(cfg.isPWT ? r[10] : r[8] || '').trim();
    const igFollowers = cfg.isPWT ? r[11] : r[10];
    const tiktokFollowers = cfg.isPWT ? r[12] : r[11];
    const obstacle = String(cfg.isPWT ? r[13] : r[12] || '-').trim();

    // Check if upload is a valid video (not libur, not empty)
    const isLiburUpload = !title || title === '-' || title.toLowerCase().includes('libur');
    if (!isLiburUpload && reelsLink && reelsLink.startsWith('http')) {
      uploads.push({
        rowIdx: i + 1,
        uploadDate: reportDate,
        pic,
        title,
        pillar,
        reelsLink,
        feedLink,
        threadsLink,
        tiktokLink,
        igFollowers,
        tiktokFollowers,
        obstacle
      });
    }

    // Parse evaluation record (H+3)
    const evalUploadDate = parseDate(cfg.isPWT ? r[14] : r[13]);
    const evalTitle = String(cfg.isPWT ? r[15] : r[14] || '').trim();
    const evalViewers = cfg.isPWT ? r[16] : r[15];
    const evalLikes = cfg.isPWT ? r[17] : r[16];
    const bonus = String((cfg.isPWT ? r[18] : r[17]) || '-').trim();

    const isLiburEval = !evalTitle || evalTitle === '-' || evalTitle.toLowerCase() === 'libur';
    const viewersNum = cleanMetric(evalViewers);
    const likesNum = cleanMetric(evalLikes);

    if (evalUploadDate && !isLiburEval && (viewersNum > 0 || likesNum > 0 || evalTitle.length > 2)) {
      evaluations.push({
        rowIdx: i + 1,
        evalReportDate: reportDate,
        evalUploadDate,
        evalTitle,
        viewers: viewersNum,
        likes: likesNum,
        bonus
      });
    }
  }

  console.log(`Uploads count: ${uploads.length}, Evaluations count: ${evaluations.length}`);
  
  // Check matching between uploads and evaluations
  let matched = 0;
  uploads.forEach(up => {
    // Find evaluation by matching evalUploadDate == up.uploadDate or title similarity
    const match = evaluations.find(ev => 
      ev.evalUploadDate === up.uploadDate ||
      (ev.evalTitle && up.title && (ev.evalTitle.toLowerCase().includes(up.title.toLowerCase()) || up.title.toLowerCase().includes(ev.evalTitle.toLowerCase())))
    );
    if (match) {
      matched++;
      up.evaluation = match;
    }
  });

  console.log(`Matched: ${matched} / ${uploads.length}`);

  // Show recent matches (from 2026-09-01)
  const recent = uploads.filter(u => u.uploadDate >= '2026-09-01');
  console.log(`Recent uploads (>= 2026-09-01): ${recent.length}`);
  recent.forEach(u => {
    console.log(`  - [${u.uploadDate}] "${u.title}" | Eval H+3: ${u.evaluation ? `${u.evaluation.viewers} viewers, ${u.evaluation.likes} likes (evaluated on ${u.evaluation.evalReportDate})` : 'BELUM DIEVALUASI (H+3)'} | Link: ${u.reelsLink.substring(0, 35)}`);
  });
});
