import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  Check, 
  XCircle, 
  Code, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Radio, 
  Server, 
  Clock, 
  User,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentAlert, AlertStatus, SeverityLevel } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

export const AnalystAlertTriageFeed: React.FC = () => {
  const { alerts, updateAlertStatus, addToast, navigateToIncident } = useApp();
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedPayloadAlertId, setExpandedPayloadAlertId] = useState<string | null>(null);

  const sources = Array.from(new Set(alerts.map(a => a.source)));

  const filteredAlerts = alerts.filter(alert => {
    if (sourceFilter !== 'all' && alert.source !== sourceFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (alertId: string, newStatus: AlertStatus) => {
    updateAlertStatus(alertId, newStatus);
    addToast('info', 'Alert Status Updated', `Alert ${alertId} marked as ${newStatus}.`);
  };

  const getSeverityBadgeClass = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="analyst-alerts-section" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-500" />
              <span>Real-Time Alert Triage Stream</span>
              <span className="px-2 py-0.5 text-xs font-mono bg-amber-100 text-amber-800 rounded-full font-semibold">
                {filteredAlerts.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live ingest across SIEM, WAF, EDR, and IAM sensors. Triage and associate with investigations.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New (Untriaged)</option>
              <option value="Triaged">Triaged</option>
              <option value="Escalated">Escalated</option>
              <option value="Suppressed">Suppressed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert Feed Items */}
      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No alerts match current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isPayloadOpen = expandedPayloadAlertId === alert.id;

            return (
              <div key={alert.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {alert.id}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadgeClass(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {alert.source}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(alert.timestamp)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">
                      {alert.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>SERVICE: <span className="text-slate-700 font-medium">{alert.affectedService}</span></span>
                      <span>TYPE: <span className="text-slate-700 font-medium">{alert.detectionType}</span></span>
                      {alert.relatedIncidentId && (
                        <button
                          onClick={() => navigateToIncident(alert.relatedIncidentId!)}
                          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>INCIDENT: {alert.relatedIncidentId}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedPayloadAlertId(isPayloadOpen ? null : alert.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Inspect Raw Telemetry Payload"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Payload</span>
                      {isPayloadOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {alert.status === 'New' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'Triaged')}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Triage</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'Suppressed')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                          title="Suppress as False Positive"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {alert.status !== 'New' && (
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {alert.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Collapsible Payload Inspection */}
                {isPayloadOpen && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-lg text-slate-200 text-xs font-mono border border-slate-800 overflow-x-auto">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
                      <span>RAW SENSOR TELEMETRY PAYLOAD</span>
                      <span className="text-emerald-400">STATUS: VERIFIED</span>
                    </div>
                    <pre className="text-[11px] leading-relaxed text-blue-300">
                      {JSON.stringify(alert.rawPayload || {
                        sensor: alert.source,
                        eventId: alert.id,
                        detectedAt: alert.timestamp,
                        details: alert.detectionType,
                        service: alert.affectedService,
                      }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
