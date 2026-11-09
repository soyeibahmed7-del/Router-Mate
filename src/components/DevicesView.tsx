import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Smartphone, 
  Laptop, 
  Tv, 
  Gamepad2, 
  Speaker, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  Gauge, 
  Check, 
  X, 
  ArrowDown, 
  ArrowUp,
  AlertTriangle,
  Lock,
  Unlock
} from 'lucide-react';
import { Device, Language } from '../types';
import { translations } from '../translations';

interface DevicesViewProps {
  lang: Language;
  devices: Device[];
  onBlockDevice: (mac: string) => void;
  onRenameDevice: (mac: string, newName: string) => void;
  onSetLimit: (mac: string, limitMbps: number) => void;
  onToggleKnown: (mac: string) => void;
}

export const DevicesView: React.FC<DevicesViewProps> = ({
  lang,
  devices,
  onBlockDevice,
  onRenameDevice,
  onSetLimit,
  onToggleKnown,
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'online' | 'blocked' | 'known'>('all');
  
  // Modals state
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [limitingDevice, setLimitingDevice] = useState<Device | null>(null);
  const [limitInput, setLimitInput] = useState<number>(0);

  const getDeviceIcon = (type?: string) => {
    switch (type) {
      case 'laptop': return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'tv': return <Tv className="w-5 h-5 text-purple-400" />;
      case 'gaming': return <Gamepad2 className="w-5 h-5 text-emerald-400" />;
      case 'speaker': return <Speaker className="w-5 h-5 text-amber-400" />;
      case 'iot': return <Cpu className="w-5 h-5 text-rose-400" />;
      default: return <Smartphone className="w-5 h-5 text-sky-400" />;
    }
  };

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.mac.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'online') return d.online && !d.blocked;
    if (activeFilter === 'blocked') return d.blocked;
    if (activeFilter === 'known') return d.isKnown;
    return true;
  });

  const handleOpenRename = (device: Device) => {
    setEditingDevice(device);
    setRenameInput(device.name);
  };

  const handleSaveRename = () => {
    if (editingDevice && renameInput.trim()) {
      onRenameDevice(editingDevice.mac, renameInput.trim());
      setEditingDevice(null);
    }
  };

  const handleOpenLimit = (device: Device) => {
    setLimitingDevice(device);
    const curMbps = device.limitDownKBps > 0 && device.limitDownKBps < 38528
      ? Math.round(device.limitDownKBps * 8 / 100) / 10
      : 0;
    setLimitInput(curMbps);
  };

  const handleSaveLimit = (mbps: number) => {
    if (limitingDevice) {
      onSetLimit(limitingDevice.mac, mbps);
      setLimitingDevice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search Bar & Filters */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.dev_search_ph}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all border ${
              activeFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t.dev_filter_all} ({devices.length})
          </button>
          <button
            onClick={() => setActiveFilter('online')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all border ${
              activeFilter === 'online'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t.dev_filter_online} ({devices.filter(d => d.online && !d.blocked).length})
          </button>
          <button
            onClick={() => setActiveFilter('blocked')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all border ${
              activeFilter === 'blocked'
                ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t.dev_filter_blocked} ({devices.filter(d => d.blocked).length})
          </button>
          <button
            onClick={() => setActiveFilter('known')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all border ${
              activeFilter === 'known'
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {t.dev_filter_known} ({devices.filter(d => d.isKnown).length})
          </button>
        </div>
      </div>

      {/* Devices List */}
      <div className="space-y-3.5">
        {filteredDevices.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-cyan-500/20 space-y-3">
            <Filter className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-300">{t.dev_no_devices}</h3>
            <p className="text-xs text-slate-500">Try clearing your search query or filter chip.</p>
          </div>
        ) : (
          filteredDevices.map((dev) => {
            const downSpeed = ((dev.downKBps * 8) / 1000).toFixed(1);
            const upSpeed = ((dev.upKBps * 8) / 1000).toFixed(1);
            const currentLimitMbps = dev.limitDownKBps > 0 && dev.limitDownKBps < 38528
              ? Math.round(dev.limitDownKBps * 8 / 100) / 10
              : 0;

            return (
              <div
                key={dev.mac}
                className={`glass-panel p-4 sm:p-5 rounded-3xl border transition-all ${
                  dev.blocked
                    ? 'bg-rose-950/20 border-rose-500/30 shadow-[0_4px_20px_rgba(244,63,94,0.08)]'
                    : 'border-cyan-500/20 hover:border-cyan-400/40 hover:bg-[#0b1c31]/90'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Device Avatar & Metadata */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        dev.blocked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {getDeviceIcon(dev.deviceType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-white">
                          {dev.name}
                        </span>

                        <button
                          onClick={() => handleOpenRename(dev)}
                          className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                          title={t.dev_rename_btn}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {dev.isMe && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-mono">
                            {t.dev_is_me}
                          </span>
                        )}

                        <button
                          onClick={() => onToggleKnown(dev.mac)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border transition-all ${
                            dev.isKnown
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                          title={dev.isKnown ? t.dev_unmark_trusted : t.dev_mark_trusted}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{dev.isKnown ? t.dev_trusted : t.dev_untrusted}</span>
                        </button>
                      </div>

                      {/* Technical Network Coordinates */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-slate-300">{dev.ip || 'No IP (Offline)'}</span>
                        <span>·</span>
                        <span className="text-slate-500">{dev.mac}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[11px] text-cyan-400">
                          {dev.band === 'wired' ? 'Gigabit LAN' : `${dev.band} Wi-Fi`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Speed, Limiter & Block Toggle */}
                  <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    {/* Live Speed telemetry */}
                    <div className="flex items-center gap-3 font-mono text-xs pr-2">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span>{dev.online && !dev.blocked ? downSpeed : '0.0'} Mbps</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>{dev.online && !dev.blocked ? upSpeed : '0.0'} Mbps</span>
                      </div>
                    </div>

                    {/* Speed Limit Selector */}
                    <button
                      onClick={() => handleOpenLimit(dev)}
                      disabled={dev.blocked}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-cyan-500/40 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 transition-all disabled:opacity-50"
                    >
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        {currentLimitMbps > 0 ? `${currentLimitMbps} Mbps` : t.dev_limit_none}
                      </span>
                    </button>

                    {/* Block / Unblock Button */}
                    {!dev.isMe ? (
                      <button
                        onClick={() => onBlockDevice(dev.mac)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border active:scale-95 ${
                          dev.blocked
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        {dev.blocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>{t.dev_unblock_btn}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>{t.dev_block_btn}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic px-2">Protected</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rename Modal */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-glow p-6 rounded-3xl border border-cyan-500/30 space-y-4">
            <h3 className="text-lg font-display font-bold text-white">
              {t.dev_modal_rename_title}
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">{t.dev_modal_rename_label}</label>
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 font-medium"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                MAC: {editingDevice.mac}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingDevice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t.dev_modal_rename_cancel}
              </button>
              <button
                onClick={handleSaveRename}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {t.dev_modal_rename_save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speed Limit Modal */}
      {limitingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-glow p-6 rounded-3xl border border-cyan-500/30 space-y-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <span>{t.dev_modal_limit_title}</span>
            </h3>
            <p className="text-xs text-slate-400">{t.dev_modal_limit_hint}</p>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2, 5, 10, 20].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSaveLimit(speed)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      limitInput === speed
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500/40'
                    }`}
                  >
                    {speed === 0 ? t.dev_limit_none : `${speed} Mbps`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                onClick={() => setLimitingDevice(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t.dev_modal_rename_cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
