const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.instagram.com',
  path: '/lunareyewear.co/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    fs.writeFileSync('scripts/profile-dump.html', html);
    console.log('Dumped', html.length, 'bytes');
    const metas = html.match(/<meta[^>]+>/gi) || [];
    console.log('Metas found:', metas.length);
    metas.forEach(m => console.log('Meta:', m));
  });
});
