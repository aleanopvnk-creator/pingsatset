import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  Gauge, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  Gamepad2, 
  Tv, 
  AlertTriangle, 
  ArrowRight,
  Scale,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GuideModal({ isOpen, onClose, initialTab = 'steps' }) {
  const { lang } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState(initialTab);

  // Sync initial tab when opening
  React.useEffect(() => {
    if (isOpen) {
      setActiveSubTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isEn = lang === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel p-5 sm:p-7 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0b0f19] shadow-2xl relative max-h-[88vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shadow-sm active:scale-95"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 pr-8">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-glow-cyan shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white uppercase tracking-wider">
              {isEn ? 'PingSatSet Network Guide' : 'Panduan & Fitur PingSatSet'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
              {isEn 
                ? 'Wi-Fi Speed Test & Internet Engineering Knowledge Base' 
                : 'Pusat Panduan Uji Kecepatan Wi-Fi & Rekayasa Jaringan Internet'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 mb-5">
          <button
            onClick={() => setActiveSubTab('steps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'steps'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'
            }`}
          >
            {isEn ? '3 Steps Guide' : 'Cara Uji (3 Langkah)'}
          </button>
          <button
            onClick={() => setActiveSubTab('advantages')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'advantages'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Advantages' : 'Keunggulan'}
          </button>
          <button
            onClick={() => setActiveSubTab('suitability')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'suitability'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Gaming & Streaming' : 'Kelayakan Gaming'}
          </button>
          <button
            onClick={() => setActiveSubTab('faq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'faq'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'
            }`}
          >
            {isEn ? 'FAQ' : 'Tanya Jawab (FAQ)'}
          </button>
          <button
            onClick={() => setActiveSubTab('disclaimer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'disclaimer'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'
            }`}
          >
            {isEn ? 'SLA Disclaimer' : 'Penafian (SLA)'}
          </button>
        </div>

        {/* Tab 1: Cara Uji Kecepatan (3 Langkah) */}
        {activeSubTab === 'steps' && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300 text-xs font-bold leading-relaxed">
              {isEn 
                ? 'Perform high-precision Wi-Fi and fiber optic internet speed tests in 3 simple steps without registering or downloading plugins.'
                : 'Lakukan uji kecepatan Wi-Fi dan internet fiber optik secara akurat dalam 3 langkah mudah tanpa perlu login atau instalasi aplikasi tambahan.'}
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                    {isEn ? 'Connect to Target Wi-Fi or LAN' : 'Hubungkan Perangkat ke Wi-Fi / Kabel LAN'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                    {isEn 
                      ? 'Ensure your smartphone, laptop, or PC is connected to the network you want to diagnose. Close heavy background downloads for authentic results.'
                      : 'Pastikan smartphone, laptop, atau komputer tersambung ke jaringan Wi-Fi atau kabel LAN yang ingin diuji. Nonaktifkan unduhan berat latar belakang untuk hasil yang murni.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                  2
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                    {isEn ? 'Press "Start Speed Test"' : 'Tekan Tombol "Mulai Tes Kecepatan"'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                    {isEn 
                      ? 'Click the speedometer gauge. PingSatSet will instantaneously ping nearest node, measure jitter, stream download payload, and benchmark upload duplex.'
                      : 'Klik tombol di tengah speedometer gauge. Engine PingSatSet akan langsung mengukur latensi ping terdekat, jitter, kecepatan unduh (download), dan unggah (upload).'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm shadow-sm">
                  3
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                    {isEn ? 'Review Diagnostic Verdict & Share' : 'Analisis Hasil Diagnostik & Bagikan Sertifikat'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                    {isEn 
                      ? 'Inspect your Packet Loss, Bufferbloat score, and suitability ratings for Gaming & 4K Streaming. Download the certified PNG result or copy the ISP report.'
                      : 'Periksa indikator Packet Loss, Bufferbloat, serta kelayakan koneksi untuk Game Online dan Streaming 4K. Anda dapat mengunduh sertifikat PNG atau menyalin laporan untuk komplain ke ISP.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Keunggulan PingSatSet */}
        {activeSubTab === 'advantages' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-black text-xs sm:text-sm">
                <Zap className="w-4 h-4" />
                <span>{isEn ? 'High-Precision WebSocket Duplex' : 'WebSocket Duplex Streaming Sat-Set'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                {isEn 
                  ? 'Real-time bidirectional data pipe without the latency overhead of conventional HTTP polling.' 
                  : 'Pengukuran bandwidth secara streaming kontinu dua arah tanpa delay overhead HTTP polling konvensional.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{isEn ? '100% Zero Invasive Tracking' : '100% Bebas Pelacakan & Tanpa Iklan Intrusif'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                {isEn 
                  ? 'We do not collect personal identifiers, sell browsing patterns, or slow down your device with tracker scripts.' 
                  : 'Kami tidak mengumpulkan identitas pribadi, riwayat penjelajahan, atau memberatkan gawai Anda dengan skrip iklan pelacak.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-xs sm:text-sm">
                <Activity className="w-4 h-4" />
                <span>{isEn ? 'Full Internet Engineering Telemetry' : 'Telemetri Lengkap Internet Engineering'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                {isEn 
                  ? 'Detailed metrics including Packet Loss, Jitter, Bufferbloat score, Traceroute, DNS lookup, and Wi-Fi signal rating.' 
                  : 'Mencakup analisis mendalam: Packet Loss, Jitter variasi, Skor Bufferbloat, Traceroute hop, uji DNS, dan kualitas sinyal Wi-Fi.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-black text-xs sm:text-sm">
                <Wifi className="w-4 h-4" />
                <span>{isEn ? 'PWA Multi-Device Ready' : 'Dukungan Lintas Perangkat & PWA'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                {isEn 
                  ? 'Runs smoothly across iPhone, iPad, Android, Mac, and Windows with offline caching & installable home screen icon.' 
                  : 'Berjalan mulus di iPhone, iPad, Android, macOS, dan Windows. Dapat dipasang ke Layar Utama (Home Screen) sebagai PWA.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Kelayakan Gaming & Streaming */}
        {activeSubTab === 'suitability' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-black text-xs sm:text-sm">
                <Gamepad2 className="w-4 h-4" />
                <span>{isEn ? 'Gaming Standards (Valorant, MLBB, Free Fire, PUBG)' : 'Standar Game Online (Valorant, Mobile Legends, PUBG)'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                {isEn 
                  ? 'Ping < 20ms: Ultra Smooth (Competitive Tier). Ping 20-50ms: Smooth. Ping > 80ms: Noticeable input lag. Packet loss > 0% causes character rubberbanding.' 
                  : 'Ping < 20ms: Sangat Lancar (Level Kompetitif). Ping 20-50ms: Cukup Lancar. Ping > 80ms: Terasa delay respons. Packet loss di atas 0% menyebabkan karakter patah-patah.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs sm:text-sm">
                <Tv className="w-4 h-4" />
                <span>{isEn ? 'Streaming Standards (YouTube 4K, Netflix, TikTok)' : 'Standar Streaming Video (YouTube 4K, Netflix, TikTok)'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                {isEn 
                  ? '4K Ultra HD requires stable > 25 Mbps download. Full HD 1080p requires > 10 Mbps. Jitter stability ensures instant video buffer without stutter.' 
                  : 'Streaming 4K Ultra HD membutuhkan minimal 25 Mbps stabil. Full HD 1080p membutuhkan minimal 10 Mbps. Kestabilan jitter memastikan video terputar instan tanpa jeda buffering.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: FAQ */}
        {activeSubTab === 'faq' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                {isEn ? 'Why does Wi-Fi speed differ from my ISP package rate?' : 'Mengapa kecepatan Wi-Fi berbeda dengan paket langganan ISP saya?'}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                {isEn 
                  ? 'Wi-Fi signals are subject to physical obstacles, distance from router, and radio frequency interference on 2.4 GHz channels. For true bandwidth testing, connect via Gigabit Ethernet cable or 5 GHz Wi-Fi.' 
                  : 'Sinyal Wi-Fi dipengaruhi oleh dinding pemisah, jarak ke router, dan interferensi frekuensi 2.4 GHz dari perangkat lain. Untuk menguji bandwidth murni paket langganan, gunakan kabel LAN atau frekuensi 5 GHz dekat router.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                {isEn ? 'What is Bufferbloat and how can I resolve it?' : 'Apa itu Bufferbloat dan bagaimana cara mengatasinya?'}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                {isEn 
                  ? 'Bufferbloat is latency spike caused by router buffering during heavy upload/download. It can be eliminated by enabling Smart Queue Management (SQM) or QoS in router settings.' 
                  : 'Bufferbloat adalah lonjakan latensi (lag parah) saat ada anggota keluarga yang mengunduh file besar. Solusi terbaik adalah mengaktifkan fitur SQM (Smart Queue Management) atau QoS pada router.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                {isEn ? 'Is my IP address or personal data stored?' : 'Apakah alamat IP atau data pribadi saya disimpan?'}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1 leading-relaxed">
                {isEn 
                  ? 'No. All speed test history is saved exclusively within your local browser storage (LocalStorage). We do not keep logs or build advertising profiles.' 
                  : 'Tidak. Seluruh riwayat hasil uji hanya disimpan secara lokal di browser Anda (LocalStorage). Kami tidak membangun profil iklan atau menjual data koneksi pengguna.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: SLA Disclaimer */}
        {activeSubTab === 'disclaimer' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs sm:text-sm">
              <Scale className="w-4 h-4" />
              <span>{isEn ? 'Diagnostic Service Level Disclaimer' : 'Penafian Layanan Diagnostik Jaringan'}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
              {isEn 
                ? 'PingSatSet is an independent utility engine. Results reflect point-in-time network state. Hardware bottlenecks, Wi-Fi channel crowding, carrier throttling, and inter-city transit hops may affect live results. Use these telemetry metrics as diagnostic references when communicating with your Internet Service Provider.' 
                : 'PingSatSet adalah alat diagnostik utilitas independen. Hasil pengukuran merefleksikan kondisi aktual saat pengujian dijalankan. Batasan perangkat keras (chipset Wi-Fi), interferensi frekuensi, kebijakan FUP ISP, dan rute transit antarkota dapat memengaruhi hasil. Gunakan metrik ini sebagai referensi diagnostik valid saat berdiskusi dengan penyedia ISP Anda.'}
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
          >
            {isEn ? 'Close' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
}
