const https = require('https');

function testBot(userAgent) {
  return new Promise(resolve => {
    const options = {
      hostname: 'www.instagram.com',
      path: '/lunareyewear.co/',
      headers: {
        'User-Agent': userAgent,
        'Accept': '*/*'
      }
    };

    https.get(options, (res) => {
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const desc = (html.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i) || [])[1];
        const title = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];
        resolve({ userAgent, statusCode: res.statusCode, desc, title, len: html.length });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function main() {
  const bots = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'WhatsApp/2.21.12.21 A',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Twitterbot/1.0'
  ];

  for (const b of bots) {
    const res = await testBot(b);
    console.log('\nUA:', b.slice(0, 30));
    console.log('Status:', res.statusCode);
    console.log('Desc:', res.desc);
    console.log('Title:', res.title);
  }
}

main();
