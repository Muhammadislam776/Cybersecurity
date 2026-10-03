import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  Bell, 
  Server, 
  CheckCircle2, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewerKpiGrid: React.FC = () => {
  const { incidents, alerts } = useApp();

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');
  const criticalIncidents = activeIncidents.filter(i => i.severity === 'Critical');
  const activeAlerts = alerts.filter(a => a.status === 'New' || a.status === 'Triaged');
  
  // Set of unique affected services across active incidents & alerts
  const affectedServices = new Set([
    ...activeIncidents.map(i => i.affectedService),
    ...activeAlerts.map(a => a.affectedService)
  ]);

  const resolvedToday = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  const kpis = [
    {
      id: 'active-incidents',
      title: 'Active Incidents',
      value: activeIncidents.length < 10 ? `0${activeIncidents.length}` : `${activeIncidents.length}`,
      trend: '+2 from yesterday',
      trendType: 'neutral',
      subtitle: `${activeIncidents.filter(i => i.status === 'Investigating').length} currently investigating`,
      icon: Flame,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'critical-incidents',
      title: 'Critical Incidents',
      value: criticalIncidents.length < 10 ? `0${criticalIncidents.length}` : `${criticalIncidents.length}`,
      trend: 'Requires immediate attention',
      trendType: 'negative',
      subtitle: criticalIncidents.length > 0 ? 'P1 high priority mitigation active' : 'Zero unmitigated criticals',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-100',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'active-alerts',
      title: 'Active Alerts',
      value: activeAlerts.length < 10 ? `0${activeAlerts.length}` : `${activeAlerts.length}`,
      trend: `${alerts.filter(a => a.severity === 'Critical').length} critical tier alerts`,
      trendType: 'neutral',
      subtitle: 'From 6 telemetry ingestion sources',
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-100',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'affected-services',
      title: 'Affected Services',
      value: affectedServices.size < 10 ? `0${affectedServices.size}` : `${affectedServices.size}`,
      trend: '2 Degraded, 0 Outages',
      trendType: 'warning',
      subtitle: 'Payment API & Database cluster',
      icon: Server,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'resolved-today',
      title: 'Resolved Today',
      value: resolvedToday < 10 ? `0${resolvedToday}` : `${resolvedToday}`,
      trend: '+4 closed in 24h',
      trendType: 'positive',
      subtitle: 'Average MTTR: 38 minutes',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'system-availability',
      title: 'System Availability',
      value: '99.94%',
      trend: 'Within 99.9% SLA target',
      trendType: 'positive',
      subtitle: 'Rolling 30-day uptime audit',
      icon: Activity,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50 border-sky-100',
      badgeColor: 'bg-sky-100 text-sky-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate" title={kpi.title}>
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${kpi.bgColor} transition-transform group-hover:scale-105`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>

              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                  {kpi.value}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100/90 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                {kpi.trendType === 'positive' && <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                {kpi.trendType === 'negative' && <ArrowUpRight className="w-3.5 h-3.5 text-red-600 shrink-0" />}
                {kpi.trendType === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                <span className="truncate">{kpi.trend}</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate" title={kpi.subtitle}>
                {kpi.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
