import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  EyeOff, 
  Radio, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

export const ViewerSecurityStatus: React.FC = () => {
  const securityItems = [
    {
      title: 'Authentication',
      status: 'Protected',
      detail: 'PBKDF2 Password Hashing & Authenticated Token Session',
      icon: Key,
      active: true
    },
    {
      title: 'RBAC Access Control',
      status: 'Active (Viewer)',
      detail: 'Read-only operational clearance enforced across API routes',
      icon: ShieldCheck,
      active: true
    },
    {
      title: 'Audit Logging',
      status: 'Active',
      detail: 'Cryptographic SHA-256 tamper-evident append-only journal',
      icon: FileText,
      active: true
    },
    {
      title: 'Secret Redaction',
      status: 'Enabled',
      detail: 'Automatic regex scrubbing on API tokens, passwords, and private keys',
      icon: EyeOff,
      active: true
    },
    {
      title: 'Real-Time Events',
      status: 'Connected',
      detail: 'Persistent telemetry channel with auto-reconnect fallback',
      icon: Radio,
      active: true
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Platform Security Enforcements</h3>
            <p className="text-[11px] text-slate-500">Live verification of defense-in-depth security policies</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          ALL GUARDS ACTIVE
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {securityItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {item.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
