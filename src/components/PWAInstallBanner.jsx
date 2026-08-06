import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share } from 'lucide-react';

export default function PWAInstallBanner() {
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

    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    if (iosDevice) {
      setShowBanner(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
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

  if (installed || !showBanner) return null;

  return (
    <>
      {/* Floating Top/Bottom Install Banner */}
      <div className="w-full glass-panel border-cyan-500/30 bg-cyan-950/40 p-3 md:p-4 rounded-2xl mb-6 flex items-center justify-between shadow-glow-cyan animate-pulse-glow">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Smartphone className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
              INSTALL APLIKASI SPEEDTEST PRO
            </h4>
            <p className="text-xs text-slate-300">
              Pasang ke Home Screen untuk akses cepat dari Android, iPhone, & PC.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 whitespace-nowrap active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>INSTALL APP</span>
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/40 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
              <Share className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cara Install di iPhone / iPad</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. Tekan tombol <strong className="text-cyan-400">Share</strong> (Bagikan) di bagian bawah browser Safari.<br />
              2. Gulir ke bawah lalu pilih <strong className="text-cyan-400">"Add to Home Screen"</strong> (Tambah ke Utama).<br />
              3. Tekan <strong className="text-cyan-400">Add</strong> di pojok kanan atas.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              MENGERTI
            </button>
          </div>
        </div>
      )}
    </>
  );
}
