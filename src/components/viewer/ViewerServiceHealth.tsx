import React from 'react';
import { 
  Server, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  ExternalLink,
  Clock,
  Zap,
  Activity
} from 'lucide-react';

export type ServiceOperationalStatus = 'Operational' | 'Degraded' | 'Major Incident' | 'Maintenance';

export interface MonitoredService {
  id: string;
  name: string;
  category: string;
  status: ServiceOperationalStatus;
  uptime: string;
  responseTimeMs: number;
  activeAlertsCount: number;
  lastIncident: string;
  region: string;
}

export const MONITORED_SERVICES: MonitoredService[] = [
  {
    id: 'svc-api',
    name: 'API Gateway',
    category: 'Ingress & Routing',
    status: 'Operational',
    uptime: '99.99%',
    responseTimeMs: 24,
    activeAlertsCount: 0,
    lastIncident: '14 days ago',
    region: 'us-east-1'
  },
  {
    id: 'svc-auth',
    name: 'Authentication',
    category: 'Identity Provider (Okta/SSO)',
    status: 'Operational',
    uptime: '99.95%',
    responseTimeMs: 65,
    activeAlertsCount: 0,
    lastIncident: '4 days ago',
    region: 'global'
  },
  {
    id: 'svc-db',
    name: 'Database Cluster',
    category: 'PostgreSQL Primary / Replicas',
    status: 'Degraded',
    uptime: '99.70%',
    responseTimeMs: 210,
    activeAlertsCount: 2,
    lastIncident: 'Active (INC-1044)',
    region: 'us-east-1'
  },
  {
    id: 'svc-notify',
    name: 'Notification Service',
    category: 'Pub/Sub & Dispatch',
    status: 'Operational',
    uptime: '99.98%',
    responseTimeMs: 42,
    activeAlertsCount: 0,
    lastIncident: '21 days ago',
    region: 'us-east-1'
  },
  {
    id: 'svc-storage',
    name: 'Storage (S3 / Blob)',
    category: 'Encrypted Object Storage',
    status: 'Operational',
    uptime: '100.0%',
    responseTimeMs: 18,
    activeAlertsCount: 0,
    lastIncident: 'None in 90 days',
    region: 'us-east-1 / us-west-2'
  },
  {
    id: 'svc-monitoring',
    name: 'Monitoring & Telemetry',
    category: 'Prometheus / Datadog / OpenTelemetry',
    status: 'Operational',
    uptime: '99.99%',
    responseTimeMs: 12,
    activeAlertsCount: 0,
    lastIncident: '30 days ago',
    region: 'multi-region'
  }
];

interface ViewerServiceHealthProps {
  onViewAllServices?: () => void;
}

export const ViewerServiceHealth: React.FC<ViewerServiceHealthProps> = ({ onViewAllServices }) => {
  const getStatusBadge = (status: ServiceOperationalStatus) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Degraded
          </span>
        );
      case 'Major Incident':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            Major Incident
          </span>
        );
      case 'Maintenance':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Maintenance
          </span>
        );
    }
  };

  const operationalCount = MONITORED_SERVICES.filter(s => s.status === 'Operational').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Live System Status
              <span className="text-[11px] font-medium text-slate-500">
                ({operationalCount}/{MONITORED_SERVICES.length} Operational)
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Real-time health telemetry across monitored core infrastructure</p>
          </div>
        </div>

        {onViewAllServices && (
          <button
            onClick={onViewAllServices}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Services</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of services */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {MONITORED_SERVICES.map((service) => {
          const isDegraded = service.status === 'Degraded';
          const isMajor = service.status === 'Major Incident';

          return (
            <div
              key={service.id}
              className={`p-3.5 rounded-xl border transition-all duration-150 ${
                isMajor 
                  ? 'bg-red-50/40 border-red-200' 
                  : isDegraded 
                  ? 'bg-orange-50/40 border-orange-200' 
                  : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{service.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{service.category}</p>
                </div>
                {getStatusBadge(service.status)}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/60 text-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-medium block">Uptime</span>
                  <span className="text-[11px] font-bold text-slate-700 font-mono">{service.uptime}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-medium block">Latency</span>
                  <span className={`text-[11px] font-bold font-mono ${
                    service.responseTimeMs > 150 ? 'text-orange-600' : 'text-slate-700'
                  }`}>
                    {service.responseTimeMs}ms
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-medium block">Active Alerts</span>
                  <span className={`text-[11px] font-bold font-mono ${
                    service.activeAlertsCount > 0 ? 'text-red-600' : 'text-slate-700'
                  }`}>
                    {service.activeAlertsCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-2.5 bg-slate-50/60 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Last telemetry heartbeat synced 4 seconds ago
        </span>
        <span className="text-slate-400 font-mono">Observer Mode (Read-Only)</span>
      </div>
    </div>
  );
};
