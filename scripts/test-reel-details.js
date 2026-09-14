const https = require('https');

function fetchReelDetails(reelUrl) {
  return new Promise((resolve) => {
    if (!reelUrl || !reelUrl.startsWith('http')) return resolve(null);
    const u = new URL(reelUrl);
    const options = {
      hostname: u.hostname,
      path: u.pathname,
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': '*/*'
      }
    };

    https.get(options, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const descMatch = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
        const titleMatch = (html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']*)["']/i) || [])[1];
        
        let likes = null;
        let comments = null;
        let caption = null;

        if (descMatch) {
          // Format: "10K likes, 86 comments - lunareyewear.co on September 9, 2026: \"pengen normal lagi...\""
          const m = descMatch.match(/([0-9.,KMkm]+)\s+likes,\s+([0-9.,KMkm]+)\s+comments\s*-\s*([^\s:]+)\s+on\s+([^:]+):\s*["']?([\s\S]*?)["']?\.?$/i);
          if (m) {
            likes = m[1];
            comments = m[2];
            caption = m[5] ? m[5].replace(/&quot;/g, '"').replace(/&#x1f62d;/g, '😭').trim() : '';
          } else {
            caption = descMatch.replace(/&quot;/g, '"');
          }
        }

        resolve({
          statusCode: res.statusCode,
          likes,
          comments,
          caption: caption || descMatch || '',
          title: titleMatch
        });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function run() {
  const testUrls = [
    'https://www.instagram.com/reel/DdD9h3wzCxw/',
    'https://www.instagram.com/reel/DdGiT0OzQ_7/'
  ];

  for (const url of testUrls) {
    const res = await fetchReelDetails(url);
    console.log('\n=== Reel:', url, '===');
    console.log('Status:', res.statusCode);
    console.log('Likes:', res.likes, '| Comments:', res.comments);
    console.log('Caption Preview:', res.caption ? res.caption.slice(0, 150) + '...' : 'none');
  }
}

run();
