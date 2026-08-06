import React, { useState, useEffect } from 'react';
import { Server, Check, X, Globe, Zap, RefreshCw } from 'lucide-react';

export default function ServerSelectorModal({ isOpen, onClose, selectedServer, onSelectServer }) {
  const [servers, setServers] = useState([
    { id: 'id-yog-01', name: 'Yogyakarta Core Server', location: 'Yogyakarta, DI Yogyakarta', country: 'ID', flagCode: 'ID', pingMs: 5, host: 'yog.speedtest.net', isDefault: true },
    { id: 'id-jkt-01', name: 'Jakarta Telecom IX', location: 'Jakarta, Indonesia', country: 'ID', flagCode: 'ID', pingMs: 12, host: 'jkt.speedtest.net' },
    { id: 'id-sub-01', name: 'Surabaya Data Center', location: 'Surabaya, Jawa Timur', country: 'ID', flagCode: 'ID', pingMs: 16, host: 'sub.speedtest.net' },
    { id: 'sg-sin-01', name: 'Singapore Telecom IX', location: 'Singapore', country: 'SG', flagCode: 'SG', pingMs: 24, host: 'sg.speedtest.net' },
    { id: 'jp-tyo-01', name: 'Tokyo Fast IX', location: 'Tokyo, Japan', country: 'JP', flagCode: 'JP', pingMs: 72, host: 'tyo.speedtest.net' },
    { id: 'us-lax-01', name: 'California Transpacific', location: 'Los Angeles, USA', country: 'US', flagCode: 'US', pingMs: 175, host: 'lax.speedtest.net' }
  ]);
  const [testingPing, setTestingPing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchServerPings();
    }
  }, [isOpen]);

  const fetchServerPings = async () => {
    setTestingPing(true);
    try {
      const res = await fetch('/api/speedtest/servers');
      if (res.ok) {
        const data = await res.json();
        if (data.servers) setServers(data.servers);
      }
    } catch (e) {
      console.error('Failed to fetch server ping list:', e);
    } finally {
      setTestingPing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg glass-panel p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-glow-cyan">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Pilih Server Target Speedtest</h3>
            <p className="text-xs text-slate-400">Pilih lokasi server terdekat (Default: Yogyakarta) atau regional</p>
          </div>
        </div>

        <div className="space-y-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
          {servers.map((srv) => {
            const isSelected = selectedServer?.id === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => {
                  onSelectServer(srv);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-glow-cyan'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs font-mono text-cyan-300">
                    {srv.flagCode || srv.country || 'ID'}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm flex items-center space-x-2">
                      <span>{srv.name}</span>
                      {isSelected && <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500 text-slate-950">AKTIF</span>}
                      {srv.isDefault && !isSelected && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-800 text-slate-400">DEFAULT</span>}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">{srv.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                    srv.pingMs < 30 ? 'bg-emerald-500/20 text-emerald-300' : srv.pingMs < 100 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {srv.pingMs} ms
                  </span>
                  {isSelected && <Check className="w-5 h-5 text-cyan-400" />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={fetchServerPings}
          disabled={testingPing}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${testingPing ? 'animate-spin' : ''}`} />
          <span>{testingPing ? 'Uji Latensi Server...' : 'Refresh Latensi All Server'}</span>
        </button>
      </div>
    </div>
  );
}
