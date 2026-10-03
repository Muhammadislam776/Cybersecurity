import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Terminal, 
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export const DedicatedCopilot: React.FC = () => {
  const { 
    incidents, 
    diagnostics, 
    approvedRunbooks, 
    navigateToIncident, 
    submitApprovalRequest, 
    executeDiagnosticRecommendation,
    currentUser 
  } = useApp();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || 'INC-2026-0891');
  const [messages, setMessages] = useState<{ sender: 'user' | 'copilot'; text: string; time: string }[]>([
    {
      sender: 'copilot',
      text: 'CyberOps AI Incident Copilot initialized. I observe telemetry, analyze evidence, retrieve approved runbooks, and formulate safe diagnostic recommendations. I operate under strict Human-in-the-Loop constraints and cannot execute state-changing commands without authorization.',
      time: '15:00 UTC'
    },
    {
      sender: 'user',
      text: 'Provide a synthesis of current critical incidents and recommend next safe steps.',
      time: '15:01 UTC'
    },
    {
      sender: 'copilot',
      text: 'Analysis: Incident INC-2026-0891 (Payment API 504 Storm) and INC-2026-0892 (Okta Credential Stuffing) are the two critical active events. Recommend running read-only diagnostic DIA-101 on Envoy socket saturation and requesting human approval to engage WAF rate limiting.',
      time: '15:01 UTC'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const activeIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const incidentDiagnostics = diagnostics.filter(d => d.incidentId === activeIncident.id);
  const matchedRunbooks = approvedRunbooks.filter(r => 
    r.matchedIncidentTypes.some(tag => activeIncident.tags.includes(tag) || activeIncident.affectedService.toLowerCase().includes(tag.toLowerCase()))
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC';

    const newMsgs = [...messages, { sender: 'user' as const, text: query, time: now }];
    setMessages(newMsgs);
    setInputVal('');

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('runbook')) {
        reply = `Retrieved approved runbooks for ${activeIncident.id}: ${matchedRunbooks.map(r => r.name).join(', ')}. Under Strict Safety Rules, no unapproved procedures are ever suggested.`;
      } else if (q.includes('summary') || q.includes('status')) {
        reply = `Status for ${activeIncident.id} (${activeIncident.title}): Severity is ${activeIncident.severity}, status is ${activeIncident.status}. Commander: ${activeIncident.incidentCommander}. Impact: ${activeIncident.aiSummary?.currentImpact || 'Active telemetry evaluation'}.`;
      } else if (q.includes('diagnos') || q.includes('action')) {
        reply = `Suggested diagnostic: Inspect Envoy proxy upstream sockets and error distribution. Risk level: Low. If state changes are needed, a formal Human Approval request will be submitted.`;
      } else {
        reply = `Copilot Synthesis for ${activeIncident.affectedService}: Telemetry correlates with active anomaly signatures. AI recommendations have been updated. Remember: AI Observe & Recommend Only.`;
      }

      setMessages(prev => [...prev, { sender: 'copilot', text: reply, time: now }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* AI Threat Copilot Visual Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-blue-900/50 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/ai_threat_copilot.jpg" 
            alt="AI Threat Copilot & Containment Intelligence" 
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>AI Incident Copilot & Neural Threat Assistant</span>
                  <SecurityBadge type="ai_generated" size="sm" />
                </h2>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Autonomous Triage Synthesis &bull; Strict Human-in-the-Loop Approval &bull; Zero Unauthorized Executions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SecurityBadge type="human_approval_required" size="sm" />
              <SecurityBadge type="audit_logged" size="sm" />
            </div>
          </div>

          {/* Strict Safety Rules Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-blue-500/30 text-xs hover:border-blue-400 transition-colors">
              <div className="flex items-center gap-1.5 font-bold text-blue-400 uppercase text-[11px] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                1. Observe (AI)
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">Ingests real-time logs, telemetry packets, and alerts without touching system state.</p>
            </div>

            <div className="p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-indigo-500/30 text-xs hover:border-indigo-400 transition-colors">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300 uppercase text-[11px] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                2. Recommend (AI)
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">Synthesizes diagnostic commands and matches pre-verified runbook workflows.</p>
            </div>

            <div className="p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-amber-500/30 text-xs hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase text-[11px] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                3. Approve (Human)
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">Certified Incident Commander reviews blast-radius and signs off cryptographically.</p>
            </div>

            <div className="p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-emerald-500/30 text-xs hover:border-emerald-400 transition-colors">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 uppercase text-[11px] mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                4. Execute (Audited)
              </div>
              <p className="text-slate-300 text-[11px] leading-snug">Sandboxed command runs with full output captured in immutable tamper-proof ledger.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Copilot Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Chat Stream */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Incident Selector */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-slate-500 uppercase font-semibold text-[11px]">Target Incident:</span>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-800"
              >
                {incidents.map(i => (
                  <option key={i.id} value={i.id}>{i.id}: {i.title.substring(0, 36)}...</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => navigateToIncident(activeIncident.id, 'overview')}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Incident Details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'copilot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-3.5 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75">
                    <span className="font-bold uppercase tracking-wider">{m.sender === 'user' ? currentUser.name : 'SecOps Copilot'}</span>
                    <span className="font-mono">{m.time}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask Copilot: 'What is the blast radius?', 'Retrieve runbooks', 'Suggest safe diagnostics'..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Prompt Copilot</span>
            </button>
          </form>
        </div>

        {/* Right Column: AI Operational Diagnostics & Approved Runbooks */}
        <div className="space-y-5">
          {/* Matched Approved Runbooks */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Approved Runbook Library</span>
              </h3>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only pre-approved, audited procedures are accessible by Copilot.
            </p>

            <div className="space-y-2.5">
              {matchedRunbooks.map((rbk) => (
                <div key={rbk.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rbk.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">{rbk.version}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{rbk.description}</p>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Owner: {rbk.owner} • Reviewed: {rbk.lastReviewedDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommended Diagnostic Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>Safe Diagnostic Actions</span>
            </h3>

            <div className="space-y-3">
              {incidentDiagnostics.map((diag) => (
                <div key={diag.id} className="p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{diag.actionName}</span>
                    <Badge variant="risk" risk={diag.riskLevel} size="sm">{diag.riskLevel} Risk</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600">{diag.description}</p>
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
                    <strong>Why:</strong> {diag.whyRecommended}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      {diag.approvalRequired ? 'Approval Required' : 'Safe Read-Only'}
                    </span>
                    <button
                      onClick={() => executeDiagnosticRecommendation(diag.id)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
                    >
                      {diag.approvalRequired ? 'Request Approval' : 'Execute Diagnostic'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
