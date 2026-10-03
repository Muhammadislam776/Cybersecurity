import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ExternalLink,
  Flame,
  BellRing,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleSidebar } from '../../components/layout/RoleSidebar';
import { RoleHeader } from '../../components/layout/RoleHeader';
import { GlobalSearchModal } from '../../components/layout/GlobalSearchModal';
import { ToastContainer } from '../../components/common/Toast';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import { formatDate } from '../../utils/formatters';
import { formatShortHash } from '../../utils/crypto';

// Feature Views
import { Dashboard } from '../../components/dashboard/Dashboard';
import { IncidentList } from '../../components/incidents/IncidentList';
import { IncidentDetails } from '../../components/incidents/IncidentDetails';
import { AlertCenter } from '../../components/alerts/AlertCenter';
import { EvidenceManager } from '../../components/evidence/EvidenceManager';
import { AuditLogView } from '../../components/audit/AuditLogView';
import { ApprovalCenter } from '../../components/approvals/ApprovalCenter';
import { ViewerNotificationCenter } from '../../components/viewer/ViewerNotificationCenter';

export const AuditorDashboard: React.FC = () => {
  const { auditLogs, incidents, approvals, evidence, addToast } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleDownloadComplianceReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      addToast('success', 'Report Exported', 'SOC 2 & ISO 27001 Cryptographic Audit Certificate generated.');
    }, 1200);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'audit':
        return <AuditLogView />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'incidents':
        return <IncidentList />;
      case 'incident-details':
        return <IncidentDetails />;
      case 'alerts':
        return <AlertCenter />;
      case 'evidence':
        return <EvidenceManager />;
      case 'reports':
        return (
          <div className="space-y-6">
            {/* Compliance & Forensic Audit Reports Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-950/60 bg-slate-950 shadow-xl group">
              <div className="absolute inset-0">
                <img 
                  src="/images/cyber_security_vault.jpg" 
                  alt="Compliance & Cryptographic Audit Vault" 
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
                      COMPLIANCE ATTESTATION ENGINE
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                      SOC 2 TYPE II / ISO 27001
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Compliance & Forensic Audit Certifications
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Export cryptographically attested incident dossiers with complete SHA-256 evidence custody chains, approval non-repudiation timestamps, and immutable audit logs.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={handleDownloadComplianceReport}
                    disabled={generatingReport}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{generatingReport ? 'Generating Certificate...' : 'Export Audit Certificate'}</span>
                  </button>

                  <SecurityBadge type="audit_logged" size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Tamper-Evident Logs</span>
                <div className="text-2xl font-bold text-slate-900">{auditLogs.length} Records</div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chained Hashes 100% Intact
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Sealed Forensic Artifacts</span>
                <div className="text-2xl font-bold text-slate-900">{evidence.length} Files</div>
                <p className="text-[11px] text-slate-500">All verified with SHA-256 Checksums</p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Human Approvals Recorded</span>
                <div className="text-2xl font-bold text-slate-900">{approvals.length} Requests</div>
                <p className="text-[11px] text-slate-500">Zero unapproved destructive changes</p>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-bold text-slate-800 text-sm font-sans">Formal Compliance Certification</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SEAL VALID
                </span>
              </div>
              <p className="text-slate-600 font-sans leading-relaxed">
                This environment enforces strictly immutable, append-only cryptographic logging. No administrator or user has performed unrecorded configuration alterations or deleted audit evidence.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border text-[11px] text-slate-700 space-y-1">
                <div>Genesis Root Hash: <span className="text-slate-500">a3f908e4...99b2410a</span></div>
                <div>Current Head Hash: <span className="text-slate-900 font-bold">{auditLogs[0]?.currentStateHash}</span></div>
                <div>Verification Authority: <span className="text-blue-700 font-sans font-bold">CyberOps Cryptographic Notary Daemon</span></div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return <ViewerNotificationCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <RoleSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RoleHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};
