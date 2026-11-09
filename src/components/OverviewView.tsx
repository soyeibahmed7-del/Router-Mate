import React from 'react';
import { 
  Wifi, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Laptop, 
  Smartphone, 
  Tv, 
  Gamepad2, 
  Speaker, 
  Cpu, 
  ExternalLink,
  Zap,
  Users
} from 'lucide-react';
import { Device, RouterProfile, Language } from '../types';
import { translations } from '../translations';
import { NavTab } from './Navbar';

interface OverviewViewProps {
  lang: Language;
  activeRouter: RouterProfile;
  devices: Device[];
  totalDownMbps: number;
  totalUpMbps: number;
  trafficHistory: { down: number; up: number; time: string }[];
  onNavigate: (tab: NavTab) => void;
  onBlockDevice: (mac: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  lang,
  activeRouter,
  devices,
  totalDownMbps,
  totalUpMbps,
  trafficHistory,
  onNavigate,
  onBlockDevice,
}) => {
  const t = translations[lang];

  const onlineDevices = devices.filter((d) => d.online && !d.blocked);
  const blockedDevices = devices.filter((d) => d.blocked);
  const guestCount = devices.filter((d) => d.band === '2.4G' && !d.isKnown).length;

  // Sort by top bandwidth users
  const topBandwidthDevices = [...onlineDevices]
    .sort((a, b) => (b.downKBps + b.upKBps) - (a.downKBps + a.upKBps))
    .slice(0, 4);

  const getDeviceIcon = (type?: string) => {
    switch (type) {
      case 'laptop': return <Laptop className="w-4 h-4 text-cyan-400" />;
      case 'tv': return <Tv className="w-4 h-4 text-purple-400" />;
      case 'gaming': return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
      case 'speaker': return <Speaker className="w-4 h-4 text-amber-400" />;
      case 'iot': return <Cpu className="w-4 h-4 text-rose-400" />;
      default: return <Smartphone className="w-4 h-4 text-sky-400" />;
    }
  };

  // Generate SVG path for live chart
  const maxDown = Math.max(...trafficHistory.map((h) => h.down), 10);
  const chartWidth = 500;
  const chartHeight = 120;
  const pointsDown = trafficHistory.map((pt, i) => {
    const x = (i / (trafficHistory.length - 1)) * chartWidth;
    const y = chartHeight - (pt.down / maxDown) * (chartHeight - 15);
    return `${x},${y}`;
  }).join(' ');

  const pointsUp = trafficHistory.map((pt, i) => {
    const x = (i / (trafficHistory.length - 1)) * chartWidth;
    const y = chartHeight - (pt.up / maxDown) * (chartHeight - 15);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Hero Router Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-glow p-6 sm:p-7 border border-cyan-500/25">
        {/* Ambient neon radial gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{t.ov_status_good}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {activeRouter.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              {activeRouter.model} · {t.ov_status_sub}
            </p>

            {/* Quick Specs Pill Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span className="text-slate-400 font-sans mr-1">{t.ov_wan_ip}:</span>
                <span className="text-cyan-400">{activeRouter.ip}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span className="text-slate-400 font-sans mr-1">{t.ov_gateway}:</span>
                <span className="text-slate-200">{activeRouter.gateway}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60">
                <span className="text-slate-400 font-sans mr-1">{t.ov_link_speed}:</span>
                <span className="text-emerald-400 font-bold">{activeRouter.linkMbps} Mbps</span>
              </span>
            </div>
          </div>

          {/* Quick Wi-Fi Action Card */}
          <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => onNavigate('devices')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>{t.dev_title}</span>
            </button>
            <button
              onClick={() => onNavigate('wifi')}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Wifi className="w-4 h-4" />
              <span>{t.wifi_tab_networks}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Tile 1: Online Devices */}
        <div
          onClick={() => onNavigate('devices')}
          className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_8px_25px_rgba(6,182,212,0.15)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.ov_online_devs}</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {onlineDevices.length}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{guestCount} guests connected</span>
          </div>
        </div>

        {/* Tile 2: Live Download */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.ov_download}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ArrowDownCircle className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-mono">
            {totalDownMbps.toFixed(1)}
            <span className="text-xs font-sans font-medium text-slate-400 ml-1">Mbps</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Peak: {(totalDownMbps * 1.4).toFixed(1)} Mbps
          </div>
        </div>

        {/* Tile 3: Live Upload */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.ov_upload}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <ArrowUpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-mono">
            {totalUpMbps.toFixed(1)}
            <span className="text-xs font-sans font-medium text-slate-400 ml-1">Mbps</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Low Latency: 14ms
          </div>
        </div>

        {/* Tile 4: Blocked Devices */}
        <div
          onClick={() => onNavigate('wifi')}
          className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/20 hover:border-rose-400/50 hover:shadow-[0_8px_25px_rgba(244,63,94,0.15)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">{t.ov_blocked_devs}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {blockedDevices.length}
          </div>
          <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-mono">
            <span>ACL rule enforced</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Live Bandwidth Chart & Top Consumers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bandwidth Graph */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-white">
                {t.ov_traffic_chart}
              </h2>
              <p className="text-xs text-slate-400">Real-time throughput streamed from router telemetry</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                <span className="text-slate-300">Download</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-slate-300">Upload</span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Area Chart */}
          <div className="w-full overflow-hidden bg-slate-950/60 rounded-2xl p-3 border border-slate-800/80">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-36 sm:h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="downGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2={chartWidth} y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2={chartWidth} y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Fill Area */}
              <polygon
                points={`0,${chartHeight} ${pointsDown} ${chartWidth},${chartHeight}`}
                fill="url(#downGrad)"
              />
              <polygon
                points={`0,${chartHeight} ${pointsUp} ${chartWidth},${chartHeight}`}
                fill="url(#upGrad)"
              />

              {/* Stroke Lines */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsDown}
              />
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsUp}
              />
            </svg>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900 mt-2">
              <span>2 mins ago</span>
              <span>1 min ago</span>
              <span className="text-cyan-400 font-bold">Now (live)</span>
            </div>
          </div>
        </div>

        {/* Right: Top Bandwidth Consumers */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-display font-bold text-white">
              {t.ov_top_users}
            </h2>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-3.5">
            {topBandwidthDevices.map((dev) => {
              const speedMbps = ((dev.downKBps + dev.upKBps) * 8) / 1000;
              const percent = Math.min(100, Math.round((speedMbps / Math.max(totalDownMbps, 1)) * 100));

              return (
                <div key={dev.mac} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[170px]">
                      {getDeviceIcon(dev.deviceType)}
                      <span className="font-semibold text-slate-200 truncate">{dev.name}</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-300">
                      {speedMbps.toFixed(1)} Mbps
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{dev.ip}</span>
                    <span>{percent}% network load</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Devices Quick Strip */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white">
              {t.ov_recent_devices}
            </h2>
            <p className="text-xs text-slate-400">Quick device status & firewall controls</p>
          </div>
          <button
            onClick={() => onNavigate('devices')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>View All ({devices.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {devices.slice(0, 6).map((dev) => (
            <div
              key={dev.mac}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                dev.blocked
                  ? 'bg-rose-950/20 border-rose-500/25'
                  : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    dev.blocked
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-cyan-500/15 text-cyan-300'
                  }`}
                >
                  {getDeviceIcon(dev.deviceType)}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-xs text-slate-200 truncate flex items-center gap-1.5">
                    <span>{dev.name}</span>
                    {dev.isMe && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono">
                        ME
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {dev.ip || 'Offline'} · {dev.band}
                  </div>
                </div>
              </div>

              {!dev.isMe && (
                <button
                  onClick={() => onBlockDevice(dev.mac)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                    dev.blocked
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                  }`}
                >
                  {dev.blocked ? t.dev_unblock_btn : t.dev_block_btn}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
