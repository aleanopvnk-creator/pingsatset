import React from 'react';
import { Play, RotateCcw, Zap, Wifi } from 'lucide-react';

export default function SpeedometerGauge({
  isRunning,
  stage,
  currentSpeed,
  unit = 'Mbps',
  onStartTest
}) {
  // Gauge configuration
  const maxSpeed = 100; // max gauge scale
  const normalizedSpeed = Math.min(maxSpeed, Math.max(0, currentSpeed));
  
  // Angle range: 225deg (start) to 495deg (end) => 270deg total arc
  const startAngle = 135;
  const endAngle = 405;
  const angleRange = endAngle - startAngle;
  
  const currentAngle = startAngle + (normalizedSpeed / maxSpeed) * angleRange;
  
  // Calculate SVG arc length
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (angleRange / 360) * circumference;
  const strokeDashoffset = arcLength - ((normalizedSpeed / maxSpeed) * arcLength);

  // Stage badge color
  const getStageBadge = () => {
    switch (stage) {
      case 'ping':
        return { label: 'MEASURING PING', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'download':
        return { label: 'TESTING DOWNLOAD', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'upload':
        return { label: 'TESTING UPLOAD', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'complete':
        return { label: 'TEST COMPLETE', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: 'READY TO TEST', color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const badge = getStageBadge();

  return (
    <div className="flex flex-col items-center justify-center relative py-6">
      {/* Background Glowing Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute w-60 h-60 rounded-full bg-purple-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Speedometer SVG Canvas Container */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        <svg className="w-full h-full transform rotate-0" viewBox="0 0 360 360">
          <defs>
            {/* Active Gauge Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Glowing Shadow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Ring Ticks */}
          {Array.from({ length: 21 }).map((_, i) => {
            const tickAngle = (startAngle + (i / 20) * angleRange) * (Math.PI / 180);
            const x1 = 180 + 160 * Math.cos(tickAngle);
            const y1 = 180 + 160 * Math.sin(tickAngle);
            const x2 = 180 + (i % 5 === 0 ? 148 : 153) * Math.cos(tickAngle);
            const y2 = 180 + (i % 5 === 0 ? 148 : 153) * Math.sin(tickAngle);
            const isMajor = i % 5 === 0;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? '#475569' : '#334155'}
                strokeWidth={isMajor ? '3' : '1.5'}
                strokeLinecap="round"
              />
            );
          })}

          {/* Background Track Arc */}
          <path
            d="M 81 279 A 140 140 0 1 1 279 279"
            fill="none"
            stroke="#1e293b"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d="M 81 279 A 140 140 0 1 1 279 279"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow)"
            className="transition-all duration-200 ease-out"
          />

          {/* Glowing Needle Indicator */}
          <g
            className="transition-transform duration-200 ease-out origin-center"
            style={{
              transform: `rotate(${currentAngle - 270}deg)`,
              transformOrigin: '180px 180px'
            }}
          >
            <line
              x1="180"
              y1="180"
              x2="180"
              y2="55"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            <circle cx="180" cy="180" r="10" fill="#06b6d4" filter="url(#glow)" />
            <circle cx="180" cy="180" r="4" fill="#ffffff" />
          </g>
        </svg>

        {/* Center Digital Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 text-center">
          {/* Stage Status Badge */}
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border mb-2 ${badge.color} transition-all duration-300`}>
            {badge.label}
          </div>

          {/* Main Digital Speed Value */}
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-white font-mono drop-shadow-md">
              {currentSpeed > 0 ? currentSpeed.toFixed(1) : '0.0'}
            </span>
          </div>
          <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase mt-1">
            {unit}
          </span>
        </div>
      </div>

      {/* Start / Restart Action Button */}
      <div className="mt-6">
        <button
          onClick={onStartTest}
          disabled={isRunning}
          className={`relative group overflow-hidden px-10 py-4 rounded-full font-bold text-lg tracking-wider uppercase transition-all duration-300 flex items-center space-x-3 shadow-xl ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-cyber text-white shadow-glow-cyan hover:scale-105 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <Zap className="w-5 h-5 animate-spin text-cyan-400" />
              <span>TESTING CONNECTION...</span>
            </>
          ) : stage === 'complete' ? (
            <>
              <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>TEST AGAIN</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>START SPEED TEST</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
