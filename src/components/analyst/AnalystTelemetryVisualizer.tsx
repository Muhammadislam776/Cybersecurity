import React, { useState } from 'react';
import { 
  Activity, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalystTelemetryVisualizer: React.FC = () => {
  const { incidents, alerts } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d'>('24h');

  // MITRE ATT&CK Matrix mapping
  const mitreTactics = [
    { code: 'TA0001', name: 'Initial Access', count: 6, percentage: 85, color: 'bg-red-500' },
    { code: 'TA0002', name: 'Execution', count: 4, percentage: 60, color: 'bg-orange-500' },
    { code: 'TA0003', name: 'Persistence', count: 5, percentage: 70, color: 'bg-amber-500' },
    { code: 'TA0004', name: 'Privilege Escalation', count: 3, percentage: 45, color: 'bg-purple-500' },
    { code: 'TA0005', name: 'Defense Evasion', count: 5, percentage: 70, color: 'bg-indigo-500' },
    { code: 'TA0006', name: 'Credential Access', count: 7, percentage: 95, color: 'bg-red-600' },
    { code: 'TA0010', name: 'Exfiltration', count: 2, percentage: 30, color: 'bg-rose-500' },
  ];

  // 24h Hourly telemetry ingestion points
  const telemetryData = [
    { time: '00:00', eps: 8400, alerts: 1, anomaly: false },
    { time: '02:00', eps: 7900, alerts: 0, anomaly: false },
    { time: '04:00', eps: 18400, alerts: 12, anomaly: true, anomalyLabel: 'DDoS Burst (WAF)' },
    { time: '06:00', eps: 9200, alerts: 2, anomaly: false },
    { time: '08:00', eps: 16800, alerts: 8, anomaly: true, anomalyLabel: 'Credential Stuffing Wave' },
    { time: '10:00', eps: 13500, alerts: 4, anomaly: false },
    { time: '12:00', eps: 14200, alerts: 3, anomaly: false },
    { time: '14:00', eps: 21000, alerts: 14, anomaly: true, anomalyLabel: 'API Anomaly (INC-2026-0891)' },
    { time: '16:00', eps: 15400, alerts: 5, anomaly: false },
    { time: '18:00', eps: 12100, alerts: 2, anomaly: false },
    { time: '20:00', eps: 10400, alerts: 1, anomaly: false },
    { time: '22:00', eps: 9800, alerts: 2, anomaly: false },
  ];

  const maxEps = Math.max(...telemetryData.map(d => d.eps));

  return (
    <div className="space-y-5">
      {/* Global Satellite Threat Radar Visual Card */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md p-4 overflow-hidden relative group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-7 relative rounded-lg overflow-hidden border border-slate-800 shadow-lg">
            <div className="aspect-[16/9] relative">
              <img
                src="/images/global_threat_radar.jpg"
                alt="Active Satellite Cyber Threat Radar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Holographic Radar Badges */}
              <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded-md px-2 py-0.5 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>ORBITAL RADAR: 148 SATELLITES LOCKED</span>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-md">
                <span className="text-slate-400">ACTIVE GLOBAL ATTACK VECTORS: <strong className="text-amber-400">14,832</strong></span>
                <span className="text-emerald-400 font-bold">TELEMETRY: STABLE</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 text-[11px]">GLOBAL SURVEILLANCE FEED</span>
              <span className="text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 rounded">
                60 FPS STREAM
              </span>
            </div>

            <h4 className="text-white font-bold text-sm">
              Worldwide Attack Surface Telemetry
            </h4>

            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Autonomous orbital satellite telemetry cross-references ingress requests with global threat nodes in NYC, Frankfurt, Singapore, and Tokyo.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Monitored Autonomous Systems</span>
                <span className="text-base font-bold text-slate-100">8,420 ASNs</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Correlated Threat Feeds</span>
                <span className="text-base font-bold text-blue-400">42 Feeds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Telemetry Volume & Anomaly Chart + MITRE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 24-Hour Telemetry Volume & Anomaly Chart */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>24-Hour Ingestion Curve & Threat Spikes</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated Events Per Second (EPS) with correlated security anomaly markers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Normal EPS
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Anomaly Spike
            </span>
          </div>
        </div>

        {/* Bar / Column Chart */}
        <div className="h-48 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-slate-200">
          {telemetryData.map((d, idx) => {
            const heightPercent = Math.round((d.eps / maxEps) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 z-20 pointer-events-none bg-slate-900 text-white text-[10px] font-mono rounded px-2 py-1 shadow-lg whitespace-nowrap">
                  <div>Time: {d.time} UTC</div>
                  <div>EPS: {d.eps.toLocaleString()}</div>
                  <div>Alerts: {d.alerts}</div>
                  {d.anomalyLabel && (
                    <div className="text-red-300 font-bold mt-0.5">{d.anomalyLabel}</div>
                  )}
                </div>

                {d.anomaly && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute top-0" />
                )}

                <div 
                  className={`w-full rounded-t transition-all duration-300 ${
                    d.anomaly ? 'bg-red-500 group-hover:bg-red-600' : 'bg-blue-600 group-hover:bg-blue-700'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
          {telemetryData.map((d, idx) => (
            <span key={idx} className="truncate">{d.time}</span>
          ))}
        </div>
      </div>

      {/* MITRE ATT&CK Tactics Alignment */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>MITRE ATT&CK Mapping</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
              v14.1
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Observed attacker tactics identified across active incidents and alert payloads.
          </p>

          <div className="space-y-2.5">
            {mitreTactics.map((tactic) => (
              <div key={tactic.code} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">{tactic.code}</span>
                    <span className="font-semibold text-slate-800">{tactic.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{tactic.count} events</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${tactic.color}`}
                    style={{ width: `${tactic.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Top Vector: <strong className="text-red-600">Credential Access</strong></span>
          <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Full Matrix &rarr;</span>
        </div>
      </div>
    </div>
  </div>
  );
};
