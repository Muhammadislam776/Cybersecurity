import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Flame, 
  Clock, 
  ArrowUpDown, 
  CheckCircle, 
  ChevronRight,
  ShieldAlert,
  Server,
  Eye,
  SlidersHorizontal,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { Incident, SeverityLevel, IncidentStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface ViewerIncidentTableProps {
  onSelectIncident: (incident: Incident) => void;
  title?: string;
  limit?: number;
  showAllLink?: () => void;
}

export const ViewerIncidentTable: React.FC<ViewerIncidentTableProps> = ({ 
  onSelectIncident,
  title = "Incident Telemetry & Forensic Records",
  limit,
  showAllLink
}) => {
  const { incidents } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'severity'>('created');
  const [quickFilter, setQuickFilter] = useState<'all' | 'active' | 'critical' | 'resolved'>('all');

  // List of unique services for dropdown
  const servicesList = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach(i => set.add(i.affectedService));
    return Array.from(set);
  }, [incidents]);

  // Quick filter counts
  const activeCount = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  const filteredIncidents = useMemo(() => {
    let list = incidents.filter(inc => {
      // Quick filter
      if (quickFilter === 'active' && (inc.status === 'Resolved' || inc.status === 'Closed')) return false;
      if (quickFilter === 'critical' && inc.severity !== 'Critical') return false;
      if (quickFilter === 'resolved' && inc.status !== 'Resolved' && inc.status !== 'Closed') return false;

      // Search match
      const matchesSearch = 
        inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.affectedService.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.incidentCommander.toLowerCase().includes(searchTerm.toLowerCase());

      // Severity match
      const matchesSeverity = selectedSeverity === 'All' || inc.severity === selectedSeverity;

      // Status match
      const matchesStatus = selectedStatus === 'All' || inc.status === selectedStatus;

      // Service match
      const matchesService = selectedService === 'All' || inc.affectedService === selectedService;

      return matchesSearch && matchesSeverity && matchesStatus && matchesService;
    });

    // Sorting
    list = list.sort((a, b) => {
      if (sortBy === 'created') {
        return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime();
      }
      if (sortBy === 'severity') {
        const rank: Record<SeverityLevel, number> = {
          Critical: 5,
          High: 4,
          Medium: 3,
          Low: 2,
          Informational: 1
        };
        return (rank[b.severity] || 0) - (rank[a.severity] || 0);
      }
      return 0;
    });

    if (limit && limit > 0) {
      return list.slice(0, limit);
    }

    return list;
  }, [incidents, quickFilter, searchTerm, selectedSeverity, selectedStatus, selectedService, sortBy, limit]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-600 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
              <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {filteredIncidents.length} Records
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Authorized situational queue for active triage, affected system dependencies, and timeline logs
            </p>
          </div>
        </div>

        {showAllLink && (
          <button
            onClick={showAllLink}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer self-start md:self-auto transition-colors"
          >
            <span>View All Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filter Segmented Pills */}
      <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-200/70 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setQuickFilter('all')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
            quickFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All ({incidents.length})
        </button>
        <button
          onClick={() => setQuickFilter('active')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
            quickFilter === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setQuickFilter('critical')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
            quickFilter === 'critical'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setQuickFilter('resolved')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
            quickFilter === 'resolved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, keyword, commander, service..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        {/* Severity Filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Informational">Informational</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Investigating">Investigating</option>
          <option value="Mitigating">Mitigating</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        {/* Service Filter */}
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        >
          <option value="All">All Services</option>
          {servicesList.map((svc) => (
            <option key={svc} value={svc}>{svc}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
        >
          <option value="created">Sort: Newest First</option>
          <option value="updated">Sort: Last Updated</option>
          <option value="severity">Sort: Highest Severity</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Incident ID</th>
              <th className="px-4 py-3">Incident Title & Scope</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Affected Service</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">No Incidents Found</h4>
                    <p className="text-xs text-slate-500">
                      No active security records match your current filter parameters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors">
                      {incident.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {incident.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>Commander: <strong className="text-slate-600 font-medium">{incident.incidentCommander}</strong></span>
                      {incident.tags && incident.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-mono text-[10px]">#{incident.tags[0]}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant="severity" severity={incident.severity} size="sm">
                      {incident.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant="status" status={incident.status} size="sm">
                      {incident.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      <Server className="w-3 h-3 text-slate-400" />
                      {incident.affectedService}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-mono text-[11px] text-slate-600">
                      {formatDate(incident.createdTime)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Updated: {formatDate(incident.updatedTime)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 rounded-lg border border-slate-200 transition-all">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="px-5 py-2.5 bg-slate-50/60 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
        <span>Displaying {filteredIncidents.length} of {incidents.length} total recorded incidents</span>
        <span className="font-medium text-slate-400 font-mono">RBAC Clearance: Level 1 Read-Only</span>
      </div>
    </div>
  );
};
