import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Sparkles, 
  Radio, 
  Search, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface AnalystCommandHeaderProps {
  onOpenAiCopilot: () => void;
  onOpenDiagnosticModal: () => void;
  onScrollToIoc: () => void;
  onScrollToAlerts: () => void;
}

export const AnalystCommandHeader: React.FC<AnalystCommandHeaderProps> = ({
  onOpenAiCopilot,
  onOpenDiagnosticModal,
  onScrollToIoc,
  onScrollToAlerts,
}) => {
  const { currentUser } = useAuth();
  const { incidents, alerts, isSimulationActive } = useApp();

  const criticalCount = incidents.filter(
    i => i.severity === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed'
  ).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
      {/* Background cyber grid effect */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Station Identity & Threat Status */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-blue-950 text-blue-400 border border-blue-800 rounded">
              SOC-ALPHA // TIER-2 TRIAGE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-950/80 text-amber-400 border border-amber-800/80 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              DEFCON 2: ELEVATED THREAT
            </span>
            {isSimulationActive && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-purple-950 text-purple-300 border border-purple-800 rounded flex items-center gap-1">
                SIMULATION IN PROGRESS
              </span>
            )}
            <span className="px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              RBAC ENFORCED
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <span>Threat Investigation & Triage Console</span>
          </h1>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Active Security Operations Center workspace. Correlate raw telemetry, analyze multi-source indicators of compromise (IOCs), and execute safe diagnostic investigations with human-in-the-loop validation.
          </p>
        </div>

        {/* Right: Quick Action Station */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer border border-blue-500 hover:border-blue-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Threat Copilot</span>
          </button>

          <button
            onClick={onOpenDiagnosticModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-xs transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Request Diagnostic</span>
          </button>

          <button
            onClick={onScrollToIoc}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>IOC Watchlist</span>
          </button>

          <button
            onClick={onScrollToAlerts}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Triage Feed</span>
          </button>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-500">INGESTION:</span>
            <span className="text-slate-200 font-semibold">14,240 eps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">PIPELINE LATENCY:</span>
            <span className="text-slate-200 font-semibold">8ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">PACKET LOSS:</span>
            <span className="text-emerald-400 font-semibold">0.00%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">ACTIVE CRITICALS:</span>
            <span className={`font-semibold ${criticalCount > 0 ? 'text-red-400' : 'text-slate-200'}`}>
              {criticalCount} active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>OPERATOR:</span>
          <span className="text-blue-300 font-bold">{currentUser?.name || 'Security Analyst'}</span>
          <span className="text-slate-600">|</span>
          <span>SHIFT:</span>
          <span className="text-emerald-300">ACTIVE (08:00 - 16:00 UTC)</span>
        </div>
      </div>
    </div>
  );
};
