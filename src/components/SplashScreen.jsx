import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SplashScreen({ onFinish }) {
  const { lang } = useLanguage();
  const [statusText, setStatusText] = useState(lang === 'en' ? 'Checking network connection...' : 'Mengecek koneksi internet...');
  const [progressPct, setProgressPct] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Step 1: Internet Check (0 - 500ms)
    const t1 = setTimeout(() => {
      setStatusText(lang === 'en' ? 'Fetching IP & ISP telemetry...' : 'Mengambil data IP & ISP...');
      setProgressPct(45);
    }, 500);

    // Step 2: Server Latency / Config Check (500 - 1100ms)
    const t2 = setTimeout(() => {
      setStatusText(lang === 'en' ? 'Connecting to WebSocket speed nodes...' : 'Menghubungkan ke Node WebSocket Server...');
      setProgressPct(80);
    }, 1100);

    // Step 3: Initialization Ready (1100 - 1600ms)
    const t3 = setTimeout(() => {
      setStatusText(lang === 'en' ? 'PingSatSet Ready!' : 'PingSatSet Siap!');
      setProgressPct(100);
    }, 1600);

    // Step 4: Fade Out Overlay & Finish (1800ms)
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    const t5 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish, lang]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070a10] splash-screen flex flex-col items-center justify-center p-6 select-none transition-all duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ backgroundColor: '#070a10', color: '#ffffff' }}
    >
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-3xl pointer-events-none -bottom-20 -right-20" />
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-[320px] sm:max-w-sm w-full text-center z-10 px-2">
        {/* Developer Brand Header */}
        <div className="flex items-center space-x-1.5 mb-4 sm:mb-6">
          <span 
            className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-cyan-300 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border-2 border-cyan-400/50 shadow-[0_0_18px_rgba(6,182,212,0.4)]"
            style={{ backgroundColor: '#0b162c' }}
          >
            PINGSATSET ULTRA ENGINE
          </span>
        </div>

        {/* Radar & Expanding Wi-Fi Wave Animated Icon Container */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-4 sm:mb-6">
          {/* Thick Radar Pulse Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-wave-1" />
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-wave-2" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/35 animate-wave-3" />

          {/* Rotating Radar Sweep Line */}
          <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-t-[3px] border-cyan-300 animate-radar-sweep shadow-[0_0_20px_rgba(6,182,212,1)]" />
          </div>

          {/* Central Bold & Thick Icon Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 p-[2px] sm:p-[2.5px] shadow-[0_0_40px_rgba(6,182,212,0.7)] flex items-center justify-center z-10">
            <div 
              className="w-full h-full rounded-[18px] sm:rounded-[22px] flex items-center justify-center border-2 border-cyan-400/40 shadow-inner"
              style={{ backgroundColor: '#090d16' }}
            >
              <Wifi 
                size={38} 
                strokeWidth={3.6} 
                className="text-cyan-300 filter drop-shadow-[0_0_15px_rgba(6,182,212,1)] sm:hidden" 
              />
              <Wifi 
                size={48} 
                strokeWidth={3.6} 
                className="text-cyan-300 filter drop-shadow-[0_0_15px_rgba(6,182,212,1)] hidden sm:block" 
              />
            </div>
          </div>
        </div>

        {/* Application Brand Title */}
        <div className="flex items-center justify-center">
          <h1 className="text-3xl xs:text-4xl md:text-5xl font-black tracking-tight flex items-center space-x-2">
            <span 
              className="font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]"
              style={{ color: '#ffffff' }}
            >
              Ping
            </span>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-400 filter drop-shadow-[0_0_25px_rgba(6,182,212,0.9)]">
              SatSet
            </span>
          </h1>
        </div>

        {/* Tagline Subtitle */}
        <p 
          className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-2.5 sm:mt-3 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]"
          style={{ color: '#38bdf8' }}
        >
          {lang === 'en' ? 'Ultra-Fast Wi-Fi & Internet Speed Analyzer' : 'Tes Kecepatan & Stabilitas Internet Sat-Set'}
        </p>

        {/* Thick Progress Bar Container */}
        <div 
          className="w-full rounded-full h-3 sm:h-3.5 mt-6 sm:mt-8 border-2 border-cyan-500/40 overflow-hidden relative p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          style={{ backgroundColor: '#090d16' }}
        >
          <div
            className="bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.95)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Initialization Status Text */}
        <div 
          className="mt-3.5 sm:mt-4 text-xs md:text-sm font-mono font-extrabold flex items-center justify-center space-x-2"
          style={{ color: '#e2e8f0' }}
        >
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)] shrink-0 animate-pulse" />
          <span className="tracking-wide truncate max-w-[260px] sm:max-w-none">{statusText}</span>
        </div>
      </div>
    </div>
  );
}
