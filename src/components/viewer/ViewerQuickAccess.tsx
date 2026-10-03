import React from 'react';
import { 
  Flame, 
  BellRing, 
  Server, 
  Radio, 
  FileText, 
  ChevronRight,
  Compass
} from 'lucide-react';

interface ViewerQuickAccessProps {
  onNavigate: (tabId: string) => void;
}

export const ViewerQuickAccess: React.FC<ViewerQuickAccessProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'incidents',
      label: 'Active Incidents',
      desc: 'Live triage queues & records',
      icon: Flame,
      color: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200/60'
    },
    {
      id: 'alerts',
      label: 'Telemetry Alerts',
      desc: 'Critical security anomaly stream',
      icon: BellRing,
      color: 'text-orange-600',
      iconBg: 'bg-orange-50 border-orange-200/60'
    },
    {
      id: 'services',
      label: 'Service Health',
      desc: 'Uptime SLAs & latency monitors',
      icon: Server,
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200/60'
    },
    {
      id: 'live-events',
      label: 'Live Event Feed',
      desc: 'Streaming real-time telemetry bus',
      icon: Radio,
      color: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-200/60'
    },
    {
      id: 'reports',
      label: 'Compliance Reports',
      desc: 'Post-mortems & daily summaries',
      icon: FileText,
      color: 'text-slate-700',
      iconBg: 'bg-slate-100 border-slate-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quick Navigation Shortcuts
          </h4>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Read-Only Observation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onNavigate(act.id)}
              className="p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50/80 hover:border-slate-300 text-left transition-all group flex flex-col justify-between cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${act.iconBg}`}>
                  <Icon className={`w-3.5 h-3.5 ${act.color}`} />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {act.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
