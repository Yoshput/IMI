import React from "react";
import { Metadata } from "next";
import { CommunicationCenterView } from "@/features/communication/components/CommunicationCenterView";

export const metadata: Metadata = {
  title: "Marketing Communication Center | Optik I See You",
  description:
    "Pusat pengelolaan template komunikasi WhatsApp standar untuk operasional Sponsorship, Kemitraan, dan Koordinasi Recruitment Model Optik I See You.",
};

export default function CommunicationCenterPage() {
  return (
    <main className="w-full">
      <CommunicationCenterView />
    </main>
  );
}
