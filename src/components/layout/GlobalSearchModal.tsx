import React, { useState, useEffect } from 'react';
import { Search, Flame, BellRing, BookOpen, FileSearch, CheckSquare, X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { 
    globalSearchOpen, 
    setGlobalSearchOpen, 
    incidents, 
    alerts, 
    evidence, 
    tasks, 
    approvedRunbooks,
    navigateToIncident,
    setActivePage 
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedIncidents = q ? incidents.filter(i => 
    i.id.toLowerCase().includes(q) ||
    i.title.toLowerCase().includes(q) ||
    i.affectedService.toLowerCase().includes(q) ||
    i.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4) : [];

  const matchedAlerts = q ? alerts.filter(a => 
    a.id.toLowerCase().includes(q) ||
    a.title.toLowerCase().includes(q) ||
    a.source.toLowerCase().includes(q) ||
    a.affectedService.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedEvidence = q ? evidence.filter(e => 
    e.id.toLowerCase().includes(q) ||
    e.title.toLowerCase().includes(q) ||
    e.source.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedRunbooks = q ? approvedRunbooks.filter(r => 
    r.id.toLowerCase().includes(q) ||
    r.name.toLowerCase().includes(q) ||
    r.category.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedTasks = q ? tasks.filter(t => 
    t.id.toLowerCase().includes(q) ||
    t.title.toLowerCase().includes(q) ||
    t.assignedTo.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const totalResults = matchedIncidents.length + matchedAlerts.length + matchedEvidence.length + matchedRunbooks.length + matchedTasks.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, keyword, service, responder, runbook... (e.g. INC-2026, 504, Postgres)"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!q && (
            <div className="py-8 text-center text-xs text-slate-400">
              Type to search across Incidents, Alerts, Forensic Evidence, Approved Runbooks, and Response Tasks.
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching security entities found for &quot;<span className="font-semibold">{query}</span>&quot;.
            </div>
          )}

          {/* Matched Incidents */}
          {matchedIncidents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Incidents ({matchedIncidents.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedIncidents.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => {
                      navigateToIncident(inc.id, 'overview');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">{inc.id}</span>
                        <Badge variant="severity" severity={inc.severity} size="sm">{inc.severity}</Badge>
                        <Badge variant="status" status={inc.status} size="sm">{inc.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-700 font-medium truncate mt-0.5">{inc.title}</p>
                      <p className="text-[11px] text-slate-400">{inc.affectedService} • Commander: {inc.incidentCommander}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Alerts */}
          {matchedAlerts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-blue-500" />
                <span>Alerts ({matchedAlerts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedAlerts.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => {
                      if (alt.relatedIncidentId) {
                        navigateToIncident(alt.relatedIncidentId, 'alerts');
                      } else {
                        setActivePage('alerts');
                      }
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">{alt.id}</span>
                        <Badge variant="severity" severity={alt.severity} size="sm">{alt.severity}</Badge>
                        <span className="text-[11px] text-slate-500 font-medium">{alt.source}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium truncate mt-0.5">{alt.title}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Runbooks */}
          {matchedRunbooks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Approved Runbooks ({matchedRunbooks.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedRunbooks.map((rbk) => (
                  <button
                    key={rbk.id}
                    onClick={() => {
                      setActivePage('runbooks');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">{rbk.id}</span>
                        <span className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                          {rbk.version} Approved
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium truncate mt-0.5">{rbk.name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
