const fs = require('fs');
const path = require('path');

const kolFilePath = path.join(__dirname, '..', 'lib', 'kol-data.json');
const kols = JSON.parse(fs.readFileSync(kolFilePath, 'utf8'));

const updated = kols.map((k) => {
  const brandName = k.brand === 'Lunar Eyewear' ? 'Lunar Eyewear Tegal' : 'Optik I See You Glasses';
  const brandMention = k.brand === 'Lunar Eyewear' ? 'lunar eyewear' : 'optik i see youu';
  const firstName = k.name.split(' ')[0];

  const pitchTemplate = `Hai kak ${firstName}.. ✨👋

Perkenalkan saya Yossika dari tim Marketing ${brandName} 👓
Setelah melihat Social Media kaka, saya tertarik untuk mengajak kerja sama atau berkolaborasi dengan kita ${brandMention} 🥰

Kalo boleh tau, boleh di infokan untuk ratecardnyaa, sebagai bahan pertimbangan kami?

Terimakasih ditunggu kabar baiknya ya ka 🙏
Have a nicee dayy ya kaa! 🌸✨`;

  return {
    ...k,
    barterStrategy: {
      standardFee: "Rp 250.000",
      barterOption: "Barter Full Produk Kacamata (Frame + Lensa Kustom Pilihan Talent)",
      followerVoucher: "Voucher Diskon Belanja Followers (Bahan Kuis Komentar)",
      recommendedApproach: "Tawarkan Barter Produk + Voucher Giveaway Followers terlebih dahulu. Jika berbayar, negosiasi fee acuan Rp 250.000."
    },
    pitchTemplate
  };
});

fs.writeFileSync(kolFilePath, JSON.stringify(updated, null, 2), 'utf8');
console.log('Successfully updated lib/kol-data.json with barter strategy and friendly chat template!');
