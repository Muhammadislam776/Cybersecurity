import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Flame, 
  Clock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  FileSearch, 
  CheckSquare, 
  UserCheck, 
  BookOpen, 
  History, 
  BellRing, 
  Share2, 
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Play,
  Plus,
  Send,
  Lock,
  Download,
  Copy,
  Terminal,
  Server
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { RedactedText } from '../common/RedactedText';
import { ConfirmModal } from '../common/ConfirmModal';
import { Modal } from '../common/Modal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { formatShortHash } from '../../utils/crypto';
import { IncidentStatus, SeverityLevel, TaskPriority, TaskStatus } from '../../types';

export const IncidentDetails: React.FC = () => {
  const { 
    selectedIncidentId, 
    incidents, 
    alerts, 
    evidence, 
    tasks, 
    approvals, 
    diagnostics, 
    timeline, 
    auditLogs, 
    approvedRunbooks,
    activeIncidentTab, 
    setActiveIncidentTab, 
    setActivePage,
    updateIncident,
    addEvidence,
    addTask,
    updateTaskStatus,
    executeDiagnosticRecommendation,
    approveAction,
    rejectAction,
    currentUser,
    checkPermission
  } = useApp();

  const incident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  // Modal states
  const [statusConfirmModalOpen, setStatusConfirmModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>(incident.status);
  const [statusReason, setStatusReason] = useState('');

  // Add Evidence modal
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<any>('log_snippet');
  const [evidenceSource, setEvidenceSource] = useState('prod-app-server-01');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [evidenceContent, setEvidenceContent] = useState('');

  // Add Task modal
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('David Chen');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('P1 - Urgent');
  const [taskApprovalReq, setTaskApprovalReq] = useState(false);

  // Quick Approval modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [approvalJustification, setApprovalJustification] = useState('');

  // Copilot Interactive Prompt
  const [copilotPrompt, setCopilotPrompt] = useState('');
  const [copilotResponses, setCopilotResponses] = useState<{ query: string; response: string; timestamp: string }[]>([
    {
      query: 'What is the preliminary blast radius of this incident?',
      response: 'Based on correlated Envoy ingress logs (ALT-9041) and socket starvation diagnostics (DIA-101), the blast radius is confined to payment-gateway-api and its downstream checkout queue. 420 transactions have timed out, but authentication vaults and customer databases remain uncompromised.',
      timestamp: '14:52 UTC'
    }
  ]);

  if (!incident) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600">Incident not found.</p>
        <button
          onClick={() => setActivePage('incidents')}
          className="mt-3 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg"
        >
          Back to Incidents
        </button>
      </div>
    );
  }

  // Related data filters
  const incidentAlerts = alerts.filter(a => a.relatedIncidentId === incident.id || incident.relatedAlertIds.includes(a.id));
  const incidentEvidence = evidence.filter(e => e.incidentId === incident.id);
  const incidentTasks = tasks.filter(t => t.incidentId === incident.id);
  const incidentApprovals = approvals.filter(a => a.incidentId === incident.id);
  const incidentDiagnostics = diagnostics.filter(d => d.incidentId === incident.id);
  const incidentTimeline = timeline.filter(t => t.metadata?.incidentId === incident.id || true); // mock timeline events
  const incidentAuditLogs = auditLogs.filter(a => a.incidentId === incident.id || a.resource.includes(incident.id));
  const matchedRunbooks = approvedRunbooks.filter(r => 
    r.matchedIncidentTypes.some(tag => incident.tags.includes(tag) || incident.affectedService.toLowerCase().includes(tag.toLowerCase()))
  );

  const canManageIncidents = checkPermission('manage_incidents');
  const canApprove = checkPermission('approve_actions');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Flame },
    { id: 'timeline', label: 'Timeline', icon: History, count: incidentTimeline.length },
    { id: 'alerts', label: 'Alerts', icon: BellRing, count: incidentAlerts.length },
    { id: 'evidence', label: 'Evidence', icon: FileSearch, count: incidentEvidence.length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: incidentTasks.length },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'runbooks', label: 'Runbooks', icon: BookOpen, count: matchedRunbooks.length },
    { id: 'approvals', label: 'Approvals', icon: UserCheck, count: incidentApprovals.filter(a => a.status === 'Pending').length },
    { id: 'audit', label: 'Audit', icon: ShieldCheck, count: incidentAuditLogs.length },
  ];

  const handleStatusChangeClick = (newStatus: IncidentStatus) => {
    if (!canManageIncidents) return;
    setTargetStatus(newStatus);
    setStatusConfirmModalOpen(true);
  };

  const confirmStatusChange = () => {
    updateIncident(incident.id, { status: targetStatus });
    setStatusConfirmModalOpen(false);
    setStatusReason('');
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceContent.trim()) return;

    addEvidence({
      incidentId: incident.id,
      title: evidenceTitle,
      type: evidenceType,
      source: evidenceSource,
      description: evidenceDesc,
      content: evidenceContent,
      collectedBy: currentUser.name,
      fileSize: `${(evidenceContent.length / 1024).toFixed(1)} KB`
    });

    setEvidenceModalOpen(false);
    setEvidenceTitle('');
    setEvidenceDesc('');
    setEvidenceContent('');
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      incidentId: incident.id,
      title: taskTitle,
      description: taskDesc,
      assignedTo: taskAssignee,
      priority: taskPriority,
      status: 'Pending',
      dueTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      approvalRequired: taskApprovalReq
    });

    setTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleCopilotAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotPrompt.trim()) return;

    const query = copilotPrompt;
    setCopilotPrompt('');

    // Simulated Copilot intelligence engine
    let responseText = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('summary') || qLower.includes('what happened')) {
      responseText = `Incident Summary: ${incident.aiSummary?.summary} Affected services include ${incident.affectedSystems.join(', ')}. Started at ${incident.aiSummary?.startedAt}.`;
    } else if (qLower.includes('runbook') || qLower.includes('procedure')) {
      responseText = `Retrieved approved runbooks: ${matchedRunbooks.map(r => `${r.name} (${r.version})`).join(', ')}. Next recommended step: Step 2: Compare Current Traffic Baseline with Anomaly Window.`;
    } else if (qLower.includes('action') || qLower.includes('recommend') || qLower.includes('fix')) {
      responseText = `Recommended Diagnostic Action: Inspect Envoy Ingress Socket Queue & Upstream Latency. Risk Level: Low. No production modification will occur without Human Approval.`;
    } else {
      responseText = `AI Copilot Analysis: Based on telemetry parameters, service "${incident.affectedService}" shows elevated error rates. Diagnostic recommendations have been populated in the diagnostics queue. Notice: AI recommends only, human approval is required for system changes.`;
    }

    setCopilotResponses(prev => [
      ...prev,
      {
        query,
        response: responseText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC'
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('incidents')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Incidents</span>
        </button>

        <div className="flex items-center gap-2">
          <SecurityBadge type="rbac_enforced" size="sm" />
          <SecurityBadge type="audit_logged" size="sm" />
        </div>
      </div>

      {/* Incident War Room Visual Header Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/incident_command_warroom.jpg" 
            alt="CSIRT Incident Command War Room" 
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-sm font-bold text-white bg-slate-800/90 px-2.5 py-0.5 rounded border border-slate-700">
                  {incident.id}
                </span>
                <Badge variant="severity" severity={incident.severity}>
                  {incident.severity}
                </Badge>
                <Badge variant="status" status={incident.status}>
                  {incident.status}
                </Badge>
                {incident.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-medium border border-slate-700/60">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-white leading-snug">
                {incident.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {incident.description}
              </p>
            </div>

            {/* Incident Status Transitions */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              {canManageIncidents && (
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-lg border border-slate-700 backdrop-blur-md">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase px-1">Transition:</span>
                  {(['Investigating', 'Mitigating', 'Resolved', 'Closed'] as IncidentStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChangeClick(st)}
                      disabled={incident.status === st}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        incident.status === st 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="block text-[11px] font-semibold uppercase text-slate-400">Commander</span>
              <span className="font-semibold text-white">{incident.incidentCommander}</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase text-slate-400">Assigned Responder</span>
              <span className="font-semibold text-white">{incident.assignedResponder}</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase text-slate-400">Affected Service</span>
              <span className="font-mono text-blue-400 font-semibold">{incident.affectedService}</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase text-slate-400">MTTA (Acknowledge)</span>
              <span className="font-semibold text-emerald-400">{incident.mttaMinutes}m (Met SLA)</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase text-slate-400">Created Time</span>
              <span className="font-mono text-slate-400 text-[11px]">{formatDate(incident.createdTime)}</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase text-slate-400">Last Updated</span>
              <span className="font-mono text-slate-400 text-[11px]">{formatRelativeTime(incident.updatedTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9 Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeIncidentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveIncidentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 shadow-xs min-h-[400px]">
        {/* TAB 1: OVERVIEW */}
        {activeIncidentTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Synthesized Executive Summary */}
            {incident.aiSummary && (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      AI Incident Synthesis & Impact Analysis
                    </h3>
                  </div>
                  <SecurityBadge type="ai_generated" size="sm" />
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  &quot;{incident.aiSummary.summary}&quot;
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-800 block mb-1">What Happened:</span>
                    <p className="text-slate-600 leading-relaxed">{incident.aiSummary.whatHappened}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-800 block mb-1">Current Impact:</span>
                    <p className="text-slate-600 leading-relaxed">{incident.aiSummary.currentImpact}</p>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block mb-1.5">
                    Known Indicators:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                    {incident.aiSummary.knownIndicators.map((ind, idx) => (
                      <li key={idx}>{ind}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Systems & Blast Radius */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Affected Systems & Infrastructure Topology
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {incident.affectedSystems.map((sys, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <Server className="w-5 h-5 text-slate-500" />
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-slate-800 truncate">{sys}</p>
                      <p className="text-[10px] text-slate-400">Node Status: Degraded</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Operational Response Protocol</h4>
                <p className="text-[11px] text-slate-500">
                  Follow the approved runbook or consult the AI Copilot for safe diagnostic recommendations.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveIncidentTab('copilot')}
                  className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Copilot</span>
                </button>
                <button
                  onClick={() => setActiveIncidentTab('runbooks')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Runbooks ({matchedRunbooks.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeIncidentTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Incident Investigation Timeline
                </h3>
                <p className="text-[11px] text-slate-400">Chronological telemetry, annotations, and system state transitions</p>
              </div>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {incidentTimeline.map((item, idx) => (
                <div key={item.id || idx} className="relative group">
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="font-mono text-[11px] text-slate-400">{formatDate(item.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    <div className="mt-2 text-[10px] font-semibold text-slate-400 uppercase">
                      Actor: {item.actor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALERTS */}
        {activeIncidentTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Correlated Telemetry Alerts ({incidentAlerts.length})
                </h3>
                <p className="text-[11px] text-slate-400">Inbound alerts mapped to this security incident</p>
              </div>
            </div>

            {incidentAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No telemetry alerts directly mapped to this incident.
              </div>
            ) : (
              <div className="space-y-3">
                {incidentAlerts.map((alt) => (
                  <div key={alt.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{alt.id}</span>
                        <Badge variant="severity" severity={alt.severity} size="sm">{alt.severity}</Badge>
                        <span className="text-xs text-slate-500 font-medium">{alt.source}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{formatRelativeTime(alt.timestamp)}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{alt.title}</h4>
                    <p className="text-xs text-slate-600">Detection Type: {alt.detectionType}</p>

                    {/* Raw Telemetry JSON Payload with Secret Redaction */}
                    <div className="mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Correlated Sensor Payload (Auto-Redacted):
                      </span>
                      <RedactedText content={JSON.stringify(alt.rawPayload, null, 2)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EVIDENCE */}
        {activeIncidentTab === 'evidence' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Forensic Evidence Repository</span>
                  <SecurityBadge type="audit_logged" size="sm" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Cryptographically sealed artifacts with automated secret redaction & SHA-256 chain of custody.
                </p>
              </div>

              {checkPermission('add_evidence') && (
                <button
                  onClick={() => setEvidenceModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Forensic Artifact</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {incidentEvidence.map((evd) => (
                <div key={evd.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {evd.id}
                      </span>
                      <span className="font-bold text-slate-900">{evd.title}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {evd.type}
                      </span>
                      {evd.redacted && <SecurityBadge type="secret_redacted" size="sm" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Source: {evd.source}</span>
                      <span>•</span>
                      <span>Collected: {formatRelativeTime(evd.collectionTimestamp)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{evd.description}</p>

                  {/* Redacted Content Viewer */}
                  <div>
                    <RedactedText content={evd.content} />
                  </div>

                  {/* Tamper-Evident SHA-256 Seal & Chain of Custody */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-700">SHA-256 Hash:</span>
                      <span className="font-mono text-slate-600">{evd.hash}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 rounded">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Chain of Custody: {evd.collectedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TASKS */}
        {activeIncidentTab === 'tasks' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Response Action Tasks ({incidentTasks.length})
                </h3>
                <p className="text-[11px] text-slate-400">Checklist of mitigation, forensics, and remediation work items</p>
              </div>

              {checkPermission('manage_tasks') && (
                <button
                  onClick={() => setTaskModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {incidentTasks.map((task) => (
                <div key={task.id} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700">{task.id}</span>
                      <span className="text-xs font-bold text-slate-900">{task.title}</span>
                      <Badge variant="status" status={task.status} size="sm">{task.status}</Badge>
                      {task.approvalRequired && <SecurityBadge type="human_approval_required" size="sm" />}
                    </div>
                    <p className="text-xs text-slate-600">{task.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Assigned: <strong>{task.assignedTo}</strong></span>
                      <span>Priority: <strong>{task.priority}</strong></span>
                      <span>Due: <strong>{formatRelativeTime(task.dueTime)}</strong></span>
                    </div>
                  </div>

                  {/* Task Status Transitions */}
                  {checkPermission('manage_tasks') && (
                    <div className="flex items-center gap-1.5">
                      {task.status !== 'Completed' ? (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Done
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AI COPILOT */}
        {activeIncidentTab === 'copilot' && (
          <div className="space-y-6">
            {/* Safety Architecture Banner */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Incident Copilot — Guardrail Safety Model</span>
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  <strong>Observe & Recommend Only:</strong> The AI cannot execute infrastructure changes, delete data, or modify configurations directly. All actions require explicit human sign-off.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SecurityBadge type="human_approval_required" size="sm" />
                <SecurityBadge type="ai_generated" size="sm" />
              </div>
            </div>

            {/* Diagnostic Recommendations Queue */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Recommended Safe Diagnostic Actions
              </h4>
              <div className="space-y-3">
                {incidentDiagnostics.map((diag) => (
                  <div key={diag.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{diag.id}</span>
                        <span className="font-bold text-slate-900">{diag.actionName}</span>
                        <Badge variant="risk" risk={diag.riskLevel} size="sm">{diag.riskLevel} Risk</Badge>
                        <Badge variant="status" status={diag.status as any} size="sm">{diag.status}</Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Permission: {diag.requiredPermission}</span>
                    </div>

                    <p className="text-xs text-slate-600">{diag.description}</p>
                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Why Recommended:</strong> {diag.whyRecommended}
                    </div>

                    {diag.executionResult && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono">
                        <strong>Observed Output:</strong> {diag.executionResult}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500">
                        {diag.approvalRequired ? 'Requires Commander Approval' : 'Safe Read-Only Diagnostic'}
                      </span>
                      {diag.status !== 'Executed' && (
                        <button
                          onClick={() => executeDiagnosticRecommendation(diag.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer ${
                            diag.approvalRequired 
                              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {diag.approvalRequired ? 'Request Approval' : 'Run Diagnostic'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Copilot Query Console */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Interactive Incident Intelligence Assistant</span>
              </h4>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {copilotResponses.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-100/60 font-semibold text-blue-900 text-right">
                      {item.query}
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 leading-relaxed shadow-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-[11px] text-blue-700 uppercase">AI Copilot</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      {item.response}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCopilotAsk} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={copilotPrompt}
                  onChange={(e) => setCopilotPrompt(e.target.value)}
                  placeholder="Ask Copilot: 'Summarize blast radius', 'Find approved runbook', 'Analyze log evidence'..."
                  className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 7: RUNBOOKS */}
        {activeIncidentTab === 'runbooks' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Approved Standard Operating Procedures & Runbooks
                </h3>
                <p className="text-[11px] text-slate-400">Strictly verified runbooks matching incident classification</p>
              </div>
            </div>

            <div className="space-y-4">
              {matchedRunbooks.map((rbk) => (
                <div key={rbk.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{rbk.id}</span>
                      <h4 className="text-xs font-bold text-slate-900">{rbk.name}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rbk.version} {rbk.approvalStatus}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Owner: {rbk.owner}</span>
                  </div>

                  <p className="text-xs text-slate-600">{rbk.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Standard Procedure Steps:
                    </span>
                    {rbk.steps.map((st) => (
                      <div key={st.stepNumber} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 text-xs">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {st.stepNumber}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{st.title}</span>
                            <Badge variant="risk" risk={st.risk} size="sm">{st.risk} Risk</Badge>
                          </div>
                          <p className="text-slate-600 mt-0.5">{st.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: APPROVALS */}
        {activeIncidentTab === 'approvals' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Human-in-the-Loop Approval Queue</span>
                  <SecurityBadge type="human_approval_required" size="sm" />
                </h3>
                <p className="text-[11px] text-slate-400">Actions requiring explicit Commander/Admin authorization</p>
              </div>
            </div>

            <div className="space-y-3">
              {incidentApprovals.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No approval requests recorded for this incident.
                </div>
              ) : (
                incidentApprovals.map((apr) => (
                  <div key={apr.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{apr.id}</span>
                        <h4 className="font-bold text-slate-900">{apr.actionTitle}</h4>
                        <Badge variant="risk" risk={apr.riskLevel} size="sm">{apr.riskLevel} Risk</Badge>
                        <Badge variant="status" status={apr.status as any} size="sm">{apr.status}</Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Created: {formatRelativeTime(apr.createdTime)}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div><strong>Command / Action:</strong> <span className="font-mono text-slate-800">{apr.requestedAction}</span></div>
                      <div><strong>Justification:</strong> <span className="text-slate-700">{apr.reason}</span></div>
                      <div><strong>Requested By:</strong> <span className="text-slate-700">{apr.requestedBy}</span></div>
                    </div>

                    {apr.reviewedBy && (
                      <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
                        ✓ Reviewed by <strong>{apr.reviewedBy}</strong> ({formatRelativeTime(apr.reviewTimestamp || '')}): &quot;{apr.reviewComment}&quot;
                      </div>
                    )}

                    {apr.status === 'Pending' && canApprove && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => rejectAction(apr.id, 'Denied per Incident Commander assessment')}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApprovalId(apr.id);
                            setApprovalModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Review & Authorize Action
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 9: AUDIT */}
        {activeIncidentTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Incident Immutable Audit History</span>
                  <SecurityBadge type="audit_logged" size="sm" />
                </h3>
                <p className="text-[11px] text-slate-400">Append-only cryptographic state transitions</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Event ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor & Role</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">SHA-256 State Hash</th>
                    <th className="py-2.5 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incidentAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{log.id}</td>
                      <td className="py-2.5 px-3 text-slate-500">{formatDate(log.timestamp)}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-800">
                        {log.user} ({log.role})
                      </td>
                      <td className="py-2.5 px-3 font-sans font-bold text-blue-600">{log.action}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          log.result === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{formatShortHash(log.currentStateHash)}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 max-w-xs truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Status Change */}
      <ConfirmModal
        isOpen={statusConfirmModalOpen}
        onClose={() => setStatusConfirmModalOpen(false)}
        onConfirm={confirmStatusChange}
        title={`Transition Incident to ${targetStatus}`}
        message={`Are you sure you want to transition this incident from "${incident.status}" to "${targetStatus}"? This state change will be appended to the immutable audit log.`}
        confirmLabel={`Transition to ${targetStatus}`}
        requiresReason={true}
        reasonValue={statusReason}
        onReasonChange={setStatusReason}
      />

      {/* Confirmation Modal for Human Approval */}
      <ConfirmModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onConfirm={() => {
          if (selectedApprovalId) {
            approveAction(selectedApprovalId, approvalJustification);
            setApprovalJustification('');
          }
        }}
        title="Authorize Diagnostic Action Execution"
        message="You are approving this diagnostic action. This approval will be recorded in the immutable audit log and will trigger mock/simulation execution."
        confirmLabel="Authorize & Execute"
        variant="warning"
        requiresReason={true}
        reasonValue={approvalJustification}
        onReasonChange={setApprovalJustification}
        auditNotice="Human Commander sign-off will be permanently cryptographically signed into the audit ledger."
      />

      {/* Add Evidence Modal */}
      <Modal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title="Upload Forensic Evidence Artifact"
        subtitle="Automatic secret redaction will scan and mask sensitive tokens"
        maxWidth="2xl"
      >
        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Artifact Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={evidenceTitle}
              onChange={(e) => setEvidenceTitle(e.target.value)}
              placeholder="e.g. Netstat Socket Starvation Diagnostic Output"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Artifact Type
              </label>
              <select
                value={evidenceType}
                onChange={(e) => setEvidenceType(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="log_snippet">Log Snippet</option>
                <option value="diagnostic_output">Diagnostic Output</option>
                <option value="event_record">Event Record / JSON</option>
                <option value="file_metadata">File Metadata / Hashes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source System / Node
              </label>
              <input
                type="text"
                value={evidenceSource}
                onChange={(e) => setEvidenceSource(e.target.value)}
                placeholder="e.g. payment-gw-prod-01"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={evidenceDesc}
              onChange={(e) => setEvidenceDesc(e.target.value)}
              placeholder="Short description of what this artifact demonstrates..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Raw Content / Log Stream <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Auto-redaction engine active
              </span>
            </div>
            <textarea
              required
              rows={5}
              value={evidenceContent}
              onChange={(e) => setEvidenceContent(e.target.value)}
              placeholder="Paste logs, headers, or telemetry here (Test pasting sk_live_... or passwords to see redaction)..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEvidenceModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Seal Evidence & Calculate SHA-256
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Create Incident Response Task"
        subtitle="Assign work item to on-call engineers"
        maxWidth="lg"
      >
        <form onSubmit={handleAddTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Rotate Database Connection Credentials"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Description
            </label>
            <textarea
              rows={2}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Detailed instructions for the responder..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignee
              </label>
              <select
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="David Chen">David Chen (Responder)</option>
                <option value="Elena Rostova">Elena Rostova (Analyst)</option>
                <option value="Marcus Vance">Marcus Vance (Commander)</option>
                <option value="Sarah Connor">Sarah Connor (Admin)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="P1 - Urgent">P1 - Urgent</option>
                <option value="P2 - High">P2 - High</option>
                <option value="P3 - Medium">P3 - Medium</option>
                <option value="P4 - Low">P4 - Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="approvalReq"
              checked={taskApprovalReq}
              onChange={(e) => setTaskApprovalReq(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="approvalReq" className="text-xs text-slate-700 font-medium">
              Requires Commander Approval before execution
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Create Response Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
