import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Incident, 
  IncidentAlert, 
  EvidenceItem, 
  ResponseTask, 
  ApprovalRequest, 
  AuditLogEntry, 
  DiagnosticRecommendation, 
  TimelineEvent, 
  ApprovedRunbook, 
  User, 
  Integration, 
  SimulationScenario, 
  LiveEvent,
  UserRole,
  Permission,
  SeverityLevel,
  IncidentStatus,
  TaskStatus,
  ApprovalStatus
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_INCIDENTS, 
  INITIAL_ALERTS, 
  INITIAL_EVIDENCE, 
  INITIAL_TASKS, 
  INITIAL_APPROVALS, 
  INITIAL_DIAGNOSTICS, 
  INITIAL_TIMELINE, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_INTEGRATIONS, 
  INITIAL_SIMULATIONS, 
  INITIAL_LIVE_EVENTS,
  INITIAL_APPROVED_RUNBOOKS
} from '../data/mockData';
import { generateHash } from '../utils/crypto';
import { redactSecrets } from '../utils/redaction';
import { hasPermission } from '../utils/formatters';

export type NavigationPage = 
  | 'dashboard' 
  | 'incidents' 
  | 'incident-details' 
  | 'alerts' 
  | 'tasks' 
  | 'live-events' 
  | 'evidence' 
  | 'runbooks' 
  | 'copilot' 
  | 'simulations' 
  | 'approvals' 
  | 'audit' 
  | 'users' 
  | 'integrations';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
}

interface AppContextType {
  // Navigation & Page State
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  navigateToIncident: (id: string, tab?: string) => void;
  activeIncidentTab: string;
  setActiveIncidentTab: (tab: string) => void;
  
  // Search modal
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  
  // User & RBAC
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  users: User[];
  checkPermission: (permission: Permission) => boolean;

  // Domain Entities
  incidents: Incident[];
  alerts: IncidentAlert[];
  evidence: EvidenceItem[];
  tasks: ResponseTask[];
  approvals: ApprovalRequest[];
  diagnostics: DiagnosticRecommendation[];
  timeline: TimelineEvent[];
  auditLogs: AuditLogEntry[];
  integrations: Integration[];
  simulations: SimulationScenario[];
  liveEvents: LiveEvent[];
  approvedRunbooks: ApprovedRunbook[];

  // Entity Mutators
  createIncident: (incident: Partial<Incident>) => Incident;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  updateAlertStatus: (alertId: string, status: IncidentAlert['status']) => void;
  addEvidence: (evidenceData: Omit<EvidenceItem, 'id' | 'hash' | 'hashVerified' | 'collectionTimestamp' | 'chainOfCustody' | 'redacted'>) => EvidenceItem;
  addTask: (taskData: Omit<ResponseTask, 'id' | 'createdTime'>) => ResponseTask;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  
  // Approvals & Diagnostics Safety Model
  submitApprovalRequest: (req: Omit<ApprovalRequest, 'id' | 'createdTime' | 'expirationTime' | 'status'>) => ApprovalRequest;
  approveAction: (approvalId: string, reasonComment?: string) => void;
  rejectAction: (approvalId: string, rejectReason: string) => void;
  executeDiagnosticRecommendation: (diagId: string) => void;

  // Integrations & Webhooks
  toggleIntegration: (id: string) => void;
  sendMockWebhookEvent: (payload: { title: string; source: string; severity: SeverityLevel; createIncident?: boolean }) => void;

  // Simulations
  isSimulationActive: boolean;
  activeSimulationId: string | null;
  startSimulation: (scenarioId: string) => void;
  stopSimulation: () => void;

  // Live Stream
  isLiveStreamPaused: boolean;
  toggleLiveStreamPause: () => void;
  addLiveEvent: (event: Omit<LiveEvent, 'id' | 'timestamp'>) => void;

  // Notifications / Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Audit Logger
  recordAuditEntry: (action: string, resource: string, details: string, incidentId?: string, result?: 'Success' | 'Denied' | 'Failed') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-2026-0891');
  const [activeIncidentTab, setActiveIncidentTab] = useState<string>('overview');
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);

  // Users & RBAC
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default: Admin Sarah Connor

  // Data Collections
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INITIAL_ALERTS);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [tasks, setTasks] = useState<ResponseTask[]>(INITIAL_TASKS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecommendation[]>(INITIAL_DIAGNOSTICS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [simulations] = useState<SimulationScenario[]>(INITIAL_SIMULATIONS);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(INITIAL_LIVE_EVENTS);
  const [approvedRunbooks] = useState<ApprovedRunbook[]>(INITIAL_APPROVED_RUNBOOKS);

  // Simulations state
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(false);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);

  // Live stream control
  const [isLiveStreamPaused, setIsLiveStreamPaused] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // RBAC helper
  const checkPermission = useCallback((permission: Permission): boolean => {
    return hasPermission(currentUser.role, permission);
  }, [currentUser.role]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Append-only tamper-evident audit logging
  const recordAuditEntry = useCallback((
    action: string,
    resource: string,
    details: string,
    incidentId?: string,
    result: 'Success' | 'Denied' | 'Failed' = 'Success'
  ) => {
    const prevEntry = auditLogs[0];
    const prevHash = prevEntry ? prevEntry.currentStateHash : generateHash('genesis-state');
    const newEntryId = `AUD-${Math.floor(8900 + Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();
    const currentHash = generateHash(`${prevHash}|${newEntryId}|${action}|${currentUser.name}|${timestamp}`);

    const newAuditLog: AuditLogEntry = {
      id: newEntryId,
      timestamp,
      user: currentUser.name,
      role: currentUser.role,
      action,
      resource,
      incidentId,
      ipAddress: '10.20.4.11',
      userAgent: 'Mozilla/5.0 SecOpsConsole/3.0',
      result,
      previousStateHash: prevHash,
      currentStateHash: currentHash,
      details
    };

    setAuditLogs(prev => [newAuditLog, ...prev]);
  }, [auditLogs, currentUser.name, currentUser.role]);

  const addLiveEvent = useCallback((event: Omit<LiveEvent, 'id' | 'timestamp'>) => {
    const newLiveEvent: LiveEvent = {
      ...event,
      id: `levt-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };
    setLiveEvents(prev => [newLiveEvent, ...prev.slice(0, 49)]);
  }, []);

  // Role Switcher for RBAC evaluation
  const setCurrentUserRole = useCallback((newRole: UserRole) => {
    const targetUser = users.find(u => u.role === newRole) || {
      ...currentUser,
      role: newRole
    };
    setCurrentUser(targetUser);
    recordAuditEntry('RBAC_ROLE_SWITCHED', `User / ${targetUser.id}`, `User ${targetUser.name} switched active role to ${newRole}`);
    addToast('info', 'RBAC Role Switched', `Active role is now ${newRole}. UI permissions adjusted.`);
  }, [currentUser, users, recordAuditEntry, addToast]);

  // Navigate to incident
  const navigateToIncident = useCallback((id: string, tab: string = 'overview') => {
    setSelectedIncidentId(id);
    setActiveIncidentTab(tab);
    setActivePage('incident-details');
  }, []);

  // Create Incident
  const createIncident = useCallback((incidentData: Partial<Incident>): Incident => {
    if (!checkPermission('manage_incidents')) {
      addToast('error', 'Access Denied', 'Your current role does not have permission to create incidents.');
      recordAuditEntry('INCIDENT_CREATION_DENIED', 'IncidentManager', 'Unauthorized attempt to create incident', undefined, 'Denied');
      throw new Error('Permission denied');
    }

    const newId = `INC-2026-${Math.floor(900 + Math.random() * 100)}`;
    const now = new Date().toISOString();

    const created: Incident = {
      id: newId,
      title: incidentData.title || 'Untitled Security Incident',
      description: incidentData.description || 'No description provided.',
      severity: incidentData.severity || 'Medium',
      status: incidentData.status || 'New',
      incidentCommander: incidentData.incidentCommander || currentUser.name,
      assignedResponder: incidentData.assignedResponder || 'Unassigned',
      createdTime: now,
      updatedTime: now,
      affectedService: incidentData.affectedService || 'general-infra',
      affectedSystems: incidentData.affectedSystems || ['general-system'],
      tags: incidentData.tags || ['Security'],
      mttaMinutes: 0,
      relatedAlertIds: incidentData.relatedAlertIds || [],
      aiSummary: {
        summary: `Preliminary incident recorded for ${incidentData.affectedService}.`,
        whatHappened: incidentData.description || 'Telemetry initiated triage.',
        startedAt: now,
        affectedSystems: incidentData.affectedSystems || [incidentData.affectedService || 'system'],
        currentImpact: 'Assessing blast radius.',
        knownIndicators: ['New incident created in SecOps portal.'],
        responseStatus: 'Awaiting triage by assigned Incident Commander.',
        recommendedNextSteps: ['Retrieve relevant runbook', 'Run baseline diagnostic telemetry'],
        generatedAt: now
      }
    };

    setIncidents(prev => [created, ...prev]);
    recordAuditEntry('INCIDENT_CREATED', `Incident / ${newId}`, `Created incident: ${created.title}`, newId);
    addLiveEvent({
      category: 'incident',
      severity: created.severity,
      title: `New Incident Created: ${newId}`,
      description: created.title,
      source: 'SecOps Incident Manager',
      incidentId: newId
    });
    addToast('success', 'Incident Created', `Successfully created ${newId}.`);
    return created;
  }, [checkPermission, currentUser.name, addToast, recordAuditEntry, addLiveEvent]);

  // Update Incident
  const updateIncident = useCallback((id: string, updates: Partial<Incident>) => {
    if (!checkPermission('manage_incidents')) {
      addToast('error', 'Access Denied', 'Your current role does not have permission to modify incidents.');
      recordAuditEntry('INCIDENT_UPDATE_DENIED', `Incident / ${id}`, 'Unauthorized incident update attempt', id, 'Denied');
      return;
    }

    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updated = { ...inc, ...updates, updatedTime: new Date().toISOString() };
        if (updates.status === 'Resolved' && !inc.resolvedTime) {
          updated.resolvedTime = new Date().toISOString();
          updated.mttrMinutes = Math.floor((new Date().getTime() - new Date(inc.createdTime).getTime()) / 60000);
        }
        return updated;
      }
      return inc;
    }));

    recordAuditEntry('INCIDENT_UPDATED', `Incident / ${id}`, `Updated fields: ${Object.keys(updates).join(', ')}`, id);
    addToast('info', 'Incident Updated', `Updated ${id}.`);
  }, [checkPermission, addToast, recordAuditEntry]);

  // Update Alert Status
  const updateAlertStatus = useCallback((alertId: string, status: IncidentAlert['status']) => {
    setAlerts(prev => prev.map(alt => {
      if (alt.id === alertId) {
        return {
          ...alt,
          status,
          history: [
            ...alt.history,
            { timestamp: new Date().toISOString(), action: `Status changed to ${status}`, actor: currentUser.name }
          ]
        };
      }
      return alt;
    }));
    recordAuditEntry('ALERT_STATUS_UPDATED', `Alert / ${alertId}`, `Changed status to ${status}`);
    addToast('info', 'Alert Updated', `Alert ${alertId} status changed to ${status}.`);
  }, [currentUser.name, recordAuditEntry, addToast]);

  // Add Evidence with automatic secret redaction and SHA-256 hash
  const addEvidence = useCallback((evidenceData: Omit<EvidenceItem, 'id' | 'hash' | 'hashVerified' | 'collectionTimestamp' | 'chainOfCustody' | 'redacted'>): EvidenceItem => {
    if (!checkPermission('add_evidence')) {
      addToast('error', 'Access Denied', 'Your role cannot add forensic evidence.');
      recordAuditEntry('EVIDENCE_ADD_DENIED', 'EvidenceManager', 'Attempted unauthorized evidence upload', evidenceData.incidentId, 'Denied');
      throw new Error('Permission denied');
    }

    const { redactedText, hasRedactions, redactedCount, detectedTypes } = redactSecrets(evidenceData.content);
    const now = new Date().toISOString();
    const newId = `EVD-${Math.floor(200 + Math.random() * 800)}`;
    const hash = generateHash(`${newId}-${evidenceData.title}-${redactedText}`);

    const item: EvidenceItem = {
      ...evidenceData,
      id: newId,
      content: redactedText,
      collectionTimestamp: now,
      hash,
      hashVerified: true,
      redacted: hasRedactions,
      chainOfCustody: [
        {
          timestamp: now,
          action: 'Forensic evidence collected and processed by Redaction Engine',
          user: currentUser.name,
          details: hasRedactions ? `Masked ${redactedCount} secrets (${detectedTypes.join(', ')})` : 'Integrity seal verified'
        }
      ]
    };

    setEvidence(prev => [item, ...prev]);
    recordAuditEntry(
      'EVIDENCE_COLLECTED',
      `Evidence / ${newId}`,
      `Added evidence item "${item.title}". Redacted ${redactedCount} secrets. SHA-256: ${hash.substring(0, 16)}...`,
      item.incidentId
    );
    addLiveEvent({
      category: 'evidence',
      severity: 'Medium',
      title: `Evidence Uploaded: ${newId}`,
      description: `${item.title} (${hasRedactions ? 'Sensitive data redacted' : 'Clean'})`,
      source: 'Evidence Repository',
      incidentId: item.incidentId
    });
    addToast('success', 'Evidence Recorded', `Evidence ${newId} stored with tamper-evident SHA-256 hash.`);
    return item;
  }, [checkPermission, currentUser.name, recordAuditEntry, addLiveEvent, addToast]);

  // Add Task
  const addTask = useCallback((taskData: Omit<ResponseTask, 'id' | 'createdTime'>): ResponseTask => {
    if (!checkPermission('manage_tasks')) {
      addToast('error', 'Access Denied', 'Your current role does not have permission to manage tasks.');
      throw new Error('Permission denied');
    }

    const newId = `TSK-${Math.floor(600 + Math.random() * 400)}`;
    const newTask: ResponseTask = {
      ...taskData,
      id: newId,
      createdTime: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    recordAuditEntry('TASK_CREATED', `Task / ${newId}`, `Created response task: ${newTask.title}`, newTask.incidentId);
    addToast('success', 'Task Created', `Task ${newId} assigned to ${newTask.assignedTo}.`);
    return newTask;
  }, [checkPermission, recordAuditEntry, addToast]);

  // Update Task Status
  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    if (!checkPermission('manage_tasks')) {
      addToast('error', 'Access Denied', 'Cannot update task.');
      return;
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t, status };
        if (status === 'Completed') {
          updated.completionTime = new Date().toISOString();
        }
        return updated;
      }
      return t;
    }));

    recordAuditEntry('TASK_STATUS_UPDATED', `Task / ${taskId}`, `Status updated to ${status}`);
    addToast('info', 'Task Updated', `Task status updated to ${status}.`);
  }, [checkPermission, recordAuditEntry, addToast]);

  // Submit Approval Request
  const submitApprovalRequest = useCallback((req: Omit<ApprovalRequest, 'id' | 'createdTime' | 'expirationTime' | 'status'>): ApprovalRequest => {
    const newId = `APR-${Math.floor(300 + Math.random() * 700)}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours expiration

    const newReq: ApprovalRequest = {
      ...req,
      id: newId,
      createdTime: now.toISOString(),
      expirationTime: expires.toISOString(),
      status: 'Pending'
    };

    setApprovals(prev => [newReq, ...prev]);
    recordAuditEntry('APPROVAL_REQUESTED', `Approval / ${newId}`, `Requested approval for: ${newReq.actionTitle}`, newReq.incidentId);
    addLiveEvent({
      category: 'approval',
      severity: newReq.riskLevel === 'Critical' ? 'Critical' : 'High',
      title: `Approval Required: ${newId}`,
      description: newReq.actionTitle,
      source: 'Human-in-the-Loop Gateway',
      incidentId: newReq.incidentId
    });
    addToast('warning', 'Approval Requested', `Human approval required for "${newReq.actionTitle}".`);
    return newReq;
  }, [recordAuditEntry, addLiveEvent, addToast]);

  // Approve Action (Requires 'approve_actions' permission)
  const approveAction = useCallback((approvalId: string, reasonComment?: string) => {
    if (!checkPermission('approve_actions')) {
      addToast('error', 'Permission Denied', 'Your current role does not have authorization to approve actions.');
      recordAuditEntry('APPROVAL_ATTEMPT_DENIED', `Approval / ${approvalId}`, 'Unauthorized approval attempt', undefined, 'Denied');
      return;
    }

    setApprovals(prev => prev.map(apr => {
      if (apr.id === approvalId) {
        return {
          ...apr,
          status: 'Approved' as ApprovalStatus,
          reviewedBy: currentUser.name,
          reviewTimestamp: new Date().toISOString(),
          reviewComment: reasonComment || 'Approved by authorized human operator.'
        };
      }
      return apr;
    }));

    // Update corresponding task if linked
    setTasks(prev => prev.map(t => {
      if (t.approvalRequestId === approvalId) {
        return { ...t, status: 'In Progress' };
      }
      return t;
    }));

    // Update diagnostic if linked
    setDiagnostics(prev => prev.map(d => {
      if (d.status === 'Approval Requested') {
        return {
          ...d,
          status: 'Executed',
          executionResult: 'Simulated execution completed safely in mock sandbox environment.'
        };
      }
      return d;
    }));

    recordAuditEntry(
      'ACTION_APPROVED_AND_EXECUTED',
      `Approval / ${approvalId}`,
      `Authorized action execution: ${reasonComment || 'Human sign-off verified. Mock execution triggered.'}`,
      undefined
    );

    addLiveEvent({
      category: 'approval',
      severity: 'Low',
      title: `Action Approved: ${approvalId}`,
      description: `Executed safely in simulation mode by ${currentUser.name}`,
      source: 'Approval Center'
    });

    addToast('success', 'Action Approved & Executed', `Approval ${approvalId} granted. Safe mock execution triggered.`);
  }, [checkPermission, currentUser.name, recordAuditEntry, addLiveEvent, addToast]);

  // Reject Action
  const rejectAction = useCallback((approvalId: string, rejectReason: string) => {
    if (!checkPermission('approve_actions')) {
      addToast('error', 'Permission Denied', 'Your role cannot reject approval requests.');
      return;
    }

    setApprovals(prev => prev.map(apr => {
      if (apr.id === approvalId) {
        return {
          ...apr,
          status: 'Rejected' as ApprovalStatus,
          reviewedBy: currentUser.name,
          reviewTimestamp: new Date().toISOString(),
          reviewComment: rejectReason
        };
      }
      return apr;
    }));

    recordAuditEntry('ACTION_APPROVAL_REJECTED', `Approval / ${approvalId}`, `Rejected action with reason: ${rejectReason}`);
    addToast('info', 'Action Rejected', `Approval request ${approvalId} was rejected.`);
  }, [checkPermission, currentUser.name, recordAuditEntry, addToast]);

  // Execute safe diagnostic recommendation (read-only diagnostics)
  const executeDiagnosticRecommendation = useCallback((diagId: string) => {
    const diag = diagnostics.find(d => d.id === diagId);
    if (!diag) return;

    if (diag.approvalRequired && diag.status !== 'Approved') {
      submitApprovalRequest({
        incidentId: diag.incidentId,
        incidentTitle: incidents.find(i => i.id === diag.incidentId)?.title || 'Incident',
        actionTitle: diag.actionName,
        requestedAction: diag.description,
        requestedBy: `AI Copilot & ${currentUser.name}`,
        aiRecommendationSource: `Diagnostic Recommendation #${diag.id}`,
        riskLevel: diag.riskLevel,
        reason: diag.whyRecommended,
        requiredPermission: diag.requiredPermission
      });
      setDiagnostics(prev => prev.map(d => d.id === diagId ? { ...d, status: 'Approval Requested' } : d));
      return;
    }

    setDiagnostics(prev => prev.map(d => {
      if (d.id === diagId) {
        return {
          ...d,
          status: 'Executed',
          executionResult: `Diagnostic scan completed at ${new Date().toLocaleTimeString()}. Observed: Telemetry parameters normal.`
        };
      }
      return d;
    }));

    recordAuditEntry('DIAGNOSTIC_SIMULATION_EXECUTED', `Diagnostic / ${diagId}`, `Safe read-only execution completed for ${diag.actionName}`, diag.incidentId);
    addToast('success', 'Diagnostic Executed', `Executed read-only diagnostic "${diag.actionName}".`);
  }, [diagnostics, incidents, currentUser.name, submitApprovalRequest, recordAuditEntry, addToast]);

  // Toggle Integrations
  const toggleIntegration = useCallback((id: string) => {
    if (!checkPermission('manage_integrations')) {
      addToast('error', 'Access Denied', 'Only Admins and Incident Commanders can configure integrations.');
      return;
    }
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled, status: !i.enabled ? 'Connected' : 'Disabled' } : i));
    recordAuditEntry('INTEGRATION_CONFIG_CHANGED', `Integration / ${id}`, 'Toggled integration status');
    addToast('info', 'Integration Configured', 'Integration status updated.');
  }, [checkPermission, recordAuditEntry, addToast]);

  // Mock Webhook Generator
  const sendMockWebhookEvent = useCallback((payload: { title: string; source: string; severity: SeverityLevel; createIncident?: boolean }) => {
    const newAlertId = `ALT-${Math.floor(9100 + Math.random() * 800)}`;
    const now = new Date().toISOString();

    const newAlert: IncidentAlert = {
      id: newAlertId,
      title: payload.title,
      source: payload.source,
      timestamp: now,
      severity: payload.severity,
      status: 'New',
      affectedService: 'simulated-ingress-cluster',
      detectionType: 'External Webhook Ingest',
      assignedResponder: 'Unassigned',
      rawPayload: {
        event_origin: 'MockWebhookSimulator',
        signature_verified: true,
        secret: 'whsec_99a812************'
      },
      history: [
        { timestamp: now, action: 'Received via Webhook Ingest API', actor: 'Webhook Gateway' }
      ]
    };

    setAlerts(prev => [newAlert, ...prev]);

    let createdInc: Incident | undefined;
    if (payload.createIncident) {
      createdInc = createIncident({
        title: `Incident: ${payload.title}`,
        description: `Automated incident generated from webhook payload received from ${payload.source}.`,
        severity: payload.severity,
        affectedService: 'simulated-ingress-cluster',
        relatedAlertIds: [newAlertId]
      });
    }

    recordAuditEntry('WEBHOOK_EVENT_RECEIVED', `Webhook / ${payload.source}`, `Inbound payload: ${payload.title}`, createdInc?.id);
    addLiveEvent({
      category: 'webhook',
      severity: payload.severity,
      title: `Webhook Ingested: ${payload.source}`,
      description: payload.title,
      source: payload.source,
      incidentId: createdInc?.id
    });

    addToast('success', 'Webhook Received', `Successfully processed mock webhook event from ${payload.source}.`);
  }, [createIncident, recordAuditEntry, addLiveEvent, addToast]);

  // Simulation Center Orchestration
  const startSimulation = useCallback((scenarioId: string) => {
    const scenario = simulations.find(s => s.id === scenarioId);
    if (!scenario) return;

    setIsSimulationActive(true);
    setActiveSimulationId(scenarioId);

    // Create simulated incident
    const simIncident = createIncident({
      title: `[SIMULATION] ${scenario.name}`,
      description: `SIMULATION SCENARIO: ${scenario.description} (Zero production changes).`,
      severity: scenario.severity,
      affectedService: scenario.name.toLowerCase().replace(/\s+/g, '-'),
      tags: ['SIMULATION', 'Training', scenario.category]
    });

    recordAuditEntry('SIMULATION_STARTED', `Simulation / ${scenarioId}`, `Launched simulation scenario: ${scenario.name}`, simIncident.id);
    addLiveEvent({
      category: 'simulation',
      severity: scenario.severity,
      title: `Simulation Started: ${scenario.name}`,
      description: 'Sandbox session active. No production changes will be made.',
      source: 'Incident Simulation Engine',
      incidentId: simIncident.id
    });

    navigateToIncident(simIncident.id, 'overview');
    addToast('warning', 'Simulation Active', `Started scenario: ${scenario.name} (Simulation Mode).`);
  }, [simulations, createIncident, recordAuditEntry, addLiveEvent, navigateToIncident, addToast]);

  const stopSimulation = useCallback(() => {
    setIsSimulationActive(false);
    setActiveSimulationId(null);
    recordAuditEntry('SIMULATION_STOPPED', 'SimulationEngine', 'Terminated active simulation sandbox');
    addLiveEvent({
      category: 'simulation',
      severity: 'Low',
      title: 'Simulation Concluded',
      description: 'Sandbox state archived cleanly.',
      source: 'Incident Simulation Engine'
    });
    addToast('info', 'Simulation Concluded', 'Simulation sandbox terminated.');
  }, [recordAuditEntry, addLiveEvent, addToast]);

  const toggleLiveStreamPause = useCallback(() => {
    setIsLiveStreamPaused(prev => !prev);
  }, []);

  // Periodic realistic background event simulator (every 22s)
  useEffect(() => {
    if (isLiveStreamPaused) return;

    const interval = setInterval(() => {
      const mockEvents = [
        { category: 'alert', severity: 'Low', title: 'CertManager Heartbeat', description: 'TLS certificate renewal verified for api.cyberops.corp', source: 'CertManager' },
        { category: 'system', severity: 'Informational', title: 'Audit Ledger Chain Check', description: 'Cryptographic SHA-256 chain integrity verified 100% valid', source: 'AuditDaemon' },
        { category: 'webhook', severity: 'Informational', title: 'Telemetry Ingest Beat', description: 'Datadog APM heartbeat healthy across 14 nodes', source: 'Datadog Ingest' }
      ] as const;

      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      addLiveEvent({
        category: randomEvent.category,
        severity: randomEvent.severity as SeverityLevel,
        title: randomEvent.title,
        description: randomEvent.description,
        source: randomEvent.source
      });
    }, 22000);

    return () => clearInterval(interval);
  }, [isLiveStreamPaused, addLiveEvent]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedIncidentId,
        setSelectedIncidentId,
        navigateToIncident,
        activeIncidentTab,
        setActiveIncidentTab,
        globalSearchOpen,
        setGlobalSearchOpen,
        currentUser,
        setCurrentUserRole,
        users,
        checkPermission,
        incidents,
        alerts,
        evidence,
        tasks,
        approvals,
        diagnostics,
        timeline,
        auditLogs,
        integrations,
        simulations,
        liveEvents,
        approvedRunbooks,
        createIncident,
        updateIncident,
        updateAlertStatus,
        addEvidence,
        addTask,
        updateTaskStatus,
        submitApprovalRequest,
        approveAction,
        rejectAction,
        executeDiagnosticRecommendation,
        toggleIntegration,
        sendMockWebhookEvent,
        isSimulationActive,
        activeSimulationId,
        startSimulation,
        stopSimulation,
        isLiveStreamPaused,
        toggleLiveStreamPause,
        addLiveEvent,
        toasts,
        addToast,
        removeToast,
        recordAuditEntry
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
