# CyberOps IR — AI-Powered Cybersecurity Incident Management Portal

An enterprise-grade, modern **Incident Response & Alert Management Dashboard** built for security operations (SOC), CSIRT, and platform reliability engineering teams.

---

## 🛡️ Core Highlights & Architecture

### 1. Strict AI Safety Model (Human-in-the-Loop)
* **Observe (AI)**: Reads alerts, queries logs, maps topologies, and aggregates telemetry.
* **Recommend (AI)**: Formulates safe diagnostic recommendations and retrieves strictly approved runbooks.
* **Approve (Human)**: Prohibits autonomous infrastructure changes, credential changes, or destructive actions. Requires explicit human Incident Commander sign-off.
* **Execute (Simulated/Controlled)**: Executed safely within simulated guardrails with mandatory recording into the append-only audit ledger.
* **Visible Transparency Badges**:
  * `AI Generated — Verify Before Acting`
  * `Human Approval Required`
  * `Simulation Only — No Production Changes`

### 2. Automated Zero-Exposure Secret Redaction Engine
* Intercepts sensitive tokens in evidence, logs, and telemetry payloads:
  * API Keys (`sk_live_...`, `ghp_...`, `AKIA...`)
  * JWT Bearer tokens (`eyJ...`)
  * Passwords & connection credentials (`postgres://user:password@...`)
  * Cryptographic Private Keys (`-----BEGIN RSA PRIVATE KEY-----`)
* Renders masked tokens: `sk_live_************` with an amber **Sensitive data redacted** indicator and safe metadata inspector.

### 3. Cryptographically Chained Append-Only Audit Logs
* Sequential SHA-256 state hashing with genesis tracking.
* Every operation generates a tamper-evident audit record: Login, Incident Declaration, Evidence Upload, AI Synthesis, Approval Request, Sign-off, and Diagnostic Execution.
* Prohibits edit and delete operations.

### 4. Interactive Simulation Center
* 4 realistic cybersecurity threat scenarios:
  1. **Distributed API Outage & Latency Spike** (Envoy 504 Gateway Timeouts)
  2. **PostgreSQL Database Connection Pool Exhaustion** (Lock Contention)
  3. **High-Volume Credential Stuffing & Botnet Attack** (Okta & WAF)
  4. **Host C2 Beaconing & Unauthorized Tunnel** (CrowdStrike / LiME Memory Dump)
* Banner: **SIMULATION MODE — NO REAL SYSTEM CHANGES**.

### 5. Multi-Persona Role-Based Access Control (RBAC)
* 6 distinct operational roles:
  * **Admin**: Full system governance.
  * **Incident Commander**: Incident lifecycle, task assignment, and approval sign-off.
  * **Security Analyst**: Alert investigation, evidence collection, and runbook consultation.
  * **Responder**: Performs assigned diagnostic steps and updates task checklists.
  * **Auditor**: Read-only compliance access to incidents and immutable audit ledgers.
  * **Viewer**: Limited dashboard visibility.
* 11 granular permission groups and a **Live Persona Switcher** in the top navigation.

### 6. Incident Details (9 Deep Sub-Tabs)
* **Overview**: Executive blast radius, SLA timer, and AI synthesis.
* **Timeline**: Chronological events and human annotations.
* **Alerts**: Correlated telemetry from WAF, SIEM, APM with raw payload inspect.
* **Evidence**: Forensic repository with SHA-256 integrity seal and chain of custody.
* **Tasks**: Response checklists with priority (P1–P4) and state transitions.
* **AI Copilot**: Interactive security intelligence console and diagnostic recommendations.
* **Runbooks**: Verified SOPs with version control and step checklists.
* **Approvals**: Dedicated sign-off queue with risk ratings and audit notice.
* **Audit**: Incident-filtered tamper-evident audit trail.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node v22)
* npm v10+

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Keyboard Shortcuts
* `Ctrl+K` or `Cmd+K`: Open Global Omnibox Search across incidents, alerts, evidence, runbooks, and tasks.
* `Esc`: Close open modal or search drawer.

---

## 🎨 Enterprise Design System
* **Background**: `#F8FAFC`
* **Cards**: `#FFFFFF`
* **Primary Blue**: `#2563EB`
* **Dark Blue**: `#1E3A8A`
* **Accent Orange**: `#F97316`
* **Text**: `#0F172A`
* **Secondary Text**: `#64748B`
* **Borders**: `#E2E8F0`
