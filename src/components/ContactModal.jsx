import React from 'react';
import { Mail, X, MessageSquare, Send, Globe, CheckCircle2, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function TikTokIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.05a8.16 8.16 0 0 0 4.91 1.63v-3.5a4.85 4.85 0 0 1-1-.49z" />
    </svg>
  );
}

export default function ContactModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 md:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/95 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-glow-cyan">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {lang === 'en' ? 'Contact Us' : 'Hubungi Kami'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              {lang === 'en' ? 'PingSatSet Support & Network Feedback' : 'Bantuan, Masukan & Informasi Server PingSatSet'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 space-y-2 shadow-sm">
            <p className="text-slate-950 dark:text-slate-100 font-bold text-xs sm:text-sm">
              {lang === 'en'
                ? 'Have suggestions, reporting telemetry bugs, or interested in hosting an edge speed test node? Reach out to our technical team:'
                : 'Punya saran pengembangan, kendala teknis telemetri, atau ingin mendaftarkan server node baru untuk pengujian? Hubungi tim teknis kami melalui:'}
            </p>
            <div className="pt-2 space-y-2">
              <a
                href="https://wa.me/628111644119"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black hover:underline text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp: 0811-1644-119</span>
              </a>
              <a
                href="https://www.instagram.com/aaleano?rpxt=eGlsNnBveTkxbzl2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-pink-600 dark:text-pink-400 font-black hover:underline text-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram: @aaleano</span>
              </a>
              <a
                href="https://www.tiktok.com/@aleeinhere"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-black hover:underline text-sm"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok: @aleeinhere</span>
              </a>
              <a
                href="mailto:support@pingsatset.net"
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-black hover:underline text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>support@pingsatset.net</span>
              </a>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 font-bold text-xs pt-1">
                <Globe className="w-4 h-4 text-cyan-500" />
                <span>https://pingsatset.net</span>
              </div>
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
