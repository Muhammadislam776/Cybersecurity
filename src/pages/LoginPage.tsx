import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth, getRoleDashboardPath } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { login, resetPassword } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password, rememberMe);
    setLoading(false);

    if (result.success && result.role) {
      addToast('success', 'Authentication Successful', `Welcome back. Redirecting to ${result.role} console.`);
      navigate(getRoleDashboardPath(result.role));
    } else {
      setError(result.error || 'Failed to authenticate.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await resetPassword(resetEmail, newPass);
    if (res.success) {
      setResetSuccess(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSuccess(false);
        setPassword(newPass);
        setEmail(resetEmail);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Cyber Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full bg-white rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200 relative z-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
          <div className="text-center sm:text-left space-y-1.5">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-slate-900">CyberOps IR</span>
            </Link>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sign In to Dashboard</h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access role-authorized operational tools
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email Address
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </form>
        </div>

        {/* Right Column: Visual Defense Showcase */}
        <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white border-t lg:border-t-0 lg:border-l border-slate-800 group">
          {/* Cyber Shield Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-4">
            <img
              src="/images/cyber_shield_defense.jpg"
              alt="Cryptographic Biometric Cyber Defense Shield"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

            {/* Floating Shield Status Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded-lg px-2.5 py-1 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>ZERO TRUST ENFORCED</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400">CIPHER: AES-256</span>
              <span className="text-emerald-400 font-bold">TAMPER-PROOF</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              ENTERPRISE INCIDENT MANAGEMENT
            </div>
            <h3 className="text-sm font-bold text-white">
              Autonomous Triage &amp; Human-in-the-Loop Governance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Strict RBAC enforcement across 6 specialized operational roles. All system diagnostics require explicit authorization.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Access Credentials"
        subtitle="Submit your registered work email to set a new password"
        maxWidth="md"
      >
        <form onSubmit={handleResetSubmit} className="space-y-4">
          {resetSuccess ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Password successfully reset! You can now log in.</span>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@cyberops.corp"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="New password (min 8 chars)..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Password Reset
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
