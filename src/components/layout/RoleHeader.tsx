import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  Key, 
  Sliders, 
  ExternalLink,
  Sparkles,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatDate } from '../../utils/formatters';

export const RoleHeader: React.FC = () => {
  const { currentUser, logout, sessionExpiresAt } = useAuth();
  const { 
    setGlobalSearchOpen, 
    isLiveStreamPaused, 
    toggleLiveStreamPause, 
    approvals, 
    alerts, 
    navigateToIncident,
    addToast
  } = useApp();

  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Profile modals
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  if (!currentUser) return null;

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
  const totalNotifications = pendingApprovals.length + criticalAlerts.length;

  const handleLogout = () => {
    logout();
    addToast('info', 'Logged Out', 'You have been securely signed out.');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shadow-2xs">
      {/* Left: Global Search trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="flex items-center gap-3 w-full px-3.5 py-2 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          <span className="flex-1 text-left">Search incidents, alerts, evidence, runbooks...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Stream Pulse & Toggle */}
        <button
          onClick={toggleLiveStreamPause}
          title={isLiveStreamPaused ? 'Click to resume real-time telemetry stream' : 'Telemetry streaming live. Click to pause.'}
          className={`flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono tracking-wider font-semibold rounded-full border transition-all cursor-pointer shadow-2xs ${
            isLiveStreamPaused
              ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200/80'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300/80 hover:bg-emerald-100/70 hover:border-emerald-400'
          }`}
        >
          {isLiveStreamPaused ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>PAUSED</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE</span>
            </>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {totalNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                {totalNotifications}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setNotificationOpen(false)}
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Operational Alerts & Approvals</span>
                <span className="text-[11px] font-semibold text-slate-500">{totalNotifications} pending</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {pendingApprovals.map((apr) => (
                  <div 
                    key={apr.id} 
                    onClick={() => {
                      navigateToIncident(apr.incidentId, 'approvals');
                      setNotificationOpen(false);
                    }}
                    className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-orange-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Approval Required
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{apr.id}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium mt-1 truncate">{apr.actionTitle}</p>
                    <p className="text-[11px] text-slate-500 truncate">{apr.incidentTitle}</p>
                  </div>
                ))}

                {criticalAlerts.slice(0, 3).map((alt) => (
                  <div key={alt.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-red-600">Critical Alert</span>
                      <span className="text-[10px] text-slate-400 font-mono">{alt.id}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium mt-1 truncate">{alt.title}</p>
                    <p className="text-[11px] text-slate-500">{alt.source} • {alt.affectedService}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{currentUser.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              {/* Profile Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser.role}</span>
                </div>
              </div>

              {/* Menu options */}
              <div className="p-1 space-y-0.5 text-xs font-medium text-slate-700">
                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setSettingsModalOpen(true);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    setSecurityModalOpen(true);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Key className="w-4 h-4 text-slate-400" />
                  <span>Security</span>
                </button>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left cursor-pointer font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Profile Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Personnel Profile & Security Clearance"
        subtitle="Identity, department, and granular authorization capabilities"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-14 h-14 rounded-full object-cover border" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentUser.name}</h3>
              <p className="text-slate-500">{currentUser.title} • {currentUser.department}</p>
              <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                ROLE: {currentUser.role}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-700 uppercase text-[11px] block">
              Active RBAC Permissions ({currentUser.permissions?.length || 0}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.permissions?.map((p, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Security Modal */}
      <Modal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
        title="Session & Security Credentials"
        subtitle="Cryptographic session parameters and authentication verification"
        maxWidth="md"
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Session Status:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active & Authenticated
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Session Expires:</span>
              <span className="font-mono text-slate-700">{sessionExpiresAt ? formatDate(sessionExpiresAt) : 'In 7 Days'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Authentication Scheme:</span>
              <span className="font-mono text-slate-700">SHA-256 Digest Token</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-blue-900 text-[11px]">
            Password resets are managed via zero-trust credential verification. All logins and session terminations generate append-only tamper-evident audit logs.
          </div>
        </div>
      </Modal>

      {/* Account Settings Modal */}
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="Personal Account Settings"
        subtitle="Manage interface preferences, notification triggers, and time display"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Timezone Display</p>
                <p className="text-[11px] text-slate-500">Render timestamps in UTC ISO format</p>
              </div>
              <span className="px-2 py-1 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-700">UTC +00:00</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5">
              <div>
                <p className="font-semibold text-slate-800">Telemetry Stream Pulse</p>
                <p className="text-[11px] text-slate-500">Real-time socket polling frequency</p>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold text-[10px]">Realtime (3s)</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
            Role-level settings (e.g. system integrations, user permissions) require Administrator clearance.
          </div>
        </div>
      </Modal>
    </header>
  );
};
