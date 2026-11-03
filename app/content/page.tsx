import { Suspense } from "react";
import { ContentView } from "@/features/content/components/ContentView";

export const metadata = {
  title: "Content & Design Dashboard — I See You Marketing Intelligence",
  description: "Ranked content performance evaluation and graphic design database for Optik I See You.",
};

export default function ContentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-foreground-muted">Memuat Content &amp; Design Dashboard...</div>}>
      <ContentView />
    </Suspense>
  );
}
