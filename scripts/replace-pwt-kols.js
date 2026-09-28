const fs = require('fs');
const path = require('path');

const kolFilePath = path.join(__dirname, '..', 'lib', 'kol-data.json');
const kols = JSON.parse(fs.readFileSync(kolFilePath, 'utf8'));

// Filter out old Purwokerto items
const nonPwt = kols.filter(k => k.branchId !== 'pwt');

const newPwt = [
  {
    "id": "kol-pwt-1",
    "branchId": "pwt",
    "branchName": "Purwokerto",
    "brand": "Optik I See You",
    "name": "Risma Anjani",
    "handle": "rismaanjani_",
    "platform": "Instagram & TikTok",
    "profileImg": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "instagramUrl": "https://www.instagram.com/rismaanjani_/",
    "socialBladeUrl": "https://socialblade.com/instagram/user/rismaanjani_",
    "socialBladeGrade": "B+",
    "followers": 24500,
    "followersFormatted": "24.5K",
    "engagementRate": 8.2,
    "niche": "Viral Local Lifestyle, Reels Creator & Daily Vlogger",
    "audienceFit": "Masyarakat Muda Purwokerto & Sekitarnya (Views Reels Sedang Viral & Meledak Naik)",
    "rateCard": {
      "story": "Rp 150.000 - Rp 250.000",
      "reels": "Rp 450.000 - Rp 700.000",
      "feeds": "Rp 300.000",
      "visitStore": "Rp 800.000 - Rp 1.100.000",
      "bundled": "Rp 1.200.000 (Visit + 1 Reels + 2 Story + Raw Video)"
    },
    "benefits": [
      "Views Reels organik sedang sangat tinggi (viral di Banyumas Raya)",
      "1x Instagram Reels Try-on Kacamata Gaya Gaul Purwokerto",
      "2x Instagram Story (1x Suasana Toko ISY + 1x Kuis Tebak Frame)",
      "Bisa giveaway voucher belanja kacamata untuk followers di kolom komentar"
    ],
    "owningRights": {
      "canOwnRaw": true,
      "terms": "Video mentahan (Raw Footage 4K/60fps) diserahkan via Google Drive tanpa watermark",
      "extraFeeEstimate": "Free include dalam paket visit / barter",
      "adsUsageDays": 60,
      "statusNote": "Bisa Owning. Karakter video humble & views yang sedang naik sangat ampuh untuk hook iklan Meta Ads."
    },
    "status": "Rekomendasi Utama",
    "notes": "Kreator lokal Purwokerto yang sedang viral dan disukai warga. Engagement sangat tinggi, rate card bersahabat, belum pernah kolab dengan ISY.",
    "contactWa": "0812-2890-xxxx",
    "pitchTemplate": "Hai kak Risma.. ✨👋\n\nPerkenalkan saya Yossika dari tim Marketing Optik I See You Glasses 👓\nSetelah melihat Social Media kaka yang seru dan kece banget, kami tertarik banget untuk mengajak kerja sama atau berkolaborasi dengan kita optik i see youu 🥰\n\nKalo boleh tau, boleh di infokan untuk ratecardnyaa, sebagai bahan pertimbangan kami?\n\nTerimakasih ditunggu kabar baiknya ya ka 🙏\nHave a nicee dayy ya kaa! 🌸✨",
    "barterStrategy": {
      "standardFee": "Rp 250.000",
      "barterOption": "Barter Full Produk Kacamata (Frame + Lensa Kustom Pilihan Talent)",
      "followerVoucher": "Voucher Diskon Belanja Followers (Bahan Kuis Komentar)",
      "recommendedApproach": "Tahap 1: Tanya ratecard dulu. Tahap 2: Tawarkan Barter Produk + Voucher Giveaway Komen / Fee Rp 250rb."
    }
  },
  {
    "id": "kol-pwt-2",
    "branchId": "pwt",
    "branchName": "Purwokerto",
    "brand": "Optik I See You",
    "name": "Maria Reres",
    "handle": "maria.reres",
    "platform": "Instagram & TikTok",
    "profileImg": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    "instagramUrl": "https://www.instagram.com/maria.reres/",
    "socialBladeUrl": "https://socialblade.com/instagram/user/maria.reres",
    "socialBladeGrade": "B",
    "followers": 22300,
    "followersFormatted": "22.3K",
    "engagementRate": 6.4,
    "niche": "Fashion OOTD, Hijab Chic & Aesthetic Try-On",
    "audienceFit": "Perempuan Muda & Hijabers Estetik Purwokerto (Pasar Utama Kacamata Modis)",
    "rateCard": {
      "story": "Rp 150.000 - Rp 250.000",
      "reels": "Rp 500.000 - Rp 750.000",
      "feeds": "Rp 350.000",
      "visitStore": "Rp 900.000 - Rp 1.200.000",
      "bundled": "Rp 1.300.000 (Paket Lengkap Visit + Reels + Raw Video Ads)"
    },
    "benefits": [
      "Visual feed sangat rapi dan estetik, tone warna selaras dengan branding Optik I See You",
      "1x Instagram Reels Mix and Match Hijab Outfit dengan 3 Frame Best Seller ISY",
      "2x Instagram Story review detail nosepad ramah hijab",
      "Penempatan link WhatsApp di bio saat masa tayang awal"
    ],
    "owningRights": {
      "canOwnRaw": true,
      "terms": "File mentahan portrait 9:16 diserahkan via Google Drive",
      "extraFeeEstimate": "+Rp 150.000 / barter kacamata kedua",
      "adsUsageDays": 60,
      "statusNote": "Bisa Owning. Tone warna aesthetic sangat ramah algoritma Instagram Ads."
    },
    "status": "Rekomendasi Utama",
    "notes": "Micro-influencer dengan visual clean dan engagement aktif. Rate card tidak mahal, sangat terbuka untuk opsi barter produk kacamata komplit.",
    "contactWa": "0813-9120-xxxx",
    "pitchTemplate": "Hai kak Maria.. ✨👋\n\nPerkenalkan saya Yossika dari tim Marketing Optik I See You Glasses 👓\nSetelah melihat Social Media kaka yang seru dan kece banget, kami tertarik banget untuk mengajak kerja sama atau berkolaborasi dengan kita optik i see youu 🥰\n\nKalo boleh tau, boleh di infokan untuk ratecardnyaa, sebagai bahan pertimbangan kami?\n\nTerimakasih ditunggu kabar baiknya ya ka 🙏\nHave a nicee dayy ya kaa! 🌸✨",
    "barterStrategy": {
      "standardFee": "Rp 250.000",
      "barterOption": "Barter Full Produk Kacamata (Frame + Lensa Kustom Pilihan Talent)",
      "followerVoucher": "Voucher Diskon Belanja Followers (Bahan Kuis Komentar)",
      "recommendedApproach": "Tahap 1: Tanya ratecard dulu. Tahap 2: Tawarkan Barter Produk + Voucher Giveaway Komen / Fee Rp 250rb."
    }
  },
  {
    "id": "kol-pwt-3",
    "branchId": "pwt",
    "branchName": "Purwokerto",
    "brand": "Optik I See You",
    "name": "Alfinda Putri Amungkasi",
    "handle": "alfindaptr",
    "platform": "Instagram & TikTok",
    "profileImg": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "instagramUrl": "https://www.instagram.com/alfindaptr/",
    "socialBladeUrl": "https://socialblade.com/instagram/user/alfindaptr",
    "socialBladeGrade": "B",
    "followers": 18700,
    "followersFormatted": "18.7K",
    "engagementRate": 6.9,
    "niche": "Campus Student Life, Casual Beauty & Vlogger Mahasiswi",
    "audienceFit": "Mahasiswa Gen-Z Unsoed, UMP, Amikom & Telkom Purwokerto (Pasar Kampus)",
    "rateCard": {
      "story": "Rp 125.000 - Rp 200.000",
      "reels": "Rp 400.000 - Rp 650.000",
      "feeds": "Rp 300.000",
      "visitStore": "Rp 750.000 - Rp 1.000.000",
      "bundled": "Rp 1.100.000 (Paket Ekonomis Visit + Reels + Raw Video)"
    },
    "benefits": [
      "1x Instagram Reels Review Kacamata Kuliah Anti Radiasi Laptop / Gadget",
      "2x Instagram Story ajakan periksa mata gratis di Cabang Purwokerto",
      "Interaksi tinggi di kalangan sesama mahasiswa Unsoed & Banyumas",
      "Sangat cocok untuk kuis giveaway voucher belanja kacamata di kolom komen"
    ],
    "owningRights": {
      "canOwnRaw": true,
      "terms": "Menyerahkan raw video mentahan tanpa teks/watermark",
      "extraFeeEstimate": "Free include paket",
      "adsUsageDays": 90,
      "statusNote": "Bisa Owning. Biaya ekonomis, durasi lisensi iklan panjang (90 hari)."
    },
    "status": "Opsi Alternatif",
    "notes": "Representasi ideal mahasiswa Purwokerto. Biaya sangat terjangkau, view reels sedang naik, dan sangat antusias dengan skema barter produk kacamata.",
    "contactWa": "0857-4100-xxxx",
    "pitchTemplate": "Hai kak Alfinda.. ✨👋\n\nPerkenalkan saya Yossika dari tim Marketing Optik I See You Glasses 👓\nSetelah melihat Social Media kaka yang seru dan kece banget, kami tertarik banget untuk mengajak kerja sama atau berkolaborasi dengan kita optik i see youu 🥰\n\nKalo boleh tau, boleh di infokan untuk ratecardnyaa, sebagai bahan pertimbangan kami?\n\nTerimakasih ditunggu kabar baiknya ya ka 🙏\nHave a nicee dayy ya kaa! 🌸✨",
    "barterStrategy": {
      "standardFee": "Rp 250.000",
      "barterOption": "Barter Full Produk Kacamata (Frame + Lensa Kustom Pilihan Talent)",
      "followerVoucher": "Voucher Diskon Belanja Followers (Bahan Kuis Komentar)",
      "recommendedApproach": "Tahap 1: Tanya ratecard dulu. Tahap 2: Tawarkan Barter Produk + Voucher Giveaway Komen / Fee Rp 250rb."
    }
  }
];

const updatedKols = [...newPwt, ...nonPwt];
fs.writeFileSync(kolFilePath, JSON.stringify(updatedKols, null, 2), 'utf8');
console.log('Successfully replaced Purwokerto KOLs with 3 fresh rising stars (Risma Anjani, Maria Reres, Alfinda Putri)!');
