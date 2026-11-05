import React from 'react';
import { ShieldCheck, X, Lock, EyeOff, HardDrive, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
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
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-glow-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {lang === 'en' ? 'Privacy Policy & Data Protection' : 'Kebijakan Privasi & Keamanan Data'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              {lang === 'en' ? 'Our commitment to your security and zero-tracking guarantee' : 'Komitmen perlindungan data dan privasi pengguna PingSatSet'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 font-black">
              <EyeOff className="w-4 h-4" />
              <span>{lang === 'en' ? '1. Zero-Tracking Guarantee' : '1. Pengumpulan Data Nirkristal (Zero Tracking)'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'This web application never collects, sells, or tracks any personal identifiers, browsing history, or private data.'
                : 'Aplikasi ini tidak pernah menjual, mengumpulkan, atau melacak informasi pribadi seperti nama, alamat email, atau aktivitas jelajah Anda.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-black">
              <HardDrive className="w-4 h-4" />
              <span>{lang === 'en' ? '2. Local-First Device Storage' : '2. Penyimpanan Riwayat Lokal (LocalStorage)'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'Your speed test history is stored strictly on your local browser memory (LocalStorage). You retain 100% control to clear or export it at any time.'
                : 'Riwayat hasil uji kecepatan disimpan secara aman dalam memori lokal perangkat Anda (browser LocalStorage). Anda memegang kendali penuh untuk menghapus riwayat kapan saja.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-black">
              <Lock className="w-4 h-4" />
              <span>{lang === 'en' ? '3. IP Address & Telemetry Data' : '3. Data Alamat IP & Telemetri ISP'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'Your public IP and ISP information are only read ephemerally to accurately pinpoint network routing and server latency during the active test session.'
                : 'Alamat IP publik dan penyedia ISP Anda hanya digunakan untuk menampilkan estimasi lokasi server target yang akurat di layar selama sesi pengetesan berlangsung.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-black">
              <FileText className="w-4 h-4" />
              <span>{lang === 'en' ? '4. Independence Disclaimer' : '4. Disclaimer Independensi Branding'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'PingSatSet is an independent network diagnostics platform built for community benchmarking. It is not affiliated with Ookla LLC or registered Speedtest® trademarks.'
                : 'PingSatSet adalah platform aplikasi analisis kinerja jaringan independen yang dikembangkan untuk tujuan diagnostik sat-set. Aplikasi ini tidak berafiliasi dengan Ookla LLC atau merek dagang Speedtest®.'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-cyber text-slate-950 font-black text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
        >
          {lang === 'en' ? 'I Understand & Agree' : 'Saya Mengerti & Setuju'}
        </button>
      </div>
    </div>
  );
}
