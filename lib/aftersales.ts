// Aftersales CRM Model, Database & Helpers for Optik I See You

export type FollowUpStatus =
  | "belum_dihubungi"
  | "sudah_dihubungi"
  | "selesai_puas"
  | "butuh_garansi";

export interface CustomerPrescription {
  odSph: string; // Kanan Sferis
  odCyl: string; // Kanan Silinder
  odAxis?: string;
  osSph: string; // Kiri Sferis
  osCyl: string; // Kiri Silinder
  osAxis?: string;
  add?: string;  // Baca dekat
  pd: string;   // Pupil distance (mm)
}

export interface CustomerInteractionLog {
  id: string;
  date: string;
  type: "whatsapp_message" | "phone_call" | "store_visit" | "web_antrian_click";
  actor: string;
  note: string;
}

export interface CustomerAftersalesRecord {
  id: string;
  name: string;
  phone: string;
  branch: string;
  branchKey: "PWT" | "CLP" | "PBG" | "WNS" | "TGL";
  city: string;
  examDate: string;
  pickupDate: string;
  frameModel: string;
  lensType: string;
  totalTransaction: number;
  prescription: CustomerPrescription;
  status: FollowUpStatus;
  notes: string;
  inquiryChannel: "web_antrian" | "walk_in" | "instagram_dm" | "tiktok_dm";
  satisfactionScore?: number; // 1-5
  logs: CustomerInteractionLog[];
}

export const INITIAL_CUSTOMERS: CustomerAftersalesRecord[] = [
  {
    id: "cust-01",
    name: "Dimas Arya Pratama",
    phone: "6281229837411",
    branch: "Purwokerto (Pusat)",
    branchKey: "PWT",
    city: "Purwokerto",
    examDate: "2026-09-10",
    pickupDate: "2026-09-12",
    frameModel: "Vintage Titanium Round Black Gold",
    lensType: "Bluechromic Night Drive (Anti Silau)",
    totalTransaction: 850000,
    prescription: {
      odSph: "-2.50",
      odCyl: "-0.50",
      odAxis: "180",
      osSph: "-2.75",
      osCyl: "-0.25",
      osAxis: "175",
      pd: "63",
    },
    status: "belum_dihubungi",
    notes: "Customer mahasiswa Unsoed, komplain mata sering lelah depan laptop. Butuh follow-up kenyamanan lensa H+7.",
    inquiryChannel: "web_antrian",
    logs: [
      {
        id: "l-01",
        date: "2026-09-10 14:20",
        type: "web_antrian_click",
        actor: "Sistem Web",
        note: "Mengisi form 'Antrian Cek Mata' di optikiseeyou.com",
      },
      {
        id: "l-02",
        date: "2026-09-12 16:30",
        type: "store_visit",
        actor: "Ilya (Lab PWT)",
        note: "Pengambilan kacamata & fitting frame selesai, penglihatan tajam.",
      },
    ],
  },
  {
    id: "cust-02",
    name: "Siti Rahmawati",
    phone: "6285741298044",
    branch: "Cilacap",
    branchKey: "CLP",
    city: "Cilacap",
    examDate: "2026-09-08",
    pickupDate: "2026-09-09",
    frameModel: "Cat-Eye Acetate Translucent Peach",
    lensType: "Photocromic Gray Anti Radiasi",
    totalTransaction: 720000,
    prescription: {
      odSph: "-1.75",
      odCyl: "0.00",
      osSph: "-1.50",
      osCyl: "-0.50",
      osAxis: "90",
      pd: "61",
    },
    status: "sudah_dihubungi",
    notes: "Follow-up via WA hari ke-3: sangat puas dengan perubahan warna gelapnya saat panas-panasan di Teluk Penyu.",
    inquiryChannel: "tiktok_dm",
    satisfactionScore: 5,
    logs: [
      {
        id: "l-03",
        date: "2026-09-08 11:00",
        type: "store_visit",
        actor: "Arum (PIC Cilacap)",
        note: "Datang karena melihat video TikTok toko baru Cilacap.",
      },
      {
        id: "l-04",
        date: "2026-09-12 10:15",
        type: "whatsapp_message",
        actor: "CS Aftersales",
        note: "Follow-up H+3: Kacamata nyaman, tidak pusing.",
      },
    ],
  },
  {
    id: "cust-03",
    name: "Budi Wicaksono",
    phone: "6282134567890",
    branch: "Purbalingga",
    branchKey: "PBG",
    city: "Purbalingga",
    examDate: "2026-09-07",
    pickupDate: "2026-09-07",
    frameModel: "Square Matte Black Ultem Anti Patah",
    lensType: "Single Vision Anti Radiasi EMI",
    totalTransaction: 480000,
    prescription: {
      odSph: "-3.00",
      odCyl: "-0.75",
      odAxis: "15",
      osSph: "-3.25",
      osCyl: "-0.75",
      osAxis: "165",
      pd: "64",
    },
    status: "butuh_garansi",
    notes: "Nosepad agak kendor dan terasa longgar di telinga kiri. Perlu dipanggil ke store Purbalingga untuk re-fitting & adjustment gratis.",
    inquiryChannel: "walk_in",
    satisfactionScore: 3,
    logs: [
      {
        id: "l-05",
        date: "2026-09-11 13:40",
        type: "whatsapp_message",
        actor: "CS Aftersales",
        note: "Customer menginfokan kacamata agak melorot saat dipakai berkendara motor.",
      },
    ],
  },
  {
    id: "cust-04",
    name: "Nabila Putri Andini",
    phone: "6289678123456",
    branch: "Wonosobo",
    branchKey: "WNS",
    city: "Wonosobo",
    examDate: "2026-09-11",
    pickupDate: "2026-09-13",
    frameModel: "Korean Round Rose Gold Slim",
    lensType: "Lensa Anti Fog (Anti Embun Khusus Dingin)",
    totalTransaction: 920000,
    prescription: {
      odSph: "-1.25",
      odCyl: "-0.25",
      odAxis: "180",
      osSph: "-1.25",
      osCyl: "0.00",
      pd: "60",
    },
    status: "selesai_puas",
    notes: "Sangat terbantu lensa anti embun karena kerja harian di area Dieng Wonosobo. Memberi review bintang 5.",
    inquiryChannel: "web_antrian",
    satisfactionScore: 5,
    logs: [
      {
        id: "l-06",
        date: "2026-09-11 09:10",
        type: "web_antrian_click",
        actor: "Sistem Web",
        note: "Klik tombol antrian dari halaman landing page optikiseeyou.com",
      },
      {
        id: "l-07",
        date: "2026-09-14 14:00",
        type: "whatsapp_message",
        actor: "Febi (PIC Wonosobo)",
        note: "Konfirmasi kepuasan lensa anti kabut.",
      },
    ],
  },
  {
    id: "cust-05",
    name: "Hendra Kurniawan",
    phone: "6281399887766",
    branch: "Lunar Eyewear Tegal",
    branchKey: "TGL",
    city: "Tegal",
    examDate: "2026-09-12",
    pickupDate: "2026-09-14",
    frameModel: "Clubmaster Classic Dark Tortoise",
    lensType: "Progressive Freeform Multifokal",
    totalTransaction: 1450000,
    prescription: {
      odSph: "+1.50",
      odCyl: "-0.50",
      odAxis: "90",
      osSph: "+1.75",
      osCyl: "-0.50",
      osAxis: "85",
      add: "+2.00",
      pd: "65",
    },
    status: "belum_dihubungi",
    notes: "Pengguna lensa progressive baru pertama kali. Wajib di-follow-up H+5 adaptasi cara melihat jalan vs membaca.",
    inquiryChannel: "instagram_dm",
    logs: [
      {
        id: "l-08",
        date: "2026-09-12 15:30",
        type: "store_visit",
        actor: "Amanda (PIC Tegal)",
        note: "Edukasi gerakan kepala untuk fokus lensa progressive.",
      },
    ],
  },
  {
    id: "cust-06",
    name: "Tri Wahyuni",
    phone: "6285223344556",
    branch: "Purwokerto (Pusat)",
    branchKey: "PWT",
    city: "Purwokerto",
    examDate: "2026-09-13",
    pickupDate: "2026-09-14",
    frameModel: "Hexagonal Geometric Gold",
    lensType: "Bluechromic Anti Radiasi",
    totalTransaction: 790000,
    prescription: {
      odSph: "-4.00",
      odCyl: "-1.00",
      odAxis: "170",
      osSph: "-3.75",
      osCyl: "-1.25",
      osAxis: "10",
      pd: "62",
    },
    status: "belum_dihubungi",
    notes: "Pesanan lensa indeks tinggi 1.67 agar pinggiran lensa tidak tebal.",
    inquiryChannel: "web_antrian",
    logs: [
      {
        id: "l-09",
        date: "2026-09-13 11:25",
        type: "web_antrian_click",
        actor: "Sistem Web",
        note: "Booking antrian via web optikiseeyou.com",
      },
    ],
  },
];
