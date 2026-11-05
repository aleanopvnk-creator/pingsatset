import React, { useState } from 'react';
import { Share2, Download, Copy, Check, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ShareResultsModal({ isOpen, onClose, metrics, ipInfo }) {
  const { t, lang } = useLanguage();
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const locale = lang === 'en' ? 'en-US' : 'id-ID';
  const downloadDate = new Date().toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const lossVal = typeof metrics?.packetLoss === 'number' ? metrics.packetLoss : parseFloat(metrics?.packetLoss) || 0;

  // Pre-formatted text for ISP Complaints / Diagnostics Report
  const complaintText = lang === 'en'
    ? `[INTERNET SPEED TEST OFFICIAL REPORT]
Date & Time: ${downloadDate}
Internet Service Provider (ISP): ${ipInfo?.isp || 'Unknown ISP'}
Public IP Address: ${ipInfo?.ip || 'Unknown IP'}

PINGSATSET SPEED RESULTS:
• Download Speed : ${metrics?.download || 0} Mbps (Peak: ${metrics?.downloadPeak || 0} Mbps)
• Upload Speed   : ${metrics?.upload || 0} Mbps (Peak: ${metrics?.uploadPeak || 0} Mbps)
• Ping (Latency) : ${metrics?.ping || 0} ms
• Jitter         : ${metrics?.jitter || 0} ms
• Packet Loss    : ${lossVal.toFixed(2)}%

This diagnostic report was generated automatically via PingSatSet Web App.`
    : `[LAPORAN PENGETESAN KECEPATAN INTERNET]
Tanggal & Waktu: ${downloadDate}
Penyedia Layanan (ISP): ${ipInfo?.isp || 'Unknown ISP'}
Alamat IP Publik: ${ipInfo?.ip || 'Unknown IP'}

HASIL TES PINGSATSET:
• Kecepatan Download : ${metrics?.download || 0} Mbps (Peak: ${metrics?.downloadPeak || 0} Mbps)
• Kecepatan Upload   : ${metrics?.upload || 0} Mbps (Peak: ${metrics?.uploadPeak || 0} Mbps)
• Latensi (Ping)    : ${metrics?.ping || 0} ms
• Variasi (Jitter)   : ${metrics?.jitter || 0} ms
• Packet Loss       : ${lossVal.toFixed(2)}%

Laporan ini dibuat secara otomatis melalui aplikasi web PingSatSet.`;

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
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PING', 80, 110);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('SATSET', 180, 110);

    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`ISP: ${ipInfo?.isp || 'Local Network'} • IP: ${ipInfo?.ip || '127.0.0.1'} • ${downloadDate}`, 80, 150);

    // Metric 1: Download
    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(80, 190, 500, 150);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.strokeRect(80, 190, 500, 150);

    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(lang === 'en' ? 'DOWNLOAD SPEED' : 'KECEPATAN UNDUH', 110, 230);

    ctx.font = '900 52px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.download || 0}`, 110, 300);

    ctx.font = '700 20px sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('Mbps', 470, 300);

    // Metric 2: Upload
    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(620, 190, 500, 150);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.strokeRect(620, 190, 500, 150);

    ctx.font = '700 16px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText(lang === 'en' ? 'UPLOAD SPEED' : 'KECEPATAN UNGGAH', 650, 230);

    ctx.font = '900 52px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.upload || 0}`, 650, 300);

    ctx.font = '700 20px sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.fillText('Mbps', 1010, 300);

    // Metric 3: Ping & Jitter & Packet Loss
    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(80, 370, 330, 130);
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
    ctx.strokeRect(80, 370, 330, 130);
    ctx.font = '700 14px sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(lang === 'en' ? 'PING LATENCY' : 'LATENSI PING', 100, 410);
    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.ping || 0} ms`, 100, 465);

    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(435, 370, 330, 130);
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.3)';
    ctx.strokeRect(435, 370, 330, 130);
    ctx.font = '700 14px sans-serif';
    ctx.fillStyle = '#fb923c';
    ctx.fillText('JITTER', 455, 410);
    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${metrics?.jitter || 0} ms`, 455, 465);

    ctx.fillStyle = 'rgba(18, 24, 36, 0.8)';
    ctx.fillRect(790, 370, 330, 130);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.strokeRect(790, 370, 330, 130);
    ctx.font = '700 14px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('PACKET LOSS', 810, 410);
    ctx.font = '900 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${lossVal.toFixed(2)}%`, 810, 465);

    // Footer Watermark
    ctx.font = '600 16px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Certified Result • PingSatSet Web App • Network Performance Diagnostics', 80, 555);

    // Trigger PNG Download
    const link = document.createElement('a');
    link.download = `PingSatSet-Result-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Export current result to CSV
  const handleExportCSV = () => {
    const csvHeader = "Timestamp,ISP,IP,Download_Mbps,DownloadPeak_Mbps,Upload_Mbps,UploadPeak_Mbps,Ping_ms,Jitter_ms,PacketLoss_Pct\n";
    const csvRow = `"${downloadDate}","${ipInfo?.isp || 'Unknown'}","${ipInfo?.ip || '127.0.0.1'}",${metrics?.download || 0},${metrics?.downloadPeak || 0},${metrics?.upload || 0},${metrics?.uploadPeak || 0},${metrics?.ping || 0},${metrics?.jitter || 0},${lossVal.toFixed(2)}\n`;

    const blob = new Blob([csvHeader + csvRow], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PingSatSet-Result-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl glass-panel p-6 md:p-8 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/95 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-400 dark:hover:text-white border border-slate-300 dark:border-slate-800 transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-glow-cyan">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{t('shareModalTitle')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{t('shareModalSubtitle')}</p>
          </div>
        </div>

        {/* Certificate Card Preview */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400">{t('labelIsp')}</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{ipInfo?.isp || 'Local Network'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400">{t('labelTestTime')}</p>
              <p className="text-xs font-mono font-black text-cyan-600 dark:text-cyan-400">{downloadDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase">{t('download')}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics?.download || 0} <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">Mbps</span></p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase">{t('upload')}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics?.upload || 0} <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Mbps</span></p>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">Ping / Jitter</p>
              <p className="text-sm font-mono font-black text-slate-900 dark:text-white">{metrics?.ping || 0} ms / {metrics?.jitter || 0} ms</p>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">{t('packetLoss')}</p>
              <p className="text-sm font-mono font-black text-slate-900 dark:text-white">{lossVal.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadImage}
              className="py-3 px-4 bg-gradient-cyber text-slate-950 font-black text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t('btnDownloadCert')}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('btnExportCsvModal')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCopyText}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-cyan-500" />}
              <span>{copiedText ? t('copiedTextFeedback') : t('btnCopyIspReport')}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-purple-500" />}
              <span>{copiedLink ? t('copiedLinkFeedback') : t('btnCopyWebLink')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
