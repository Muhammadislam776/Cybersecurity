import fs from 'fs';
import path from 'path';
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

function escapeSqlString(str: string | undefined | null): string {
  if (str === undefined || str === null) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function escapeJson(obj: any): string {
  if (obj === undefined || obj === null) return 'NULL';
  const jsonStr = JSON.stringify(obj).replace(/'/g, "''");
  return `'${jsonStr}'::jsonb`;
}

function buildSql(): string {
  const parts: string[] = [];

  parts.push(`-- ==============================================================================`);
  parts.push(`-- CYBERSECURITY INCIDENT MANAGEMENT PLATFORM - SUPABASE COMPLETE DATABASE SETUP`);
  parts.push(`-- Target: PostgreSQL / Supabase public schema`);
  parts.push(`-- Generated: ${new Date().toISOString()}`);
  parts.push(`-- ==============================================================================\n`);

  parts.push(`-- 1. DROP EXISTING TABLES (Clean Slate)`);
  parts.push(`DROP TABLE IF EXISTS public.live_events CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.audit_logs CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.timeline CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.diagnostics CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.approvals CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.tasks CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.evidence CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.alerts CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.incidents CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.simulations CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.integrations CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.runbooks CASCADE;`);
  parts.push(`DROP TABLE IF EXISTS public.users CASCADE;\n`);

  parts.push(`-- 2. CREATE TABLES\n`);

  // USERS TABLE
  parts.push(`CREATE TABLE public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL,
  title TEXT,
  department TEXT,
  status TEXT DEFAULT 'Active',
  last_login TIMESTAMPTZ,
  permissions JSONB DEFAULT '[]'::jsonb,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // INCIDENTS TABLE
  parts.push(`CREATE TABLE public.incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  incident_commander TEXT NOT NULL,
  assigned_responder TEXT NOT NULL,
  created_time TIMESTAMPTZ NOT NULL,
  updated_time TIMESTAMPTZ NOT NULL,
  resolved_time TIMESTAMPTZ,
  affected_service TEXT NOT NULL,
  affected_systems JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  mtta_minutes INTEGER DEFAULT 0,
  mttr_minutes INTEGER,
  related_alert_ids JSONB DEFAULT '[]'::jsonb,
  ai_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // ALERTS TABLE
  parts.push(`CREATE TABLE public.alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  affected_service TEXT NOT NULL,
  detection_type TEXT,
  assigned_responder TEXT,
  related_incident_id TEXT,
  raw_payload JSONB DEFAULT '{}'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // EVIDENCE TABLE
  parts.push(`CREATE TABLE public.evidence (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  content TEXT,
  source TEXT,
  collected_by TEXT NOT NULL,
  collection_timestamp TIMESTAMPTZ NOT NULL,
  hash TEXT NOT NULL,
  hash_verified BOOLEAN DEFAULT true,
  chain_of_custody JSONB DEFAULT '[]'::jsonb,
  redacted BOOLEAN DEFAULT false,
  file_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // TASKS TABLE
  parts.push(`CREATE TABLE public.tasks (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT NOT NULL,
  assigned_to_avatar TEXT,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  due_time TIMESTAMPTZ NOT NULL,
  created_time TIMESTAMPTZ NOT NULL,
  completion_time TIMESTAMPTZ,
  approval_required BOOLEAN DEFAULT false,
  approval_request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // APPROVALS TABLE
  parts.push(`CREATE TABLE public.approvals (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  incident_title TEXT NOT NULL,
  action_title TEXT NOT NULL,
  requested_action TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  ai_recommendation_source TEXT,
  risk_level TEXT NOT NULL,
  reason TEXT NOT NULL,
  required_permission TEXT NOT NULL,
  created_time TIMESTAMPTZ NOT NULL,
  expiration_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  reviewed_by TEXT,
  review_timestamp TIMESTAMPTZ,
  review_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // DIAGNOSTICS TABLE
  parts.push(`CREATE TABLE public.diagnostics (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  action_name TEXT NOT NULL,
  description TEXT,
  why_recommended TEXT,
  expected_information_gain TEXT,
  risk_level TEXT NOT NULL,
  required_permission TEXT NOT NULL,
  approval_required BOOLEAN DEFAULT true,
  status TEXT NOT NULL,
  execution_result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // TIMELINE TABLE
  parts.push(`CREATE TABLE public.timeline (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  actor TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // AUDIT LOGS TABLE
  parts.push(`CREATE TABLE public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  incident_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  result TEXT NOT NULL,
  previous_state_hash TEXT,
  current_state_hash TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // INTEGRATIONS TABLE
  parts.push(`CREATE TABLE public.integrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  last_event_time TIMESTAMPTZ,
  events_received_count INTEGER DEFAULT 0,
  webhook_url TEXT,
  secret_masked TEXT,
  enabled BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // SIMULATIONS TABLE
  parts.push(`CREATE TABLE public.simulations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL,
  symptoms JSONB DEFAULT '[]'::jsonb,
  mock_alerts JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  expected_diagnostics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // RUNBOOKS TABLE
  parts.push(`CREATE TABLE public.runbooks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL,
  approval_status TEXT NOT NULL,
  last_reviewed_date TIMESTAMPTZ,
  owner TEXT NOT NULL,
  matched_incident_types JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // LIVE EVENTS TABLE
  parts.push(`CREATE TABLE public.live_events (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  incident_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);\n`);

  // 3. ROW LEVEL SECURITY (RLS) POLICIES
  parts.push(`-- 3. ENABLE RLS & CREATE POLICIES (Allowing Authenticated & Anon Access for App Operation)`);
  const tableNames = [
    'users', 'incidents', 'alerts', 'evidence', 'tasks', 'approvals',
    'diagnostics', 'timeline', 'audit_logs', 'integrations', 'simulations',
    'runbooks', 'live_events'
  ];

  for (const tbl of tableNames) {
    parts.push(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY;`);
    parts.push(`CREATE POLICY "Allow public anon and authenticated full access on ${tbl}" ON public.${tbl} FOR ALL USING (true) WITH CHECK (true);\n`);
  }

  // 4. SEED DATA INSERTS
  parts.push(`-- ==============================================================================`);
  parts.push(`-- 4. INSERT INITIAL SEED DATA`);
  parts.push(`-- ==============================================================================\n`);

  // USERS
  parts.push(`-- Users Seed`);
  for (const u of INITIAL_USERS) {
    parts.push(`INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES (${escapeSqlString(u.id)}, ${escapeSqlString(u.name)}, ${escapeSqlString(u.email)}, ${escapeSqlString(u.avatar)}, ${escapeSqlString(u.role)}, ${escapeSqlString(u.title)}, ${escapeSqlString(u.department)}, ${escapeSqlString(u.status)}, ${escapeSqlString(u.lastLogin)}, ${escapeJson(u.permissions)}, ${escapeSqlString(u.passwordHash || 'pbkdf2_sha256$260000$mock_salt$mock_hash')})
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;\n`);
  }

  // INCIDENTS
  parts.push(`-- Incidents Seed`);
  for (const inc of INITIAL_INCIDENTS) {
    parts.push(`INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES (${escapeSqlString(inc.id)}, ${escapeSqlString(inc.title)}, ${escapeSqlString(inc.description)}, ${escapeSqlString(inc.severity)}, ${escapeSqlString(inc.status)}, ${escapeSqlString(inc.incidentCommander)}, ${escapeSqlString(inc.assignedResponder)}, ${escapeSqlString(inc.createdTime)}, ${escapeSqlString(inc.updatedTime)}, ${escapeSqlString(inc.resolvedTime)}, ${escapeSqlString(inc.affectedService)}, ${escapeJson(inc.affectedSystems)}, ${escapeJson(inc.tags)}, ${inc.mttaMinutes || 0}, ${inc.mttrMinutes || 'NULL'}, ${escapeJson(inc.relatedAlertIds)}, ${escapeJson(inc.aiSummary)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // ALERTS
  parts.push(`-- Alerts Seed`);
  for (const a of INITIAL_ALERTS) {
    parts.push(`INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES (${escapeSqlString(a.id)}, ${escapeSqlString(a.title)}, ${escapeSqlString(a.source)}, ${escapeSqlString(a.timestamp)}, ${escapeSqlString(a.severity)}, ${escapeSqlString(a.status)}, ${escapeSqlString(a.affectedService)}, ${escapeSqlString(a.detectionType)}, ${escapeSqlString(a.assignedResponder)}, ${escapeSqlString(a.relatedIncidentId)}, ${escapeJson(a.rawPayload)}, ${escapeJson(a.history)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // EVIDENCE
  parts.push(`-- Evidence Seed`);
  for (const e of INITIAL_EVIDENCE) {
    parts.push(`INSERT INTO public.evidence (id, incident_id, title, type, description, content, source, collected_by, collection_timestamp, hash, hash_verified, chain_of_custody, redacted, file_size)
VALUES (${escapeSqlString(e.id)}, ${escapeSqlString(e.incidentId)}, ${escapeSqlString(e.title)}, ${escapeSqlString(e.type)}, ${escapeSqlString(e.description)}, ${escapeSqlString(e.content)}, ${escapeSqlString(e.source)}, ${escapeSqlString(e.collectedBy)}, ${escapeSqlString(e.collectionTimestamp)}, ${escapeSqlString(e.hash)}, ${e.hashVerified ? 'true' : 'false'}, ${escapeJson(e.chainOfCustody)}, ${e.redacted ? 'true' : 'false'}, ${escapeSqlString(e.fileSize)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // TASKS
  parts.push(`-- Tasks Seed`);
  for (const t of INITIAL_TASKS) {
    parts.push(`INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES (${escapeSqlString(t.id)}, ${escapeSqlString(t.incidentId)}, ${escapeSqlString(t.title)}, ${escapeSqlString(t.description)}, ${escapeSqlString(t.assignedTo)}, ${escapeSqlString(t.assignedToAvatar)}, ${escapeSqlString(t.priority)}, ${escapeSqlString(t.status)}, ${escapeSqlString(t.dueTime)}, ${escapeSqlString(t.createdTime)}, ${escapeSqlString(t.completionTime)}, ${t.approvalRequired ? 'true' : 'false'}, ${escapeSqlString(t.approvalRequestId)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // APPROVALS
  parts.push(`-- Approvals Seed`);
  for (const apr of INITIAL_APPROVALS) {
    parts.push(`INSERT INTO public.approvals (id, incident_id, incident_title, action_title, requested_action, requested_by, ai_recommendation_source, risk_level, reason, required_permission, created_time, expiration_time, status, reviewed_by, review_timestamp, review_comment)
VALUES (${escapeSqlString(apr.id)}, ${escapeSqlString(apr.incidentId)}, ${escapeSqlString(apr.incidentTitle)}, ${escapeSqlString(apr.actionTitle)}, ${escapeSqlString(apr.requestedAction)}, ${escapeSqlString(apr.requestedBy)}, ${escapeSqlString(apr.aiRecommendationSource)}, ${escapeSqlString(apr.riskLevel)}, ${escapeSqlString(apr.reason)}, ${escapeSqlString(apr.requiredPermission)}, ${escapeSqlString(apr.createdTime)}, ${escapeSqlString(apr.expirationTime)}, ${escapeSqlString(apr.status)}, ${escapeSqlString(apr.reviewedBy)}, ${escapeSqlString(apr.reviewTimestamp)}, ${escapeSqlString(apr.reviewComment)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // DIAGNOSTICS
  parts.push(`-- Diagnostics Seed`);
  for (const d of INITIAL_DIAGNOSTICS) {
    parts.push(`INSERT INTO public.diagnostics (id, incident_id, action_name, description, why_recommended, expected_information_gain, risk_level, required_permission, approval_required, status, execution_result, created_at)
VALUES (${escapeSqlString(d.id)}, ${escapeSqlString(d.incidentId)}, ${escapeSqlString(d.actionName)}, ${escapeSqlString(d.description)}, ${escapeSqlString(d.whyRecommended)}, ${escapeSqlString(d.expectedInformationGain)}, ${escapeSqlString(d.riskLevel)}, ${escapeSqlString(d.requiredPermission)}, ${d.approvalRequired ? 'true' : 'false'}, ${escapeSqlString(d.status)}, ${escapeSqlString(d.executionResult)}, ${escapeSqlString(d.createdAt)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // TIMELINE
  parts.push(`-- Timeline Seed`);
  for (const tm of INITIAL_TIMELINE) {
    parts.push(`INSERT INTO public.timeline (id, timestamp, type, title, description, actor, metadata)
VALUES (${escapeSqlString(tm.id)}, ${escapeSqlString(tm.timestamp)}, ${escapeSqlString(tm.type)}, ${escapeSqlString(tm.title)}, ${escapeSqlString(tm.description)}, ${escapeSqlString(tm.actor)}, ${escapeJson(tm.metadata)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // AUDIT LOGS
  parts.push(`-- Audit Logs Seed`);
  for (const al of INITIAL_AUDIT_LOGS) {
    parts.push(`INSERT INTO public.audit_logs (id, timestamp, user_name, role, action, resource, incident_id, ip_address, user_agent, result, previous_state_hash, current_state_hash, details)
VALUES (${escapeSqlString(al.id)}, ${escapeSqlString(al.timestamp)}, ${escapeSqlString(al.user)}, ${escapeSqlString(al.role)}, ${escapeSqlString(al.action)}, ${escapeSqlString(al.resource)}, ${escapeSqlString(al.incidentId)}, ${escapeSqlString(al.ipAddress)}, ${escapeSqlString(al.userAgent)}, ${escapeSqlString(al.result)}, ${escapeSqlString(al.previousStateHash)}, ${escapeSqlString(al.currentStateHash)}, ${escapeSqlString(al.details)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // INTEGRATIONS
  parts.push(`-- Integrations Seed`);
  for (const ig of INITIAL_INTEGRATIONS) {
    parts.push(`INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES (${escapeSqlString(ig.id)}, ${escapeSqlString(ig.name)}, ${escapeSqlString(ig.type)}, ${escapeSqlString(ig.status)}, ${escapeSqlString(ig.lastEventTime)}, ${ig.eventsReceivedCount || 0}, ${escapeSqlString(ig.webhookUrl)}, ${escapeSqlString(ig.secretMasked)}, ${ig.enabled ? 'true' : 'false'}, ${escapeSqlString(ig.description)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // SIMULATIONS
  parts.push(`-- Simulations Seed`);
  for (const sim of INITIAL_SIMULATIONS) {
    parts.push(`INSERT INTO public.simulations (id, name, category, description, severity, symptoms, mock_alerts, steps, expected_diagnostics)
VALUES (${escapeSqlString(sim.id)}, ${escapeSqlString(sim.name)}, ${escapeSqlString(sim.category)}, ${escapeSqlString(sim.description)}, ${escapeSqlString(sim.severity)}, ${escapeJson(sim.symptoms)}, ${escapeJson(sim.mockAlerts)}, ${escapeJson(sim.steps)}, ${escapeJson(sim.expectedDiagnostics)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // RUNBOOKS
  parts.push(`-- Runbooks Seed`);
  for (const rb of INITIAL_APPROVED_RUNBOOKS) {
    parts.push(`INSERT INTO public.runbooks (id, name, category, version, approval_status, last_reviewed_date, owner, matched_incident_types, description, steps)
VALUES (${escapeSqlString(rb.id)}, ${escapeSqlString(rb.name)}, ${escapeSqlString(rb.category)}, ${escapeSqlString(rb.version)}, ${escapeSqlString(rb.approvalStatus)}, ${escapeSqlString(rb.lastReviewedDate)}, ${escapeSqlString(rb.owner)}, ${escapeJson(rb.matchedIncidentTypes)}, ${escapeSqlString(rb.description)}, ${escapeJson(rb.steps)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // LIVE EVENTS
  parts.push(`-- Live Events Seed`);
  for (const le of INITIAL_LIVE_EVENTS) {
    parts.push(`INSERT INTO public.live_events (id, timestamp, category, severity, title, description, source, incident_id)
VALUES (${escapeSqlString(le.id)}, ${escapeSqlString(le.timestamp)}, ${escapeSqlString(le.category)}, ${escapeSqlString(le.severity)}, ${escapeSqlString(le.title)}, ${escapeSqlString(le.description)}, ${escapeSqlString(le.source)}, ${escapeSqlString(le.incidentId)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  parts.push(`-- ==============================================================================`);
  parts.push(`-- SETUP COMPLETE! All 13 tables created, RLS enabled, and seed data inserted.`);
  parts.push(`-- ==============================================================================\n`);

  return parts.join('\n');
}

const sql = buildSql();
fs.writeFileSync('supabase_complete_setup.sql', sql, 'utf-8');
console.log('Successfully generated supabase_complete_setup.sql with all tables, RLS policies, and seed data!');
