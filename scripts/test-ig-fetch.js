const https = require('https');

const accounts = [
  { name: 'Pusat (PWT)', username: 'iseeyou.glasses', url: 'https://www.instagram.com/iseeyou.glasses/' },
  { name: 'Purbalingga', username: 'iseeyou.purbalingga', url: 'https://www.instagram.com/iseeyou.purbalingga/' },
  { name: 'Cilacap', username: 'iseeyou.cilacap', url: 'https://www.instagram.com/iseeyou.cilacap/' },
  { name: 'Wonosobo', username: 'iseeyou.wonosobo', url: 'https://www.instagram.com/iseeyou.wonosobo/' },
  { name: 'Lunar Tegal', username: 'lunareyewear.co', url: 'https://www.instagram.com/lunareyewear.co/' }
];

function fetchInstagram(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + (u.search || ''),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };

    https.get(options, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        // Look for description meta tag
        const descMatch = html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i);
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        
        // Parse followers if present in description
        // Format e.g. "1,234 Followers, 56 Following, 78 Posts - See Instagram photos and videos from ..."
        let followers = null;
        let following = null;
        let posts = null;
        if (descMatch && descMatch[1]) {
          const stats = descMatch[1].match(/([0-9.,KMkm]+)\s+Followers,\s+([0-9.,KMkm]+)\s+Following,\s+([0-9.,KMkm]+)\s+Posts/i);
          if (stats) {
            followers = stats[1];
            following = stats[2];
            posts = stats[3];
          }
        }

        resolve({
          statusCode: res.statusCode,
          title: titleMatch ? titleMatch[1] : null,
          ogDesc: descMatch ? descMatch[1] : null,
          followers,
          following,
          posts
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  for (const acc of accounts) {
    const res = await fetchInstagram(acc.url);
    console.log(`\n=== ${acc.name} (${acc.username}) ===`);
    console.log('Status:', res.statusCode);
    console.log('Followers:', res.followers, '| Following:', res.following, '| Posts:', res.posts);
    console.log('OG Desc:', res.ogDesc);
  }
}

run();
