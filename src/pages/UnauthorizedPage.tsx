import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, LogOut } from 'lucide-react';
import { useAuth, getRoleDashboardPath } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { requiredRoles?: string[]; currentRole?: string } | null;
  const userRole = currentUser?.role || 'Guest';
  const roleHome = currentUser ? getRoleDashboardPath(currentUser.role) : '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
            HTTP 403 — Access Denied
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Insufficient Permissions
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your authenticated role does not possess authorization to access this restricted operational resource.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Your Active Role:</span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {userRole}
            </span>
          </div>

          {state?.requiredRoles && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Required Role:</span>
              <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-mono">
                {state.requiredRoles.join(' or ')}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Access denied event has been recorded in the immutable audit ledger.</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => navigate(roleHome)}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {userRole} Dashboard</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Persona / Login as Different Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
