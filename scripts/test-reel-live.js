const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
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
        const titleMatch = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];
        resolve({ title: titleMatch, desc: descMatch, htmlLength: html.length, html });
      });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function main() {
  const pbg = await checkUrl('https://www.instagram.com/iseeyou.purbalingga/');
  console.log('PBG Profile:');
  console.log('Title:', pbg.title);
  console.log('Description:', pbg.desc);

  const reel1 = await checkUrl('https://www.instagram.com/reel/DdQ5nYgKBCJ/');
  console.log('\nReel DdQ5nYgKBCJ (Produk mahal):');
  console.log('Desc:', reel1.desc);

  // Check other reel from Rekap PBG
  const reelPrev = await checkUrl('https://www.instagram.com/reel/DdOUTEPCNku/');
  console.log('\nReel DdOUTEPCNku (Aduh gimana nyak):');
  console.log('Desc:', reelPrev.desc);
}

main();
