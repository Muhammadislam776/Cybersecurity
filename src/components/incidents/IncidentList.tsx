import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Flame, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { IncidentCreateModal } from './IncidentCreateModal';
import { SeverityLevel, IncidentStatus } from '../../types';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export const IncidentList: React.FC = () => {
  const { incidents, navigateToIncident, checkPermission } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'mtta'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const canManageIncidents = checkPermission('manage_incidents');

  // Filter logic
  const filtered = incidents.filter(inc => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.affectedService.toLowerCase().includes(q) ||
        inc.incidentCommander.toLowerCase().includes(q) ||
        inc.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (severityFilter !== 'All' && inc.severity !== severityFilter) return false;
    if (statusFilter !== 'All' && inc.status !== statusFilter) return false;

    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') {
      const timeA = new Date(a.createdTime).getTime();
      const timeB = new Date(b.createdTime).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    }
    if (sortBy === 'severity') {
      const weight = { Critical: 4, High: 3, Medium: 2, Low: 1, Informational: 0 };
      const wA = weight[a.severity] || 0;
      const wB = weight[b.severity] || 0;
      return sortOrder === 'desc' ? wB - wA : wA - wB;
    }
    if (sortBy === 'mtta') {
      return sortOrder === 'desc' ? b.mttaMinutes - a.mttaMinutes : a.mttaMinutes - b.mttaMinutes;
    }
    return 0;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & Visual CSIRT Operations Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-5">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 shadow">
            <img
              src="/images/incident_command_warroom.jpg"
              alt="CSIRT Incident Response War Room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-red-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-red-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span>CSIRT WAR ROOM ACTIVE</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>LEAD: COMMANDER</span>
              <span className="text-emerald-400 font-bold">LIVE ESCALATION</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Incident Command Operations</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {incidents.length} TOTAL INCIDENTS
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Track lifecycle stages from initial triage to post-incident review. Prioritize critical threats, review AI blast-radius estimates, and coordinate cross-functional mitigation responders.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Critical Severities</span>
                <span className="text-sm font-bold text-red-400">{incidents.filter(i => i.severity === 'Critical').length} Active</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">High Severities</span>
                <span className="text-sm font-bold text-orange-400">{incidents.filter(i => i.severity === 'High').length} Active</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Mean MTTA</span>
                <span className="text-sm font-bold text-emerald-400">2.4m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Active Incident Records</h3>
          <p className="text-xs text-slate-500">Filter and inspect individual security incidents.</p>
        </div>

        <div className="flex items-center gap-3">
          {canManageIncidents ? (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Declare Incident</span>
            </button>
          ) : (
            <div title="Role lacks 'manage_incidents' permission">
              <button
                disabled
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed border border-slate-200"
              >
                <Plus className="w-4 h-4" />
                <span>Declare Incident (Restricted)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, affected service, commander, tag..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Severity Filter */}
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
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Investigating">Investigating</option>
              <option value="Mitigating">Mitigating</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="date">Date Created</option>
              <option value="severity">Severity Rank</option>
              <option value="mtta">MTTA Speed</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Filters:</span>
          <button
            onClick={() => { setSeverityFilter('Critical'); setStatusFilter('All'); }}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer ${
              severityFilter === 'Critical' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            Critical Only
          </button>
          <button
            onClick={() => { setStatusFilter('Investigating'); setSeverityFilter('All'); }}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer ${
              statusFilter === 'Investigating' ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            Active Investigations
          </button>
          <button
            onClick={() => { setStatusFilter('Mitigating'); setSeverityFilter('All'); }}
            className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer ${
              statusFilter === 'Mitigating' ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
            }`}
          >
            Mitigating
          </button>
          {(severityFilter !== 'All' || statusFilter !== 'All' || search) && (
            <button
              onClick={() => { setSeverityFilter('All'); setStatusFilter('All'); setSearch(''); }}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2 cursor-pointer font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title & Blast Radius</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Affected Service</th>
                <th className="py-3 px-4">Commander</th>
                <th className="py-3 px-4">MTTA</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No incidents matching current criteria.
                  </td>
                </tr>
              ) : (
                sorted.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => navigateToIncident(inc.id, 'overview')}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {inc.id}
                    </td>
                    <td className="py-3.5 px-4 min-w-[280px]">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {inc.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {inc.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="severity" severity={inc.severity} size="sm">
                        {inc.severity}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="status" status={inc.status} size="sm">
                        {inc.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                      {inc.affectedService}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                      {inc.incidentCommander}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono whitespace-nowrap">
                      {inc.mttaMinutes}m
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {formatRelativeTime(inc.createdTime)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        <span>Investigate</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {sorted.length} of {incidents.length} security incidents</span>
          <span className="font-mono text-[11px]">Audit Chain Genesis Verified</span>
        </div>
      </div>

      <IncidentCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
