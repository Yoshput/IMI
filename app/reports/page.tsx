import { ReportBuilderView } from "@/features/reports/components/ReportBuilderView";
import { SensitiveGate } from "@/components/shared/SensitiveGate";

export const metadata = {
  title: "Report Builder — I See You Marketing Intelligence",
  description: "Weekly management evaluation report for Optik I See You Purwokerto.",
};

export default function ReportsPage() {
  return (
    <SensitiveGate
      section="reports"
      title="Akses Laporan Manajemen & Evaluasi"
      subtitle="Halaman ini memuat laporan strategis mingguan, evaluasi performa PIC per cabang, dan analisis bisnis internal Optik I See You."
    >
      <ReportBuilderView />
    </SensitiveGate>
  );
}
