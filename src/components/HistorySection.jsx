import React, { useState } from 'react';
import { History, Download, Trash2, Wifi, ArrowDown, ArrowUp, Search, TrendingUp, BarChart3, Calendar } from 'lucide-react';
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
import { useLanguage } from '../context/LanguageContext';

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

export default function HistorySection({ history = [], onDeleteItem }) {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('');

  const filteredHistory = history.filter(item =>
    (item.isp && item.isp.toLowerCase().includes(filter.toLowerCase())) ||
    (item.ip && item.ip.includes(filter))
  );

  // Compute daily, weekly, and monthly averages
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const getAvgSpeed = (items) => {
    if (!items.length) return { dl: '0.0', ul: '0.0', ping: '0', loss: '0.00' };
    const dlAvg = (items.reduce((a, b) => a + (parseFloat(b.download) || 0), 0) / items.length).toFixed(1);
    const ulAvg = (items.reduce((a, b) => a + (parseFloat(b.upload) || 0), 0) / items.length).toFixed(1);
    const pingAvg = Math.round(items.reduce((a, b) => a + (parseFloat(b.ping) || 0), 0) / items.length);
    const lossAvg = (items.reduce((a, b) => a + (parseFloat(b.packetLoss) || 0), 0) / items.length).toFixed(2);
    return { dl: dlAvg, ul: ulAvg, ping: pingAvg, loss: lossAvg };
  };

  const dailyItems = history.filter(h => new Date(h.timestamp) >= oneDayAgo);
  const weeklyItems = history.filter(h => new Date(h.timestamp) >= oneWeekAgo);
  const monthlyItems = history.filter(h => new Date(h.timestamp) >= oneMonthAgo);

  const dailyStats = getAvgSpeed(dailyItems);
  const weeklyStats = getAvgSpeed(weeklyItems);
  const monthlyStats = getAvgSpeed(monthlyItems);

  // Prepare Performance Trend Chart Data
  const recentHistory = [...history].slice(0, 10).reverse();
  const chartLabels = recentHistory.map(h => new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  const trendChartData = {
    labels: chartLabels.length ? chartLabels : ['No Data'],
    datasets: [
      {
        label: t('chartDownload'),
        data: recentHistory.map(h => h.download),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        fill: true,
        tension: 0.4
      },
      {
        label: t('chartUpload'),
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
      legend: { labels: { color: '#64748b', font: { size: 11, weight: 'bold' } } },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#38bdf8' }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } }
    }
  };

  const exportCSV = () => {
    if (!history.length) return;

    const headers = ['Timestamp', 'Download (Mbps)', 'Upload (Mbps)', 'Ping (ms)', 'Jitter (ms)', 'PacketLoss (%)', 'ISP', 'IP'];
    const rows = history.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.download,
      item.upload,
      item.ping,
      item.jitter,
      (parseFloat(item.packetLoss) || 0).toFixed(2),
      `"${item.isp || ''}"`,
      item.ip || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `pingsatset_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!history.length) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const locale = lang === 'en' ? 'en-US' : 'id-ID';

    const rowsHtml = history.map(item => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${new Date(item.timestamp).toLocaleString(locale)}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#0284c7;">${item.download} Mbps</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:#9333ea;">${item.upload} Mbps</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#d97706;">${item.ping} ms</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#059669;">${item.jitter} ms</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold;color:${parseFloat(item.packetLoss) > 2 ? '#dc2626' : '#16a34a'};">
          ${item.packetLossStatus === 'UNMEASURABLE' ? 'N/A' : `${(parseFloat(item.packetLoss) || 0).toFixed(2)}%`}
        </td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${item.isp || '-'}</td>
        <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-family:monospace;">${item.ip || '-'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PingSatSet - ${lang === 'en' ? 'Network Audit Report' : 'Laporan Audit Performa Jaringan'}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: 800; color: #0f172a; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #f1f5f9; text-align: left; padding: 10px 8px; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">PINGSATSET</div>
              <div class="subtitle">${lang === 'en' ? 'Official Network Performance Diagnostics Report' : 'Laporan Resmi Hasil Diagnostik Kecepatan & Stabilitas Jaringan'}</div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #64748b;">
              <div>${lang === 'en' ? 'Date:' : 'Tanggal Laporan:'} ${new Date().toLocaleDateString(locale)}</div>
              <div>${lang === 'en' ? 'Total tests:' : 'Total pengujian:'} ${history.length}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>${t('thTime')}</th>
                <th>${t('thDownload')}</th>
                <th>${t('thUpload')}</th>
                <th>${t('thPing')}</th>
                <th>${t('thJitter')}</th>
                <th>${t('thPacketLoss')}</th>
                <th>${t('thIsp')}</th>
                <th>${t('thIp')}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">
            Generated automatically by PingSatSet Web Application • ${new Date().toISOString()}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 my-4 sm:my-8">
      {/* 3 Summary Dashboard Cards (Daily, Weekly, Monthly) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-200">{t('statDailyAvg')}</span>
            <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400 stroke-[2.5]" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('dlAvgLabel')}</span>
              <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{dailyStats.dl} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('ulAvgLabel')}</span>
              <span className="text-base font-black text-purple-600 dark:text-purple-400">{dailyStats.ul} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('lossAvgLabel')}</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{dailyStats.loss}%</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-200">{t('statWeeklyAvg')}</span>
            <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 stroke-[2.5]" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('dlAvgLabel')}</span>
              <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{weeklyStats.dl} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('ulAvgLabel')}</span>
              <span className="text-base font-black text-purple-600 dark:text-purple-400">{weeklyStats.ul} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('lossAvgLabel')}</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{weeklyStats.loss}%</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-black text-slate-700 dark:text-slate-200">{t('statMonthlyAvg')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('dlAvgLabel')}</span>
              <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{monthlyStats.dl} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('ulAvgLabel')}</span>
              <span className="text-base font-black text-purple-600 dark:text-purple-400">{monthlyStats.ul} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-700 dark:text-slate-300 uppercase font-black block">{t('lossAvgLabel')}</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{monthlyStats.loss}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Performance Chart Card */}
      {history.length > 0 && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0 shadow-sm">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">{t('trendChartTitle')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{t('trendChartSubtitle')}</p>
            </div>
          </div>

          <div className="h-52 sm:h-64 w-full">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* History Table Container */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/60 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700/80 shrink-0 shadow-sm">
              <History className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{t('historyTitle')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">{t('historySubtitle')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={exportCSV}
              disabled={!history.length}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('btnExportCsv')}</span>
            </button>

            <button
              onClick={exportPDF}
              disabled={!history.length}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-black text-slate-950 flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{t('btnPrintPdf')}</span>
            </button>
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
            <Wifi className="w-10 h-10 mx-auto mb-2 opacity-50 text-cyan-500" />
            <p className="text-sm font-black text-slate-700 dark:text-slate-300">{t('noHistoryText')}</p>
            <p className="text-xs text-slate-500 font-bold">{t('noHistorySub')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0 scrollbar-thin">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 uppercase tracking-wider font-black">
                  <th className="py-3 px-4">{t('thTime')}</th>
                  <th className="py-3 px-4">{t('thDownload')}</th>
                  <th className="py-3 px-4">{t('thUpload')}</th>
                  <th className="py-3 px-4">{t('thPing')}</th>
                  <th className="py-3 px-4">{t('thJitter')}</th>
                  <th className="py-3 px-4">{t('thPacketLoss')}</th>
                  <th className="py-3 px-4">{t('thIsp')}</th>
                  <th className="py-3 px-4 text-right">{t('thAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 dark:divide-slate-800/80 font-mono">
                {filteredHistory.map((item) => {
                  const loss = parseFloat(item.packetLoss) || 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 text-slate-950 dark:text-slate-100 font-sans font-black whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 font-black text-cyan-600 dark:text-cyan-400">
                        <span className="flex items-center space-x-1">
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span>{item.download} Mbps</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-purple-600 dark:text-purple-400">
                        <span className="flex items-center space-x-1">
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>{item.upload} Mbps</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-black">
                        {item.ping} ms
                      </td>
                      <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-black">
                        {item.jitter} ms
                      </td>
                      <td className="py-3.5 px-4 text-blue-600 dark:text-blue-400 font-black">
                        {item.packetLossStatus === 'UNMEASURABLE' ? 'N/A' : `${loss.toFixed(2)}%`}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-950 dark:text-white font-black">
                        <div>{item.isp}</div>
                        <div className="text-[10px] text-slate-700 dark:text-slate-300 font-mono font-bold">{item.ip}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Hapus riwayat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
