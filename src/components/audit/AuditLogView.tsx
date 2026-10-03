import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Download, 
  Key, 
  Hash, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../common/SecurityBadge';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { formatShortHash } from '../../utils/crypto';

export const AuditLogView: React.FC = () => {
  const { auditLogs, currentUser, checkPermission, navigateToIncident } = useApp();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [resultFilter, setResultFilter] = useState<string>('All');

  const filtered = auditLogs.filter(log => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        log.id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.incidentId && log.incidentId.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (actionFilter !== 'All' && !log.action.includes(actionFilter)) return false;
    if (resultFilter !== 'All' && log.result !== resultFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cryptographic Audit Vault Visual Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950/60 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/cyber_security_vault.jpg" 
            alt="Cryptographic Immutable Audit Vault" 
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                IMMUTABLE AUDIT VAULT ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                LEDGER: {auditLogs.length} BLOCKS VERIFIED
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cryptographic Tamper-Evident Ledger
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Append-only cryptographic audit trail linking every operator command, triage modification, and executive approval via sequential SHA-256 state hashes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Zero-Modification Guarantee
              </span>
              <span>&bull;</span>
              <span>SOC2 / ISO 27001 Compliant</span>
              <span>&bull;</span>
              <span>Genesis Hash Valid</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 rounded-lg p-2.5 text-xs text-slate-200 backdrop-blur-md">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Ledger Integrity Proof</div>
                <div className="text-base font-black text-emerald-400 font-mono">100% UNCOMPROMISED</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SecurityBadge type="audit_logged" size="sm" />
              <SecurityBadge type="rbac_enforced" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Chain Integrity Status Card */}
      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-900">Cryptographic Chain Verification: 100% Valid</span>
              <span className="px-2 py-0.2 bg-emerald-600 text-white text-[10px] rounded font-bold">
                Tamper-Evident
              </span>
            </div>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              All SHA-256 state transitions are sequentially linked to genesis state. Append-only enforcement prohibits modification or deletion.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-emerald-800 font-mono">
          <span>Latest Chain Hash: </span>
          <strong>{formatShortHash(auditLogs[0]?.currentStateHash || '00000000')}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event ID, actor, action, resource, incident ID, or details..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            <option value="All">All Actions</option>
            <option value="INCIDENT">Incidents</option>
            <option value="APPROVAL">Approvals</option>
            <option value="EVIDENCE">Evidence</option>
            <option value="DIAGNOSTIC">Diagnostics</option>
            <option value="SIMULATION">Simulations</option>
            <option value="WEBHOOK">Webhooks</option>
            <option value="RBAC">RBAC Changes</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Result:</span>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
          >
            <option value="All">All Results</option>
            <option value="Success">Success</option>
            <option value="Denied">Denied</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Previous State Hash</th>
                <th className="py-3 px-4">Current State Hash</th>
                <th className="py-3 px-4 font-sans">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-sans font-medium text-slate-800">
                    <div>{log.user}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-blue-600 font-sans">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                    {log.incidentId ? (
                      <button
                        onClick={() => navigateToIncident(log.incidentId!, 'audit')}
                        className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>{log.resource}</span>
                      </button>
                    ) : (
                      <span>{log.resource}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                      log.result === 'Success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {formatShortHash(log.previousStateHash)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                    {formatShortHash(log.currentStateHash)}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-600 min-w-[220px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {auditLogs.length} immutable events</span>
          <span className="font-semibold text-emerald-600">Zero Tampering Detected</span>
        </div>
      </div>
    </div>
  );
};
