import React from 'react';
import { 
  Gamepad2, 
  Tv, 
  Video, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wifi, 
  Activity,
  Zap 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WifiLagVerdict({
  download = 0,
  upload = 0,
  ping = 0,
  jitter = 0,
  packetLoss = 0,
  stage = 'idle',
  wifiName = 'Wi-Fi'
}) {
  const { t } = useLanguage();
  const isTested = download > 0 || upload > 0 || ping > 0;
  const lossVal = typeof packetLoss === 'number' ? packetLoss : parseFloat(packetLoss) || 0;

  // Calculate Wi-Fi smoothness verdict
  const getOverallVerdict = () => {
    if (!isTested) {
      return {
        status: 'READY',
        title: t('verdictReadyTitle'),
        badge: t('verdictReadyBadge'),
        color: 'text-cyan-600 dark:text-cyan-400',
        bgColor: 'bg-cyan-500/10 border-cyan-500/25',
        badgeBg: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 font-black',
        icon: Wifi,
        score: null,
        description: t('verdictReadyDesc')
      };
    }

    if (stage === 'ping' || stage === 'download' || stage === 'upload') {
      return {
        status: 'TESTING',
        title: t('verdictTestingTitle'),
        badge: t('verdictTestingBadge'),
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        badgeBg: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-black',
        icon: Activity,
        score: null,
        description: t('verdictTestingDesc')
      };
    }

    const isLaggy = ping > 75 || jitter > 22 || lossVal > 2.0 || (download > 0 && download < 8);
    const isVerySmooth = ping <= 35 && jitter <= 8 && lossVal <= 0.5 && download >= 25;

    // Smoothness Score (0 - 100)
    let score = 100;
    if (ping > 20) score -= Math.min(35, (ping - 20) * 0.5);
    if (jitter > 5) score -= Math.min(25, (jitter - 5) * 1.2);
    if (lossVal > 0) score -= Math.min(25, lossVal * 8);
    if (download < 50 && download > 0) score -= Math.min(15, (50 - download) * 0.3);
    score = Math.max(20, Math.min(100, Math.round(score)));

    if (isVerySmooth) {
      return {
        status: 'LANCAR_JAYA',
        title: t('verdictSmoothTitle'),
        badge: t('verdictSmoothBadge'),
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30 shadow-glow-emerald',
        badgeBg: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-black',
        icon: CheckCircle2,
        score,
        grade: 'A+',
        description: t('verdictSmoothDesc')
      };
    }

    if (!isLaggy) {
      return {
        status: 'CUKUP_LANCAR',
        title: t('verdictFairTitle'),
        badge: t('verdictFairBadge'),
        color: 'text-cyan-600 dark:text-cyan-400',
        bgColor: 'bg-cyan-500/10 border-cyan-500/30',
        badgeBg: 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500/40 font-black',
        icon: Wifi,
        score,
        grade: 'B',
        description: t('verdictFairDesc')
      };
    }

    return {
      status: 'NGELAG',
      title: t('verdictLagTitle'),
      badge: t('verdictLagBadge'),
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      badgeBg: 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/40 font-black',
      icon: AlertTriangle,
      score,
      grade: 'D',
      description: t('verdictLagDesc')
    };
  };

  const verdict = getOverallVerdict();

  // Activity 1: Game Online
  const getGameStatus = () => {
    if (!isTested) return { status: 'MENUNGGU', label: t('statusUntested'), color: 'text-slate-500 dark:text-slate-400', bg: 'bg-white/90 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800' };
    if (ping <= 30 && lossVal <= 0.5 && jitter <= 10) {
      return { status: 'LANCAR', label: `${t('gameSmooth')} (${ping.toFixed(0)} ms)`, sub: t('actGameSubFast'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30', isSmooth: true };
    }
    if (ping <= 65 && lossVal <= 1.5) {
      return { status: 'CUKUP', label: `${t('gameFair')} (${ping.toFixed(0)} ms)`, sub: t('actGameSubFair'), color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30 dark:border-cyan-500/30', isSmooth: true };
    }
    return { status: 'NGELAG', label: `${t('gameLag')} (${ping.toFixed(0)} ms)`, sub: t('actGameSubLag'), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30 dark:border-rose-500/30', isSmooth: false };
  };

  // Activity 2: Streaming Video
  const getStreamingStatus = () => {
    if (!isTested) return { status: 'MENUNGGU', label: t('statusUntested'), color: 'text-slate-500 dark:text-slate-400', bg: 'bg-white/90 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800' };
    if (download >= 35) {
      return { status: 'LANCAR', label: t('stream4k'), sub: t('actStreamSub4k'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30', isSmooth: true };
    }
    if (download >= 12) {
      return { status: 'LANCAR', label: t('streamFhd'), sub: t('actStreamSubFhd'), color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30 dark:border-cyan-500/30', isSmooth: true };
    }
    if (download >= 4) {
      return { status: 'CUKUP', label: t('streamHd'), sub: t('actStreamSubHd'), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30 dark:border-amber-500/30', isSmooth: false };
    }
    return { status: 'LEMOT', label: t('streamSlow'), sub: t('actStreamSubSlow'), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30 dark:border-rose-500/30', isSmooth: false };
  };

  // Activity 3: Video Call & Meeting
  const getVideoCallStatus = () => {
    if (!isTested) return { status: 'MENUNGGU', label: t('statusUntested'), color: 'text-slate-500 dark:text-slate-400', bg: 'bg-white/90 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800' };
    if (upload >= 8 && jitter <= 12 && lossVal <= 0.8) {
      return { status: 'LANCAR', label: t('vcallClear'), sub: t('actVcallSubCrisp'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30', isSmooth: true };
    }
    if (upload >= 3 && jitter <= 25) {
      return { status: 'CUKUP', label: t('vcallFair'), sub: t('actVcallSubFair'), color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30 dark:border-cyan-500/30', isSmooth: true };
    }
    return { status: 'NGELAG', label: t('vcallLag'), sub: t('actVcallSubLag'), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30 dark:border-rose-500/30', isSmooth: false };
  };

  // Activity 4: Browsing Web & Social Media
  const getBrowsingStatus = () => {
    if (!isTested) return { status: 'MENUNGGU', label: t('statusUntested'), color: 'text-slate-500 dark:text-slate-400', bg: 'bg-white/90 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800' };
    if (download >= 10 && ping <= 45) {
      return { status: 'LANCAR', label: t('browseFast'), sub: t('actBrowseSubInstant'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/30', isSmooth: true };
    }
    if (download >= 3) {
      return { status: 'LANCAR', label: t('browseNormal'), sub: t('actBrowseSubNormal'), color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30 dark:border-cyan-500/30', isSmooth: true };
    }
    return { status: 'LAMBAT', label: t('browseSlow'), sub: t('actBrowseSubSlow'), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30 dark:border-amber-500/30', isSmooth: false };
  };

  const game = getGameStatus();
  const stream = getStreamingStatus();
  const vcall = getVideoCallStatus();
  const browse = getBrowsingStatus();

  // Find causes if connection has bottlenecks
  const lagReasons = [];
  if (isTested) {
    if (ping > 70) {
      lagReasons.push(`${t('reasonPing')} (${ping.toFixed(0)} ms)`);
    }
    if (jitter > 18) {
      lagReasons.push(`${t('reasonJitter')} (${jitter.toFixed(1)} ms)`);
    }
    if (lossVal > 1.5) {
      lagReasons.push(`${t('reasonLoss')} (${lossVal.toFixed(2)}%)`);
    }
    if (download > 0 && download < 10) {
      lagReasons.push(`${t('reasonDownload')} (${download.toFixed(1)} Mbps)`);
    }
  }

  const VerdictIcon = verdict.icon;

  return (
    <div className="w-full space-y-3.5 sm:space-y-4">
      {/* 1. KESIMPULAN UTAMA: APAKAH WI-FI NYA NGELAG ATAU LANCAR */}
      <div className={`p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${verdict.bgColor} text-left relative overflow-hidden shadow-sm`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start space-x-3 sm:space-x-3.5">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${verdict.bgColor} ${verdict.color} border shrink-0 mt-0.5`}>
              <VerdictIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border ${verdict.badgeBg}`}>
                  {verdict.badge}
                </span>
                {verdict.score !== null && (
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {t('smoothnessScoreLabel')} <span className="font-extrabold text-slate-900 dark:text-white">{verdict.score}/100</span>
                  </span>
                )}
              </div>
              <h3 className={`text-sm sm:text-base md:text-xl font-black tracking-tight ${verdict.color} flex items-center gap-2 flex-wrap`}>
                {verdict.status === 'LANCAR_JAYA' && (
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-emerald-400/25 to-teal-500/10 border border-emerald-400/50 text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.45)] shrink-0 transition-transform hover:scale-110">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-emerald-400 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] transform -rotate-6" />
                  </span>
                )}
                {verdict.status === 'CUKUP_LANCAR' && (
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
                    <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                  </span>
                )}
                {verdict.status === 'NGELAG' && (
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)] shrink-0">
                    <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                  </span>
                )}
                <span>{verdict.title}</span>
              </h3>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed max-w-3xl font-semibold">
                {verdict.description}
              </p>
            </div>
          </div>

          {/* Large Quality Score Pill */}
          {verdict.score !== null && (
            <div className="shrink-0 flex items-center justify-between sm:justify-start space-x-3 w-full sm:w-auto self-stretch sm:self-center bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-md">
              <div className="text-left sm:text-right">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-300 font-black block">{t('statusWifiLabel')}</span>
                <span className={`text-xs font-black ${verdict.color}`}>
                  {verdict.grade === 'A+' ? t('statusVeryPrime') : verdict.grade === 'B' ? t('statusQuiteStable') : t('statusNeedsFix')}
                </span>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black font-mono text-lg sm:text-xl border ${verdict.badgeBg} ${verdict.color}`}>
                {verdict.grade}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. RINCIAN 4 AKTIVITAS PENGGUNA (LANCAR vs NGELAG) */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-slate-800 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white">
              {t('activitySectionTitle')}
            </h4>
          </div>
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">
            {t('autoAnalysisBadge')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Card 1: Game Online */}
          <div className={`p-4 rounded-2xl border transition-all text-left ${game.bg} space-y-2 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Gamepad2 className={`w-4 h-4 ${game.color}`} />
                <span className="text-xs font-black text-slate-950 dark:text-white">{t('actGameTitle')}</span>
              </div>
              {isTested && (
                game.isSmooth ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )
              )}
            </div>
            <div>
              <p className={`text-xs font-black ${game.color}`}>{game.label}</p>
              <p className="text-[11px] text-slate-900 dark:text-slate-200 font-bold mt-0.5">{game.sub}</p>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
              {t('actGameTags')}
            </p>
          </div>

          {/* Card 2: Streaming Video */}
          <div className={`p-4 rounded-2xl border transition-all text-left ${stream.bg} space-y-2 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tv className={`w-4 h-4 ${stream.color}`} />
                <span className="text-xs font-black text-slate-950 dark:text-white">{t('actStreamTitle')}</span>
              </div>
              {isTested && (
                stream.isSmooth ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )
              )}
            </div>
            <div>
              <p className={`text-xs font-black ${stream.color}`}>{stream.label}</p>
              <p className="text-[11px] text-slate-900 dark:text-slate-200 font-bold mt-0.5">{stream.sub}</p>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
              {t('actStreamTags')}
            </p>
          </div>

          {/* Card 3: Video Call & Meeting */}
          <div className={`p-4 rounded-2xl border transition-all text-left ${vcall.bg} space-y-2 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className={`w-4 h-4 ${vcall.color}`} />
                <span className="text-xs font-black text-slate-950 dark:text-white">{t('actMeetingTitle')}</span>
              </div>
              {isTested && (
                vcall.isSmooth ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )
              )}
            </div>
            <div>
              <p className={`text-xs font-black ${vcall.color}`}>{vcall.label}</p>
              <p className="text-[11px] text-slate-900 dark:text-slate-200 font-bold mt-0.5">{vcall.sub}</p>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
              {t('actMeetingTags')}
            </p>
          </div>

          {/* Card 4: Browsing & Medsos */}
          <div className={`p-4 rounded-2xl border transition-all text-left ${browse.bg} space-y-2 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className={`w-4 h-4 ${browse.color}`} />
                <span className="text-xs font-black text-slate-950 dark:text-white">{t('actBrowseTitle')}</span>
              </div>
              {isTested && (
                browse.isSmooth ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )
              )}
            </div>
            <div>
              <p className={`text-xs font-black ${browse.color}`}>{browse.label}</p>
              <p className="text-[11px] text-slate-900 dark:text-slate-200 font-bold mt-0.5">{browse.sub}</p>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
              {t('actBrowseTags')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. JIKA LEMOT / NGELAG: PENJELASAN MENGAPA & CARA MENGATASINYA */}
      {isTested && lagReasons.length > 0 && (
        <div className="p-4 md:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 font-black text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t('lagReasonsTitle')}</span>
          </div>
          <ul className="space-y-1.5 pl-2 font-medium">
            {lagReasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span className="font-semibold">{reason}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-amber-500/20">
            <p className="text-[11px] font-black text-amber-700 dark:text-amber-300 mb-1">{t('quickTipsTitle')}</p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
              {t('tip1')}<br />
              {t('tip2')}<br />
              {t('tip3')}<br />
              {t('tip4')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
