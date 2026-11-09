import React, { useState } from 'react';
import { 
  Wifi, 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Radio, 
  Lock, 
  Sliders, 
  Save,
  AlertCircle
} from 'lucide-react';
import { WifiConfig, AccessListConfig, Device, Language } from '../types';
import { translations } from '../translations';

interface WifiViewProps {
  lang: Language;
  wifiConfig: WifiConfig;
  onUpdateWifi: (config: WifiConfig) => void;
  accessList: AccessListConfig;
  onUpdateAccessList: (acl: AccessListConfig) => void;
  devices: Device[];
}

export const WifiView: React.FC<WifiViewProps> = ({
  lang,
  wifiConfig,
  onUpdateWifi,
  accessList,
  onUpdateAccessList,
  devices,
}) => {
  const t = translations[lang];

  const [activeSubTab, setActiveSubTab] = useState<'networks' | 'guest' | 'acl'>('networks');
  
  // Password peek states
  const [showPwd24, setShowPwd24] = useState(false);
  const [showPwd5, setShowPwd5] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form states
  const [ssid24, setSsid24] = useState(wifiConfig.ssid24);
  const [ssid5, setSsid5] = useState(wifiConfig.ssid5);
  const [pwd24, setPwd24] = useState('SuperSecretHomeWifi2026!');
  const [pwd5, setPwd5] = useState('SuperSecretHomeWifi2026!');
  const [hidden24, setHidden24] = useState(wifiConfig.hidden24);
  const [hidden5, setHidden5] = useState(wifiConfig.hidden5);

  // Guest State
  const [guestEnabled, setGuestEnabled] = useState(wifiConfig.guest.enabled);
  const [guestSsid, setGuestSsid] = useState(wifiConfig.guest.ssid);
  const [guestSpeed, setGuestSpeed] = useState(wifiConfig.guest.speedKBps);

  // ACL state
  const [aclMode, setAclMode] = useState<'deny' | 'pass'>(accessList.mode);
  const [selectedMacs, setSelectedMacs] = useState<string[]>(accessList.macs);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveWifi = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWifi({
      ...wifiConfig,
      ssid24,
      ssid5,
      hidden24,
      hidden5,
      guest: {
        ...wifiConfig.guest,
        enabled: guestEnabled,
        ssid: guestSsid,
        speedKBps: guestSpeed,
      }
    });
    setToastMsg(t.toast_saved);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleAclMac = (mac: string) => {
    // Prevent locking out current admin device
    const dev = devices.find((d) => d.mac === mac);
    if (dev?.isMe && aclMode === 'deny') {
      alert(t.wifi_acl_self_warning);
      return;
    }

    if (selectedMacs.includes(mac)) {
      setSelectedMacs(selectedMacs.filter((m) => m !== mac));
    } else {
      setSelectedMacs([...selectedMacs, mac]);
    }
  };

  const handleSaveAcl = () => {
    onUpdateAccessList({
      mode: aclMode,
      macs: selectedMacs,
    });
    setToastMsg(t.wifi_acl_saved);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-pulse">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Sub Tabs Bar */}
      <div className="glass-panel p-2 rounded-2xl border border-cyan-500/20 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('networks')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'networks'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>{t.wifi_tab_networks}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guest')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'guest'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.wifi_tab_guest}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('acl')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'acl'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{t.wifi_tab_acl}</span>
        </button>
      </div>

      {/* Tab 1: Dual-Band Wi-Fi Networks */}
      {activeSubTab === 'networks' && (
        <form onSubmit={handleSaveWifi} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2.4 GHz Card */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">
                    {t.wifi_24_title}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-semibold">
                  Channel 6
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">{t.wifi_ssid_label}</label>
                  <input
                    type="text"
                    value={ssid24}
                    onChange={(e) => setSsid24(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">{t.wifi_pwd_label}</label>
                  <div className="relative">
                    <input
                      type={showPwd24 ? 'text' : 'password'}
                      value={pwd24}
                      onChange={(e) => setPwd24(e.target.value)}
                      className="w-full pl-3.5 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPwd24(!showPwd24)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {showPwd24 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(pwd24, '24')}
                        className="text-slate-400 hover:text-cyan-300 p-1"
                        title={t.wifi_copy_pwd}
                      >
                        {copiedKey === '24' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300">{t.wifi_hidden_label}</span>
                  <input
                    type="checkbox"
                    checked={hidden24}
                    onChange={(e) => setHidden24(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* 5 GHz Card */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white">
                    {t.wifi_5_title}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-semibold">
                  Channel 36 · AC/AX
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">{t.wifi_ssid_label}</label>
                  <input
                    type="text"
                    value={ssid5}
                    onChange={(e) => setSsid5(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">{t.wifi_pwd_label}</label>
                  <div className="relative">
                    <input
                      type={showPwd5 ? 'text' : 'password'}
                      value={pwd5}
                      onChange={(e) => setPwd5(e.target.value)}
                      className="w-full pl-3.5 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPwd5(!showPwd5)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        {showPwd5 ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(pwd5, '5')}
                        className="text-slate-400 hover:text-cyan-300 p-1"
                        title={t.wifi_copy_pwd}
                      >
                        {copiedKey === '5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-300">{t.wifi_hidden_label}</span>
                  <input
                    type="checkbox"
                    checked={hidden5}
                    onChange={(e) => setHidden5(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Network Settings</span>
          </button>
        </form>
      )}

      {/* Tab 2: Guest Network Settings */}
      {activeSubTab === 'guest' && (
        <form onSubmit={handleSaveWifi} className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {t.wifi_guest_enable}
              </h3>
              <p className="text-xs text-slate-400">{t.wifi_guest_desc}</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={guestEnabled}
                onChange={(e) => setGuestEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {guestEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Guest SSID</label>
                <input
                  type="text"
                  value={guestSsid}
                  onChange={(e) => setGuestSsid(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">{t.wifi_guest_limit}</label>
                <select
                  value={guestSpeed}
                  onChange={(e) => setGuestSpeed(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                >
                  <option value={1024}>1.0 Mbps (Basic browsing)</option>
                  <option value={2048}>2.0 Mbps (Recommended standard)</option>
                  <option value={5120}>5.0 Mbps (HD streaming allowed)</option>
                  <option value={0}>Unlimited</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Update Guest Wi-Fi</span>
          </button>
        </form>
      )}

      {/* Tab 3: Hardware Access List (Blacklist / Whitelist) */}
      {activeSubTab === 'acl' && (
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-white">
              {t.wifi_acl_title}
            </h3>
            <p className="text-xs text-slate-400">{t.wifi_acl_desc}</p>
          </div>

          {/* Mode Switcher Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setAclMode('deny')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                aclMode === 'deny'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{t.wifi_acl_mode_deny}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Default: Everyone connects EXCEPT checked devices below.
              </p>
            </button>

            <button
              onClick={() => setAclMode('pass')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                aclMode === 'pass'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.wifi_acl_mode_pass}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Strict: ONLY checked devices can access Wi-Fi. All others rejected.
              </p>
            </button>
          </div>

          {/* Devices Checkbox Table */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-slate-300">
              Select Target Devices ({selectedMacs.length} chosen):
            </h4>

            <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-slate-950/60 max-h-72 overflow-y-auto">
              {devices.map((dev) => {
                const isSelected = selectedMacs.includes(dev.mac);

                return (
                  <div
                    key={dev.mac}
                    onClick={() => toggleAclMac(dev.mac)}
                    className="p-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 pointer-events-none"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          <span>{dev.name}</span>
                          {dev.isMe && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-mono">
                              ME
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {dev.mac} · {dev.ip || 'Offline'}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isSelected
                          ? aclMode === 'deny'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {isSelected ? (aclMode === 'deny' ? 'Blacklisted' : 'Whitelisted') : 'Normal'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSaveAcl}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{t.wifi_acl_save}</span>
          </button>
        </div>
      )}
    </div>
  );
};
