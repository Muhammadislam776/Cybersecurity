import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Sparkles, 
  Terminal, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Clock, 
  Server, 
  Tag, 
  AlertCircle,
  Eye,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Incident, SeverityLevel, IncidentStatus } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface AnalystIncidentQueueProps {
  onInspectIncident: (incident: Incident) => void;
  onTriageWithAi: (incident: Incident) => void;
  onQueueDiagnostic: (incident: Incident) => void;
}

export const AnalystIncidentQueue: React.FC<AnalystIncidentQueueProps> = ({
  onInspectIncident,
  onTriageWithAi,
  onQueueDiagnostic,
}) => {
  const { incidents, alerts, evidence, updateIncident, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');

  const filteredIncidents = incidents.filter(incident => {
    // Status filter
    if (statusFilter === 'active' && (incident.status === 'Resolved' || incident.status === 'Closed')) {
      return false;
    }
    if (statusFilter !== 'all' && statusFilter !== 'active' && incident.status !== statusFilter) {
      return false;
    }

    // Severity filter
    if (severityFilter !== 'all' && incident.severity !== severityFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = incident.id.toLowerCase().includes(q);
      const matchTitle = incident.title.toLowerCase().includes(q);
      const matchService = incident.affectedService.toLowerCase().includes(q);
      const matchTags = incident.tags.some(t => t.toLowerCase().includes(q));
      return matchId || matchTitle || matchService || matchTags;
    }

    return true;
  });

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

  const getStatusBadgeClass = (status: IncidentStatus) => {
    switch (status) {
      case 'New':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'Investigating':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Mitigating':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleQuickStatusChange = (e: React.MouseEvent, incidentId: string, newStatus: IncidentStatus) => {
    e.stopPropagation();
    updateIncident(incidentId, { status: newStatus });
    addToast('success', 'Incident Updated', `Incident ${incidentId} marked as ${newStatus}.`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Priority Incident Investigation Queue</span>
              <span className="px-2 py-0.5 text-xs font-mono bg-blue-100 text-blue-800 rounded-full font-semibold">
                {filteredIncidents.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlated threats requiring active analyst triage, forensic validation, and safe diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Queue Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="active">Active Only</option>
              <option value="all">All Incidents</option>
              <option value="New">New</option>
              <option value="Investigating">Investigating</option>
              <option value="Mitigating">Mitigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, title, microservice, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all shrink-0 cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sev === 'all' ? 'All Severities' : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="divide-y divide-slate-100">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No Incidents Found</h3>
            <p className="text-xs text-slate-400 mt-1">Adjust search terms or clear active filters.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const relatedAlertsCount = incident.relatedAlertIds?.length || 0;
            const incidentEvidenceCount = evidence.filter(e => e.incidentId === incident.id).length;

            return (
              <div
                key={incident.id}
                onClick={() => onInspectIncident(incident)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: ID, Title, Badges */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {incident.id}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadgeClass(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getStatusBadgeClass(incident.status)}`}>
                        {incident.status}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatRelativeTime(incident.createdTime)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {incident.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {incident.description}
                    </p>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-mono">
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        <Server className="w-3 h-3 text-slate-500" />
                        <span>{incident.affectedService}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">ALERTS:</span>
                        <span className="font-semibold text-slate-800">{relatedAlertsCount}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">EVIDENCE:</span>
                        <span className="font-semibold text-slate-800">{incidentEvidenceCount}</span>
                      </div>

                      {incident.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Fast Analyst Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onTriageWithAi(incident)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer"
                      title="Run AI Threat Analysis & Correlator"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI Triage</span>
                    </button>

                    <button
                      onClick={() => onQueueDiagnostic(incident)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
                      title="Queue Safe Read-Only Diagnostic"
                    >
                      <Terminal className="w-3.5 h-3.5 text-slate-600" />
                      <span>Diagnostic</span>
                    </button>

                    {incident.status === 'New' && (
                      <button
                        onClick={(e) => handleQuickStatusChange(e, incident.id, 'Investigating')}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        Start Triage
                      </button>
                    )}

                    <button
                      onClick={() => onInspectIncident(incident)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Open Forensic Inspector"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
