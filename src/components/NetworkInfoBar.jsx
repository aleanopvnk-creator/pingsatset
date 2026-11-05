import React, { useState, useEffect } from 'react';
import { Globe, Server, ShieldCheck, Wifi, Signal, Edit3, RefreshCw, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NetworkInfoBar({
  ipInfo,
  loading,
  selectedServer,
  onOpenServerSelector,
  onWifiDetected
}) {
  const { t } = useLanguage();
  const [wifiDetails, setWifiDetails] = useState(() => {
    try {
      const cached = localStorage.getItem('pingsatset_wifi_details');
      if (cached) return JSON.parse(cached);
    } catch (e) { }
    const cachedName = (typeof localStorage !== 'undefined' && localStorage.getItem('pingsatset_wifi_name')) || 'Wi-Fi';
    return {
      ssid: cachedName,
      signal: 89,
      rssi: -45,
      band: '2.4 GHz',
      channel: '6',
      radioType: '802.11n',
      adapter: 'Wi-Fi Adapter',
      rxRate: 144.4,
      connected: true,
      connectionType: 'Wi-Fi'
    };
  });

  const [isEditingSsid, setIsEditingSsid] = useState(false);
  const [customSsid, setCustomSsid] = useState(() => {
    try {
      return localStorage.getItem('pingsatset_wifi_name') || '';
    } catch (e) {
      return '';
    }
  });
  const [isScanning, setIsScanning] = useState(false);

  // Fetch actual connected Wi-Fi info from local OS
  const fetchWifiInfo = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/wifi-info');
      if (res.ok) {
        const data = await res.json();
        if (data && data.ssid) {
          setWifiDetails(data);
          setCustomSsid(data.ssid);
          try {
            localStorage.setItem('pingsatset_wifi_details', JSON.stringify(data));
            localStorage.setItem('pingsatset_wifi_name', data.ssid);
          } catch (err) { }
          if (onWifiDetected) onWifiDetected(data.ssid);
        }
      }
    } catch (e) {
      console.warn('Could not fetch /api/wifi-info, using fallback');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchWifiInfo();
  }, []);

  // Browser Network Information API listener
  useEffect(() => {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      const handleConnChange = () => {
        if (conn.downlink) {
          const qualityPct = Math.min(100, Math.max(30, Math.round(conn.downlink * 10)));
          setWifiDetails(prev => ({
            ...prev,
            signal: prev.signal || qualityPct
          }));
        }
      };
      conn.addEventListener('change', handleConnChange);
      return () => conn.removeEventListener('change', handleConnChange);
    }
  }, []);

  const currentSsid = customSsid || wifiDetails.ssid || 'Wi-Fi';
  const signalPct = wifiDetails.signal || 85;
  const signalBars = signalPct > 75 ? 4 : signalPct > 50 ? 3 : signalPct > 25 ? 2 : 1;

  return (
    <div className="w-full glass-panel p-3 sm:p-4 md:p-4.5 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-3.5 text-left transition-all shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-cyan-600 dark:text-cyan-400 stroke-[2.2]" />
            <span>{t('networkInfoBarHeader')}</span>
          </h4>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchWifiInfo}
            disabled={isScanning}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[10px] font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
            title={t('rescanTitle')}
          >
            <RefreshCw className={`w-3 h-3 text-cyan-500 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? t('btnScanning') : t('btnRescan')}</span>
          </button>
          <span className="px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700 uppercase">
            {t('statusConnected')}
          </span>
        </div>
      </div>

      {/* 6 Grid Cards - Clean Theme Icons, No Rainbow Colors, No Glow */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {/* 1. Nama WiFi (SSID) */}
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 block truncate">{t('infoWifiName')}</span>
            {isEditingSsid ? (
              <input
                type="text"
                value={customSsid}
                onChange={(e) => {
                  setCustomSsid(e.target.value);
                  if (onWifiDetected) onWifiDetected(e.target.value);
                }}
                onBlur={() => setIsEditingSsid(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingSsid(false)}
                className="w-full bg-slate-100 dark:bg-slate-950 text-xs font-black text-cyan-600 dark:text-cyan-400 border border-cyan-500 px-1 py-0.5 rounded focus:outline-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-between min-w-0">
                <span className="text-[11px] sm:text-xs font-black text-cyan-600 dark:text-cyan-400 truncate" title={currentSsid}>
                  {currentSsid}
                </span>
                <button
                  onClick={() => setIsEditingSsid(true)}
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 ml-1 shrink-0 cursor-pointer"
                  title={t('manualEditTitle')}
                >
                  <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Kekuatan Sinyal */}
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <Signal className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 block truncate">{t('infoSignal')}</span>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="flex items-end space-x-0.5 h-3">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`w-0.5 sm:w-1 rounded-sm transition-all ${bar <= signalBars
                        ? 'bg-cyan-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    style={{ height: `${bar * 25}%` }}
                  />
                ))}
              </div>
              <span className="text-[11px] sm:text-xs font-black font-mono text-slate-950 dark:text-white truncate">
                {signalPct}% <span className="text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-300 font-bold hidden xs:inline">({wifiDetails.rssi} dBm)</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Frekuensi & Channel */}
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div className="overflow-hidden min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 block truncate">{t('infoBand')}</span>
            <span className="text-[11px] sm:text-xs font-black text-slate-950 dark:text-white truncate block">
              {wifiDetails.band || '2.4 GHz'} <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">(Ch {wifiDetails.channel || '6'})</span>
            </span>
          </div>
        </div>

        {/* 4. Kecepatan Tautan (PHY Link Rate) */}
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div className="overflow-hidden min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 block truncate">{t('infoLinkRate')}</span>
            <span className="text-[11px] sm:text-xs font-black font-mono text-slate-950 dark:text-white truncate block">
              {wifiDetails.rxRate ? `${wifiDetails.rxRate} Mbps` : '144.4 Mbps'}
            </span>
          </div>
        </div>

        {/* 5. ISP & IP Publik */}
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div className="overflow-hidden min-w-0">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 block truncate">{t('infoIsp')}</span>
            <span className="text-[11px] sm:text-xs font-black text-slate-950 dark:text-white truncate block" title={ipInfo?.isp || 'Internet Service Provider'}>
              {loading ? t('checkingIsp') : ipInfo?.isp || 'Telkom Indonesia'}
            </span>
          </div>
        </div>

        {/* 6. Server Target Speed Test */}
        <div
          onClick={onOpenServerSelector}
          className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 cursor-pointer hover:border-cyan-500/80 transition-all shadow-sm min-w-0"
        >
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 block truncate">{t('serverTargetLabel')}</span>
              <span className="text-[8px] font-black text-cyan-600 dark:text-cyan-400 underline shrink-0 ml-1">{t('serverChange')}</span>
            </div>
            <span className="text-[11px] sm:text-xs font-black text-cyan-600 dark:text-cyan-400 truncate block">
              {selectedServer?.flagCode || 'ID'} {selectedServer?.name || 'Yogyakarta Core'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
