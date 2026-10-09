const fs = require('fs');
const path = require('path');

const sheetsPath = path.join(__dirname, '..', 'lib', 'real-sheets-data.json');
const cachePath = path.join(__dirname, '..', 'lib', 'instagram-live-cache.json');

const sheetsData = JSON.parse(fs.readFileSync(sheetsPath, 'utf8'));
const liveCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

// 1. Update liveCache with exact data from live Instagram @iseeyou.glasses/reels/
const liveReelsData = [
  {
    code: "DeSlPCPww",
    url: "https://www.instagram.com/reel/DeSlPCPww/",
    title: "Bantuan Air Bersih di Purwokerto I See You",
    coverTitle: "Bantuan Air Bersih di Purwokerto",
    viewers: 15400,
    viewersFormatted: "15.4K",
    likes: 310,
    likesFormatted: "310",
    comments: 4,
    shares: 1,
    uploadDate: "2026-10-08",
    caption: "Bantuan Air Bersih di Purwokerto bersama Optik I See You Glasses. Membantu sesama dan menebarkan kebaikan.",
    category: "Promosi & Event",
  },
  {
    code: "DeJ5LPGpWwJ",
    url: "https://www.instagram.com/reel/DeJ5LPGpWwJ/",
    title: "POV : penderita mata minus+silinder nobar sepak bola gabawa kacamata",
    coverTitle: "Pov : Nonton Bola Ga bawa Kacamata",
    viewers: 8138,
    viewersFormatted: "8.1K",
    likes: 195,
    likesFormatted: "195",
    comments: 3,
    shares: 1,
    uploadDate: "2026-10-06",
    caption: "Pov : Nonton Bola Ga bawa Kacamata. Jangan sampai momen seru nobar terlewat gara-gara pandangan blur! Cek mata gratis di Optik I See You.",
    category: "Hiburan / Tren Viral",
  },
  {
    code: "DeHu72dviE-",
    url: "https://www.instagram.com/reel/DeHu72dviE-/",
    title: "Kemenangan Indonesia di FIFA ASEAN",
    coverTitle: "Nobar Pertandingan Sepak Bola FIFA",
    viewers: 18700,
    viewersFormatted: "18.7K",
    likes: 382,
    likesFormatted: "382",
    comments: 5,
    shares: 3,
    uploadDate: "2026-10-05",
    caption: "Nobar Pertandingan Sepak Bola FIFA! Serunya bareng tim Optik I See You Purwokerto.",
    category: "Hiburan / Tren Viral",
  },
  {
    code: "DeCEyocv4Rg",
    url: "https://www.instagram.com/reel/DeCEyocv4Rg/",
    title: "Pov : hancurin barang pemberian mantan",
    coverTitle: "Hancurin barang Pemberian MANTAN",
    viewers: 15200,
    viewersFormatted: "15.2K",
    likes: 92,
    likesFormatted: "92",
    comments: 3,
    shares: 1,
    uploadDate: "2026-10-04",
    caption: "janji ga balikann (kayanya). Cuma di I See You pembuatan kacamata bisa ditunggu mulai 15 menitan aja!",
    category: "Promosi / Soft Sell",
  },
  {
    code: "Ddn_dUGv_bz",
    url: "https://www.instagram.com/reel/Ddn_dUGv_bz/",
    title: "POV: cewek kalo keluar siang hari naik motor",
    coverTitle: "Pov : Ke Pasar Ngga bawa Kacamata",
    viewers: 29500,
    viewersFormatted: "29.5K",
    likes: 620,
    likesFormatted: "620",
    comments: 8,
    shares: 3,
    uploadDate: "2026-10-03",
    caption: "padahal cuma ke warung depan. Apalagi Purwokerto lagi panass beutttt, janlupaaa pakai sunglasses biar mata nyaman!",
    category: "Hiburan / Tren Viral",
  },
  {
    code: "Dd83lSzyAkA",
    url: "https://www.instagram.com/reel/Dd83lSzyAkA/",
    title: "perbedaan penglihatan mata minus, silinder dan minus+silinder",
    coverTitle: "Perbedaan : Minus, Silinder, Plus",
    viewers: 56400,
    viewersFormatted: "56.4K",
    likes: 1708,
    likesFormatted: "1.7K",
    comments: 17,
    shares: 4,
    uploadDate: "2026-09-30",
    caption: "double kill yang punya minus+silinder. Buat yang ngerasa ada kendala penglihatan cusss buruan ke Optik I See You Glasses!! - Free Cek mata",
    category: "Edukasi & Solusi Mata",
  },
  {
    code: "Dd568UxzMr9",
    url: "https://www.instagram.com/reel/Dd568UxzMr9/",
    title: "harapan mata normal pas hujan",
    coverTitle: "Harapan Mata Bisa Normal",
    viewers: 14100,
    viewersFormatted: "14.1K",
    likes: 438,
    likesFormatted: "438",
    comments: 4,
    shares: 2,
    uploadDate: "2026-09-29",
    caption: "Dahla pake insting aja naik mtrnya. Buat yang punya permasalahan sama mending kalian pake kacamata anti embun dan anti air di Optik I See You!",
    category: "Hiburan / Tren Viral",
  },
  {
    code: "Dd5e_xcT0MZ",
    url: "https://www.instagram.com/reel/Dd5e_xcT0MZ/",
    title: "Pov : Lagi ujian dikasih kesempatan inget tulisan 1 kali lihat",
    coverTitle: "Dikasih Kesempatan 1 kali liat di otak",
    viewers: 7578,
    viewersFormatted: "7.5K",
    likes: 193,
    likesFormatted: "193",
    comments: 2,
    shares: 1,
    uploadDate: "2026-09-29",
    caption: "SABARR WOII otak gw belom sempett screenshoot. mana ga balik lagi tu ingatannn :)",
    category: "Hiburan / Tren Viral",
  },
  {
    code: "Dd32GTrvPiP",
    url: "https://www.instagram.com/reel/Dd32GTrvPiP/",
    title: "warna yang di benci penderita mata minus dan silinder",
    coverTitle: "WARNA yang dibenci Penderita silinder",
    viewers: 24100,
    viewersFormatted: "24.1K",
    likes: 865,
    likesFormatted: "865",
    comments: 1,
    shares: 2,
    uploadDate: "2026-09-28",
    caption: "plsss ini silaww poll!!! Apalagi kalo yang pake lampu tembak, BEUHHHHH. Buat yang mau beli kacamata cuss ke Optik I See You!!",
    category: "Edukasi & Solusi Mata",
  },
  {
    code: "Dd3ZJhqJK2A",
    url: "https://www.instagram.com/reel/Dd3ZJhqJK2A/",
    title: "Jauh jauh liburan ga bawa kacamata",
    coverTitle: "Jauh-jauh liburan Ngga bawa kacamata",
    viewers: 11200,
    viewersFormatted: "11.2K",
    likes: 263,
    likesFormatted: "263",
    comments: 2,
    shares: 1,
    uploadDate: "2026-09-28",
    caption: "Jauh jauh liburan ga bawa kacamata. Momen liburan jadi burem semua!",
    category: "Social Experiment",
  },
  {
    code: "Dd_e47HpDgD",
    url: "https://www.instagram.com/reel/Dd_e47HpDgD/",
    title: "\"Ga takut di sakitin lagi?\"",
    coverTitle: "\"Ga takut di sakitin lagi?\"",
    viewers: 25861,
    viewersFormatted: "25.8K",
    likes: 807,
    likesFormatted: "807",
    comments: 6,
    shares: 2,
    uploadDate: "2026-10-02",
    caption: "Liat kimpul jd galundeng ini mahh. Buat yang punya keluhan mata cuss langsung cek mata di Optik I See You Glasses!",
    category: "Hiburan / Tren Viral",
  }
];

// Register into liveCache
liveReelsData.forEach(item => {
  const fullObj = {
    ...item,
    lastUpdated: new Date().toISOString()
  };
  liveCache.reels[item.url] = fullObj;
  liveCache.reels[item.code] = fullObj;
});

// Update official accounts in liveCache
liveCache.accounts.pwt.followers = 226000;
liveCache.accounts.pwt.followersFormatted = "226K";
liveCache.accounts.pwt.posts = 2946;
liveCache.lastSync = new Date().toISOString();

fs.writeFileSync(cachePath, JSON.stringify(liveCache, null, 2), 'utf8');
console.log('Successfully updated instagram-live-cache.json with 11 live reels!');

// 2. Fix branchReels in real-sheets-data.json
let pwtReelsSwapped = 0;
let pwtCarouselsSeparated = 0;

sheetsData.branchReels['Rekap PWT'] = sheetsData.branchReels['Rekap PWT'].map(r => {
  let reelsLink = (r.reelsLink || '').trim();
  let pillar = (r.contentPillar || '').trim();
  let feedLink = (r.feedLink || '').trim();

  // If reelsLink has /p/ and pillar has /reel/, swap them
  if (reelsLink.includes('/p/') && pillar.includes('/reel/')) {
    feedLink = reelsLink;
    reelsLink = pillar;
    pillar = r.reelsTitle || 'Hiburan / Tren Viral';
    pwtReelsSwapped++;
  } else if (reelsLink.includes('/p/') && !reelsLink.includes('/reel/')) {
    // Pure photo carousel: move to feedLink, clear reelsLink so it does NOT appear in /spreadsheet!
    feedLink = reelsLink;
    reelsLink = '';
    pwtCarouselsSeparated++;
  }

  // Also match live metrics for known reels
  const code = reelsLink.match(/\/(?:reel|tv)\/([A-Za-z0-9_-]+)/)?.[1];
  let viewers = Number(r.viewers || 0);
  let likes = Number(r.likes || 0);

  if (code) {
    const liveMatch = liveReelsData.find(lr => lr.code === code);
    if (liveMatch) {
      viewers = liveMatch.viewers;
      likes = liveMatch.likes;
      if (liveMatch.coverTitle && (!r.reelsTitle || r.reelsTitle === 'Edukasi' || r.reelsTitle === 'Hiburan / Tren Viral')) {
        r.reelsTitle = liveMatch.coverTitle;
      }
    }
  }

  return {
    ...r,
    reelsLink,
    feedLink,
    contentPillar: pillar.startsWith('http') ? 'Hiburan / Tren Viral' : pillar,
    viewers,
    likes
  };
});

// Update syncTimestamp
sheetsData.syncTimestamp = new Date().toISOString();
fs.writeFileSync(sheetsPath, JSON.stringify(sheetsData, null, 2), 'utf8');
console.log(`Successfully updated real-sheets-data.json! Swapped: ${pwtReelsSwapped}, Carousels separated: ${pwtCarouselsSeparated}`);
