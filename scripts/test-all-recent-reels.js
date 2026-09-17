const https = require('https');

async function getReelMeta(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const options = {
        hostname: u.hostname,
        path: u.pathname,
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': '*/*',
        }
      };
      https.get(options, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
          const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
          let likes = 0;
          let comments = 0;
          if (descMatch) {
            const m = descMatch.match(/([0-9.,KMkm]+)\s+likes,\s+([0-9.,KMkm]+)\s+comments/i);
            if (m) {
              const lStr = m[1].replace(/,/g, '').trim().toUpperCase();
              likes = lStr.endsWith('K') ? Math.round(parseFloat(lStr) * 1000) : parseInt(lStr, 10) || 0;
              const cStr = m[2].replace(/,/g, '').trim().toUpperCase();
              comments = cStr.endsWith('K') ? Math.round(parseFloat(cStr) * 1000) : parseInt(cStr, 10) || 0;
            }
          }
          resolve({ url, likes, comments, rawDesc: descMatch });
        });
      }).on('error', (e) => resolve({ url, likes: 0, comments: 0, error: e.message }));
    } catch (err) {
      resolve({ url, likes: 0, comments: 0, error: err.message });
    }
  });
}

async function main() {
  const urls = [
    'https://www.instagram.com/reel/DdQ5nYgKBCJ/',
    'https://www.instagram.com/reel/DdOSPwpRkG2/',
    'https://www.instagram.com/reel/DdLu3AZspl0/',
    'https://www.instagram.com/p/DdLvWkcDzob/',
    'https://www.instagram.com/p/DdOfUrMj7MU/',
    'https://www.instagram.com/reel/DdOUTEPCNku/',
  ];

  for (const u of urls) {
    const res = await getReelMeta(u);
    console.log(u);
    console.log('Likes:', res.likes, 'Comments:', res.comments, 'Raw:', res.rawDesc ? res.rawDesc.slice(0, 100) : 'none');
    console.log('---');
  }
}

main();
