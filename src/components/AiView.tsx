import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  HelpCircle, 
  RotateCcw,
  Zap,
  Activity,
  Bot
} from 'lucide-react';
import { Device, Language, AiChatMessage } from '../types';
import { translations } from '../translations';

interface AiViewProps {
  lang: Language;
  devices: Device[];
  totalDownMbps: number;
  healthScore: number;
  onBlockDevice: (mac: string) => void;
  onMarkAllKnown: () => void;
}

export const AiView: React.FC<AiViewProps> = ({
  lang,
  devices,
  totalDownMbps,
  healthScore,
  onBlockDevice,
  onMarkAllKnown,
}) => {
  const t = translations[lang];

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'health' | 'security'>('chat');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialMessages: AiChatMessage[] = [
    {
      id: 'msg-1',
      role: 'model',
      text: t.ai_chat_welcome,
      timestamp: 'Now',
    }
  ];

  const [messages, setMessages] = useState<AiChatMessage[]>(initialMessages);

  // Quick suggestions
  const prompts = [
    t.ai_prompt_1,
    t.ai_prompt_2,
    t.ai_prompt_3,
    t.ai_prompt_4,
  ];

  const onlineDevices = devices.filter((d) => d.online && !d.blocked);
  const unknownDevices = onlineDevices.filter((d) => !d.isKnown && !d.isMe);
  const blockedDevices = devices.filter((d) => d.blocked);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let actionTaken = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('bandwidth') || lower.includes('most') || lower.includes('কে সবচেয়ে বেশি') || lower.includes('ব্যান্ডউইথ')) {
        const top = [...onlineDevices].sort((a, b) => (b.downKBps + b.upKBps) - (a.downKBps + a.upKBps))[0];
        if (top) {
          const mbps = ((top.downKBps + top.upKBps) * 8 / 1000).toFixed(1);
          reply = lang === 'en'
            ? `Device "${top.name}" (${top.ip}) is currently consuming the highest bandwidth at ${mbps} Mbps (${Math.round((Number(mbps) / Math.max(totalDownMbps, 1)) * 100)}% of total network throughput).`
            : `"${top.name}" (${top.ip}) ডিভাইসটি বর্তমানে সর্বোচ্চ ডেটা ব্যবহার করছে: ${mbps} Mbps।`;
        } else {
          reply = lang === 'en' ? 'No active devices are currently downloading heavy traffic.' : 'বর্তমানে কোনো ডিভাইস অতিরিক্ত ডেটা নিচ্ছে না।';
        }
      } else if (lower.includes('slow') || lower.includes('স্লো') || lower.includes('কেন')) {
        const top = [...onlineDevices].sort((a, b) => (b.downKBps + b.upKBps) - (a.downKBps + a.upKBps))[0];
        reply = lang === 'en'
          ? `Analysis: Your network has ${onlineDevices.length} devices online. "${top?.name || 'A connected device'}" is streaming high bandwidth. Also check if multiple devices are on 2.4 GHz rather than 5 GHz.`
          : `বিশ্লেষণ: বর্তমানে ${onlineDevices.length}টি ডিভাইস যুক্ত আছে। "${top?.name || 'একটি ডিভাইস'}" অতিরিক্ত ডেটা ব্যবহার করছে। ৫ GHz ওয়াইফাই ব্যবহারের পরামর্শ দেওয়া হচ্ছে।`;
      } else if (lower.includes('untrusted') || lower.includes('stranger') || lower.includes('অপরিচিত') || lower.includes('সন্দেহ')) {
        if (unknownDevices.length > 0) {
          const names = unknownDevices.map((d) => `${d.name} (${d.ip})`).join(', ');
          reply = lang === 'en'
            ? `Identified ${unknownDevices.length} unverified device(s) on your Wi-Fi: ${names}. You can verify them or block them instantly.`
            : `${unknownDevices.length}টি অপরিচিত ডিভাইস পাওয়া গেছে: ${names}। আপনি চাইলে এগুলোকে ব্লক করতে পারেন।`;
        } else {
          reply = lang === 'en'
            ? 'All active online devices have been marked as trusted by you. No suspicious devices detected!'
            : 'সবগুলো অনলাইন ডিভাইস আপনার পরিচিত ও বিশ্বস্ত। কোনো অপরিচিত ডিভাইস পাওয়া যায়নি!';
        }
      } else if (lower.includes('security') || lower.includes('নিরাপত্তা') || lower.includes('স্ক্যান')) {
        reply = lang === 'en'
          ? `Security audit complete! Current Score: ${healthScore}/100. Hardware MAC filter is active. WPA2-PSK AES encryption verified. 0 open ports exposed.`
          : `নিরাপত্তা অডিট সম্পন্ন হয়েছে! বর্তমান স্কোরঃ ${healthScore}/১০০। হার্ডওয়্যার ম্যাক ফিল্টার সক্রিয় এবং WPA2 এনক্রিপশন নিরাপদ রয়েছে।`;
      } else {
        reply = lang === 'en'
          ? `RouterMate AI verified your current router state: ${onlineDevices.length} online devices, ${blockedDevices.length} blocked devices, live throughput ${totalDownMbps.toFixed(1)} Mbps.`
          : `রাউটারের লাইভ অবস্থা পর্যবেক্ষণ করা হয়েছে: ${onlineDevices.length}টি ডিভাইস অনলাইন, ${blockedDevices.length}টি ব্লক করা, বর্তমান স্পিড ${totalDownMbps.toFixed(1)} Mbps।`;
      }

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: 'Just now',
        actionTaken,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="glass-panel p-2 rounded-2xl border border-cyan-500/20 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'chat'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{t.ai_tab_chat}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('health')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'health'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t.ai_tab_health}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'security'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.ai_tab_security}</span>
        </button>
      </div>

      {/* Subtab 1: AI Chat Assistant */}
      {activeSubTab === 'chat' && (
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 flex flex-col h-[560px]">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m) => {
              const isAi = m.role === 'model';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isAi
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isAi ? <Sparkles className="w-4 h-4 text-cyan-400" /> : 'You'}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span className="block text-[10px] text-slate-400/80 mt-1.5 text-right font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>RouterMate AI analyzing router telemetry...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions Strip */}
          <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-[11px] font-medium whitespace-nowrap transition-all active:scale-95 flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>{p}</span>
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t.ai_chat_ph}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t.ai_send_btn}</span>
            </button>
          </form>
        </div>
      )}

      {/* Subtab 2: Network Health Score */}
      {activeSubTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Gauge Box */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 text-center flex flex-col items-center justify-center space-y-3">
            <h3 className="text-sm font-semibold text-slate-400">{t.ai_health_score}</h3>
            
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeDasharray={`${(healthScore / 100) * 264} 264`}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-extrabold text-white">{healthScore}</span>
                <span className="text-[10px] text-cyan-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{healthScore >= 80 ? t.ai_health_excellent : t.ai_health_good}</span>
            </div>
          </div>

          {/* Diagnostic Breakdown */}
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4">
            <h3 className="font-display font-bold text-base text-white">
              Hardware & Signal Diagnostics
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">WAN Gateway Link</div>
                  <div className="text-[11px] text-slate-400">1000 Mbps full duplex, 0 error packets</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">100% OK</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Radio Channel Congestion</div>
                  <div className="text-[11px] text-slate-400">Clean spectrum on 5GHz Ch 36 (SNR 48dB)</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">Optimal</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Security & Trusted Devices</div>
                  <div className="text-[11px] text-slate-400">
                    {unknownDevices.length} unverified device(s) detected
                  </div>
                </div>
                <span className={`text-xs font-bold font-mono ${unknownDevices.length === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {unknownDevices.length === 0 ? 'Protected' : 'Attention'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Security Advisor */}
      {activeSubTab === 'security' && (
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Device Intelligence & Trust Audit
              </h3>
              <p className="text-xs text-slate-400">
                Categorize devices to detect strangers or Wi-Fi freeloaders.
              </p>
            </div>

            <button
              onClick={onMarkAllKnown}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.ai_intel_mark_all_btn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400">{t.ai_intel_trusted_count}</span>
              <div className="text-2xl font-display font-extrabold text-emerald-400">
                {devices.filter((d) => d.isKnown).length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400">{t.ai_intel_unknown_count}</span>
              <div className="text-2xl font-display font-extrabold text-amber-400">
                {unknownDevices.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400">Blocked Freeloaders</span>
              <div className="text-2xl font-display font-extrabold text-rose-400">
                {blockedDevices.length}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-300">Security Best Practices:</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.ai_sec_tip1}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.ai_sec_tip2}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.ai_sec_tip3}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
