import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Activity, Signal, CheckCircle2, Share2, AlertTriangle, AlertCircle, Info, BarChart, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WifiLagVerdict from './WifiLagVerdict';
import PacketLossInfoModal from './PacketLossInfoModal';

export default function MetricsCards({ 
  download, 
  downloadPeak, 
  upload, 
  uploadPeak, 
  ping, 
  jitter, 
  packetLoss = 0, 
  packetLossStatus = 'MEASURED', 
  stage, 
  onShare,
  wifiName = 'AP UTY Wifi',
  variant = 'full' // 'full' | 'telemetry' | 'insights'
}) {
  const { t, lang } = useLanguage();
  const [isPacketLossModalOpen, setIsPacketLossModalOpen] = useState(false);

  const lossVal = typeof packetLoss === 'number' ? packetLoss : parseFloat(packetLoss) || 0;

  // Packet Loss Indicator Badge Generator
  const getLossBadge = () => {
    if (packetLossStatus === 'UNMEASURABLE') {
      return { text: t('unmeasurable'), color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    }
    if (lossVal <= 0.5) {
      return { text: t('lossExcellent'), color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 font-bold' };
    }
    if (lossVal <= 2.0) {
      return { text: t('lossGood'), color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/30 font-bold' };
    }
    if (lossVal <= 5.0) {
      return { text: t('lossFair'), color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30 font-bold' };
    }
    return { text: t('lossPoor'), color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30 font-bold' };
  };

  const lossBadge = getLossBadge();

  // Quality rating calculation
  const getQualityRating = () => {
    if (download === 0 && upload === 0) return { label: t('awaitingTest'), grade: '--', color: 'text-slate-400', bufferbloat: 'N/A' };
    if (download >= 50 && ping <= 20 && jitter <= 5 && lossVal <= 0.5) {
      return { label: t('gradeVeryFast'), grade: 'A+', color: 'text-emerald-500', bufferbloat: t('bufferbloatLagFree') };
    }
    if (download >= 20 && ping <= 50 && jitter <= 15 && lossVal <= 2.0) {
      return { label: t('gradeGood'), grade: 'B', color: 'text-cyan-500', bufferbloat: t('bufferbloatStable') };
    }
    if (download >= 5 && ping <= 90) {
      return { label: t('gradeFair'), grade: 'C', color: 'text-amber-500', bufferbloat: t('bufferbloatModerate') };
    }
    return { label: t('gradePoor'), grade: 'D', color: 'text-rose-500', bufferbloat: t('bufferbloatHighLag') };
  };

  const getRecommendation = () => {
    if (download === 0 && upload === 0) {
      return t('recInitial');
    }
    if (lossVal > 2.0) {
      return t('recLossHigh');
    }
    if (download >= 50 && ping <= 25) {
      return t('recExcellent');
    }
    if (download >= 20 && ping <= 50) {
      return t('recStable');
    }
    if (ping > 80 || jitter > 25) {
      return t('recJitterHigh');
    }
    return t('recLowSpeed');
  };

  const rating = getQualityRating();
  const recText = getRecommendation();
  const isPoorConnection = (ping > 100 || lossVal > 2.0 || (download > 0 && download < 5));

  // Regional ISP Speed Benchmarks in Indonesia
  const regionalBenchmarks = [
    { name: t('yourConnection'), speed: download || 0, isUser: true },
    { name: `${t('avgPrefix')} IndiHome`, speed: 32.5, isUser: false },
    { name: `${t('avgPrefix')} Biznet`, speed: 85.0, isUser: false },
    { name: `${t('avgPrefix')} FirstMedia`, speed: 45.0, isUser: false },
    { name: `${t('avgPrefix')} MyRepublic`, speed: 70.0, isUser: false }
  ];

  // Render Telemetry Section (5 Metric Cards + Quality Grade Bar)
  const renderTelemetry = () => (
    <div className="w-full space-y-3.5 sm:space-y-4">
      {/* Network Health Warning Alert Banner for poor connections */}
      {isPoorConnection && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/30 flex items-center justify-between gap-3 animate-pulse shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">{t('connWarningTitle')}</p>
              <p className="text-[11px] text-slate-850 dark:text-slate-200 font-bold mt-0.5">
                {ping > 100 ? t('connWarningPing') : lossVal > 2.0 ? `${t('connWarningLoss')} (${lossVal.toFixed(2)}%)` : t('connWarningSpeed')}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-600 dark:bg-rose-500/20 text-white dark:text-rose-300 font-mono font-black text-xs uppercase border border-rose-600 dark:border-rose-500/30 shrink-0">
            {t('warningBadge')}
          </span>
        </div>
      )}

      {/* 5 Primary Metric Glass Cards (Balanced 2x2+1 on mobile, 3 on tablet, 5 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Download Card (Cyan Accent) */}
        <div className={`glass-panel p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 min-w-0 ${stage === 'download' ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md' : 'border-slate-300 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 truncate">{t('download')}</span>
            <ArrowDownCircle className={`w-4 h-4 text-cyan-500 stroke-[2.2] shrink-0 ml-1 ${stage === 'download' ? 'animate-bounce' : ''}`} />
          </div>
          <div className="flex items-baseline space-x-1 overflow-hidden">
            <span className="text-xl xs:text-2xl md:text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono truncate">{download > 0 ? download.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">Mbps</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold truncate">
            {t('peak')}: <span className="font-black text-slate-950 dark:text-white">{downloadPeak > 0 ? downloadPeak.toFixed(1) : '0.0'} Mbps</span>
          </div>
        </div>

        {/* Upload Card (Theme Cyan Accent) */}
        <div className={`glass-panel p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 min-w-0 ${stage === 'upload' ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md' : 'border-slate-300 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 truncate">{t('upload')}</span>
            <ArrowUpCircle className={`w-4 h-4 text-cyan-500 stroke-[2.2] shrink-0 ml-1 ${stage === 'upload' ? 'animate-bounce' : ''}`} />
          </div>
          <div className="flex items-baseline space-x-1 overflow-hidden">
            <span className="text-xl xs:text-2xl md:text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono truncate">{upload > 0 ? upload.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">Mbps</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold truncate">
            {t('peak')}: <span className="font-black text-slate-950 dark:text-white">{uploadPeak > 0 ? uploadPeak.toFixed(1) : '0.0'} Mbps</span>
          </div>
        </div>

        {/* Ping / Lag Card (Theme Accent) */}
        <div className={`glass-panel p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 min-w-0 ${stage === 'ping' ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md' : 'border-slate-300 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 truncate">{t('ping')}</span>
            <Activity className={`w-4 h-4 text-cyan-500 stroke-[2.2] shrink-0 ml-1 ${stage === 'ping' ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex items-baseline space-x-1 overflow-hidden">
            <span className="text-xl xs:text-2xl md:text-3xl font-black text-slate-950 dark:text-white font-mono truncate">{ping > 0 ? ping.toFixed(0) : '0'}</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">ms</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold truncate">
            {t('responsiveness')}
          </div>
        </div>

        {/* Jitter Card (Theme Cyan Accent) */}
        <div className={`glass-panel p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 min-w-0 ${stage === 'ping' ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md' : 'border-slate-300 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 truncate">{t('jitter')}</span>
            <Signal className="w-4 h-4 text-cyan-500 stroke-[2.2] shrink-0 ml-1" />
          </div>
          <div className="flex items-baseline space-x-1 overflow-hidden">
            <span className="text-xl xs:text-2xl md:text-3xl font-black text-slate-950 dark:text-white font-mono truncate">{jitter > 0 ? jitter.toFixed(1) : '0.0'}</span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">ms</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold truncate">
            {t('latencyVariation')}
          </div>
        </div>

        {/* Packet Loss Card (Full Width Span on 2-col mobile) */}
        <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 relative group cursor-pointer hover:border-cyan-500/60 transition-all col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1 min-w-0" onClick={() => setIsPacketLossModalOpen(true)}>
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center space-x-1 truncate">
              <span>{t('packetLoss')}</span>
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" title="Klik untuk penjelasan detail" />
            </span>
            <AlertCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 stroke-[2.2] shrink-0 ml-1" />
          </div>
          <div className="flex items-baseline space-x-1 overflow-hidden">
            <span className="text-xl xs:text-2xl md:text-3xl font-black text-slate-950 dark:text-white font-mono truncate">
              {packetLossStatus === 'UNMEASURABLE' ? 'N/A' : lossVal.toFixed(2)}
            </span>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 shrink-0">%</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-1">
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border truncate ${lossBadge.color}`}>
              {lossBadge.text}
            </span>
            <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-black underline shrink-0">{t('packetLossInfo')}</span>
          </div>
        </div>
      </div>

      {/* Network Quality Grade Bar & Bufferbloat Grade */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-300 dark:border-slate-800/80 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Main Rating Grade Badge (e.g. A+, B, C, D) positioned neatly as the leading badge on all screen sizes */}
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black font-mono text-xl sm:text-2xl shrink-0 border shadow-xs ${
            rating.grade === 'A+' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30' :
            rating.grade === 'B' ? 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30' :
            rating.grade === 'C' ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30' :
            rating.grade === 'D' ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30' :
            'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            {rating.grade}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h4 className="text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 font-black truncate">{t('qualityGradeTitle')}</h4>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-cyan-100 text-cyan-900 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30 shrink-0">
                {t('bufferbloatTag')} {rating.bufferbloat}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate leading-tight">{rating.label}</p>
          </div>
        </div>

        {/* Share Button on the right */}
        {(download > 0 || upload > 0) && (
          <button
            onClick={onShare}
            className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 sm:space-x-2 shrink-0 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5]" />
            <span className="text-slate-950 font-black hidden xs:inline">{t('shareResultsBtn')}</span>
            <span className="text-slate-950 font-black xs:hidden">{lang === 'en' ? 'Share' : 'Bagikan'}</span>
          </button>
        )}
      </div>

      {/* Packet Loss Interactive Info Modal */}
      <PacketLossInfoModal
        isOpen={isPacketLossModalOpen}
        onClose={() => setIsPacketLossModalOpen(false)}
        packetLoss={packetLoss}
        packetLossStatus={packetLossStatus}
      />
    </div>
  );

  // Render Insights Section (WifiLagVerdict + Advisor + Regional Benchmarks)
  const renderInsights = () => (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Verdict & Activity Suitability (Lancar vs Ngelag) + Regional ISP & Advisor in a balanced 2-column desktop grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* Left: Wifi Lag Verdict (Activity Suitability: Gaming, 4K Streaming, Video Call, Browsing) */}
        <div className="lg:col-span-7 flex flex-col">
          <WifiLagVerdict
            download={download}
            upload={upload}
            ping={ping}
            jitter={jitter}
            packetLoss={packetLoss}
            stage={stage}
            wifiName={wifiName}
          />
        </div>

        {/* Right: Network Advisor & Regional ISP Comparison Benchmark */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 justify-between">
          {/* Network Recommendation / Advisor Card */}
          <div className="glass-panel p-4 md:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-start space-x-3.5 bg-slate-50/80 dark:bg-slate-900/40 shadow-sm">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block">
                {t('networkAdvisorTitle')}
              </span>
              <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 leading-relaxed font-semibold">{recText}</p>
            </div>
          </div>

          {/* Regional ISP Comparison Benchmark */}
          <div className="glass-panel p-4 md:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-3 bg-white dark:bg-slate-900/60 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center space-x-2">
                  <BarChart className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>{t('ispComparisonTitle')}</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono font-bold">{t('ispComparisonStandard')}</span>
              </div>

              <div className="space-y-2.5">
                {regionalBenchmarks.map((isp) => (
                  <div key={isp.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={isp.isUser ? 'font-black text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 font-bold'}>
                        {isp.name}
                      </span>
                      <span className={isp.isUser ? 'font-black text-cyan-600 dark:text-cyan-400' : 'text-slate-800 dark:text-slate-300 font-bold'}>
                        {isp.speed > 0 ? `${isp.speed.toFixed(1)} Mbps` : '-- Mbps'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isp.isUser ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-slate-400 dark:bg-slate-700'}`}
                        style={{ width: `${Math.min(100, (isp.speed / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PingSatSet Diagnostics Badge */}
      <div className="flex items-center justify-center space-x-2 py-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
        <span className="text-xs font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          PingSatSet <span className="text-cyan-500 font-black">{lang === 'en' ? 'Precision Diagnostics' : 'Diagnostik Presisi'}</span>
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
      </div>
    </div>
  );

  if (variant === 'telemetry') {
    return renderTelemetry();
  }

  if (variant === 'insights') {
    return renderInsights();
  }

  return (
    <div className="w-full space-y-4">
      {renderTelemetry()}
      {renderInsights()}
    </div>
  );
}
