async function main() {
  const url = 'https://www.instagram.com/reel/DdQ5nYgKBCJ/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    }
  });
  const html = await res.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const desc = html.match(/<meta (?:property="og:description"|name="description") content="([^"]+)"/)?.[1];
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  console.log('Title:', title);
  console.log('Description:', desc);
  console.log('Image:', image ? image.slice(0, 80) : 'null');
}
main();
