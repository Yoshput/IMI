const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'www.instagram.com',
  path: '/reel/DdD9h3wzCxw/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};

https.get(options, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/reel-dump.html', html);
    console.log('Saved reel-dump.html', html.length);
    // Search for 131 or 128 or view
    const regex = /("video_play_count"|"play_count"|"view_count"|"views"):\s*([0-9]+)/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      console.log('Match:', match[0]);
    }
  });
});
