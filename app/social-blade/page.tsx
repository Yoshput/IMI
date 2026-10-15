import type { Metadata } from "next";
import { SocialBladeView } from "@/features/socialblade/components/SocialBladeView";

export const metadata: Metadata = {
  title: "Social Blade Instagram Tracker Real-Time | I See You Marketing Intelligence",
  description:
    "Data resmi real-time Social Blade dan Meta Graph Instagram untuk Optik I See You (Purwokerto, Purbalingga, Cilacap, Wonosobo) dan Lunar Eyewear Tegal. Pantau fluktuasi followers 14 hari dan 30 hari secara akurat.",
};

export default function SocialBladePage() {
  return <SocialBladeView />;
}
