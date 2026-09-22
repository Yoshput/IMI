// Internal Task & Creative Planner Store for Marketing Team

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "high" | "medium" | "low";

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface MarketingTaskItem {
  id: string;
  title: string;
  assignee: string;
  role: string;
  avatarInitials: string;
  category: "feed_instagram" | "story_promo" | "banner_web" | "pos_print" | "tiktok_video";
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  checklist: TaskChecklistItem[];
  notes: string;
}

export const INITIAL_MARKETING_TASKS: MarketingTaskItem[] = [
  {
    id: "task-01",
    title: "Design Grafis Feed — Carousel Edukasi Lensa & Promo 5 Cabang",
    assignee: "Yanuar",
    role: "Graphic Designer & Visual Creative",
    avatarInitials: "YN",
    category: "feed_instagram",
    status: "in_progress",
    priority: "high",
    deadline: "2026-09-25",
    checklist: [
      {
        id: "c-1",
        text: "Slide 1-5: Carousel 'Kenapa Mata Sering Pegal Depan Laptop? Solusi Lensa Bluechromic'",
        completed: true,
      },
      {
        id: "c-2",
        text: "Feed Banner CTA 'Antrian Cek Mata Gratis di optikiseeyou.com' (Format 1:1 & 4:5)",
        completed: true,
      },
      {
        id: "c-3",
        text: "Post Visual Announcement Akun Baru TikTok Cilacap (@i.see.you.cilacap)",
        completed: false,
      },
      {
        id: "c-4",
        text: "Materi Feed Aftersales: 'Gratis Penyetelan & Cuci Kacamata Selamanya'",
        completed: false,
      },
    ],
    notes: "Gunakan palet warna brand I See You (Navy & Gold Warm), font editorial sans-serif, hindari teks terlalu rapat agar reach Instagram tidak ditekan.",
  },
  {
    id: "task-02",
    title: "Shooting POV Try-On Frame Cat-Eye Kacamata Baru",
    assignee: "Ilya",
    role: "PIC Reels PWT",
    avatarInitials: "IL",
    category: "tiktok_video",
    status: "in_progress",
    priority: "medium",
    deadline: "2026-09-24",
    checklist: [
      { id: "c-21", text: "Siapkan 3 model wajah berbeda untuk fitting", completed: true },
      { id: "c-22", text: "Take video POV di depan cermin lab Purwokerto", completed: false },
    ],
    notes: "Target: 20k viewers TikTok @iseeyouglasses.",
  },
  {
    id: "task-03",
    title: "Distribusi Story & Broadcast Saluran Promo Akhir Bulan",
    assignee: "Nuha",
    role: "PIC Story PWT",
    avatarInitials: "NH",
    category: "story_promo",
    status: "todo",
    priority: "medium",
    deadline: "2026-09-26",
    checklist: [
      { id: "c-31", text: "Story kuis interaktif bentuk wajah", completed: false },
      { id: "c-32", text: "Link stiker mengarah ke booking antrian web", completed: false },
    ],
    notes: "Pantau kecepatan respon CS di WhatsApp.",
  },
];
