const https = require('https');

const accounts = [
  { name: 'Optik I See You Purwokerto (Pusat)', username: 'iseeyou.glasses', url: 'https://www.instagram.com/iseeyou.glasses/' },
  { name: 'Optik I See You Purbalingga', username: 'iseeyou.purbalingga', url: 'https://www.instagram.com/iseeyou.purbalingga/' },
  { name: 'Optik I See You Cilacap', username: 'iseeyou.cilacap', url: 'https://www.instagram.com/iseeyou.cilacap/' },
  { name: 'Optik I See You Wonosobo', username: 'iseeyou.wonosobo', url: 'https://www.instagram.com/iseeyou.wonosobo/' },
  { name: 'Lunar Eyewear Tegal (Second Brand)', username: 'lunareyewear.co', url: 'https://www.instagram.com/lunareyewear.co/' }
];

function fetchIgProfile(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
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
        const titleMatch = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];
        
        let followers = null;
        let following = null;
        let posts = null;

        if (descMatch) {
          // Format: "3,943 Followers, 5 Following, 357 Posts..."
          const m = descMatch.match(/([0-9.,KMkm]+)\s+Followers,\s+([0-9.,KMkm]+)\s+Following,\s+([0-9.,KMkm]+)\s+Posts/i);
          if (m) {
            followers = m[1];
            following = m[2];
            posts = m[3];
          }
        }

        resolve({
          statusCode: res.statusCode,
          followers,
          following,
          posts,
          rawDesc: descMatch,
          title: titleMatch
        });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function run() {
  for (const acc of accounts) {
    const res = await fetchIgProfile(acc.url);
    console.log(`\n=== ${acc.name} (@${acc.username}) ===`);
    console.log(`Status: ${res.statusCode} | Followers: ${res.followers} | Following: ${res.following} | Posts: ${res.posts}`);
    console.log(`Desc: ${res.rawDesc}`);
  }
}

run();
