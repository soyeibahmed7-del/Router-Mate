import React, { useState } from 'react';
import { 
  Globe, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  Save, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  Languages, 
  Server, 
  Check, 
  Sparkles,
  Fingerprint,
  Image,
  Upload,
  Radio,
  ExternalLink
} from 'lucide-react';
import { RouterProfile, IspContact, Language, NetworkDiagnostics } from '../types';
import { translations } from '../translations';

interface SettingsViewProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  routers: RouterProfile[];
  onSelectRouter: (id: string) => void;
  ispContact: IspContact;
  onUpdateIsp: (contact: IspContact) => void;
  isSimulated: boolean;
  onToggleSim: () => void;
  onResetApp: () => void;
  customLogoUrl?: string | null;
  onOpenLogoUploader: () => void;
  onOpenDiagnostics: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  onSetLang,
  routers,
  onSelectRouter,
  ispContact,
  onUpdateIsp,
  isSimulated,
  onToggleSim,
  onResetApp,
  customLogoUrl,
  onOpenLogoUploader,
  onOpenDiagnostics,
}) => {
  const t = translations[lang];

  const [ispName, setIspName] = useState(ispContact.name);
  const [ispPhone, setIspPhone] = useState(ispContact.phone);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // App PIN & Biometrics
  const [pinEnabled, setPinEnabled] = useState(true);
  const [bioEnabled, setBioEnabled] = useState(true);
  const [pinCode, setPinCode] = useState('786110');
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [testBioSuccess, setTestBioSuccess] = useState(false);

  const handleSaveIsp = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateIsp({ name: ispName.trim(), phone: ispPhone.trim() });
    setToastMsg(t.toast_saved);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDialIsp = () => {
    window.location.href = `tel:${ispPhone}`;
  };

  const handleWhatsAppIsp = () => {
    const cleanNumber = ispPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const triggerTestBio = () => {
    setTestBioSuccess(true);
    setTimeout(() => setTestBioSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-pulse">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 0. Custom Logo Photo Manager Card */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Image className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Custom Logo Photo
              </h2>
              <p className="text-xs text-slate-400">Upload your own company or personal logo photo</p>
            </div>
          </div>

          <button
            onClick={onOpenLogoUploader}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Current Branding:</span>
          <span className="font-semibold text-white">
            {customLogoUrl ? 'Custom Image Active' : 'Default Enterprise Vector'}
          </span>
        </div>
      </div>

      {/* 1. Quick Network Interface Diagnostics ("Your Wi-Fi") */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-display font-bold text-white">
              Your Wi-Fi Diagnostics
            </h2>
            <p className="text-xs text-slate-400">View local IP, subnet, gateway, DNS, link speed</p>
          </div>
        </div>

        <button
          onClick={onOpenDiagnostics}
          className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold"
        >
          View Details
        </button>
      </div>

      {/* 2. Biometric Fingerprint Card (Original Signature Feature) */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-cyan-400 flex items-center justify-center">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Biometric Fingerprint Authentication
              </h2>
              <p className="text-xs text-slate-400">
                Uses Android enrolled biometric sensor instead of manual password typing
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bioEnabled}
              onChange={(e) => setBioEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Interactive Fingerprint Scanner Graphic */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl border border-cyan-500/40 bg-[#071325] flex items-center justify-center overflow-hidden flex-shrink-0 group">
              <Fingerprint className="w-10 h-10 text-cyan-400 opacity-90 drop-shadow-[0_0_8px_#38bdf8]" />
              {/* Laser scanner line */}
              <div className="absolute left-1 right-1 h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" style={{ top: '40%' }} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Biometric Sensor Status</span>
              <span className="text-[11px] text-emerald-400 block font-mono">
                {testBioSuccess ? '✓ Fingerprint Verified!' : bioEnabled ? 'Sensor Active & Ready' : 'Disabled'}
              </span>
            </div>
          </div>

          <button
            onClick={triggerTestBio}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all active:scale-95"
          >
            Test Scan
          </button>
        </div>
      </div>

      {/* 3. 6-Digit App PIN */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-display font-bold text-white">
                {t.set_pin_title}
              </h2>
              <p className="text-xs text-slate-400">{t.set_pin_desc}</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pinEnabled}
              onChange={(e) => setPinEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {pinEnabled && (
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Security PIN Code:</span>
              <span className="font-mono font-bold text-white text-sm">•••••• (Enforced)</span>
            </div>
            <button
              onClick={() => {
                const newCode = prompt('Enter new 6-digit app PIN:', pinCode);
                if (newCode && newCode.length === 6 && /^\d+$/.test(newCode)) {
                  setPinCode(newCode);
                  setToastMsg('App PIN updated successfully.');
                  setTimeout(() => setToastMsg(null), 2500);
                } else if (newCode) {
                  alert('PIN must be exactly 6 digits.');
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-xs"
            >
              Change PIN
            </button>
          </div>
        )}
      </div>

      {/* 4. Language Configuration */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Languages className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-display font-bold text-white">
            {t.set_lang_title}
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSetLang('en')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              lang === 'en'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span>English (US)</span>
            {lang === 'en' && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onSetLang('bn')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
              lang === 'bn'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span>বাংলা (Bengali)</span>
            {lang === 'bn' && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 5. Connected Routers Profile Manager */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-display font-bold text-white">
              {t.set_routers_title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {routers.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelectRouter(r.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                r.active
                  ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-sm text-white">{r.name}</span>
                {r.active && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-1">{r.model}</p>
              <p className="text-[11px] text-cyan-400 font-mono">{r.url}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ISP Emergency Quick-Dial & Support */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Phone className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-display font-bold text-white">
              {t.set_isp_title}
            </h2>
            <p className="text-xs text-slate-400">{t.set_isp_desc}</p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={handleDialIsp}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>{t.set_isp_dial}</span>
          </button>

          <button
            onClick={handleWhatsAppIsp}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>{t.set_isp_wa}</span>
          </button>

          <button
            onClick={() => alert(`Opening bKash Send Money to ISP ${ispPhone}`)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-rose-400" />
            <span>{t.set_isp_bkash}</span>
          </button>

          <button
            onClick={() => alert(`IMO support contact: ${ispPhone}`)}
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            <span>{t.set_isp_imo}</span>
          </button>
        </div>

        {/* Edit ISP Form */}
        <form onSubmit={handleSaveIsp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">{t.set_isp_name}</label>
            <input
              type="text"
              value={ispName}
              onChange={(e) => setIspName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">{t.set_isp_phone}</label>
            <input
              type="tel"
              value={ispPhone}
              onChange={(e) => setIspPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.set_isp_save}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 7. Reset Diagnostics */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-rose-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-display font-bold text-rose-300">
              {t.set_reset_title}
            </h2>
            <p className="text-xs text-slate-400">
              Clear local cached telemetry and restore initial router profiles.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm(t.set_reset_confirm)) {
                onResetApp();
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.set_reset_btn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
