import React from 'react';
import { ShieldCheck, Lock, FileCheck2, UserCheck, AlertTriangle, Sparkles } from 'lucide-react';

interface SecurityBadgeProps {
  type: 
    | 'ai_generated'
    | 'human_approval_required'
    | 'simulation_mode'
    | 'secret_redacted'
    | 'rbac_enforced'
    | 'audit_logged';
  className?: string;
  size?: 'sm' | 'md';
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ type, className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (type) {
    case 'ai_generated':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 ${padding} ${className}`}>
          <Sparkles className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>AI Generated — Verify Before Acting</span>
        </span>
      );
    case 'human_approval_required':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-md bg-orange-50 text-orange-700 border border-orange-200 ${padding} ${className}`}>
          <UserCheck className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Human Approval Required</span>
        </span>
      );
    case 'simulation_mode':
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-300 ${padding} ${className}`}>
          <AlertTriangle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Simulation Only — No Production Changes</span>
        </span>
      );
    case 'secret_redacted':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200 ${padding} ${className}`}>
          <Lock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Sensitive data redacted</span>
        </span>
      );
    case 'rbac_enforced':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${padding} ${className}`}>
          <ShieldCheck className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>RBAC Enforced</span>
        </span>
      );
    case 'audit_logged':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 ${padding} ${className}`}>
          <FileCheck2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Tamper-Evident / Audit Logged</span>
        </span>
      );
    default:
      return null;
  }
};
