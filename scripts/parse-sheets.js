const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.readFile(path.join(__dirname, '../google_sheets_data.xlsx'));
console.log('Sheet Names in Workbook:', workbook.SheetNames);

const summary = {};

workbook.SheetNames.forEach((name) => {
  const sheet = workbook.Sheets[name];
  const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  if (json.length > 0) {
    summary[name] = {
      totalRows: json.length,
      headers: json[0],
      sampleRow: json[1] || [],
      lastRow: json[json.length - 1] || []
    };
  }
});

fs.writeFileSync(
  path.join(__dirname, '../sheets_summary.json'),
  JSON.stringify(summary, null, 2),
  'utf-8'
);

console.log('Summary written to sheets_summary.json');
