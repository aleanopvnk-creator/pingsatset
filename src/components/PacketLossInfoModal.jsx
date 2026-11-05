import React from 'react';
import { X, HelpCircle, Gamepad2, Video, Tv, Globe, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PacketLossInfoModal({ isOpen, onClose, packetLoss = 0, packetLossStatus = 'MEASURED' }) {
  const { t, lang } = useLanguage();
  if (!isOpen) return null;

  const lossVal = typeof packetLoss === 'number' ? packetLoss : parseFloat(packetLoss) || 0;

  // Packet Loss Indicator Badge
  const getIndicator = () => {
    if (packetLossStatus === 'UNMEASURABLE') {
      return {
        label: t('unmeasurable'),
        color: 'text-amber-500',
        badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-black',
        desc: lang === 'en' ? 'Measurement stopped due to network drop or firewall.' : 'Pengukuran terhenti karena masalah koneksi jaringan.'
      };
    }
    if (lossVal <= 0.5) {
      return {
        label: t('lossExcellent'),
        color: 'text-emerald-500',
        badgeBg: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-black',
        desc: lang === 'en' ? 'Network connection is ultra clean. Zero noticeable packet loss.' : 'Koneksi jaringan sangat bersih. Bebas packet loss.'
      };
    }
    if (lossVal <= 2.0) {
      return {
        label: t('lossGood'),
        color: 'text-yellow-600 dark:text-yellow-400',
        badgeBg: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/40 font-black',
        desc: lang === 'en' ? 'Minor packet loss detected, but does not disrupt regular web browsing.' : 'Terdapat sedikit hilangnya paket data, tetapi tidak mengganggu browsing biasa.'
      };
    }
    if (lossVal <= 5.0) {
      return {
        label: t('lossFair'),
        color: 'text-orange-600 dark:text-orange-400',
        badgeBg: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40 font-black',
        desc: lang === 'en' ? 'Noticeable packet loss during online gaming and video calls.' : 'Kehilangan paket terasa saat Online Gaming dan Video Call.'
      };
    }
    return {
      label: t('lossPoor'),
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 font-black',
      desc: lang === 'en' ? 'High packet loss. Connection is unstable and prone to disconnections.' : 'Kehilangan paket sangat tinggi. Koneksi tidak stabil dan berpotensi terputus.'
    };
  };

  const indicator = getIndicator();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel p-6 md:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/95 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-glow-cyan">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{t('packetLossModalTitle')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{t('packetLossModalSubtitle')}</p>
          </div>
        </div>

        {/* Current Packet Loss Status Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('currentLossResult')}</span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black border ${indicator.badgeBg}`}>
              {indicator.label}
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
              {packetLossStatus === 'UNMEASURABLE' ? 'N/A' : `${lossVal.toFixed(2)}%`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
              (Formula: [(Packets Sent - Packets Received) / Packets Sent] × 100)
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{indicator.desc}</p>
        </div>

        {/* Standards Grid */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-300">{t('lossStandardTitle')}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-emerald-500/30 shadow-sm">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 block">🟢 EXCELLENT</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">0.00% – 0.50%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-yellow-500/30 shadow-sm">
              <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-400 block">🟡 GOOD</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">0.51% – 2.00%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-orange-500/30 shadow-sm">
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 block">🟠 FAIR</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">2.01% – 5.00%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-rose-500/30 shadow-sm">
              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 block">🔴 POOR</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">&gt; 5.00%</span>
            </div>
          </div>
        </div>

        {/* What is Packet Loss & Causes */}
        <div className="space-y-4 mb-6 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <h4 className="font-black text-cyan-600 dark:text-cyan-400 uppercase">{t('whatIsLossTitle')}</h4>
            <p className="leading-relaxed font-semibold">
              {t('whatIsLossDesc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <h4 className="font-black text-purple-600 dark:text-purple-400 uppercase">{t('causesTitle')}</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 font-semibold">
              {lang === 'en' ? (
                <>
                  <li>Network traffic congestion on Wi-Fi router or ISP infrastructure (Bufferbloat).</li>
                  <li>Wi-Fi signal degradation through thick walls or electronic interference.</li>
                  <li>Faulty Ethernet LAN cable or loose RJ45 connector.</li>
                  <li>Modem/router hardware overheating.</li>
                </>
              ) : (
                <>
                  <li>Kongesti trafik pada router Wi-Fi atau jaringan ISP (Bufferbloat).</li>
                  <li>Sinyal Wi-Fi terganggu oleh dinding tebal atau perangkat elektronik lain.</li>
                  <li>Kabel LAN/Ethernet rusak atau memiliki konektor yang longgar.</li>
                  <li>Perangkat keras modem/router terlalu panas (overheating).</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Impact Matrix */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-300">{t('impactTitle')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 shadow-sm">
              <Gamepad2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">{t('actGameTitle')}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                  {lang === 'en' ? 'Causes character rubberbanding and unregistered inputs.' : "Menyebabkan teleportasi karakter ('rubberbanding') & input tidak terdaftar."}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 shadow-sm">
              <Video className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">{t('actMeetingTitle')}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                  {lang === 'en' ? 'Choppy robotic audio and video freezing.' : 'Suara terputus-putus (robot voice) dan video membeku.'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 shadow-sm">
              <Tv className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">{t('actStreamTitle')}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                  {lang === 'en' ? 'Repeated buffering and automatic resolution degradation to SD.' : 'Proses buffering berulang dan penurunan resolusi otomatis ke SD.'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start space-x-2.5 shadow-sm">
              <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">{t('actBrowseTitle')}</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                  {lang === 'en' ? 'Webpages fail to load assets or require page reloading.' : 'Halaman web gagal memuat aset atau membutuhkan muat ulang.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Fix Recommendations */}
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/30 space-y-2 shadow-sm">
          <h4 className="text-xs font-black uppercase text-cyan-800 dark:text-cyan-300 flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span>{t('howToFixTitle')}</span>
          </h4>
          <ol className="list-decimal list-inside text-xs text-slate-800 dark:text-slate-300 space-y-1.5 font-sans font-bold">
            {lang === 'en' ? (
              <>
                <li><strong>Use 5 GHz Wi-Fi Band:</strong> Switch from 2.4 GHz to 5 GHz to avoid neighborhood channel interference.</li>
                <li><strong>Use Wired Ethernet LAN Cable:</strong> Connect your PC/laptop with Cat6 Ethernet for 100% stable throughput.</li>
                <li><strong>Restart Modem/Router:</strong> Turn off router for 30 seconds to flush bufferbloat memory caches.</li>
                <li><strong>Contact ISP Support:</strong> If Packet Loss stays &gt;2% over Ethernet cable, ask ISP to verify Fiber Optic optical power.</li>
              </>
            ) : (
              <>
                <li><strong>Gunakan Frekuensi Wi-Fi 5 GHz:</strong> Pindah dari 2.4 GHz ke 5 GHz untuk mengurangi interferensi sinyal tetangga.</li>
                <li><strong>Gunakan Kabel Ethernet LAN:</strong> Sambungkan PC/Laptop langsung menggunakan kabel LAN Cat6 untuk kestabilan 100%.</li>
                <li><strong>Restart Modem Router:</strong> Matikan modem selama 30 detik lalu nyalakan kembali untuk mengosongkan cache bufferbloat.</li>
                <li><strong>Hubungi Customer Support ISP:</strong> Jika Packet Loss tetap &gt;2% pada kabel LAN, minta ISP memeriksa redaman kabel Fiber Optik Anda.</li>
              </>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
