import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Calendar, 
  Tag, 
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { ApprovedRunbook } from '../../types';

export const RunbookLibrary: React.FC = () => {
  const { approvedRunbooks } = useApp();
  const [search, setSearch] = useState('');
  const [selectedRunbook, setSelectedRunbook] = useState<ApprovedRunbook>(approvedRunbooks[0]);

  const filtered = approvedRunbooks.filter(r => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Visual Runbook Automation Workflow Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-5">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 shadow">
            <img
              src="/images/runbook_automation_playbook.jpg"
              alt="Automated Incident Response Playbook and SOP Flowchart"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-emerald-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SOP PLAYBOOK VERIFIED</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>WORKFLOW: AUTOMATED</span>
              <span className="text-cyan-400 font-bold">ZERO DRIFT</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Standard Operating Procedures (SOP) &amp; Runbooks</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {approvedRunbooks.length} VERIFIED SOPs
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <SecurityBadge type="rbac_enforced" size="sm" />
                <SecurityBadge type="audit_logged" size="sm" />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Cryptographically verified standard operating procedures (SOPs). The AI Copilot is strictly bounded to retrieve and recommend only human-reviewed recipes with zero autonomous deviations.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Execution Safety</span>
                <span className="text-sm font-bold text-emerald-400">Guaranteed</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Commander Review</span>
                <span className="text-sm font-bold text-blue-400">Mandatory</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Unverified AI SOPs</span>
                <span className="text-sm font-bold text-red-400">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approved runbooks..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="space-y-2.5">
            {filtered.map((rbk) => {
              const isSelected = selectedRunbook.id === rbk.id;
              return (
                <div
                  key={rbk.id}
                  onClick={() => setSelectedRunbook(rbk)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800">{rbk.id}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {rbk.version} {rbk.approvalStatus}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{rbk.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{rbk.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedRunbook.id}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedRunbook.approvalStatus} • {selectedRunbook.version}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{selectedRunbook.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedRunbook.description}</p>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono space-y-0.5 shrink-0">
              <div>Owner: <strong>{selectedRunbook.owner}</strong></div>
              <div>Reviewed: <strong>{selectedRunbook.lastReviewedDate}</strong></div>
            </div>
          </div>

          {/* Procedure Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Standard Operating Procedure Steps:
            </h4>

            <div className="space-y-3">
              {selectedRunbook.steps.map((st) => (
                <div key={st.stepNumber} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                        {st.stepNumber}
                      </span>
                      <h5 className="font-bold text-slate-900">{st.title}</h5>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="risk" risk={st.risk} size="sm">{st.risk} Risk</Badge>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        st.safeToAutomate ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {st.safeToAutomate ? 'Auto-Executable' : 'Requires Human Approval'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 pl-8 leading-relaxed">{st.instruction}</p>

                  <div className="pl-8 text-[11px] text-slate-400 font-mono">
                    Required Permission: <strong>{st.requiredPermission}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
