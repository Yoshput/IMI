/**
 * Script Seed Research Leads — Venue Intelligence
 * 
 * Script ini menyisipkan kandidat venue hasil riset web ke dalam data/venue-intelligence.json.
 * Semua data hanya berupa lead riset — BUKAN fakta terverifikasi.
 * Field yang belum diketahui ditandai null.
 * 
 * Jalankan: npx tsx lib/seed-venues.ts
 */

import fs from 'fs';
import path from 'path';
import { VenueIntelligenceState, Venue, createEmptyVenue, generateId, calculateVenueScore, DEFAULT_SCORE_WEIGHTS } from './venue-types';

const DATA_FILE = path.join(process.cwd(), 'data', 'venue-intelligence.json');

interface SeedVenue {
  name: string;
  nameAlternatives: string[];
  category: Venue['category'];
  address: string | null;
  city: string;
  district: string | null;
  googleMapsUrl: string | null;
  websiteUrl: string | null;
  instagramHandle: string | null;
  phone: string | null;
  capacityTotal: number | null;
  capacityClassroom: number | null;
  operationalStatus: Venue['operationalStatus'];
  isAmbiguous: boolean;
  ambiguityNotes: string | null;
  strengths: string[];
  limitations: string[];
  targetAudience: string[];
  internalNotes: string | null;
}

const SEED_VENUE_DATA: SeedVenue[] = [
  {
    name: 'Hetero Space Banyumas',
    nameAlternatives: ['Hetero Space', 'Creative Hub Banyumas'],
    category: 'coworking',
    address: 'Jl. Jend. Gatot Subroto No. 67, Sitapen, Purwanegara, Kec. Purwokerto Timur, Kab. Banyumas 53116',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=Hetero+Space+Banyumas',
    websiteUrl: 'https://hetero.space',
    instagramHandle: '@heterospace.bms',
    phone: '0882-0025-60094',
    capacityTotal: 100,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Creative hub terintegrasi', 'Ekosistem kreator digital', 'Fasilitas lengkap', 'Wi-Fi 60 Mbps'],
    limitations: ['Lokasi agak jauh dari pusat kota'],
    targetAudience: ['Kreator konten', 'Komunitas digital', 'Startup'],
    internalNotes: 'Venue paling relevan untuk Content Creation Class. Gatra Event Space (indoor) kapasitas 100 orang.',
  },
  {
    name: 'ASTON Purwokerto Hotel & Convention Center',
    nameAlternatives: ['ASTON Imperium Purwokerto', 'Aston Purwokerto'],
    category: 'hotel',
    address: 'Jl. Overste Isdiman No. 33, Purwokerto Lor, Kec. Purwokerto Timur, Kab. Banyumas 53114',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=ASTON+Purwokerto+Hotel+%26+Convention+Center',
    websiteUrl: 'https://www.astonhotelsinternational.com/en/hotel/view/45/aston-purwokerto-hotel---convention-center',
    instagramHandle: '@astonpurwokerto',
    phone: '(0281) 628000',
    capacityTotal: 1200,
    capacityClassroom: 400,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Hotel bintang 4', 'Kamandaka Ballroom 1200 pax', 'Banyak pilihan ruang meeting'],
    limitations: ['Harga premium'],
    targetAudience: ['Korporasi', 'Seminar besar', 'Product launching'],
    internalNotes: 'Kamandaka Ballroom: Theater 1000, Classroom 400. Meeting rooms: Kresna, Yudhistira, Nakula, Sadewa (20-100 pax).',
  },
  {
    name: 'Java Heritage Hotel Purwokerto',
    nameAlternatives: ['Java Heritage'],
    category: 'hotel',
    address: 'Jl. Dr. Angka No. 71, Karangkobar, Sokanegara, Kec. Purwokerto Timur, Kab. Banyumas 53115',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=Java+Heritage+Hotel+Purwokerto',
    websiteUrl: 'https://javaheritagehotel.com',
    instagramHandle: '@javaheritagehotel',
    phone: '(0281) 634321',
    capacityTotal: 2000,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Hotel bintang 4', 'Hastinapura Convention Center 2000 pax', 'Krisna Ballroom 800 pax', '16 ruang meeting'],
    limitations: ['Skala besar — mungkin terlalu luas untuk workshop kecil'],
    targetAudience: ['Expo besar', 'Seminar', 'Wedding', 'Korporasi'],
    internalNotes: 'HCC 1456 m². Krisna Ballroom 800 m². 16 meeting rooms (20-150 pax).',
  },
  {
    name: 'Luminor Hotel Purwokerto',
    nameAlternatives: ['Luminor by Waringin'],
    category: 'hotel',
    address: 'Jl. Jend. Soedirman No. 324, Pereng, Sokanegara, Kec. Purwokerto Timur, Kab. Banyumas 53116',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=Luminor+Hotel+Purwokerto',
    websiteUrl: 'https://www.waringinhospitality.com',
    instagramHandle: '@luminorhotelpurwokerto',
    phone: '(0281) 7771988',
    capacityTotal: 600,
    capacityClassroom: 150,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['6 function rooms', 'Lokasi strategis Jl. Sudirman'],
    limitations: [],
    targetAudience: ['Workshop medium', 'Meeting bisnis'],
    internalNotes: 'Ruang Pelus, Cangkek, Serayu, Sudirman. Per ruang 30-150 pax.',
  },
  {
    name: 'Taman Budaya Soetedja',
    nameAlternatives: ['Gedung Suteja', 'Gedung Kesenian Soetedja'],
    category: 'gedung_pertemuan',
    address: 'Jl. Pancurawis No. 1, Karanganyar, Kel. Purwokerto Kidul, Kec. Purwokerto Selatan, Kab. Banyumas',
    city: 'Purwokerto',
    district: 'Purwokerto Selatan',
    googleMapsUrl: 'https://maps.google.com/?q=Taman+Budaya+Soetedja+Purwokerto',
    websiteUrl: null,
    instagramHandle: '@tamanbudayasoetedja',
    phone: '(0281) 637629',
    capacityTotal: 600,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: true,
    ambiguityNotes: 'Dikenal masyarakat sebagai "Gedung Suteja". Nama resmi: Taman Budaya Soetedja. Dikelola Dinporabudpar Pemkab Banyumas.',
    strengths: ['Harga sangat terjangkau (Rp2.500.000/hari bisnis)', 'Kapasitas 300-600 orang'],
    limitations: ['Gedung pemerintah — proses birokrasi', 'Sound system & lighting mungkin perlu sewa terpisah'],
    targetAudience: ['Pertunjukan seni', 'Seminar publik'],
    internalNotes: 'Berdasarkan Perda Kab. Banyumas No. 3 Tahun 2020. Sewa bisnis Rp2.500.000/hari, non-bisnis Rp1.000.000/hari.',
  },
  {
    name: 'Jati Ngayom Restaurant & Convention Hall',
    nameAlternatives: ['Jatingayom', 'Jatingayom Resto'],
    category: 'kafe_restoran',
    address: 'Jl. Raya Baturaden KM 6, Karang Blimbing, Kel. Pabuaran, Kec. Purwokerto Utara, Kab. Banyumas',
    city: 'Purwokerto',
    district: 'Purwokerto Utara',
    googleMapsUrl: 'https://maps.google.com/?q=Jati+Ngayom+Restaurant+Purwokerto',
    websiteUrl: null,
    instagramHandle: '@jatingayomresto',
    phone: '0851-1329-7144',
    capacityTotal: 2000,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Imperial Hall 2000 pax', 'Arunika Hall untuk gathering medium', 'Restoran dan wisata terpadu'],
    limitations: ['Lokasi di Jl. Raya Baturaden — agak jauh dari pusat kota'],
    targetAudience: ['Event besar', 'Gathering komunitas', 'Wedding'],
    internalNotes: 'Imperial Hall: 2000 orang. Arunika Hall: gathering & seminar skala medium.',
  },
  {
    name: 'Universitas Amikom Purwokerto',
    nameAlternatives: ['Amikom Purwokerto'],
    category: 'kampus',
    address: 'Jl. Letjend Pol. Soemarto, Watumas, Purwanegara, Kec. Purwokerto Utara, Kab. Banyumas 53127',
    city: 'Purwokerto',
    district: 'Purwokerto Utara',
    googleMapsUrl: 'https://maps.google.com/?q=Universitas+Amikom+Purwokerto',
    websiteUrl: 'https://www.amikompurwokerto.ac.id',
    instagramHandle: '@amikom_purwokerto',
    phone: '(0281) 623321',
    capacityTotal: null,
    capacityClassroom: 60,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Kampus teknologi & kreatif', 'Studio podcast & green screen', 'Lab multimedia ~60 komputer'],
    limitations: ['Perlu MoU untuk sewa eksternal'],
    targetAudience: ['Mahasiswa', 'Gen-Z', 'Creator digital'],
    internalNotes: 'WA PMB/Humas: 0858-4888-8445. Lab multimedia ~60 pax.',
  },
  {
    name: 'FISIP Universitas Jenderal Soedirman',
    nameAlternatives: ['Fakultas Ilmu Komunikasi UNSOED', 'FISIP UNSOED', 'Gedung Ilmu Komunikasi UNSOED'],
    category: 'kampus',
    address: 'Jl. Prof. Dr. HR Boenyamin No. 708, Dukuhbandong, Grendeng, Kec. Purwokerto Utara, Kab. Banyumas 53122',
    city: 'Purwokerto',
    district: 'Purwokerto Utara',
    googleMapsUrl: 'https://maps.google.com/?q=FISIP+Universitas+Jenderal+Soedirman',
    websiteUrl: 'https://fisip.unsoed.ac.id',
    instagramHandle: '@fisipunsoed_official',
    phone: '(0281) 635292',
    capacityTotal: 300,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: true,
    ambiguityNotes: 'UNSOED tidak memiliki "Fakultas Ilmu Komunikasi" tersendiri. Prodi Ilmu Komunikasi berada di bawah FISIP UNSOED.',
    strengths: ['PTN terkemuka', 'Audiens mahasiswa besar', 'Auditorium & Aula FISIP'],
    limitations: ['Perlu surat permohonan kerjasama ke Dekanat'],
    targetAudience: ['Mahasiswa', 'Akademisi', 'Komunitas kampus'],
    internalNotes: 'Email: fisip@unsoed.ac.id. Faks: (0281) 631802.',
  },
  {
    name: 'Wisata Niaga Hotel',
    nameAlternatives: ['Hotel Wisata Niaga Merdeka', 'Wisata Niaga Merdeka'],
    category: 'hotel',
    address: 'Jl. Merdeka No. 5, Purwanegara, Kec. Purwokerto Timur, Kab. Banyumas 53116',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=Wisata+Niaga+Hotel+Purwokerto',
    websiteUrl: 'https://wisataniagahotel.com',
    instagramHandle: '@wisataniagahotel',
    phone: '(0281) 642333',
    capacityTotal: 200,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['WN Cafe & Co-working Space', 'Lokasi pusat kota', 'Cocok untuk gathering santai'],
    limitations: [],
    targetAudience: ['Creator meetup', 'Workshop medium'],
    internalNotes: 'Kontak Event: Prita 0822-6500-3510, Rossy 0822-6500-3511.',
  },
  {
    name: 'COR Hotel Purwokerto',
    nameAlternatives: ['COR Hotel'],
    category: 'hotel',
    address: 'Jl. Jenderal Sudirman No. 508-511, Kauman Lama, Purwokerto Lor, Kec. Purwokerto Timur, Kab. Banyumas 53141',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=COR+Hotel+Purwokerto',
    websiteUrl: 'https://dominicgroups.com',
    instagramHandle: '@official_corhotelpurwokerto',
    phone: '(0281) 7772777',
    capacityTotal: 120,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Ruang serbaguna fleksibel'],
    limitations: ['Kapasitas terbatas'],
    targetAudience: ['Pelatihan', 'Rapat bisnis'],
    internalNotes: 'WA: +62 857-8223-9999. Email: corhotelpurwokerto@gmail.com.',
  },
  {
    name: 'Gedung Soemardjito UNSOED',
    nameAlternatives: ['Gedung Pertemuan Soemardjito', 'Soemardjito UNSOED'],
    category: 'gedung_pertemuan',
    address: 'Jl. Dr. Soeparno, Grendeng, Kec. Purwokerto Utara, Kab. Banyumas',
    city: 'Purwokerto',
    district: 'Purwokerto Utara',
    googleMapsUrl: 'https://maps.google.com/?q=Gedung+Soemardjito+UNSOED',
    websiteUrl: 'https://bpu.unsoed.ac.id',
    instagramHandle: null,
    phone: '(0281) 641426',
    capacityTotal: 1500,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Kapasitas besar 300-1500 orang', 'Milik UNSOED'],
    limitations: ['Harga Rp6.900.000/hari', 'Proses birokrasi kampus'],
    targetAudience: ['Seminar besar', 'Wisuda', 'Event kampus'],
    internalNotes: 'CP Pengelola: 0852-2708-9908. Sewa mulai Rp6.900.000/hari (8 jam).',
  },
  {
    name: 'Graha Widyatama UNSOED',
    nameAlternatives: ['Auditorium Graha Widyatama Prof. Rubijanto Misman'],
    category: 'gedung_pertemuan',
    address: 'Jl. Prof. DR. HR Boenyamin No. 708, Pabuaran, Kec. Purwokerto Utara, Kab. Banyumas 53122',
    city: 'Purwokerto',
    district: 'Purwokerto Utara',
    googleMapsUrl: 'https://maps.google.com/?q=Graha+Widyatama+UNSOED',
    websiteUrl: 'https://bpu.unsoed.ac.id',
    instagramHandle: null,
    phone: '(0281) 630299',
    capacityTotal: 3000,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Gedung terbesar milik kampus di Purwokerto', 'Kapasitas 2000-3000 orang'],
    limitations: ['Terlalu besar untuk workshop kecil', 'Proses booking melalui BPU UNSOED'],
    targetAudience: ['Wisuda', 'Konser', 'Expo besar'],
    internalNotes: 'Dikelola BPU UNSOED. Email: bpuunsoed@unsoed.ac.id.',
  },
  {
    name: 'Convention Hall Putra Sang Fajar',
    nameAlternatives: ['Convention Hall Menara Pandang', 'Convention Hall Menara Teratai'],
    category: 'gedung_pertemuan',
    address: 'Jl. Bung Karno, Kalibener, Kel. Kedungwuluh, Kec. Purwokerto Barat, Kab. Banyumas',
    city: 'Purwokerto',
    district: 'Purwokerto Barat',
    googleMapsUrl: 'https://maps.google.com/?q=Convention+Hall+Putra+Sang+Fajar+Purwokerto',
    websiteUrl: 'https://bludpariwisata.com',
    instagramHandle: '@menarateratai_purwokerto',
    phone: '(0281) 637629',
    capacityTotal: 1200,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: true,
    ambiguityNotes: 'Dikenal sebagai "Convention Hall Menara Pandang" atau "Menara Teratai". Nama resmi: Convention Hall Putra Sang Fajar.',
    strengths: ['Kapasitas 1200 orang', 'Bangunan 2 lantai modern', 'Landmark kota'],
    limitations: ['Proses sewa melalui retribusi BLUD Pariwisata'],
    targetAudience: ['Event besar', 'Expo', 'Pameran'],
    internalNotes: 'Dikelola BLUD UPT Pariwisata Teratai Mas Banyumas.',
  },
  {
    name: "D'Garden Hall & Resto Purwokerto",
    nameAlternatives: ['D Garden', 'DGarden Resto'],
    category: 'kafe_restoran',
    address: 'Jl. DR. Soeparno No. 97, Arcawinangun, Kec. Purwokerto Timur, Kab. Banyumas',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=DGarden+Hall+and+Resto+Purwokerto',
    websiteUrl: null,
    instagramHandle: '@dgardenresto',
    phone: '(0281) 638375',
    capacityTotal: 800,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['13 pilihan ruangan', 'Fleksibilitas kapasitas 20-800 orang', 'Restoran terpadu'],
    limitations: [],
    targetAudience: ['Seminar', 'Gathering', 'Workshop', 'Wedding'],
    internalNotes: 'New Main Hall 400-800, Gladiola Convention 100-500, Tulip Hall 150-300, Anggrek Room 20-50 (cocok mini workshop).',
  },
  {
    name: 'Ethos Digital Valley',
    nameAlternatives: ['Etos', 'Etos Purwokerto', 'EDV'],
    category: 'creative_space',
    address: 'Desa Karanggintung, Kec. Sumbang, Kab. Banyumas, Jawa Tengah',
    city: 'Banyumas',
    district: 'Sumbang',
    googleMapsUrl: 'https://maps.google.com/?q=Ethos+Digital+Valley+Karanggintung+Banyumas',
    websiteUrl: 'https://ethos.co.id',
    instagramHandle: '@ethosdigitalvalley',
    phone: null,
    capacityTotal: null,
    capacityClassroom: null,
    operationalStatus: 'active',
    isAmbiguous: true,
    ambiguityNotes: '"Etos Purwokerto" bisa merujuk ke (1) Ethos Digital Valley — kawasan kreatif di Karanggintung, atau (2) Beastudi Etos (asrama beasiswa Dompet Dhuafa). Yang relevan adalah Ethos Digital Valley.',
    strengths: ['Kawasan ekosistem kreatif & teknologi', 'Lahan ~2 hektar', 'Kafe terintegrasi'],
    limitations: ['Lokasi di Sumbang — di luar pusat Purwokerto', 'Kontak reservasi belum jelas'],
    targetAudience: ['Startup', 'Creator digital', 'Komunitas teknologi'],
    internalNotes: 'Dikembangkan oleh PT Ethos Kreatif Indonesia. Perlu kontak korporat melalui ethos.co.id.',
  },
  {
    name: 'Grand Karlita Hotel Purwokerto',
    nameAlternatives: ['Grand Karlita'],
    category: 'hotel',
    address: 'Jl. S. Parman No. 296, Karangbawang, Purwokerto Kulon, Kec. Purwokerto Selatan, Kab. Banyumas 53141',
    city: 'Purwokerto',
    district: 'Purwokerto Selatan',
    googleMapsUrl: 'https://maps.google.com/?q=Grand+Karlita+Hotel+Purwokerto',
    websiteUrl: 'https://grandkarlitahotel.com',
    instagramHandle: null,
    phone: '+62 281 7772500',
    capacityTotal: 2000,
    capacityClassroom: 1000,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Diamond Room 2000 theater / 1000 classroom', 'Sapphire Room 800 theater', '5 pilihan ruang meeting'],
    limitations: ['Harga premium'],
    targetAudience: ['Expo besar', 'Seminar', 'Gala dinner'],
    internalNotes: 'Jade 100T/70C, Emerald 200T/100C, Ruby 120T/150C, Sapphire 800T/300C, Diamond 2000T/1000C.',
  },
  {
    name: 'Lumenna Hotel Purwokerto',
    nameAlternatives: ['Meotel Purwokerto', 'Lumenna by Artotel'],
    category: 'hotel',
    address: 'Jl. Dr. Soeparno No. 1, Arcawinangun, Kec. Purwokerto Timur, Kab. Banyumas 53113',
    city: 'Purwokerto',
    district: 'Purwokerto Timur',
    googleMapsUrl: 'https://maps.google.com/?q=Lumenna+Hotel+Purwokerto',
    websiteUrl: null,
    instagramHandle: null,
    phone: '(0281) 7771157',
    capacityTotal: 100,
    capacityClassroom: 45,
    operationalStatus: 'active',
    isAmbiguous: false,
    ambiguityNotes: null,
    strengths: ['Nuansa modern-retro estetik', 'Disukai anak muda & creator', 'Dekat GOR Satria'],
    limitations: ['Kapasitas terbatas'],
    targetAudience: ['Creator gathering', 'Workshop medium'],
    internalNotes: 'Buggati Room: Theater 100, Classroom 45. Alpha Romeo Room: Theater 30, Classroom 15. WA Marketing: +62 858-7742-8511.',
  },
];

function seedVenues() {
  let state: VenueIntelligenceState;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    state = JSON.parse(raw);
  } catch {
    console.error('Data file not found, aborting');
    process.exit(1);
  }

  const existingNames = new Set(state.venues.map(v => v.name.toLowerCase()));
  let added = 0;

  for (const sv of SEED_VENUE_DATA) {
    if (existingNames.has(sv.name.toLowerCase())) {
      console.log(`⏩ Skipping "${sv.name}" — already exists`);
      continue;
    }

    const venue = createEmptyVenue();
    venue.name = sv.name;
    venue.nameAlternatives = sv.nameAlternatives;
    venue.category = sv.category;
    venue.address = sv.address;
    venue.city = sv.city;
    venue.district = sv.district;
    venue.googleMapsUrl = sv.googleMapsUrl;
    venue.websiteUrl = sv.websiteUrl;
    venue.instagramHandle = sv.instagramHandle;
    venue.phone = sv.phone;
    venue.capacityTotal = sv.capacityTotal;
    venue.capacityByLayout.classroom = sv.capacityClassroom;
    venue.operationalStatus = sv.operationalStatus;
    venue.isAmbiguous = sv.isAmbiguous;
    venue.ambiguityNotes = sv.ambiguityNotes;
    venue.strengths = sv.strengths;
    venue.limitations = sv.limitations;
    venue.targetAudience = sv.targetAudience;
    venue.internalNotes = sv.internalNotes;
    venue.outreachStatus = 'new_lead';
    venue.score = calculateVenueScore(venue, DEFAULT_SCORE_WEIGHTS);

    state.venues.push(venue);
    added++;
    console.log(`✅ Added "${sv.name}"`);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  console.log(`\n🏁 Selesai. ${added} venue baru ditambahkan. Total: ${state.venues.length} venue.`);
}

seedVenues();
