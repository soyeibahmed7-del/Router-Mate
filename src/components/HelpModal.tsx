import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, Copy, Check, X, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HelpModalProps {
  lang: Language;
  onClose: () => void;
  ispPhone: string;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  lang,
  onClose,
  ispPhone,
}) => {
  const t = translations[lang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyContact = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel-glow p-6 sm:p-7 rounded-3xl border border-cyan-500/30 space-y-5 relative shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Support & Diagnostics</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white">
            {t.help_title}
          </h3>
          <p className="text-xs text-slate-400">
            {t.help_sub}
          </p>
        </div>

        <div className="space-y-2.5">
          {/* ISP Hotline */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">ISP Hotline</div>
                <div className="text-[11px] text-slate-400 font-mono">{ispPhone}</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => copyContact(ispPhone, 'isp')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300"
                title={t.help_copy}
              >
                {copiedKey === 'isp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`tel:${ispPhone}`}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold"
              >
                {t.help_call}
              </a>
            </div>
          </div>

          {/* WhatsApp Direct */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">WhatsApp Chat</div>
                <div className="text-[11px] text-slate-400">Instant technician chat</div>
              </div>
            </div>

            <a
              href={`https://wa.me/${ispPhone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1"
            >
              <span>Chat</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Email Support */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Email Desk</div>
                <div className="text-[11px] text-slate-400 font-mono">support@routermate.internal</div>
              </div>
            </div>

            <button
              onClick={() => copyContact('support@routermate.internal', 'mail')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300"
            >
              {copiedKey === 'mail' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            {t.help_close}
          </button>
        </div>
      </div>
    </div>
  );
};
