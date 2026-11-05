import React, { useState } from 'react';
import { Activity, Flame, RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StabilityStressSection() {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('stability');

  // Stability Test State
  const [duration, setDuration] = useState(10);
  const [runningStability, setRunningStability] = useState(false);
  const [stabilityResult, setStabilityResult] = useState(null);

  // Stress Test State
  const [stressDuration, setStressDuration] = useState(10);
  const [runningStress, setRunningStress] = useState(false);
  const [stressProgress, setStressProgress] = useState(0);
  const [stressLiveMetrics, setStressLiveMetrics] = useState({ dlMbps: 0, ulMbps: 0, pingMs: 0 });
  const [stressResult, setStressResult] = useState(null);

  const durationOptions = [
    { label: '10s', sec: 10 },
    { label: '30s', sec: 30 },
    { label: '1 min', sec: 60 }
  ];

  // Run Stability Test
  const handleRunStabilityTest = async () => {
    setRunningStability(true);
    setStabilityResult(null);

    try {
      const res = await fetch(`/api/speedtest/stability?duration=${duration}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStabilityResult(data);
          setRunningStability(false);
          return;
        }
      }
    } catch (err) {}

    // Client-side fallback ping sweep if server endpoint fails or is offline
    const pings = [];
    const totalPings = Math.min(30, Math.max(10, duration * 2));
    let failed = 0;

    for (let i = 0; i < totalPings; i++) {
      const t0 = performance.now();
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 1200);
        await fetch(`/api/ip-info?t=${Date.now()}_${i}`, { cache: 'no-store', signal: controller.signal });
        clearTimeout(tid);
        pings.push(Math.max(4, Math.round(performance.now() - t0)));
      } catch (e) {
        failed++;
      }
      await new Promise(r => setTimeout(r, 60));
    }

    const min = pings.length ? Math.min(...pings) : 0;
    const max = pings.length ? Math.max(...pings) : 0;
    const avg = pings.length ? parseFloat((pings.reduce((a, b) => a + b, 0) / pings.length).toFixed(1)) : 0;

    let totalDiff = 0;
    for (let i = 1; i < pings.length; i++) {
      totalDiff += Math.abs(pings[i] - pings[i - 1]);
    }
    const jitter = pings.length > 1 ? parseFloat((totalDiff / (pings.length - 1)).toFixed(1)) : 0;
    const lossPct = parseFloat(((failed / totalPings) * 100).toFixed(2));

    let grade = 'A+';
    let rating = t('ratingVeryStableGaming');
    if (lossPct > 2.0 || jitter > 20 || max > 100) {
      grade = 'C';
      rating = t('ratingUnstableLag');
    } else if (lossPct > 0.5 || jitter > 10 || max > 60) {
      grade = 'B';
      rating = t('ratingStableDaily');
    } else if (jitter > 5) {
      grade = 'A';
      rating = t('ratingVeryStableGaming');
    }

    setStabilityResult({
      success: true,
      samples: pings,
      totalPings: pings.length,
      minLatencyMs: min,
      maxLatencyMs: max,
      avgLatencyMs: avg,
      jitterMs: jitter,
      packetLossPct: `${lossPct.toFixed(2)}%`,
      grade,
      rating
    });
    setRunningStability(false);
  };

  // Run Real Traffic Stress Test
  const handleRunStressTest = async () => {
    setRunningStress(true);
    setStressResult(null);
    setStressProgress(0);
    setStressLiveMetrics({ dlMbps: 0, ulMbps: 0, pingMs: 0 });

    const startTime = performance.now();
    const testDurationMs = stressDuration * 1000;
    let isFinished = false;

    let totalDlBytes = 0;
    let totalUlBytes = 0;
    const dlHistory = [];
    const ulHistory = [];
    const loadPings = [];

    // Live update ticker
    const interval = setInterval(async () => {
      if (isFinished) return;
      const elapsedSec = (performance.now() - startTime) / 1000;
      const pct = Math.min(100, Math.floor((elapsedSec / stressDuration) * 100));
      setStressProgress(pct);

      const dlMbps = parseFloat(((totalDlBytes * 8) / (elapsedSec * 1000000)).toFixed(1));
      const ulMbps = parseFloat(((totalUlBytes * 8) / (elapsedSec * 1000000)).toFixed(1));

      // Quick latency probe under heavy traffic strain
      const pStart = performance.now();
      try {
        await fetch(`/api/ip-info?t=${Date.now()}`, { cache: 'no-store' });
      } catch (e) {}
      const pingMs = Math.round(performance.now() - pStart);
      loadPings.push(pingMs);

      if (dlMbps > 0) dlHistory.push(dlMbps);
      if (ulMbps > 0) ulHistory.push(ulMbps);

      setStressLiveMetrics({ dlMbps, ulMbps, pingMs });

      if (elapsedSec * 1000 >= testDurationMs) {
        isFinished = true;
        clearInterval(interval);
        finishStressTest();
      }
    }, 200);

    // Stream Download Traffic
    const dlWorker = async () => {
      while (!isFinished) {
        try {
          const resp = await fetch('/api/speedtest/download?size=30');
          if (!resp.body) break;
          const reader = resp.body.getReader();
          while (!isFinished) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) totalDlBytes += value.length;
          }
        } catch (e) {
          await new Promise(r => setTimeout(r, 50));
        }
      }
    };

    // Stream Upload Traffic
    const dummyChunk = new Uint8Array(1024 * 1024);
    const ulWorker = async () => {
      while (!isFinished) {
        try {
          await fetch('/api/speedtest/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/octet-stream' },
            body: dummyChunk
          });
          totalUlBytes += dummyChunk.length;
        } catch (e) {
          await new Promise(r => setTimeout(r, 50));
        }
      }
    };

    dlWorker();
    ulWorker();

    const finishStressTest = () => {
      const avgDl = dlHistory.length ? (dlHistory.reduce((a, b) => a + b, 0) / dlHistory.length).toFixed(1) : '0.0';
      const avgUl = ulHistory.length ? (ulHistory.reduce((a, b) => a + b, 0) / ulHistory.length).toFixed(1) : '0.0';
      const avgPingUnderLoad = loadPings.length ? Math.round(loadPings.reduce((a, b) => a + b, 0) / loadPings.length) : 0;

      const totalProbes = Math.max(1, loadPings.length);
      const failedProbes = loadPings.filter(p => p > 1500).length;
      const calcLossVal = ((failedProbes / totalProbes) * 100).toFixed(2);

      let bufferbloatScore = t('bufferbloatLagFree');
      if (avgPingUnderLoad > 100) bufferbloatScore = t('bufferbloatHighLag');
      else if (avgPingUnderLoad > 60) bufferbloatScore = t('bufferbloatModerate');
      else if (avgPingUnderLoad > 35) bufferbloatScore = t('bufferbloatStable');

      const messageTemplate = t('stressSuccessMessage') || 'Berhasil menyalurkan data masif real-time selama {duration} detik. Packet Loss terukur: {loss}%.';
      const formattedMessage = messageTemplate.replace('{duration}', stressDuration).replace('{loss}', calcLossVal);

      setStressResult({
        duration: stressDuration,
        sustainedDownloadMbps: avgDl,
        sustainedUploadMbps: avgUl,
        pingUnderLoadMs: avgPingUnderLoad,
        packetLossPct: `${calcLossVal}%`,
        packetLossVal: parseFloat(calcLossVal),
        bufferbloatScore,
        status: 'STABLE_UNDER_LOAD',
        message: formattedMessage
      });
      setRunningStress(false);
    };
  };

  return (
    <div className="w-full">
      {/* Main Dashboard Area: Large Translucent Container */}
      <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/60 backdrop-blur-2xl shadow-xl relative overflow-hidden space-y-6 sm:space-y-8">
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none -top-20 -left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none -bottom-20 -right-20" />

        {/* Top Part: Purple Badge, Bold Title, Subtitle, and Two Toggle Tabs */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          {/* Small Purple Pill Badge */}
          <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-sm">
            {t('advDiagBadge')}
          </span>

          {/* Bold Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {t('stabilityTabTitle')}
          </h2>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-bold">
            {t('stabilityTabSubtitle')}
          </p>

          {/* Two Toggle Tabs Side-by-Side (Full Width on Mobile) */}
          <div className="pt-2 w-full max-w-sm">
            <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-900/90 rounded-full border border-slate-300 dark:border-slate-700/60 shadow-inner space-x-1 w-full">
              <button
                onClick={() => setActiveSubTab('stability')}
                className={`flex-1 py-2 rounded-full text-[11px] sm:text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeSubTab === 'stability'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                }`}
              >
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('tabLatencyStability')}</span>
              </button>

              <button
                onClick={() => setActiveSubTab('stress')}
                className={`flex-1 py-2 rounded-full text-[11px] sm:text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeSubTab === 'stress'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                }`}
              >
                <Flame className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('tabStressTraffic')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Split Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* 1. Left Panel (Controls) */}
          <div className="lg:col-span-4 glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-6">
              {/* Clean Icon in Rounded Container (No Glow) */}
              <div className="flex justify-center pt-2">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-300 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm">
                  {activeSubTab === 'stability' ? (
                    <Activity className="w-8 h-8" />
                  ) : (
                    <Flame className="w-8 h-8" />
                  )}
                </div>
              </div>

              {/* Text for DURATION & Selectable Pill Buttons */}
              <div className="space-y-2.5 text-center">
                <p className="text-xs font-black tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                  {t('labelDuration')}
                </p>

                <div className="flex items-center justify-center p-1 bg-slate-200 dark:bg-slate-950/80 rounded-full border border-slate-300 dark:border-slate-800 space-x-1 shadow-inner">
                  {durationOptions.map((item) => {
                    const currentVal = activeSubTab === 'stability' ? duration : stressDuration;
                    const isSelected = currentVal === item.sec;

                    return (
                      <button
                        key={item.sec}
                        onClick={() => {
                          if (activeSubTab === 'stability') {
                            setDuration(item.sec);
                          } else {
                            setStressDuration(item.sec);
                          }
                        }}
                        className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white border border-slate-300 dark:border-slate-700 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-bold'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Large Prominent Glowing Call-To-Action Button */}
            {activeSubTab === 'stability' ? (
              <button
                onClick={handleRunStabilityTest}
                disabled={runningStability}
                className={`w-full py-4 rounded-2xl font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_25px_rgba(99,102,241,0.55)] ${
                  runningStability
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {runningStability ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>{t('measuringSec')} ({duration}s)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span className="text-white font-black">{t('btnStartStability')}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleRunStressTest}
                disabled={runningStress}
                className={`w-full py-4 rounded-2xl font-black text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.6)] ${
                  runningStress
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {runningStress ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Stress Test ({stressProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 fill-current text-white" />
                    <span className="text-white font-black">{t('btnStartStress')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 2. Right Panel (Data Display) */}
          <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 min-h-[380px] flex flex-col justify-center shadow-md">
            {/* STABILITY TAB DISPLAY */}
            {activeSubTab === 'stability' && (
              <>
                {/* Empty / Ready State */}
                {!stabilityResult && !runningStability && (
                  <div className="py-16 text-center space-y-4">
                    <Activity className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-800 stroke-[1.2]" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold tracking-wide">
                      {t('readyStabilityWatermark')}
                    </p>
                  </div>
                )}

                {/* Running State */}
                {runningStability && (
                  <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
                    <RefreshCw className="w-12 h-12 text-cyan-500 dark:text-cyan-400 animate-spin" />
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-wide">
                      {t('sendingPingDuration').replace('{duration}', duration)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                      {t('pleaseWaitVariation')}
                    </p>
                  </div>
                )}

                {/* Results Display */}
                {stabilityResult && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                          {t('stabilityResultTitle')}
                        </span>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                          {stabilityResult.rating}
                        </h3>
                      </div>

                      <div className="px-4 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 text-center shadow-sm">
                        <p className="text-[9px] font-black uppercase">{t('gradeStabilityLabel')}</p>
                        <p className="text-2xl font-black">{stabilityResult.grade}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('avgPingLabel')}</p>
                        <p className="text-xl font-mono font-black text-cyan-600 dark:text-cyan-400">{stabilityResult.avgLatencyMs} ms</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('jitterLabel')}</p>
                        <p className="text-xl font-mono font-black text-purple-600 dark:text-purple-400">{stabilityResult.jitterMs} ms</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('minMaxPingLabel')}</p>
                        <p className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{stabilityResult.minLatencyMs}ms / {stabilityResult.maxLatencyMs}ms</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('packetLossLabel')}</p>
                        <p className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">{stabilityResult.packetLossPct}</p>
                      </div>
                    </div>

                    {/* Samples Visual Bar */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        {t('sampleDistributionLabel')}
                      </p>
                      <div className="flex items-end space-x-1 h-20 bg-white/80 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-inner">
                        {stabilityResult.samples && stabilityResult.samples.map((pingVal, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 min-w-[6px] rounded-t transition-all ${
                              pingVal <= 30 ? 'bg-cyan-500' : pingVal <= 70 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ height: `${Math.min(100, Math.max(15, (pingVal / 120) * 100))}%` }}
                            title={`Sampel #${idx + 1}: ${pingVal} ms`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STRESS TAB DISPLAY */}
            {activeSubTab === 'stress' && (
              <>
                {/* Empty / Ready State */}
                {!stressResult && !runningStress && (
                  <div className="py-16 text-center space-y-4">
                    <Flame className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-800 stroke-[1.2]" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold tracking-wide">
                      {t('readyStressWatermark')}
                    </p>
                  </div>
                )}

                {/* Running Stress State */}
                {runningStress && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6">
                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
                      <div
                        className="bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 h-full rounded-full transition-all duration-200"
                        style={{ width: `${stressProgress}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full text-center">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-200 block">{t('trafficDownloadLabel')}</span>
                        <p className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono">{stressLiveMetrics.dlMbps} Mbps</p>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-200 block">{t('trafficUploadLabel')}</span>
                        <p className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">{stressLiveMetrics.ulMbps} Mbps</p>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-200 block">{t('pingUnderLoadLabel')}</span>
                        <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{stressLiveMetrics.pingMs} ms</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-black animate-pulse">
                      {t('stressProgressText')} ({stressProgress}%)...
                    </p>
                  </div>
                )}

                {/* Stress Results Display */}
                {stressResult && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 font-black text-base">
                      <CheckCircle2 className="w-6 h-6" />
                      <span>{t('stressCompleteTitle')}</span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono font-bold shadow-sm">
                      {stressResult.message}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('avgDlSustained')}</p>
                        <p className="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono">{stressResult.sustainedDownloadMbps} Mbps</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('avgUlSustained')}</p>
                        <p className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">{stressResult.sustainedUploadMbps} Mbps</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-700 dark:text-slate-200 uppercase font-black">{t('bufferbloatScoreLabel')}</p>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">{stressResult.bufferbloatScore}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
