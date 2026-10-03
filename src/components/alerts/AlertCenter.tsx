import React, { useState } from 'react';
import { 
  BellRing, 
  Search, 
  Filter, 
  Flame, 
  ExternalLink, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { RedactedText } from '../common/RedactedText';
import { Modal } from '../common/Modal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { IncidentAlert, SeverityLevel, AlertStatus } from '../../types';

export const AlertCenter: React.FC = () => {
  const { 
    alerts, 
    updateAlertStatus, 
    createIncident, 
    navigateToIncident, 
    checkPermission,
    incidents
  } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  // Payload Modal
  const [inspectAlert, setInspectAlert] = useState<IncidentAlert | null>(null);

  const canManageIncidents = checkPermission('manage_incidents');

  // Distinct sources
  const sources = Array.from(new Set(alerts.map(a => a.source)));

  const filtered = alerts.filter(a => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.affectedService.toLowerCase().includes(q) ||
        a.detectionType.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (sourceFilter !== 'All' && a.source !== sourceFilter) return false;

    return true;
  });

  const handleEscalate = (alert: IncidentAlert) => {
    if (!canManageIncidents) return;
    const newInc = createIncident({
      title: `Escalated Alert: ${alert.title}`,
      description: `Origin alert ${alert.id} (${alert.detectionType}) from source ${alert.source} against service ${alert.affectedService}.`,
      severity: alert.severity,
      affectedService: alert.affectedService,
      relatedAlertIds: [alert.id],
      tags: ['Escalated-Alert', alert.source.split(' ')[0]]
    });
    updateAlertStatus(alert.id, 'Escalated');
    navigateToIncident(newInc.id, 'overview');
  };

  return (
    <div className="space-y-5">
      {/* Visual Telemetry Stream Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-5">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 shadow">
            <img
              src="/images/global_threat_radar.jpg"
              alt="Global Threat Telemetry Ingestion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>ORBITAL SENSORS: ONLINE</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>STREAM: 14,832 EPS</span>
              <span className="text-emerald-400 font-bold">LATENCY: 8MS</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2 text-white">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Alert Operations &amp; Sensor Ingestion</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {alerts.length} TOTAL INGESTED
              </span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Unified telemetry stream aggregating AWS GuardDuty, CrowdStrike Falcon EDR, Cloudflare WAF, and Okta Identity logs. Triage raw anomalies, escalate to incidents, or suppress verified false positives.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Critical Alerts</span>
                <span className="text-sm font-bold text-red-400">{alerts.filter(a => a.severity === 'Critical').length} Active</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Untriaged Queue</span>
                <span className="text-sm font-bold text-amber-400">{alerts.filter(a => a.status === 'New').length} New</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Triage SLA</span>
                <span className="text-sm font-bold text-emerald-400">&lt; 15 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Live Ingestion Queue</h3>
          <p className="text-xs text-slate-500">Filter by severity, status, or detection source.</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="live">TELEMETRY INGEST ACTIVE</Badge>
          <SecurityBadge type="rbac_enforced" size="sm" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert ID, detection type, source, or service..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Informational">Informational</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Triaged">Triaged</option>
              <option value="Escalated">Escalated</option>
              <option value="Suppressed">Suppressed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Sources</option>
              {sources.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Alert Title</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source System</th>
                <th className="py-3 px-4">Affected Service</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {alt.id}
                  </td>
                  <td className="py-3.5 px-4 min-w-[280px]">
                    <div className="font-semibold text-slate-900">{alt.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{alt.detectionType}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant="severity" severity={alt.severity} size="sm">
                      {alt.severity}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      alt.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      alt.status === 'Escalated' ? 'bg-red-50 text-red-700 border-red-200' :
                      alt.status === 'Triaged' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {alt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                    {alt.source}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-700">
                    {alt.affectedService}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {formatRelativeTime(alt.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectAlert(alt)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Inspect Telemetry Payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {alt.relatedIncidentId ? (
                        <button
                          onClick={() => navigateToIncident(alt.relatedIncidentId!, 'alerts')}
                          className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          View Incident
                        </button>
                      ) : (
                        canManageIncidents && (
                          <button
                            onClick={() => handleEscalate(alt)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Flame className="w-3 h-3" />
                            <span>Escalate</span>
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Raw Telemetry Payload Modal with Secret Redaction */}
      {inspectAlert && (
        <Modal
          isOpen={Boolean(inspectAlert)}
          onClose={() => setInspectAlert(null)}
          title={`Alert Telemetry: ${inspectAlert.id}`}
          subtitle={`${inspectAlert.title} (${inspectAlert.source})`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="severity" severity={inspectAlert.severity}>
                  {inspectAlert.severity}
                </Badge>
                <span className="font-semibold text-slate-700">{inspectAlert.detectionType}</span>
              </div>
              <span className="text-slate-400 font-mono">{formatDate(inspectAlert.timestamp)}</span>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-800 mb-1">
                Raw Correlated Payload (Protected by Redaction Engine):
              </span>
              <RedactedText content={JSON.stringify(inspectAlert.rawPayload, null, 2)} />
            </div>

            {/* Audit History for Alert */}
            <div>
              <span className="block text-xs font-bold text-slate-800 mb-1">
                Alert Triage & Ingest Trail:
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                {inspectAlert.history.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-600">
                    <span>{h.action} (Actor: <strong>{h.actor}</strong>)</span>
                    <span className="font-mono text-slate-400 text-[11px]">{formatRelativeTime(h.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {inspectAlert.status === 'New' && (
                <button
                  onClick={() => {
                    updateAlertStatus(inspectAlert.id, 'Triaged');
                    setInspectAlert(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Mark as Triaged
                </button>
              )}
              {canManageIncidents && !inspectAlert.relatedIncidentId && (
                <button
                  onClick={() => {
                    handleEscalate(inspectAlert);
                    setInspectAlert(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Escalate to Active Incident</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
