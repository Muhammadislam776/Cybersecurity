import React, { useState } from 'react';
import { 
  Webhook, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Lock, 
  ShieldCheck, 
  ExternalLink,
  Sliders,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { Modal } from '../common/Modal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { SeverityLevel } from '../../types';

export const IntegrationsView: React.FC = () => {
  const { integrations, toggleIntegration, sendMockWebhookEvent, checkPermission } = useApp();

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'critical' | 'auth' | 'outage' | 'db' | 'suspicious'>('critical');
  const [createIncidentCheck, setCreateIncidentCheck] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canManageIntegrations = checkPermission('manage_integrations');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendTestWebhook = (e: React.FormEvent) => {
    e.preventDefault();

    const scenarioConfigs = {
      critical: {
        title: 'High Ingress WAF Rule Matches for SQL Injection Payload',
        source: 'Cloudflare WAF Ingest',
        severity: 'Critical' as SeverityLevel
      },
      auth: {
        title: 'Coordinated Brute Force Surge on SSO Endpoint',
        source: 'Okta Identity SIEM',
        severity: 'High' as SeverityLevel
      },
      outage: {
        title: '504 Gateway Timeout Rate Exceeded 40%',
        source: 'Datadog APM Ingest',
        severity: 'Critical' as SeverityLevel
      },
      db: {
        title: 'PostgreSQL Active Connections Reached 98% Cap',
        source: 'AWS RDS CloudWatch',
        severity: 'High' as SeverityLevel
      },
      suspicious: {
        title: 'Unusual Outbound SSH Beaconing to Known Adversary IP',
        source: 'CrowdStrike Falcon Sensor',
        severity: 'Critical' as SeverityLevel
      }
    };

    const config = scenarioConfigs[selectedScenario];
    sendMockWebhookEvent({
      title: config.title,
      source: config.source,
      severity: config.severity,
      createIncident: createIncidentCheck
    });

    setTestModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Cloud & Telemetry Ingestion Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/datacenter_cloud_matrix.jpg" 
            alt="Hyperscale Cloud & Microservices Telemetry Matrix" 
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                INGESTION MATRIX ACTIVE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                {integrations.length} SECURE CONNECTORS LINKED
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Webhook Ingestion & Cloud Connectors
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bi-directional, zero-exposure telemetry pipeline streaming security events, metrics, and incident alerts from AWS, Datadog, Slack, PagerDuty, and custom SIEM webhooks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                TLS 1.3 Encrypted Ingest
              </span>
              <span>&bull;</span>
              <span>Payload Signature Verified</span>
              <span>&bull;</span>
              <span>Real-Time Normalization</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <button
              onClick={() => setTestModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Webhook Event</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <SecurityBadge type="rbac_enforced" size="sm" />
              <SecurityBadge type="secret_redacted" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{item.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    item.status === 'Connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.status === 'Degraded' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              {/* Webhook Endpoint & Secret Status */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">Endpoint:</span>
                  <button
                    onClick={() => handleCopy(item.id, item.webhookUrl)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-700 truncate">{item.webhookUrl}</div>

                <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-sans">Signing Secret:</span>
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>{item.secretMasked}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats & Toggle */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-400 text-[11px]">
                <span>Ingested: <strong>{item.eventsReceivedCount.toLocaleString()}</strong> events</span>
              </div>

              {canManageIntegrations ? (
                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    item.enabled
                      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {item.enabled ? 'Disable' : 'Enable'}
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Admin Config Only</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Send Test Event Modal */}
      <Modal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        title="Mock Webhook Event Generator"
        subtitle="Simulate inbound external telemetry from monitoring or SIEM"
        maxWidth="lg"
      >
        <form onSubmit={handleSendTestWebhook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Incident Simulation Scenario
            </label>
            <div className="space-y-2">
              {[
                { key: 'critical', title: 'Critical Alert: Ingress SQL Injection Attack (WAF)', desc: 'High severity payload trigger from edge proxy' },
                { key: 'auth', title: 'Authentication Alert: Distributed Brute Force (Okta)', desc: 'Spike in authentication failure rate across 400+ proxies' },
                { key: 'outage', title: 'Service Outage: Gateway 504 Timeout Storm (APM)', desc: 'Envoy proxy reports upstream latency failure' },
                { key: 'db', title: 'Database Failure: Connection Pool Saturation (RDS)', desc: 'PostgreSQL connections reach 98% capacity limit' },
                { key: 'suspicious', title: 'Suspicious Activity: Outbound C2 SSH Tunnel (Falcon)', desc: 'Endpoint detection triggers on rogue binary' },
              ].map((scen) => (
                <label
                  key={scen.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedScenario === scen.key ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    checked={selectedScenario === scen.key}
                    onChange={() => setSelectedScenario(scen.key as any)}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{scen.title}</span>
                    <span className="text-[11px] text-slate-500">{scen.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={createIncidentCheck}
                onChange={(e) => setCreateIncidentCheck(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Automatically escalate payload into a tracked Incident ticket
              </span>
            </label>
            <p className="text-[11px] text-slate-500 ml-5 mt-0.5">
              If checked, an incident ticket with AI synthesis and diagnostic queue will be declared immediately.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTestModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Webhook Ingestion</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
