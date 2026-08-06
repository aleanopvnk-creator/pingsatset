import React, { useRef, useState } from 'react';
import { Share2, Download, Copy, Check, X, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function ShareResultsModal({ isOpen, onClose, metrics, ipInfo }) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const canvasRef = useRef(null);

  if (!isOpen) return null;

  const downloadDate = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Pre-formatted text for ISP Complaints
  const complaintText = `[LAPORAN PENGETESAN KECEPATAN INTERNET]
Tanggal & Waktu: ${downloadDate}
Penyedia Layanan (ISP): ${ipInfo?.isp || 'Unknown ISP'}
Alamat IP Publik: ${ipInfo?.ip || 'Unknown IP'}

HASIL SPEEDTEST PRO:
• Kecepatan Download : ${metrics?.download || 0} Mbps (Peak: ${metrics?.downloadPeak || 0} Mbps)
• Kecepatan Upload   : ${metrics?.upload || 0} Mbps (Peak: ${metrics?.uploadPeak || 0} Mbps)
• Latensi (Ping)    : ${metrics?.ping || 0} ms
• Variasi (Jitter)   : ${metrics?.jitter || 0} ms

Laporan ini dibuat secara otomatis melalui Speedtest Pro Web App.`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(complaintText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate & Download PNG Image Card via HTML Canvas
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Canvas Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGradient.addColorStop(0, '#0a0d14');
    bgGradient.addColorStop(0.5, '#111827');
    bgGradient.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Glowing Neon Orbs
    ctx.beginPath();
    ctx.arc(100, 100, 250, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(1100, 500, 300, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.fill();

    // Card Glass Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 550);

    // Header Title
    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('SPEEDTEST', 80, 110);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PRO', 310, 110);

    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`ISP: ${ipInfo?.isp || 'Local Network'} • IP: ${ipInfo?.ip || '127.0.0.1'} • ${downloadDate}`, 80, 150);

    // Metric 1: Download
    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(80, 200, 500, 160);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.strokeRect(80, 200, 500, 160);

    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('DOWNLOAD SPEED', 110, 240);

    ctx.font = '900 56px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.download || 0}`, 110, 310);

    ctx.font = '700 20px sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('Mbps', 470, 310);

    // Metric 2: Upload
    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(620, 200, 500, 160);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.strokeRect(620, 200, 500, 160);

    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText('UPLOAD SPEED', 650, 240);

    ctx.font = '900 56px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.upload || 0}`, 650, 310);

    ctx.font = '700 20px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('Mbps', 1010, 310);

    // Metric 3 & 4: Ping & Jitter
    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(80, 390, 500, 120);
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
    ctx.strokeRect(80, 390, 500, 120);

    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText('PING (LATENCY)', 110, 430);
    ctx.font = '900 40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.ping || 0} ms`, 110, 480);

    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(620, 390, 500, 120);
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.3)';
    ctx.strokeRect(620, 390, 500, 120);

    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#fb923c';
    ctx.fillText('JITTER (STABILITY)', 650, 430);
    ctx.font = '900 40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.jitter || 0} ms`, 650, 480);

    // Footer Watermark
    ctx.font = '600 16px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Certified Result • SpeedTest Pro Web App', 80, 555);

    // Trigger PNG Download
    const link = document.createElement('a');
    link.download = `SpeedTest-Result-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Export current result to CSV
  const handleExportCSV = () => {
    const csvHeader = "Timestamp,ISP,IP,Download_Mbps,DownloadPeak_Mbps,Upload_Mbps,UploadPeak_Mbps,Ping_ms,Jitter_ms\n";
    const csvRow = `"${downloadDate}","${ipInfo?.isp || 'Unknown'}","${ipInfo?.ip || '127.0.0.1'}",${metrics?.download || 0},${metrics?.downloadPeak || 0},${metrics?.upload || 0},${metrics?.uploadPeak || 0},${metrics?.ping || 0},${metrics?.jitter || 0}\n`;
    
    const blob = new Blob([csvHeader + csvRow], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SpeedTest-Result-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl glass-panel p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-cyan">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Bagikan & Ekspor Hasil Speedtest</h3>
            <p className="text-xs text-slate-400">Unduh gambar sertifikat, ekspor berkas CSV, atau salin teks laporan ISP</p>
          </div>
        </div>

        {/* Certificate Card Preview */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 mb-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Penyedia Layanan (ISP)</p>
              <p className="text-sm font-bold text-white">{ipInfo?.isp || 'Local Network'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Waktu Tes</p>
              <p className="text-xs font-mono text-cyan-400">{downloadDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-[10px] font-bold text-cyan-400 uppercase">Download</p>
              <p className="text-2xl font-black text-white">{metrics?.download || 0} <span className="text-xs font-bold text-cyan-400">Mbps</span></p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-400 uppercase">Upload</p>
              <p className="text-2xl font-black text-white">{metrics?.upload || 0} <span className="text-xs font-bold text-emerald-400">Mbps</span></p>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] font-bold text-purple-400 uppercase">Ping</p>
              <p className="text-lg font-mono font-bold text-white">{metrics?.ping || 0} ms</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-bold text-amber-400 uppercase">Jitter</p>
              <p className="text-lg font-mono font-bold text-white">{metrics?.jitter || 0} ms</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadImage}
              className="py-3 px-4 bg-gradient-cyber text-white font-bold text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Unduh Sertifikat (.PNG)</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Berkas CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyText}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedText ? 'Teks Tersalin!' : 'Salin Laporan ISP (Teks)'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-purple-400" />}
              <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Web'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
