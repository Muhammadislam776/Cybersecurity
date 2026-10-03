import React from 'react';
import { SeverityLevel, IncidentStatus, TaskStatus, RiskLevel, AlertStatus } from '../../types';
import { getSeverityClasses, getStatusClasses, getRiskClasses } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'severity' | 'status' | 'risk' | 'role' | 'default' | 'live';
  severity?: SeverityLevel;
  status?: IncidentStatus | TaskStatus | AlertStatus;
  risk?: RiskLevel;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  severity,
  status,
  risk,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const baseClasses = `inline-flex items-center font-medium rounded-full border transition-colors ${sizeClasses}`;

  if (variant === 'severity' && severity) {
    const classes = getSeverityClasses(severity);
    return (
      <span className={`${baseClasses} ${classes.badge} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${classes.dot}`} />
        {children}
      </span>
    );
  }

  if (variant === 'status' && status) {
    const classes = getStatusClasses(status);
    return (
      <span className={`${baseClasses} ${classes} ${className}`}>
        {children}
      </span>
    );
  }

  if (variant === 'risk' && risk) {
    const classes = getRiskClasses(risk);
    return (
      <span className={`${baseClasses} ${classes} ${className}`}>
        {children}
      </span>
    );
  }

  if (variant === 'live') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-live-pulse" />
        {children || 'LIVE'}
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-slate-100 text-slate-700 border-slate-200 ${className}`}>
      {children}
    </span>
  );
};
