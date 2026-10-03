import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  Radio, 
  Pause, 
  Play, 
  AlertTriangle, 
  ChevronDown, 
  Check, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    setGlobalSearchOpen,
    isLiveStreamPaused,
    toggleLiveStreamPause,
    isSimulationActive,
    stopSimulation,
    approvals,
    alerts,
    navigateToIncident
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const availableRoles: { role: UserRole; desc: string; color: string }[] = [
    { role: 'Admin', desc: 'Full system management and configuration', color: 'bg-purple-100 text-purple-800' },
    { role: 'Incident Commander', desc: 'Can manage incidents, approvals, and workflows', color: 'bg-blue-100 text-blue-800' },
    { role: 'Security Analyst', desc: 'Investigate alerts, evidence, and runbooks', color: 'bg-sky-100 text-sky-800' },
    { role: 'Responder', desc: 'Perform assigned tasks and diagnostic simulations', color: 'bg-emerald-100 text-emerald-800' },
    { role: 'Auditor', desc: 'Read-only access to incidents and immutable audit logs', color: 'bg-amber-100 text-amber-800' },
    { role: 'Viewer', desc: 'Limited dashboard observation view', color: 'bg-slate-100 text-slate-800' },
  ];

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
  const totalNotifications = pendingApprovals.length + criticalAlerts.length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
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
        {/* Simulation Indicator Banner */}
        {isSimulationActive && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>Simulation Mode Active</span>
            <button
              onClick={stopSimulation}
              className="ml-1 text-[11px] text-amber-700 hover:text-amber-950 font-bold underline cursor-pointer"
            >
              Exit Sandbox
            </button>
          </div>
        )}

        {/* Live Stream Pulse & Toggle */}
        <button
          onClick={toggleLiveStreamPause}
          title={isLiveStreamPaused ? 'Resume live event feed' : 'Pause live event feed'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
            isLiveStreamPaused
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}
        >
          {isLiveStreamPaused ? (
            <>
              <Play className="w-3 h-3 text-slate-500" />
              <span>PAUSED</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
              <span>LIVE</span>
              <Pause className="w-2.5 h-2.5 text-emerald-600 opacity-60 ml-0.5" />
            </>
          )}
        </button>

        {/* RBAC Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            title="Switch RBAC role to evaluate permissions"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <div className="flex flex-col text-left hidden sm:block">
              <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Role</span>
              <span className="text-xs font-semibold text-slate-900">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {roleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setRoleDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">RBAC Role Switcher</p>
                <p className="text-[11px] text-slate-500">Test how permissions affect actions & UI</p>
              </div>
              <div className="p-1 space-y-1">
                {availableRoles.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setCurrentUserRole(item.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      currentUser.role === item.role ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.role}</span>
                        {currentUser.role === item.role && (
                          <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] rounded font-bold">Active</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    {currentUser.role === item.role && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400">{currentUser.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
