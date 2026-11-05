import React, { useState } from 'react';
import {
  Wrench, Activity, GitCommit, ShieldCheck, Database, FileText,
  Lock, ArrowLeftRight, Server, Clock, Search, Copy, Download,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink,
  ChevronDown, ChevronUp, Check, Info, ShieldAlert
} from 'lucide-react';

export default function NetworkTools() {
  const [activeTool, setActiveTool] = useState('ping');
  const [hostInput, setHostInput] = useState('google.com');
  const [portInput, setPortInput] = useState('80');
  const [dnsTypeFilter, setDnsTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [toolResults, setToolResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [toastMsg, setToastMsg] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const runTool = async (overrideTool = null, overrideHost = null, overridePort = null) => {
    const toolToRun = overrideTool || activeTool;
    const targetHost = overrideHost !== null ? overrideHost : hostInput;
    const targetPort = overridePort !== null ? overridePort : portInput;

    setLoading(true);
    setErrorMsg(null);
    setToolResults(null);
    setShowRaw(false);

    let endpoint = '';
    const encodedHost = encodeURIComponent(targetHost || 'google.com');

    switch (toolToRun) {
      case 'ping':
        endpoint = `/api/tools/ping?host=${encodedHost}`;
        break;
      case 'traceroute':
        endpoint = `/api/tools/traceroute?host=${encodedHost}`;
        break;
      case 'port':
        endpoint = `/api/tools/port?host=${encodedHost}&port=${targetPort || 80}`;
        break;
      case 'dns':
        endpoint = `/api/tools/dns?host=${encodedHost}`;
        break;
      case 'whois':
        endpoint = `/api/tools/whois?host=${encodedHost}`;
        break;
      case 'ssl':
        endpoint = `/api/tools/ssl?host=${encodedHost}&port=${targetPort || 443}`;
        break;
      case 'reverse-dns':
        endpoint = `/api/tools/reverse-dns?host=${encodedHost}`;
        break;
      case 'http-headers':
        endpoint = `/api/tools/http-headers?host=${encodedHost}`;
        break;
      case 'response-time':
        endpoint = `/api/tools/response-time?host=${encodedHost}`;
        break;
      default:
        endpoint = `/api/tools/ping?host=${encodedHost}`;
    }

    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setToolResults(data);
        showNotification(`Diagnostik ${toolToRun.toUpperCase()} selesai dengan sukses!`);
      } else {
        throw new Error(`Server merespon dengan status ${res.status}`);
      }
    } catch (err) {
      console.error('Tool execution error:', err);
      setErrorMsg(err.message || 'Gagal menjalankan pengujian diagnostik.');
    } finally {
      setLoading(false);
    }
  };

  // Action Helpers
  const handleCopyJSON = () => {
    if (!toolResults) return;
    navigator.clipboard.writeText(JSON.stringify(toolResults, null, 2));
    showNotification('Hasil JSON berhasil disalin ke clipboard!');
  };

  const handleExportJSON = () => {
    if (!toolResults) return;
    const blob = new Blob([JSON.stringify(toolResults, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Diagnostic-${activeTool}-${Date.now()}.json`;
    link.click();
    showNotification('Berkas JSON berhasil diunduh!');
  };

  const handleExportCSV = () => {
    if (!toolResults) return;
    let csvData = "Tool,Target,Status,Timestamp\n";
    csvData += `"${activeTool}","${hostInput}","${toolResults.status || 'OK'}","${new Date().toISOString()}"\n`;

    if (activeTool === 'traceroute' && toolResults.hops) {
      csvData += "\nHop,IP,RTT,NodeName\n";
      toolResults.hops.forEach(h => {
        csvData += `${h.hop},"${h.ip}","${h.rtt}","${h.nodeName}"\n`;
      });
    } else if (activeTool === 'dns' && toolResults.records) {
      csvData += "\nType,Value,TTL\n";
      toolResults.records.forEach(r => {
        csvData += `"${r.type}","${r.value}","${r.ttl}"\n`;
      });
    } else if (activeTool === 'http-headers' && toolResults.headers) {
      csvData += "\nHeader,Value\n";
      toolResults.headers.forEach(h => {
        csvData += `"${h.name}","${h.value.replace(/"/g, '""')}"\n`;
      });
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Diagnostic-${activeTool}-${Date.now()}.csv`;
    link.click();
    showNotification('Berkas CSV berhasil diunduh!');
  };

  const toolsList = [
    { id: 'ping', label: 'Host Ping Test', icon: Activity, desc: 'Uji latensi & packet loss' },
    { id: 'traceroute', label: 'Traceroute Hops', icon: GitCommit, desc: 'Lacak rute jaringan hop-by-hop' },
    { id: 'port', label: 'Port Checker', icon: Server, desc: 'Cek status port TCP terbuka' },
    { id: 'dns', label: 'DNS Lookup', icon: Database, desc: 'Query record DNS (A, MX, NS, TXT)' },
    { id: 'whois', label: 'WHOIS Lookup', icon: FileText, desc: 'Cek informasi domain & pendaftaran' },
    { id: 'ssl', label: 'SSL/TLS Checker', icon: Lock, desc: 'Verifikasi masa berlaku sertifikat SSL' },
    { id: 'reverse-dns', label: 'Reverse DNS (PTR)', icon: ArrowLeftRight, desc: 'Resolusi IP ke hostname PTR' },
    { id: 'http-headers', label: 'HTTP Header Checker', icon: ShieldCheck, desc: 'Audit header keamanan server' },
    { id: 'response-time', label: 'Response Time / TTFB', icon: Clock, desc: 'Uji breakdown kecepatan waktu respon' },
  ];

  return (
    <div className="w-full glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 my-8 space-y-6 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-2xl shadow-2xl flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-glow-purple">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ENTERPRISE NETWORK SUITE
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mt-1">
              Network Diagnostic Tools
            </h2>
            <p className="text-xs text-slate-400">
              Peralatan analisis jaringan profesional dengan visualisasi visual & audit keamanan real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Grid selector buttons for all 9 diagnostic tools */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {toolsList.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                setToolResults(null);
                setErrorMsg(null);
              }}
              className={`p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <IconComp className={`w-4 h-4 mb-2 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <div>
                <p className="text-xs font-bold truncate">{t.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input Form Box */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={activeTool === 'port' || activeTool === 'ssl' ? 'md:col-span-3' : 'md:col-span-4'}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Host / Domain / IP Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runTool()}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500 pr-24"
                placeholder="e.g. google.com, 8.8.8.8, atau domain.id"
              />
              <button
                onClick={() => runTool()}
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gradient-cyber text-slate-950 font-black text-xs rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                <span>{loading ? 'TESTING...' : 'JALANKAN'}</span>
              </button>
            </div>
          </div>

          {(activeTool === 'port' || activeTool === 'ssl') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Port
              </label>
              <input
                type="number"
                value={portInput}
                onChange={(e) => setPortInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                placeholder={activeTool === 'ssl' ? '443' : '80'}
              />
            </div>
          )}
        </div>

        {/* Shortcuts for Port Checker */}
        {activeTool === 'port' && (
          <div className="flex items-center space-x-2 pt-2 text-[11px] text-slate-400">
            <span className="font-bold uppercase text-slate-500">Quick Ports:</span>
            {[
              { port: 80, label: 'HTTP (80)' },
              { port: 443, label: 'HTTPS (443)' },
              { port: 22, label: 'SSH (22)' },
              { port: 21, label: 'FTP (21)' },
              { port: 3306, label: 'MySQL (3306)' },
              { port: 8080, label: 'HTTP-Alt (8080)' }
            ].map(p => (
              <button
                key={p.port}
                onClick={() => {
                  setPortInput(p.port.toString());
                  runTool('port', hostInput, p.port.toString());
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Skeleton Animation */}
      {loading && (
        <div className="py-12 space-y-6">
          <div className="text-center space-y-3">
            <RefreshCw className="w-9 h-9 text-cyan-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-white uppercase tracking-wider">Menjalankan Diagnostik Real-Time...</p>
            <p className="text-xs text-slate-400 font-mono">Connecting to target {hostInput}...</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="h-3 bg-slate-800 rounded w-1/3"></div>
              <div className="h-8 bg-slate-800 rounded w-2/3"></div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="h-3 bg-slate-800 rounded w-1/3"></div>
              <div className="h-8 bg-slate-800 rounded w-2/3"></div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="h-3 bg-slate-800 rounded w-1/3"></div>
              <div className="h-8 bg-slate-800 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Banner */}
      {!toolResults && !loading && !errorMsg && (
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-14 h-14 mx-auto flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Siap Menjalankan Diagnostik Jaringan</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Masukkan nama domain atau IP address di atas lalu tekan 'JALANKAN' untuk melakukan analisis real-time.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Preset Target Populer:</span>
            {['google.com', '8.8.8.8', 'cloudflare.com', 'github.com', '1.1.1.1'].map(preset => (
              <button
                key={preset}
                onClick={() => {
                  setHostInput(preset);
                  runTool(activeTool, preset);
                }}
                className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all hover:scale-105"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && !loading && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center space-x-3">
          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase">Gagal Melakukan Pengujian</p>
            <p className="text-xs text-slate-300">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Enterprise Results Renderer */}
      {toolResults && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Diagnostic Action Bar (Public Friendly) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs uppercase border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{toolResults.status || 'SUCCESS'}</span>
              </span>
              <span className="text-xs font-bold font-mono text-slate-200">
                TARGET: {toolResults.host || toolResults.domain || toolResults.target || toolResults.url || hostInput}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all flex items-center space-x-1.5 shadow-glow-cyan"
              >
                <Download className="w-4 h-4" />
                <span>Download Hasil (CSV)</span>
              </button>

              <button
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  if (!printWin) return;
                  printWin.document.write(`
                    <html>
                      <head>
                        <title>Laporan Diagnostik ${activeTool.toUpperCase()} - ${hostInput}</title>
                        <style>
                          body { font-family: sans-serif; margin: 30px; color: #0f172a; }
                          h2 { color: #0284c7; }
                          pre { background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 12px; }
                        </style>
                      </head>
                      <body>
                        <h2>PINGSATSET - LAPORAN DIAGNOSTIK (${activeTool.toUpperCase()})</h2>
                        <p><strong>Target:</strong> ${hostInput} | <strong>Tanggal:</strong> ${new Date().toLocaleString('id-ID')}</p>
                        <hr/>
                        <pre>${JSON.stringify(toolResults, null, 2)}</pre>
                        <script>window.onload = function() { window.print(); }</script>
                      </body>
                    </html>
                  `);
                  printWin.document.close();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Cetak / Export PDF</span>
              </button>
            </div>
          </div>

          {/* TOOL 1: HOST PING TEST (Dynamic Color Line Chart Visualization) */}
          {activeTool === 'ping' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Min Latency</p>
                  <p className="text-2xl font-black text-emerald-400 font-mono">{toolResults.minLatencyMs} ms</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Avg Latency</p>
                  <p className="text-2xl font-black text-cyan-400 font-mono">{toolResults.avgLatencyMs} ms</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Max Latency</p>
                  <p className="text-2xl font-black text-amber-400 font-mono">{toolResults.maxLatencyMs} ms</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Jitter (Variasi)</p>
                  <p className="text-2xl font-black text-purple-400 font-mono">{toolResults.jitterMs} ms</p>
                </div>
              </div>

              {/* Dynamic Real-Time Latency Line Graph with Color Indicators */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-200">Visualisasi Grafik Latensi Real-Time</h4>
                    <p className="text-[11px] text-slate-400">Grafik tren respon latensi dengan status warna intuitif</p>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] font-bold">
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">🟢 Bagus (≤30ms)</span>
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">🟡 Sedang (31-70ms)</span>
                    <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">🔴 Buruk (&gt;70ms)</span>
                  </div>
                </div>

                {/* SVG Responsive Dynamic Line Graph */}
                <div className="relative h-44 w-full bg-slate-950/80 rounded-xl p-4 overflow-hidden border border-slate-800/80">
                  {(() => {
                    const samples = toolResults.samples && toolResults.samples.length ? toolResults.samples : [15, 18, 14, 16];
                    const maxVal = Math.max(100, ...samples);
                    const width = 600;
                    const height = 120;
                    const step = samples.length > 1 ? width / (samples.length - 1) : width;

                    const points = samples.map((val, idx) => {
                      const x = idx * step;
                      const y = height - (val / maxVal) * (height - 20) - 10;
                      return { x, y, val };
                    });

                    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

                    return (
                      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="latencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Background grid lines */}
                        <line x1="0" y1="30" x2={width} y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="60" x2={width} y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="90" x2={width} y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                        {/* Shaded Area Under Line */}
                        <polygon
                          points={`0,${height} ${polylinePoints} ${width},${height}`}
                          fill="url(#latencyAreaGrad)"
                        />

                        {/* Connecting Line */}
                        <polyline
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylinePoints}
                        />

                        {/* Data Points with Status Color Coding */}
                        {points.map((p, idx) => {
                          const statusColor = p.val <= 30 ? '#10b981' : p.val <= 70 ? '#f59e0b' : '#f43f5e';
                          return (
                            <g key={idx} className="cursor-pointer group">
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="6"
                                fill={statusColor}
                                stroke="#0f172a"
                                strokeWidth="2"
                                className="transition-transform duration-200 group-hover:scale-150"
                              />
                              <text
                                x={p.x}
                                y={Math.max(15, p.y - 10)}
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                                className="font-mono"
                              >
                                {p.val}ms
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>PAKET DIKIRIM: {toolResults.packetsSent} | DITERIMA: {toolResults.packetsReceived}</span>
                  <span className="text-emerald-400">PACKET LOSS: {toolResults.packetLoss}</span>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: TRACEROUTE HOPS */}
          {activeTool === 'traceroute' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-300">Daftar Hop Rute Jaringan ({toolResults.totalHops} Hops)</h4>
                <div className="relative w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari IP / Node..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 pl-8"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Hop #</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">RTT Latency</th>
                      <th className="p-3">Identitas Node / Exchange</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {toolResults.hops
                      ?.filter(h => h.ip.includes(searchQuery) || h.nodeName.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((hop) => (
                        <tr key={hop.hop} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-bold text-cyan-400">#{hop.hop}</td>
                          <td className="p-3 text-slate-100 font-bold">{hop.ip}</td>
                          <td className="p-3 text-amber-400 font-bold">{hop.rtt}</td>
                          <td className="p-3 text-slate-300 font-sans">{hop.nodeName}</td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {hop.status || 'ONLINE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOOL 3: PORT CHECKER */}
          {activeTool === 'port' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status Port TCP</span>
                  <div className="mt-2 flex items-center space-x-3">
                    {toolResults.status === 'OPEN' ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    ) : toolResults.status === 'TIMEOUT' ? (
                      <Clock className="w-8 h-8 text-orange-400" />
                    ) : toolResults.status === 'FILTERED' ? (
                      <ShieldAlert className="w-8 h-8 text-amber-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-rose-400" />
                    )}
                    <div>
                      <h3 className={`text-2xl font-black ${
                        toolResults.status === 'OPEN'
                          ? 'text-emerald-400'
                          : toolResults.status === 'TIMEOUT'
                          ? 'text-orange-400'
                          : toolResults.status === 'FILTERED'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {toolResults.status}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">Port {toolResults.port} / {toolResults.service}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                  Response Latency: <span className="text-cyan-400 font-bold">{toolResults.latencyMs || 0} ms</span>
                </div>
              </div>

              <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-300">Deskripsi Diagnostik Port</h4>
                <p className="text-xs text-slate-300 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {toolResults.reason || toolResults.message}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Target Host</span>
                    <span className="text-slate-200 font-bold">{toolResults.host}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Layanan Terdeteksi</span>
                    <span className="text-cyan-400 font-bold">{toolResults.service}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: DNS LOOKUP */}
          {activeTool === 'dns' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['ALL', 'A', 'AAAA', 'MX', 'NS', 'TXT'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setDnsTypeFilter(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                        dnsTypeFilter === t
                          ? 'bg-cyan-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  TOTAL RECORDS: <span className="text-cyan-400 font-bold">{toolResults.totalRecords || 0}</span>
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Record Type</th>
                      <th className="p-3">Value / Target</th>
                      <th className="p-3 text-right">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {toolResults.records
                      ?.filter(r => dnsTypeFilter === 'ALL' || r.type === dnsTypeFilter)
                      .map((rec, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              rec.type === 'A' ? 'bg-cyan-500/20 text-cyan-300' :
                              rec.type === 'MX' ? 'bg-purple-500/20 text-purple-300' :
                              rec.type === 'NS' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {rec.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-100 font-semibold">{rec.value}</td>
                          <td className="p-3 text-slate-400 text-right">{rec.ttl}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOOL 5: WHOIS LOOKUP */}
          {activeTool === 'whois' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Registrar Domain</span>
                  <p className="text-sm font-bold text-cyan-400 truncate mt-1">{toolResults.registrar}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tanggal Dibuat</span>
                  <p className="text-sm font-bold text-emerald-400 font-mono mt-1">{toolResults.creationDate}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tanggal Kadaluarsa</span>
                  <p className="text-sm font-bold text-amber-400 font-mono mt-1">{toolResults.expirationDate}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-300">Name Servers Pendaftaran</h4>
                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <span>{showRaw ? 'Sembunyikan Raw Text' : 'Tampilkan Raw WHOIS Text'}</span>
                    {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {toolResults.nameServers?.map((ns, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                      {ns}
                    </span>
                  ))}
                </div>

                {showRaw && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-60 mt-3">
                    {toolResults.rawWhois}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* TOOL 6: SSL / TLS CHECKER */}
          {activeTool === 'ssl' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Status Sertifikat SSL</span>
                  <div className="mt-2 flex items-center space-x-3">
                    {toolResults.isValid ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-rose-400" />
                    )}
                    <div>
                      <h3 className={`text-xl font-black ${toolResults.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {toolResults.isValid ? 'VALID & SECURE' : 'EXPIRED / INVALID'}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">Sisa {toolResults.daysRemaining} Hari Berlaku</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, (toolResults.daysRemaining / 365) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-300">Informasi Penerbit & Protokol Enkripsi</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Penerbit (Issuer)</span>
                    <span className="text-cyan-400 font-bold block truncate">{toolResults.issuer}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Subject Host</span>
                    <span className="text-slate-200 font-bold block truncate">{toolResults.subject}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Protokol SSL/TLS</span>
                    <span className="text-purple-400 font-bold block">{toolResults.protocol}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Cipher Suite</span>
                    <span className="text-emerald-400 font-bold block truncate">{toolResults.cipher}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 7: REVERSE DNS (PTR) */}
          {activeTool === 'reverse-dns' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Target IP Address</span>
                  <p className="text-lg font-bold font-mono text-cyan-400">{toolResults.ip}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {toolResults.status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">PTR Hostnames Terdaftar</h4>
                <div className="space-y-2">
                  {toolResults.hostnames?.map((host, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center justify-between">
                      <span>{host}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">PTR RECORD</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 8: HTTP HEADER CHECKER */}
          {activeTool === 'http-headers' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1.5 rounded-xl font-black text-sm font-mono border ${
                    toolResults.statusCode >= 200 && toolResults.statusCode < 300
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}>
                    {toolResults.statusCode} {toolResults.statusText}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{toolResults.url}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Server: {toolResults.server}</p>
                  </div>
                </div>
              </div>

              {/* Security Audit Badges */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-300">Audit Header Keamanan Server (Security Headers)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { key: 'hsts', label: 'HSTS (Strict-Transport)' },
                    { key: 'csp', label: 'Content-Security-Policy' },
                    { key: 'xFrameOptions', label: 'X-Frame-Options' },
                    { key: 'xContentType', label: 'X-Content-Type-Options' },
                    { key: 'referrerPolicy', label: 'Referrer-Policy' }
                  ].map(sec => {
                    const isPresent = toolResults.securityAudit?.[sec.key];
                    return (
                      <div key={sec.key} className={`p-2.5 rounded-xl border text-center font-bold ${
                        isPresent ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        <p className="text-[9px] uppercase">{sec.label}</p>
                        <p className="text-xs mt-1">{isPresent ? 'PASSED ✓' : 'MISSING ✗'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Headers Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Header Key</th>
                      <th className="p-3">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {toolResults.headers?.map((h, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-bold text-cyan-400">{h.name}</td>
                        <td className="p-3 text-slate-300 break-all">{h.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOOL 9: RESPONSE TIME & TTFB */}
          {activeTool === 'response-time' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400">DNS Lookup</span>
                  <p className="text-xl font-bold font-mono text-cyan-400">{toolResults.metrics?.dnsLookupMs} ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400">TCP Connect</span>
                  <p className="text-xl font-bold font-mono text-purple-400">{toolResults.metrics?.tcpConnectMs} ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400">TLS Handshake</span>
                  <p className="text-xl font-bold font-mono text-amber-400">{toolResults.metrics?.tlsHandshakeMs} ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400">TTFB (First Byte)</span>
                  <p className="text-xl font-bold font-mono text-emerald-400">{toolResults.metrics?.ttfbMs} ms</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Total Duration</span>
                  <p className="text-xl font-bold font-mono text-white">{toolResults.metrics?.totalTimeMs} ms</p>
                </div>
              </div>

              {/* Waterfall Bar Visualizer */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-300">Waktu Respon Waterfall Breakdown</h4>
                <div className="w-full bg-slate-950 h-6 rounded-xl overflow-hidden flex p-1 border border-slate-800">
                  <div className="bg-cyan-500 h-full rounded-l" style={{ width: `${Math.max(5, (toolResults.metrics?.dnsLookupMs / toolResults.metrics?.totalTimeMs) * 100)}%` }} title="DNS Lookup" />
                  <div className="bg-purple-500 h-full" style={{ width: `${Math.max(5, (toolResults.metrics?.tcpConnectMs / toolResults.metrics?.totalTimeMs) * 100)}%` }} title="TCP Connect" />
                  <div className="bg-amber-500 h-full" style={{ width: `${Math.max(5, (toolResults.metrics?.tlsHandshakeMs / toolResults.metrics?.totalTimeMs) * 100)}%` }} title="TLS Handshake" />
                  <div className="bg-emerald-500 h-full rounded-r" style={{ width: `${Math.max(10, (toolResults.metrics?.ttfbMs / toolResults.metrics?.totalTimeMs) * 100)}%` }} title="TTFB" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
