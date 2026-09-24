const https = require('https');

async function check(url) {
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
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const descMatch = body.match(/<meta\s+(?:property|name)=["'](?:og:description|description)["']\s+content=["']([^"']*)["']/i);
        resolve({ url, desc: descMatch ? descMatch[1] : null, bodyLen: body.length });
      });
    }).on('error', e => resolve({ url, error: e.message }));
  });
}

async function run() {
  const r1 = await check('https://www.instagram.com/reel/DdQ5nYgKBCJ/');
  console.log('DdQ5nYgKBCJ:', r1);

  const r2 = await check('https://www.instagram.com/reel/DdQ1c06zshy/');
  console.log('DdQ1c06zshy:', r2);

  const r3 = await check('https://www.instagram.com/p/DdIvWkcDzoh/');
  console.log('DdIvWkcDzoh:', r3);

  const r4 = await check('https://www.instagram.com/p/DdLvWkcDzob/');
  console.log('DdLvWkcDzob:', r4);
}

run();
