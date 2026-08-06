import React from 'react';
import { Gamepad2, Video, Tv, Globe, Star } from 'lucide-react';

export default function ActivityRatings({ download = 0, upload = 0, ping = 0, jitter = 0 }) {
  if (download === 0 && upload === 0 && ping === 0) {
    return null;
  }

  // Activity 1: Gaming Online (Dependent on Ping & Jitter)
  const getGamingRating = () => {
    if (ping > 0 && ping <= 20 && jitter <= 5) return { stars: 5, label: 'Sempurna (Bebas Lag)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (ping <= 50 && jitter <= 15) return { stars: 4, label: 'Bagus (Lancar Main)', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    if (ping <= 90) return { stars: 3, label: 'Cukup (Kadang Lag)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { stars: 1, label: 'Buruk (High Ping / Lag)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  // Activity 2: Video Call / Zoom (Dependent on Upload & Jitter)
  const getVideoCallRating = () => {
    if (upload >= 15 && jitter <= 8) return { stars: 5, label: 'HD Jernih (Tanpa Patah)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (upload >= 5 && jitter <= 20) return { stars: 4, label: 'Lancar & Stabil', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    if (upload >= 2) return { stars: 3, label: 'Standar (Kualitas SD)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { stars: 1, label: 'Patah-patah / Terputus', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  // Activity 3: 4K Streaming (Dependent on Download)
  const getStreamingRating = () => {
    if (download >= 40) return { stars: 5, label: '4K Ultra HD Seamless', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (download >= 15) return { stars: 4, label: 'Full HD 1080p Cepat', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    if (download >= 5) return { stars: 3, label: 'HD 720p Standar', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { stars: 1, label: 'Buffering Lama', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
  };

  // Activity 4: Web Browsing (Dependent on Ping & Download)
  const getBrowsingRating = () => {
    if (download >= 10 && ping <= 40) return { stars: 5, label: 'Super Cepat (Instan)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (download >= 3) return { stars: 4, label: 'Lancar Buka Web', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
    return { stars: 2, label: 'Lambat Memuat Halaman', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
  };

  const activities = [
    { name: 'Gaming Online', icon: Gamepad2, rating: getGamingRating() },
    { name: 'Video Call / Zoom', icon: Video, rating: getVideoCallRating() },
    { name: 'Streaming 4K / Movies', icon: Tv, rating: getStreamingRating() },
    { name: 'Web Browsing & Medsos', icon: Globe, rating: getBrowsingRating() },
  ];

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < count ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
        }`}
      />
    ));
  };

  return (
    <div className="w-full glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Rating Kelayakan Aktivitas Pengguna</span>
        </h4>
        <span className="text-[10px] text-slate-400 font-bold uppercase">Rekomendasi Otomatis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div key={idx} className={`p-3.5 rounded-2xl border ${act.rating.bg} space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${act.rating.color}`} />
                  <span className="text-xs font-bold text-white">{act.name}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {renderStars(act.rating.stars)}
              </div>

              <p className={`text-[11px] font-bold ${act.rating.color}`}>
                {act.rating.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
