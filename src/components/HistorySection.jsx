import React, { useState } from 'react';
import { History, Download, Trash2, Calendar, Wifi, ArrowDown, ArrowUp, Activity, Search, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HistorySection({ history = [], onDeleteItem, onClearAll }) {
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(item =>
    (item.isp && item.isp.toLowerCase().includes(filter.toLowerCase())) ||
    (item.ip && item.ip.includes(filter))
  );

  // Prepare Performance Trend Chart Data
  const recentHistory = [...history].slice(0, 10).reverse();
  const chartLabels = recentHistory.map(h => new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
  const trendChartData = {
    labels: chartLabels.length ? chartLabels : ['No Data'],
    datasets: [
      {
        label: 'Download (Mbps)',
        data: recentHistory.map(h => h.download),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Upload (Mbps)',
        data: recentHistory.map(h => h.upload),
        borderColor: '#c084fc',
        backgroundColor: 'rgba(192, 132, 252, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' } } },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#38bdf8' }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const exportCSV = () => {
    if (!history.length) return;

    const headers = ['Timestamp', 'Download (Mbps)', 'Upload (Mbps)', 'Ping (ms)', 'Jitter (ms)', 'ISP', 'IP'];
    const rows = history.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.download,
      item.upload,
      item.ping,
      item.jitter,
      `"${item.isp || ''}"`,
      item.ip || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `speedtest_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 my-8">
      {/* Trend Performance Chart Card */}
      {history.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Grafik Tren Performa Kecepatan</h3>
              <p className="text-xs text-slate-400">Pantau fluktuasi kecepatan download & upload dari waktu ke waktu</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* History Table Container */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Speed Test History</h3>
              <p className="text-xs text-slate-400">Riwayat pengujian kecepatan & stabilitas koneksi Wi-Fi Anda</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Cari ISP / IP..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={exportCSV}
              disabled={!history.length}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>EXPORT CSV</span>
            </button>
          </div>
        </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
          <Wifi className="w-10 h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
          <p className="text-sm font-medium">Belum ada riwayat speed test.</p>
          <p className="text-xs text-slate-600">Jalankan speed test untuk melihat hasil di sini.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Download</th>
                <th className="py-3 px-4">Upload</th>
                <th className="py-3 px-4">Ping</th>
                <th className="py-3 px-4">Jitter</th>
                <th className="py-3 px-4">ISP / IP</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 text-slate-300 font-sans whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-400">
                    <span className="flex items-center space-x-1">
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>{item.download} Mbps</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-400">
                    <span className="flex items-center space-x-1">
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>{item.upload} Mbps</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-amber-400">
                    {item.ping} ms
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400">
                    {item.jitter} ms
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    <div>{item.isp}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.ip}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-colors"
                      title="Hapus riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
