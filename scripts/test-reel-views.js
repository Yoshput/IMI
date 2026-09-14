const https = require('https');

const options = {
  hostname: 'www.instagram.com',
  path: '/reel/DdD9h3wzCxw/',
  headers: {
    'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Accept': '*/*'
  }
};

https.get(options, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('HTML length:', html.length);
    const viewMatches = html.match(/"(?:video_view_count|play_count|view_count)":\s*(\d+)/gi);
    console.log('View matches:', viewMatches);
    const scriptLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    console.log('JSON-LD count:', scriptLd ? scriptLd.length : 0);
    if (scriptLd) {
      scriptLd.forEach(s => console.log('LD:', s.slice(0, 300)));
    }
  });
});
