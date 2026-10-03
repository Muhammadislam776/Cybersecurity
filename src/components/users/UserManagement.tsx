import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Check, 
  X, 
  Lock, 
  UserCheck, 
  Key, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../common/SecurityBadge';
import { formatDate } from '../../utils/formatters';
import { UserRole, Permission } from '../../types';
import { ROLE_PERMISSIONS } from '../../utils/formatters';

export const UserManagement: React.FC = () => {
  const { users, currentUser, setCurrentUserRole, checkPermission } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);

  const permissionGroups: { key: Permission; label: string; desc: string }[] = [
    { key: 'view_alerts', label: 'View Alerts', desc: 'Inspect telemetry alerts from SIEM, WAF, APM' },
    { key: 'manage_incidents', label: 'Manage Incidents', desc: 'Declare, edit, and resolve incident tickets' },
    { key: 'view_evidence', label: 'View Evidence', desc: 'Inspect sealed forensic evidence and logs' },
    { key: 'add_evidence', label: 'Add Evidence', desc: 'Upload artifacts with automated secret redaction' },
    { key: 'manage_tasks', label: 'Manage Tasks', desc: 'Create, assign, and advance response tasks' },
    { key: 'view_runbooks', label: 'View Runbooks', desc: 'Access approved standard operating procedures' },
    { key: 'request_approval', label: 'Request Approval', desc: 'Submit mitigation actions for commander sign-off' },
    { key: 'approve_actions', label: 'Approve Actions', desc: 'Authorize high-risk diagnostic executions' },
    { key: 'view_audit_logs', label: 'View Audit Logs', desc: 'Inspect append-only tamper-evident ledger' },
    { key: 'manage_users', label: 'Manage Users', desc: 'Configure RBAC roles and personnel access' },
    { key: 'manage_integrations', label: 'Manage Integrations', desc: 'Configure webhooks, SIEM, and alert endpoints' },
  ];

  const rolesList: UserRole[] = [
    'Admin',
    'Incident Commander',
    'Security Analyst',
    'Responder',
    'Auditor',
    'Viewer'
  ];

  const canManageUsers = checkPermission('manage_users');

  return (
    <div className="space-y-6">
      {/* RBAC Governance Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/cyber_shield_defense.jpg" 
            alt="Cryptographic RBAC Defense Shield" 
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
                RBAC POLICY ENGINE ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                {users.length} REGISTERED IDENTITIES
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Role Governance & Access Control Matrix
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fine-grained Principle of Least Privilege enforcement mapping 6 operational roles to 11 security capabilities across triage, diagnostic execution, and executive authorization.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Zero-Trust Clearance
              </span>
              <span>&bull;</span>
              <span>Step-Up MFA Enabled</span>
              <span>&bull;</span>
              <span>Audit Logging Bound</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 backdrop-blur-md">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Clearance</div>
                <div className="text-base font-black text-purple-400 font-mono">{currentUser.role.toUpperCase()}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SecurityBadge type="rbac_enforced" size="sm" />
              <SecurityBadge type="audit_logged" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Role Quick Switcher Banner */}
      <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Active Evaluation Persona: <span className="text-blue-600">{currentUser.name} ({currentUser.role})</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch persona to test how permissions immediately alter view permissions and operational action authorizations.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {rolesList.map((r) => (
            <button
              key={r}
              onClick={() => setCurrentUserRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentUser.role === r
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Personnel Directory & Assigned Roles
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department / Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Switch Persona</th>
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
                    <div className="font-medium text-slate-800">{u.title}</div>
                    <div className="text-[11px] text-slate-400">{u.department}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                      u.status === 'On Call' ? 'bg-orange-50 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {formatDate(u.lastLogin)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setCurrentUserRole(u.role)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        currentUser.name === u.name
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                      }`}
                    >
                      {currentUser.name === u.name ? 'Active' : 'Assume Role'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix (11 Groups x 6 Roles) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            RBAC Permission Enforcement Matrix
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Strict capability enforcement across all 11 security operations permission groups
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[220px]">Permission Group</th>
                {rolesList.map((r) => (
                  <th key={r} className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="font-bold text-slate-900">{r}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionGroups.map((perm) => (
                <tr key={perm.key} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{perm.label}</div>
                    <div className="text-[11px] text-slate-400 font-sans">{perm.desc}</div>
                  </td>
                  {rolesList.map((role) => {
                    const hasPerm = ROLE_PERMISSIONS[role].includes(perm.key);
                    return (
                      <td key={role} className="py-3 px-4 text-center">
                        {hasPerm ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
