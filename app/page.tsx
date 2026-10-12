import { LandingView } from "@/features/landing/components/LandingView";
import "@/features/landing/landing.css";

export const metadata = {
  title: "I See You Intelligence | Workspace Marketing",
  description: "Ruang kerja marketing Optik I See You dan Lunar Eyewear. Konten, aktivitas cabang, riset dan evaluasi mingguan dalam satu workspace.",
};

export default function HomePage() {
  return <LandingView />;
}
