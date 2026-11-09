import React from 'react';
import { LogoStyle } from '../types';

interface LogoProps {
  style?: LogoStyle;
  customLogoUrl?: string | null;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
}

export const RouterMateLogo: React.FC<LogoProps> = ({
  style = 'pro_minimal',
  customLogoUrl,
  variant = 'full',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-14 h-14',
    hero: 'w-20 h-20',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    hero: 'text-4xl',
  }[size];

  // If user provided a custom photo/logo, render their uploaded image!
  if (customLogoUrl) {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className={`relative ${iconDimensions} rounded-xl overflow-hidden flex-shrink-0 border border-white/20 bg-slate-900 shadow-md`}>
          <img
            src={customLogoUrl}
            alt="RouterMate Logo"
            className="w-full h-full object-contain p-0.5"
          />
        </div>

        {variant === 'full' && (
          <div className="flex flex-col">
            <div className={`font-display font-extrabold tracking-tight ${textSizes} leading-tight text-white flex items-center gap-1`}>
              <span>Router</span>
              <span className="text-cyan-400 font-black">Mate</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1 shadow-[0_0_8px_#34d399]" />
            </div>
            {showTagline && (
              <span className="font-mono text-[9px] tracking-[0.2em] font-semibold text-slate-400 uppercase">
                SMART ROUTER ADMIN
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Professional default logo rendering
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${iconDimensions} flex-shrink-0 flex items-center justify-center`}>
        {/* Crisp, professional, enterprise-grade router mark */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#111e33] to-[#0a1220] p-1.5 border border-cyan-500/30 shadow-[0_4px_16px_rgba(6,182,212,0.18)] flex items-center justify-center group">
          <svg viewBox="0 0 24 24" className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8.8a15 15 0 0 1 20 0" stroke="currentColor" />
            <path d="M5 12.5a10 10 0 0 1 14 0" stroke="#38bdf8" />
            <path d="M8.5 16.1a5 5 0 0 1 7 0" stroke="#34d399" />
            <circle cx="12" cy="19.5" r="1.5" fill="#34d399" stroke="none" />
          </svg>
        </div>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className={`font-display font-bold tracking-tight ${textSizes} leading-none text-white flex items-center`}>
            <span>Router</span>
            <span className="text-cyan-400 font-extrabold ml-0.5">Mate</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 shadow-[0_0_8px_#34d399] animate-pulse" />
          </div>
          {showTagline && (
            <span className="font-mono text-[9px] tracking-[0.18em] font-medium text-slate-400 uppercase mt-1">
              WI-FI & ROUTER MANAGER
            </span>
          )}
        </div>
      )}
    </div>
  );
};
