import React, { useState } from 'react';
import { 
  Gauge, 
  Activity, 
  ShieldCheck, 
  Wifi, 
  Wrench, 
  FileText, 
  Scale, 
  HelpCircle, 
  Shield 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import GuideModal from './GuideModal';

export default function Footer({
  setActiveTab,
  setIsAboutOpen,
  setIsContactOpen,
  setIsPrivacyOpen,
  setIsTermsOpen,
}) {
  const { lang, t } = useLanguage();
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideInitialTab, setGuideInitialTab] = useState('steps');

  const isEn = lang === 'en';

  const handleNavClick = (tabKey) => {
    if (setActiveTab) {
      setActiveTab(tabKey);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGuide = (tabKey) => {
    setGuideInitialTab(tabKey);
    setGuideModalOpen(true);
  };

  return (
    <>
      <footer className="w-full border-t border-slate-300 dark:border-slate-800/80 bg-slate-100 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors pt-12 sm:pt-16 pb-8 px-4 sm:px-6 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-300 dark:border-slate-800/80">
            
            {/* Column 1: Brand & Tagline & Device Compatibility */}
            <div className="lg:col-span-4 space-y-4">
              {/* Brand Logo & Squircle Icon */}
              <div 
                onClick={() => handleNavClick('speedtest')}
                className="flex items-center gap-3.5 cursor-pointer select-none group w-fit"
              >
                {/* Clean Cyan-Emerald Gradient Squircle Icon (No Glowing Light) */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-slate-950 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-cyan-400/30">
                  <Activity className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* Vertically centered brand text */}
                <div className="flex items-center">
                  <span className="text-2xl sm:text-[26px] font-black tracking-tight text-slate-950 dark:text-white leading-none">
                    Ping<span className="text-cyan-500 dark:text-cyan-400 font-black">SatSet</span>
                  </span>
                </div>
              </div>

              {/* Tagline Description - 100% Indonesian in ID, 100% English in EN */}
              <p className="text-xs sm:text-[13px] footer-tagline leading-relaxed max-w-sm">
                {isEn
                  ? 'Instant internet speed & network telemetry diagnostic solution—measure download/upload bandwidth, latency ping, jitter, and Wi-Fi stability in real-time right from your browser without limits.'
                  : 'Solusi instan pengujian performa & diagnostik jaringan internet—analisis kecepatan unduh/unggah, latensi ping, variasi jeda, dan stabilitas Wi-Fi secara waktu-nyata langsung di peramban Anda tanpa batas.'}
              </p>

              {/* Compatible Platforms */}
              <div className="text-[11px] sm:text-xs footer-tagline font-semibold tracking-wide pt-1">
                {isEn 
                  ? 'iPhone / iPad • Android • Windows & Mac • Wi-Fi Router' 
                  : 'iPhone / iPad • Android • Windows & Mac • Router Wi-Fi'}
              </div>
            </div>

            {/* Column 2: LAYANAN JARINGAN (Pure Indonesian, No English mixed) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="text-xs sm:text-sm uppercase tracking-wider footer-heading-glow flex items-center gap-1.5">
                <span>{isEn ? 'NETWORK SERVICES' : 'LAYANAN JARINGAN'}</span>
              </h4>

              {/* Clean, unified cyan icons throughout (no rainbow colors, no upward arrow) */}
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <button
                    onClick={() => handleNavClick('speedtest')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Gauge className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Download Speed Test' : 'Uji Kecepatan Unduh'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('speedtest')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Upload Bandwidth Benchmark' : 'Uji Kecepatan Unggah'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('stability')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Ping Latency & Jitter Monitor' : 'Analisis Latensi & Ping Jitter'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('stability')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Packet Loss & Bufferbloat Test' : 'Uji Kehilangan Paket & Antrean'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('speedtest')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Wifi className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Wi-Fi Signal & Band Quality' : 'Diagnostik Frekuensi Sinyal Wi-Fi'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('stability')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Wrench className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Network Quality Assessment' : 'Analisis Kualitas Jaringan'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: PANDUAN & FITUR */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs sm:text-sm uppercase tracking-wider footer-heading-glow">
                {isEn ? 'GUIDES & FEATURES' : 'PANDUAN & FITUR'}
              </h4>

              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <button
                    onClick={() => handleNavClick('speedtest')}
                    className="footer-muted-link transition-colors cursor-pointer text-left"
                  >
                    {isEn ? 'Speed Test Home' : 'Beranda Utama'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openGuide('steps')}
                    className="footer-muted-link transition-colors cursor-pointer text-left"
                  >
                    {isEn ? 'How to Test (3 Steps)' : 'Cara Menguji (3 Langkah)'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openGuide('suitability')}
                    className="footer-muted-link transition-colors cursor-pointer text-left"
                  >
                    {isEn ? 'Gaming & Streaming Verdict' : 'Kelayakan Game & Streaming'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openGuide('advantages')}
                    className="footer-muted-link transition-colors cursor-pointer text-left"
                  >
                    {isEn ? 'PingSatSet Advantages' : 'Keunggulan PingSatSet'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openGuide('faq')}
                    className="footer-muted-link transition-colors cursor-pointer text-left"
                  >
                    {isEn ? 'Frequently Asked Questions' : 'Tanya Jawab (FAQ)'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsAboutOpen && setIsAboutOpen(true)}
                    className="footer-muted-link transition-colors cursor-pointer text-left"
                  >
                    {isEn ? 'About PingSatSet' : 'Mengenal PingSatSet'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: LEGALITAS & BANTUAN + Social Icons */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="text-xs sm:text-sm uppercase tracking-wider footer-heading-glow">
                {isEn ? 'LEGAL & SUPPORT' : 'LEGALITAS & BANTUAN'}
              </h4>

              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <button
                    onClick={() => setIsPrivacyOpen && setIsPrivacyOpen(true)}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Privacy Policy' : 'Kebijakan Privasi'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTermsOpen && setIsTermsOpen(true)}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Terms of Service' : 'Ketentuan Layanan'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openGuide('disclaimer')}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <Scale className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Diagnostic SLA Disclaimer' : 'Penafian Diagnostik (SLA)'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactOpen && setIsContactOpen(true)}
                    className="flex items-center gap-2.5 footer-muted-link transition-colors cursor-pointer group text-left w-full"
                  >
                    <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform stroke-[2.2]" />
                    <span>{isEn ? 'Help Center & Contact' : 'Pusat Bantuan & Kontak'}</span>
                  </button>
                </li>
              </ul>

              {/* Social Media Buttons (Clean Dark Slate with Cyan Glow Hover) */}
              <div className="pt-2 flex items-center gap-2.5">
                {/* Instagram: @aaleano */}
                <a
                  href="https://www.instagram.com/aaleano?rpxt=eGlsNnBveTkxbzl2&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all shadow-xs cursor-pointer"
                  title="Instagram: @aaleano"
                  aria-label="Instagram @aaleano"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>

                {/* TikTok: @aleeinhere */}
                <a
                  href="https://www.tiktok.com/@aleeinhere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:text-cyan-400 hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all shadow-xs cursor-pointer"
                  title="TikTok: @aleeinhere"
                  aria-label="TikTok @aleeinhere"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.05a8.16 8.16 0 0 0 4.91 1.63v-3.5a4.85 4.85 0 0 1-1-.49z"/>
                  </svg>
                </a>

                {/* WhatsApp: 08111644119 */}
                <a
                  href="https://wa.me/628111644119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all shadow-xs cursor-pointer"
                  title="WhatsApp: 08111644119"
                  aria-label="WhatsApp 08111644119"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Middle Section: Disclaimer Paragraph */}
          <div className="py-6 sm:py-7">
            <p className="text-[11px] sm:text-xs footer-disclaimer leading-relaxed text-justify sm:text-left">
              {isEn
                ? 'PingSatSet is an independent diagnostic and internet engineering utility designed for real-time testing of Wi-Fi bandwidth, latency jitter, packet loss, and ISP stability. Tests execute directly inside modern web browsers without gathering, profiling, or selling personal telemetry. Actual real-world metrics may be influenced by local radio frequency interference, router processing queues, client Wi-Fi chipset standards, and upstream transit carrier routes.'
                : 'PingSatSet adalah alat utilitas diagnostik independen dan rekayasa internet untuk pengujian kapasitas bandwidth, latensi ping, serta stabilitas koneksi Wi-Fi dan ISP. Seluruh pengujian berjalan secara waktu-nyata langsung melalui peramban web tanpa mengumpulkan atau menjual data pribadi pengguna. Hasil pengukuran dapat dipengaruhi oleh interferensi gelombang frekuensi, spesifikasi router, dan rute transit jaringan penyedia layanan.'}
            </p>
          </div>

          {/* Bottom Bar: Copyright on Left, Creator Credits on Right (No Arrow Up button) */}
          <div className="pt-5 border-t border-slate-300 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs footer-copyright">
            <p className="text-center sm:text-left font-medium">
              {isEn ? '© 2026 PingSatSet. All Rights Reserved.' : '© 2026 PingSatSet. Seluruh Hak Cipta Dilindungi.'}
            </p>

            <span className="text-[11px] sm:text-xs text-center sm:text-right font-medium">
              {isEn 
                ? 'Built for Network Engineers, Gamers & Wi-Fi Users' 
                : 'Dibuat untuk Teknisi Jaringan, Gamer & Pengguna Wi-Fi'}
            </span>
          </div>

        </div>
      </footer>

      {/* Interactive Guide & FAQ Modal */}
      <GuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        initialTab={guideInitialTab}
      />
    </>
  );
}
