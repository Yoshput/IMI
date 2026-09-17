const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lib/real-sheets-data.json', 'utf8'));
const top = data.executiveRecap.periods.lastTuesday.topViralReels;
console.log('Top Reels Count:', top.length);
top.forEach((r, i) => {
  console.log(`${i + 1}. [${r.branch}] "${r.title}"`);
  console.log(`   Upload: ${r.uploadDate || r.date} | Eval H+3: ${r.evalReportDate} | Viewers: ${r.viewers.toLocaleString('id-ID')} | Likes: ${r.likes.toLocaleString('id-ID')}`);
  console.log(`   Link: ${r.reelsLink || 'NO LINK'}`);
});
