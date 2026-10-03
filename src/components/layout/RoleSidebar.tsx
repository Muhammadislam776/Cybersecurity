import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  BellRing, 
  CheckSquare, 
  Radio, 
  FileSearch, 
  BookOpen, 
  Sparkles, 
  PlayCircle, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  Webhook, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  FileText,
  History,
  Settings,
  Server,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface RoleSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const RoleSidebar: React.FC<RoleSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser } = useAuth();
  const { approvals, incidents, tasks, alerts, isSimulationActive } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const role = currentUser?.role || 'Viewer';

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed').length;
  const openTasksCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'New').length;

  // Build items strictly per role specification (Phase 5)
  const getNavigationForRole = (userRole: UserRole) => {
    switch (userRole) {
      case 'Admin':
        return [
          {
            section: 'Platform Governance',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
              { id: 'system-settings', label: 'System Settings', icon: Settings },
            ]
          },
          {
            section: 'Operations & IR',
            items: [
              { id: 'incidents', label: 'Incidents', icon: Flame, badge: criticalIncidentsCount || undefined, badgeColor: 'bg-red-500 text-white' },
              { id: 'alerts', label: 'Alerts', icon: BellRing, badge: criticalAlertsCount || undefined, badgeColor: 'bg-orange-500 text-white' },
              { id: 'evidence', label: 'Evidence', icon: FileSearch },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: openTasksCount || undefined, badgeColor: 'bg-slate-200 text-slate-700' },
              { id: 'approvals', label: 'Approvals', icon: UserCheck, badge: pendingApprovalsCount || undefined, badgeColor: 'bg-orange-500 text-white' },
            ]
          },
          {
            section: 'Intelligence & Telemetry',
            items: [
              { id: 'runbooks', label: 'Runbooks', icon: BookOpen },
              { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-blue-100 text-blue-700' },
              { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
              { id: 'live-events', label: 'Live Events', icon: Radio, badge: 'LIVE', badgeColor: 'bg-emerald-100 text-emerald-800' },
              { id: 'integrations', label: 'Integrations', icon: Webhook },
              { id: 'simulations', label: 'Simulations', icon: PlayCircle, badge: isSimulationActive ? 'RUNNING' : undefined, badgeColor: 'bg-amber-500 text-white' },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
          }
        ];

      case 'Incident Commander':
        return [
          {
            section: 'Command Operations',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'incidents', label: 'My Incidents', icon: Flame, badge: criticalIncidentsCount || undefined, badgeColor: 'bg-red-500 text-white' },
              { id: 'alerts', label: 'Alerts', icon: BellRing, badge: criticalAlertsCount || undefined, badgeColor: 'bg-orange-500 text-white' },
              { id: 'timeline', label: 'Timeline', icon: History },
              { id: 'evidence', label: 'Evidence', icon: FileSearch },
              { id: 'tasks', label: 'Response Tasks', icon: CheckSquare, badge: openTasksCount || undefined, badgeColor: 'bg-slate-200 text-slate-700' },
            ]
          },
          {
            section: 'Investigation & Guidance',
            items: [
              { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-blue-100 text-blue-700' },
              { id: 'runbooks', label: 'Runbooks', icon: BookOpen },
              { id: 'approvals', label: 'Approvals', icon: UserCheck, badge: pendingApprovalsCount || undefined, badgeColor: 'bg-orange-500 text-white' },
              { id: 'live-events', label: 'Live Events', icon: Radio, badge: 'LIVE', badgeColor: 'bg-emerald-100 text-emerald-800' },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
          }
        ];

      case 'Security Analyst':
        return [
          {
            section: 'Investigation & Triage',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'alerts', label: 'Alerts', icon: BellRing, badge: criticalAlertsCount || undefined, badgeColor: 'bg-orange-500 text-white' },
              { id: 'incidents', label: 'Incidents', icon: Flame },
              { id: 'evidence', label: 'Evidence', icon: FileSearch },
            ]
          },
          {
            section: 'Analysis & Coordination',
            items: [
              { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-blue-100 text-blue-700' },
              { id: 'runbooks', label: 'Runbooks', icon: BookOpen },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'live-events', label: 'Live Events', icon: Radio, badge: 'LIVE', badgeColor: 'bg-emerald-100 text-emerald-800' },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
          }
        ];

      case 'Responder':
        return [
          {
            section: 'Assigned Action',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: openTasksCount || undefined, badgeColor: 'bg-blue-500 text-white' },
              { id: 'incidents', label: 'Assigned Incidents', icon: Flame },
              { id: 'alerts', label: 'Alerts', icon: BellRing },
            ]
          },
          {
            section: 'Execution & Playbooks',
            items: [
              { id: 'evidence', label: 'Evidence', icon: FileSearch },
              { id: 'runbooks', label: 'Runbooks', icon: BookOpen },
              { id: 'copilot', label: 'AI Recommendations', icon: Sparkles, badge: 'AI', badgeColor: 'bg-blue-100 text-blue-700' },
              { id: 'live-events', label: 'Live Events', icon: Radio, badge: 'LIVE', badgeColor: 'bg-emerald-100 text-emerald-800' },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
          }
        ];

      case 'Auditor':
        return [
          {
            section: 'Audit & Governance',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'incidents', label: 'Incidents', icon: Flame },
              { id: 'alerts', label: 'Alerts', icon: BellRing },
              { id: 'evidence', label: 'Evidence', icon: FileSearch },
              { id: 'approvals', label: 'Approvals', icon: UserCheck },
              { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
          }
        ];

      case 'Viewer':
      default:
        return [
          {
            section: 'Incident Visibility',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'incidents', label: 'Incidents', icon: Flame, badge: criticalIncidentsCount || undefined, badgeColor: 'bg-red-500 text-white' },
              { id: 'alerts', label: 'Alerts', icon: BellRing, badge: criticalAlertsCount || undefined, badgeColor: 'bg-orange-500 text-white' },
              { id: 'services', label: 'Services', icon: Server },
              { id: 'live-events', label: 'Live Events', icon: Radio, badge: 'LIVE', badgeColor: 'bg-emerald-100 text-emerald-800' },
              { id: 'timeline', label: 'Timeline', icon: History },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ]
          }
        ];
    }
  };

  const sections = getNavigationForRole(role);

  return (
    <aside 
      className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-bold text-slate-900 tracking-tight">CyberOps</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded shrink-0">
                  {role === 'Security Analyst' ? 'Analyst' : role === 'Incident Commander' ? 'Commander' : role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">SecOps Platform</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer ${collapsed ? 'hidden' : 'block'}`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Role Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            {!collapsed && (
              <h2 className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.section}
              </h2>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Role Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        {!collapsed ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-semibold text-slate-500">RBAC Role:</span>
            <span className="text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {role}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-1 text-slate-400 hover:text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
