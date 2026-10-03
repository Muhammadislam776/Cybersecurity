import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleSidebar } from '../../components/layout/RoleSidebar';
import { RoleHeader } from '../../components/layout/RoleHeader';
import { GlobalSearchModal } from '../../components/layout/GlobalSearchModal';
import { ToastContainer } from '../../components/common/Toast';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import { Incident } from '../../types';

// Viewer Specific Components
import { ViewerKpiGrid } from '../../components/viewer/ViewerKpiGrid';
import { ViewerServiceHealth } from '../../components/viewer/ViewerServiceHealth';
import { ViewerIncidentTable } from '../../components/viewer/ViewerIncidentTable';
import { ViewerIncidentDetailModal } from '../../components/viewer/ViewerIncidentDetailModal';
import { ViewerAiInsights } from '../../components/viewer/ViewerAiInsights';
import { ViewerLiveEventsWidget } from '../../components/viewer/ViewerLiveEventsWidget';
import { ViewerSecurityStatus } from '../../components/viewer/ViewerSecurityStatus';
import { ViewerAnalyticsTrends } from '../../components/viewer/ViewerAnalyticsTrends';
import { ViewerAlertMonitor } from '../../components/viewer/ViewerAlertMonitor';
import { ViewerServiceHealthPage } from '../../components/viewer/ViewerServiceHealthPage';
import { ViewerTimelinePage } from '../../components/viewer/ViewerTimelinePage';
import { ViewerReportsView } from '../../components/viewer/ViewerReportsView';
import { ViewerNotificationCenter } from '../../components/viewer/ViewerNotificationCenter';
import { ViewerQuickAccess } from '../../components/viewer/ViewerQuickAccess';
import { ViewerVisualTelemetryCards } from '../../components/viewer/ViewerVisualTelemetryCards';

import { 
  Lock, 
  RotateCw, 
  Eye, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const ViewerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Access Navigation Shortcuts */}
            <ViewerQuickAccess onNavigate={(tab) => setCurrentTab(tab)} />

            {/* Top 6 KPI Metric Cards */}
            {isRefreshing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 h-28 animate-pulse space-y-3">
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                    <div className="h-7 bg-slate-200 rounded w-1/2" />
                    <div className="h-2.5 bg-slate-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <ViewerKpiGrid />
            )}

            {/* Visual Telemetry Showcase (Datacenter, Radar, Command Center) */}
            <ViewerVisualTelemetryCards />

            {/* Analytics Trends & Service Health Grid */}
            <div className="space-y-4">
              <ViewerAnalyticsTrends />
              <ViewerServiceHealth onViewAllServices={() => setCurrentTab('services')} />
            </div>

            {/* Active Incidents Overview Table */}
            <ViewerIncidentTable 
              onSelectIncident={(inc) => setSelectedIncident(inc)} 
              limit={5}
              showAllLink={() => setCurrentTab('incidents')}
              title="Recent Active Incidents"
            />

            {/* Live Events & AI Insights + Security Enforcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ViewerLiveEventsWidget 
                onViewAll={() => setCurrentTab('live-events')} 
                limit={6}
              />
              <ViewerAiInsights />
            </div>

            {/* Security Status Card */}
            <ViewerSecurityStatus />
          </div>
        );

      case 'incidents':
        return (
          <div className="space-y-4">
            <ViewerIncidentTable 
              onSelectIncident={(inc) => setSelectedIncident(inc)} 
              title="All Incidents & Operations Audit Records"
            />
          </div>
        );

      case 'alerts':
        return <ViewerAlertMonitor />;

      case 'services':
        return <ViewerServiceHealthPage />;

      case 'live-events':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <ViewerLiveEventsWidget limit={25} />
            </div>
          </div>
        );

      case 'timeline':
        return <ViewerTimelinePage />;

      case 'reports':
        return <ViewerReportsView />;

      case 'notifications':
        return <ViewerNotificationCenter />;

      default:
        return <ViewerKpiGrid />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      <RoleSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RoleHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Top Clearance Header Strip */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 border border-slate-700/60 shadow-md">
              <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-bold text-white tracking-tight">
                        SecOps Visibility & Monitoring Console
                      </h2>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        CLEARANCE: VIEWER (READ-ONLY)
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        TELEMETRY CONNECTED
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Authenticated as <span className="text-white font-semibold">{currentUser?.name}</span> • Continuous real-time anomaly monitoring & situational audit log
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    title="Force resync telemetry"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
                    <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
                  </button>
                  <SecurityBadge type="rbac_enforced" size="sm" />
                </div>
              </div>
            </div>

            {/* Dynamic Tab Body */}
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Read-Only Incident Inspector Modal */}
      {selectedIncident && (
        <ViewerIncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};
