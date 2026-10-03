import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  ShieldAlert, 
  Send, 
  X, 
  Copy, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Incident } from '../../types';

interface AnalystAiTriageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIncident?: Incident | null;
}

export const AnalystAiTriageDrawer: React.FC<AnalystAiTriageDrawerProps> = ({
  isOpen,
  onClose,
  selectedIncident,
}) => {
  const { incidents, submitApprovalRequest, addToast } = useApp();
  const [activeIncidentId, setActiveIncidentId] = useState<string>(
    selectedIncident?.id || incidents[0]?.id || 'INC-2026-0891'
  );
  const [promptInput, setPromptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    threatActorTTP: string;
    iocs: string[];
    safeDiagnostics: { title: string; cmd: string; risk: 'Low' | 'Medium' }[];
  } | null>(null);

  if (!isOpen) return null;

  const currentIncident = incidents.find(i => i.id === activeIncidentId) || selectedIncident || incidents[0];

  const presetQueries = [
    'Correlate auth failures with recent API error spikes',
    'Recommend safe read-only diagnostics for container compromise',
    'Draft IOC containment signature for Cloudflare WAF',
    'Assess data exfiltration risk based on egress bytes'
  ];

  const handleRunAnalysis = (query: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        summary: `Analysis of ${currentIncident.id} (${currentIncident.title}): Detected anomalous pattern consistent with distributed credential stuffing and unauthorized API token minting. 3 related alerts detected within 8 minutes.`,
        threatActorTTP: 'MITRE ATT&CK T1078 (Valid Accounts) followed by T1190 (Exploit Public-Facing Application) against payment gateway auth-tokens.',
        iocs: [
          '198.51.100.24 (Tor Exit Node)',
          'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          'Domain: c2-sync.crypto-telemetry-cdn.net'
        ],
        safeDiagnostics: [
          {
            title: 'Audit Active TCP Sockets',
            cmd: 'ss -tulpn | grep -E "(:80|:443|:8080)"',
            risk: 'Low'
          },
          {
            title: 'Dump In-Memory JWT Session Cache (Read-Only)',
            cmd: 'redis-cli -h cache.internal.prod --raw scan 0 match "sess:jwt:*" count 50',
            risk: 'Low'
          },
          {
            title: 'Inspect Container File Changes',
            cmd: 'docker diff k8s_payment-api_pod-99',
            risk: 'Medium'
          }
        ]
      });
    }, 900);
  };

  const handleQueueDiagnostic = (diag: { title: string; cmd: string; risk: 'Low' | 'Medium' }) => {
    submitApprovalRequest({
      incidentId: currentIncident.id,
      incidentTitle: currentIncident.title,
      actionTitle: diag.title,
      requestedAction: diag.cmd,
      requestedBy: 'Security Analyst AI Copilot',
      aiRecommendationSource: 'Analyst SOC Copilot Triage',
      riskLevel: diag.risk === 'Medium' ? 'Medium' : 'Low',
      reason: `Automated diagnostic for ${currentIncident.id} to verify active socket anomalies and session integrity.`,
      requiredPermission: 'request_approval'
    });
    addToast('success', 'Diagnostic Queued', `Submitted "${diag.title}" for Commander approval.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2">
                <span>AI Threat Investigation Copilot</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-900 text-blue-300 rounded border border-blue-700">
                  READ-ONLY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Autonomous correlation & safe diagnostic guidance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail Disclaimer */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Strict Guardrail: AI provides diagnostic recommendations only. Action requires Commander sign-off.</span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Target Incident Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              TARGET INCIDENT CONTEXT
            </label>
            <select
              value={activeIncidentId}
              onChange={(e) => setActiveIncidentId(e.target.value)}
              className="w-full text-xs font-mono font-medium p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  [{inc.id}] {inc.title} ({inc.severity})
                </option>
              ))}
            </select>
          </div>

          {/* AI Threat Neural Copilot Visual Card */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
            <div className="relative aspect-[21/9] overflow-hidden">
              <img
                src="/images/ai_threat_copilot.jpg"
                alt="AI Cyber Sentinel Neural Analysis"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-purple-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-purple-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span>NEURAL THREAT CORRELATION ACTIVE</span>
              </div>
              <div className="absolute bottom-2 left-2.5 right-2.5 text-[10px] font-mono text-cyan-300">
                <span>MODEL: CYBER_SENTINEL v4.1 // ZERO INFRASTRUCTURE MUTATION</span>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              ANALYST TRIAGE PRESETS
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {presetQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(query);
                    handleRunAnalysis(query);
                  }}
                  className="text-left p-2.5 rounded-lg text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all font-mono flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{query}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Analysis in Progress */}
          {isAnalyzing && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="relative flex justify-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xs font-mono text-slate-600">Correlating sensor logs, telemetry, and IOCs...</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI THREAT HYPOTHESIS & CORRELATION
                  </span>
                  <span>CONFIDENCE: 96.8%</span>
                </div>

                <p className="leading-relaxed text-slate-300">
                  {analysisResult.summary}
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-1">IDENTIFIED TTP:</span>
                  <span className="text-amber-300 text-[11px]">{analysisResult.threatActorTTP}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-1">EXTRACTED INDICATORS:</span>
                  <div className="space-y-1">
                    {analysisResult.iocs.map((ioc, idx) => (
                      <div key={idx} className="bg-slate-950 px-2 py-1 rounded text-red-300 text-[11px] flex items-center justify-between">
                        <span>{ioc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Safe Diagnostics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-700 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                    SAFE READ-ONLY DIAGNOSTIC COMMANDS
                  </span>
                </div>

                <div className="space-y-2">
                  {analysisResult.safeDiagnostics.map((diag, dIdx) => (
                    <div key={dIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{diag.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {diag.risk} Risk
                        </span>
                      </div>
                      <div className="bg-slate-900 text-emerald-300 p-2 rounded text-[11px] font-mono break-all">
                        {diag.cmd}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleQueueDiagnostic(diag)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
                        >
                          Request Commander Approval
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Prompt Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (promptInput.trim()) handleRunAnalysis(promptInput);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI Copilot for specific telemetry correlation..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !promptInput.trim()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
