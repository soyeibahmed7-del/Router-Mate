import React from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Wifi, 
  Sparkles, 
  Clock, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { RouterMateLogo } from './RouterMateLogo';

export type NavTab = 'overview' | 'devices' | 'wifi' | 'ai' | 'activity' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: Language;
  onlineCount: number;
  blockedCount: number;
  healthScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onlineCount,
  blockedCount,
  healthScore,
}) => {
  const t = translations[lang];

  const navItems = [
    {
      id: 'overview' as NavTab,
      label: t.nav_overview,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'devices' as NavTab,
      label: t.nav_devices,
      icon: Smartphone,
      badge: onlineCount > 0 ? String(onlineCount) : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'wifi' as NavTab,
      label: t.nav_wifi,
      icon: Wifi,
      badge: blockedCount > 0 ? String(blockedCount) : null,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      id: 'ai' as NavTab,
      label: t.nav_ai,
      icon: Sparkles,
      badge: `${healthScore}%`,
      badgeColor: healthScore >= 80 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'activity' as NavTab,
      label: t.nav_activity,
      icon: Clock,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: t.nav_settings,
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar Rail */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-cyan-500/15 bg-[#071222]/80 backdrop-blur-xl p-4 gap-6 sticky top-16 h-[calc(100vh-4rem)]">
        {/* Navigation Link List */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_18px_rgba(6,182,212,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pro Shield Indicator Box */}
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-cyan-950/40 to-blue-950/20 border border-cyan-500/20 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Router Armor Active</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Hardware firewall & real-time ARP packet inspection active.
          </p>
        </div>
      </aside>

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 rounded-2xl bg-[#071325]/95 border border-cyan-500/25 backdrop-blur-2xl px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(6,182,212,0.12)]">
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex-1 py-1 px-1 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isActive
                    ? 'text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[54px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
