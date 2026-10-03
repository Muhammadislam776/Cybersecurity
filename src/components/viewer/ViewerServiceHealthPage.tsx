import React from 'react';
import { 
  Server, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  ShieldCheck, 
  Cpu, 
  Globe 
} from 'lucide-react';
import { MONITORED_SERVICES, MonitoredService, ServiceOperationalStatus } from './ViewerServiceHealth';

export const ViewerServiceHealthPage: React.FC = () => {
  const getStatusBadge = (status: ServiceOperationalStatus) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Degraded Performance
          </span>
        );
      case 'Major Incident':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Major Outage
          </span>
        );
      case 'Maintenance':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Scheduled Maintenance
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Core Infrastructure Service Health
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous health probes, latency histograms, and uptime tracking across primary production services
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600 font-medium">Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-600 font-medium">Outage</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MONITORED_SERVICES.map((service) => {
          const isDegraded = service.status === 'Degraded';
          const isMajor = service.status === 'Major Incident';

          return (
            <div
              key={service.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs hover:shadow-md transition-all space-y-4 ${
                isMajor ? 'border-red-300' : isDegraded ? 'border-orange-300' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{service.name}</h3>
                  <p className="text-xs text-slate-400">{service.category}</p>
                </div>
                {getStatusBadge(service.status)}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">30-Day SLA Uptime</span>
                  <span className="text-sm font-bold font-mono text-slate-800">{service.uptime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Response Latency</span>
                  <span className={`text-sm font-bold font-mono ${
                    service.responseTimeMs > 150 ? 'text-orange-600' : 'text-slate-800'
                  }`}>
                    {service.responseTimeMs}ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Active Alerts</span>
                  <span className={`text-sm font-bold font-mono ${
                    service.activeAlertsCount > 0 ? 'text-red-600' : 'text-emerald-700'
                  }`}>
                    {service.activeAlertsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Region</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono">{service.region}</span>
                </div>
              </div>

              {/* 24-Hour Simulated Bar Uptime History */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Past 24 Hours Availability</span>
                  <span>100% checks</span>
                </div>
                <div className="flex gap-1 h-3">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const degradedBlock = (isDegraded && idx >= 20) || (isMajor && idx >= 18);
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-2xs ${
                          degradedBlock 
                            ? isMajor ? 'bg-red-500' : 'bg-orange-400' 
                            : 'bg-emerald-400'
                        }`}
                        title={`Hour ${idx}:00 - ${degradedBlock ? 'Degraded latency' : 'Operational'}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Last recorded incident:</span>
                <span className="font-medium text-slate-600">{service.lastIncident}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
