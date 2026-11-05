import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PWAInstallBanner() {
  const { lang } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setInstalled(true);
      return;
    }

    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem('pingsatset_pwa_dismissed')) {
        return;
      }
    } catch (e) {}

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    if (iosDevice) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      try {
        if (!sessionStorage.getItem('pingsatset_pwa_dismissed')) {
          setShowBanner(true);
        }
      } catch (err) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('pingsatset_pwa_dismissed', 'true');
    } catch (e) {}
  };

  if (installed || !showBanner) return null;

  return (
    <>
      {/* Floating Top/Bottom Install Banner (Responsive Stacking on Mobile) */}
      <div className="w-full glass-panel border border-cyan-500/40 bg-white/95 dark:bg-cyan-950/40 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 shadow-sm shrink-0 mt-0.5 sm:mt-0">
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1">
              <span>{lang === 'en' ? 'INSTALL PINGSATSET APP' : 'PASANG APLIKASI PINGSATSET'}</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
              {lang === 'en' ? 'Add PingSatSet to Home Screen for fast sat-set access from Android, iPhone, & PC.' : 'Pasang PingSatSet ke Layar Utama untuk akses cepat sat-set dari Android, iPhone, & PC.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 sm:px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'en' ? 'INSTALL APP' : 'PASANG APP'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/40 bg-white dark:bg-slate-950 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center">
              <Share className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {lang === 'en' ? 'How to Install on iPhone / iPad' : 'Cara Pasang di iPhone / iPad'}
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
              {lang === 'en' ? (
                <>
                  1. Tap the <strong className="text-cyan-600 dark:text-cyan-400">Share</strong> button at the bottom of Safari.<br />
                  2. Scroll down and choose <strong className="text-cyan-600 dark:text-cyan-400">"Add to Home Screen"</strong>.<br />
                  3. Tap <strong className="text-cyan-600 dark:text-cyan-400">Add</strong> at the top right corner.
                </>
              ) : (
                <>
                  1. Tekan tombol <strong className="text-cyan-600 dark:text-cyan-400">Bagikan (Share)</strong> di bagian bawah browser Safari.<br />
                  2. Gulir ke bawah lalu pilih <strong className="text-cyan-600 dark:text-cyan-400">"Tambah ke Layar Utama"</strong>.<br />
                  3. Tekan <strong className="text-cyan-600 dark:text-cyan-400">Tambah</strong> di pojok kanan atas.
                </>
              )}
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
            >
              {lang === 'en' ? 'GOT IT' : 'MENGERTI'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
