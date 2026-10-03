import React from 'react';
import { 
  Flame, 
  BellRing, 
  CheckSquare, 
  UserCheck, 
  Clock, 
  Sparkles, 
  PlayCircle, 
  ArrowUpRight, 
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { formatRelativeTime } from '../../utils/formatters';

export const Dashboard: React.FC = () => {
  const { 
    incidents, 
    alerts, 
    tasks, 
    approvals, 
    diagnostics, 
    simulations,
    liveEvents,
    navigateToIncident,
    setActivePage,
    approveAction,
    currentUser,
    checkPermission
  } = useApp();

  const activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');
  const criticalIncidents = activeIncidents.filter(i => i.severity === 'Critical');
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
  const openTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  // Severity counts
  const criticalCount = activeIncidents.filter(i => i.severity === 'Critical').length;
  const highCount = activeIncidents.filter(i => i.severity === 'High').length;
  const mediumCount = activeIncidents.filter(i => i.severity === 'Medium').length;
  const lowCount = activeIncidents.filter(i => i.severity === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Security Operations Hero Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/soc_command_center.jpg" 
            alt="CyberOps 24/7 Security Operations Center" 
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-blue-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DEFCON 3 / ACTIVE MONITORING
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                SOCKET LATENCY: 12ms
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Unified Security Operations Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time multi-vector threat detection, autonomous triage correlation, and human-authorized containment workflows across hybrid cloud infrastructure.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                CrowdStrike EDR Connected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AWS GuardDuty Synced
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AI Copilot Standing By
              </span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 backdrop-blur-md">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Threat Containment Index</div>
                <div className="text-base font-black text-emerald-400 font-mono">98.4% SAFE</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SecurityBadge type="rbac_enforced" size="sm" />
              <SecurityBadge type="audit_logged" size="sm" />
              <SecurityBadge type="ai_generated" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* Active Incidents */}
        <div 
          onClick={() => setActivePage('incidents')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Active Incidents</span>
            <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-slate-900">{activeIncidents.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-1">
            <span>{criticalIncidents.length} Critical</span>
          </div>
        </div>

        {/* Critical Alerts */}
        <div 
          onClick={() => setActivePage('alerts')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Critical Alerts</span>
            <BellRing className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-slate-900">{criticalAlerts.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            <span>{alerts.length} total alerts</span>
          </div>
        </div>

        {/* Open Tasks */}
        <div 
          onClick={() => setActivePage('tasks')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Open Tasks</span>
            <CheckSquare className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-slate-900">{openTasks.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            <span>{tasks.filter(t => t.status === 'Completed').length} resolved</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div 
          onClick={() => setActivePage('approvals')}
          className="p-3.5 bg-white rounded-xl border border-orange-200 bg-orange-50/20 hover:border-orange-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-orange-700">Pending Approvals</span>
            <UserCheck className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-orange-900">{pendingApprovals.length}</div>
          <div className="text-[11px] text-orange-700 font-medium mt-1">
            <span>Awaiting sign-off</span>
          </div>
        </div>

        {/* MTTA */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500">MTTA</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900">2.4m</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>-18% vs avg</span>
          </div>
        </div>

        {/* MTTR */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500">MTTR</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-900">42m</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Target &lt;60m</span>
          </div>
        </div>

        {/* AI Recommendations */}
        <div 
          onClick={() => setActivePage('copilot')}
          className="p-3.5 bg-white rounded-xl border border-blue-200 bg-blue-50/10 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-blue-700">AI Copilot</span>
            <Sparkles className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-blue-900">{diagnostics.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            <span>Diagnostics generated</span>
          </div>
        </div>

        {/* Active Simulations */}
        <div 
          onClick={() => setActivePage('simulations')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Simulations</span>
            <PlayCircle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-slate-900">{simulations.length}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            <span>Ready scenarios</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Severity Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Incidents by Severity
            </h3>
            <span className="text-xs text-slate-400 font-medium">{activeIncidents.length} active</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-red-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Critical
                </span>
                <span className="text-slate-700 font-bold">{criticalCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(criticalCount / Math.max(1, activeIncidents.length)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-orange-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  High
                </span>
                <span className="text-slate-700 font-bold">{highCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(highCount / Math.max(1, activeIncidents.length)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Medium
                </span>
                <span className="text-slate-700 font-bold">{mediumCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(mediumCount / Math.max(1, activeIncidents.length)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Low
                </span>
                <span className="text-slate-700 font-bold">{lowCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(lowCount / Math.max(1, activeIncidents.length)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SLA Response Compliance</span>
            <span className="font-bold text-emerald-600">98.2% on target</span>
          </div>
        </div>

        {/* 24-Hour Alert Volume & Incident Velocity Trend (Custom SVG Chart) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                24-Hour Telemetry Alert Ingestion & Trend
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Aggregated ingestion across WAF, GuardDuty, SIEM, and APM</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                Alerts
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                Incidents
              </span>
            </div>
          </div>

          {/* Clean High-Resolution SVG Area & Column Trend Chart */}
          <div className="h-44 w-full relative flex items-end gap-2 pt-6">
            {[
              { hour: '00:00', alerts: 18, inc: 0 },
              { hour: '03:00', alerts: 12, inc: 0 },
              { hour: '06:00', alerts: 24, inc: 1 },
              { hour: '09:00', alerts: 45, inc: 2 },
              { hour: '11:00', alerts: 68, inc: 1 },
              { hour: '13:00', alerts: 92, inc: 3 },
              { hour: '14:00', alerts: 145, inc: 5 },
              { hour: '15:00', alerts: 120, inc: 4 },
              { hour: 'Now', alerts: 88, inc: 2 },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  {/* Alert bar */}
                  <div 
                    className="w-3/5 bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all duration-300 relative group-hover:scale-y-105"
                    style={{ height: `${(col.alerts / 150) * 100}%` }}
                    title={`${col.alerts} alerts at ${col.hour}`}
                  />
                  {/* Incident bar */}
                  <div 
                    className="w-2/5 bg-orange-500 hover:bg-orange-600 rounded-t-sm transition-all duration-300 relative group-hover:scale-y-105"
                    style={{ height: `${(col.inc / 6) * 70}%` }}
                    title={`${col.inc} incidents at ${col.hour}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-2 group-hover:text-slate-800 transition-colors">
                  {col.hour}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Peak Velocity: <strong className="text-slate-800">145 events/min</strong> (14:32 UTC Incident #INC-2026-0891)</span>
            <span className="text-blue-600 font-semibold flex items-center gap-1 cursor-pointer" onClick={() => setActivePage('alerts')}>
              View Full Alert Feed <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Operations Row: Recent Incidents & Pending Approvals Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recent Security Incidents
              </h3>
              <p className="text-[11px] text-slate-400">High priority operational investigations</p>
            </div>
            <button
              onClick={() => setActivePage('incidents')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({incidents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="pb-2.5">ID</th>
                  <th className="pb-2.5">Incident Title</th>
                  <th className="pb-2.5">Severity</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Service</th>
                  <th className="pb-2.5">Commander</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.slice(0, 5).map((inc) => (
                  <tr 
                    key={inc.id}
                    onClick={() => navigateToIncident(inc.id, 'overview')}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 font-mono font-semibold text-slate-800">{inc.id}</td>
                    <td className="py-3 font-medium text-slate-900 max-w-xs truncate">{inc.title}</td>
                    <td className="py-3">
                      <Badge variant="severity" severity={inc.severity} size="sm">{inc.severity}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="status" status={inc.status} size="sm">{inc.status}</Badge>
                    </td>
                    <td className="py-3 text-slate-600 font-mono text-[11px]">{inc.affectedService}</td>
                    <td className="py-3 text-slate-600">{inc.incidentCommander}</td>
                    <td className="py-3 text-right">
                      <span className="text-blue-600 font-semibold group-hover:underline flex items-center justify-end gap-1">
                        Investigate <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals Quick Queue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pending Approvals ({pendingApprovals.length})
                </h3>
              </div>
              <SecurityBadge type="human_approval_required" size="sm" />
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              AI Copilot diagnostic mitigations awaiting authorized human sign-off.
            </p>

            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No approval requests currently pending.
                </div>
              ) : (
                pendingApprovals.slice(0, 3).map((apr) => (
                  <div key={apr.id} className="p-3 rounded-lg border border-orange-200 bg-orange-50/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-orange-800">{apr.id}</span>
                      <Badge variant="risk" risk={apr.riskLevel} size="sm">{apr.riskLevel} Risk</Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 leading-snug">{apr.actionTitle}</p>
                    <p className="text-[11px] text-slate-500 truncate">Incident: {apr.incidentTitle}</p>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-orange-200/50">
                      <button
                        onClick={() => navigateToIncident(apr.incidentId, 'approvals')}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded cursor-pointer"
                      >
                        Inspect Details
                      </button>
                      {checkPermission('approve_actions') && (
                        <button
                          onClick={() => approveAction(apr.id, 'Approved via Dashboard Quick Queue')}
                          className="text-[11px] font-bold text-white bg-orange-600 hover:bg-orange-700 px-2.5 py-1 rounded shadow-xs cursor-pointer transition-colors"
                        >
                          Approve Now
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActivePage('approvals')}
            className="w-full mt-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-lg transition-colors text-center cursor-pointer"
          >
            Open Approval Center
          </button>
        </div>
      </div>

      {/* Bottom Insights Row: AI Operational Insights & Live Feed Stream Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Operational Insights */}
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                AI Operational Copilot Insights
              </h3>
            </div>
            <SecurityBadge type="ai_generated" size="sm" />
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs leading-relaxed text-slate-700">
              <p className="font-semibold text-blue-900 mb-1">
                Correlation Alert: Payment API Latency vs ASN 14061 Influx
              </p>
              Telemetry across Envoy ingress logs indicates that 64% of incoming HTTP 504 errors on payment-gateway-api correlate directly with an unthrottled brute-force replay originating from ASN 14061.
              <div className="mt-2 text-[11px] text-blue-800 font-medium">
                → Recommended Runbook: <strong>Distributed API Outage & Latency Escalation (v2.4.1)</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">
                Database Lock Contention Forecast
              </p>
              PostgreSQL primary cluster connection pool is operating at 98% saturation. Killing long-running PID 4491 will release table locks and prevent an impending 500 error cascade on checkout.
            </div>
          </div>
        </div>

        {/* Live Event Feed Widget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-live-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Live Security Telemetry Stream
              </h3>
            </div>
            <button
              onClick={() => setActivePage('live-events')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Full Stream ({liveEvents.length})
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {liveEvents.slice(0, 5).map((evt) => (
              <div key={evt.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 truncate">{evt.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">
                      {formatRelativeTime(evt.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
