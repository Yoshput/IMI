/**
 * Utility for exporting monthly executive reports to PDF and PPTX
 * Supports:
 * 1. Laporan Web & Performa Bulanan (Web Photobooth, Antrian Online, SEO GSC)
 * 2. Laporan CC Performa Konten & Design Bulanan (@iseeyou.glasses)
 */

import {
  MonthlyWebPerformanceData,
  DesignerMonthlySummary,
  DailyIgPostSummary,
  ContentItem,
  DesignDatabaseItem,
} from "@/types";

// Helper for dynamic loading of jsPDF & autoTable to ensure complete SSR safety
async function getJsPdf() {
  const { jsPDF } = await import("jspdf");
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default || autoTableModule;
  return { jsPDF, autoTable };
}

// Helper for dynamic loading of pptxgenjs
async function getPptxGen() {
  const pptxModule = await import("pptxgenjs");
  const pptx = pptxModule.default || pptxModule;
  return pptx;
}

// Brand color palette (Optik I See You)
const BRAND_GREEN_RGB: [number, number, number] = [18, 71, 52]; // #124734
const BRAND_EMERALD_RGB: [number, number, number] = [5, 150, 105]; // #059669
const TEXT_DARK_RGB: [number, number, number] = [31, 41, 55]; // #1F2937
const MUTED_RGB: [number, number, number] = [107, 114, 128]; // #6B7280

const PPT_BRAND_COLOR = "124734";
const PPT_ACCENT_COLOR = "059669";
const PPT_BG_COLOR = "F9FAFB";
const PPT_DARK_TEXT = "1F2937";
const PPT_MUTED_TEXT = "6B7280";

// ============================================================================
// 1. LAPORAN WEB & PERFORMA BULANAN -> PDF
// ============================================================================
export async function exportWebPerformanceToPDF(data: MonthlyWebPerformanceData): Promise<void> {
  const { jsPDF, autoTable } = await getJsPdf();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header Banner
  doc.setFillColor(...BRAND_GREEN_RGB);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("LAPORAN WEB & PERFORMA BULANAN", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(`Periode: ${data.monthLabel.toUpperCase()} (${data.monthKey}) · Optik I See You & Lunar Eyewear`, margin, 18);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, margin, 23);

  // Section 1: Executive KPI Summary Cards
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("1. Ringkasan Eksekutif KPI Digital Aset Web", margin, 36);

  const kpiY = 40;
  const cardWidth = (pageWidth - margin * 2 - 6) / 3;
  const cardHeight = 22;

  // Card A: Photobooth
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_RGB);
  doc.text("WEB PHOTOBOOTH & TRY-ON", margin + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.photobooth.totalSessions.toLocaleString("id-ID")} Sesi`, margin + 3, kpiY + 12);
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.photobooth.uniqueUsers.toLocaleString("id-ID")} users · ${data.photobooth.sharedPhotos.toLocaleString("id-ID")} shared`, margin + 3, kpiY + 18);

  // Card B: Antrian Online
  const cardBX = margin + cardWidth + 3;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(cardBX, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_RGB);
  doc.text("NOMOR ANTRIAN ONLINE", cardBX + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.queue.totalRegistered.toLocaleString("id-ID")} Pasien`, cardBX + 3, kpiY + 12);
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text(`Rata-rata: ${data.queue.dailyAverage} pasien/hari`, cardBX + 3, kpiY + 18);

  // Card C: Google Search Console
  const cardCX = cardBX + cardWidth + 3;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(cardCX, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_RGB);
  doc.text("GOOGLE SEARCH CONSOLE", cardCX + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.gsc.totalClicks.toLocaleString("id-ID")} Klik`, cardCX + 3, kpiY + 12);
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.gsc.totalImpressions.toLocaleString("id-ID")} Impresi · CTR: ${data.gsc.avgCtr}%`, cardCX + 3, kpiY + 18);

  // Table A: Antrian per Cabang
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.text("Distribusi Pendaftaran Antrian Online Cek Mata per Cabang:", margin, 70);

  const branchRows = data.queue.byBranch.map((b, idx) => [
    idx + 1,
    b.branchName,
    `${b.count.toLocaleString("id-ID")} pendaftar`,
    `${data.queue.totalRegistered > 0 ? ((b.count / data.queue.totalRegistered) * 100).toFixed(1) : 0}%`,
  ]);

  autoTable(doc, {
    startY: 73,
    head: [["No", "Cabang Optik I See You", "Jumlah Booking", "Kontribusi (%)"]],
    body: branchRows,
    theme: "striped",
    headStyles: { fillColor: BRAND_GREEN_RGB, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  // Table B: Top Frames Photobooth
  let afterBranchY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 115;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.text("Top Frame Virtual Try-On Terpopuler (Photobooth):", margin, afterBranchY);

  const frameRows = data.photobooth.topFrames.map((f, idx) => [
    idx + 1,
    f.model,
    `${f.tries.toLocaleString("id-ID")} kali`,
    `${f.shares.toLocaleString("id-ID")} share`,
    `${f.tries > 0 ? ((f.shares / f.tries) * 100).toFixed(1) : 0}%`,
  ]);

  autoTable(doc, {
    startY: afterBranchY + 3,
    head: [["No", "Model Frame Kacamata", "Dicoba (Try-On)", "Diunduh / Share", "Viral Share Rate"]],
    body: frameRows,
    theme: "striped",
    headStyles: { fillColor: BRAND_EMERALD_RGB, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  // PAGE 2: SEO Google Search Console & Daily Trends
  doc.addPage();

  // Header Page 2
  doc.setFillColor(...BRAND_GREEN_RGB);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`LAPORAN WEB & PERFORMA - ${data.monthLabel.toUpperCase()} (Halaman 2)`, margin, 12);

  // Table C: Top Queries GSC
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("2. Performa SEO Organik (Top 10 Kata Kunci Google Search):", margin, 26);

  const queryRows = (data.gsc.topQueries || []).slice(0, 8).map((q, idx) => [
    idx + 1,
    q.query,
    q.clicks.toLocaleString("id-ID"),
    q.impressions.toLocaleString("id-ID"),
    `${q.ctr}%`,
    q.position.toFixed(1),
  ]);

  autoTable(doc, {
    startY: 29,
    head: [["No", "Kata Kunci (Search Query)", "Klik", "Impresi", "CTR (%)", "Rata-rata Posisi"]],
    body: queryRows,
    theme: "striped",
    headStyles: { fillColor: BRAND_GREEN_RGB, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  let afterQueryY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 100;

  // Table D: Daily Trend Sample
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.text(`3. Log Trafik & Antrian Harian (${data.monthLabel}):`, margin, afterQueryY);

  const trendRows = (data.gsc.dailyTrend || []).slice(0, 15).map((t, idx) => [
    idx + 1,
    t.date,
    `${t.clicks.toLocaleString("id-ID")} klik`,
    `${t.impressions.toLocaleString("id-ID")} imp`,
    `${t.sessions ? t.sessions.toLocaleString("id-ID") : "-"} sesi`,
    `${t.queueBookings ? t.queueBookings : "-"} booking`,
  ]);

  autoTable(doc, {
    startY: afterQueryY + 3,
    head: [["No", "Tanggal", "Klik GSC", "Impresi GSC", "Sesi Photobooth", "Booking Antrian"]],
    body: trendRows,
    theme: "striped",
    headStyles: { fillColor: BRAND_EMERALD_RGB, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED_RGB);
    doc.text(
      `ISeeYou Marketing Intelligence (IMI) · Dokumen Resmi Evaluasi Web & Digital Aset · Hal ${p} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  doc.save(`Laporan_Web_Performa_ISY_${data.monthKey}.pdf`);
}

// ============================================================================
// 2. LAPORAN WEB & PERFORMA BULANAN -> PPTX
// ============================================================================
export async function exportWebPerformanceToPPT(data: MonthlyWebPerformanceData): Promise<void> {
  const PptxGenJS = await getPptxGen();
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  // Slide 1: Cover Slide
  const s1 = pptx.addSlide();
  s1.background = { color: PPT_BRAND_COLOR };
  s1.addText("LAPORAN WEB & PERFORMA BULANAN", {
    x: 0.8,
    y: 2.0,
    w: 8.5,
    h: 1.0,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: "FFFFFF",
  });
  s1.addText(`Periode: ${data.monthLabel} (${data.monthKey})`, {
    x: 0.8,
    y: 3.1,
    w: 8.5,
    h: 0.5,
    fontSize: 16,
    fontFace: "Arial",
    color: "A7F3D0",
  });
  s1.addText("Optik I See You (Purwokerto, Cilacap, Purbalingga, Wonosobo) & Lunar Eyewear", {
    x: 0.8,
    y: 3.7,
    w: 8.5,
    h: 0.5,
    fontSize: 12,
    fontFace: "Arial",
    color: "E5E7EB",
  });
  s1.addText(`Generated by ISeeYou Marketing Intelligence · ${new Date().toLocaleDateString("id-ID")}`, {
    x: 0.8,
    y: 6.2,
    w: 8.5,
    h: 0.4,
    fontSize: 10,
    fontFace: "Arial",
    color: "9CA3AF",
  });

  // Slide 2: Ringkasan KPI Utama
  const s2 = pptx.addSlide();
  s2.background = { color: PPT_BG_COLOR };
  s2.addText("HIGHLIGHT PERFORMA BULANAN", {
    x: 0.8,
    y: 0.6,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: PPT_ACCENT_COLOR,
  });
  s2.addText(`Key Performance Indicators — ${data.monthLabel}`, {
    x: 0.8,
    y: 1.0,
    w: 8.5,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: PPT_DARK_TEXT,
  });

  // 3 Metric Boxes
  // Box 1
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.8,
    w: 2.6,
    h: 2.2,
    fill: { color: "FFFFFF" },
    line: { color: "E5E7EB", width: 1 },
    rectRadius: 0.1,
  });
  s2.addText("WEB PHOTOBOOTH", { x: 1.0, y: 2.0, w: 2.2, h: 0.3, fontSize: 10, bold: true, color: PPT_MUTED_TEXT });
  s2.addText(`${data.photobooth.totalSessions.toLocaleString("id-ID")}`, { x: 1.0, y: 2.4, w: 2.2, h: 0.6, fontSize: 24, bold: true, color: PPT_BRAND_COLOR });
  s2.addText(`Total Sesi Virtual Try-On\n${data.photobooth.uniqueUsers.toLocaleString("id-ID")} users unik\n${data.photobooth.sharedPhotos.toLocaleString("id-ID")} foto di-share`, { x: 1.0, y: 3.0, w: 2.2, h: 0.9, fontSize: 9, color: PPT_DARK_TEXT });

  // Box 2
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 3.7,
    y: 1.8,
    w: 2.6,
    h: 2.2,
    fill: { color: "FFFFFF" },
    line: { color: "E5E7EB", width: 1 },
    rectRadius: 0.1,
  });
  s2.addText("ANTRIAN ONLINE", { x: 3.9, y: 2.0, w: 2.2, h: 0.3, fontSize: 10, bold: true, color: PPT_MUTED_TEXT });
  s2.addText(`${data.queue.totalRegistered.toLocaleString("id-ID")}`, { x: 3.9, y: 2.4, w: 2.2, h: 0.6, fontSize: 24, bold: true, color: PPT_BRAND_COLOR });
  s2.addText(`Total Booking Pasien\nRata-rata: ${data.queue.dailyAverage} pasien/hari\n4 Cabang Jaringan ISY`, { x: 3.9, y: 3.0, w: 2.2, h: 0.9, fontSize: 9, color: PPT_DARK_TEXT });

  // Box 3
  s2.addShape(pptx.ShapeType.roundRect, {
    x: 6.6,
    y: 1.8,
    w: 2.6,
    h: 2.2,
    fill: { color: "FFFFFF" },
    line: { color: "E5E7EB", width: 1 },
    rectRadius: 0.1,
  });
  s2.addText("GOOGLE SEARCH CONSOLE", { x: 6.8, y: 2.0, w: 2.2, h: 0.3, fontSize: 10, bold: true, color: PPT_MUTED_TEXT });
  s2.addText(`${data.gsc.totalClicks.toLocaleString("id-ID")}`, { x: 6.8, y: 2.4, w: 2.2, h: 0.6, fontSize: 24, bold: true, color: PPT_BRAND_COLOR });
  s2.addText(`Total Klik Organik\n${data.gsc.totalImpressions.toLocaleString("id-ID")} impresi\nCTR: ${data.gsc.avgCtr}% | Pos: ${data.gsc.avgPosition.toFixed(1)}`, { x: 6.8, y: 3.0, w: 2.2, h: 0.9, fontSize: 9, color: PPT_DARK_TEXT });

  // Key takeaways bullet below
  s2.addText("Catatan Strategis:", { x: 0.8, y: 4.4, w: 8.5, h: 0.3, fontSize: 11, bold: true, color: PPT_DARK_TEXT });
  s2.addText([
    { text: "• Fitur Web Photobooth memberikan konversi signifikan mengalirkan calon customer ke reservasi antrian cek mata.\n", options: { bullet: true, fontSize: 10, color: PPT_DARK_TEXT } },
    { text: `• Pendaftaran antrian online mencapai total ${data.queue.totalRegistered} pasien selama bulan ${data.monthLabel}.\n`, options: { bullet: true, fontSize: 10, color: PPT_DARK_TEXT } },
    { text: `• Saluran pencarian organik Google Search Console terus stabil dengan rata-rata CTR ${data.gsc.avgCtr}%.`, options: { bullet: true, fontSize: 10, color: PPT_DARK_TEXT } },
  ], { x: 0.8, y: 4.8, w: 8.5, h: 1.5 });

  // Slide 3: Breakdown Cabang & Top Frames
  const s3 = pptx.addSlide();
  s3.background = { color: PPT_BG_COLOR };
  s3.addText("DISTRIBUSI CABANG & PRODUK TERPOPULER", {
    x: 0.8,
    y: 0.6,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: PPT_ACCENT_COLOR,
  });
  s3.addText(`Breakdown Antrian Cabang & Top Frame Photobooth (${data.monthLabel})`, {
    x: 0.8,
    y: 1.0,
    w: 8.5,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: PPT_DARK_TEXT,
  });

  // Table Branch
  const branchTableRows: any[][] = [
    [
      { text: "Cabang", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Booking", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Share (%)", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
    ],
    ...data.queue.byBranch.map((b) => [
      { text: b.branchName },
      { text: b.count.toString() },
      { text: `${data.queue.totalRegistered > 0 ? ((b.count / data.queue.totalRegistered) * 100).toFixed(1) : 0}%` },
    ]),
  ];

  s3.addTable(branchTableRows, {
    x: 0.8,
    y: 1.8,
    w: 4.0,
    h: 2.2,
    fontSize: 9,
    border: { pt: 0.5, color: "E5E7EB" },
  });

  // Table Top Frames
  const frameTableRows: any[][] = [
    [
      { text: "Model Frame", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
      { text: "Dicoba", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
      { text: "Share", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
    ],
    ...data.photobooth.topFrames.slice(0, 5).map((f) => [
      { text: f.model },
      { text: f.tries.toString() },
      { text: f.shares.toString() },
    ]),
  ];

  s3.addTable(frameTableRows, {
    x: 5.2,
    y: 1.8,
    w: 4.2,
    h: 2.2,
    fontSize: 9,
    border: { pt: 0.5, color: "E5E7EB" },
  });

  // Slide 4: SEO Google Search Console Top Queries
  const s4 = pptx.addSlide();
  s4.background = { color: PPT_BG_COLOR };
  s4.addText("ORGANIC SEARCH PERFORMANCE", {
    x: 0.8,
    y: 0.6,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: PPT_ACCENT_COLOR,
  });
  s4.addText(`Google Search Console Top Queries & Insights (${data.monthLabel})`, {
    x: 0.8,
    y: 1.0,
    w: 8.5,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: PPT_DARK_TEXT,
  });

  const queryTableRows: any[][] = [
    [
      { text: "No", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Search Query (Kata Kunci)", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Klik", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Impresi", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "CTR", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Posisi", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
    ],
    ...(data.gsc.topQueries || []).slice(0, 7).map((q, idx) => [
      { text: (idx + 1).toString() },
      { text: q.query },
      { text: q.clicks.toString() },
      { text: q.impressions.toString() },
      { text: `${q.ctr}%` },
      { text: q.position.toFixed(1) },
    ]),
  ];

  s4.addTable(queryTableRows, {
    x: 0.8,
    y: 1.8,
    w: 8.4,
    h: 3.2,
    fontSize: 9,
    border: { pt: 0.5, color: "E5E7EB" },
  });

  await pptx.writeFile({ fileName: `Laporan_Web_Performa_ISY_${data.monthKey}.pptx` });
}

// ============================================================================
// 3. LAPORAN CC PERFORMA KONTEN & DESIGN BULANAN -> PDF
// ============================================================================
export interface ExportCcReportParams {
  monthKey: string;
  monthLabel: string;
  accountHandle: string;
  designerSummaries: DesignerMonthlySummary[];
  dailySummaries: DailyIgPostSummary[];
  filteredPosts: ContentItem[];
  filteredDesigns: DesignDatabaseItem[];
}

export async function exportCcContentDesignToPDF(params: ExportCcReportParams): Promise<void> {
  const { jsPDF, autoTable } = await getJsPdf();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const totalDesigns = params.filteredDesigns.length;
  const totalPosts = params.filteredPosts.length;
  const totalReach = params.filteredPosts.reduce((acc, p) => acc + (p.reach || 0), 0);
  const avgEr = params.filteredPosts.length > 0
    ? (params.filteredPosts.reduce((acc, p) => acc + (p.engagementRate || 0), 0) / params.filteredPosts.length).toFixed(1)
    : "0.0";
  const activePostingDays = params.dailySummaries.filter((d) => d.postCount > 0).length;

  // Header Banner
  doc.setFillColor(...BRAND_GREEN_RGB);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("LAPORAN CC & PERFORMA KONTEN DESIGN", margin, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Akun: ${params.accountHandle} · Periode: ${params.monthLabel.toUpperCase()} (${params.monthKey})`,
    margin,
    17
  );
  doc.text(
    `Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · ISeeYou Marketing Intelligence`,
    margin,
    23
  );

  // Section 1: Executive KPI Summary Cards
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text(`1. Ringkasan Eksekutif Produksi & Distribusi Konten (${params.monthLabel})`, margin, 35);

  const kpiY = 39;
  const cardWidth = (pageWidth - margin * 2 - 9) / 4;
  const cardHeight = 20;

  // KPI 1: Desain Dibuat
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED_RGB);
  doc.text("TOTAL DESAIN SELESAI", margin + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalDesigns} Desain`, margin + 3, kpiY + 12);
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text("Form Responses 6", margin + 3, kpiY + 17);

  // KPI 2: Postingan IG
  const card2X = margin + cardWidth + 3;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(card2X, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED_RGB);
  doc.text("TAYANG DI INSTAGRAM", card2X + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalPosts} Postingan`, card2X + 3, kpiY + 12);
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text(`${activePostingDays} hari aktif posting`, card2X + 3, kpiY + 17);

  // KPI 3: Total Reach
  const card3X = card2X + cardWidth + 3;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(card3X, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED_RGB);
  doc.text("TOTAL REACH BULANAN", card3X + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${totalReach.toLocaleString("id-ID")}`, card3X + 3, kpiY + 12);
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text("Jangkauan akun unik", card3X + 3, kpiY + 17);

  // KPI 4: Rata-rata ER
  const card4X = card3X + cardWidth + 3;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(card4X, kpiY, cardWidth, cardHeight, 2, 2, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED_RGB);
  doc.text("RATA-RATA ENGAGEMENT", card4X + 3, kpiY + 5);
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN_RGB);
  doc.setFont("helvetica", "bold");
  doc.text(`${avgEr}%`, card4X + 3, kpiY + 12);
  doc.setFontSize(7);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "normal");
  doc.text("Interaksi / Reach", card4X + 3, kpiY + 17);

  // Section 2: Table Produktivitas Desainer / CC
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.text(`2. Rekap Produktivitas Output per Desainer / CC (${params.monthLabel}):`, margin, 66);

  const designerRows = params.designerSummaries.map((ds, idx) => [
    idx + 1,
    ds.pic,
    `${ds.totalDesigns} desain`,
    `${ds.totalIgPosts} post`,
    `${ds.percentageShare.toFixed(1)}%`,
    ds.totalReach > 0 ? ds.totalReach.toLocaleString("id-ID") : "-",
    ds.avgEngagementRate > 0 ? `${ds.avgEngagementRate.toFixed(1)}%` : "-",
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["No", "Nama Desainer / PIC", "Desain Selesai", "Postingan IG", "% Kontribusi", "Total Reach", "Rata2 ER"]],
    body: designerRows,
    theme: "striped",
    headStyles: { fillColor: BRAND_GREEN_RGB, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  // Section 3: Date-by-date Posting Tracker
  let trackerY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 115;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.text(`3. Date-by-Date Tracker: Deteksi Tanggal Posting IG & Output Desain:`, margin, trackerY);

  const trackerRows = params.dailySummaries
    .filter((d) => d.postCount > 0 || d.designCount > 0)
    .map((d, idx) => {
      const postTitles = d.posts.map((p) => p.title).slice(0, 2).join("; ");
      const designTitles = d.designs.map((des) => des.designName).slice(0, 2).join("; ");
      const combinedSummary = [
        postTitles ? `IG: ${postTitles}` : "",
        designTitles ? `Desain: ${designTitles}` : "",
      ].filter(Boolean).join(" | ");

      return [
        idx + 1,
        d.formattedDate,
        `${d.postCount} post`,
        `${d.designCount} desain`,
        combinedSummary.length > 55 ? combinedSummary.slice(0, 52) + "..." : combinedSummary || "-",
        d.totalReach > 0 ? d.totalReach.toLocaleString("id-ID") : "-",
        d.totalLikes > 0 ? d.totalLikes.toLocaleString("id-ID") : "-",
      ];
    });

  autoTable(doc, {
    startY: trackerY + 3,
    head: [["No", "Tanggal", "Post IG", "Desain Baru", "Judul Konten / Desain", "Reach", "Likes"]],
    body: trackerRows.length > 0 ? trackerRows : [["-", "Tidak ada posting pada periode ini", "-", "-", "-", "-", "-"]],
    theme: "striped",
    headStyles: { fillColor: BRAND_EMERALD_RGB, textColor: 255, fontStyle: "bold", fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  // PAGE 2: Rincian Lengkap Seluruh Desain & Postingan IG
  doc.addPage();

  // Header Page 2
  doc.setFillColor(...BRAND_GREEN_RGB);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`RINCIAN DESAIN & KONTEN INSTAGRAM - ${params.monthLabel.toUpperCase()} (Halaman 2)`, margin, 12);

  // Table Desain Lengkap
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`4. Daftar Seluruh Desain yang Dikerjakan (${params.filteredDesigns.length} Berkas):`, margin, 26);

  const fullDesignRows = params.filteredDesigns.map((des, idx) => [
    idx + 1,
    des.date || "-",
    des.pic || des.creator || "Yanuar",
    des.designName.length > 50 ? des.designName.slice(0, 48) + "..." : des.designName,
    des.fileUrl && des.fileUrl !== "-" ? "Tersedia di Drive" : "-",
  ]);

  autoTable(doc, {
    startY: 29,
    head: [["No", "Tanggal Input", "PIC Desainer", "Nama Desain / Materi Cetak", "Status File G-Drive"]],
    body: fullDesignRows.length > 0 ? fullDesignRows : [["-", "-", "-", "Tidak ada desain di bulan ini", "-"]],
    theme: "striped",
    headStyles: { fillColor: BRAND_GREEN_RGB, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  let afterDesignY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 120;

  // Table Postingan IG Lengkap
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_DARK_RGB);
  doc.text(`5. Daftar Postingan Instagram ${params.accountHandle} (${params.filteredPosts.length} Post):`, margin, afterDesignY);

  const postDetailRows = params.filteredPosts.map((p, idx) => [
    idx + 1,
    p.publishDate || "-",
    p.format.toUpperCase(),
    p.title.length > 40 ? p.title.slice(0, 38) + "..." : p.title,
    (p.reach || 0).toLocaleString("id-ID"),
    (p.likes || 0).toLocaleString("id-ID"),
    `${p.engagementRate || 0}%`,
  ]);

  autoTable(doc, {
    startY: afterDesignY + 3,
    head: [["No", "Tgl Rilis", "Format", "Judul / Hook Konten", "Reach", "Likes", "ER (%)"]],
    body: postDetailRows.length > 0 ? postDetailRows : [["-", "-", "-", "Tidak ada postingan di bulan ini", "-", "-", "-"]],
    theme: "striped",
    headStyles: { fillColor: BRAND_EMERALD_RGB, textColor: 255, fontStyle: "bold", fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: TEXT_DARK_RGB },
    margin: { left: margin, right: margin },
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED_RGB);
    doc.text(
      `ISeeYou Marketing Intelligence (IMI) · Evaluasi Tim Content Creator & Graphic Design · Hal ${p} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  doc.save(`Laporan_CC_Konten_Design_${params.monthKey}.pdf`);
}

// ============================================================================
// 4. LAPORAN CC PERFORMA KONTEN & DESIGN BULANAN -> PPTX
// ============================================================================
export async function exportCcContentDesignToPPT(params: ExportCcReportParams): Promise<void> {
  const PptxGenJS = await getPptxGen();
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  const totalDesigns = params.filteredDesigns.length;
  const totalPosts = params.filteredPosts.length;
  const totalReach = params.filteredPosts.reduce((acc, p) => acc + (p.reach || 0), 0);
  const avgEr = params.filteredPosts.length > 0
    ? (params.filteredPosts.reduce((acc, p) => acc + (p.engagementRate || 0), 0) / params.filteredPosts.length).toFixed(1)
    : "0.0";

  // Slide 1: Cover
  const s1 = pptx.addSlide();
  s1.background = { color: PPT_BRAND_COLOR };
  s1.addText("LAPORAN BULANAN CC & KONTEN DESIGN", {
    x: 0.8,
    y: 2.0,
    w: 8.5,
    h: 1.0,
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: "FFFFFF",
  });
  s1.addText(`Akun: ${params.accountHandle} · Periode: ${params.monthLabel} (${params.monthKey})`, {
    x: 0.8,
    y: 3.1,
    w: 8.5,
    h: 0.5,
    fontSize: 16,
    fontFace: "Arial",
    color: "A7F3D0",
  });
  s1.addText("Evaluasi Output Tim Desainer Grafis & Performa Postingan Instagram", {
    x: 0.8,
    y: 3.7,
    w: 8.5,
    h: 0.5,
    fontSize: 12,
    fontFace: "Arial",
    color: "E5E7EB",
  });
  s1.addText(`Generated by ISeeYou Marketing Intelligence · ${new Date().toLocaleDateString("id-ID")}`, {
    x: 0.8,
    y: 6.2,
    w: 8.5,
    h: 0.4,
    fontSize: 10,
    fontFace: "Arial",
    color: "9CA3AF",
  });

  // Slide 2: Highlight & Produktivitas Desainer
  const s2 = pptx.addSlide();
  s2.background = { color: PPT_BG_COLOR };
  s2.addText("PRODUKTIVITAS TIM DESAIN & CC", {
    x: 0.8,
    y: 0.5,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: PPT_ACCENT_COLOR,
  });
  s2.addText(`Rekap Output & Kontribusi per Desainer — ${params.monthLabel}`, {
    x: 0.8,
    y: 0.9,
    w: 8.5,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: PPT_DARK_TEXT,
  });

  // 4 Top Metric Cards
  const kpiData = [
    { label: "DESAIN SELESAI", val: `${totalDesigns} Desain`, sub: "Database Sheets" },
    { label: "POSTINGAN IG", val: `${totalPosts} Post`, sub: params.accountHandle },
    { label: "TOTAL REACH", val: totalReach.toLocaleString("id-ID"), sub: "Akun Terjangkau" },
    { label: "RATA-RATA ER", val: `${avgEr}%`, sub: "Engagement Rate" },
  ];

  kpiData.forEach((k, i) => {
    const x = 0.8 + i * 2.15;
    s2.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 1.5,
      w: 2.0,
      h: 1.3,
      fill: { color: "FFFFFF" },
      line: { color: "E5E7EB", width: 1 },
      rectRadius: 0.08,
    });
    s2.addText(k.label, { x: x + 0.1, y: 1.6, w: 1.8, h: 0.25, fontSize: 8, bold: true, color: PPT_MUTED_TEXT });
    s2.addText(k.val, { x: x + 0.1, y: 1.9, w: 1.8, h: 0.4, fontSize: 16, bold: true, color: PPT_BRAND_COLOR });
    s2.addText(k.sub, { x: x + 0.1, y: 2.35, w: 1.8, h: 0.25, fontSize: 8, color: PPT_DARK_TEXT });
  });

  // Table Designer Summary
  const designerTableRows: any[][] = [
    [
      { text: "Nama Desainer / PIC", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Desain Selesai", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Post IG", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Kontribusi (%)", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Reach", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Avg ER", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
    ],
    ...params.designerSummaries.map((ds) => [
      { text: ds.pic },
      { text: `${ds.totalDesigns} desain` },
      { text: `${ds.totalIgPosts} post` },
      { text: `${ds.percentageShare.toFixed(1)}%` },
      { text: ds.totalReach > 0 ? ds.totalReach.toLocaleString("id-ID") : "-" },
      { text: ds.avgEngagementRate > 0 ? `${ds.avgEngagementRate.toFixed(1)}%` : "-" },
    ]),
  ];

  s2.addTable(designerTableRows, {
    x: 0.8,
    y: 3.0,
    w: 8.5,
    h: 2.5,
    fontSize: 9,
    border: { pt: 0.5, color: "E5E7EB" },
  });

  // Slide 3: Date-by-date Posting Tracker
  const s3 = pptx.addSlide();
  s3.background = { color: PPT_BG_COLOR };
  s3.addText("TIMELINE & DETEKSI TANGGAL POSTING", {
    x: 0.8,
    y: 0.5,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: PPT_ACCENT_COLOR,
  });
  s3.addText(`Log Tanggal Posting Instagram & Output Desain (${params.monthLabel})`, {
    x: 0.8,
    y: 0.9,
    w: 8.5,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: PPT_DARK_TEXT,
  });

  const activeDays = params.dailySummaries.filter((d) => d.postCount > 0 || d.designCount > 0);
  const trackerTableRows: any[][] = [
    [
      { text: "Tanggal", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
      { text: "Post IG", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
      { text: "Desain Baru", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
      { text: "Karya / Judul Konten Terdeteksi", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
      { text: "Reach", options: { bold: true, fill: { color: PPT_ACCENT_COLOR }, color: "FFFFFF" } },
    ],
    ...(activeDays.slice(0, 8).map((d) => {
      const summaryText = [
        ...d.posts.map((p) => `IG: ${p.title}`),
        ...d.designs.map((des) => `Desain: ${des.designName}`),
      ].slice(0, 2).join("; ");

      return [
        { text: d.formattedDate },
        { text: `${d.postCount} post` },
        { text: `${d.designCount} desain` },
        { text: summaryText.length > 50 ? summaryText.slice(0, 48) + "..." : summaryText || "-" },
        { text: d.totalReach > 0 ? d.totalReach.toLocaleString("id-ID") : "-" },
      ];
    })),
  ];

  s3.addTable(trackerTableRows, {
    x: 0.8,
    y: 1.6,
    w: 8.5,
    h: 4.2,
    fontSize: 8.5,
    border: { pt: 0.5, color: "E5E7EB" },
  });

  // Slide 4: Daftar Desain yang Dikerjakan
  const s4 = pptx.addSlide();
  s4.background = { color: PPT_BG_COLOR };
  s4.addText("DATABASE KARYA DESAIN", {
    x: 0.8,
    y: 0.5,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: PPT_ACCENT_COLOR,
  });
  s4.addText(`Daftar Karya Desain Grafis & Materi Cetak (${params.monthLabel})`, {
    x: 0.8,
    y: 0.9,
    w: 8.5,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: PPT_DARK_TEXT,
  });

  const sampleDesigns = params.filteredDesigns.slice(0, 8);
  const designTableRows: any[][] = [
    [
      { text: "No", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Tgl Input", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "PIC Desainer", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Nama Desain", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
      { text: "Link Google Drive", options: { bold: true, fill: { color: PPT_BRAND_COLOR }, color: "FFFFFF" } },
    ],
    ...sampleDesigns.map((des, idx) => [
      { text: (idx + 1).toString() },
      { text: des.date || "-" },
      { text: des.pic || des.creator || "Yanuar" },
      { text: des.designName.length > 45 ? des.designName.slice(0, 43) + "..." : des.designName },
      { text: des.fileUrl && des.fileUrl !== "-" ? "Tersedia" : "-" },
    ]),
  ];

  s4.addTable(designTableRows, {
    x: 0.8,
    y: 1.6,
    w: 8.5,
    h: 4.2,
    fontSize: 8.5,
    border: { pt: 0.5, color: "E5E7EB" },
  });

  await pptx.writeFile({ fileName: `Laporan_CC_Konten_Design_${params.monthKey}.pptx` });
}
