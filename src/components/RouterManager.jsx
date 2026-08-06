import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Laptop, 
  Tv, 
  Router, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Users, 
  Radio, 
  Server
} from 'lucide-react';

export default function RouterManager() {
  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'wifi' | 'portal'
  
  // Connected Devices state
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceStats, setDeviceStats] = useState({ total: 0, gateway: '192.168.1.1', localIp: '127.0.0.1' });
  
  // Wi-Fi Password Change State
  const [wifiSsid, setWifiSsid] = useState('My-IndiHome-WiFi');
  const [wifiPass, setWifiPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [routerModel, setRouterModel] = useState('ZTE F609 / F670 (IndiHome)');
  const [routerUser, setRouterUser] = useState('user');
  const [routerAdminPass, setRouterAdminPass] = useState('user');
  const [gatewayIp, setGatewayIp] = useState('192.168.1.1');
  const [savingWifi, setSavingWifi] = useState(false);
  const [wifiResponse, setWifiResponse] = useState(null);

  // Gateway status state
  const [gatewayInfo, setGatewayInfo] = useState(null);
  const [checkingGateway, setCheckingGateway] = useState(false);

  // Fetch connected devices from backend ARP API
  const fetchConnectedDevices = async () => {
    setLoadingDevices(true);
    try {
      const res = await fetch('/api/router/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
        setDeviceStats({
          total: data.totalDevices || (data.devices || []).length,
          gateway: data.gatewayIp || '192.168.1.1',
          localIp: data.localIp || '127.0.0.1'
        });
        if (data.gatewayIp) setGatewayIp(data.gatewayIp);
      }
    } catch (err) {
      console.error('Gagal mengambil daftar perangkat:', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  // Check Gateway status
  const checkGatewayStatus = async () => {
    setCheckingGateway(true);
    try {
      const res = await fetch('/api/router/gateway');
      if (res.ok) {
        const data = await res.json();
        setGatewayInfo(data);
        if (data.gatewayIp) setGatewayIp(data.gatewayIp);
      }
    } catch (err) {
      console.error('Gagal memeriksa gateway:', err);
    } finally {
      setCheckingGateway(false);
    }
  };

  useEffect(() => {
    fetchConnectedDevices();
    checkGatewayStatus();
  }, []);

  // Filter devices by search query
  const filteredDevices = devices.filter(dev => 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.ip.includes(searchQuery) ||
    dev.mac.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Submit Change Wi-Fi Password
  const handleSaveWifi = async (e) => {
    e.preventDefault();
    if (!wifiSsid.trim() || !wifiPass) {
      setWifiResponse({
        success: false,
        message: 'Nama SSID Wi-Fi dan Password baru wajib diisi!'
      });
      return;
    }

    if (wifiPass.length < 8) {
      setWifiResponse({
        success: false,
        message: 'Sandi Wi-Fi minimal harus 8 karakter demi keamanan.'
      });
      return;
    }

    setSavingWifi(true);
    setWifiResponse(null);

    try {
      const res = await fetch('/api/router/change-wifi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gatewayIp,
          ssid: wifiSsid,
          newPassword: wifiPass,
          routerUser,
          routerPass: routerAdminPass,
          routerModel
        })
      });

      const data = await res.json();
      setWifiResponse(data);
    } catch (err) {
      setWifiResponse({
        success: false,
        message: 'Terjadi kesalahan koneksi ke backend router API.'
      });
    } finally {
      setSavingWifi(false);
    }
  };

  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'router':
        return <Router className="w-5 h-5 text-cyan-400" />;
      case 'self':
        return <Laptop className="w-5 h-5 text-emerald-400" />;
      case 'laptop':
      case 'computer':
        return <Laptop className="w-5 h-5 text-blue-400" />;
      case 'phone':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-amber-400" />;
      default:
        return <Wifi className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="bg-glow-orb bg-cyan-500/20 top-[-50px] left-[-50px] w-64 h-64"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL-TIME SCANNER
                </span>
                <span className="text-xs text-slate-400 font-mono">Gateway: {gatewayIp}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mt-1">
                Kelola Router & Perangkat Wi-Fi
              </h2>
              <p className="text-xs text-slate-400">
                Pindai perangkat terhubung secara real & ubah kredensial Wi-Fi router IndiHome / Lokal Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={fetchConnectedDevices}
              disabled={loadingDevices}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${loadingDevices ? 'animate-spin' : ''}`} />
              <span>{loadingDevices ? 'Memindai...' : 'Refresh Devices'}</span>
            </button>
            <a
              href={`http://${gatewayIp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-cyber text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:scale-105 flex items-center space-x-2"
            >
              <span>Portal Router</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'devices'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Perangkat Terhubung ({deviceStats.total})</span>
          </button>

          <button
            onClick={() => setActiveTab('wifi')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'wifi'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Ubah Sandi Wi-Fi Real</span>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'portal'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Kredensial Gateway Router</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CONNECTED DEVICES REAL SCANNER */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Perangkat Terhubung</p>
                <p className="text-xl font-black text-white">{deviceStats.total} Device</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Router className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">IP Gateway Modem</p>
                <p className="text-sm font-mono font-bold text-white">{deviceStats.gateway}</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">IP Perangkat Anda</p>
                <p className="text-sm font-mono font-bold text-white">{deviceStats.localIp}</p>
              </div>
            </div>
          </div>

          {/* Devices Table Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Daftar Perangkat Aktif di Wi-Fi (ARP Table)
                </h3>
                <p className="text-xs text-slate-400">
                  Data dipindai langsung dari tabel jaringan lokal secara real-time
                </p>
              </div>

              {/* Search filter input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari IP, MAC, Nama..."
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {loadingDevices ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs font-semibold text-slate-400">Memindai tabel ARP & perangkat aktif di subnet...</p>
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold">Tidak ada perangkat ditemukan dengan filter tersebut.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3 px-3">Perangkat</th>
                      <th className="pb-3 px-3">Alamat IP</th>
                      <th className="pb-3 px-3">Alamat MAC</th>
                      <th className="pb-3 px-3">Sinyal / Latensi</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredDevices.map((dev) => (
                      <tr key={dev.id} className="hover:bg-slate-900/40 transition-all">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center space-x-3 font-sans">
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                              {renderCategoryIcon(dev.category)}
                            </div>
                            <div>
                              <p className="font-bold text-white flex items-center space-x-1.5">
                                <span>{dev.name}</span>
                                {dev.isGateway && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                                    ROUTER
                                  </span>
                                )}
                                {dev.isSelf && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                    YOU
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">{dev.lastSeen}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-bold text-slate-200">{dev.ip}</td>

                        <td className="py-3.5 px-3 text-slate-400 uppercase">{dev.mac}</td>

                        <td className="py-3.5 px-3 text-slate-300">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-cyan-500 h-full rounded-full"
                                style={{ width: dev.signalStrength }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-sans font-semibold text-slate-400">
                              {dev.signalStrength}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-sans">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>ONLINE</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CHANGE WI-FI PASSWORD FORM */}
      {activeTab === 'wifi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card */}
          <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-slate-800">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Form Ubah Sandi & Nama Wi-Fi Real</h3>
                <p className="text-xs text-slate-400">Konfigurasi langsung modem/router IndiHome Anda</p>
              </div>
            </div>

            <form onSubmit={handleSaveWifi} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Tipe / Model Router
                  </label>
                  <select
                    value={routerModel}
                    onChange={(e) => setRouterModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ZTE F609 / F670 (IndiHome)">ZTE F609 / F670 (IndiHome Telkom)</option>
                    <option value="Huawei HG8245H">Huawei HG8245H (IndiHome Telkom)</option>
                    <option value="FiberHome HG6243C">FiberHome HG6243C (IndiHome Telkom)</option>
                    <option value="TP-Link Router">TP-Link / Tenda / Mercusys Router</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    IP Gateway Modem Router
                  </label>
                  <input
                    type="text"
                    value={gatewayIp}
                    onChange={(e) => setGatewayIp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="192.168.1.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Nama Wi-Fi Baru (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Masukkan Nama Wi-Fi..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Sandi Wi-Fi Baru (WPA2-PSK Key)
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white pr-10 focus:outline-none focus:border-cyan-500"
                    placeholder="Minimal 8 Karakter (cth: SandiKu123#)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tips: Kombinasikan huruf besar, kecil, angka, dan simbol untuk perlindungan ekstra.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Username Admin Router
                  </label>
                  <input
                    type="text"
                    value={routerUser}
                    onChange={(e) => setRouterUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="user / admin / telecomadmin"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Password Admin Router
                  </label>
                  <input
                    type="password"
                    value={routerAdminPass}
                    onChange={(e) => setRouterAdminPass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="user / Telkomdso123"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingWifi}
                className="w-full py-3 bg-gradient-cyber text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
              >
                {savingWifi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menerapkan Pengaturan Wi-Fi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Simpan & Terapkan Sandi Wi-Fi Baru</span>
                  </>
                )}
              </button>
            </form>

            {/* Live Response Alert */}
            {wifiResponse && (
              <div className={`mt-6 p-4 rounded-2xl border text-xs font-sans ${
                wifiResponse.success 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}>
                <div className="flex items-center space-x-2 font-bold mb-2">
                  {wifiResponse.success ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                  <span>{wifiResponse.message}</span>
                </div>

                {wifiResponse.instructions && (
                  <ul className="space-y-1 text-slate-300 mt-2 list-disc list-inside">
                    {wifiResponse.instructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Guidance Sidebar */}
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Panduan Akses Router IndiHome</span>
              </h4>

              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  Jika Anda menggunakan router standar Telkom IndiHome, Anda juga dapat membuka portal admin langsung melalui link di bawah:
                </p>

                <a
                  href={`http://${gatewayIp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-cyan-400 font-mono font-bold text-center transition-all"
                >
                  http://{gatewayIp} &rarr;
                </a>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <p className="font-bold text-white">Default Kredensial IndiHome:</p>
                  <p>&bull; ZTE F609: <span className="text-cyan-300">user / user</span></p>
                  <p>&bull; ZTE Superuser: <span className="text-cyan-300">admin / Telkomdso123</span></p>
                  <p>&bull; Huawei: <span className="text-cyan-300">telecomadmin / admintelecom</span></p>
                  <p>&bull; FiberHome: <span className="text-cyan-300">user / user</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GATEWAY & ADMIN PORTAL INFO */}
      {activeTab === 'portal' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Kredensial Default & Status Modem Router</h3>
              <p className="text-xs text-slate-400">Informasi autentikasi modem ONT IndiHome & Router Jaringan</p>
            </div>
          </div>

          {gatewayInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Status Jangkauan Router</p>
                  <p className="text-sm font-bold text-white flex items-center space-x-2 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${gatewayInfo.isReachable ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span>{gatewayInfo.isReachable ? 'Terhubung (Reachable)' : 'Lokal Gateway Aktif'}</span>
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{gatewayInfo.responseTimeMs}ms</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Alamat IP Gateway Target</p>
                  <p className="text-sm font-mono font-bold text-white mt-0.5">{gatewayInfo.gatewayIp}</p>
                </div>
                <a
                  href={`http://${gatewayInfo.gatewayIp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 text-xs font-bold rounded-lg transition-all"
                >
                  Buka Portal
                </a>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Tipe / Model Router</th>
                  <th className="pb-3 px-3">Default IP</th>
                  <th className="pb-3 px-3">Default Username</th>
                  <th className="pb-3 px-3">Default Password</th>
                  <th className="pb-3 px-3">Aksi Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {(gatewayInfo?.defaultAdminLogins || [
                  { model: 'ZTE F609 / F670 (IndiHome)', defaultIp: gatewayIp, user: 'user', pass: 'user' },
                  { model: 'ZTE F609 Superuser', defaultIp: gatewayIp, user: 'admin', pass: 'Telkomdso123' },
                  { model: 'Huawei HG8245H', defaultIp: gatewayIp, user: 'telecomadmin', pass: 'admintelecom' },
                  { model: 'FiberHome HG6243C', defaultIp: gatewayIp, user: 'user', pass: 'user' },
                  { model: 'TP-Link / Generic', defaultIp: gatewayIp, user: 'admin', pass: 'admin' }
                ]).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-all font-sans">
                    <td className="py-3 px-3 font-bold text-white">{item.model}</td>
                    <td className="py-3 px-3 font-mono text-cyan-400">{item.defaultIp}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{item.user}</td>
                    <td className="py-3 px-3 font-mono text-amber-400">{item.pass}</td>
                    <td className="py-3 px-3">
                      <a
                        href={`http://${item.defaultIp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1 font-mono"
                      >
                        <span>Akses</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
