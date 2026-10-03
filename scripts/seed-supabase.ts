import { createClient } from '@supabase/supabase-js';
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
} from '../src/data/mockData';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sobpigutulzbfnkblwtl.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvYnBpZ3V0dWx6YmZua2Jsd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODI5NzcsImV4cCI6MjEwNjM1ODk3N30.xSUchI_czqeSMBN0esYUJmEih2U2Z9zq7gv4hwqbRhs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedTable(name: string, records: any[]) {
  console.log(`Seeding table '${name}' with ${records.length} records...`);
  const { data, error } = await supabase.from(name).upsert(records, { onConflict: 'id' });
  if (error) {
    console.error(`❌ Failed to seed '${name}':`, error.message);
    return false;
  } else {
    console.log(`✅ Successfully seeded '${name}'!`);
    return true;
  }
}

async function seedAll() {
  console.log('Starting full data seed to Supabase...\n');

  // 1. Users
  const usersToInsert = INITIAL_USERS.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    title: u.title,
    department: u.department,
    status: u.status,
    last_login: u.lastLogin,
    permissions: u.permissions,
    password_hash: u.passwordHash || 'pbkdf2_sha256$260000$mock_salt$mock_hash'
  }));
  await seedTable('users', usersToInsert);

  // 2. Incidents
  const incidentsToInsert = INITIAL_INCIDENTS.map(inc => ({
    id: inc.id,
    title: inc.title,
    description: inc.description,
    severity: inc.severity,
    status: inc.status,
    incident_commander: inc.incidentCommander,
    assigned_responder: inc.assignedResponder,
    created_time: inc.createdTime,
    updated_time: inc.updatedTime,
    resolved_time: inc.resolvedTime || null,
    affected_service: inc.affectedService,
    affected_systems: inc.affectedSystems,
    tags: inc.tags,
    mtta_minutes: inc.mttaMinutes,
    mttr_minutes: inc.mttrMinutes || null,
    related_alert_ids: inc.relatedAlertIds,
    ai_summary: inc.aiSummary || null
  }));
  await seedTable('incidents', incidentsToInsert);

  // 3. Alerts
  const alertsToInsert = INITIAL_ALERTS.map(a => ({
    id: a.id,
    title: a.title,
    source: a.source,
    timestamp: a.timestamp,
    severity: a.severity,
    status: a.status,
    affected_service: a.affectedService,
    detection_type: a.detectionType,
    assigned_responder: a.assignedResponder,
    related_incident_id: a.relatedIncidentId || null,
    raw_payload: a.rawPayload,
    history: a.history
  }));
  await seedTable('alerts', alertsToInsert);

  // 4. Evidence
  const evidenceToInsert = INITIAL_EVIDENCE.map(e => ({
    id: e.id,
    incident_id: e.incidentId,
    title: e.title,
    type: e.type,
    description: e.description,
    content: e.content,
    source: e.source,
    collected_by: e.collectedBy,
    collection_timestamp: e.collectionTimestamp,
    hash: e.hash,
    hash_verified: e.hashVerified,
    chain_of_custody: e.chainOfCustody,
    redacted: e.redacted,
    file_size: e.fileSize || null
  }));
  await seedTable('evidence', evidenceToInsert);

  // 5. Tasks
  const tasksToInsert = INITIAL_TASKS.map(t => ({
    id: t.id,
    incident_id: t.incidentId,
    title: t.title,
    description: t.description,
    assigned_to: t.assignedTo,
    assigned_to_avatar: t.assignedToAvatar || null,
    priority: t.priority,
    status: t.status,
    due_time: t.dueTime,
    created_time: t.createdTime,
    completion_time: t.completionTime || null,
    approval_required: t.approvalRequired,
    approval_request_id: t.approvalRequestId || null
  }));
  await seedTable('tasks', tasksToInsert);

  // 6. Approvals
  const approvalsToInsert = INITIAL_APPROVALS.map(apr => ({
    id: apr.id,
    incident_id: apr.incidentId,
    incident_title: apr.incidentTitle,
    action_title: apr.actionTitle,
    requested_action: apr.requestedAction,
    requested_by: apr.requestedBy,
    ai_recommendation_source: apr.aiRecommendationSource || null,
    risk_level: apr.riskLevel,
    reason: apr.reason,
    required_permission: apr.requiredPermission,
    created_time: apr.createdTime,
    expiration_time: apr.expirationTime,
    status: apr.status,
    reviewed_by: apr.reviewedBy || null,
    review_timestamp: apr.reviewTimestamp || null,
    review_comment: apr.reviewComment || null
  }));
  await seedTable('approvals', approvalsToInsert);

  // 7. Diagnostics
  const diagnosticsToInsert = INITIAL_DIAGNOSTICS.map(d => ({
    id: d.id,
    incident_id: d.incidentId,
    action_name: d.actionName,
    description: d.description,
    why_recommended: d.whyRecommended,
    expected_information_gain: d.expectedInformationGain,
    risk_level: d.riskLevel,
    required_permission: d.requiredPermission,
    approval_required: d.approvalRequired,
    status: d.status,
    execution_result: d.executionResult || null,
    created_at: d.createdAt
  }));
  await seedTable('diagnostics', diagnosticsToInsert);

  // 8. Timeline
  const timelineToInsert = INITIAL_TIMELINE.map(tm => ({
    id: tm.id,
    timestamp: tm.timestamp,
    type: tm.type,
    title: tm.title,
    description: tm.description,
    actor: tm.actor,
    metadata: tm.metadata || {}
  }));
  await seedTable('timeline', timelineToInsert);

  // 9. Audit Logs
  const auditLogsToInsert = INITIAL_AUDIT_LOGS.map(al => ({
    id: al.id,
    timestamp: al.timestamp,
    user_name: al.user,
    role: al.role,
    action: al.action,
    resource: al.resource,
    incident_id: al.incidentId || null,
    ip_address: al.ipAddress,
    user_agent: al.userAgent,
    result: al.result,
    previous_state_hash: al.previousStateHash,
    current_state_hash: al.currentStateHash,
    details: al.details
  }));
  await seedTable('audit_logs', auditLogsToInsert);

  // 10. Integrations
  const integrationsToInsert = INITIAL_INTEGRATIONS.map(ig => ({
    id: ig.id,
    name: ig.name,
    type: ig.type,
    status: ig.status,
    last_event_time: ig.lastEventTime || null,
    events_received_count: ig.eventsReceivedCount,
    webhook_url: ig.webhookUrl,
    secret_masked: ig.secretMasked,
    enabled: ig.enabled,
    description: ig.description
  }));
  await seedTable('integrations', integrationsToInsert);

  // 11. Simulations
  const simulationsToInsert = INITIAL_SIMULATIONS.map(sim => ({
    id: sim.id,
    name: sim.name,
    category: sim.category,
    description: sim.description,
    severity: sim.severity,
    symptoms: sim.symptoms,
    mock_alerts: sim.mockAlerts,
    steps: sim.steps,
    expected_diagnostics: sim.expectedDiagnostics
  }));
  await seedTable('simulations', simulationsToInsert);

  // 12. Runbooks
  const runbooksToInsert = INITIAL_APPROVED_RUNBOOKS.map(rb => ({
    id: rb.id,
    name: rb.name,
    category: rb.category,
    version: rb.version,
    approval_status: rb.approvalStatus,
    last_reviewed_date: rb.lastReviewedDate,
    owner: rb.owner,
    matched_incident_types: rb.matchedIncidentTypes,
    description: rb.description,
    steps: rb.steps
  }));
  await seedTable('runbooks', runbooksToInsert);

  // 13. Live Events
  const liveEventsToInsert = INITIAL_LIVE_EVENTS.map(le => ({
    id: le.id,
    timestamp: le.timestamp,
    category: le.category,
    severity: le.severity,
    title: le.title,
    description: le.description,
    source: le.source,
    incident_id: le.incidentId || null
  }));
  await seedTable('live_events', liveEventsToInsert);

  console.log('\nSeeding completed successfully! All tables and data are synchronized.');
}

seedAll();
