import React, { useState, useEffect } from 'react';
import { Globe, Server, ShieldCheck, Wifi, MapPin, Signal, Edit3 } from 'lucide-react';

export default function NetworkInfoBar({ ipInfo, loading, selectedServer, onOpenServerSelector }) {
  const [wifiSsid, setWifiSsid] = useState('Home_WiFi_5G');
  const [isEditingSsid, setIsEditingSsid] = useState(false);
  const [signalStrength, setSignalStrength] = useState({
    percentage: 92,
    dbm: -48,
    label: 'Sangat Kuat',
    bars: 4
  });

  // Detect Network Information API if supported
  useEffect(() => {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      const updateNetworkStatus = () => {
        if (conn.downlink) {
          const qualityPct = Math.min(100, Math.max(30, Math.round(conn.downlink * 10)));
          const estimatedDbm = -90 + Math.round(qualityPct * 0.5);
          setSignalStrength({
            percentage: qualityPct,
            dbm: estimatedDbm,
            label: qualityPct > 80 ? 'Sangat Kuat' : qualityPct > 50 ? 'Bagus' : 'Lemah',
            bars: qualityPct > 75 ? 4 : qualityPct > 50 ? 3 : qualityPct > 25 ? 2 : 1
          });
        }
      };
      updateNetworkStatus();
      conn.addEventListener('change', updateNetworkStatus);
      return () => conn.removeEventListener('change', updateNetworkStatus);
    }
  }, []);

  return (
    <div className="w-full glass-panel p-4 md:p-5 rounded-2xl border border-slate-800 my-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <span>Informasi Jaringan & Wi-Fi</span>
        </h4>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
          Real-Time Telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
        {/* Nama WiFi (SSID) */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="overflow-hidden flex-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Nama WiFi (SSID)</span>
            {isEditingSsid ? (
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                onBlur={() => setIsEditingSsid(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingSsid(false)}
                className="w-full bg-slate-950 text-xs font-semibold text-cyan-400 border border-cyan-500 px-1 rounded focus:outline-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold font-mono text-cyan-400 truncate">
                  {wifiSsid}
                </span>
                <button
                  onClick={() => setIsEditingSsid(true)}
                  className="text-slate-500 hover:text-slate-300 ml-1"
                  title="Ubah Nama WiFi"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Signal Strength (Kekuatan Sinyal) */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Signal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Signal Strength</span>
            <div className="flex items-center space-x-1.5">
              {/* Signal Bars */}
              <div className="flex items-end space-x-0.5 h-3">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-sm transition-all ${
                      bar <= signalStrength.bars
                        ? 'bg-emerald-400 shadow-glow-emerald'
                        : 'bg-slate-700'
                    }`}
                    style={{ height: `${bar * 25}%` }}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold font-mono text-slate-100">
                {signalStrength.percentage}% ({signalStrength.dbm} dBm)
              </span>
            </div>
          </div>
        </div>

        {/* Public IP */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Globe className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Public IP Address</span>
            <span className="text-xs font-semibold font-mono text-slate-100 truncate block">
              {loading ? 'Detecting...' : ipInfo.ip || '127.0.0.1'}
            </span>
          </div>
        </div>

        {/* ISP Provider */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Informasi ISP</span>
            <span className="text-xs font-semibold text-slate-100 truncate block">
              {loading ? 'Fetching...' : ipInfo.isp || 'Wi-Fi Network'}
            </span>
          </div>
        </div>

        {/* Lokasi */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Lokasi Server</span>
            <span className="text-xs font-semibold text-slate-100 truncate block">
              {loading ? 'Locating...' : `${ipInfo.city || 'Local'}, ${ipInfo.countryCode || 'ID'}`}
            </span>
          </div>
        </div>

        {/* Test Server Endpoint */}
        <div 
          onClick={onOpenServerSelector}
          className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-cyan-500/40 transition-all"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Server className="w-4 h-4" />
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Server Target</span>
              <span className="text-[8px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1 rounded">5 GHz (Ch 36)</span>
            </div>
            <span className="text-xs font-semibold text-cyan-400 truncate block mt-0.5">
              {selectedServer?.flagCode || 'ID'} {selectedServer?.name || 'Yogyakarta Core'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
