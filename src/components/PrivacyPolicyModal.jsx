import React from 'react';
import { ShieldCheck, X, Lock, EyeOff, HardDrive, FileText } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-panel p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-glow-emerald">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Kebijakan Privasi & Keamanan Data</h3>
            <p className="text-xs text-slate-400">Komitmen perlindungan data dan privasi pengguna SpeedTest Pro</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <EyeOff className="w-4 h-4" />
              <span>1. Pengumpulan Data Nirkristal (Zero Tracking)</span>
            </div>
            <p className="text-slate-400">
              Aplikasi ini <strong>tidak pernah menjual, mengumpulkan, atau melacak informasi pribadi</strong> seperti nama, alamat email, atau aktivitas jelajah Anda.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <HardDrive className="w-4 h-4" />
              <span>2. Penyimpanan Riwayat Lokal (LocalStorage)</span>
            </div>
            <p className="text-slate-400">
              Riwayat hasil uji kecepatan disimpan secara aman dalam memori lokal perangkat Anda (browser LocalStorage). Anda memegang kendali penuh untuk menghapus riwayat kapan saja.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>3. Data Alamat IP & Telemetri ISP</span>
            </div>
            <p className="text-slate-400">
              Alamat IP publik dan penyedia ISP Anda hanya digunakan untuk menampilkan estimasi lokasi server target yang akurat di layar selama sesi pengetesan berlangsung.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>4. Disclaimer Independensi Branding</span>
            </div>
            <p className="text-slate-400">
              SpeedTest Pro adalah aplikasi analisis kinerja jaringan independen yang dikembangkan untuk tujuan diagnostik. Aplikasi ini tidak berafiliasi dengan Ookla LLC atau merek dagang Speedtest®.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-cyber text-white font-bold text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all"
        >
          Saya Mengerti & Setuju
        </button>
      </div>
    </div>
  );
}
