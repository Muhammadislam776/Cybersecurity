import React, { useState } from 'react';
import { 
  History, 
  Clock, 
  User, 
  Flame, 
  ShieldCheck, 
  BellRing, 
  Sparkles, 
  Filter, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';

export const ViewerTimelinePage: React.FC = () => {
  const { timeline, incidents } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTimeline = timeline.filter(item => {
    if (filterType === 'all') return true;
    return item.type.includes(filterType);
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Operational Incident Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade chronological event log across detections, triage stages, and mitigation milestones
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'alert', 'status', 'evidence', 'recommendation'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filterType === type 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline stream */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filteredTimeline.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No timeline events found for this filter.
            </div>
          ) : (
            filteredTimeline.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>

                <div className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-4 hover:bg-blue-50/20 transition-all">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-slate-200 text-slate-700">
                        {item.type}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      Recorded By: <strong className="text-slate-700 font-semibold">{item.actor}</strong>
                    </span>
                    <span className="font-mono text-slate-400">
                      {item.metadata?.incidentId || 'Global Telemetry'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
