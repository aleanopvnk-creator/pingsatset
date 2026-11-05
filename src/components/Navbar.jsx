import React, { useState } from 'react';
import {
  Activity,
  Gauge,
  History,
  Sun,
  Moon,
  Menu,
  X,
  Globe,
  Wifi,
  Instagram
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function TikTokIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.05a8.16 8.16 0 0 0 4.91 1.63v-3.5a4.85 4.85 0 0 1-1-.49z" />
    </svg>
  );
}

export default function Navbar({
  activeTab,
  setActiveTab,
  theme = 'dark',
  toggleTheme,
  wifiName = 'Wi-Fi',
  onOpenAbout,
  onOpenContact
}) {
  const { lang, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLight = theme === 'light';

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`w-full backdrop-blur-xl sticky top-0 z-50 border-b transition-all duration-300 ${isLight
        ? 'bg-white/95 border-slate-200/90 shadow-xs'
        : 'bg-[#070d18]/95 border-slate-800/80 shadow-xl'
      }`}>
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-2.5 sm:py-3">

        {/* Main Unified Bar */}
        <div className="flex items-center justify-between w-full gap-2 sm:gap-4 md:gap-6">

          {/* Left: Glowing Green / Cyan Pulse Logo & Brand Text */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
            onClick={() => handleTabSelect('speedtest')}
          >
            {/* Squircle Icon (Clean without colored glow light) */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 border ${isLight
                ? 'bg-cyan-500 text-white border-cyan-500/30 shadow-sm'
                : 'bg-cyan-500 text-slate-950 border-cyan-400/30 shadow-sm'
              }`}>
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div className="shrink-0 min-w-max">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight flex items-center leading-none whitespace-nowrap">
                <span className={isLight ? 'text-slate-950 font-black' : 'text-white font-black'}>Ping</span>
                <span className="text-cyan-500 dark:text-cyan-400 font-black ml-0.5">
                  SatSet
                </span>
              </h1>

              {/* Wi-Fi Status Tag (Subtle & compact) */}
              <div className="hidden sm:flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 inline-block" />
                <p className={`text-[10px] sm:text-[11px] font-black tracking-tight truncate max-w-[120px] md:max-w-[150px] lg:max-w-[240px] ${isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}>
                  {wifiName || (lang === 'en' ? 'Wi-Fi Connected' : 'Wi-Fi Terhubung')}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Simple Pill Container with ONLY 3 Items (Desktop Only - Responsive Labels) */}
          <nav className="hidden md:flex items-center shrink-0">
            <div className={`flex items-center gap-1 p-1 rounded-full border transition-all ${isLight
                ? 'bg-slate-100 border-slate-300 shadow-inner'
                : 'bg-slate-950/80 border-slate-700/80'
              }`}>
              {/* Item 1: SPEED TEST / UJI KECEPATAN */}
              <button
                onClick={() => handleTabSelect('speedtest')}
                className={`py-1.5 px-3 lg:px-4 xl:px-5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'speedtest'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                <Gauge className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'speedtest' ? 'text-slate-950 stroke-[2.8]' : 'text-slate-400 stroke-[2.2]'}`} />
                <span className="hidden lg:inline">{t('navSpeedTest')}</span>
                <span className="lg:hidden">{lang === 'en' ? 'Speed' : 'Uji'}</span>
              </button>

              {/* Item 2: NETWORK STABILITY / STABILITAS JARINGAN */}
              <button
                onClick={() => handleTabSelect('stability')}
                className={`py-1.5 px-3 lg:px-4 xl:px-5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'stability'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                <Activity className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'stability' ? 'text-slate-950 stroke-[2.8]' : 'text-slate-400 stroke-[2.2]'}`} />
                <span className="hidden xl:inline">{t('navStability')}</span>
                <span className="xl:hidden">{lang === 'en' ? 'Stability' : 'Stabilitas'}</span>
              </button>

              {/* Item 3: HISTORY / RIWAYAT */}
              <button
                onClick={() => handleTabSelect('history')}
                className={`py-1.5 px-3 lg:px-4 xl:px-5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'history'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                <History className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'history' ? 'text-slate-950 stroke-[2.8]' : 'text-slate-400 stroke-[2.2]'}`} />
                <span>{t('navHistory')}</span>
              </button>
            </div>
          </nav>

          {/* Right: Controls on Desktop (Clean Theme and Language toggles) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              title={isLight ? (lang === 'en' ? 'Switch to Dark Mode' : 'Ganti ke Mode Gelap') : (lang === 'en' ? 'Switch to Light Mode' : 'Ganti ke Mode Terang')}
            >
              {isLight ? (
                <Moon className="w-3.5 h-3.5 text-cyan-600 stroke-[2.5]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
              )}
              <span className="hidden lg:inline font-mono text-xs font-black uppercase">
                {isLight ? t('themeLight') : t('themeDark')}
              </span>
            </button>

            {/* Language Toggle Pill */}
            <button
              onClick={toggleLanguage}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              title={lang === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
              <span className="font-mono text-xs font-black uppercase text-cyan-700 dark:text-cyan-300">
                {lang.toUpperCase()}
              </span>
            </button>
          </div>

          {/* Right: Mobile Pill Controls (SatsetReels Style: [ 🌐 ID ] [ 🌙 ] [ ☰ ]) */}
          <div className="flex md:hidden items-center gap-1.5 xs:gap-2 shrink-0">
            {/* 1. Language Pill: [ 🌐 ID / EN ] */}
            <button
              onClick={toggleLanguage}
              className={`px-2.5 py-1.5 rounded-xl border font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              title="Ganti Bahasa / Switch Language"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
              <span className="font-mono text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-300">
                {lang.toUpperCase()}
              </span>
            </button>

            {/* 2. Theme Toggle Pill: [ 🌙 / ☀️ ] */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <Moon className="w-4 h-4 text-slate-800 stroke-[2.5]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" />
              )}
            </button>

            {/* 3. Mobile Hamburger Menu Toggle: [ ☰ / ✕ ] */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${isLight
                  ? isMobileMenuOpen
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-700'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900'
                  : isMobileMenuOpen
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              title="Menu"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Menu className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>

        </div>

        {/* SatsetReels Style Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all animate-fadeIn shadow-2xl space-y-4 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-[#0f172a] border-slate-800 text-slate-100'
          }`}>
            {/* Clean Navigation Links List (SatsetReels Style: simple text, left-aligned, no bulky buttons) */}
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleTabSelect('speedtest')}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'speedtest'
                    ? 'text-cyan-600 dark:text-cyan-400 font-black bg-cyan-500/10'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lang === 'en' ? 'Home / Speed Test' : 'Beranda'}
              </button>

              <button
                onClick={() => handleTabSelect('stability')}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'stability'
                    ? 'text-cyan-600 dark:text-cyan-400 font-black bg-cyan-500/10'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lang === 'en' ? 'Network Stability' : 'Stabilitas Jaringan'}
              </button>

              <button
                onClick={() => handleTabSelect('history')}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'text-cyan-600 dark:text-cyan-400 font-black bg-cyan-500/10'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lang === 'en' ? 'Test History' : 'Riwayat'}
              </button>

              <button
                onClick={() => handleTabSelect('tools')}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'tools'
                    ? 'text-cyan-600 dark:text-cyan-400 font-black bg-cyan-500/10'
                    : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {lang === 'en' ? 'Diagnostic Tools' : 'Alat Jaringan'}
              </button>

              {onOpenAbout && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAbout();
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {lang === 'en' ? 'About Us' : 'Tentang Kami'}
                </button>
              )}

              {onOpenContact && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {lang === 'en' ? 'Contact' : 'Hubungi Kami'}
                </button>
              )}
            </div>

            {/* Social Media Links: Instagram & TikTok (Official Links Requested by User) */}
            <div className={`pt-3 border-t flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 ${
              isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'
            }`}>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Media Sosial:
              </span>
              <div className="flex items-center gap-2">
                {/* Instagram Link */}
                <a
                  href="https://www.instagram.com/aaleano?rpxt=eGlsNnBveTkxbzl2&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/20 transition-all cursor-pointer"
                  title="Instagram @aaleano"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@aaleano</span>
                </a>

                {/* TikTok Link */}
                <a
                  href="https://www.tiktok.com/@aleeinhere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                  title="TikTok @aleeinhere"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                  <span>@aleeinhere</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
