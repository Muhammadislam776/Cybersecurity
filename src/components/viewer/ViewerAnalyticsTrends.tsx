import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  CheckCircle2, 
  Flame, 
  Activity, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewerAnalyticsTrends: React.FC = () => {
  const { incidents, alerts } = useApp();

  // Severity counts
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
  const highCount = incidents.filter(i => i.severity === 'High').length;
  const mediumCount = incidents.filter(i => i.severity === 'Medium').length;
  const lowCount = incidents.filter(i => i.severity === 'Low' || i.severity === 'Informational').length;
  const totalIncidents = incidents.length || 1;

  // Status counts
  const newCount = incidents.filter(i => i.status === 'New').length;
  const investigatingCount = incidents.filter(i => i.status === 'Investigating').length;
  const mitigatingCount = incidents.filter(i => i.status === 'Mitigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  // Alerts by service breakdown
  const serviceAlertMap: Record<string, number> = {};
  alerts.forEach(a => {
    serviceAlertMap[a.affectedService] = (serviceAlertMap[a.affectedService] || 0) + 1;
  });
  const serviceAlertEntries = Object.entries(serviceAlertMap).slice(0, 4);

  // Time trend data (simulated 24-hour buckets)
  const hourlyTrend = [
    { hour: '00:00', count: 1 },
    { hour: '04:00', count: 0 },
    { hour: '08:00', count: 3 },
    { hour: '12:00', count: 5 },
    { hour: '16:00', count: 4 },
    { hour: '20:00', count: 2 },
  ];
  const maxTrend = Math.max(...hourlyTrend.map(t => t.count), 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Incidents Over Time & Resolution Trend */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800">Incidents Over Time (24h)</h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Hourly Volume</span>
        </div>

        {/* Minimal Bar Chart */}
        <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
          {hourlyTrend.map((bucket, idx) => {
            const heightPercent = Math.round((bucket.count / maxTrend) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bucket.count}
                </span>
                <div 
                  className="w-full bg-blue-100 group-hover:bg-blue-600 rounded-t transition-all duration-300 relative"
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                />
                <span className="text-[9px] font-mono text-slate-400">{bucket.hour}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Peak: 12:00 (5 incidents)</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 82% Resolved &lt;1h
          </span>
        </div>
      </div>

      {/* 2. Severity Distribution */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-orange-600" />
            <h4 className="text-xs font-bold text-slate-800">Severity Distribution</h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Total: {incidents.length}</span>
        </div>

        {/* Segmented Bar */}
        <div className="space-y-2.5 pt-2">
          <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
            <div style={{ width: `${(criticalCount / totalIncidents) * 100}%` }} className="bg-red-500" title={`Critical: ${criticalCount}`} />
            <div style={{ width: `${(highCount / totalIncidents) * 100}%` }} className="bg-orange-500" title={`High: ${highCount}`} />
            <div style={{ width: `${(mediumCount / totalIncidents) * 100}%` }} className="bg-amber-400" title={`Medium: ${mediumCount}`} />
            <div style={{ width: `${(lowCount / totalIncidents) * 100}%` }} className="bg-blue-400" title={`Low: ${lowCount}`} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Critical
              </span>
              <span className="font-bold text-slate-800 font-mono">{criticalCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                High
              </span>
              <span className="font-bold text-slate-800 font-mono">{highCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Medium
              </span>
              <span className="font-bold text-slate-800 font-mono">{mediumCount}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Low/Info
              </span>
              <span className="font-bold text-slate-800 font-mono">{lowCount}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
          <span>Current Risk Posture:</span>
          <span className="font-semibold text-orange-600">Elevated (Active P1s)</span>
        </div>
      </div>

      {/* 3. Alerts by Service & Status */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800">Alerts by Service</h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{alerts.length} Ingested</span>
        </div>

        <div className="space-y-2 pt-1 text-xs">
          {serviceAlertEntries.map(([svcName, count]) => {
            const percent = Math.round((count / (alerts.length || 1)) * 100);
            return (
              <div key={svcName} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">{svcName}</span>
                  <span className="font-mono text-slate-500">{count} alerts ({percent}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Active Investigation:</span>
          <span className="font-semibold text-slate-700">{investigatingCount} Incidents</span>
        </div>
      </div>
    </div>
  );
};
