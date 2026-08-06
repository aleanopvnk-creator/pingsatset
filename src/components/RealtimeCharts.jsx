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

export default function RealtimeCharts({ downloadHistory = [], uploadHistory = [], pingHistory = [] }) {
  // Chart 1: Download & Upload Speed Curve
  const speedChartData = {
    labels: downloadHistory.map((_, index) => `${index * 0.1}s`),
    datasets: [
      {
        label: 'Download (Mbps)',
        data: downloadHistory,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Upload (Mbps)',
        data: uploadHistory,
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderWidth: 2,
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
          color: '#94a3b8',
          font: { family: 'Outfit', size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', maxTicksLimit: 8 },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b' },
      },
    },
  };

  // Chart 2: Ping / Latency
  const pingChartData = {
    labels: pingHistory.map((_, index) => `#${index + 1}`),
    datasets: [
      {
        label: 'Ping Latency (ms)',
        data: pingHistory,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#f59e0b',
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
      {/* Throughput Curve Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Real-time Throughput (Mbps)</span>
        </h3>
        <div className="h-56">
          <Line data={speedChartData} options={chartOptions} />
        </div>
      </div>

      {/* Latency Stability Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Latency Stability Curve (ms)</span>
        </h3>
        <div className="h-56">
          <Line data={pingChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
