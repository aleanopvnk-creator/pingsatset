import React, { useState, useEffect } from 'react';
import { Wifi, Sparkles } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [statusText, setStatusText] = useState('Mengecek koneksi internet...');
  const [progressPct, setProgressPct] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Step 1: Internet Check (0 - 500ms)
    const t1 = setTimeout(() => {
      setStatusText('Mengambil data IP & ISP...');
      setProgressPct(45);
    }, 500);

    // Step 2: Server Latency / Config Check (500 - 1100ms)
    const t2 = setTimeout(() => {
      setStatusText('Menghubungkan ke Node WebSocket Server...');
      setProgressPct(80);
    }, 1100);

    // Step 3: Initialization Ready (1100 - 1600ms)
    const t3 = setTimeout(() => {
      setStatusText('Siap!');
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
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0d14] flex flex-col items-center justify-center p-6 select-none transition-all duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm w-full text-center z-10">
        {/* Developer Brand Header */}
        <div className="flex items-center space-x-1.5 mb-6">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
            ALEANO
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </div>

        {/* Radar & Expanding Wi-Fi Wave Animated Icon Container */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Radar Pulse Rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-wave-1" />
          <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-wave-2" />
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-wave-3" />

          {/* Rotating Radar Sweep Line */}
          <div className="absolute inset-2 rounded-full border border-cyan-500/10 flex items-center justify-center">
            <div className="w-full h-full rounded-full border-t-2 border-cyan-400/60 animate-radar-sweep" />
          </div>

          {/* Central Glowing Icon Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-cyber p-0.5 shadow-glow-cyan flex items-center justify-center z-10 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Wifi className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Application Brand Title */}
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center space-x-1.5">
          <span>SpeedTest</span>
          <span className="text-gradient-cyan">Pro</span>
        </h1>

        {/* Tagline Subtitle */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
          Wi-Fi & Network Analyzer
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 rounded-full h-1.5 mt-8 border border-slate-800/80 overflow-hidden relative">
          <div
            className="bg-gradient-cyber h-full rounded-full transition-all duration-300 ease-out shadow-glow-cyan"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Initialization Status Text */}
        <div className="mt-3 text-xs font-mono text-slate-400 flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}
