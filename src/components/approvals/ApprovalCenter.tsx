import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Flame, 
  ExternalLink,
  Search,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { ApprovalRequest } from '../../types';

export const ApprovalCenter: React.FC = () => {
  const { 
    approvals, 
    approveAction, 
    rejectAction, 
    navigateToIncident, 
    checkPermission 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  // Confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activeReq, setActiveReq] = useState<ApprovalRequest | null>(null);
  const [reason, setReason] = useState('');

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const canApprove = checkPermission('approve_actions');

  const filtered = approvals.filter(a => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        a.id.toLowerCase().includes(q) ||
        a.actionTitle.toLowerCase().includes(q) ||
        a.incidentTitle.toLowerCase().includes(q) ||
        a.requestedBy.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    return true;
  });

  const pendingCount = approvals.filter(a => a.status === 'Pending').length;

  const handleOpenApprove = (req: ApprovalRequest) => {
    setActiveReq(req);
    setReason('');
    setConfirmModalOpen(true);
  };

  const handleOpenReject = (req: ApprovalRequest) => {
    setActiveReq(req);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Visual Human Authorization Gateway Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-5">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 shadow">
            <img
              src="/images/cyber_shield_defense.jpg"
              alt="Cryptographic Human-in-the-Loop Approval Gateway"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-amber-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>APPROVAL GATEWAY ACTIVE</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>ZERO DIRECT EXECUTION</span>
              <span className="text-emerald-400 font-bold">100% AUDITED</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>Human-in-the-Loop Authorization Gateway</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingCount} PENDING SIGN-OFF
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <SecurityBadge type="human_approval_required" size="sm" />
                <SecurityBadge type="audit_logged" size="sm" />
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Mandatory human authorization checkpoint. AI recommendations, diagnostic executions, and containment firewall rules are quarantined until an authorized Incident Commander or Administrator signs off.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Autonomous Mutates</span>
                <span className="text-sm font-bold text-emerald-400">0% Permitted</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Pending Decision</span>
                <span className="text-sm font-bold text-amber-400">{pendingCount} Actions</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Audit Trail</span>
                <span className="text-sm font-bold text-cyan-400">Append-Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pending Authorization Requests</h3>
          <p className="text-xs text-slate-500">Review risk levels, expected information gain, and sign off.</p>
        </div>
      </div>

      {/* Filter / Tabs */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st === 'Pending' ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request ID, action, incident..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
        </div>
      </div>

      {/* Approvals Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            No approval requests found matching current filter.
          </div>
        ) : (
          filtered.map((req) => (
            <div key={req.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {req.id}
                  </span>
                  <button
                    onClick={() => navigateToIncident(req.incidentId, 'approvals')}
                    className="font-mono text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{req.incidentId}</span>
                  </button>
                  <span className="text-sm font-bold text-slate-900">{req.actionTitle}</span>
                  <Badge variant="risk" risk={req.riskLevel} size="sm">{req.riskLevel} Risk</Badge>
                  <Badge variant="status" status={req.status as any} size="sm">{req.status}</Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Expires: {formatRelativeTime(req.expirationTime)}</span>
                </div>
              </div>

              {/* Action & Rationale Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase block">Requested Action / Payload</span>
                  <p className="font-mono text-slate-800 text-[11px] bg-white p-2 rounded border border-slate-200">
                    {req.requestedAction}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase block">Operational Justification</span>
                  <p className="text-slate-700 leading-relaxed">{req.reason}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Requested by: <strong>{req.requestedBy}</strong> ({req.aiRecommendationSource || 'Copilot Recommendation'})
                  </div>
                </div>
              </div>

              {/* Review History */}
              {req.reviewedBy && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Decision recorded by <strong>{req.reviewedBy}</strong> ({formatRelativeTime(req.reviewTimestamp || '')}): &quot;{req.reviewComment}&quot;
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Signed in Audit Chain
                  </span>
                </div>
              )}

              {/* Action Controls */}
              {req.status === 'Pending' && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500">
                    Requires: <span className="font-mono font-semibold text-slate-700">{req.requiredPermission}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {canApprove ? (
                      <>
                        <button
                          onClick={() => handleOpenReject(req)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleOpenApprove(req)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Authorize & Execute Action</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Current role ({checkPermission('approve_actions') ? 'Authorized' : 'Viewer/Analyst'}) cannot approve. Switch to Admin or Commander.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal for Approval */}
      {activeReq && (
        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => {
            approveAction(activeReq.id, reason);
          }}
          title={`Approve Action: ${activeReq.actionTitle}`}
          message="You are approving this diagnostic action. This approval will be recorded in the immutable audit log and executed in the safe simulation environment."
          confirmLabel="Authorize Action Execution"
          variant="warning"
          requiresReason={true}
          reasonValue={reason}
          onReasonChange={setReason}
          auditNotice="Approval will be recorded in the tamper-evident cryptographic audit ledger."
        />
      )}

      {/* Reject Modal */}
      {activeReq && (
        <ConfirmModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={() => {
            rejectAction(activeReq.id, rejectReason || 'Action rejected per operational assessment.');
          }}
          title={`Reject Action: ${activeReq.actionTitle}`}
          message="Confirm rejection of this requested action. The requesting engineer and incident log will be updated."
          confirmLabel="Reject Action"
          variant="danger"
          requiresReason={true}
          reasonValue={rejectReason}
          onReasonChange={setRejectReason}
        />
      )}
    </div>
  );
};
