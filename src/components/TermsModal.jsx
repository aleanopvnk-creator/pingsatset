import React from 'react';
import { FileText, X, CheckCircle2, AlertCircle, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsModal({ isOpen, onClose }) {
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
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {lang === 'en' ? 'Terms & Conditions' : 'Syarat & Ketentuan Penggunaan'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              {lang === 'en' ? 'Guidelines for using PingSatSet Network Diagnostics' : 'Ketentuan penggunaan platform pengujian jaringan PingSatSet'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400 font-black">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'en' ? '1. Purpose of Service' : '1. Tujuan Layanan'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'PingSatSet provides real-time internet speed, latency, jitter, and packet stability diagnostic tools for personal and professional network evaluation free of charge.'
                : 'PingSatSet menyediakan fasilitas uji kecepatan unduh/unggah, latensi ping, jitter, dan stabilitas paket data untuk keperluan evaluasi performa jaringan secara gratis.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-black">
              <FileText className="w-4 h-4" />
              <span>{lang === 'en' ? '2. Fair Usage Policy' : '2. Kebijakan Penggunaan Wajar'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'Automated scripting or artificial flooding of test servers beyond normal personal testing thresholds is prohibited to ensure equal bandwidth availability for all global users.'
                : 'Pengguna dilarang melakukan flooding traffic atau eksploitasi otomatis yang membebani server uji coba secara tidak wajar guna menjaga ketersediaan bandwidth bagi seluruh pengguna.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-black">
              <AlertCircle className="w-4 h-4" />
              <span>{lang === 'en' ? '3. Accuracy Disclaimer' : '3. Batasan Tanggung Jawab & Akurasi'}</span>
            </div>
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'Test results represent network conditions at the exact moment of testing. External factors such as Wi-Fi interference, ISP congestion, and client hardware may affect live results.'
                : 'Hasil pengujian merefleksikan kondisi koneksi pada saat pengujian berlangsung. Faktor eksternal seperti interferensi frekuensi Wi-Fi, beban ISP, dan perangkat keras dapat memengaruhi hasil.'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Understood' : 'Saya Mengerti'}
          </button>
        </div>
      </div>
    </div>
  );
}
