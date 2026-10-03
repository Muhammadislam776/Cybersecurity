import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Flame, 
  Server, 
  CheckCircle2, 
  Clock, 
  Wrench,
  Trash2,
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ViewerNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'critical_incident' | 'service_degraded' | 'incident_resolved' | 'high_alert' | 'maintenance';
  read: boolean;
  incidentId?: string;
}

export const ViewerNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<ViewerNotification[]>([
    {
      id: 'notif-1',
      title: 'Critical Incident Detected',
      description: 'Incident INC-1042 escalated to Critical severity following payment API latency spike exceeding 3500ms.',
      timestamp: '2026-09-30T15:40:00Z',
      type: 'critical_incident',
      read: false,
      incidentId: 'INC-1042'
    },
    {
      id: 'notif-2',
      title: 'Service Degradation Detected',
      description: 'Database Cluster response latency degraded to 210ms due to replication delay on us-east-1 read replicas.',
      timestamp: '2026-09-30T15:15:00Z',
      type: 'service_degraded',
      read: false
    },
    {
      id: 'notif-3',
      title: 'New High-Severity Alert',
      description: 'CrowdStrike Falcon detected unusual PowerShell invocation pattern on ingress bastion host bastion-02.',
      timestamp: '2026-09-30T14:52:00Z',
      type: 'high_alert',
      read: false,
      incidentId: 'INC-1045'
    },
    {
      id: 'notif-4',
      title: 'Incident Resolved',
      description: 'Incident INC-1041 (Authentication Rate Limiting Spike) was closed following deployment rollback.',
      timestamp: '2026-09-30T14:10:00Z',
      type: 'incident_resolved',
      read: true,
      incidentId: 'INC-1041'
    },
    {
      id: 'notif-5',
      title: 'System Maintenance Scheduled',
      description: 'Routine maintenance window scheduled for Secondary Redis Cache on Oct 2 at 02:00 UTC.',
      timestamp: '2026-09-30T11:00:00Z',
      type: 'maintenance',
      read: true
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const getNotificationIcon = (type: ViewerNotification['type']) => {
    switch (type) {
      case 'critical_incident':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'service_degraded':
        return <Server className="w-4 h-4 text-orange-600" />;
      case 'high_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'incident_resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'maintenance':
      default:
        return <Wrench className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Operations Notification Center
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational event broadcasts, triage escalations, and system health status dispatches
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === 'all' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeFilter === 'unread' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications matching the selected filter.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => toggleRead(notif.id)}
              className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer hover:bg-slate-50 ${
                !notif.read ? 'bg-blue-50/20' : 'bg-white'
              }`}
            >
              <div className={`p-2 rounded-lg border shrink-0 ${
                !notif.read ? 'bg-white border-blue-200' : 'bg-slate-50 border-slate-200'
              }`}>
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    {formatDate(notif.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.description}
                </p>

                {notif.incidentId && (
                  <div className="mt-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200">
                      Target: {notif.incidentId}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRead(notif.id);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium px-2 py-1 rounded hover:bg-slate-100"
              >
                {notif.read ? 'Mark unread' : 'Mark read'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
        Notification acknowledgments are stored locally for the Viewer session and do not mutate incident records.
      </div>
    </div>
  );
};
