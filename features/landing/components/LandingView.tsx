'use client';

import React, { useEffect } from 'react';
import { mountLanding } from '../landing-runtime';

const branches = [
  { id: 'all', name: 'Seluruh jaringan', detail: 'Optik I See You & Lunar Eyewear' },
  { id: 'pwt', name: 'Purwokerto', detail: 'Optik I See You · Pusat' },
  { id: 'pbg', name: 'Purbalingga', detail: 'Optik I See You' },
  { id: 'clp', name: 'Cilacap', detail: 'Optik I See You' },
  { id: 'wns', name: 'Wonosobo', detail: 'Optik I See You' },
  { id: 'tgl', name: 'Tegal', detail: 'Lunar Eyewear' },
];

const googleMapsReviews = [
  {
    id: "rev-pwt",
    branchName: "Purwokerto (Pusat)",
    author: "Dwi Aryani",
    authorRole: "Local Guide",
    relativeDate: "4 hari yang lalu",
    rating: 5,
    text: "Pengerjaan faset kacamata cepet banget 20 menit langsung jadi. Tempatnya estetik, staf ramah pol, periksa mata komputernya detail dan gratis. Kacamata titaniumnya enteng dan nyaman dipake seharian.",
    mapUrl: "https://maps.app.goo.gl/OptikISeeYouPurwokerto",
  },
  {
    id: "rev-pbg",
    branchName: "Purbalingga",
    author: "Rizky Fajar Pratama",
    authorRole: "Pengunjung Terverifikasi",
    relativeDate: "7 hari yang lalu",
    rating: 5,
    text: "Store kacamata paling aesthetic di Purbalingga! Pilihan frame korean series lengkap dan harganya terjangkau. Mas & mbak yang melayani sabar banget pas bantu nyoba-nyoba frame. Recommended banget!",
    mapUrl: "https://maps.app.goo.gl/OptikISeeYouPurbalingga",
  },
  {
    id: "rev-clp",
    branchName: "Cilacap",
    author: "Annisa Wulandari",
    authorRole: "Local Guide",
    relativeDate: "12 hari yang lalu",
    rating: 5,
    text: "Akhirnya nemu lensa bluechromic yang pas buat motoran di Cilacap, ga silau sama sekali pas terik. Pelayanan ramah, tempat dingin & bersih, ada garansi fitting frame juga.",
    mapUrl: "https://maps.app.goo.gl/OptikISeeYouCilacap",
  },
  {
    id: "rev-wns",
    branchName: "Wonosobo",
    author: "Bagus Prasetyo",
    authorRole: "Pengunjung Terverifikasi",
    relativeDate: "2 minggu yang lalu",
    rating: 5,
    text: "Puas banget periksa mata di sini, resep silinder akurat ga bikin pusing sama sekali. Lensa anti embunnya kepake banget buat udara dingin Wonosobo. Sukses terus Optik I See You!",
    mapUrl: "https://maps.app.goo.gl/OptikISeeYouWonosobo",
  },
  {
    id: "rev-tgl",
    branchName: "Tegal (Lunar Eyewear)",
    author: "Siti Maulida",
    authorRole: "Local Guide",
    relativeDate: "1 bulan yang lalu",
    rating: 5,
    text: "Konsep Lunar Eyewear keren banget di Langon Square Tegal. Koleksi framenya unik, beda dari optik konvensional. Barangnya bagus, staf ramah, dan pembersihan kacamata gratis.",
    mapUrl: "https://maps.app.goo.gl/LunarEyewearTegal",
  },
];

function EntryButton({ children = 'Masuk workspace', className = '' }: { children?: React.ReactNode; className?: string }) {
  return <button type="button" data-open-workspace className={`imi-button ${className}`}>{children}</button>;
}

function PreviewScreen() {
  return (
    <div className="imi-device" data-screen>
      <div className="imi-device-edge" />
      <div className="imi-device-surface">
        <div className="imi-preview-top"><strong>i see you<span>intelligence</span></strong><span>Workspace marketing</span><span className="imi-preview-mark">IMI</span></div>
        <div className="imi-preview-body">
          <aside className="imi-preview-sidebar" aria-hidden="true"><span className="imi-preview-active">Ringkasan</span><span>Spreadsheet</span><span>Konten</span><span>Aftersales</span><span>Kompetitor</span><span>KOL & Venue</span><span className="imi-sidebar-bottom">Laporan mingguan</span></aside>
          <div className="imi-preview-main">
            <div className="imi-preview-tabs" aria-hidden="true"><span>Workspace</span><span>Periode pilihan Anda</span></div>
            <div id="imi-panel-0" role="tabpanel" tabIndex={0} aria-labelledby="imi-tab-0" data-demo-panel="0" className="imi-demo-panel">
              <p className="imi-preview-caption">Gambaran besar, konteks yang jelas.</p><h3>Marketing<br />dalam satu pandangan.</h3>
              <div className="imi-preview-summary"><div><span>Cakupan</span><strong>5 wilayah</strong></div><div><span>Tim konten</span><strong>6 PIC</strong></div><div><span>Evaluasi</span><strong>Mingguan</strong></div></div>
              <div className="imi-preview-table"><div className="imi-preview-table-head"><span>Workspace cabang</span><span>Aktivitas</span></div>{branches.slice(1).map((branch, index) => <div key={branch.id}><span>{branch.name}<small>{branch.detail}</small></span><span className="imi-preview-track"><i style={{ width: `${[77, 54, 66, 44, 58][index]}%` }} /></span></div>)}</div>
            </div>
            <div id="imi-panel-1" role="tabpanel" tabIndex={0} aria-labelledby="imi-tab-1" data-demo-panel="1" hidden className="imi-demo-panel">
              <p className="imi-preview-caption">Dari ide menjadi evaluasi.</p><h3>Konten dengan<br />konteks.</h3><div className="imi-content-preview"><div className="imi-content-cover"><span>for every you.</span><div className="imi-glasses" aria-hidden="true"><i /><b /><i /></div><small>Optik I See You</small></div><div><span className="imi-preview-caption">Jurnal konten</span><h4>Catat. Tinjau.<br />Pelajari.</h4><p>Reels, carousel dan Story.<br />Sumber, periode dan catatan PIC.</p></div></div><div className="imi-preview-footnote">Buka modul Konten untuk melihat data aktual.</div>
            </div>
            <div id="imi-panel-2" role="tabpanel" tabIndex={0} aria-labelledby="imi-tab-2" data-demo-panel="2" hidden className="imi-demo-panel">
              <p className="imi-preview-caption">Pekerjaan tim, lebih terarah.</p><h3>Dari catatan<br />ke tindak lanjut.</h3><div className="imi-operation-list"><div><span>01</span><strong>Rekap & evaluasi PIC</strong><small>Spreadsheet</small></div><div><span>02</span><strong>Hubungan pelanggan</strong><small>Aftersales</small></div><div><span>03</span><strong>Riset & kemitraan</strong><small>KOL, Venue, Pengajuan</small></div><div><span>04</span><strong>Persiapan meeting</strong><small>Laporan</small></div></div>
            </div>
          </div>
        </div>
        <div className="imi-device-bottom"><span>Pratinjau antarmuka</span><span>Visual ilustratif, bukan laporan performa</span></div>
      </div>
    </div>
  );
}

export function LandingView() {
  useEffect(() => mountLanding(), []);
  return (
    <div id="imi-landing" className="imi-landing">
      <a className="imi-skip" href="#imi-main">Lewati navigasi</a>
      <header className="imi-nav">
        <a href="/?intro=1" className="imi-brand" aria-label="I See You Intelligence beranda"><img src="/brand/logo-isy-dark.png" width="114" height="39" alt="Optik I See You" /><span>Intelligence</span></a>
        <nav aria-label="Navigasi landing page"><a href="#produk">Produk</a><a href="#ulasan">Ulasan Maps</a><a href="#alur">Alur kerja</a><a href="#cabang">Cabang</a></nav>
        <EntryButton className="imi-button-small">Buka workspace</EntryButton>
      </header>
      <main id="imi-main">
        <section className="imi-hero" aria-labelledby="imi-hero-title">
          <div className="imi-hero-copy"><p className="imi-eyebrow">I SEE YOU MARKETING INTELLIGENCE</p><h1 id="imi-hero-title">Lihat lebih jelas.<br /><span>Kerja lebih terarah.</span></h1><p className="imi-hero-description">Ruang kerja marketing untuk melihat performa konten, menyatukan aktivitas cabang, dan membawa konteks ke setiap keputusan.</p><div className="imi-hero-actions"><EntryButton>Masuk ke sistem</EntryButton><a href="#produk" className="imi-text-link">Jelajahi workspace</a></div><p className="imi-entry-note">Tanpa akun baru. Pilihan Anda diingat di perangkat ini.</p></div>
          <div className="imi-stage" data-stage><PreviewScreen /><div role="tablist" aria-label="Jelajahi pratinjau sistem" className="imi-product-tabs">{['Ringkasan', 'Konten', 'Operasional'].map((name, index) => <button key={name} id={`imi-tab-${index}`} role="tab" type="button" aria-selected={index === 0} aria-controls={`imi-panel-${index}`} tabIndex={index === 0 ? 0 : -1} data-demo-tab={index}>{name}</button>)}</div><div className="imi-stage-controls"><span>Gerakkan pointer untuk melihat perspektif.</span><button type="button" data-flat aria-pressed="false">Tampilan datar</button></div></div>
          <div className="imi-hero-bottom"><span>Dirancang untuk cara tim Anda bekerja.</span><div><span>Optik I See You</span><span className="imi-network-divider" /><span>Lunar Eyewear</span></div></div>
        </section>
        <section id="produk" className="imi-product" aria-labelledby="imi-product-title">
          <div className="imi-section-intro"><p className="imi-eyebrow">SATU RUANG KERJA</p><h2 id="imi-product-title">Pekerjaan yang terhubung.<br /><span>Pandangan yang utuh.</span></h2><p>Mulai dari konten yang dipublikasikan hingga hal yang perlu dibahas bersama. Temukan bagian pekerjaan Anda tanpa berpindah konteks.</p></div>
          <div className="imi-feature-lines"><article><span className="imi-index">01</span><div><h3>Konten & performa.</h3><p>Telusuri aktivitas konten, rekap Story, evaluasi Reels dan analytics. Lihat hasil bersama periode dan sumbernya.</p><div className="imi-module-names">Konten <span>·</span> Spreadsheet <span>·</span> Analytics</div></div></article><article><span className="imi-index">02</span><div><h3>Tim & operasional.</h3><p>Satukan rekap PIC, pengajuan kerja sama dan tindak lanjut pelanggan. Catatan pekerjaan tetap berada di tempat yang tepat.</p><div className="imi-module-names">Pengajuan <span>·</span> Aftersales <span>·</span> Evaluasi PIC</div></div></article><article><span className="imi-index">03</span><div><h3>Riset & keputusan.</h3><p>Susun konteks kompetitor, kandidat KOL dan pilihan venue. Bawa rangkuman yang relevan ke evaluasi mingguan.</p><div className="imi-module-names">Kompetitor <span>·</span> KOL <span>·</span> Venue <span>·</span> Laporan</div></div></article></div>
        </section>
        <section id="ulasan" className="imi-reviews" aria-labelledby="imi-reviews-title">
          <div className="imi-section-intro">
            <p className="imi-eyebrow">ULASAN GOOGLE MAPS TERKINI</p>
            <h2 id="imi-reviews-title">Dipercaya ribuan pelanggan.<br /><span>Ulasan riil setiap cabang.</span></h2>
            <p>Ulasan bintang 5 langsung dari Google Maps resmi seluruh gerai ritel. Pelayanan ramah, periksa mata akurat, dan pengerjaan faset kacamata cepat.</p>
          </div>
          <div className="imi-review-grid">
            {googleMapsReviews.map((rev) => (
              <article key={rev.id} className="imi-review-card">
                <div className="imi-review-header">
                  <span className="imi-review-stars">★★★★★</span>
                  <span className="imi-review-date">{rev.relativeDate}</span>
                </div>
                <p className="imi-review-text">&ldquo;{rev.text}&rdquo;</p>
                <div className="imi-review-author">
                  <strong>{rev.author}</strong>
                  <span>
                    <span>{rev.authorRole} · {rev.branchName}</span>
                    <a href={rev.mapUrl} target="_blank" rel="noopener noreferrer">Buka Maps ↗</a>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="alur" className="imi-workflow" aria-labelledby="imi-workflow-title"><div className="imi-workflow-top"><div><p className="imi-eyebrow">LANGSUNG KE PEKERJAAN ANDA</p><h2 id="imi-workflow-title">Lebih sedikit langkah.<br />Lebih banyak fokus.</h2></div><p>Tidak perlu membuat akun untuk membuka workspace. Mulai sekali, lalu lanjutkan dengan lebih praktis.</p></div><ol><li><span>01</span><h3>Pilih workspace.</h3><p>Seluruh jaringan atau cabang tempat Anda bekerja.</p></li><li><span>02</span><h3>Buka dashboard.</h3><p>Masuk ke sistem dan lanjutkan aktivitas tim.</p></li><li><span>03</span><h3>Kembali lebih cepat.</h3><p>Dengan pilihan diingat, kunjungan berikutnya langsung ke dashboard.</p></li></ol><div className="imi-workflow-bottom"><EntryButton className="imi-button-light">Mulai sekarang</EntryButton><span>Preferensi lokal. Tidak memberikan izin akses tambahan.</span></div></section>
        <section id="cabang" className="imi-branches" aria-labelledby="imi-branches-title"><div><p className="imi-eyebrow">SATU JARINGAN, KONTEKS LOKAL</p><h2 id="imi-branches-title">Dekat dengan<br />setiap cabang.</h2><p>Empat cabang Optik I See You dan Lunar Eyewear Tegal. Satu pintu masuk untuk pekerjaan marketing Anda.</p></div><div className="imi-branch-list">{branches.slice(1).map((branch) => <div key={branch.id}><h3>{branch.name}</h3><span>{branch.id === 'pwt' ? 'Optik I See You · Pusat' : branch.id === 'tgl' ? 'Lunar Eyewear' : 'Optik I See You'}</span></div>)}</div></section>
        <section className="imi-final" aria-labelledby="imi-final-title"><p className="imi-eyebrow">I SEE YOU INTELLIGENCE</p><h2 id="imi-final-title">Workspace Anda.<br /><span>Siap dilanjutkan.</span></h2><EntryButton>Buka workspace</EntryButton><p>Satu langkah menuju dashboard marketing.</p></section>
      </main>
      <footer className="imi-footer"><div><strong>I See You Intelligence</strong><span>Optik I See You & Lunar Eyewear</span></div><a href="#imi-main">Kembali ke atas</a><span>Marketing workspace</span></footer>
      <dialog className="imi-entry-dialog" data-workspace-dialog aria-labelledby="imi-entry-title" aria-describedby="imi-entry-description"><div className="imi-dialog-heading"><span>WORKSPACE</span><button type="button" data-close-workspace aria-label="Tutup pilihan workspace">Tutup</button></div><h2 id="imi-entry-title">Mulai dari<br />workspace Anda.</h2><p id="imi-entry-description">Pilih konteks kerja Anda. Dashboard tetap memberi akses ke seluruh modul yang tersedia.</p><div className="imi-workspace-choices" role="group" aria-label="Pilihan workspace">{branches.map((branch) => <button type="button" key={branch.id} data-workspace-choice={branch.id} data-label={branch.name} aria-pressed={branch.id === 'all'}><strong>{branch.name}</strong><span>{branch.detail}</span></button>)}</div><label className="imi-remember"><input type="checkbox" data-remember defaultChecked /><span>Ingat pilihan di perangkat ini<small>Kunjungan berikutnya langsung membuka dashboard.</small></span></label><div className="imi-selected-summary"><span>Workspace pilihan</span><strong data-selected-label>Seluruh jaringan</strong></div><button type="button" className="imi-button imi-enter-button" data-enter-workspace>Lanjut ke dashboard</button><p className="imi-dialog-note">Tidak memerlukan password. Akses bagian terlindungi tetap mengikuti izin sistem.</p></dialog>
      <div className="imi-returning" aria-live="polite"><div className="imi-returning-mark">IMI</div><p>Melanjutkan workspace Anda.</p><span data-entry-status>Membuka dashboard…</span><a href="/dashboard" data-dashboard-fallback>Lanjut ke dashboard</a></div>
      <noscript><div className="imi-noscript">Aktifkan JavaScript untuk mengingat perangkat. Anda tetap dapat <a href="/dashboard" data-dashboard-fallback>langsung membuka dashboard</a>.</div></noscript>
    </div>
  );
}
