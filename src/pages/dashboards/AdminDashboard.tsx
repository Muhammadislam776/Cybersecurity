import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Sliders, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Lock, 
  UserX, 
  UserCheck, 
  Plus, 
  Search, 
  RefreshCw,
  Database,
  Server,
  Activity,
  Flame,
  BellRing
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleSidebar } from '../../components/layout/RoleSidebar';
import { RoleHeader } from '../../components/layout/RoleHeader';
import { GlobalSearchModal } from '../../components/layout/GlobalSearchModal';
import { ToastContainer } from '../../components/common/Toast';
import { Modal } from '../../components/common/Modal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Badge } from '../../components/common/Badge';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { UserRole } from '../../types';

// Feature Views
import { Dashboard } from '../../components/dashboard/Dashboard';
import { IncidentList } from '../../components/incidents/IncidentList';
import { IncidentDetails } from '../../components/incidents/IncidentDetails';
import { AlertCenter } from '../../components/alerts/AlertCenter';
import { EvidenceManager } from '../../components/evidence/EvidenceManager';
import { TaskManager } from '../../components/tasks/TaskManager';
import { ApprovalCenter } from '../../components/approvals/ApprovalCenter';
import { RunbookLibrary } from '../../components/runbooks/RunbookLibrary';
import { DedicatedCopilot } from '../../components/copilot/DedicatedCopilot';
import { AuditLogView } from '../../components/audit/AuditLogView';
import { LiveEventsView } from '../../components/live/LiveEventsView';
import { IntegrationsView } from '../../components/integrations/IntegrationsView';
import { SimulationCenter } from '../../components/simulations/SimulationCenter';
import { UserManagement } from '../../components/users/UserManagement';
import { ViewerReportsView } from '../../components/viewer/ViewerReportsView';
import { ViewerNotificationCenter } from '../../components/viewer/ViewerNotificationCenter';

export const AdminDashboard: React.FC = () => {
  const { users, currentUser, updateUserRoleByAdmin, toggleUserStatusByAdmin } = useAuth();
  const { activeIncidentTab, incidents, addToast } = useApp();

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Change Role Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<any>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('Viewer');
  const [roleChangeReason, setRoleChangeReason] = useState('');

  // Status Toggle Modal
  const [statusConfirmModalOpen, setStatusConfirmModalOpen] = useState(false);
  const [targetUserForStatus, setTargetUserForStatus] = useState<any>(null);

  // System Settings state
  const [sessionTimeoutHours, setSessionTimeoutHours] = useState('24');
  const [autoRedactionStrictness, setAutoRedactionStrictness] = useState('aggressive');
  const [enforceTwoFactor, setEnforceTwoFactor] = useState(true);

  const handleOpenRoleModal = (u: any) => {
    setSelectedUserForRole(u);
    setTargetRole(u.role);
    setRoleChangeReason('');
    setRoleModalOpen(true);
  };

  const handleConfirmRoleChange = () => {
    if (!selectedUserForRole || !roleChangeReason.trim()) return;
    updateUserRoleByAdmin(selectedUserForRole.id, targetRole, roleChangeReason);
    addToast('success', 'User Role Updated', `Updated ${selectedUserForRole.name}'s role to ${targetRole}.`);
    setRoleModalOpen(false);
  };

  const handleOpenStatusToggle = (u: any) => {
    setTargetUserForStatus(u);
    setStatusConfirmModalOpen(true);
  };

  const handleConfirmStatusToggle = () => {
    if (!targetUserForStatus) return;
    toggleUserStatusByAdmin(targetUserForStatus.id);
    addToast('info', 'User Status Updated', `Toggled account status for ${targetUserForStatus.name}.`);
    setStatusConfirmModalOpen(false);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return (
          <div className="space-y-6">
            {/* Administrative Directory Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-purple-950/60 bg-slate-950 shadow-xl group">
              <div className="absolute inset-0">
                <img 
                  src="/images/cyber_shield_defense.jpg" 
                  alt="Administrative User & Identity Directory" 
                  className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-purple-950/70" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/15 via-transparent to-transparent" />
              </div>

              <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      ADMIN PRIVILEGE CONSOLE
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                      {users.length} REGISTERED USERS
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Personnel & Clearance Provisioning
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Govern platform identities, reassign incident responder credentials, enforce emergency access deactivation, and log privilege escalations to the audit vault.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-purple-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      Root Authority Enforced
                    </span>
                    <span>&bull;</span>
                    <span>Multi-Role Delegation</span>
                    <span>&bull;</span>
                    <span>Audit Trail Logged</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <SecurityBadge type="rbac_enforced" size="sm" />
                  <SecurityBadge type="audit_logged" size="sm" />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Registered Platform Users ({users.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                          {u.department} ({u.title})
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                            u.status === 'On Call' ? 'bg-orange-50 text-orange-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                          {formatDate(u.lastLogin)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenRoleModal(u)}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleOpenStatusToggle(u)}
                              disabled={u.id === currentUser?.id}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                u.status === 'Disabled'
                                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-red-700 bg-red-50 hover:bg-red-100'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              {u.status === 'Disabled' ? 'Activate' : 'Disable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'roles':
        return <UserManagement />;
      case 'system-settings':
        return (
          <div className="space-y-6">
            {/* System Configuration Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
              <div className="absolute inset-0">
                <img 
                  src="/images/cyber_security_vault.jpg" 
                  alt="System Governance & Policy Controls" 
                  className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent" />
              </div>

              <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      SYSTEM POLICIES ENFORCED
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                      AES-256 ENCRYPTION
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    System Configuration & Security Governance
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Configure platform session lifetimes, automated secret redaction strictness, mandatory multi-factor authentication, and cryptographic ledger retention rules.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <SecurityBadge type="audit_logged" size="sm" />
                  <SecurityBadge type="rbac_enforced" size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Session & Authentication Policies</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Max Inactive Session Expiration</label>
                    <select
                      value={sessionTimeoutHours}
                      onChange={(e) => setSessionTimeoutHours(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="8">8 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="168">7 Days (Default)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-semibold text-slate-800 block">Mandatory MFA for Responders & Commanders</span>
                      <span className="text-[11px] text-slate-400">Step-up authentication on high-risk approvals</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enforceTwoFactor}
                      onChange={(e) => setEnforceTwoFactor(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cryptographic Audit & Redaction Controls</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Zero-Exposure Redaction Engine Strictness</label>
                    <select
                      value={autoRedactionStrictness}
                      onChange={(e) => setAutoRedactionStrictness(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="aggressive">Aggressive (Masks API keys, JWT, Passwords, RSA keys)</option>
                      <option value="standard">Standard (Masks API keys & Passwords)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
                    <span className="font-bold block">Audit Ledger Verification: 100% Valid</span>
                    <span>All append-only operations sequentially chained via SHA-256 state hashes. Zero tampering recorded.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'incidents':
        return <IncidentList />;
      case 'incident-details':
        return <IncidentDetails />;
      case 'alerts':
        return <AlertCenter />;
      case 'evidence':
        return <EvidenceManager />;
      case 'tasks':
        return <TaskManager />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'runbooks':
        return <RunbookLibrary />;
      case 'copilot':
        return <DedicatedCopilot />;
      case 'audit':
        return <AuditLogView />;
      case 'live-events':
        return <LiveEventsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'simulations':
        return <SimulationCenter />;
      case 'reports':
        return <ViewerReportsView />;
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

      {/* Change Role Modal */}
      {selectedUserForRole && (
        <Modal
          isOpen={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          title={`Update Role for ${selectedUserForRole.name}`}
          subtitle="Modifying permissions will be recorded in the immutable audit ledger"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select New Operational Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value="Admin">Admin (Full Platform Control)</option>
                <option value="Incident Commander">Incident Commander (Incident Lead & Approvals)</option>
                <option value="Security Analyst">Security Analyst (Alerts & Evidence)</option>
                <option value="Responder">Responder (Response Tasks & Diagnostics)</option>
                <option value="Auditor">Auditor (Read-Only Governance)</option>
                <option value="Viewer">Viewer (Limited Read-Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Operational Justification / Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={roleChangeReason}
                onChange={(e) => setRoleChangeReason(e.target.value)}
                placeholder="Reason for role change (recorded in audit trail)..."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleChange}
                disabled={!roleChangeReason.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs disabled:opacity-50"
              >
                Confirm Role Elevation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Status Toggle Modal */}
      {targetUserForStatus && (
        <ConfirmModal
          isOpen={statusConfirmModalOpen}
          onClose={() => setStatusConfirmModalOpen(false)}
          onConfirm={handleConfirmStatusToggle}
          title={`${targetUserForStatus.status === 'Disabled' ? 'Activate' : 'Disable'} User Account`}
          message={`Are you sure you want to ${targetUserForStatus.status === 'Disabled' ? 'activate' : 'disable'} ${targetUserForStatus.name}'s account? Disabled users cannot authenticate or access platform tools.`}
          confirmLabel={targetUserForStatus.status === 'Disabled' ? 'Activate Account' : 'Disable Account'}
          variant={targetUserForStatus.status === 'Disabled' ? 'primary' : 'danger'}
        />
      )}
    </div>
  );
};
