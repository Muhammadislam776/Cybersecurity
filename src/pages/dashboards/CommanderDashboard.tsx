import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleSidebar } from '../../components/layout/RoleSidebar';
import { RoleHeader } from '../../components/layout/RoleHeader';
import { GlobalSearchModal } from '../../components/layout/GlobalSearchModal';
import { ToastContainer } from '../../components/common/Toast';

// Feature Views
import { Dashboard } from '../../components/dashboard/Dashboard';
import { IncidentList } from '../../components/incidents/IncidentList';
import { IncidentDetails } from '../../components/incidents/IncidentDetails';
import { AlertCenter } from '../../components/alerts/AlertCenter';
import { EvidenceManager } from '../../components/evidence/EvidenceManager';
import { TaskManager } from '../../components/tasks/TaskManager';
import { ApprovalCenter } from '../../components/approvals/ApprovalCenter';
import { RunbookLibrary } from '../../components/runbooks/RunbookLibrary';
import { DedicatedCopilot } from '../../components/copilot/DedicatedCopilot';
import { AuditLogView } from '../../components/audit/AuditLogView';
import { LiveEventsView } from '../../components/live/LiveEventsView';
import { ViewerTimelinePage } from '../../components/viewer/ViewerTimelinePage';
import { ViewerReportsView } from '../../components/viewer/ViewerReportsView';
import { ViewerNotificationCenter } from '../../components/viewer/ViewerNotificationCenter';

export const CommanderDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'incidents':
        return <IncidentList />;
      case 'incident-details':
        return <IncidentDetails />;
      case 'alerts':
        return <AlertCenter />;
      case 'timeline':
        return <ViewerTimelinePage />;
      case 'evidence':
        return <EvidenceManager />;
      case 'tasks':
        return <TaskManager />;
      case 'approvals':
        return <ApprovalCenter />;
      case 'runbooks':
        return <RunbookLibrary />;
      case 'copilot':
        return <DedicatedCopilot />;
      case 'audit':
        return <AuditLogView />;
      case 'live-events':
        return <LiveEventsView />;
      case 'reports':
        return <ViewerReportsView />;
      case 'notifications':
        return <ViewerNotificationCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <RoleSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RoleHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};
