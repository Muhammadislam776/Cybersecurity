import React from 'react';
import { 
  ShieldAlert, 
  BellRing, 
  Clock, 
  Sparkles, 
  Terminal, 
  FileSearch, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Cpu, 
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AnalystKpiHudProps {
  onFilterSeverity?: (severity: string | null) => void;
  selectedSeverity?: string | null;
}

export const AnalystKpiHud: React.FC<AnalystKpiHudProps> = ({
  onFilterSeverity,
  selectedSeverity,
}) => {
  const { incidents, alerts, tasks, approvals, diagnostics, evidence } = useApp();

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');
  const criticalIncidents = activeIncidents.filter(i => i.severity === 'Critical');
  const highIncidents = activeIncidents.filter(i => i.severity === 'High');
  const mediumIncidents = activeIncidents.filter(i => i.severity === 'Medium');

  const untriagedAlerts = alerts.filter(a => a.status === 'New');
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const pendingDiagnostics = diagnostics.filter(d => d.status === 'Suggested' || d.status === 'Approval Requested');

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Active Incidents */}
      <div 
        onClick={() => onFilterSeverity && onFilterSeverity(selectedSeverity === 'Critical' ? null : 'Critical')}
        className={`p-4 rounded-xl border transition-all cursor-pointer bg-white relative overflow-hidden group hover:shadow-sm ${
          selectedSeverity === 'Critical' 
            ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">Active Incidents</span>
          <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900">{activeIncidents.length}</span>
          <span className="text-xs font-semibold text-red-600 font-mono">
            {criticalIncidents.length} CRIT
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>{highIncidents.length} High</span>
          <span className="text-slate-300">|</span>
          <span>{mediumIncidents.length} Med</span>
        </div>
      </div>

      {/* 2. Untriaged Alerts */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">Untriaged Alerts</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <BellRing className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900">{untriagedAlerts.length}</span>
          <span className="text-xs font-medium text-slate-500">/ {alerts.length} total</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
          <Clock className="w-3 h-3 text-amber-500 shrink-0" />
          <span>SLA target &lt; 15 min</span>
        </div>
      </div>

      {/* 3. MTTA (Mean Time to Acknowledge) */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">MTTA (Triage)</span>
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900">2.1m</span>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
            <TrendingDown className="w-3 h-3" />
            -22%
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-500">
          SOC benchmark: 5.0m
        </div>
      </div>

      {/* 4. AI Copilot Correlator */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">AI Threat Agent</span>
          <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900">96.8%</span>
          <span className="text-xs font-semibold text-purple-600">CONF</span>
        </div>
        <div className="mt-2.5 text-[11px] text-purple-700 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Active IOC correlation</span>
        </div>
      </div>

      {/* 5. Safe Diagnostics */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">Diagnostics</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Terminal className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900">{pendingDiagnostics.length}</span>
          <span className="text-xs font-medium text-slate-500">queued</span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-500">
          <span>{pendingApprovals.length} need sign-off</span>
        </div>
      </div>

      {/* 6. Forensic Evidence */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">Evidence Vault</span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <FileSearch className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900">{evidence.length}</span>
          <span className="text-xs font-semibold text-emerald-600">SHA-256</span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>Chain of custody locked</span>
        </div>
      </div>
    </div>
  );
};
