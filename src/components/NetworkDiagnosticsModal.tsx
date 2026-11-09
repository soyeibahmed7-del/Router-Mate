import React, { useState } from 'react';
import { Wifi, Copy, Check, X, Shield, Radio, Activity } from 'lucide-react';
import { NetworkDiagnostics, Language } from '../types';
import { translations } from '../translations';

interface NetworkDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  diagnostics: NetworkDiagnostics;
}

export const NetworkDiagnosticsModal: React.FC<NetworkDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  lang,
  diagnostics,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyVal = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-[#0c1424] border border-cyan-500/30 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Local Interface Telemetry</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <span>Your Wi-Fi Connection</span>
          </h3>
          <p className="text-xs text-slate-400">
            Hardware interface details for the phone/device running RouterMate.
          </p>
        </div>

        {/* Network Metrics Grid */}
        <div className="divide-y divide-slate-800 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Connected SSID:</span>
            <span className="font-bold text-cyan-300 font-sans text-sm">{diagnostics.connectedSsid}</span>
          </div>

          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Device IP:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{diagnostics.deviceIp}</span>
              <button
                onClick={() => copyVal(diagnostics.deviceIp, 'ip')}
                className="text-slate-400 hover:text-cyan-300 p-1"
                title="Copy IP"
              >
                {copiedKey === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Gateway / Router:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{diagnostics.gatewayIp}</span>
              <button
                onClick={() => copyVal(diagnostics.gatewayIp, 'gw')}
                className="text-slate-400 hover:text-cyan-300 p-1"
                title="Copy Gateway"
              >
                {copiedKey === 'gw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Subnet Mask:</span>
            <span className="text-slate-300">{diagnostics.subnetMask}</span>
          </div>

          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Primary DNS:</span>
            <span className="text-slate-300">{diagnostics.primaryDns}</span>
          </div>

          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Link Speed:</span>
            <span className="text-emerald-400 font-bold">{diagnostics.linkSpeed}</span>
          </div>

          <div className="p-3 flex items-center justify-between">
            <span className="text-slate-400 font-sans">Frequency Band:</span>
            <span className="text-purple-400">{diagnostics.frequency}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Encrypted WPA2 Channel</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
