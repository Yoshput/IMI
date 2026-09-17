const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../lib/instagram-live-cache.json');
const cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));

// 1. Update DdQ1c06zshy (Mata minus - Lunar Eyewear Tegal / Amanda)
// User verified: 278K views, 13.1K likes, 78 comments
const url1 = 'https://www.instagram.com/reel/DdQ1c06zshy/';
cache.reels[url1] = {
  url: url1,
  likes: 13100,
  likesFormatted: '13.1K',
  viewers: 278000,
  viewersFormatted: '278K',
  comments: 78,
  caption: '13.1K likes, 78 comments - lunareyewear.co on September 14, 2026: "kalian minus/silinder ges?\n\nYuk order kacamata di Lunar Eyewear🤗❤️‍🔥\nOrder Online : 085258687315\nBuka setiap hari pukul : 11.00 - 20.00 WIB\n✅ Gratis cek mata\n✅ Bisa ditunggu 15 menit',
  lastUpdated: new Date().toISOString(),
};

// 2. Update DdQ5nYgKBCJ (Produk mahal - I See You Purbalingga / Ajun)
// User verified: 1219 views, 26 likes, 0 comments
const url2 = 'https://www.instagram.com/reel/DdQ5nYgKBCJ/';
cache.reels[url2] = {
  url: url2,
  likes: 26,
  likesFormatted: '26',
  viewers: 1219,
  viewersFormatted: '1.2K',
  comments: 0,
  caption: '26 likes, 0 comments - iseeyou.purbalingga on September 14, 2026: "diluar ekspektasi ☺️\n\nYUK! order kacamata di I See You Glasses ya🤩🥰\n✅Cek Mata Gratis \n✅Proses bisa di tunggu \n✅Banyak Promo Menarik \n✅Gratis Ongkir khusus area Jawa iTengah',
  lastUpdated: new Date().toISOString(),
};

cache.lastSync = new Date().toISOString();
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
console.log('✅ Updated instagram-live-cache.json successfully!');
console.log('DdQ1c06zshy:', cache.reels[url1].viewersFormatted, 'views,', cache.reels[url1].likesFormatted, 'likes');
console.log('DdQ5nYgKBCJ:', cache.reels[url2].viewers, 'views,', cache.reels[url2].likes, 'likes');
