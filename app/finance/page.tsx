import { FinanceView } from "@/features/finance/components/FinanceView";
import { SensitiveGate } from "@/components/shared/SensitiveGate";

export const metadata = {
  title: "Finance & Bonus — I See You Marketing Intelligence",
  description: "Laporan keuangan, insentif kreator, dan kalkulasi bonus H+3 Optik I See You.",
};

export default function FinancePage() {
  return (
    <SensitiveGate
      section="finance"
      title="Akses Laporan Keuangan & Bonus"
      subtitle="Area ini memuat data finansial insentif kreator per cabang dan kalkulasi bonus video yang bersifat konfidensial."
    >
      <FinanceView />
    </SensitiveGate>
  );
}
