import React from 'react';
import { User, Code, Activity, Shield, Globe, Cpu, Heart, CheckCircle2, Sparkles, Smartphone } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="w-full glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 my-8 space-y-8 animate-fadeIn">
      {/* Developer Profile Header */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-slate-800/80">
        <div className="w-20 h-20 rounded-3xl bg-gradient-cyber p-1 shadow-glow-cyan">
          <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
            <User className="w-10 h-10 text-cyan-400" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Code className="w-3.5 h-3.5" />
            <span>Core Engineering Team</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">PingSatSet Network Lab</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Platform independen pemantauan dan analisis performa jaringan berkecepatan tinggi dengan fokus pada transparansi, akurasi real-time, dan privasi penuh.
          </p>
        </div>
      </div>

      {/* About Application Description */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Globe className="w-5 h-5 text-purple-400" />
          <span>Tentang PingSatSet</span>
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          <strong>PingSatSet</strong> adalah platform aplikasi untuk mengukur kecepatan dan stabilitas koneksi internet secara akurat, real-time, dan sat-set. Menampilkan Download, Upload, Ping, Jitter, dan Packet Loss dengan tampilan modern serta responsif.
        </p>
      </div>

      {/* Highlights & Core Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="p-2.5 w-max rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Real-Time Streaming</h4>
          <p className="text-xs text-slate-400">
            Pengukuran bitrate download dan upload secara bersamaan menggunakan WebSocket streaming engine berkecepatan tinggi.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="p-2.5 w-max rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Multi Platform</h4>
          <p className="text-xs text-slate-400">
            Dapat digunakan di Android, iPhone, tablet, dan komputer langsung dari browser, serta dapat dipasang ke Home Screen seperti aplikasi.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <div className="p-2.5 w-max rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Deteksi Jaringan Telemetri</h4>
          <p className="text-xs text-slate-400">
            Dilengkapi deteksi otomatis Nama WiFi (SSID), indikator kekuatan sinyal (dBm & %), Public IP, ISP provider, serta riwayat hasil.
          </p>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>Teknologi Yang Digunakan</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {['React 18', 'Vite 5', 'Node.js', 'Express', 'WebSockets (ws)', 'Tailwind CSS', 'Chart.js', 'PWA Service Worker', 'Lucide Icons'].map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{tech}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900 border border-cyan-500/20 text-center">
        <p className="text-xs text-slate-300 flex items-center justify-center space-x-1.5 font-medium">
          <span>Dikembangkan secara independen oleh</span>
          <span className="text-gradient-cyan font-black">PingSatSet Team</span>
        </p>
      </div>
    </div>
  );
}
