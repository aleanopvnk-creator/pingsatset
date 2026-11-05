import React from 'react';
import { Info, X, Activity, Smartphone, Shield, Zap, Globe, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel p-6 md:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/95 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-glow-cyan">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {lang === 'en' ? 'About PingSatSet' : 'Tentang PingSatSet'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              {lang === 'en' ? 'High Precision Internet Performance & Stability Platform' : 'Platform Analisis Performa dan Stabilitas Jaringan Internet Real-Time'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <p className="text-slate-950 dark:text-slate-100 leading-relaxed font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'PingSatSet is a high-speed, independent diagnostic utility designed to measure real-world internet speed, latency jitter, and packet stability with zero tracking. Engineered for gamers, remote workers, and network professionals who demand honest and instantaneous metrics.'
                : 'PingSatSet adalah platform independen yang dirancang untuk mengukur kecepatan unduh, unggah, latensi respon (ping), jitter, dan kestabilan paket data secara instan, akurat, dan transparan tanpa pelacakan data pribadi.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-black">
                <Activity className="w-4 h-4" />
                <span>WebSocket Engine</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                {lang === 'en'
                  ? 'High-throughput duplex streaming engine delivering sub-second accuracy.'
                  : 'Mesin streaming WebSocket ganda untuk pengukuran throughput berakurasi tinggi.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-black">
                <Shield className="w-4 h-4" />
                <span>100% Zero Tracking</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                {lang === 'en'
                  ? 'All diagnostics run locally with no analytics or invasive user profiling.'
                  : 'Seluruh riwayat disimpan di browser lokal tanpa profil atau pelacak pihak ketiga.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
}
