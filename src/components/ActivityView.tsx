import React, { useState } from 'react';
import { 
  Clock, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Gauge, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { ActivityEvent, Language } from '../types';
import { translations } from '../translations';

interface ActivityViewProps {
  lang: Language;
  events: ActivityEvent[];
  onClearEvents: () => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  lang,
  events,
  onClearEvents,
}) => {
  const t = translations[lang];

  const [filterType, setFilterType] = useState<'all' | 'block' | 'limit' | 'ai'>('all');

  const filteredEvents = events.filter((ev) => {
    if (filterType === 'block') return ev.type === 'block' || ev.type === 'unblock';
    if (filterType === 'limit') return ev.type === 'limit';
    if (filterType === 'ai') return ev.type === 'ai';
    return true;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'block':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'unblock':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'in':
        return <LogIn className="w-4 h-4 text-cyan-400" />;
      case 'out':
        return <LogOut className="w-4 h-4 text-slate-400" />;
      case 'limit':
        return <Gauge className="w-4 h-4 text-amber-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>{t.act_title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time audit log of hardware state changes, connections, and security interventions.
          </p>
        </div>

        <button
          onClick={onClearEvents}
          disabled={events.length === 0}
          className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.act_clear}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            filterType === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          {t.act_filter_all}
        </button>
        <button
          onClick={() => setFilterType('block')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            filterType === 'block'
              ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          {t.act_filter_blocks}
        </button>
        <button
          onClick={() => setFilterType('limit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            filterType === 'limit'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          {t.act_filter_limits}
        </button>
        <button
          onClick={() => setFilterType('ai')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            filterType === 'ai'
              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800'
          }`}
        >
          AI Audits
        </button>
      </div>

      {/* Events Timeline */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/20">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs font-medium space-y-2">
            <Clock className="w-8 h-8 text-slate-700 mx-auto" />
            <p>{t.act_empty}</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="relative group">
                {/* Node icon dot */}
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 group-hover:border-cyan-500/30 transition-all space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-white flex items-center gap-2">
                      {getEventIcon(ev.type)}
                      <span>{ev.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pl-6">
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
