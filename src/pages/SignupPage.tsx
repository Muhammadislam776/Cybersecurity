import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ArrowRight, 
  Lock, 
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth, getRoleDashboardPath } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Viewer');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  const strengthScore = [hasMinLength, hasNumber, hasSpecial, hasUppercase].filter(Boolean).length;
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const ROLES_LIST: { role: UserRole; title: string; desc: string }[] = [
    { 
      role: 'Viewer', 
      title: 'Viewer (Read-Only Observer - Default)', 
      desc: 'Operational situational awareness, incidents & alerts monitoring without mutation' 
    },
    { 
      role: 'Security Analyst', 
      title: 'Security Analyst (SOC Triage)', 
      desc: 'Investigate telemetry alerts, collect evidence, and request diagnostic approvals' 
    },
    { 
      role: 'Responder', 
      title: 'Responder (SRE & Infrastructure)', 
      desc: 'Execute assigned response tasks, submit logs, and manage runbook mitigations' 
    },
    { 
      role: 'Incident Commander', 
      title: 'Incident Commander (Lead CSIRT)', 
      desc: 'Orchestrate incident response, assign responders, and approve critical diagnostic actions' 
    },
    { 
      role: 'Auditor', 
      title: 'Auditor (Compliance & GRC)', 
      desc: 'Inspect tamper-evident audit logs, review approval chains, and export compliance reports' 
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Security Governance Terms to proceed.');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);

    if (result.success && result.role) {
      addToast('success', 'Account Created', `Welcome, ${name}! Your account has been provisioned with ${result.role} clearance.`);
      navigate(getRoleDashboardPath(result.role));
    } else {
      setError(result.error || 'Failed to create account.');
    }
  };

  const selectedRoleInfo = ROLES_LIST.find(r => r.role === role);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-8 pb-4 text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">CyberOps IR</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create SecOps Account</h1>
          <p className="text-xs text-slate-500">
            Provision access to the incident response platform
          </p>
        </div>

        {/* Security Role Notice */}
        <div className="mx-8 p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <p className="text-[11px] text-blue-800 leading-snug">
            Newly registered accounts default to Viewer. Administrator clearance cannot be self-selected and must be assigned later by an existing Admin via Governance.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Smith"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@cyberops.corp"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Selection Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Operational Role Clearance <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                {role}
              </span>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.title}
                </option>
              ))}
            </select>
            {selectedRoleInfo && (
              <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                {selectedRoleInfo.desc}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters..."
                className="w-full text-xs p-2.5 pr-9 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Strength: <strong>{strengthLabels[strengthScore - 1] || 'Too Weak'}</strong></span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-colors ${
                        strengthScore >= step ? strengthColors[strengthScore - 1] : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 leading-snug cursor-pointer">
              I agree to the <span className="text-blue-600 font-semibold underline">Security Governance Policy</span> and acknowledge that all session activities are recorded in immutable audit logs.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
