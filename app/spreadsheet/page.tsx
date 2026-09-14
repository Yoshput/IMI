import React from "react";
import { SpreadsheetHubView } from "@/features/sheets/components/SpreadsheetHubView";
import defaultSheetsData from "@/lib/real-sheets-data.json";

export const metadata = {
  title: "Spreadsheet Rekap 6 PIC & Evaluasi Mingguan | I See You Marketing Intelligence",
  description:
    "Rekap harian terintegrasi Google Sheets untuk 6 PIC cabang Optik I See You dan Lunar Eyewear, disiapkan untuk meeting mingguan direksi.",
};

export default function SpreadsheetPage() {
  return <SpreadsheetHubView initialData={defaultSheetsData as any} />;
}
