import React from 'react';
import { Wifi, Gauge, Activity, History, Wrench } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="w-full glass-panel sticky top-0 z-40 border-b border-slate-800/80 px-4 py-3 mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('speedtest')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-cyber p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Wifi className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-extrabold text-white tracking-tight flex items-center space-x-1.5">
              <span>SPEEDTEST</span>
              <span className="text-gradient-cyan">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Wi-Fi & Network Analyzer</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 md:space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('speedtest')}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'speedtest'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span className="hidden sm:inline">SPEED TEST</span>
          </button>

          <button
            onClick={() => setActiveTab('stability')}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'stability'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">STABILITY & STRESS</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">HISTORY</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'tools'
                ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">TOOLS</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
