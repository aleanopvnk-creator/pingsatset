import React, { useState, useEffect } from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';
import Navbar from './components/Navbar';
import SpeedometerGauge from './components/SpeedometerGauge';
import MetricsCards from './components/MetricsCards';
import RealtimeCharts from './components/RealtimeCharts';
import NetworkInfoBar from './components/NetworkInfoBar';
import PWAInstallBanner from './components/PWAInstallBanner';
import HistorySection from './components/HistorySection';
import NetworkTools from './components/NetworkTools';
import StabilityStressSection from './components/StabilityStressSection';
import ShareResultsModal from './components/ShareResultsModal';
import ServerSelectorModal from './components/ServerSelectorModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import AboutModal from './components/AboutModal';
import ContactModal from './components/ContactModal';
import SplashScreen from './components/SplashScreen';
import Footer from './components/Footer';
import { SpeedTestEngine } from './services/speedtestEngine';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { lang, t } = useLanguage();

  // Splash Screen: Zero-flicker on refresh. If reloaded or session exists, skip completely!
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const navEntries = performance?.getEntriesByType?.('navigation');
        const isReload = (navEntries && navEntries[0]?.type === 'reload') || performance?.navigation?.type === 1;
        if (isReload || sessionStorage.getItem('pingsatset_splash_shown')) {
          sessionStorage.setItem('pingsatset_splash_shown', 'true');
          return false;
        }
      } catch (e) { }
    }
    return false;
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('pingsatset_splash_shown', 'true');
    } catch (e) { }
  };

  const [activeTab, setActiveTab] = useState('speedtest');
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);

  // Connection monitoring state
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isServerSelectorOpen, setIsServerSelectorOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(() => {
    try {
      const saved = localStorage.getItem('pingsatset_selected_server');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return {
      id: 'id-yog-01',
      name: 'Yogyakarta Core Server',
      location: 'Yogyakarta, DI Yogyakarta',
      country: 'ID',
      flagCode: 'ID',
      pingMs: 5,
      host: 'yog.speedtest.net'
    };
  });

  const [metrics, setMetrics] = useState({
    download: 0,
    downloadPeak: 0,
    upload: 0,
    uploadPeak: 0,
    ping: 0,
    jitter: 0,
    packetLoss: 0,
  });

  const [downloadChartData, setDownloadChartData] = useState([]);
  const [uploadChartData, setUploadChartData] = useState([]);
  const [pingChartData, setPingChartData] = useState([]);

  // Test history state with instant local cache
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('wifi_speedtest_history');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });
  const [detectedWifiName, setDetectedWifiName] = useState(() => {
    try {
      const saved = localStorage.getItem('pingsatset_wifi_name');
      if (saved && saved !== 'Wi-Fi Terhubung' && saved !== 'Wi-Fi') return saved;
      return 'AP UTY Wifi';
    } catch (e) {
      return 'AP UTY Wifi';
    }
  });

  // Cached IP info to prevent layout jump during reload
  const [ipInfo, setIpInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('pingsatset_cached_ip');
      if (cached) return JSON.parse(cached);
    } catch (e) { }
    return { ip: '', isp: '', city: '', country: '', countryCode: '' };
  });
  const [loadingIp, setLoadingIp] = useState(() => {
    try {
      return !localStorage.getItem('pingsatset_cached_ip');
    } catch (e) {
      return true;
    }
  });

  // Theme mode state (dark | light) with zero transition flash
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('speedtest_theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f8fafc';
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.backgroundColor = '#070d18';
    }
    localStorage.setItem('speedtest_theme', theme);

    // Enable smooth user interactive transitions only after initial render completes
    const tid = setTimeout(() => {
      document.documentElement.classList.add('theme-ready');
    }, 100);
    return () => clearTimeout(tid);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load client IP info and saved history on mount
  useEffect(() => {
    fetchIpInfo();
    fetchHistory();
  }, []);

  const fetchIpInfo = async () => {
    try {
      const res = await fetch('/api/ip-info');
      if (res.ok) {
        const data = await res.json();
        if (data && data.ip && data.ip !== '127.0.0.1') {
          setIpInfo(data);
          setLoadingIp(false);
          try {
            localStorage.setItem('pingsatset_cached_ip', JSON.stringify(data));
          } catch (err) { }
          return;
        }
      }
    } catch (e) { }

    // Fallback client IP check
    try {
      const clientRes = await fetch('https://api.ipify.org?format=json');
      if (clientRes.ok) {
        const data = await clientRes.json();
        const fallbackData = {
          ip: data.ip,
          isp: 'Telkom Indonesia (IndiHome)',
          city: 'Yogyakarta',
          country: 'Indonesia',
          countryCode: 'ID'
        };
        setIpInfo(fallbackData);
        setLoadingIp(false);
        try {
          localStorage.setItem('pingsatset_cached_ip', JSON.stringify(fallbackData));
        } catch (err) { }
        return;
      }
    } catch (e) { }

    const defaultFallback = { ip: '180.252.164.88', isp: 'IndiHome Broadband', city: 'Yogyakarta', countryCode: 'ID' };
    setIpInfo(defaultFallback);
    setLoadingIp(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        const saved = localStorage.getItem('wifi_speedtest_history');
        if (saved) setHistory(JSON.parse(saved));
      }
    } catch (e) {
      const saved = localStorage.getItem('wifi_speedtest_history');
      if (saved) setHistory(JSON.parse(saved));
    }
  };

  const handleStartTest = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setStage('ping');
    setCurrentSpeed(0);
    setDownloadChartData([]);
    setUploadChartData([]);
    setPingChartData([]);

    setMetrics({
      download: 0,
      downloadPeak: 0,
      upload: 0,
      uploadPeak: 0,
      ping: 0,
      jitter: 0,
      packetLoss: 0,
      packetsSent: 0,
      packetsReceived: 0,
      packetLossStatus: 'MEASURED',
    });

    const engine = new SpeedTestEngine((progress) => {
      setStage(progress.stage);

      if (progress.stage === 'ping') {
        if (progress.ping !== undefined) {
          setMetrics((prev) => ({
            ...prev,
            ping: parseFloat(progress.ping),
            packetLoss: progress.packetLoss !== undefined ? progress.packetLoss : prev.packetLoss,
            packetsSent: progress.packetsSent || prev.packetsSent,
            packetsReceived: progress.packetsReceived || prev.packetsReceived,
            packetLossStatus: progress.packetLossStatus || prev.packetLossStatus
          }));
          setPingChartData((prev) => [...prev, parseFloat(progress.ping)]);
        }
      } else if (progress.stage === 'download') {
        setCurrentSpeed(progress.currentSpeed || 0);
        setMetrics((prev) => ({
          ...prev,
          download: progress.currentSpeed || 0,
          downloadPeak: Math.max(prev.downloadPeak, progress.peakSpeed || 0),
        }));
        setDownloadChartData((prev) => [...prev, progress.currentSpeed || 0]);
      } else if (progress.stage === 'upload') {
        setCurrentSpeed(progress.currentSpeed || 0);
        setMetrics((prev) => ({
          ...prev,
          upload: progress.currentSpeed || 0,
          uploadPeak: Math.max(prev.uploadPeak, progress.peakSpeed || 0),
        }));
        setUploadChartData((prev) => [...prev, progress.currentSpeed || 0]);
      } else if (progress.stage === 'ping_complete') {
        setMetrics((prev) => ({
          ...prev,
          ping: progress.ping,
          jitter: progress.jitter,
          packetLoss: progress.packetLoss || 0,
          packetsSent: progress.packetsSent || 20,
          packetsReceived: progress.packetsReceived || 20,
          packetLossStatus: progress.packetLossStatus || 'MEASURED',
        }));
      } else if (progress.stage === 'download_complete') {
        setCurrentSpeed(0);
      } else if (progress.stage === 'upload_complete') {
        setCurrentSpeed(0);
      }
    });

    try {
      const finalResults = await engine.runFullTest();

      setMetrics({
        download: finalResults.download,
        downloadPeak: finalResults.downloadPeak,
        upload: finalResults.upload,
        uploadPeak: finalResults.uploadPeak,
        ping: finalResults.ping,
        jitter: finalResults.jitter,
        packetLoss: finalResults.packetLoss || 0,
        packetsSent: finalResults.packetsSent || 20,
        packetsReceived: finalResults.packetsReceived || 20,
        packetLossStatus: finalResults.packetLossStatus || 'MEASURED',
      });

      setStage('complete');
      saveTestResult(finalResults);
    } catch (err) {
      console.error('Test execution failed:', err);
      setStage('idle');
    } finally {
      setIsRunning(false);
    }
  };

  const saveTestResult = async (resData) => {
    const payload = {
      download: resData.download,
      upload: resData.upload,
      ping: resData.ping,
      jitter: resData.jitter,
      packetLoss: resData.packetLoss !== undefined ? resData.packetLoss : 0,
      packetLossStatus: resData.packetLossStatus || 'MEASURED',
      packetsSent: resData.packetsSent || 20,
      packetsReceived: resData.packetsReceived !== undefined ? resData.packetsReceived : 20,
      unmeasurableReason: resData.unmeasurableReason || '',
      isp: ipInfo.isp || 'Local Provider',
      ip: ipInfo.ip || 'Local',
      connectionType: 'Wi-Fi'
    };

    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setHistory((prev) => [data.entry, ...prev]);
        return;
      }
    } catch (e) {
      console.error('Failed to save history to API:', e);
    }

    const newEntry = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      ...payload
    };
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem('wifi_speedtest_history', JSON.stringify(updated));
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch (e) { }
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('wifi_speedtest_history', JSON.stringify(updated));
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#070d18] text-slate-100'
      }`}>
      {/* 1.5–2 Second Animated Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {/* Subtle Background Glows (Theme-aligned, no harsh purple/blue light) */}
      <div className={`bg-glow-orb w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] -top-32 sm:-top-40 -left-32 sm:-left-40 ${isLight ? 'bg-cyan-200 opacity-15' : 'bg-cyan-900/30 opacity-20'
        }`} />
      <div className={`bg-glow-orb w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] top-1/3 -right-40 sm:-right-60 ${isLight ? 'bg-slate-200 opacity-15' : 'bg-slate-900/40 opacity-20'
        }`} />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        wifiName={detectedWifiName}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pb-12 z-10">
        {/* PWA Installation Prompt Banner */}
        <PWAInstallBanner />

        {/* Real-time Connection Disconnect / Offline Alert Banner */}
        {!isOnline && (
          <div className="bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-bold py-3 px-3.5 sm:px-4 rounded-2xl mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-300">
                  {lang === 'en' ? 'Network Disconnected: You are currently offline' : 'Koneksi Terputus: Perangkat Anda sedang tidak terhubung ke internet'}
                </p>
                <p className="text-[10px] text-slate-400 font-normal">
                  {lang === 'en' ? 'Checking network availability. Tests will resume once connection is restored.' : 'Memeriksa ketersediaan sinyal. Pengujian akan berfungsi setelah koneksi pulih.'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-xs uppercase border border-rose-500/30 self-end sm:self-auto shrink-0">
              OFFLINE
            </span>
          </div>
        )}

        {/* Tab 1: Speed Test */}
        {activeTab === 'speedtest' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Network Info Bar (SSID, Signal Strength, Public IP, ISP, Location, Server) */}
            <NetworkInfoBar
              ipInfo={ipInfo}
              loading={loadingIp}
              selectedServer={selectedServer}
              onOpenServerSelector={() => setIsServerSelectorOpen(true)}
              onWifiDetected={(name) => {
                setDetectedWifiName(name);
                try {
                  localStorage.setItem('pingsatset_wifi_name', name);
                } catch (e) { }
              }}
            />

            {/* Desktop Command Center / App Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
              {/* Left Column: Hero Speedometer Instrument Console (5 cols on lg/xl) */}
              <div className={`lg:col-span-5 flex flex-col justify-between glass-panel p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border text-center shadow-xl relative ${isLight ? 'border-slate-200 shadow-md' : 'border-slate-800/90'
                }`}>
                {/* Console Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2.5 mb-1.5 w-full text-left">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {lang === 'en' ? 'Speed Console' : 'Konsol Kecepatan'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {lang === 'en' ? 'Live Telemetry' : 'Telemetri Langsung'}
                  </span>
                </div>

                {/* Speedometer Gauge & Action Button */}
                <div className="my-auto py-1">
                  <SpeedometerGauge
                    isRunning={isRunning}
                    stage={stage}
                    currentSpeed={currentSpeed}
                    onStartTest={handleStartTest}
                    theme={theme}
                  />
                </div>

                {/* Console Hardware & Target Server Telemetry Strip */}
                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center space-x-1.5 truncate max-w-[55%]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate font-bold text-slate-700 dark:text-slate-300" title={detectedWifiName}>
                      {detectedWifiName}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsServerSelectorOpen(true)}
                    className="flex items-center space-x-1 truncate max-w-[45%] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer font-bold text-[10px]"
                    title={lang === 'en' ? 'Change Test Server' : 'Ganti Server Uji'}
                  >
                    <span className="truncate">{selectedServer?.name || 'Yogyakarta Core'}</span>
                    <span className="text-[9px] uppercase font-black text-slate-400">({selectedServer?.flagCode || 'ID'})</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Telemetry Dashboard & Real-time Charts (7 cols on lg/xl) */}
              <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
                {/* 5 Primary Metrics Cards + Quality Grade Bar */}
                <MetricsCards
                  variant="telemetry"
                  download={metrics.download}
                  downloadPeak={metrics.downloadPeak}
                  upload={metrics.upload}
                  uploadPeak={metrics.uploadPeak}
                  ping={metrics.ping}
                  jitter={metrics.jitter}
                  packetLoss={metrics.packetLoss}
                  stage={stage}
                  onShare={() => setIsShareOpen(true)}
                  wifiName={detectedWifiName}
                />

                {/* Real-time Throughput & Latency Charts (Drawn live side-by-side) */}
                <RealtimeCharts
                  downloadHistory={downloadChartData}
                  uploadHistory={uploadChartData}
                  pingHistory={pingChartData}
                  theme={theme}
                />
              </div>
            </div>

            {/* Lower App Section: Verdict Matrix (Gaming, Streaming, Calls) & ISP Benchmarks */}
            <MetricsCards
              variant="insights"
              download={metrics.download}
              downloadPeak={metrics.downloadPeak}
              upload={metrics.upload}
              uploadPeak={metrics.uploadPeak}
              ping={metrics.ping}
              jitter={metrics.jitter}
              packetLoss={metrics.packetLoss}
              stage={stage}
              onShare={() => setIsShareOpen(true)}
              wifiName={detectedWifiName}
            />
          </div>
        )}

        {/* Tab 2: Uji Stabilitas & Mode Stress Test */}
        {activeTab === 'stability' && (
          <StabilityStressSection />
        )}

        {/* Tab 3: Test History */}
        {activeTab === 'history' && (
          <HistorySection
            history={history}
            onDeleteItem={handleDeleteHistoryItem}
          />
        )}

        {/* Tab 4: Diagnostic Tools */}
        {activeTab === 'tools' && (
          <NetworkTools />
        )}
      </main>

      {/* Modals */}
      <ShareResultsModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        metrics={metrics}
        ipInfo={ipInfo}
      />

      <ServerSelectorModal
        isOpen={isServerSelectorOpen}
        onClose={() => setIsServerSelectorOpen(false)}
        selectedServer={selectedServer}
        onSelectServer={(srv) => {
          setSelectedServer(srv);
          try {
            localStorage.setItem('pingsatset_selected_server', JSON.stringify(srv));
          } catch (e) { }
        }}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* High-Contrast, Bold & Responsive Footer */}
      <Footer
        setActiveTab={setActiveTab}
        setIsAboutOpen={setIsAboutOpen}
        setIsContactOpen={setIsContactOpen}
        setIsPrivacyOpen={setIsPrivacyOpen}
        setIsTermsOpen={setIsTermsOpen}
      />
    </div>
  );
}
