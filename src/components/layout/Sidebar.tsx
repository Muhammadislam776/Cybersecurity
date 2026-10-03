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
  ShieldAlert
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    incidents, 
    alerts, 
    approvals, 
    tasks, 
    isSimulationActive 
  } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed').length;
  const openTasksCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'New').length;

  const navigationSections: {
    title: string;
    items: {
      page: NavigationPage;
      label: string;
      icon: React.ElementType;
      badge?: number | string;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: 'Overview',
      items: [
        { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Operations',
      items: [
        { 
          page: 'incidents', 
          label: 'Incidents', 
          icon: Flame, 
          badge: criticalIncidentsCount > 0 ? criticalIncidentsCount : undefined,
          badgeColor: 'bg-red-500 text-white'
        },
        { 
          page: 'alerts', 
          label: 'Alerts', 
          icon: BellRing,
          badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
          badgeColor: 'bg-orange-500 text-white'
        },
        { 
          page: 'tasks', 
          label: 'Tasks', 
          icon: CheckSquare,
          badge: openTasksCount > 0 ? openTasksCount : undefined,
          badgeColor: 'bg-slate-200 text-slate-700'
        },
        { 
          page: 'live-events', 
          label: 'Live Events', 
          icon: Radio,
          badge: 'LIVE',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
      ],
    },
    {
      title: 'Investigation',
      items: [
        { page: 'evidence', label: 'Evidence', icon: FileSearch },
        { page: 'runbooks', label: 'Runbooks', icon: BookOpen },
        { page: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI', badgeColor: 'bg-blue-100 text-blue-700' },
        { 
          page: 'simulations', 
          label: 'Simulations', 
          icon: PlayCircle,
          badge: isSimulationActive ? 'ACTIVE' : undefined,
          badgeColor: 'bg-amber-500 text-white'
        },
      ],
    },
    {
      title: 'Governance',
      items: [
        { 
          page: 'approvals', 
          label: 'Approvals', 
          icon: UserCheck, 
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-orange-500 text-white'
        },
        { page: 'audit', label: 'Audit Logs', icon: ShieldCheck },
        { page: 'users', label: 'Users & Roles', icon: Users },
      ],
    },
    {
      title: 'Integrations',
      items: [
        { page: 'integrations', label: 'Webhooks & Integrations', icon: Webhook },
      ],
    },
  ];

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
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate flex items-center gap-1.5">
                <span>CyberOps</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  IR
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 truncate">Incident Management</p>
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

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navigationSections.map((section, sIdx) => (
          <div key={sIdx}>
            {!collapsed && (
              <h2 className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </h2>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.page || (item.page === 'incidents' && activePage === 'incident-details');

                return (
                  <button
                    key={item.page}
                    onClick={() => setActivePage(item.page)}
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

      {/* Simulation Banner in Sidebar */}
      {isSimulationActive && !collapsed && (
        <div className="p-3 m-2 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Simulation Sandbox</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1">No production changes are being made.</p>
        </div>
      )}

      {/* Footer Toggle */}
      <div className="p-2 border-t border-slate-200">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
