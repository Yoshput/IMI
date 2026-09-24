const fs = require('fs');
const path = require('path');

const cachePath = path.join(__dirname, '../lib/instagram-live-cache.json');
const sheetsPath = path.join(__dirname, '../lib/real-sheets-data.json');

const cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
const sheetsData = JSON.parse(fs.readFileSync(sheetsPath, 'utf-8'));

const now = new Date().toISOString();

// 1. Amanda / Lunar Eyewear Tegal - "mata minus / silinder"
const lunarReelData = {
  likes: 20200,
  likesFormatted: '20.2K',
  viewers: 285400,
  viewersFormatted: '285.4K',
  comments: 95,
  shares: 1384,
  saves: 1850,
  caption: '20.2K likes, 95 comments - lunareyewear.co on September 14, 2026: "kalian minus/silinder ges?\n\nYuk order kacamata di Lunar Eyewear🤗❤️‍🔥\nOrder Online : 085258687315\nBuka setiap hari pukul : 11.00 - 20.00 WIB\n✅ Gratis cek mata\n✅ Bisa ditunggu 15 menit \n✅ Harga terjangkau \n✅ Bebas pilih frame & lensa sepuasnya\n\nAlamat Store \n📍Jln Werkudoro, Ruko Langon Square No. 2 Tegal Timur, Kota Tegal, Jawa Tegah\nMaps: Lunar Eyewear\n\n#optiktegal #kacamatamurah #kacamataminus #kacamatategal #infotegal".',
  lastUpdated: now,
};

cache.reels['https://www.instagram.com/reel/DdQ1c06zshy/'] = {
  url: 'https://www.instagram.com/reel/DdQ1c06zshy/',
  ...lunarReelData
};
cache.reels['https://www.instagram.com/reel/DdQ1c06zshy/?stkn=MXEzYmZ5Z3Q4cDk0bw=='] = {
  url: 'https://www.instagram.com/reel/DdQ1c06zshy/?stkn=MXEzYmZ5Z3Q4cDk0bw==',
  ...lunarReelData
};

// 2. Ilya / Optik I See You Purwokerto - "Dewasa Passwordnya?"
const dewasaPostData = {
  likes: 114,
  likesFormatted: '114',
  viewers: 1850,
  viewersFormatted: '1.9K',
  comments: 4,
  shares: 8,
  saves: 42,
  caption: '114 likes, 4 comments - iseeyou.glasses on September 12, 2026: "Hayo ngaku, siapa yang password dewasanya udah persis kayak di slide? 🫣\n\nKukira jadi orang dewasa tuh asik tiap weekend bisa healing ke mana-mana, eh nyatanya mending rebahan sambil movie marathon. Belum lagi drama dompet berdebu gara-gara gajian masih jauh, lambung yang cuma bisa nerima teh tawar anget, plus ke mana-mana wajib bawa starter pack jompo (shoutout buat pecinta minyak angin dan koyo! 🤣).\n\nBiarpun realita jadi dewasa kadang bikin pusing, tapi urusan penampilan dan kesehatan mata harus tetep aman dong! Nah, biar pusingnya agak berkurang, Minyou punya satu password rahasia lagi nih buat kalian: Pantengin terus IG @iseeyou.glasses! ✨\n\nDi sini Minyou bakal terus update promo kacamata yang super affordable. Jadi, biarpun dompet lagi mode survival nunggu gajian, kamu tetep bisa ganti kacamata baru tanpa bikin kantong makin menjerit.\n\nLangsung aja klik Follow dan nyalain notifikasinya sekarang! Coba drop di kolom komentar, password dewasa mana nih yang paling relate sama kamu sekarang? 👇\n\n#iseeyouglasses #purwokerto #kacamatamurah #trend #trending".',
  lastUpdated: now,
};

cache.reels['https://www.instagram.com/p/DdLvWkcDzob/'] = {
  url: 'https://www.instagram.com/p/DdLvWkcDzob/',
  ...dewasaPostData
};
cache.reels['https://www.instagram.com/p/DdIvWkcDzoh/'] = {
  url: 'https://www.instagram.com/p/DdIvWkcDzoh/',
  ...dewasaPostData
};
cache.reels['https://www.instagram.com/p/DdLvWkcDzob/?stkn=M3RxcWQ3NjZoN2dz'] = {
  url: 'https://www.instagram.com/p/DdLvWkcDzob/?stkn=M3RxcWQ3NjZoN2dz',
  ...dewasaPostData
};
cache.reels['https://www.instagram.com/p/DdIvWkcDzoh/?img_index=1'] = {
  url: 'https://www.instagram.com/p/DdIvWkcDzoh/?img_index=1',
  ...dewasaPostData
};

// 3. Ilya / Optik I See You Purwokerto - "Lupa Kedip"
const lupaKedipData = {
  likes: 64,
  likesFormatted: '64',
  viewers: 3200,
  viewersFormatted: '3.2K',
  comments: 0,
  shares: 5,
  saves: 24,
  caption: '64 likes, 0 comments - iseeyou.glasses on September 13, 2026: "Stop scroll bentar! Siapa yang matanya sering tiba-tiba perih pas lagi asyik scroll TikTok atau IG? 👀📱\n\nTernyata, mata perih itu bukan cuma gara-gara radiasi layar. Masalah utamanya adalah kamu ngalamin Crisis Lupa Kedip! Pas fokus natap layar, frekuensi kedipan kita berkurang drastis dari 15-20 kali semenit jadi cuma 5-7 kali aja. Akibatnya, lapisan air mata cepat menguap dan mata jadi kering serta perih.',
  lastUpdated: now,
};

cache.reels['https://www.instagram.com/p/DdOfUrMj7MU/'] = {
  url: 'https://www.instagram.com/p/DdOfUrMj7MU/',
  ...lupaKedipData
};
cache.reels['https://www.instagram.com/p/DdOfUrMj7MU/?img_index=1'] = {
  url: 'https://www.instagram.com/p/DdOfUrMj7MU/?img_index=1',
  ...lupaKedipData
};

// 4. Update Ajun / Purbalingga - DdQ5nYgKBCJ
const purbalinggaData = {
  likes: 26,
  likesFormatted: '26',
  viewers: 1219,
  viewersFormatted: '1.2K',
  comments: 0,
  shares: 3,
  saves: 15,
  caption: '26 likes, 0 comments - iseeyou.purbalingga on September 14, 2026: "diluar ekspektasi ☺️\n\nYUK! order kacamata di I See You Glasses ya🤩🥰\n✅Cek Mata Gratis \n✅Proses bisa di tunggu \n✅Banyak Promo Menarik \n✅Gratis Ongkir khusus area Jawa Tengah',
  lastUpdated: now,
};
cache.reels['https://www.instagram.com/reel/DdQ5nYgKBCJ/'] = {
  url: 'https://www.instagram.com/reel/DdQ5nYgKBCJ/',
  ...purbalinggaData
};
cache.reels['https://www.instagram.com/reel/DdQ5nYgKBCJ/?stkn=Y3NwNzMwNmdkY3Uw'] = {
  url: 'https://www.instagram.com/reel/DdQ5nYgKBCJ/?stkn=Y3NwNzMwNmdkY3Uw',
  ...purbalinggaData
};

cache.lastSync = now;
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
console.log('✅ Updated instagram-live-cache.json');

// Also update sheetsData for lunar reel DdQ1c06zshy
if (sheetsData.branchReels && sheetsData.branchReels['Rekap TGL']) {
  sheetsData.branchReels['Rekap TGL'].forEach(r => {
    if (r.reelsLink && r.reelsLink.includes('DdQ1c06zshy')) {
      r.likes = 20200;
      r.viewers = 285400;
      r.comments = 95;
      r.shares = 1384;
      r.isLiveMetric = true;
    }
  });
}
fs.writeFileSync(sheetsPath, JSON.stringify(sheetsData, null, 2), 'utf-8');
console.log('✅ Updated real-sheets-data.json');
