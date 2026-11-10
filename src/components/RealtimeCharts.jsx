import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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

export default function RealtimeCharts({ downloadHistory = [], uploadHistory = [], pingHistory = [], theme = 'dark' }) {
  const { t } = useLanguage();
  const isLight = theme === 'light';
  const maxLen = Math.max(downloadHistory.length, uploadHistory.length);
  const labels = Array.from({ length: maxLen }, (_, i) => `${(i * 0.1).toFixed(1)}s`);

  // Chart 1: Download & Upload Speed Curve
  const speedChartData = {
    labels: labels.length ? labels : ['0.0s', '0.1s', '0.2s', '0.3s', '0.4s'],
    datasets: [
      {
        label: t('chartDownload'),
        data: downloadHistory,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: t('chartUpload'),
        data: uploadHistory,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isLight ? '#020617' : '#ffffff',
          font: { family: 'Outfit', size: 12, weight: 'bold' },
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isLight ? '#ffffff' : '#0f172a',
        borderColor: isLight ? '#cbd5e1' : '#334155',
        borderWidth: 1.5,
        titleColor: isLight ? '#020617' : '#f8fafc',
        bodyColor: isLight ? '#1e293b' : '#cbd5e1',
      },
    },
    scales: {
      x: {
        grid: { color: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)' },
        ticks: { color: isLight ? '#020617' : '#f1f5f9', maxTicksLimit: 8, font: { weight: 'bold', size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)' },
        ticks: { color: isLight ? '#020617' : '#f1f5f9', font: { weight: 'bold', size: 11 } },
      },
    },
  };

  // Chart 2: Ping / Latency
  const pingChartData = {
    labels: pingHistory.length ? pingHistory.map((_, index) => `#${index + 1}`) : ['#1', '#2', '#3', '#4', '#5'],
    datasets: [
      {
        label: t('chartPing'),
        data: pingHistory,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2.5,
        tension: 0.3,
        fill: true,
        pointRadius: 3.5,
        pointBackgroundColor: '#f59e0b',
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-1 gap-3.5 sm:gap-4 w-full lg:flex-1">
      {/* Throughput Curve Chart */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm min-w-0 min-h-0 overflow-hidden flex flex-col">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white mb-2 sm:mb-3 flex items-center space-x-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shrink-0" />
          <span className="truncate">{t('throughputChartTitle')}</span>
        </h3>
        <div className="relative w-full h-36 sm:h-44 lg:h-auto lg:flex-1 lg:min-h-[185px]">
          <div className="absolute inset-0">
            <Line data={speedChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Latency Stability Chart */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm min-w-0 min-h-0 overflow-hidden flex flex-col">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white mb-2 sm:mb-3 flex items-center space-x-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="truncate">{t('latencyChartTitle')}</span>
        </h3>
        <div className="relative w-full h-36 sm:h-44 lg:h-auto lg:flex-1 lg:min-h-[185px]">
          <div className="absolute inset-0">
            <Line data={pingChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
