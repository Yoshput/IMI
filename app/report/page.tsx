import { redirect } from "next/navigation";

export default async function ReportRedirectPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (typeof v === "string") qs.set(k, v);
  });
  const query = qs.toString() ? `?${qs.toString()}` : "";
  redirect(`/reports${query}`);
}
