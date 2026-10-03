import React, { useState, useMemo } from 'react';
import { 
  BellRing, 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Server, 
  Eye, 
  X,
  TrendingUp,
  SlidersHorizontal,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentAlert, SeverityLevel } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';

export const ViewerAlertMonitor: React.FC = () => {
  const { alerts } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAlert, setSelectedAlert] = useState<IncidentAlert | null>(null);

  // Statistics
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical').length;
  const highAlerts = alerts.filter(a => a.severity === 'High').length;
  const mediumAlerts = alerts.filter(a => a.severity === 'Medium').length;
  const lowAlerts = alerts.filter(a => a.severity === 'Low' || a.severity === 'Informational').length;

  // Unique sources
  const sources = useMemo(() => {
    const s = new Set<string>();
    alerts.forEach(a => s.add(a.source));
    return Array.from(s);
  }, [alerts]);

  // Hourly trend data for alerts
  const alertHourlyBuckets = [
    { time: '02:00', count: 1 },
    { time: '06:00', count: 2 },
    { time: '10:00', count: 6 },
    { time: '14:00', count: 9 },
    { time: '18:00', count: 4 },
    { time: '22:00', count: 3 },
  ];
  const maxAlertCount = Math.max(...alertHourlyBuckets.map(b => b.count), 10);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchSearch = 
        alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.affectedService.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSeverity = severityFilter === 'All' || alert.severity === severityFilter;
      const matchSource = sourceFilter === 'All' || alert.source === sourceFilter;
      const matchStatus = statusFilter === 'All' || alert.status === statusFilter;

      return matchSearch && matchSeverity && matchSource && matchStatus;
    });
  }, [alerts, searchTerm, severityFilter, sourceFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Read-only notification banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Alert Monitoring Clearance:</strong> Real-time alerts are streamed in read-only mode. Triage and acknowledgment controls are restricted to Tier-1/2 Analysts.
          </span>
        </div>
        <span className="font-semibold text-blue-700 font-mono text-[11px]">Stream: Ingesting</span>
      </div>

      {/* 1. Alert Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500">Total Ingested</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">{totalAlerts}</p>
          <span className="text-[10px] text-slate-400">All telemetry sensors</span>
        </div>
        <div className="bg-white rounded-xl border border-red-200 bg-red-50/20 p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-red-700">Critical</span>
          <p className="text-2xl font-black text-red-600 font-mono mt-1">{criticalAlerts}</p>
          <span className="text-[10px] text-red-500">Immediate threat signals</span>
        </div>
        <div className="bg-white rounded-xl border border-orange-200 bg-orange-50/20 p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-orange-700">High</span>
          <p className="text-2xl font-black text-orange-600 font-mono mt-1">{highAlerts}</p>
          <span className="text-[10px] text-orange-500">Elevated impact</span>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 bg-amber-50/20 p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700">Medium</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">{mediumAlerts}</p>
          <span className="text-[10px] text-amber-500">Standard operational</span>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 bg-blue-50/20 p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-blue-700">Low & Info</span>
          <p className="text-2xl font-black text-blue-600 font-mono mt-1">{lowAlerts}</p>
          <span className="text-[10px] text-blue-500">Informational baseline</span>
        </div>
      </div>

      {/* 2. Alert Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <h4 className="text-sm font-bold text-slate-900">Alert Volume Velocity (Past 24 Hours)</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">Aggregation Interval: 4h</span>
        </div>

        <div className="h-36 flex items-end justify-between gap-3 pt-6 px-4">
          {alertHourlyBuckets.map((bucket, idx) => {
            const heightPercent = Math.round((bucket.count / maxAlertCount) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bucket.count} alerts
                </span>
                <div 
                  className="w-full bg-orange-100 group-hover:bg-orange-500 rounded-t transition-all duration-300"
                  style={{ height: `${Math.max(heightPercent, 10)}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400">{bucket.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Filterable Alert Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-orange-600" />
              <span>Telemetry Alert Stream</span>
              <span className="text-xs text-slate-400 font-semibold">({filteredAlerts.length} Active)</span>
            </h3>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search alerts..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="All">All Sources</option>
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Alert ID</th>
                <th className="px-4 py-3">Alert Name</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Source Sensor</th>
                <th className="px-4 py-3">Affected Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No alerts match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-blue-700 group-hover:text-blue-900">
                      {alert.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                      {alert.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="severity" severity={alert.severity} size="sm">
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {alert.source}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Server className="w-3 h-3 text-slate-400" />
                        {alert.affectedService}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="status" status={alert.status} size="sm">
                        {alert.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDate(alert.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(alert);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-Only Alert Inspection Modal */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedAlert(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedAlert.id}
                </span>
                <Badge variant="severity" severity={selectedAlert.severity} size="sm">
                  {selectedAlert.severity}
                </Badge>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{selectedAlert.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Source: {selectedAlert.source} • Service: {selectedAlert.affectedService}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Detection Type:</span>
                <span className="font-semibold text-slate-800">{selectedAlert.detectionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Responder Assigned:</span>
                <span className="font-semibold text-slate-800">{selectedAlert.assignedResponder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <Badge variant="status" status={selectedAlert.status} size="sm">
                  {selectedAlert.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Detected Timestamp:</span>
                <span className="font-mono text-slate-700">{formatDate(selectedAlert.timestamp)}</span>
              </div>
            </div>

            {selectedAlert.rawPayload && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Raw Ingestion Payload (Read-Only)
                </span>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-36">
                  {JSON.stringify(selectedAlert.rawPayload, null, 2)}
                </pre>
              </div>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
              Viewer role does not possess permissions to acknowledge, triage, or suppress alerts.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
