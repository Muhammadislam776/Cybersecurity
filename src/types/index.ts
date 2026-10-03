export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type IncidentStatus = 'New' | 'Investigating' | 'Mitigating' | 'Resolved' | 'Closed';

export type AlertStatus = 'New' | 'Triaged' | 'Escalated' | 'Suppressed';

export type TaskStatus = 'Pending' | 'In Progress' | 'Awaiting Approval' | 'Completed' | 'Blocked' | 'Cancelled';

export type TaskPriority = 'P1 - Urgent' | 'P2 - High' | 'P3 - Medium' | 'P4 - Low';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Expired';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type UserRole = 
  | 'Admin'
  | 'Incident Commander'
  | 'Security Analyst'
  | 'Responder'
  | 'Auditor'
  | 'Viewer';

export type Permission = 
  | 'view_alerts'
  | 'manage_incidents'
  | 'view_evidence'
  | 'add_evidence'
  | 'manage_tasks'
  | 'view_runbooks'
  | 'request_approval'
  | 'approve_actions'
  | 'view_audit_logs'
  | 'manage_users'
  | 'manage_integrations';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  department: string;
  status: 'Active' | 'On Call' | 'Disabled' | 'Offline';
  lastLogin: string;
  permissions: Permission[];
  passwordHash?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
  rememberMe: boolean;
}

export interface IncidentAlert {
  id: string;
  title: string;
  source: string; // e.g. AWS GuardDuty, CrowdStrike Falcon, Cloudflare WAF, Okta Verify
  timestamp: string;
  severity: SeverityLevel;
  status: AlertStatus;
  affectedService: string;
  detectionType: string;
  assignedResponder: string;
  relatedIncidentId?: string;
  rawPayload: Record<string, any>;
  history: {
    timestamp: string;
    action: string;
    actor: string;
  }[];
}

export interface EvidenceItem {
  id: string;
  incidentId: string;
  title: string;
  type: 'log_snippet' | 'screenshot' | 'event_record' | 'diagnostic_output' | 'file_metadata';
  description: string;
  content: string; // May contain secrets that need redacting
  source: string; // Hostname or sensor
  collectedBy: string;
  collectionTimestamp: string;
  hash: string; // SHA-256 hash string
  hashVerified: boolean;
  chainOfCustody: {
    timestamp: string;
    action: string;
    user: string;
    details: string;
  }[];
  redacted: boolean;
  fileSize?: string;
}

export interface ResponseTask {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  assignedTo: string; // User Name
  assignedToAvatar?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueTime: string;
  createdTime: string;
  completionTime?: string;
  approvalRequired: boolean;
  approvalRequestId?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'alert_trigger' | 'status_change' | 'evidence_added' | 'ai_recommendation' | 'approval_granted' | 'diagnostic_executed' | 'note' | 'commander_assigned';
  title: string;
  description: string;
  actor: string;
  metadata?: Record<string, any>;
}

export interface ApprovedRunbook {
  id: string;
  name: string;
  category: string;
  version: string;
  approvalStatus: 'Approved' | 'Under Review' | 'Deprecated';
  lastReviewedDate: string;
  owner: string;
  matchedIncidentTypes: string[];
  description: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    safeToAutomate: boolean;
    requiredPermission: Permission;
    risk: RiskLevel;
  }[];
}

export interface DiagnosticRecommendation {
  id: string;
  incidentId: string;
  actionName: string;
  description: string;
  whyRecommended: string;
  expectedInformationGain: string;
  riskLevel: RiskLevel;
  requiredPermission: Permission;
  approvalRequired: boolean;
  status: 'Suggested' | 'Approval Requested' | 'Approved' | 'Executed' | 'Rejected';
  executionResult?: string;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  incidentId: string;
  incidentTitle: string;
  actionTitle: string;
  requestedAction: string;
  requestedBy: string;
  aiRecommendationSource?: string;
  riskLevel: RiskLevel;
  reason: string;
  requiredPermission: Permission;
  createdTime: string;
  expirationTime: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewTimestamp?: string;
  reviewComment?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  resource: string;
  incidentId?: string;
  ipAddress: string;
  userAgent: string;
  result: 'Success' | 'Denied' | 'Failed';
  previousStateHash: string;
  currentStateHash: string;
  details: string;
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  category: 'alert' | 'incident' | 'approval' | 'evidence' | 'simulation' | 'webhook' | 'system';
  severity: SeverityLevel;
  title: string;
  description: string;
  source: string;
  incidentId?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'Monitoring System' | 'SIEM' | 'Cloud Platform' | 'Slack' | 'Microsoft Teams' | 'Ticketing System' | 'Email Alerting';
  status: 'Connected' | 'Degraded' | 'Disabled';
  lastEventTime: string;
  eventsReceivedCount: number;
  webhookUrl: string;
  secretMasked: string;
  enabled: boolean;
  description: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Authentication' | 'Database' | 'Application' | 'Identity';
  description: string;
  severity: SeverityLevel;
  symptoms: string[];
  mockAlerts: {
    title: string;
    source: string;
    severity: SeverityLevel;
  }[];
  steps: string[];
  expectedDiagnostics: {
    actionName: string;
    risk: RiskLevel;
    rationale: string;
  }[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  incidentCommander: string;
  assignedResponder: string;
  createdTime: string;
  updatedTime: string;
  resolvedTime?: string;
  affectedService: string;
  affectedSystems: string[];
  tags: string[];
  mttaMinutes: number;
  mttrMinutes?: number;
  relatedAlertIds: string[];
  aiSummary?: {
    summary: string;
    whatHappened: string;
    startedAt: string;
    affectedSystems: string[];
    currentImpact: string;
    knownIndicators: string[];
    responseStatus: string;
    recommendedNextSteps: string[];
    generatedAt: string;
  };
}
