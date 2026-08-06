import React, { useState, useEffect } from 'react';
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
import SplashScreen from './components/SplashScreen';
import { SpeedTestEngine } from './services/speedtestEngine';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('speedtest');
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isServerSelectorOpen, setIsServerSelectorOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState({
    id: 'id-yog-01',
    name: 'Yogyakarta Core Server',
    location: 'Yogyakarta, DI Yogyakarta',
    country: 'ID',
    flagCode: 'ID',
    pingMs: 5,
    host: 'yog.speedtest.net'
  });

  const [metrics, setMetrics] = useState({
    download: 0,
    downloadPeak: 0,
    upload: 0,
    uploadPeak: 0,
    ping: 0,
    jitter: 0,
  });

  const [downloadChartData, setDownloadChartData] = useState([]);
  const [uploadChartData, setUploadChartData] = useState([]);
  const [pingChartData, setPingChartData] = useState([]);

  const [ipInfo, setIpInfo] = useState({ ip: '', isp: '', city: '', country: '', countryCode: '' });
  const [loadingIp, setLoadingIp] = useState(true);

  const [history, setHistory] = useState([]);

  // Load client IP info and saved history on mount
  useEffect(() => {
    fetchIpInfo();
    fetchHistory();
  }, []);

  const fetchIpInfo = async () => {
    setLoadingIp(true);
    try {
      const res = await fetch('/api/ip-info');
      if (res.ok) {
        const data = await res.json();
        setIpInfo(data);
      }
    } catch (e) {
      console.error('IP info error:', e);
      setIpInfo({ ip: '127.0.0.1', isp: 'Local Wi-Fi', city: 'Local', countryCode: 'ID' });
    } finally {
      setLoadingIp(false);
    }
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
    });

    const engine = new SpeedTestEngine((progress) => {
      setStage(progress.stage);

      if (progress.stage === 'ping') {
        if (progress.ping) {
          setMetrics((prev) => ({ ...prev, ping: parseFloat(progress.ping) }));
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
    } catch (e) {}
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('wifi_speedtest_history', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col relative overflow-hidden">
      {/* 1.5–2 Second Animated Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Dynamic Background Glows */}
      <div className="bg-glow-orb w-[500px] h-[500px] bg-cyan-600 -top-40 -left-40" />
      <div className="bg-glow-orb w-[600px] h-[600px] bg-purple-700 top-1/3 -right-60" />
      <div className="bg-glow-orb w-[450px] h-[450px] bg-blue-600 -bottom-40 left-1/3" />

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pb-12 z-10">
        {/* PWA Installation Prompt Banner */}
        <PWAInstallBanner />

        {/* Tab 1: Speed Test */}
        {activeTab === 'speedtest' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Speedometer Gauge Display */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 text-center shadow-2xl relative">
              <SpeedometerGauge
                isRunning={isRunning}
                stage={stage}
                currentSpeed={currentSpeed}
                onStartTest={handleStartTest}
              />
            </div>

            {/* Core Metrics Cards (Download, Upload, Ping, Jitter + Powered by Aleano) */}
            <MetricsCards
              download={metrics.download}
              downloadPeak={metrics.downloadPeak}
              upload={metrics.upload}
              uploadPeak={metrics.uploadPeak}
              ping={metrics.ping}
              jitter={metrics.jitter}
              stage={stage}
              onShare={() => setIsShareOpen(true)}
            />

            {/* Network Info Bar (SSID, Signal Strength, Public IP, ISP, Location, Server) */}
            <NetworkInfoBar
              ipInfo={ipInfo}
              loading={loadingIp}
              selectedServer={selectedServer}
              onOpenServerSelector={() => setIsServerSelectorOpen(true)}
            />

            {/* Real-time Throughput & Latency Charts */}
            <RealtimeCharts
              downloadHistory={downloadChartData}
              uploadHistory={uploadChartData}
              pingHistory={pingChartData}
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
        onSelectServer={(srv) => setSelectedServer(srv)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Footer & Legal Disclaimer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 z-10 space-y-2">
        <p className="font-semibold text-slate-400">© 2026 SpeedTest Pro • Powered by Aleano. All Rights Reserved.</p>
        <p className="text-[10px] text-slate-600 max-w-xl mx-auto px-4">
          Disclaimer: SpeedTest Pro adalah aplikasi analisis kinerja jaringan independen. Tidak berafiliasi dengan Ookla LLC atau merek dagang Speedtest®.
        </p>
        <div>
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-bold"
          >
            Kebijakan Privasi & Keamanan Data
          </button>
        </div>
      </footer>
    </div>
  );
}
