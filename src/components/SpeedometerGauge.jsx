import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SpeedometerGauge({
  isRunning,
  stage,
  currentSpeed,
  unit = 'Mbps',
  onStartTest,
  theme = 'dark'
}) {
  const { t } = useLanguage();
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const animFrameRef = useRef();
  const isLight = theme === 'light';

  // Smooth lerp animation for speed gauge needle and text
  useEffect(() => {
    let current = animatedSpeed;
    const target = currentSpeed;

    const animate = () => {
      const diff = target - current;
      if (Math.abs(diff) > 0.05) {
        current += diff * 0.25;
        setAnimatedSpeed(current);
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedSpeed(target);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentSpeed]);

  // Gauge configuration
  const maxSpeed = 100;
  const normalizedSpeed = Math.min(maxSpeed, Math.max(0, animatedSpeed));

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

  // Stage badge color & label
  const getStageBadge = () => {
    switch (stage) {
      case 'ping':
        return { label: t('testingPing'), color: isLight ? 'bg-amber-100 text-amber-950 border-amber-400 font-black' : 'bg-amber-500/25 text-amber-300 border-amber-400 font-black' };
      case 'download':
        return { label: t('testingDownload'), color: isLight ? 'bg-cyan-100 text-cyan-950 border-cyan-400 font-black' : 'bg-cyan-500/25 text-cyan-300 border-cyan-400 font-black' };
      case 'upload':
        return { label: t('testingUpload'), color: isLight ? 'bg-purple-100 text-purple-950 border-purple-400 font-black' : 'bg-purple-500/25 text-purple-300 border-purple-400 font-black' };
      case 'complete':
        return { label: t('testComplete'), color: isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black' : 'bg-emerald-500/25 text-emerald-300 border-emerald-400 font-black' };
      default:
        return { label: t('readyWifiTest'), color: isLight ? 'bg-slate-200 text-slate-950 border-slate-400 font-black' : 'bg-slate-800 text-slate-100 border-slate-600 font-black' };
    }
  };

  const badge = getStageBadge();

  return (
    <div className="flex flex-col items-center justify-center relative py-2 sm:py-3 lg:py-2">
      {/* Background Glowing Orbs */}
      <div className={`absolute w-64 sm:w-72 h-64 sm:h-72 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow ${
        isLight ? 'bg-cyan-400/15' : 'bg-cyan-500/15'
      }`} />
      <div className={`absolute w-56 sm:w-64 h-56 sm:h-64 rounded-full blur-3xl pointer-events-none -z-10 ${
        isLight ? 'bg-emerald-400/10' : 'bg-emerald-500/10'
      }`} />

      {/* Speedometer SVG Canvas Container (Fluid responsive across all screens) */}
      <div className="relative w-full max-w-[260px] xs:max-w-[285px] sm:max-w-[310px] lg:max-w-[300px] xl:max-w-[325px] aspect-square flex items-center justify-center mx-auto">
        {/* Dynamic Running Ripple Halo */}
        {isRunning && (
          <div className="absolute inset-2 rounded-full border-2 border-cyan-400/40 animate-ping pointer-events-none opacity-40" />
        )}

        <svg className="w-full h-full transform rotate-0" viewBox="0 0 360 360">
          <defs>
            {/* PingSatSet Signature Gradient */}
            <linearGradient id="satsetGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Outer Ring Ticks & Number Labels */}
          {Array.from({ length: 21 }).map((_, i) => {
            const tickAngle = (startAngle + (i / 20) * angleRange) * (Math.PI / 180);
            const isMajor = i % 5 === 0;
            const x1 = 180 + 160 * Math.cos(tickAngle);
            const y1 = 180 + 160 * Math.sin(tickAngle);
            const x2 = 180 + (isMajor ? 146 : 153) * Math.cos(tickAngle);
            const y2 = 180 + (isMajor ? 146 : 153) * Math.sin(tickAngle);

            // Major tick numeric labels (0, 25, 50, 75, 100)
            const labelX = 180 + 130 * Math.cos(tickAngle);
            const labelY = 180 + 130 * Math.sin(tickAngle);
            const tickValue = i * 5;

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? (isLight ? '#0284c7' : '#22d3ee') : (isLight ? '#94a3b8' : '#475569')}
                  strokeWidth={isMajor ? '3.5' : '2'}
                  strokeLinecap="round"
                  opacity={isMajor ? 1.0 : 0.85}
                />
                {isMajor && (
                  <text
                    x={labelX}
                    y={labelY}
                    fill={isLight ? '#020617' : '#ffffff'}
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {tickValue}
                  </text>
                )}
              </g>
            );
          })}

          {/* Background Track Arc */}
          <path
            d="M 81 279 A 140 140 0 1 1 279 279"
            fill="none"
            stroke={isLight ? '#cbd5e1' : '#1e293b'}
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Secondary Subtle Track Outline */}
          <path
            d="M 81 279 A 140 140 0 1 1 279 279"
            fill="none"
            stroke={isLight ? '#cbd5e1' : '#1e293b'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Active Progress Arc with Glow */}
          <path
            d="M 81 279 A 140 140 0 1 1 279 279"
            fill="none"
            stroke="url(#satsetGaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#satsetGlow)"
            className="transition-all duration-200 ease-out"
          />

          {/* Glowing Needle Indicator */}
          <g
            className="transition-transform duration-200 ease-out origin-center"
            style={{
              transform: `rotate(${currentAngle - 180}deg)`,
              transformOrigin: '180px 180px'
            }}
          >
            <line
              x1="180"
              y1="180"
              x2="180"
              y2="52"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Center Dial Hub */}
            <circle cx="180" cy="180" r="12" fill={isLight ? '#0f172a' : '#020617'} stroke="#06b6d4" strokeWidth="2.5" />
            <circle cx="180" cy="180" r="5" fill="#38bdf8" />
            <circle cx="180" cy="180" r="2" fill="#ffffff" />
          </g>
        </svg>

        {/* Center Digital Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-7 sm:pt-8 text-center select-none">
          {/* Stage Status Badge */}
          <div className={`px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-black tracking-widest uppercase border mb-1.5 sm:mb-2 ${badge.color} transition-all duration-300 shadow-sm flex items-center space-x-1 sm:space-x-1.5`}>
            {isRunning && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 mr-1" />}
            <span className="truncate max-w-[190px] sm:max-w-none">{badge.label}</span>
          </div>

          {/* Main Digital Speed Value */}
          <div className="flex items-baseline justify-center space-x-1">
            <span className={`text-4xl xs:text-5xl sm:text-5xl xl:text-6xl font-black tracking-tight font-mono ${
              isLight ? 'text-slate-950 font-black' : 'text-white font-black'
            }`}>
              {currentSpeed > 0 ? currentSpeed.toFixed(1) : '0.0'}
            </span>
          </div>
          
          {/* Unit + PingSatSet Sub-brand */}
          <div className="flex items-center space-x-1.5 mt-0.5 sm:mt-1">
            <span className={`text-[11px] sm:text-xs font-black tracking-widest uppercase ${
              isLight ? 'text-cyan-800 font-black' : 'text-cyan-400 font-black'
            }`}>
              {unit}
            </span>
            <span className={`text-[10px] font-black tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>•</span>
            <span className={`text-[9px] sm:text-[10px] font-black tracking-wider uppercase ${
              isLight ? 'text-slate-900 font-black' : 'text-slate-200 font-black'
            }`}>
              {t('satsetMode')}
            </span>
          </div>
        </div>
      </div>

      {/* Start / Restart Action Button (Clean Pill Button, No Glowing Light) */}
      <div className="mt-3 sm:mt-4 w-full flex justify-center">
        <button
          onClick={onStartTest}
          disabled={isRunning}
          className={`relative group overflow-hidden w-full max-w-xs sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2.5 sm:space-x-3 shadow-md cursor-pointer ${
            isRunning
              ? isLight
                ? 'bg-slate-200 text-slate-900 border border-slate-300 cursor-not-allowed shadow-none'
                : 'bg-slate-800 text-slate-200 border border-slate-700 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-black hover:scale-105 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <Activity className={`w-4 h-4 sm:w-5 sm:h-5 animate-pulse ${isLight ? 'text-cyan-700 stroke-[2.5]' : 'text-cyan-400'}`} />
              <span className={`font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>{t('testingWifi')}</span>
            </>
          ) : stage === 'complete' ? (
            <>
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500 text-slate-950 stroke-[2.5]" />
              <span className="font-black text-slate-950">{t('testAgain')}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-slate-950 stroke-[2.5]" />
              <span className="font-black text-slate-950">{t('startTest')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
