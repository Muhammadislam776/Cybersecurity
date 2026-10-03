import React, { useState } from 'react';
import { 
  Radio, 
  Flame, 
  BellRing, 
  ShieldCheck, 
  UserCheck, 
  PlayCircle, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveEvent } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ViewerLiveEventsWidgetProps {
  onViewAll?: () => void;
  limit?: number;
}

export const ViewerLiveEventsWidget: React.FC<ViewerLiveEventsWidgetProps> = ({ 
  onViewAll,
  limit = 8 
}) => {
  const { liveEvents, isLiveStreamPaused, toggleLiveStreamPause } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [simulatedError, setSimulatedError] = useState(false);

  const getEventIcon = (category: LiveEvent['category'], severity: LiveEvent['severity']) => {
    switch (category) {
      case 'alert':
        return <BellRing className="w-3.5 h-3.5 text-orange-500" />;
      case 'incident':
        return <Flame className="w-3.5 h-3.5 text-red-500" />;
      case 'evidence':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
      case 'approval':
        return <UserCheck className="w-3.5 h-3.5 text-indigo-500" />;
      case 'simulation':
        return <PlayCircle className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const filteredEvents = liveEvents
    .filter(ev => filterCategory === 'all' || ev.category === filterCategory)
    .slice(0, limit);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Widget Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Live Incident Events</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Real-time operational event telemetry bus</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Full Feed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2 bg-slate-50/70 border-b border-slate-200/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          {['all', 'incident', 'alert', 'evidence'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          {isLiveStreamPaused ? 'Stream Paused' : 'Listening...'}
        </span>
      </div>

      {/* Events List Body */}
      <div className="flex-1 p-3 overflow-y-auto max-h-[360px] divide-y divide-slate-100">
        {simulatedError ? (
          <div className="p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Unable to Load Live Events</h4>
              <p className="text-[11px] text-slate-500">Real-time event connection was temporarily interrupted.</p>
            </div>
            <button
              onClick={() => setSimulatedError(false)}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No live events detected in this category.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="py-2.5 px-2 hover:bg-slate-50/80 rounded-lg transition-colors flex items-start gap-3 text-xs"
            >
              <div className="mt-0.5 p-1 rounded-md bg-slate-100 border border-slate-200 shrink-0">
                {getEventIcon(evt.category, evt.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 truncate">{evt.title}</span>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {formatDate(evt.timestamp)}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">
                  {evt.description}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="font-medium text-slate-500">{evt.source}</span>
                  {evt.incidentId && (
                    <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                      {evt.incidentId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-slate-50/60 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          WebSocket Connected
        </span>
        <button
          onClick={toggleLiveStreamPause}
          className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
        >
          {isLiveStreamPaused ? 'Resume Feed' : 'Pause Feed'}
        </button>
      </div>
    </div>
  );
};
