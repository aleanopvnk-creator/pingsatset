import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Activity, Signal, CheckCircle2, Sparkles, Share2, AlertTriangle, AlertCircle } from 'lucide-react';
import ActivityRatings from './ActivityRatings';

export default function MetricsCards({ download, downloadPeak, upload, uploadPeak, ping, jitter, packetLoss = 0, stage, onShare }) {
  // Quality rating calculation
  const getQualityRating = () => {
    if (download === 0 && upload === 0) return { label: 'Awaiting Speed Test', grade: '--', color: 'text-slate-500', bufferbloat: 'N/A' };
    if (download >= 50 && ping <= 20 && jitter <= 5) {
      return { label: 'Sangat Cepat - Sempurna untuk 4K Streaming & Competitive Gaming', grade: 'A+', color: 'text-emerald-400', bufferbloat: 'A+ (Bebas Lag)' };
    }
    if (download >= 20 && ping <= 50 && jitter <= 15) {
      return { label: 'Bagus - Halus untuk HD Video Call & Daily Browsing', grade: 'B', color: 'text-cyan-400', bufferbloat: 'B (Stabil)' };
    }
    if (download >= 5 && ping <= 90) {
      return { label: 'Cukup - Standar Browsing & Chatting', grade: 'C', color: 'text-amber-400', bufferbloat: 'C (Sedang)' };
    }
    return { label: 'Koneksi Lambat / Potensi Lag Bermain Game', grade: 'D', color: 'text-rose-400', bufferbloat: 'F (Tinggi / Lag)' };
  };

  const rating = getQualityRating();
  const isPoorConnection = (ping > 100 || packetLoss > 2 || (download > 0 && download < 5));

  return (
    <div className="w-full space-y-4">
      {/* Network Health Warning Alert Banner for poor connections */}
      {isPoorConnection && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Peringatan: Performa Koneksi Terdeteksi Rendah</p>
              <p className="text-[11px] text-slate-300">
                {ping > 100 ? 'Latensi tinggi (>100ms) dapat menyebabkan delay.' : packetLoss > 2 ? 'Terdapat kehilangan paket (packet loss > 2%).' : 'Kecepatan unduh kurang dari 5 Mbps.'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-xs uppercase">
            WARNING
          </span>
        </div>
      )}

      {/* 5 Primary Metric Glass Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Download Card */}
        <div className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 ${stage === 'download' ? 'border-cyan-500/60 shadow-glow-cyan' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Download</span>
            <ArrowDownCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{download > 0 ? download.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-bold text-slate-400">Mbps</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 font-mono">
            Peak: <span className="text-slate-300 font-semibold">{downloadPeak > 0 ? downloadPeak.toFixed(1) : '0.0'} Mbps</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 ${stage === 'upload' ? 'border-purple-500/60 shadow-glow-purple' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upload</span>
            <ArrowUpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{upload > 0 ? upload.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-bold text-slate-400">Mbps</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 font-mono">
            Peak: <span className="text-slate-300 font-semibold">{uploadPeak > 0 ? uploadPeak.toFixed(1) : '0.0'} Mbps</span>
          </div>
        </div>

        {/* Ping Card */}
        <div className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 ${stage === 'ping' ? 'border-amber-500/60 shadow-glow-amber' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ping (Latency)</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{ping > 0 ? ping.toFixed(0) : '0'}</span>
            <span className="text-[10px] font-bold text-slate-400">ms</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 font-mono">
            Responsivitas
          </div>
        </div>

        {/* Jitter Card */}
        <div className={`glass-panel p-3.5 rounded-2xl border transition-all duration-300 ${stage === 'ping' ? 'border-emerald-500/60 shadow-glow-emerald' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jitter</span>
            <Signal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{jitter > 0 ? jitter.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-bold text-slate-400">ms</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 font-mono">
            Variasi Latensi
          </div>
        </div>

        {/* Packet Loss Card */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Packet Loss</span>
            <AlertCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-mono">{packetLoss.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-slate-400">%</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 font-mono">
            Kehilangan Paket
          </div>
        </div>
      </div>

      {/* Network Quality Grade Bar & Bufferbloat Grade */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Quality & Bufferbloat Grade</h4>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                BUFFERBLOAT: {rating.bufferbloat}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">{rating.label}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className={`text-2xl font-black font-mono ${rating.color} px-3 py-1 bg-slate-900/60 rounded-lg border border-slate-700/50`}>
            {rating.grade}
          </div>

          {(download > 0 || upload > 0) && (
            <button
              onClick={onShare}
              className="px-4 py-2 bg-gradient-cyber text-white font-bold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Hasil</span>
            </button>
          )}
        </div>
      </div>

      {/* Activity Suitability Rating Grid */}
      <ActivityRatings
        download={download}
        upload={upload}
        ping={ping}
        jitter={jitter}
      />

      {/* "Powered by Aleano" Branding Banner */}
      <div className="flex items-center justify-center space-x-2 py-2">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          Powered by <span className="text-gradient-cyan font-extrabold">Aleano</span>
        </span>
        <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
      </div>
    </div>
  );
}
