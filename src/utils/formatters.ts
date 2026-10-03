import { SeverityLevel, IncidentStatus, TaskStatus, TaskPriority, RiskLevel, UserRole, Permission, AlertStatus } from '../types';

export function formatDate(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString).getTime();
    const now = Date.now();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${Math.max(1, diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

export function getSeverityClasses(severity: SeverityLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-600',
      };
    case 'High':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Low':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Informational':
    default:
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        badge: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
  }
}

export function getStatusClasses(status: IncidentStatus | TaskStatus | AlertStatus): string {
  switch (status) {
    case 'New':
    case 'Pending':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'Investigating':
    case 'In Progress':
    case 'Triaged':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Mitigating':
    case 'Awaiting Approval':
    case 'Escalated':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Resolved':
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Closed':
      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    case 'Blocked':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Cancelled':
    case 'Suppressed':
      return 'bg-slate-100 text-slate-500 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function getRiskClasses(risk: RiskLevel): string {
  switch (risk) {
    case 'Critical':
      return 'bg-red-50 text-red-700 border-red-200 font-semibold';
    case 'High':
      return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low':
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

export function getPriorityClasses(priority: TaskPriority): string {
  if (priority.startsWith('P1')) return 'text-red-700 bg-red-50 border-red-200';
  if (priority.startsWith('P2')) return 'text-orange-700 bg-orange-50 border-orange-200';
  if (priority.startsWith('P3')) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-slate-600 bg-slate-50 border-slate-200';
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Admin': [
    'view_alerts',
    'manage_incidents',
    'view_evidence',
    'add_evidence',
    'manage_tasks',
    'view_runbooks',
    'request_approval',
    'approve_actions',
    'view_audit_logs',
    'manage_users',
    'manage_integrations'
  ],
  'Incident Commander': [
    'view_alerts',
    'manage_incidents',
    'view_evidence',
    'add_evidence',
    'manage_tasks',
    'view_runbooks',
    'request_approval',
    'approve_actions',
    'view_audit_logs',
    'manage_integrations'
  ],
  'Security Analyst': [
    'view_alerts',
    'manage_incidents',
    'view_evidence',
    'add_evidence',
    'manage_tasks',
    'view_runbooks',
    'request_approval',
    'view_audit_logs'
  ],
  'Responder': [
    'view_alerts',
    'view_evidence',
    'add_evidence',
    'manage_tasks',
    'view_runbooks',
    'request_approval'
  ],
  'Auditor': [
    'view_alerts',
    'view_evidence',
    'view_runbooks',
    'view_audit_logs'
  ],
  'Viewer': [
    'view_alerts'
  ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
