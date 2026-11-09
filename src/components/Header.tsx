import React from 'react';
import { RouterMateLogo } from './RouterMateLogo';
import { Globe, HelpCircle, Activity, Sparkles, Languages, Upload, Radio } from 'lucide-react';
import { Language, RouterProfile, LogoStyle } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeRouter: RouterProfile;
  isSimulated: boolean;
  onToggleSim: () => void;
  onOpenHelp: () => void;
  totalDownMbps: number;
  totalUpMbps: number;
  logoStyle: LogoStyle;
  customLogoUrl?: string | null;
  onOpenLogoUploader: () => void;
  onOpenDiagnostics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeRouter,
  isSimulated,
  onToggleSim,
  onOpenHelp,
  totalDownMbps,
  totalUpMbps,
  logoStyle,
  customLogoUrl,
  onOpenLogoUploader,
  onOpenDiagnostics,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080f1e]/95 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Brand Lockup with live styled or custom logo */}
        <div className="flex items-center gap-3">
          <RouterMateLogo
            style={logoStyle}
            customLogoUrl={customLogoUrl}
            variant="full"
            size="sm"
            showTagline={false}
          />

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">{activeRouter.name}</span>
            <span>·</span>
            <span className="font-mono text-cyan-400">{activeRouter.ip}</span>
          </div>
        </div>

        {/* Center Live Traffic Pill (hidden on small phones) */}
        <div className="hidden md:flex items-center gap-3.5 bg-black/40 border border-white/10 rounded-full px-4 py-1 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>↓ {totalDownMbps.toFixed(1)} Mbps</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-medium">
            <span>↑ {totalUpMbps.toFixed(1)} Mbps</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Wi-Fi Diagnostics Button ("Your Wi-Fi") */}
          <button
            onClick={onOpenDiagnostics}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/25 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 text-xs font-semibold transition-all shadow-sm"
            title="Check Connected Wi-Fi info (IP, Gateway, Subnet)"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Your Wi-Fi</span>
          </button>

          {/* Upload Logo Photo Button */}
          <button
            onClick={onOpenLogoUploader}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Upload your own custom logo photo"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Upload Logo</span>
          </button>

          {/* Demo Simulation Badge Button */}
          <button
            onClick={onToggleSim}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isSimulated
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title={t.sim_mode_hint}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span className="hidden sm:inline">{t.sim_mode}</span>
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-white/10 text-zinc-200 text-xs font-semibold tracking-wide transition-all active:scale-95 shadow-sm"
            aria-label="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Help & Support Button */}
          <button
            onClick={onOpenHelp}
            className="w-8 h-8 rounded-xl border border-white/15 bg-zinc-900 hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
            title={t.help_title}
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
