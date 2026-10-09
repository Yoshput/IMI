const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'lib/real-sheets-data.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const pwt = data.branchReels['Rekap PWT'];

// 1. Ensure DeSlPCPww is present
let des = pwt.find(r => (r.reelsLink||'').includes('DeSlPCPww'));
if (!des) {
  des = {
    id: 'rekap-pwt-deslpcpww',
    sheetKey: 'Rekap PWT',
    branch: 'Purwokerto (Pusat)',
    branchKey: 'PWT',
    city: 'Purwokerto',
    pic: 'Ilya',
    timestamp: '2026-10-08',
    reportDate: '2026-10-08',
    uploadDate: '2026-10-08',
    evalReportDate: null,
    reelsTitle: 'Bantuan Air Bersih di Purwokerto',
    contentPillar: 'Promosi & Event',
    reelsLink: 'https://www.instagram.com/reel/DeSlPCPww/',
    feedLink: '',
    threadsLink: '',
    tiktokLink: '',
    igFollowers: 226000,
    tiktokFollowers: 0,
    viewers: 15400,
    likes: 310,
    bonus: '-',
    obstacle: '-',
    isDayOff: false,
    isEvaluated: false,
    isLiveMetric: true,
    evaluationCadence: 'Menunggu H+3'
  };
  pwt.unshift(des);
}

// 2. Fix typos and update numbers on 11 reels
const updates = {
  'Dd83lSzyAkA': { viewers: 56400, likes: 1708, reelsTitle: 'Perbedaan : Minus, Silinder, Plus', uploadDate: '2026-09-30' },
  'Ddn_dUGv_bz': { viewers: 29500, likes: 620, reelsTitle: 'Pov : Ke Pasar Ngga bawa Kacamata', uploadDate: '2026-10-01' },
  'Dd_e47HpDgD': { viewers: 25861, likes: 807, reelsTitle: '"Ga takut di sakitin lagi?"', uploadDate: '2026-10-02' },
  'Dd32GTrvPiP': { viewers: 24100, likes: 865, reelsTitle: 'WARNA yang dibenci Penderita silinder', uploadDate: '2026-09-29' },
  'DeHu72dviE-': { viewers: 18700, likes: 382, reelsTitle: 'Nobar Pertandingan Sepak Bola FIFA', uploadDate: '2026-10-05' },
  'DeSlPCPww':   { viewers: 15400, likes: 310, reelsTitle: 'Bantuan Air Bersih di Purwokerto', uploadDate: '2026-10-08' },
  'DeCEyocv4Rg': { viewers: 15200, likes: 92, reelsTitle: 'Hancurin barang Pemberian MANTAN', uploadDate: '2026-10-04' },
  'Dd568UxzMr9': { viewers: 14100, likes: 438, reelsTitle: 'Harapan Mata Bisa Normal', uploadDate: '2026-09-30' },
  'Dd3ZJhqJK2A': { viewers: 11200, likes: 263, reelsTitle: 'Jauh-jauh liburan Ngga bawa kacamata', uploadDate: '2026-09-28' },
  'DeJ5LPGpWwJ': { viewers: 8138, likes: 195, reelsTitle: 'Pov : Nonton Bola Ga bawa Kacamata', uploadDate: '2026-10-06' },
  'Dd5e_xcT0MZ': { viewers: 7578, likes: 193, reelsTitle: 'Dikasih Kesempatan 1 kali liat di otak', uploadDate: '2026-09-29' }
};

pwt.forEach(r => {
  const link = r.reelsLink || '';
  for (const [code, meta] of Object.entries(updates)) {
    if (link.includes(code)) {
      r.viewers = meta.viewers;
      r.likes = meta.likes;
      r.reelsTitle = meta.reelsTitle;
      r.uploadDate = meta.uploadDate;
      r.reportDate = meta.uploadDate;
    }
  }
});

// Also make sure photo carousels in Rekap PWT have reelsLink = '' so they NEVER appear in /spreadsheet!
let carouselExcluded = 0;
pwt.forEach(r => {
  if (r.reelsLink && r.reelsLink.includes('/p/')) {
    if (!r.feedLink) r.feedLink = r.reelsLink;
    r.reelsLink = '';
    carouselExcluded++;
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated real-sheets-data.json! Carousels excluded from spreadsheet:', carouselExcluded);
